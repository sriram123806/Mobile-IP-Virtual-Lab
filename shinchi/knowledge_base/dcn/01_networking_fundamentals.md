---
title: Networking Fundamentals
type: notes
status: starter
---
# Networking Fundamentals

> Starter notes drafted by an AI assistant from the public Mobile IPv4 RFCs and standard networking textbook knowledge. Not lecturer material: replace or supplement with your own course notes.

## OSI and TCP/IP layers
The OSI model has seven layers: physical, data link, network, transport, session, presentation, application. The TCP/IP model groups them into four or five: link (physical + data link), internet (network), transport, application.
- **Physical:** bits on the medium (signals, cables, radio).
- **Data link:** frames between neighbouring devices on one link; MAC addressing, error detection (e.g. Ethernet, Wi-Fi).
- **Network:** end-to-end delivery across networks; IP addressing and routing. Mobile IP works here.
- **Transport:** process-to-process delivery; TCP (reliable, connection-oriented) and UDP (unreliable, connectionless).
- **Application:** protocols used by programs (HTTP, DNS, SMTP).

## IPv4 addressing
An IPv4 address is 32 bits, written as four decimal bytes (e.g. 192.0.2.10). It has a network part and a host part.
- **Classful addressing (historical):** class A (first octet 1-126, /8), B (128-191, /16), C (192-223, /24).
- **CIDR:** the prefix length is arbitrary, written /n (e.g. 192.0.2.0/26). The mask has n leading ones.

### Subnetting example
Network 192.168.10.0/24, split into 4 equal subnets: borrow 2 bits, so the prefix becomes /26 (mask 255.255.255.192). Each subnet has 64 addresses, 62 usable hosts (minus the network and broadcast addresses): 192.168.10.0/26, .64/26, .128/26, .192/26.

## Routing basics
A router forwards a datagram by looking up the destination address in its routing table using the **longest-prefix match** and sending it to the corresponding next hop. Each router decrements the TTL; a datagram whose TTL reaches zero is discarded and an ICMP time-exceeded message is sent. Routing protocols (RIP, OSPF, BGP) build the tables.

## ARP
Address Resolution Protocol maps an IP address on the local link to a link-layer (MAC) address. A host broadcasts "who has this IP?"; the owner replies with its MAC. **Proxy ARP** is when a device answers for another host (a Mobile IP home agent does this). **Gratuitous ARP** announces or updates a mapping without being asked.

## ICMP
Internet Control Message Protocol carries error and diagnostic messages (destination unreachable, time exceeded, echo request/reply used by ping).

## TCP vs UDP
- **TCP:** connection set-up (three-way handshake), reliable ordered delivery, flow and congestion control.
- **UDP:** no connection, no guarantee; low overhead. Mobile IP registration messages use UDP port 434.

## NAT
Network Address Translation rewrites addresses (and usually ports) at a router so that many private hosts share one public address.
