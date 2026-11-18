---
title: Mobile IP Overview
type: notes
status: starter
---
# Mobile IP Overview

> Starter notes drafted by an AI assistant from the public Mobile IPv4 RFCs and standard networking textbook knowledge. Not lecturer material: replace or supplement with your own course notes.

## Why Mobile IP exists
An IP address does two jobs: it identifies a host and it says where that host is attached (its network prefix). Ordinary routing sends a datagram towards the network named in the destination address. If a laptop moves to a different network but keeps its old address, datagrams still go to the old network and never reach it. If it takes a new address instead, its TCP connections break and other hosts no longer know how to find it.

Mobile IP (Mobile IPv4, specified in RFC 5944, which replaced RFC 3344) lets a node move between networks while keeping one permanent address, so that connections survive and other hosts need no changes. This section is about Mobile IPv4 only.

## The players
- **Mobile Node (MN):** the host or router that changes its point of attachment.
- **Correspondent Node (CN):** the peer the mobile node communicates with. It can be fixed or mobile and does not need to know about Mobile IP.
- **Home network:** the network whose prefix matches the mobile node's permanent address.
- **Foreign network:** any other network the mobile node is visiting.
- **Home Agent (HA):** a router on the home network. It keeps the mobility binding, intercepts datagrams sent to the mobile node's home address while it is away, and tunnels them to the mobile node's current care-of address.
- **Foreign Agent (FA):** a router on the foreign network that offers a care-of address, relays registration messages, decapsulates tunneled datagrams and delivers them to the visiting mobile node. A foreign agent is optional: a mobile node can use a co-located care-of address instead.

## Home Agent responsibilities
- Keep the mobility binding (home address, care-of address, lifetime) for every mobile node that is away.
- Accept, authenticate and answer registration requests (grant, shorten or refuse the lifetime).
- Intercept datagrams addressed to the mobile node's home address (proxy ARP on the home link).
- Encapsulate those datagrams and tunnel them to the care-of address (it starts the forward tunnel).
- When reverse tunneling is used, decapsulate datagrams coming back from the care-of address and forward them to the correspondent.
- When the node returns home, remove the binding and restore normal delivery (gratuitous ARP).

## Foreign Agent responsibilities
- Advertise itself and the care-of address it offers.
- Relay registration requests to the mobile node's Home Agent and relay the replies back; keep the visitor list.
- Decapsulate tunneled datagrams arriving at its care-of address and deliver the original datagram to the visiting mobile node.
- When reverse tunneling is used, encapsulate the mobile node's outgoing datagrams towards the Home Agent.

## Two addresses
- **Home Address:** the permanent IP address of the mobile node, on its home network. It never changes, and it is the address the correspondent node uses.
- **Care-of Address (CoA):** the address at the end of the tunnel, valid on the foreign network and used only while the node is away. It is where the Home Agent sends the tunneled datagrams.

Do not mix them up: the Home Address identifies the mobile node; the Care-of Address describes where it can currently be reached.

### Two kinds of care-of address
1. **Foreign-agent care-of address (FA-CoA):** the IP address of the foreign agent itself. Many visiting mobile nodes can share it. The foreign agent decapsulates and delivers the original datagram to the mobile node.
2. **Co-located care-of address:** an address the mobile node obtains for itself on the foreign network (for example by DHCP) and attaches to one of its own interfaces. The mobile node decapsulates the tunneled datagrams itself and registers directly with its Home Agent.

## Mobility binding
The Home Agent stores, for each registered mobile node that is away, a **mobility binding**: the mapping from home address to care-of address, together with the remaining registration lifetime. When the lifetime runs out without a renewed registration, the binding is deleted. The foreign agent keeps a separate *visitor list* of the mobile nodes currently registered through it.

## Big picture in four steps
1. The mobile node learns it is on a foreign network (agent discovery) and gets a care-of address.
2. It registers that care-of address with its Home Agent (registration), directly or through the foreign agent.
3. The Home Agent intercepts datagrams for the home address and tunnels them to the care-of address.
4. At the end of the tunnel the datagram is decapsulated and delivered to the mobile node.

## Home Agent vs Foreign Agent
| | Home Agent | Foreign Agent |
|---|---|---|
| Where | Mobile node's home network | Visited (foreign) network |
| Keeps | Mobility binding for each away mobile node | Visitor list |
| Intercepts packets for the node's home address | Yes (proxy ARP on the home link) | No |
| Tunnel role | Starts the forward tunnel (encapsulates) | Ends the forward tunnel when an FA-CoA is used (decapsulates) |
| Required? | Yes | Optional (co-located CoA works without it) |
