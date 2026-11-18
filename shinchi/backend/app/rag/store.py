"""ChromaDB vector store plus a JSON manifest of indexed documents."""
from __future__ import annotations

import json
import threading
from pathlib import Path

import chromadb
from chromadb.config import Settings as ChromaSettings

COLLECTION = "shinchi_kb"


class VectorStore:
    def __init__(self, data_dir: Path, embedder_id: str):
        self.dir = Path(data_dir)
        self.dir.mkdir(parents=True, exist_ok=True)
        self.embedder_id = embedder_id
        self.lock = threading.RLock()
        self.version = 0
        self._manifest_path = self.dir / "manifest.json"
        self.client = chromadb.PersistentClient(path=str(self.dir / "chroma"), settings=ChromaSettings(anonymized_telemetry=False))
        self.col = self._open_collection()
        self.manifest: dict = {"embedder": embedder_id, "documents": {}}
        if self._manifest_path.exists():
            try:
                self.manifest = json.loads(self._manifest_path.read_text("utf-8"))
            except Exception:  # noqa: BLE001
                pass
        self.manifest.setdefault("documents", {})

    def _open_collection(self):
        try:
            return self.client.get_or_create_collection(COLLECTION, configuration={"hnsw": {"space": "cosine"}}, embedding_function=None)
        except Exception:  # noqa: BLE001
            return self.client.get_or_create_collection(COLLECTION, metadata={"hnsw:space": "cosine"}, embedding_function=None)

    # ------------------------------------------------------------ manifest
    @property
    def needs_rebuild(self) -> bool:
        return bool(self.manifest["documents"]) and self.manifest.get("embedder") != self.embedder_id

    def save_manifest(self) -> None:
        with self.lock:
            tmp = self._manifest_path.with_suffix(".tmp")
            tmp.write_text(json.dumps(self.manifest, indent=1), "utf-8")
            tmp.replace(self._manifest_path)

    # ------------------------------------------------------------ writes
    def upsert_document(self, source: str, chunks, vectors) -> None:
        with self.lock:
            self.col.delete(where={"source": source})
            for i in range(0, len(chunks), 100):
                part = chunks[i : i + 100]
                self.col.add(ids=[c.id for c in part], documents=[c.text for c in part],
                             embeddings=vectors[i : i + 100], metadatas=[c.meta for c in part])
            self.version += 1

    def delete_document(self, source: str) -> None:
        with self.lock:
            self.col.delete(where={"source": source})
            self.version += 1

    def reset(self) -> None:
        with self.lock:
            try:
                self.client.delete_collection(COLLECTION)
            except Exception:  # noqa: BLE001
                pass
            self.col = self._open_collection()
            self.manifest = {"embedder": self.embedder_id, "documents": {}}
            self.version += 1
            self.save_manifest()

    # ------------------------------------------------------------ reads
    def count(self) -> int:
        return self.col.count()

    def all_chunks(self) -> list[dict]:
        with self.lock:
            if self.col.count() == 0:
                return []
            r = self.col.get(include=["documents", "metadatas"])
        return [{"id": i, "text": d, "meta": m} for i, d, m in zip(r["ids"], r["documents"], r["metadatas"])]

    def query(self, vector, n: int) -> list[tuple[str, float]]:
        with self.lock:
            total = self.col.count()
            if total == 0:
                return []
            r = self.col.query(query_embeddings=[vector], n_results=min(n, total), include=["distances"])
        return [(i, 1.0 - d) for i, d in zip(r["ids"][0], r["distances"][0])]
