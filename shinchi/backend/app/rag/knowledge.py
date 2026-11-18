"""Text normalisation and domain vocabulary shared by retrieval and chat."""
from __future__ import annotations

import re

STOP = set(
    """a an the is are was were be been being of to in on at for and or but if then so do does did what which who
whom how why when where can could should would will shall may might must it its this that these those there here
with without from by as about into over under than i you he she we they me my your our their them his her tell
explain give describe define please mean means meant understand like difference differences differ between
complete example examples simple simply work works happen happens process some any more also just very
much many one two get got make makes used use using need needs want show list state write brief short detail
detailed step steps""".split()
)

_SUFFIXES = ["ations", "ation", "ating", "ated", "ates", "ate", "ings", "ing", "ed", "es", "ly", "s", "e"]
_WORD = re.compile(r"[a-z0-9]+")


def stem(w: str) -> str:
    if len(w) <= 3 or w.isdigit():
        return w
    for suf in _SUFFIXES:
        if w.endswith(suf) and len(w) - len(suf) >= 3:
            if suf == "s" and w.endswith("ss"):
                return w
            w = w[: -len(suf)]
            break
    if len(w) > 3 and w[-1] == w[-2] and w[-1] in "lnrtp":
        w = w[:-1]
    return w


def tokenize(text: str, keep_stop: bool = False) -> list[str]:
    out = []
    for w in _WORD.findall(text.lower()):
        if not keep_stop and w in STOP:
            continue
        out.append(stem(w))
    return out


# ---------------------------------------------------------------- entities
_ENT: list[tuple[str, str]] = [
    ("reverse tunneling", r"reverse[\s-]*tunnel\w*"),
    ("decapsulation", r"\bde-?\s?encapsulat\w*|\bdecapsulat\w*"),
    ("encapsulation", r"(?<![a-z-])encapsulat\w*"),
    ("tunneling", r"\btunnel\w*"),
    ("home agent", r"\bhome[\s-]*agents?\b|\bHA\b"),
    ("foreign agent", r"\bforeign[\s-]*agents?\b|\bFA\b"),
    ("care-of address", r"\bcare[\s-]*of(?:[\s-]*address(?:es)?)?|\bCoAs?\b"),
    ("home address", r"\bhome\s+address(?:es)?\b"),
    ("mobile node", r"\bmobile\s+(?:node|host)s?\b|\bMN\b"),
    ("correspondent node", r"\bcorrespondent(?:\s+nodes?)?\b|\bCN\b"),
    ("mobility binding", r"\bmobility\s+binding\w*|\bbinding\s+(?:table|list)\b"),
    ("agent discovery", r"\bagent\s+(?:discovery|advertis\w*|solicit\w*)"),
    ("registration", r"\bregistration\w*|\bregistering\b"),
    ("triangle routing", r"\btriangle\s+routing|\btriangular\b"),
    ("packet delivery", r"\bpacket\s+(?:delivery|forwarding|flow)|\bdelivery\s+process|\bdatagram\s+delivery"),
    ("ip header", r"\bip\s+headers?\b|\b(?:inner|outer)\s+headers?\b"),
    ("mobile ip", r"\bmobile[\s-]*ip(?:v4)?\b|\bmipv4\b"),
    ("ip addressing", r"\bip\s+address\w*|\bsubnet\w*|\bcidr\b|\bnetmask\b"),
    ("osi model", r"\bosi\b|\btcp/ip\b|\blayered?\s+(?:model|architecture)"),
    ("routing", r"\brout(?:ing|er|ers|e)\b|\bforwarding table"),
    ("arp", r"\barp\b"),
    ("icmp", r"\bicmp\b"),
    ("tcp", r"\btcp\b"),
    ("udp", r"\budp\b"),
    ("nat", r"\bnat\b"),
    ("error detection", r"\bcrc\b|\bchecksum|\bparity\b|\berror\s+(?:detection|control|correction)"),
    ("multiplexing", r"\bmultiplex\w*|\bfdm\b|\btdm\b"),
    ("switching", r"\b(?:circuit|packet)[\s-]*switch\w*"),
    ("modulation", r"\bmodulat\w*|\bqam\b|\bpsk\b|\bfsk\b|\bask\b"),
    ("flow control", r"\bflow\s+control|\bsliding\s+window|\bstop[\s-]and[\s-]wait"),
    ("ethernet", r"\bethernet\b|\bcsma\b"),
]
_ENT_RE = [(n, re.compile(p, re.I if n not in () else 0)) for n, p in _ENT]

DISPLAY = {
    "care-of address": "Care-of Address",
    "ip header": "IP header",
    "mobile ip": "Mobile IP",
    "ip addressing": "IP addressing",
    "osi model": "OSI model",
    "arp": "ARP", "icmp": "ICMP", "tcp": "TCP", "udp": "UDP", "nat": "NAT",
}


def display(topic: str) -> str:
    return DISPLAY.get(topic, topic.title())


def entities(text: str) -> list[str]:
    """Canonical concept names found in text, in order of appearance (most specific span wins)."""
    spans = []
    for name, rx in _ENT_RE:
        for m in rx.finditer(text):
            spans.append((m.start(), m.end(), name))
    spans.sort(key=lambda s: (s[0], -(s[1] - s[0])))
    accepted: list[tuple[int, int, str]] = []
    for s, e, n in spans:
        if any(a_s <= s and e <= a_e and a_n != n for a_s, a_e, a_n in accepted):
            continue
        accepted.append((s, e, n))
    out: list[str] = []
    for _, _, n in accepted:
        if n not in out:
            out.append(n)
    return out


NET_WORDS = re.compile(
    r"\b(networks?|networking|internet|ip|ipv[46]|packets?|protocols?|routers?|routing|tcp|udp|osi|layers?|"
    r"ethernet|lan|wan|subnets?|subnetting|bandwidth|latency|throughput|modulation|multiplex\w*|signals?|"
    r"frequenc\w+|crc|checksum|parity|switch\w*|gateways?|dns|dhcp|http\w*|wireless|wi-?fi|antenna\w*|lte|"
    r"gsm|tunnel\w*|headers?|datagrams?|arp|icmp|nat|firewalls?|vpn|sockets?|congestion|nyquist|shannon|"
    r"hamming|sampling|bluetooth|fibre|fiber|optical|topolog\w+|csma\w*|aloha|bridges?|vlan|qos|mpls|bgp|"
    r"ospf|rfcs?|ietf|data\s+communications?|transmission|handoff|handover|roaming|cellular|mobility|"
    r"encapsulat\w+|decapsulat\w+|bits?|bytes?|bandwidth|baud|noise|attenuation|channel\s+capacity)\b",
    re.I,
)


def looks_networking(text: str) -> bool:
    return bool(NET_WORDS.search(text)) or bool(entities(text))
