"""CLI: python backend/scripts/ingest.py [--rebuild]  -> index the knowledge_base folder."""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.config import Settings  # noqa: E402
from app.ingestion.indexer import Indexer  # noqa: E402
from app.rag.embeddings import make_embedder  # noqa: E402
from app.rag.store import VectorStore  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument("--rebuild", action="store_true", help="wipe the vector index and re-embed everything")
a = ap.parse_args()
s = Settings()
emb = make_embedder(s)
store = VectorStore(s.data_dir, f"{emb.name}:{emb.dim}")
ix = Indexer(s, store, emb)
print("Embedder:", emb.name)
res = ix.rebuild() if a.rebuild else ix.sync()
print(res, "| total chunks:", store.count())
for d in ix.list_documents():
    print(f"  {d['status']:8} {d['chunks']:4} chunks  {d['source']}" + (f"  ERROR: {d['error']}" if d["error"] else ""))
