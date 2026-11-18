"""Rule-based intent detection: decides whether a message needs retrieval at all."""
from __future__ import annotations

import re
from dataclasses import dataclass

GREET = r"(?:hi+|hello+|hey+|heya|hiya|yo|namaste|vanakkam|good\s+(?:morning|afternoon|evening|day)|greetings|howdy|sup)"
NOT_NAMES = {
    "a", "an", "the", "fine", "good", "great", "ok", "okay", "well", "confused", "lost", "stuck", "ready", "back", "here",
    "new", "student", "learning", "studying", "sorry", "tired", "happy", "sad", "curious", "excited", "busy", "sure",
    "not", "very", "so", "just", "still", "also", "in", "from", "doing", "trying", "bored", "late", "done", "worried",
    "nervous", "stressed", "interested", "unsure", "afraid", "scared", "weak", "bad", "angry", "free", "online",
}
_NAME = re.compile(
    r"^\s*(?P<lead>i\s+am|i'?m|im|my\s+name\s+is|my\s+name'?s|call\s+me|this\s+is|it'?s|name\s*[:=-])\s+"
    r"(?P<n1>[A-Za-z][A-Za-z'-]{1,24})(?:\s+(?P<n2>[A-Za-z][A-Za-z'-]{1,24}))?\s*[.!]*\s*$", re.I)


@dataclass
class Intent:
    kind: str
    name: str | None = None
    text: str | None = None  # message with greeting stripped


def _words(s: str) -> int:
    return len(re.findall(r"\w+", s))


def detect(message: str, has_quiz: bool = False) -> Intent:
    msg = message.strip()
    if not msg:
        return Intent("empty")
    low = re.sub(r"\s+", " ", msg.lower())

    # greeting prefix: "hi, what is tunneling" -> technical question, greeting dropped
    rest = low
    m = re.match(rf"^\s*{GREET}\b[\s,!.:;-]*(.*)$", low)
    greeted = False
    if m:
        greeted = True
        rest = re.sub(r"\bshinchi\b", "", m.group(1)).strip(" ,!.?")
        if not rest:
            return Intent("greeting")
        msg = re.sub(rf"^\s*{GREET}\b[\s,!.:;-]*", "", msg, flags=re.I).strip()
        low = rest
    if re.fullmatch(r"(?:(?:how\s+are\s+(?:you|u)(?:\s+doing)?|how'?s\s+it\s+going|how\s+do\s+you\s+do|what'?s\s+up|wassup|how\s+are\s+things)\s*\??)+", low):
        return Intent("how_are_you")
    if _words(low) <= 7 and re.match(r"^(thanks?|thank\s+you|thx|ty|cheers|appreciate|much\s+appreciated)\b", low):
        return Intent("thanks")
    if _words(low) <= 7 and re.match(r"^(bye+|goodbye|good\s*night|see\s+(?:you|ya)|take\s+care|cya|talk\s+(?:to\s+you\s+)?later|that'?s\s+all|gtg)\b", low):
        return Intent("farewell")
    if re.search(r"\b(what'?s|what\s+is|what\s+are)\s+(?:your|ur)\s+name\b|\bwho\s+are\s+you\b|\bwhat\s+should\s+i\s+call\s+you\b|^your\s+name\b|\bwhat\s+do\s+(?:they|people)\s+call\s+you\b", low):
        return Intent("bot_name")
    if re.search(r"\bwho\s+(?:created|made|built|developed|designed|programmed|trained|owns)\s+(?:you|this)\b|\bwho\s+is\s+your\s+(?:creator|developer|maker|author)\b", low):
        return Intent("creator")
    if re.search(r"\bwhat\s+can\s+you\s+do\b|\bwhat\s+do\s+you\s+do\b|\bhow\s+can\s+you\s+help\b|^help\b|\bwhat\s+are\s+you\s+(?:able|capable)\b|\bwhat\s+do\s+you\s+know\b|\bhow\s+do\s+i\s+use\s+you\b|\bwhat\s+topics\b", low):
        return Intent("capabilities")
    if re.search(r"\bare\s+you\s+(?:a\s+|an\s+)?(?:real|human|bot|ai|robot|chatgpt|llm|person)\b|\bwhich\s+model\b|\bwhat\s+model\b|\bwhat\s+are\s+you\b", low):
        return Intent("about_bot")

    nm = _NAME.match(message.strip())
    if nm:
        lead = nm.group("lead").lower()
        n1, n2 = nm.group("n1"), nm.group("n2")
        explicit = lead.startswith(("my", "call", "name"))
        ok = n1.lower() not in NOT_NAMES and (explicit or n1[0].isupper())
        if ok and n2 and (n2.lower() in NOT_NAMES or not (explicit or n2[0].isupper())):
            n2 = None
        from ..rag.knowledge import looks_networking

        if ok and not looks_networking(n1 + " " + (n2 or "")):
            full = n1 + (f" {n2}" if n2 else "")
            return Intent("user_name", name=" ".join(w[:1].upper() + w[1:] for w in full.split()))
    if re.fullmatch(r"(ok(ay)?|cool|great|nice|got\s+it|understood|i\s+see|alright|fine|good|awesome|sure|yes|yep|hmm+|wow|makes\s+sense)[\s.!]*", low):
        return Intent("ack")
    if has_quiz and re.search(r"\b(show|give|reveal|tell|see)\b.*\banswers?\b|\banswers?\s+(please|now)\b|\bwhat\s+are\s+the\s+answers\b", low):
        return Intent("quiz_answers")
    if re.search(r"\b(viva|quiz|mcqs?|multiple[\s-]?choice|test\s+me|ask\s+me|interview\s+(?:questions?|prep\w*)|practice\s+questions?|flash\s?cards?)\b", low):
        return Intent("quiz", text=msg)
    if re.search(r"\b(suggest|recommend|best|good|any|which)\b.*\b(books?|textbooks?)\b|\b(books?|textbooks?)\b.*\b(learn|study|read|recommend|refer)\w*|\breference\s+books?\b", low) \
            or re.search(r"\bwhere\s+(?:can|do|should|to)\s+(?:i|we)\s+(?:learn|study|read|find)\b|\b(?:official|good|useful|best|trusted)\s+(?:websites?|sites?|links?|resources?|references?|tutorials?|documents?|standards?)\b|\b(?:websites?|links?|resources?|tutorials?|rfcs?)\s+(?:to|for|about|on)\s+(?:study|learn|read|mobile|ip|networking)", low):
        return Intent("resources", text=msg)
    return Intent("technical", text=msg)
