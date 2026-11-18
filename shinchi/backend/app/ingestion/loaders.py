"""Read PDF / DOCX / TXT / MD / HTML into structured blocks. Raises IngestError with friendly messages."""
from __future__ import annotations

import io
import re
import zipfile
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path

ALLOWED_EXT = {".pdf", ".docx", ".txt", ".md", ".markdown", ".html", ".htm"}
STARTER_NOTE = re.compile(r"^\s*>\s*Starter notes drafted by an AI", re.I)

INJECTION = re.compile(
    r"(ignore|disregard|forget|override)\s+(?:(?:all|any|the|your|previous|prior|above|earlier)\s+){1,4}"
    r"(instructions?|prompts?|rules?|guidelines?)"
    r"|\byou\s+are\s+now\b|\bnew\s+instructions?\s*:|\bsystem\s+prompt\b"
    r"|\breveal\s+(?:your|the)\s+(?:prompt|instructions|api\s*key|key)"
    r"|\bdo\s+not\s+(?:tell|inform)\s+the\s+user\b",
    re.I,
)


class IngestError(Exception):
    pass


@dataclass
class Block:
    path: list[str]
    text: str
    page: int | None = None
    h1: bool = False


@dataclass
class ParsedDoc:
    title: str
    meta: dict
    blocks: list[Block]
    warnings: list[str] = field(default_factory=list)
    pages: int | None = None


def neutralize(text: str) -> tuple[str, int]:
    """Replace instruction-like lines (prompt-injection attempts) so documents stay pure reference data."""
    n = 0
    out = []
    for line in text.split("\n"):
        if INJECTION.search(line):
            out.append("[instruction-like text removed]")
            n += 1
        else:
            out.append(line)
    return "\n".join(out), n


def validate_bytes(ext: str, data: bytes) -> None:
    if ext not in ALLOWED_EXT:
        raise IngestError(f"Unsupported file type '{ext}'. Allowed: {', '.join(sorted(ALLOWED_EXT))}.")
    if not data:
        raise IngestError("The file is empty.")
    if ext == ".pdf":
        if not data[:1024].lstrip().startswith(b"%PDF"):
            raise IngestError("This file is named .pdf but is not a valid PDF (no %PDF header). It may be corrupted or renamed.")
    elif ext == ".docx":
        try:
            ok = zipfile.is_zipfile(io.BytesIO(data)) and "word/document.xml" in zipfile.ZipFile(io.BytesIO(data)).namelist()
        except Exception:
            ok = False
        if not ok:
            raise IngestError("This file is named .docx but is not a valid Word document. It may be corrupted or renamed.")
    else:
        if b"\x00" in data[:4096]:
            raise IngestError(f"This file is named {ext} but looks binary, not text. It may be corrupted or renamed.")


def _decode(data: bytes, warnings: list[str]) -> str:
    for enc in ("utf-8-sig", "utf-16"):
        try:
            return data.decode(enc)
        except UnicodeError:
            continue
    warnings.append("File is not valid UTF-8; decoded as Windows-1252, some characters may be wrong.")
    return data.decode("cp1252", errors="replace")


_FM = re.compile(r"\A﻿?---\s*\n(.*?)\n---\s*\n", re.S)


def split_front_matter(text: str) -> tuple[dict, str]:
    m = _FM.match(text)
    if not m:
        return {}, text
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip().lower()] = re.sub(r"\s+#\s.*$", "", v).strip()
    return meta, text[m.end():]


