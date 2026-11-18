"""Run the 18 acceptance questions through the REAL pipeline (ingest -> retrieve -> answer) and write docs/EVALUATION.md.
Usage: python scripts/evaluate.py [--embedding hash|onnx|auto]   (uses the LLM from .env if a key is set)"""
import argparse
import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
ap = argparse.ArgumentParser()
ap.add_argument("--embedding", default=None)
ap.add_argument("--out", default=str(Path(__file__).resolve().parents[2] / "docs" / "EVALUATION.md"))
a = ap.parse_args()
os.environ["DATA_DIR"] = tempfile.mkdtemp(prefix="shinchi_eval_")
if a.embedding:
    os.environ["EMBEDDING_PROVIDER"] = a.embedding

from app.chat.resources import Resources  # noqa: E402
from app.chat.service import ChatService  # noqa: E402
from app.config import Settings  # noqa: E402
from app.ingestion.indexer import Indexer  # noqa: E402
from app.rag.embeddings import make_embedder  # noqa: E402
from app.rag.llm import LLM  # noqa: E402
from app.rag.retriever import Retriever  # noqa: E402
from app.rag.store import VectorStore  # noqa: E402

s = Settings()
emb = make_embedder(s)
store = VectorStore(s.data_dir, f"{emb.name}:{emb.dim}")
ix = Indexer(s, store, emb)
ix.sync()
llm = LLM(s)
svc = ChatService(s, store, Retriever(store, emb), llm, Resources(s.resources_path))

# (question, expected intent, [substrings, any of which must appear in reply+ref sections, ALL groups required])
Q = [
 ("Hi!", "greeting", [["welcome"], ["shinchi"]]),
 ("What is your name?", "bot_name", [["i'm shinchi"]]),
 ("I am Sriram.", "user_name", [["sriram"]]),
 ("What is Mobile IP?", "technical", [["mobile"], ["home address", "care-of", "move", "moving"]]),
 ("What is a Home Agent?", "technical", [["home agent"], ["binding", "intercept", "tunnel"]]),
 ("What is a Foreign Agent?", "technical", [["foreign agent"], ["decapsulat", "relay", "care-of"]]),
 ("What is a Care-of Address?", "technical", [["care-of"], ["foreign", "tunnel"]]),
 ("Explain tunneling.", "technical", [["tunnel"], ["outer", "encapsulat", "inside"]]),
 ("What is encapsulation?", "technical", [["outer"], ["header"]]),
 ("What is decapsulation?", "technical", [["decapsulat"], ["outer", "recover"]]),
 ("What is the difference between an inner and outer IP header?", "technical", [["inner"], ["outer"]]),
 ("Explain the complete packet delivery process.", "technical", [["home agent"], ["care-of", "tunnel"], ["decapsulat"]]),
 ("What happens if the Home Agent cannot find the Mobile Node?", "technical", [["binding"], ["drop", "unreachable", "home link", "expire"]]),
 ("What is reverse tunneling?", "technical", [["reverse"], ["home agent"], ["ingress", "source"]]),
 ("Suggest a good book to learn Data Communication Networks.", "resources", [["forouzan"], ["kurose"], ["tanenbaum"]]),
 ("Give me official websites to study Mobile IP.", "resources", [["rfc 5944"], ["rfc 3344", "3344"]]),
 ("Ask me difficult DCN viva questions.", "quiz", [["viva"], ["[hard]", "hard"]]),
 ("What is the responsibility of the agent you just explained?", "technical", [["home agent", "binding", "tunnel"]]),
]
sid = "eval-session-0001"
rows, ok_n = [], 0
for i, (q, intent, groups) in enumerate(Q, 1):
    r = svc.handle(sid, q)
    blob = (r["reply"] + " " + " ".join(f'{x["title"]} {x["section"] or ""}' for x in r["references"]) + " " + " ".join(x["title"] for x in r["resources"])).lower()
    miss = [g for g in groups if not any(t in blob for t in g)]
    passed = r["intent"] == intent and not miss
    ok_n += passed
    rows.append((i, q, r, passed, miss))
    print(f"[{'PASS' if passed else 'FAIL'}] {i:2}. {q}  -> intent={r['intent']} mode={r['answer_mode']} refs={len(r['references'])} res={len(r['resources'])}" + (f"  MISSING={miss}" if miss else ""))
print(f"\n{ok_n}/{len(Q)} passed | embedder={emb.name} | llm={'on:' + llm.model if llm.enabled else 'OFF (extractive fallback)'}")

md = [f"# Evaluation transcript\n",
      f"Embedder: `{emb.name}`; language model: `{llm.model if llm.enabled else 'none (extractive fallback mode)'}`; knowledge base: {store.count()} chunks from {len(ix.list_documents())} documents (AI-drafted starter notes).\n",
      f"Automated keyword/intent checks passed: **{ok_n}/{len(Q)}**. These checks prove relevant retrieval and correct routing, **not** that every sentence is accurate: read the answers below.\n"]
for i, q, r, passed, miss in rows:
    md.append(f"## {i}. {q}\n\n`intent={r['intent']}` `mode={r['answer_mode']}` `{'PASS' if passed else 'FAIL'}`" + (f" interpreted as: *{r['interpreted_as']}*" if r["interpreted_as"] else "") + "\n")
    md.append("\n".join("> " + l for l in r["reply"].splitlines()) + "\n")
    if r["references"]:
        md.append("References: " + "; ".join(f"[{x['id']}] {x['title']}" + (f" > {x['section']}" if x["section"] else "") for x in r["references"]) + "\n")
    if r["resources"]:
        md.append("Resources: " + "; ".join(x["title"] for x in r["resources"]) + "\n")
Path(a.out).write_text("\n".join(md), "utf-8")
sys.exit(0 if ok_n == len(Q) else 1)
