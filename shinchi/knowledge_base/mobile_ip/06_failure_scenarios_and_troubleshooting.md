---
title: Failure Scenarios and Troubleshooting
type: notes
status: starter
---
# Failure Scenarios and Troubleshooting

> Starter notes drafted by an AI assistant from the public Mobile IPv4 RFCs and standard networking textbook knowledge. Not lecturer material: replace or supplement with your own course notes.

## The Home Agent cannot find the Mobile Node (no binding)
**Situation:** a datagram arrives for a home address but the Home Agent has no unexpired mobility binding for it.

**What happens:** the Home Agent has no care-of address to tunnel to, so it cannot forward it through a tunnel. It treats the node as being on the home link and tries ordinary local delivery (ARP on the home network). If the node is not actually there, nobody answers and the datagram is dropped, typically followed by an ICMP host-unreachable error to the sender. The base protocol does not make the Home Agent buffer or chase the node. (This is reasoned from how the protocol behaves, check your lecture notes for the exact wording.)

**Typical causes:** the binding expired because the mobile node did not re-register in time; the registration was rejected; the mobile node lost connectivity; or the mobile node is registered with a different care-of address than expected.

**What to check:** was the node's last registration accepted (reply code 0)? Has its lifetime expired? Is there a binding in the Home Agent table? Is the mobile node still reachable on the foreign network?

## Stale care-of address
If the mobile node moved but has not yet registered the new care-of address, the Home Agent keeps tunneling to the old one. Packets are lost until the new registration is accepted. Prompt move detection and re-registration shorten this gap.

## Registration rejected
Registration replies carry a code. Code 0 means accepted. Refusals include, for example, mobile node failed authentication (the shared secret or authentication data is wrong), identification mismatch (replay protection, often clock or nonce problems), and administratively prohibited. A foreign agent can also refuse, for instance if the requested lifetime is too long. Check the exact code table in RFC 5944.

## Authentication failure
Wrong shared secret, wrong security parameter index or mismatched Identification means the Home Agent refuses the request, so no binding is created and the node is unreachable at its home address while away.

## Binding lifetime expiry
Bindings are soft state. If the mobile node stops renewing (battery, signal, software) the Home Agent removes the binding when the lifetime reaches zero and datagrams stop reaching the node.

## Home Agent failure
While the Home Agent is down nothing intercepts datagrams for the mobile node's home address and the mobile node cannot register or renew. The base Mobile IPv4 specification, as far as these notes are concerned, does not define how several Home Agents share binding state; redundancy is handled by deployment-specific arrangements. Do not assume a standard failover mechanism exists.

## Foreign Agent failure
If the foreign agent fails, datagrams tunneled to its address cannot be decapsulated and delivered, and the visitor list is lost. The mobile node detects missing advertisements and must discover another agent or obtain a co-located care-of address and register again.

## Care-of address unreachable
If the tunnel exit cannot be reached (routing or firewall problems, protocol 4 blocked), the tunneled datagrams are dropped even though registration succeeded. Check connectivity from the Home Agent to the care-of address and whether IP protocol 4 is allowed.
