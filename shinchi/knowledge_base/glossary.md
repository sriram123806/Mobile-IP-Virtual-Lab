---
title: Glossary
type: reference
status: starter
---
# Glossary

> Starter notes drafted by an AI assistant from the public Mobile IPv4 RFCs and standard networking textbook knowledge. Not lecturer material: replace or supplement with your own course notes.

### Agent advertisement
A periodic message (ICMP router advertisement with a mobility agent extension) by which home and foreign agents announce themselves and the care-of addresses they offer.

### Care-of address (CoA)
The tunnel-end address on the foreign network where a mobile node can currently be reached; either a foreign agent's address or a co-located address the node obtained itself.

### Correspondent node (CN)
The peer that communicates with the mobile node. It uses the mobile node's home address.

### Decapsulation
Removing the outer IP header at the tunnel exit to recover the original datagram.

### Encapsulation
Adding an outer IP header around the original datagram so it can be carried through a tunnel; the original header is preserved inside.

### Foreign agent (FA)
A router on the visited network that offers a care-of address, relays registrations and decapsulates tunneled datagrams for visiting mobile nodes.

### Foreign network
Any network other than the mobile node's home network that it is currently visiting.

### Home address
The permanent IP address of a mobile node, belonging to its home network.

### Home agent (HA)
A router on the home network that keeps mobility bindings, intercepts datagrams for away mobile nodes and tunnels them to the care-of address.

### Home network
The network whose prefix matches the mobile node's home address.

### Ingress filtering
Dropping datagrams whose source address is not valid for the network they come from; a reason for reverse tunneling.

### IP-in-IP
Encapsulation of an IP datagram inside another IP datagram, protocol number 4 (RFC 2003).

### Mobile node (MN)
A host or router that changes its point of attachment while keeping its home address.

### Mobility binding
The Home Agent's association of a home address with a care-of address and a remaining lifetime.

### Proxy ARP
Answering ARP requests for another host's IP address; used by the Home Agent to capture datagrams for an absent mobile node.

### Registration
The exchange (request and reply, UDP port 434) by which a mobile node tells its Home Agent its care-of address.

### Reverse tunneling
Tunneling the mobile node's outgoing datagrams from the care-of address back to the Home Agent (RFC 3024).

### Triangle routing
The asymmetric path in basic Mobile IPv4: inbound via the Home Agent, outbound directly.

### Tunnel
A path along which a datagram is carried inside another datagram.
