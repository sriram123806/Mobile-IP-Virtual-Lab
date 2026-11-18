"""Conversation logic. Three clearly separated paths:
  1. conversational  - greetings, name, thanks...: NO retrieval, NO model call
  2. retrieval + generation - technical questions: hybrid retrieval, then the LLM answers from the passages
  3. fallback        - no model / nothing relevant: extractive passages or an honest 'not in the notes'
"""
from __future__ import annotations

import random
import re
import threading
import time
from collections import deque
from datetime import datetime, timezone

from ..ingestion.loaders import neutralize
from ..rag.knowledge import display, entities, looks_networking, tokenize
from ..rag.llm import LLMError
from . import intents
from .prompts import SYSTEM, build_user_prompt

_PRON_ANY = re.compile(r"\b(it|its|it's|they|their|theirs|them)\b", re.I)
_PRON_DEM = re.compile(r"\b(this|that|these|those)\b", re.I)
_REF = re.compile(
    r"\b(?:the|that|this)\s+(agent|node|entity|component|protocol|concept|term|mechanism|process|device|thing)\s+(?:that\s+)?(?:you|we)\s+"
    r"(?:just\s+|previously\s+|earlier\s+)?(?:explained|described|mentioned|discussed|covered|talked\s+about|defined)\b"
    r"|\b(?:the\s+)?(?:above|previous|last)\s+(agent|node|concept|topic|answer)\b", re.I)
_LEAD = re.compile(r"^(what\s+about|and\b|how\s+about|why\b|how\b|what\s+if|what\s+happens|can\s+you|could\s+you|give|show|more|elaborate|"
                   r"explain\s+(?:more|again|further)|example|simpler|in\s+detail|continue|then\b|so\b|but\b|is\s+it|does\s+it|where|when|which)", re.I)
NUM_WORDS = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10}

SUGGEST = {
    "home agent": ["What is its responsibility?", "What happens if it fails?", "Explain tunneling."],
    "foreign agent": ["What does it do for the mobile node?", "What is a Care-of Address?", "Explain the complete packet delivery process."],
    "care-of address": ["What is the difference between a home address and a care-of address?", "Explain tunneling."],
    "tunneling": ["What is encapsulation?", "What is reverse tunneling?", "Ask me viva questions about tunneling."],
    "encapsulation": ["What is decapsulation?", "What is the difference between an inner and outer IP header?"],
    "decapsulation": ["What is encapsulation?", "Explain the complete packet delivery process."],
    "reverse tunneling": ["What is triangle routing?", "Explain forward tunneling."],
    "mobile ip": ["What is a Home Agent?", "Explain the complete packet delivery process.", "Give me official websites to study Mobile IP."],
}
DEFAULT_SUGGEST = ["What is Mobile IP?", "Explain tunneling.", "Ask me viva questions."]


class Session:
    def __init__(self) -> None:
        self.name: str | None = None
        self.turns: deque = deque(maxlen=12)
        self.last_topic: str | None = None
        self.last_agent: str | None = None
        self.last_quiz: list[dict] | None = None
        self.greeted = False
        self.touched = time.time()


