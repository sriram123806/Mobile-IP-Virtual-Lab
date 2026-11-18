---
title: Agent Discovery and Registration
type: notes
status: starter
---
# Agent Discovery and Registration

> Starter notes drafted by an AI assistant from the public Mobile IPv4 RFCs and standard networking textbook knowledge. Not lecturer material: replace or supplement with your own course notes.

## Agent discovery
Before a mobile node can register it must find out where it is and which agents are around.

- **Agent advertisement:** home agents and foreign agents periodically announce themselves. In Mobile IPv4 this is an ICMP Router Advertisement message with a *mobility agent advertisement extension*. It tells the node whether the sender is a home agent, a foreign agent or both, lists the care-of addresses on offer, and states the maximum registration lifetime.
- **Agent solicitation:** a mobile node that does not want to wait can send an ICMP Router Solicitation to prompt an advertisement immediately.
- **Move detection:** by comparing advertisements (which agent, which network prefix, whether advertisements stop arriving) the node decides whether it is at home or on a foreign network.

Some flag bits in the advertisement are worth knowing: **H** (sender is a home agent), **F** (sender is a foreign agent), **R** (registration with the foreign agent is required even with a co-located care-of address), **B** (busy: foreign agent cannot accept more registrations), **M** and **G** (minimal and GRE encapsulation supported), **T** (reverse tunneling supported).

## Registration
Registration tells the Home Agent where the mobile node is. The messages are UDP datagrams sent to **port 434**.

**Registration Request** (mobile node to Home Agent) carries, among other things: the home address, the home agent address, the care-of address, the requested lifetime, an Identification value (to prevent replay) and flags such as **D** (the mobile node itself decapsulates, i.e. co-located CoA), **T** (reverse tunneling requested), **M**/**G** (encapsulation type). It must include the **Mobile-Home Authentication Extension**, a keyed authentication value computed with the secret shared between the mobile node and its Home Agent.

**Registration Reply** (Home Agent to mobile node) carries a result **code** (0 means accepted; other codes explain a refusal), the lifetime actually granted, the home address and home agent address.

### Registration through a foreign agent
1. The mobile node sends the Registration Request to the foreign agent.
2. The foreign agent checks it, records the request as pending in its visitor list and relays it to the Home Agent.
3. The Home Agent authenticates the request, creates or updates the mobility binding, and sends the Registration Reply back to the foreign agent.
4. The foreign agent updates its visitor list and passes the reply to the mobile node.

### Registration with a co-located care-of address
The mobile node sends the Registration Request straight to its Home Agent (unless the foreign network's advertisement says registration via the FA is required) and receives the reply directly.

## Lifetime and renewal
The granted lifetime (seconds) bounds how long the binding exists. The mobile node must re-register before it expires. The Home Agent may grant less than requested. A lifetime of 0 in a request means deregistration.

## Returning home
When the mobile node comes back to its home network it **deregisters** with its Home Agent (registration with lifetime 0). The Home Agent removes the binding, stops intercepting datagrams for that address and sends gratuitous ARP so that neighbours learn the mobile node's real link-layer address again. After that, datagrams are delivered normally with no tunnel.

## Why authentication matters
A forged registration could redirect someone's traffic to an attacker's care-of address. That is why every registration request and reply is authenticated and carries replay protection.
