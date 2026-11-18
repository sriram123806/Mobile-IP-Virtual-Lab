"""Curated external resources (RFCs, websites, textbooks) chosen by topic, never attached at random."""
from __future__ import annotations

import json
import re
from pathlib import Path

BOOK_Q = re.compile(r"\b(books?|textbooks?|reading|reference\s+books?)\b", re.I)
SITE_Q = re.compile(r"\b(websites?|sites?|links?|tutorials?|resources?|courses?|online)\b", re.I)


class Resources:
    def __init__(self, path: Path):
        self.path = Path(path)
        self._mtime = None
        self._items: list[dict] = []

    def _load(self) -> list[dict]:
        try:
            m = self.path.stat().st_mtime
        except OSError:
            return []
        if m != self._mtime:
            try:
                self._items = json.loads(self.path.read_text("utf-8")).get("resources", [])
            except Exception:  # noqa: BLE001
                self._items = []
            self._mtime = m
        return self._items

    @staticmethod
    def _public(r: dict) -> dict:
        return {k: r.get(k) for k in ("id", "title", "url", "description", "kind", "status", "badge", "authors", "note")} | {"covers": r.get("covers")}

    def _matches(self, r: dict, text: str, ents: list[str]) -> int:
        n = 0
        for t in r.get("topics", []):
            t = t.lower()
            if t in ents or re.search(rf"(?<![a-z]){re.escape(t)}(?![a-z])", text):
                n += 1
        return n

    def select(self, text: str, ents: list[str], intent: str) -> list[dict]:
        items = self._load()
        low = text.lower()
        explicit_old = bool(re.search(r"rfc\s*-?\s*3344|3344", low))
        scored = []
        for r in items:
            hit = self._matches(r, low, ents)
            kind = r.get("kind")
            if intent == "resources":
                wants_book = bool(BOOK_Q.search(low))
                if wants_book and kind != "book":
                    continue
                if not wants_book and kind == "book":
                    if not hit or not re.search(r"\b(learn|study|read)\b", low):
                        continue
                if hit == 0 and not (kind == "website" and not wants_book):
                    continue
            else:  # attached to a technical answer: only strongly relevant, mostly standards
                if kind == "book" or hit == 0:
                    continue
                if r.get("status") in ("historical", "superseded") and not explicit_old:
                    continue
                if kind == "website" and any(i.get("kind") == "standard" and self._matches(i, low, ents) for i in items):
                    continue
            scored.append((r.get("priority", 50), -hit, r))
        scored.sort(key=lambda t: (t[0], t[1]))
        limit = 6 if intent == "resources" else 2
        out = [self._public(r) for _, _, r in scored[:limit]]
        return out
