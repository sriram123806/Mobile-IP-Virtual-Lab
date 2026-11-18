---
title: Reverse Tunneling
type: notes
status: starter
---
# Reverse Tunneling

> Starter notes drafted by an AI assistant from the public Mobile IPv4 RFCs and standard networking textbook knowledge. Not lecturer material: replace or supplement with your own course notes.

## Why it is needed
In basic Mobile IPv4 the mobile node sends outgoing datagrams directly, with its **home address** as the source address. That causes problems:
- **Ingress filtering:** routers on the foreign network (or its provider) may drop datagrams whose source address does not belong to the network they come from. A home address is topologically wrong on the foreign network, so such packets can be discarded.
- Firewalls and other policies can similarly block packets with an unexpected source.
- Multicast and TTL handling can behave unexpectedly when the node is away from home.

**Reverse tunneling** (RFC 3024) solves this by tunneling the mobile node's outgoing datagrams back to the Home Agent.

## How it works
1. The mobile node requests it by setting the **T** flag in its Registration Request (the agent advertisement shows whether the agent supports it).
2. The mobile node's outgoing datagram (source = home address, destination = CN) is encapsulated at the care-of address end: the outer header has source = care-of address and destination = Home Agent.
3. The **reverse tunnel runs from the care-of address to the Home Agent**. The encapsulator is the foreign agent for an FA-CoA, or the mobile node itself for a co-located CoA.
4. The Home Agent decapsulates the datagram and forwards the original datagram to the correspondent node, with the home address as the source, from the home network.

## Forward vs reverse tunneling
| | Forward tunnel | Reverse tunnel |
|---|---|---|
| Direction | Correspondent to mobile node | Mobile node to correspondent |
| Starts at | Home Agent | Care-of address (FA or mobile node) |
| Ends at | Care-of address | Home Agent |
| Encapsulates | Home Agent | FA or mobile node |
| Decapsulates | FA or mobile node | Home Agent |
| Purpose | Deliver packets for the home address | Keep source address topologically correct, avoid ingress filtering |

## Trade-offs
Reverse tunneling removes triangle routing (both directions now pass through the Home Agent), which fixes filtering problems but makes the path longer and puts more load on the Home Agent. The extra outer header also adds overhead.
