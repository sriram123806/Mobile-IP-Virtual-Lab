"""Hybrid retrieval: dense vectors (Chroma) + BM25, fused with reciprocal-rank fusion."""
from __future__ import annotations

import math
from collections import Counter
from dataclasses import dataclass, field

from .knowledge import tokenize


@dataclass
class Hit:
    id: str
    text: str
    meta: dict
    dense: float = 0.0
    bm25: float = 0.0
    coverage: float = 0.0
    title_match: float = 0.0
    score: float = 0.0
    relevant: bool = False

    @property
    def body(self) -> str:
        return self.text.split("\n", 1)[1] if "\n" in self.text else self.text


class BM25:
    def __init__(self, docs: list[list[str]], k1: float = 1.4, b: float = 0.75):
        self.k1, self.b = k1, b
        self.tf = [Counter(d) for d in docs]
        self.len = [len(d) for d in docs]
        self.avg = (sum(self.len) / len(docs)) if docs else 1.0
        df: Counter = Counter()
        for c in self.tf:
            df.update(c.keys())
        n = len(docs)
        self.idf = {t: math.log(1 + (n - f + 0.5) / (f + 0.5)) for t, f in df.items()}

    def scores(self, q: list[str]) -> list[float]:
        out = []
        for tf, ln in zip(self.tf, self.len):
            s = 0.0
            for t in set(q):
                f = tf.get(t, 0)
                if f:
                    s += self.idf.get(t, 0) * f * (self.k1 + 1) / (f + self.k1 * (1 - self.b + self.b * ln / self.avg))
            out.append(s)
        return out


class Retriever:
    def __init__(self, store, embedder):
        self.store, self.embedder = store, embedder
        self._ver = -1
        self._chunks: list[dict] = []
        self._tok: list[set] = []
        self._head: list[set] = []
        self._bm: BM25 | None = None

    def _refresh(self) -> None:
        if self._ver == self.store.version and self._bm is not None:
            return
        self._chunks = self.store.all_chunks()
        toks = [tokenize(c["text"]) for c in self._chunks]
        self._tok = [set(t) for t in toks]
        self._head = [set(tokenize(c["meta"].get("section") or c["meta"].get("title", ""))) for c in self._chunks]
        self._bm = BM25(toks)
        self._ver = self.store.version

    def chunks(self) -> list[dict]:
        self._refresh()
        return self._chunks

    def search(self, query: str, k: int = 6) -> list[Hit]:
        self._refresh()
        if not self._chunks:
            return []
        q = tokenize(query)
        qset = set(q)
        bm = self._bm.scores(q) if q else [0.0] * len(self._chunks)
        order_bm = sorted(range(len(bm)), key=lambda i: -bm[i])[:25]
        dense: dict[str, float] = {}
        if getattr(self.embedder, "dim", 0):
            try:
                dense = dict(self.store.query(self.embedder.embed([query])[0], 25))
            except Exception:  # noqa: BLE001
                dense = {}
        idx_of = {c["id"]: i for i, c in enumerate(self._chunks)}
        order_dn = [idx_of[i] for i, _ in sorted(dense.items(), key=lambda kv: -kv[1]) if i in idx_of]
        rrf: dict[int, float] = {}
        for order in (order_bm, order_dn):
            for r, i in enumerate(order):
                if order is order_bm and bm[i] <= 0:
                    continue
                rrf[i] = rrf.get(i, 0.0) + 1.0 / (60 + r)
        hits = []
        for i, s in rrf.items():
            c = self._chunks[i]
            cov = len(qset & self._tok[i]) / len(qset) if qset else 0.0
            tm = len(qset & self._head[i]) / len(qset | self._head[i]) if qset and self._head[i] else 0.0
            score = (s / (2 / 60)) * 0.5 + 0.35 * cov + 0.5 * tm
            if c["meta"].get("doc_type") == "viva":
                score *= 0.9
            elif c["meta"].get("doc_type") == "reference":
                score *= 0.85  # glossary entries are short and match titles easily; prefer full explanations
            h = Hit(c["id"], c["text"], c["meta"], dense.get(c["id"], 0.0), bm[i], cov, tm, score)
            h.relevant = (cov >= 0.5 and bm[i] > 0) or tm >= 0.5 or h.dense >= getattr(self.embedder, "dense_min", 1.1)
            hits.append(h)
        hits.sort(key=lambda h: -h.score)
        return hits[:k]
