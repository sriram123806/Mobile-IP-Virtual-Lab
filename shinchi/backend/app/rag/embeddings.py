"""Embedding back-ends. 'auto' tries the local ONNX MiniLM model and falls back to an offline hashing embedder."""
from __future__ import annotations

import logging
import math
import zlib
from collections import Counter

import numpy as np

from .knowledge import tokenize

log = logging.getLogger("shinchi.embeddings")


class Embedder:
    name = "base"
    dim = 0
    dense_min = 1.1  # cosine similarity above which a chunk counts as relevant on its own (>1 = never)

    def embed(self, texts: list[str]) -> list[list[float]]:
        raise NotImplementedError


class HashEmbedder(Embedder):
    """Deterministic, dependency-free lexical embedding (hashed unigrams + bigrams). Works offline.
    Much weaker than a neural model at paraphrase matching; hybrid BM25 compensates."""

    def __init__(self, dim: int = 1024):
        self.dim = dim
        self.name = f"hash-{dim}"

    def _vec(self, text: str) -> list[float]:
        toks = tokenize(text)
        feats = Counter(toks)
        feats.update({f"{a}_{b}": 0.6 for a, b in zip(toks, toks[1:])})
        v = np.zeros(self.dim, dtype=np.float32)
        for f, c in feats.items():
            h = zlib.crc32(f.encode())
            v[h % self.dim] += (1 if (h >> 16) & 1 else -1) * (1 + math.log(c) if c >= 1 else c)
        n = float(np.linalg.norm(v))
        return (v / n).tolist() if n else v.tolist()

    def embed(self, texts):
        return [self._vec(t) for t in texts]


class OnnxEmbedder(Embedder):
    dense_min = 0.42

    def __init__(self):
        from chromadb.utils.embedding_functions import ONNXMiniLM_L6_V2

        self._ef = ONNXMiniLM_L6_V2()
        self.name = "onnx-all-MiniLM-L6-v2"
        self.dim = 384
        self._ef(["warm up"])  # forces the model download now, so failure is detected at start-up

    def embed(self, texts):
        return [[float(x) for x in v] for v in self._ef(texts)]


class OpenAIEmbedder(Embedder):
    dense_min = 0.35

    def __init__(self, api_key: str, model: str, base_url: str = ""):
        from openai import OpenAI

        self._client = OpenAI(api_key=api_key, base_url=base_url or None)
        self._model = model
        self.name = f"openai-{model}"
        self.dim = len(self.embed(["dim probe"])[0])

    def embed(self, texts):
        out = []
        for i in range(0, len(texts), 64):
            r = self._client.embeddings.create(model=self._model, input=texts[i : i + 64])
            out.extend([d.embedding for d in r.data])
        return out


def make_embedder(settings) -> Embedder:
    p = settings.embedding_provider
    if p == "hash":
        return HashEmbedder()
    if p == "openai":
        return OpenAIEmbedder(settings.openai_api_key, settings.openai_embedding_model, settings.openai_base_url)
    if p in ("onnx", "auto"):
        try:
            return OnnxEmbedder()
        except Exception as e:  # noqa: BLE001
            if p == "onnx":
                raise
            log.warning("ONNX MiniLM unavailable (%s). Falling back to offline hash embeddings.", e)
            return HashEmbedder()
    raise ValueError(f"Unknown EMBEDDING_PROVIDER '{p}'")
