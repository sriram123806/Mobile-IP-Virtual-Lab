"""Document indexing with job/progress tracking: validate -> extract -> clean -> chunk -> embed -> index."""
from __future__ import annotations

import hashlib
import re
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path

from .chunker import chunk_document
from .loaders import ALLOWED_EXT, IngestError, load_file, validate_bytes

IGNORED = {"readme.md"}
STAGES = ["validating", "extracting", "cleaning", "chunking", "embedding", "indexing", "done"]


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class Job:
    def __init__(self, kind: str, filename: str = ""):
        self.d = {"id": uuid.uuid4().hex[:8], "kind": kind, "filename": filename, "status": "queued", "stage": "validating",
                  "progress": 0.0, "message": "Queued", "chunks": None, "error": None, "warnings": [],
                  "started_at": now(), "finished_at": None}

    def update(self, **kw) -> None:
        self.d.update(kw)


class Indexer:
    def __init__(self, settings, store, embedder):
        self.s, self.store, self.embedder = settings, store, embedder
        self.jobs: dict[str, Job] = {}
        self.pool = ThreadPoolExecutor(max_workers=1, thread_name_prefix="shinchi-index")
        self.kb = Path(settings.kb_dir)
        self.kb.mkdir(parents=True, exist_ok=True)
        (self.kb / "my_documents").mkdir(exist_ok=True)

    # ------------------------------------------------------------ helpers
    def source_of(self, path: Path) -> str:
        return path.resolve().relative_to(self.kb.resolve()).as_posix()

    def scan(self) -> list[Path]:
        out = []
        for p in sorted(self.kb.rglob("*")):
            if not p.is_file() or p.suffix.lower() not in ALLOWED_EXT:
                continue
            if p.name.startswith((".", "_")) or p.name.lower() in IGNORED:
                continue
            out.append(p)
        return out

    def _register(self, job: Job | None) -> Job | None:
        if job:
            self.jobs[job.d["id"]] = job
            while len(self.jobs) > 50:
                self.jobs.pop(next(iter(self.jobs)))
        return job

    # ------------------------------------------------------------ one file
    def index_path(self, path: Path, job: Job | None = None, set_done: bool = True) -> dict:
        source = self.source_of(path)
        category = source.split("/")[0] if "/" in source else ""
        info = {"source": source, "title": path.stem, "status": "failed", "chunks": 0, "pages": None, "size_bytes": 0,
                "sha256": "", "updated_at": now(), "doc_type": "notes", "doc_status": "user", "category": category,
                "warnings": [], "error": None}

        def step(stage: str, msg: str, frac: float) -> None:
            if job:
                job.update(status="running", stage=stage, message=msg, progress=round(frac, 2))

        try:
            step("validating", "Checking file...", 0.05)
            data = path.read_bytes()
            info["size_bytes"] = len(data)
            info["sha256"] = hashlib.sha256(data).hexdigest()
            validate_bytes(path.suffix.lower(), data)
            step("extracting", "Extracting text...", 0.2)
            doc = load_file(path, data)
            step("cleaning", "Cleaning text...", 0.35)
            info.update(title=doc.title, pages=doc.pages, warnings=list(doc.warnings))
            step("chunking", "Splitting into chunks...", 0.45)
            chunks = chunk_document(doc, source, category, self.s.chunk_chars, self.s.chunk_overlap)
            if not chunks:
                info.update(status="empty", error="No usable text was found in this document.")
                self.store.delete_document(source)
            else:
                info.update(doc_type=chunks[0].meta["doc_type"], doc_status=chunks[0].meta["doc_status"])
                vectors: list = []
                for i in range(0, len(chunks), 32):
                    step("embedding", f"Embedding {len(chunks)} chunks ({min(i + 32, len(chunks))}/{len(chunks)})...",
                         0.5 + 0.4 * (i / len(chunks)))
                    vectors.extend(self.embedder.embed([c.text for c in chunks[i : i + 32]]))
                step("indexing", "Writing to the vector index...", 0.93)
                self.store.upsert_document(source, chunks, vectors)
                info.update(status="indexed", chunks=len(chunks))
        except IngestError as e:
            info["error"] = str(e)
            self.store.delete_document(source)
        except Exception as e:  # noqa: BLE001
            info["error"] = f"Unexpected error while indexing: {e}"
            self.store.delete_document(source)
        self.store.manifest["documents"][source] = info
        self.store.manifest["embedder"] = self.store.embedder_id
        self.store.save_manifest()
        if job and set_done:
            if info["status"] == "indexed":
                job.update(status="done", stage="done", progress=1.0, chunks=info["chunks"], warnings=info["warnings"],
                           message=f"Indexed {info['chunks']} chunks.", finished_at=now())
            else:
                job.update(status="failed", stage=job.d["stage"], error=info["error"], warnings=info["warnings"],
                           message="Failed", finished_at=now())
        return info

    # ------------------------------------------------------------ bulk
    def sync(self, job: Job | None = None, force: bool = False) -> dict:
        docs = self.store.manifest["documents"]
        files = {self.source_of(p): p for p in self.scan()}
        for gone in [s for s in docs if s not in files]:
            self.store.delete_document(gone)
            docs.pop(gone, None)
        todo = []
        for src, p in files.items():
            old = docs.get(src)
            sha = hashlib.sha256(p.read_bytes()).hexdigest()
            if force or not old or old.get("sha256") != sha:
                todo.append(p)
        done = failed = 0
        for n, p in enumerate(todo, 1):
            if job:
                job.update(status="running", stage="embedding", message=f"Indexing {p.name} ({n}/{len(todo)})", progress=n / (len(todo) + 1))
            info = self.index_path(p, None)
            done += info["status"] == "indexed"
            failed += info["status"] != "indexed"
        self.store.manifest["embedder"] = self.store.embedder_id
        self.store.save_manifest()
        res = {"indexed": done, "failed": failed, "unchanged": len(files) - len(todo)}
        if job:
            job.update(status="done", stage="done", progress=1.0, finished_at=now(), chunks=self.store.count(),
                       message=f"Indexed {done}, failed {failed}, unchanged {res['unchanged']}.")
        return res

    def rebuild(self, job: Job | None = None) -> dict:
        self.store.reset()
        return self.sync(job, force=True)

    # ------------------------------------------------------------ public API
    def submit_sync(self, mode: str) -> Job:
        job = self._register(Job("rebuild" if mode == "rebuild" else "sync", ""))

        def run():
            try:
                job.update(status="running", message="Starting...")
                (self.rebuild if mode == "rebuild" else self.sync)(job)
            except Exception as e:  # noqa: BLE001
                job.update(status="failed", error=str(e), finished_at=now())

        self.pool.submit(run)
        return job

    def submit_upload(self, filename: str, data: bytes) -> Job:
        ext = Path(filename).suffix.lower()
        validate_bytes(ext, data)  # raises IngestError immediately (HTTP 400/415 in the API layer)
        safe = re.sub(r"[^A-Za-z0-9._ -]", "_", Path(filename).name).strip(" .") or f"upload{ext}"
        dest = self.kb / "my_documents" / safe
        dest.write_bytes(data)
        job = self._register(Job("upload", safe))
        self.pool.submit(lambda: self.index_path(dest, job))
        return job

    def delete(self, source: str) -> bool:
        p = (self.kb / source).resolve()
        if not str(p).startswith(str(self.kb.resolve())) or not p.is_file():
            # may be in manifest only
            if source in self.store.manifest["documents"]:
                self.store.delete_document(source)
                self.store.manifest["documents"].pop(source, None)
                self.store.save_manifest()
                return True
            return False
        p.unlink()
        self.store.delete_document(source)
        self.store.manifest["documents"].pop(source, None)
        self.store.save_manifest()
        return True

    def list_documents(self) -> list[dict]:
        return sorted(self.store.manifest["documents"].values(), key=lambda d: d["source"])
