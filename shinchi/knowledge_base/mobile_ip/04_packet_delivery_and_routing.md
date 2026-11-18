---
title: Packet Delivery and Routing in Mobile IP
type: notes
status: starter
---
# Packet Delivery and Routing in Mobile IP

> Starter notes drafted by an AI assistant from the public Mobile IPv4 RFCs and standard networking textbook knowledge. Not lecturer material: replace or supplement with your own course notes.

## Complete packet delivery process
Assume the mobile node (MN) is on a foreign network and has already registered its care-of address with its Home Agent (HA).

### Correspondent node to mobile node (forward direction)
1. The correspondent node (CN) sends a normal IP datagram to the mobile node's **home address**. It knows nothing about the move.
2. Normal routing delivers the datagram to the **home network**.
3. The Home Agent **intercepts** it (see proxy ARP below) because it holds a mobility binding for that address.
4. The Home Agent **encapsulates** it: it adds an outer IP header whose destination is the care-of address, protocol 4.
5. The tunneled datagram is routed across the Internet to the care-of address using only the outer header (the **forward tunnel**: HA to care-of address).
6. At the care-of address the datagram is **decapsulated**: the outer header is removed and the original datagram is recovered.
7. With a foreign agent, the FA delivers the original datagram over the foreign link to the mobile node (using the home address from the inner header and the node's link-layer address). With a co-located care-of address, the mobile node decapsulates it itself.

### Mobile node to correspondent node (return direction)
1. The mobile node sends a datagram with source = home address, destination = CN.
2. Without reverse tunneling it is sent via the default router (the FA or a router on the foreign network) and routed **directly** to the correspondent node.
3. So the two directions take different paths: CN to MN goes through the Home Agent, MN to CN goes straight back. This is **triangle routing**.

## How the Home Agent intercepts packets
The Home Agent must receive datagrams addressed to a mobile node that is not on the home link. It does this with **proxy ARP**: it answers ARP requests for the mobile node's home address on the mobile node's behalf, giving its own link-layer address. When a node registers a new care-of address, the Home Agent also sends **gratuitous ARP** so neighbours update cached entries. When the node returns home, gratuitous ARP restores the correct mapping.

## Triangle routing
Triangle routing is the asymmetric path described above. It is simple and needs no changes at the correspondent node, but it can be inefficient: if the mobile node and correspondent node are close to each other and far from the home network, traffic still detours through the home network in one direction.

## Routing when the node is at home
If the mobile node is on its home network, no tunnel is used. The Home Agent behaves as an ordinary router for that address.

## Simplified
These steps show the common case of a foreign-agent care-of address. Option handling, simultaneous bindings and broadcast forwarding are not covered.