def clean_text(t: str, pdf: bool = False) -> str:
    t = t.replace("\x00", "").replace("\r\n", "\n").replace("\r", "\n")
    if pdf:
        t = re.sub(r"(\w)-\n(\w)", r"\1\2", t)
        t = re.sub(r"(?<![.:;!?\n])\n(?=[a-z(])", " ", t)
    t = re.sub(r"[ \t ]+", " ", t)
    t = re.sub(r" ?\n ?", "\n", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def parse_markdown(body: str) -> list[Block]:
    blocks: list[Block] = []
    stack: list[tuple[int, str]] = []
    cur: list[str] = []
    in_code = False

    def flush() -> None:
        text = "\n".join(cur).strip()
        if text:
            blocks.append(Block([h for _, h in stack], text, h1=bool(stack) and stack[0][0] == 1))
        cur.clear()

    for line in body.splitlines():
        if STARTER_NOTE.match(line):
            continue
        if line.strip().startswith("```"):
            in_code = not in_code
        m = None if in_code else re.match(r"^(#{1,6})\s+(.+?)\s*#*\s*$", line)
        if m:
            flush()
            level = len(m.group(1))
            while stack and stack[-1][0] >= level:
                stack.pop()
            stack.append((level, m.group(2).strip()))
        else:
            cur.append(line)
    flush()
    return blocks


class _HTMLToMD(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.out: list[str] = []
        self.skip = 0
        self.title = ""
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "nav", "footer", "noscript"):
            self.skip += 1
        elif tag == "title":
            self._in_title = True
        elif re.fullmatch(r"h[1-6]", tag):
            self.out.append("\n\n" + "#" * int(tag[1]) + " ")
        elif tag in ("p", "div", "section", "tr", "br", "ul", "ol", "table"):
            self.out.append("\n")
        elif tag == "li":
            self.out.append("\n- ")
        elif tag in ("td", "th"):
            self.out.append(" | ")

    def handle_endtag(self, tag):
        if tag in ("script", "style", "nav", "footer", "noscript"):
            self.skip = max(0, self.skip - 1)
        elif tag == "title":
            self._in_title = False
        elif re.fullmatch(r"h[1-6]", tag) or tag in ("p", "div", "section"):
            self.out.append("\n")

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        elif not self.skip:
            self.out.append(data)


def _pdf_blocks(data: bytes, title_fallback: str, warnings: list[str]) -> tuple[list[Block], str, int]:
    from pypdf import PdfReader
    from pypdf.errors import PdfReadError

    try:
        reader = PdfReader(io.BytesIO(data))
        if reader.is_encrypted:
            try:
                if not reader.decrypt(""):
                    raise IngestError("The PDF is password-protected. Remove the password and upload again.")
            except IngestError:
                raise
            except Exception:
                raise IngestError("The PDF is encrypted and could not be opened.")
        pages_text = []
        for i, page in enumerate(reader.pages, 1):
            try:
                pages_text.append((i, page.extract_text() or ""))
            except Exception:
                warnings.append(f"Page {i} could not be read and was skipped.")
                pages_text.append((i, ""))
        meta_title = ""
        try:
            meta_title = (reader.metadata.title or "").strip() if reader.metadata else ""
        except Exception:
            pass
    except IngestError:
        raise
    except (PdfReadError, ValueError, KeyError, OSError) as e:
        raise IngestError(f"The PDF could not be read (corrupted?): {e}")
    except Exception as e:  # noqa: BLE001
        raise IngestError(f"The PDF could not be read: {e}")

    n = len(pages_text)
    total = sum(len(t.strip()) for _, t in pages_text)
    if total < 40:
        raise IngestError("No extractable text found. This looks like a scanned PDF; OCR is not included. Export a text-based PDF or upload a DOCX/TXT.")
    if total < 100 * n * 0.2:
        warnings.append("Very little text per page; parts of this PDF may be scanned images that were not indexed.")
    # drop repeated headers/footers and bare page numbers
    if n >= 4:
        counts: dict[str, int] = {}
        for _, t in pages_text:
            for ln in {l.strip() for l in t.splitlines() if l.strip()}:
                counts[ln] = counts.get(ln, 0) + 1
        repeated = {ln for ln, c in counts.items() if c >= max(3, int(n * 0.5)) and len(ln) < 90}
    else:
        repeated = set()
    blocks = []
    for i, t in pages_text:
        lines = [l for l in t.splitlines() if l.strip() not in repeated and not re.fullmatch(r"\s*(page\s*)?\d{1,4}\s*(of\s*\d+)?\s*", l, re.I)]
        txt = clean_text("\n".join(lines), pdf=True)
        if txt:
            blocks.append(Block([], txt, page=i))
    return blocks, meta_title or title_fallback, n


def _docx_markdown(data: bytes) -> str:
    from docx import Document
    from docx.table import Table
    from docx.text.paragraph import Paragraph

    try:
        doc = Document(io.BytesIO(data))
    except Exception as e:  # noqa: BLE001
        raise IngestError(f"The Word document could not be read (corrupted?): {e}")
    lines = []
    for child in doc.element.body.iterchildren():
        tag = child.tag.rsplit("}", 1)[-1]
        if tag == "p":
            p = Paragraph(child, doc)
            txt = p.text.strip()
            if not txt:
                lines.append("")
                continue
            style = (p.style.name or "") if p.style is not None else ""
            m = re.match(r"Heading (\d)", style)
            if m:
                lines.append("\n" + "#" * min(6, int(m.group(1))) + " " + txt + "\n")
            elif style == "Title":
                lines.append("# " + txt + "\n")
            elif "List" in style:
                lines.append("- " + txt)
            else:
                lines.append(txt + "\n")
        elif tag == "tbl":
            t = Table(child, doc)
            for r in t.rows:
                lines.append("| " + " | ".join(c.text.strip().replace("\n", " ") for c in r.cells) + " |")
            lines.append("")
    return "\n".join(lines)


def load_file(path: Path, data: bytes | None = None) -> ParsedDoc:
    ext = path.suffix.lower()
    data = data if data is not None else path.read_bytes()
    validate_bytes(ext, data)
    warnings: list[str] = []
    stem_title = path.stem.replace("_", " ").replace("-", " ").strip().title()

    if ext == ".pdf":
        blocks, title, n = _pdf_blocks(data, stem_title, warnings)
        meta: dict = {}
        pages: int | None = n
    else:
        pages = None
        if ext == ".docx":
            text = _docx_markdown(data)
        elif ext in (".html", ".htm"):
            p = _HTMLToMD()
            p.feed(_decode(data, warnings))
            text = "".join(p.out)
            if p.title.strip():
                text = f"# {p.title.strip()}\n" + text
        else:
            text = _decode(data, warnings)
        meta, body = split_front_matter(text)
        body = clean_text(body)
        blocks = parse_markdown(body)
        title = meta.get("title") or ""
        if not title:
            h1 = re.search(r"^#\s+(.+)$", body, re.M)
            title = h1.group(1).strip() if h1 else stem_title
        if not blocks:
            raise IngestError("The file contains no readable text.")

    removed = 0
    for b in blocks:
        b.text, k = neutralize(b.text)
        removed += k
    if removed:
        warnings.append(f"{removed} instruction-like line(s) were removed from this document for safety.")
    return ParsedDoc(title=title, meta=meta, blocks=blocks, warnings=warnings, pages=pages)
