---
title: Tunneling, Encapsulation and Decapsulation
type: notes
status: starter
---
# Tunneling, Encapsulation and Decapsulation

> Starter notes drafted by an AI assistant from the public Mobile IPv4 RFCs and standard networking textbook knowledge. Not lecturer material: replace or supplement with your own course notes.

## What is tunneling
A **tunnel** is a path along which a datagram is carried *inside* another datagram. The original datagram, still addressed to the mobile node's home address, is wrapped in a new IP datagram that is addressed to the care-of address. Routers between the two tunnel endpoints only look at the outer header, so they route the packet towards the care-of address even though the inner destination is a home address on a distant network.

## Forward tunnel
In Mobile IP the **forward tunnel starts at the Home Agent and ends at the Care-of Address**:
- Entry point: the Home Agent (it encapsulates).
- Exit point: the care-of address, which is the foreign agent for an FA-CoA, or the mobile node itself for a co-located CoA (it decapsulates).

## Encapsulation
**Encapsulation** adds an **outer IP header** around the original IP datagram. The original datagram, header and payload, is carried unchanged as the payload of the new datagram. The original header is **not replaced**; it is preserved inside so the exit point can recover it.

## Decapsulation
**Decapsulation** is the opposite step at the tunnel exit: remove the outer header and recover the original datagram, which is then delivered to its real destination (the mobile node's home address).

## IP-in-IP (RFC 2003): outer header vs inner header
| | Outer header (added) | Inner header (original) |
|---|---|---|
| Source address | Tunnel entry point (the Home Agent) | Original sender (the correspondent node) |
| Destination address | Tunnel exit point (the care-of address) | Mobile node's home address |
| Protocol field | 4 (IP-in-IP) | Original payload protocol (e.g. TCP) |
| Who looks at it | All routers along the tunnel | Only the tunnel exit and later hops |
| Created by | Encapsulator | Original sender |

The outer header's length, identification and checksum are computed fresh for the new datagram. The inner header is carried as it was; as with any forwarded datagram, the TTL is decremented once by the forwarding node (the encapsulator), and the decapsulator does not change the inner header.

## Worked example (documentation address ranges)
- Home network 192.0.2.0/24; mobile node home address **192.0.2.10**; Home Agent **192.0.2.1**.
- Foreign network 198.51.100.0/24; foreign agent (care-of address) **198.51.100.1**.
- Correspondent node **203.0.113.7**.

1. CN sends: `src 203.0.113.7, dst 192.0.2.10` (inner header).
2. The datagram reaches the home network; the Home Agent intercepts it.
3. HA encapsulates: outer `src 192.0.2.1, dst 198.51.100.1, protocol 4`, followed by the unchanged inner datagram.
4. The Internet routes the datagram to 198.51.100.1 using only the outer header.
5. FA decapsulates, recovering `src 203.0.113.7, dst 192.0.2.10`, and delivers it to the mobile node on the foreign link.

## Other encapsulation methods
- **IP-in-IP (RFC 2003):** the default described above.
- **Minimal encapsulation (RFC 2004):** shorter overhead; it inserts a small forwarding header and modifies the original header instead of carrying a complete second copy. It cannot be used on datagrams that are already fragmented.
- **GRE (generic routing encapsulation):** more general, with a bit more overhead.

A mobile node and agents negotiate which methods they support (flags M, G in advertisements and registrations).

## Simplifications
These notes describe the usual case. Details such as fragmentation of the outer datagram, DF-bit handling and ICMP errors from inside a tunnel are not covered here.
