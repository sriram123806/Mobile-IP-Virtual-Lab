"""Heading-aware chunking. Every chunk carries its document title and heading path."""
from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass

from .loaders import ParsedDoc

VIVA_RX = re.compile(r"^Q\s*\d+\s*\[(easy|medium|hard)\]\s*(.+)$", re.I)


@dataclass
class Chunk:
    id: str
    text: str
    meta: dict


def _hard_split(s: str, n: int) -> list[str]:
    return [s[i : i + n] for i in range(0, len(s), n)]


def _split_long(p: str, n: int) -> list[str]:
    if len(p) <= n:
        return [p]
    units = p.split("\n") if "\n" in p else re.split(r"(?<=[.!?])\s+", p)
    out, cur = [], ""
    for u in units:
        if len(u) > n:
            if cur:
                out.append(cur)
                cur = ""
            out.extend(_hard_split(u, n))
            continue
        if cur and len(cur) + 1 + len(u) > n:
            out.append(cur)
            cur = u
        else:
            cur = f"{cur}\n{u}" if cur and "\n" in p else (f"{cur} {u}" if cur else u)
    if cur:
        out.append(cur)
    return out


def pack(text: str, max_chars: int, overlap: int) -> list[str]:
    paras = []
    for p in re.split(r"\n\s*\n", text):
        p = p.strip()
        if p:
            paras.extend(_split_long(p, max_chars))
    chunks, cur = [], ""
    for p in paras:
        if cur and len(cur) + 2 + len(p) > max_chars:
            chunks.append(cur)
            tail = cur[-overlap:] if overlap else ""
            m = re.search(r"(?<=[.!?])\s+(?=[A-Z0-9*])", tail)  # start the overlap at a sentence boundary
            tail = tail[m.end():] if m else ""
            cur = (tail + "\n\n" + p) if tail and not p.startswith(("|", "```")) else p
        else:
            cur = f"{cur}\n\n{p}" if cur else p
    if cur:
        chunks.append(cur)
    return chunks


def chunk_document(doc: ParsedDoc, source: str, category: str, max_chars: int = 1100, overlap: int = 150) -> list[Chunk]:
    doc_type = (doc.meta.get("type") or "notes").lower()
    status = (doc.meta.get("status") or "user").lower()
    if status not in {"starter", "user", "placeholder"}:
        status = "user"
    sid = hashlib.sha1(source.encode()).hexdigest()[:10]
    chunks: list[Chunk] = []

    def add(body: str, section: str, page, page_end, extra: dict | None = None) -> None:
        body = body.strip()
        if len(body) < 20:
            return
        ctx = f"[{doc.title}" + (f" > {section}" if section else "") + "]"
        meta = {
            "source": source, "title": doc.title, "section": section,
            "page": -1 if page is None else page, "page_end": -1 if page_end is None else page_end,
            "doc_type": doc_type, "doc_status": status, "category": category, "idx": len(chunks),
        }
        if extra:
            meta.update(extra)
        chunks.append(Chunk(f"{sid}-{len(chunks):04d}", f"{ctx}\n{body}", meta))

    units: list[dict] = []  # {label, text, page}
    for b in doc.blocks:
        path = list(b.path)
        if b.h1 and path:
            path = path[1:]
        elif path and path[0] == doc.title:
            path = path[1:]
        if doc_type == "viva" and path:
            m = VIVA_RX.match(path[-1])
            if m:
                body = b.text.strip()
                ans = re.sub(r"^\*\*Answer:?\*\*:?\s*", "", body).strip()
                add(f"Question: {m.group(2).strip()}\nModel answer: {ans}", " > ".join(path), None, None,
                    {"difficulty": m.group(1).lower(), "question": m.group(2).strip(), "answer": ans[:1500]})
                continue
        label = path[0] if path else ""
        text = b.text.strip()
        if len(path) > 1:
            text = "**" + " > ".join(path[1:]) + "**\n" + text
        if units and units[-1]["label"] == label and units[-1]["page"] == b.page:
            units[-1]["text"] += "\n\n" + text
        else:
            units.append({"label": label, "text": text, "page": b.page})
    if doc_type not in ("reference", "viva"):
        merged: list[dict] = []
        for u in units:
            if merged and len(u["text"]) < 300 and merged[-1]["page"] == u["page"] and len(merged[-1]["text"]) + len(u["text"]) < max_chars:
                merged[-1]["text"] += f"\n\n**{u['label']}**\n{u['text']}" if u["label"] else "\n\n" + u["text"]
            else:
                merged.append(u)
        units = merged
    for u in units:
        for piece in pack(u["text"], max_chars, overlap):
            add(piece, u["label"], u["page"], u["page"])
    return chunks