class ChatService:
    def __init__(self, settings, store, retriever, llm, resources):
        self.s, self.store, self.retriever, self.llm, self.resources = settings, store, retriever, llm, resources
        self._sessions: dict[str, Session] = {}
        self._lock = threading.Lock()

    # ------------------------------------------------------------ sessions
    def session(self, sid: str) -> Session:
        with self._lock:
            now = time.time()
            if len(self._sessions) > 2000:
                for k in [k for k, v in self._sessions.items() if now - v.touched > 6 * 3600]:
                    self._sessions.pop(k, None)
            s = self._sessions.setdefault(sid, Session())
            s.touched = now
            return s

    def clear(self, sid: str) -> bool:
        with self._lock:
            return self._sessions.pop(sid, None) is not None

    # ------------------------------------------------------------ response
    def _resp(self, sid, sess, user_msg, reply, intent, mode, refs=None, resources=None, suggestions=None,
              interpreted=None, notice=None, llm_used=False):
        sess.turns.append(("Student", user_msg))
        sess.turns.append(("Shinchi", reply))
        return {
            "session_id": sid, "reply": reply, "intent": intent, "answer_mode": mode, "user_name": sess.name,
            "interpreted_as": interpreted, "notice": notice, "llm_used": llm_used, "references": refs or [],
            "resources": resources or [], "suggestions": (suggestions or [])[:3],
            "timestamp": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        }

    # ------------------------------------------------------------ entry
    def handle(self, sid: str, message: str) -> dict:
        sess = self.session(sid)
        it = intents.detect(message, has_quiz=bool(sess.last_quiz))
        k = it.kind
        nm = f", {sess.name}" if sess.name else ""
        chips = ["What is Mobile IP?", "Explain tunneling.", "Ask me viva questions."]

        if k == "empty":
            return self._resp(sid, sess, message, "Go ahead, ask me something about Mobile IP or networking. 🙂", "empty", "conversational", suggestions=chips)
        if k == "greeting":
            if not sess.greeted:
                sess.greeted = True
                r = "Hey! 👋 Welcome! I'm Shinchi, your Mobile IP and Data Communication Networks learning assistant. What would you like to explore today?"
            else:
                r = random.choice([f"Hey again{nm}! 😊 What shall we explore?", f"Hi{nm}! What would you like to look at next?"])
            sess.greeted = True
            return self._resp(sid, sess, message, r, k, "conversational", suggestions=chips)
        if k == "how_are_you":
            return self._resp(sid, sess, message, f"I'm doing great, thanks for asking{nm}! 😊 Ready whenever you are. What would you like to learn?", k, "conversational", suggestions=chips)
        if k == "user_name":
            first_time = sess.name is None
            sess.name = it.name
            r = (f"Nice to meet you, {it.name}! 😊 What would you like to learn today?" if first_time
                 else f"Got it, I'll call you {it.name}. 😊 What would you like to learn?")
            return self._resp(sid, sess, message, r, k, "conversational", suggestions=chips)
        if k == "bot_name":
            return self._resp(sid, sess, message, "I'm Shinchi! Your friendly networking learning companion. Let's explore Mobile IP together! 🌐", k, "conversational", suggestions=chips)
        if k == "creator":
            return self._resp(sid, sess, message, self.s.creator_text, k, "conversational", suggestions=chips)
        if k == "about_bot":
            mdl = f"a language model ({self.llm.model})" if self.llm.enabled else "no language model right now (I show passages from the notes)"
            return self._resp(sid, sess, message, f"I'm an AI learning assistant, not a person. I find relevant passages in the course notes loaded into my knowledge base and then explain them; at the moment I'm using {mdl}. I can make mistakes, so check important facts against your notes and the RFCs.", k, "conversational", suggestions=chips)
        if k == "capabilities":
            r = ("Here's what I can help with:\n\n- **Explain** Mobile IP: Home Agent, Foreign Agent, care-of addresses, registration, tunneling, encapsulation and decapsulation\n"
                 "- **Walk through** packet delivery step by step, forward and reverse tunneling, and failure scenarios\n"
                 "- **Cover DCN basics**: IP addressing, routing, layers, error detection and more\n"
                 "- **Quiz you** with viva questions\n- **Point you to** RFCs, websites and textbooks\n\nAsk follow-ups freely; I keep track of what we're discussing.")
            return self._resp(sid, sess, message, r, k, "conversational", suggestions=chips)
        if k == "thanks":
            return self._resp(sid, sess, message, random.choice([f"You're welcome{nm}! 😊 Want to try a few viva questions or explore another topic?", f"Happy to help{nm}! Anything else you'd like to dig into?"]), k, "conversational", suggestions=chips)
        if k == "farewell":
            return self._resp(sid, sess, message, f"Goodbye{nm}! 👋 Come back any time. Good luck with your studies!", k, "conversational")
        if k == "ack":
            return self._resp(sid, sess, message, "Great! Ask me a follow-up, or pick something new to explore. 🙂", k, "conversational", suggestions=chips)
        if k == "quiz_answers":
            return self._quiz_answers(sid, sess, message)
        if k == "quiz":
            return self._quiz(sid, sess, message, it.text or message)
        if k == "resources":
            return self._resources(sid, sess, message, it.text or message)
        return self._technical(sid, sess, message, it.text or message)

    # ------------------------------------------------------------ follow-ups
    def resolve(self, sess: Session, msg: str) -> tuple[str, bool]:
        ents = entities(msg)
        topic, agent = sess.last_topic, sess.last_agent
        m = _REF.search(msg)
        if m and (topic or agent):
            word = (m.group(1) or m.group(2) or "").lower()
            t = agent if word == "agent" and agent else (topic or agent)
            return msg[: m.start()] + "the " + display(t) + msg[m.end():], True
        if not topic:
            return msg, False
        tname = display(topic)
        if _PRON_ANY.search(msg) and topic not in ents:
            def sub(mm):
                w = mm.group(1).lower()
                return f"the {tname}'s" if w in ("its", "their", "theirs") else f"the {tname}"
            new = re.sub(r"\bit's\b", f"the {tname} is", msg, flags=re.I)
            new = _PRON_ANY.sub(sub, new)
            return new, new != msg
        if not ents and _PRON_DEM.search(msg):
            new = _PRON_DEM.sub(f"the {tname}", msg, count=1)
            return new, True
        if not ents and not looks_networking(msg) and len(msg.split()) <= 7 and _LEAD.match(msg.strip()):
            return f"{msg.rstrip('?. ')} (regarding the {tname})?", True
        return msg, False

    def _remember(self, sess: Session, standalone: str) -> list[str]:
        ents = entities(standalone)
        if ents:
            specific = [e for e in ents if e != "mobile ip"]
            sess.last_topic = (specific or ents)[0]
            agents = [e for e in ents if e in ("home agent", "foreign agent")]
            if agents:
                sess.last_agent = agents[-1]
        return ents

    # ------------------------------------------------------------ references
    @staticmethod
    def _ref(i: int, h) -> dict:
        m = h.meta
        page = m.get("page", -1)
        pe = m.get("page_end", -1)
        snippet = re.sub(r"\s+", " ", h.body).strip()
        return {"id": i, "title": m.get("title", ""), "source": m.get("source", ""), "section": m.get("section", "") or None,
                "page": page if page and page > 0 else None, "page_end": pe if pe and pe > 0 and pe != page else None,
                "snippet": snippet[:320] + ("..." if len(snippet) > 320 else ""), "doc_type": m.get("doc_type"),
                "doc_status": m.get("doc_status"), "cited": False, "score": round(h.score, 2)}

    @staticmethod
    def _hint(msg: str) -> str:
        low = msg.lower()
        h = []
        if re.search(r"beginner|simple|eli5|like i'?m (5|five)|layman|easy", low):
            h.append("beginner level: plain words, one analogy")
        if re.search(r"detail|in[- ]depth|deeply|thorough|complete|full", low):
            h.append("detailed technical explanation")
        if re.search(r"\b(short|brief|one[- ]line|quick|exam answer|\d\s*marks?)\b", low):
            h.append("short exam-style answer, 2-5 sentences")
        if re.search(r"step[- ]by[- ]step|steps|process|how does .* work", low):
            h.append("numbered steps")
        if re.search(r"\bdifferen\w+|\bvs\b|versus|compare|comparison", low):
            h.append("comparison: short table or side-by-side bullets")
        if re.search(r"fail|what happens if|cannot|can't|troubleshoot|not working|problem", low):
            h.append("failure scenario: symptom, cause, what to check")
        if re.search(r"example", low):
            h.append("include a concrete example")
        return "; ".join(h)

    @staticmethod
    def _fix_citations(text: str, valid: set[int]) -> tuple[str, set[int]]:
        text = re.sub(r"\[(\d{1,2}(?:\s*,\s*\d{1,2})+)\]", lambda m: "".join(f"[{n.strip()}]" for n in m.group(1).split(",")), text)
        used: set[int] = set()

        def rep(m):
            n = int(m.group(1))
            if n in valid:
                used.add(n)
                return m.group(0)
            return ""
        return re.sub(r"\[(\d{1,2})\]", rep, text), used

    # ------------------------------------------------------------ technical
    def _technical(self, sid, sess, message, text):
        standalone, changed = self.resolve(sess, text)
        ents = self._remember(sess, standalone)
        interpreted = standalone if changed else None
        query = standalone + " " + " ".join(ents)
        hits = self.retriever.search(query, self.s.top_k)
        rel = [h for h in hits if h.relevant][:5]
        res = self.resources.select(standalone, ents, "technical")
        topic = display(ents[0]) if ents else "this topic"
        sugg = SUGGEST.get(sess.last_topic or "", DEFAULT_SUGGEST)

        if not rel:
            if not looks_networking(standalone):
                r = ("That one's outside what I can help with. I'm focused on Mobile IP and Data Communication Networks, "
                     "so I wouldn't want to guess. Want to try a networking question instead? 🙂")
                return self._resp(sid, sess, message, r, "off_topic", "off_topic", suggestions=DEFAULT_SUGGEST, interpreted=interpreted)
            if self.llm.enabled:
                try:
                    out = self.llm.complete(SYSTEM, build_user_prompt(standalone, sess.name, list(sess.turns), [], self._hint(text), True), 800)
                    out, _ = self._fix_citations(out, set())
                    out = "*I couldn't find this in the loaded notes, so this comes from general knowledge. Please double-check it against a textbook or the RFCs.*\n\n" + out
                    return self._resp(sid, sess, message, out, "technical", "general_knowledge", resources=res, suggestions=sugg, interpreted=interpreted, llm_used=True)
                except LLMError:
                    pass
            r = ("I couldn't find anything about that in the loaded notes, and no language model is available to answer from general knowledge, "
                 "so I'd rather not guess. You can add notes or textbooks on this topic in the admin page and I'll use them.")
            return self._resp(sid, sess, message, r, "technical", "not_in_kb", resources=res, suggestions=sugg, interpreted=interpreted)

        refs = [self._ref(i, h) for i, h in enumerate(rel, 1)]
        if self.llm.enabled:
            docs = [{"id": i, "title": h.meta.get("title", ""), "section": h.meta.get("section", ""),
                     "page": (h.meta.get("page") if h.meta.get("page", -1) > 0 else ""),
                     "text": neutralize(h.body)[0][:1800]} for i, h in enumerate(rel, 1)]
            try:
                out = self.llm.complete(SYSTEM, build_user_prompt(standalone, sess.name, list(sess.turns), docs, self._hint(text), False),
                                        1400 if "detail" in text.lower() else 1000)
                out, used = self._fix_citations(out, {r["id"] for r in refs})
                for r in refs:
                    r["cited"] = r["id"] in used
                return self._resp(sid, sess, message, out, "technical", "grounded", refs=refs, resources=res,
                                  suggestions=sugg, interpreted=interpreted, llm_used=True)
            except LLMError:
                notice = "The language model was unavailable just now, so here are the most relevant passages from the notes instead."
        else:
            notice = None
        # extractive fallback
        parts = [f"Here's what the loaded notes say about **{topic}**" + (" (no language model is configured, so I'm showing the most relevant passages directly):" if not notice else ":")]
        for r, h in list(zip(refs, rel))[:3]:
            body = h.body.strip()
            paras, acc = re.split(r"\n\s*\n", body), ""
            for p in paras:
                if acc and len(acc) + len(p) > 750:
                    break
                acc += ("\n\n" if acc else "") + p
            acc = acc[:900]
            r["cited"] = True
            parts.append(f"**{r['section'] or r['title']}** [{r['id']}]\n{acc}")
        return self._resp(sid, sess, message, "\n\n".join(parts), "technical", "offline_extract", refs=refs, resources=res,
                          suggestions=sugg, interpreted=interpreted, notice=notice)

    # ------------------------------------------------------------ resources
    def _resources(self, sid, sess, message, text):
        standalone, changed = self.resolve(sess, text)
        ents = entities(standalone)
        res = self.resources.select(standalone, ents, "resources")
        if not res:
            return self._resp(sid, sess, message, "I don't have a curated resource for that yet. Try asking for books on Data Communication Networks, or official sources for Mobile IP.", "resources", "resources", suggestions=DEFAULT_SUGGEST)
        books = [r for r in res if r["kind"] == "book"]
        if books and len(books) == len(res):
            lines = [f"- **{r['title']}**" + (f" ({r['authors']})" if r.get("authors") else "") + f": {r.get('covers') or r.get('description') or ''}" for r in books]
            reply = "Here are solid textbooks to learn from. Use your library or the publisher for a legitimate copy:\n\n" + "\n".join(lines)
        else:
            lines = []
            for r in res:
                tag = f" *({r['badge']})*" if r.get("badge") else ""
                link = f"[{r['title']}]({r['url']})" if r.get("url") else f"**{r['title']}**"
                lines.append(f"- {link}{tag}: {r.get('description') or ''}")
            reply = "Good places to study this:\n\n" + "\n".join(lines)
            if any(r.get("status") in ("historical", "superseded") for r in res):
                reply += "\n\nNote: RFC 3344 is the older Mobile IPv4 specification and has been superseded by RFC 5944, so use RFC 5944 for the current text."
        return self._resp(sid, sess, message, reply, "resources", "resources", resources=res, suggestions=["What is Mobile IP?", "Ask me viva questions."], interpreted=standalone if changed else None)

    # ------------------------------------------------------------ viva / quiz
    def _viva_items(self) -> list[dict]:
        out = []
        for c in self.retriever.chunks():
            m = c["meta"]
            if m.get("doc_type") == "viva" and m.get("question"):
                out.append({"id": c["id"], "q": m["question"], "a": m.get("answer", ""), "d": m.get("difficulty", "medium"), "meta": m, "text": c["text"]})
        return out

    def _quiz(self, sid, sess, message, text):
        items = self._viva_items()
        if not items:
            return self._resp(sid, sess, message, "There's no viva question bank in my knowledge base yet. Add a document with `type: viva` (see the knowledge-base README) and I can quiz you from it.", "quiz", "not_in_kb", suggestions=DEFAULT_SUGGEST)
        low = text.lower()
        n = 5
        mnum = re.search(r"\b(\d{1,2})\b", low)
        if mnum:
            n = max(1, min(10, int(mnum.group(1))))
        else:
            for w, v in NUM_WORDS.items():
                if re.search(rf"\b{w}\b", low):
                    n = v
        diff = "hard" if re.search(r"difficult|hard|tough|challeng|advanced", low) else ("easy" if re.search(r"\beasy|basic|simple|beginner", low) else None)
        mip_rx = re.compile(r"mobile|home agent|foreign agent|care-of|tunnel|encapsul|decapsul|binding|registration|triangle|correspondent", re.I)
        pool = items
        if re.search(r"\bdcn\b|data communication|networking|\bnetwork", low) and not mip_rx.search(low):
            sub = [i for i in items if not mip_rx.search(i["q"] + " " + i["a"])]
            pool = sub or items
        topic_toks = set(tokenize(low)) - set(tokenize("viva quiz question questions ask test practice interview prep mcq multiple choice difficult hard easy dcn data communication networks networking network mobile ip"))
        if topic_toks:
            sub = [i for i in pool if topic_toks & set(tokenize(i["q"] + " " + i["a"]))]
            pool = sub or pool
        note = ""
        if diff:
            exact = [i for i in pool if i["d"] == diff]
            rest = [i for i in pool if i["d"] != diff]
            random.shuffle(exact)
            random.shuffle(rest)
            ordered = exact + rest
            if len(exact) < n and rest:
                note = f" (Only {len(exact)} {diff} question{'s' if len(exact) != 1 else ''} match, so I added others on the same topic.)"
            picked = ordered[:n]
        else:
            picked = random.sample(pool, min(n, len(pool)))
        sess.last_quiz = [{"q": p["q"], "a": p["a"], "d": p["d"], "ref": i} for i, p in enumerate(picked, 1)]
        refs = []
        for i, p in enumerate(picked, 1):
            m = p["meta"]
            refs.append({"id": i, "title": m.get("title", ""), "source": m.get("source", ""), "section": m.get("section") or None, "page": None,
                         "page_end": None, "snippet": p["q"][:200], "doc_type": "viva", "doc_status": m.get("doc_status"), "cited": True, "score": 1.0})
        lines = [f"{i}. *[{p['d']}]* {p['q']} [{i}]" for i, p in enumerate(picked, 1)]
        head = f"Here are {len(picked)} {diff + ' ' if diff and not note else ''}viva questions from the question bank. Try answering in your own words first, then say **show the answers**."
        head += note
        if len(picked) < n:
            head += f" (The bank only has {len(picked)} matching questions right now.)"
        return self._resp(sid, sess, message, head + "\n\n" + "\n".join(lines), "quiz", "quiz", refs=refs,
                          suggestions=["Show the answers", "Ask me five more viva questions.", "Ask me viva questions about tunneling."])

    def _quiz_answers(self, sid, sess, message):
        qz = sess.last_quiz or []
        lines = [f"**{i}. {q['q']}**\n{q['a']} [{i}]" for i, q in enumerate(qz, 1)]
        refs = []
        for i, q in enumerate(qz, 1):
            refs.append({"id": i, "title": "Viva question bank", "source": "", "section": q["q"][:80], "page": None, "page_end": None,
                         "snippet": q["a"][:300], "doc_type": "viva", "doc_status": None, "cited": True, "score": 1.0})
        return self._resp(sid, sess, message, "Model answers from the question bank:\n\n" + "\n\n".join(lines), "quiz_answers", "quiz", refs=refs,
                          suggestions=["Ask me five more viva questions.", "Ask me difficult DCN viva questions."])
