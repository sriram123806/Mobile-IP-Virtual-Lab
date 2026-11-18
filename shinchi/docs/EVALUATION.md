# Evaluation transcript

Embedder: `hash-1024`; language model: `none (extractive fallback mode)`; knowledge base: 99 chunks from 11 documents (AI-drafted starter notes).

Automated keyword/intent checks passed: **18/18**. These checks prove relevant retrieval and correct routing, **not** that every sentence is accurate: read the answers below.

## 1. Hi!

`intent=greeting` `mode=conversational` `PASS`

> Hey! 👋 Welcome! I'm Shinchi, your Mobile IP and Data Communication Networks learning assistant. What would you like to explore today?

## 2. What is your name?

`intent=bot_name` `mode=conversational` `PASS`

> I'm Shinchi! Your friendly networking learning companion. Let's explore Mobile IP together! 🌐

## 3. I am Sriram.

`intent=user_name` `mode=conversational` `PASS`

> Nice to meet you, Sriram! 😊 What would you like to learn today?

## 4. What is Mobile IP?

`intent=technical` `mode=offline_extract` `PASS`

> Here's what the loaded notes say about **Mobile IP** (no language model is configured, so I'm showing the most relevant passages directly):
> 
> **Why Mobile IP exists** [1]
> An IP address does two jobs: it identifies a host and it says where that host is attached (its network prefix). Ordinary routing sends a datagram towards the network named in the destination address. If a laptop moves to a different network but keeps its old address, datagrams still go to the old network and never reach it. If it takes a new address instead, its TCP connections break and other hosts no longer know how to find it.
> 
> Mobile IP (Mobile IPv4, specified in RFC 5944, which replaced RFC 3344) lets a node move between networks while keeping one permanent address, so that connections survive and other hosts need no changes. This section is about Mobile IPv4 only.
> 
> **Q8 [medium] What is tunneling in Mobile IP?** [2]
> Question: What is tunneling in Mobile IP?
> Model answer: Tunneling carries the original datagram, still addressed to the home address, inside a new IP datagram addressed to the care-of address. Routers in between look only at the outer header, so the packet reaches the care-of address.
> 
> **Q1 [easy] What is Mobile IP and what problem does it solve?** [3]
> Question: What is Mobile IP and what problem does it solve?
> Model answer: Mobile IP lets a node keep one permanent IP address while moving between networks. Without it, moving to a new network either breaks connections (the old address is not routable there) or forces a new address that other hosts do not know. Mobile IPv4 is specified in RFC 5944, which replaced RFC 3344.

References: [1] Mobile IP Overview > Why Mobile IP exists; [2] Viva Question Bank > Q8 [medium] What is tunneling in Mobile IP?; [3] Viva Question Bank > Q1 [easy] What is Mobile IP and what problem does it solve?; [4] Mobile IPv4 Scope and Standards Status > Standards; [5] Mobile IPv4 Scope and Standards Status > What this knowledge base covers

Resources: RFC 5944 - IP Mobility Support for IPv4, Revised

## 5. What is a Home Agent?

`intent=technical` `mode=offline_extract` `PASS`

> Here's what the loaded notes say about **Home Agent** (no language model is configured, so I'm showing the most relevant passages directly):
> 
> **Home Agent vs Foreign Agent** [1]
> | | Home Agent | Foreign Agent |
> |---|---|---|
> | Where | Mobile node's home network | Visited (foreign) network |
> | Keeps | Mobility binding for each away mobile node | Visitor list |
> | Intercepts packets for the node's home address | Yes (proxy ARP on the home link) | No |
> | Tunnel role | Starts the forward tunnel (encapsulates) | Ends the forward tunnel when an FA-CoA is used (decapsulates) |
> | Required? | Yes | Optional (co-located CoA works without it) |
> 
> **How the Home Agent intercepts packets** [2]
> The Home Agent must receive datagrams addressed to a mobile node that is not on the home link. It does this with **proxy ARP**: it answers ARP requests for the mobile node's home address on the mobile node's behalf, giving its own link-layer address. When a node registers a new care-of address, the Home Agent also sends **gratuitous ARP** so neighbours update cached entries. When the node returns home, gratuitous ARP restores the correct mapping.
> 
> **Q2 [easy] What is a Home Agent?** [3]
> Question: What is a Home Agent?
> Model answer: The Home Agent is a router on the mobile node's home network. It keeps the mobility binding (home address to care-of address) for each mobile node that is away, intercepts datagrams sent to that home address, and tunnels them to the care-of address.

References: [1] Mobile IP Overview > Home Agent vs Foreign Agent; [2] Packet Delivery and Routing in Mobile IP > How the Home Agent intercepts packets; [3] Viva Question Bank > Q2 [easy] What is a Home Agent?; [4] Glossary > Home agent (HA); [5] Agent Discovery and Registration > Returning home

Resources: RFC 5944 - IP Mobility Support for IPv4, Revised

## 6. What is a Foreign Agent?

`intent=technical` `mode=offline_extract` `PASS`

> Here's what the loaded notes say about **Foreign Agent** (no language model is configured, so I'm showing the most relevant passages directly):
> 
> **Home Agent vs Foreign Agent** [1]
> | | Home Agent | Foreign Agent |
> |---|---|---|
> | Where | Mobile node's home network | Visited (foreign) network |
> | Keeps | Mobility binding for each away mobile node | Visitor list |
> | Intercepts packets for the node's home address | Yes (proxy ARP on the home link) | No |
> | Tunnel role | Starts the forward tunnel (encapsulates) | Ends the forward tunnel when an FA-CoA is used (decapsulates) |
> | Required? | Yes | Optional (co-located CoA works without it) |
> 
> **Foreign Agent responsibilities** [2]
> - Advertise itself and the care-of address it offers.
> - Relay registration requests to the mobile node's Home Agent and relay the replies back; keep the visitor list.
> - Decapsulate tunneled datagrams arriving at its care-of address and deliver the original datagram to the visiting mobile node.
> - When reverse tunneling is used, encapsulate the mobile node's outgoing datagrams towards the Home Agent.
> 
> **Agent discovery** [3]
> Before a mobile node can register it must find out where it is and which agents are around.

References: [1] Mobile IP Overview > Home Agent vs Foreign Agent; [2] Mobile IP Overview > Foreign Agent responsibilities; [3] Agent Discovery and Registration > Agent discovery; [4] Viva Question Bank > Q3 [easy] What is a Foreign Agent?; [5] Glossary > Foreign agent (FA)

Resources: RFC 5944 - IP Mobility Support for IPv4, Revised

## 7. What is a Care-of Address?

`intent=technical` `mode=offline_extract` `PASS`

> Here's what the loaded notes say about **Care-of Address** (no language model is configured, so I'm showing the most relevant passages directly):
> 
> **Two addresses** [1]
> - **Home Address:** the permanent IP address of the mobile node, on its home network. It never changes, and it is the address the correspondent node uses.
> - **Care-of Address (CoA):** the address at the end of the tunnel, valid on the foreign network and used only while the node is away. It is where the Home Agent sends the tunneled datagrams.
> 
> Do not mix them up: the Home Address identifies the mobile node; the Care-of Address describes where it can currently be reached.
> 
> **Q4 [easy] What is a Care-of Address?** [2]
> Question: What is a Care-of Address?
> Model answer: The care-of address is the address at the end of the tunnel on the foreign network, where the mobile node can currently be reached. It is either the foreign agent's address or an address the mobile node acquired itself (co-located). It is different from the permanent home address.
> 
> **Care-of address (CoA)** [3]
> The tunnel-end address on the foreign network where a mobile node can currently be reached; either a foreign agent's address or a co-located address the node obtained itself.

References: [1] Mobile IP Overview > Two addresses; [2] Viva Question Bank > Q4 [easy] What is a Care-of Address?; [3] Glossary > Care-of address (CoA); [4] Viva Question Bank > Q5 [easy] What is the difference between the Home Address and the Care-of Address?; [5] Viva Question Bank > Q22 [medium] What are the two types of care-of address?

Resources: RFC 5944 - IP Mobility Support for IPv4, Revised

## 8. Explain tunneling.

`intent=technical` `mode=offline_extract` `PASS`

> Here's what the loaded notes say about **Tunneling** (no language model is configured, so I'm showing the most relevant passages directly):
> 
> **What is tunneling** [1]
> A **tunnel** is a path along which a datagram is carried *inside* another datagram. The original datagram, still addressed to the mobile node's home address, is wrapped in a new IP datagram that is addressed to the care-of address. Routers between the two tunnel endpoints only look at the outer header, so they route the packet towards the care-of address even though the inner destination is a home address on a distant network.
> 
> **Forward tunnel**
> In Mobile IP the **forward tunnel starts at the Home Agent and ends at the Care-of Address**:
> - Entry point: the Home Agent (it encapsulates).
> - Exit point: the care-of address, which is the foreign agent for an FA-CoA, or the mobile node itself for a co-located CoA (it decapsulates).
> 
> **Tunnel** [2]
> A path along which a datagram is carried inside another datagram.
> 
> **Reverse tunneling** [3]
> Tunneling the mobile node's outgoing datagrams from the care-of address back to the Home Agent (RFC 3024).

References: [1] Tunneling, Encapsulation and Decapsulation > What is tunneling; [2] Glossary > Tunnel; [3] Glossary > Reverse tunneling; [4] Reverse Tunneling > Forward vs reverse tunneling; [5] Viva Question Bank > Q19 [medium] What is reverse tunneling and why is it used?

Resources: RFC 2003 - IP Encapsulation within IP

## 9. What is encapsulation?

`intent=technical` `mode=offline_extract` `PASS`

> Here's what the loaded notes say about **Encapsulation** (no language model is configured, so I'm showing the most relevant passages directly):
> 
> **Encapsulation** [1]
> Adding an outer IP header around the original datagram so it can be carried through a tunnel; the original header is preserved inside.
> 
> **Other encapsulation methods** [2]
> - **IP-in-IP (RFC 2003):** the default described above.
> - **Minimal encapsulation (RFC 2004):** shorter overhead; it inserts a small forwarding header and modifies the original header instead of carrying a complete second copy. It cannot be used on datagrams that are already fragmented.
> - **GRE (generic routing encapsulation):** more general, with a bit more overhead.
> 
> A mobile node and agents negotiate which methods they support (flags M, G in advertisements and registrations).
> 
> **Simplifications**
> These notes describe the usual case. Details such as fragmentation of the outer datagram, DF-bit handling and ICMP errors from inside a tunnel are not covered here.
> 
> **Q10 [medium] What is encapsulation?** [3]
> Question: What is encapsulation?
> Model answer: Encapsulation adds an outer IP header around the original IP datagram. The original datagram, header included, is carried intact as the payload of the new datagram.

References: [1] Glossary > Encapsulation; [2] Tunneling, Encapsulation and Decapsulation > Other encapsulation methods; [3] Viva Question Bank > Q10 [medium] What is encapsulation?; [4] Tunneling, Encapsulation and Decapsulation > What is tunneling; [5] Viva Question Bank > Q13 [medium] What does the outer header contain in IP-in-IP encapsulation?

Resources: RFC 2003 - IP Encapsulation within IP

## 10. What is decapsulation?

`intent=technical` `mode=offline_extract` `PASS`

> Here's what the loaded notes say about **Decapsulation** (no language model is configured, so I'm showing the most relevant passages directly):
> 
> **Decapsulation** [1]
> Removing the outer IP header at the tunnel exit to recover the original datagram.
> 
> **Q11 [medium] What is decapsulation?** [2]
> Question: What is decapsulation?
> Model answer: Decapsulation removes the outer IP header at the tunnel exit and recovers the original datagram, which is then delivered to the mobile node's home address.
> 
> **What is tunneling** [3]
> A **tunnel** is a path along which a datagram is carried *inside* another datagram. The original datagram, still addressed to the mobile node's home address, is wrapped in a new IP datagram that is addressed to the care-of address. Routers between the two tunnel endpoints only look at the outer header, so they route the packet towards the care-of address even though the inner destination is a home address on a distant network.
> 
> **Forward tunnel**
> In Mobile IP the **forward tunnel starts at the Home Agent and ends at the Care-of Address**:
> - Entry point: the Home Agent (it encapsulates).
> - Exit point: the care-of address, which is the foreign agent for an FA-CoA, or the mobile node itself for a co-located CoA (it decapsulates).

References: [1] Glossary > Decapsulation; [2] Viva Question Bank > Q11 [medium] What is decapsulation?; [3] Tunneling, Encapsulation and Decapsulation > What is tunneling; [4] Mobile IP Overview > Two addresses; [5] Tunneling, Encapsulation and Decapsulation > Worked example (documentation address ranges)

Resources: RFC 2003 - IP Encapsulation within IP

## 11. What is the difference between an inner and outer IP header?

`intent=technical` `mode=offline_extract` `PASS`

> Here's what the loaded notes say about **IP header** (no language model is configured, so I'm showing the most relevant passages directly):
> 
> **IP-in-IP (RFC 2003): outer header vs inner header** [1]
> | | Outer header (added) | Inner header (original) |
> |---|---|---|
> | Source address | Tunnel entry point (the Home Agent) | Original sender (the correspondent node) |
> | Destination address | Tunnel exit point (the care-of address) | Mobile node's home address |
> | Protocol field | 4 (IP-in-IP) | Original payload protocol (e.g. TCP) |
> | Who looks at it | All routers along the tunnel | Only the tunnel exit and later hops |
> | Created by | Encapsulator | Original sender |
> 
> **Q14 [hard] What is the difference between the inner and outer IP header?** [2]
> Question: What is the difference between the inner and outer IP header?
> Model answer: The inner header is the original datagram's header (source: correspondent node, destination: home address) and is only examined at the tunnel exit. The outer header is added by the encapsulator (source: tunnel entry, destination: care-of address) and is used by routers along the tunnel.
> 
> **Q13 [medium] What does the outer header contain in IP-in-IP encapsulation?** [3]
> Question: What does the outer header contain in IP-in-IP encapsulation?
> Model answer: The outer source is the tunnel entry point (the Home Agent), the outer destination is the tunnel exit (the care-of address), and the protocol field is 4 for IP-in-IP. The inner header keeps the original source, the home address as destination and the original protocol.

References: [1] Tunneling, Encapsulation and Decapsulation > IP-in-IP (RFC 2003): outer header vs inner header; [2] Viva Question Bank > Q14 [hard] What is the difference between the inner and outer IP header?; [3] Viva Question Bank > Q13 [medium] What does the outer header contain in IP-in-IP encapsulation?; [4] Tunneling, Encapsulation and Decapsulation > What is tunneling; [5] Packet Delivery and Routing in Mobile IP > Complete packet delivery process

Resources: RFC 2003 - IP Encapsulation within IP

## 12. Explain the complete packet delivery process.

`intent=technical` `mode=offline_extract` `PASS`

> Here's what the loaded notes say about **Packet Delivery** (no language model is configured, so I'm showing the most relevant passages directly):
> 
> **Complete packet delivery process** [1]
> With a co-located care-of address, the mobile node decapsulates it itself.
> 
> **Mobile node to correspondent node (return direction)**
> 1. The mobile node sends a datagram with source = home address, destination = CN.
> 2. Without reverse tunneling it is sent via the default router (the FA or a router on the foreign network) and routed **directly** to the correspondent node.
> 3. So the two directions take different paths: CN to MN goes through the Home Agent, MN to CN goes straight back. This is **triangle routing**.
> 
> **Complete packet delivery process** [2]
> Assume the mobile node (MN) is on a foreign network and has already registered its care-of address with its Home Agent (HA).
> 
> **How the Home Agent intercepts packets** [3]
> The Home Agent must receive datagrams addressed to a mobile node that is not on the home link. It does this with **proxy ARP**: it answers ARP requests for the mobile node's home address on the mobile node's behalf, giving its own link-layer address. When a node registers a new care-of address, the Home Agent also sends **gratuitous ARP** so neighbours update cached entries. When the node returns home, gratuitous ARP restores the correct mapping.

References: [1] Packet Delivery and Routing in Mobile IP > Complete packet delivery process; [2] Packet Delivery and Routing in Mobile IP > Complete packet delivery process; [3] Packet Delivery and Routing in Mobile IP > How the Home Agent intercepts packets; [4] Viva Question Bank > Q17 [medium] Describe the complete packet delivery process from a correspondent node to a mobile node.; [5] Packet Delivery and Routing in Mobile IP > Triangle routing

Resources: RFC 5944 - IP Mobility Support for IPv4, Revised

## 13. What happens if the Home Agent cannot find the Mobile Node?

`intent=technical` `mode=offline_extract` `PASS`

> Here's what the loaded notes say about **Home Agent** (no language model is configured, so I'm showing the most relevant passages directly):
> 
> **The Home Agent cannot find the Mobile Node (no binding)** [1]
> **Situation:** a datagram arrives for a home address but the Home Agent has no unexpired mobility binding for it.
> 
> **What happens:** the Home Agent has no care-of address to tunnel to, so it cannot forward it through a tunnel. It treats the node as being on the home link and tries ordinary local delivery (ARP on the home network). If the node is not actually there, nobody answers and the datagram is dropped, typically followed by an ICMP host-unreachable error to the sender. The base protocol does not make the Home Agent buffer or chase the node. (This is reasoned from how the protocol behaves, check your lecture notes for the exact wording.)
> 
> **Agent discovery** [2]
> Before a mobile node can register it must find out where it is and which agents are around.
> 
> **How the Home Agent intercepts packets** [3]
> The Home Agent must receive datagrams addressed to a mobile node that is not on the home link. It does this with **proxy ARP**: it answers ARP requests for the mobile node's home address on the mobile node's behalf, giving its own link-layer address. When a node registers a new care-of address, the Home Agent also sends **gratuitous ARP** so neighbours update cached entries. When the node returns home, gratuitous ARP restores the correct mapping.

References: [1] Failure Scenarios and Troubleshooting > The Home Agent cannot find the Mobile Node (no binding); [2] Agent Discovery and Registration > Agent discovery; [3] Packet Delivery and Routing in Mobile IP > How the Home Agent intercepts packets; [4] Mobile IP Overview > Home Agent vs Foreign Agent; [5] Viva Question Bank > Q34 [hard] What happens if the Home Agent fails?

Resources: RFC 5944 - IP Mobility Support for IPv4, Revised

## 14. What is reverse tunneling?

`intent=technical` `mode=offline_extract` `PASS`

> Here's what the loaded notes say about **Reverse Tunneling** (no language model is configured, so I'm showing the most relevant passages directly):
> 
> **Reverse tunneling** [1]
> Tunneling the mobile node's outgoing datagrams from the care-of address back to the Home Agent (RFC 3024).
> 
> **Forward vs reverse tunneling** [2]
> | | Forward tunnel | Reverse tunnel |
> |---|---|---|
> | Direction | Correspondent to mobile node | Mobile node to correspondent |
> | Starts at | Home Agent | Care-of address (FA or mobile node) |
> | Ends at | Care-of address | Home Agent |
> | Encapsulates | Home Agent | FA or mobile node |
> | Decapsulates | FA or mobile node | Home Agent |
> | Purpose | Deliver packets for the home address | Keep source address topologically correct, avoid ingress filtering |
> 
> **Trade-offs**
> Reverse tunneling removes triangle routing (both directions now pass through the Home Agent), which fixes filtering problems but makes the path longer and puts more load on the Home Agent. The extra outer header also adds overhead.
> 
> **Q19 [medium] What is reverse tunneling and why is it used?** [3]
> Question: What is reverse tunneling and why is it used?
> Model answer: Reverse tunneling sends the mobile node's outgoing datagrams back to the Home Agent through a tunnel from the care-of address, so the Home Agent forwards them with the home address as source. It avoids drops caused by ingress filtering, because outgoing packets no longer carry a topologically incorrect source address. It is specified in RFC 3024.

References: [1] Glossary > Reverse tunneling; [2] Reverse Tunneling > Forward vs reverse tunneling; [3] Viva Question Bank > Q19 [medium] What is reverse tunneling and why is it used?; [4] Viva Question Bank > Q20 [hard] Where does the reverse tunnel start and end?; [5] Reverse Tunneling > Why it is needed

Resources: RFC 2003 - IP Encapsulation within IP; RFC 3024 - Reverse Tunneling for Mobile IP, revised

## 15. Suggest a good book to learn Data Communication Networks.

`intent=resources` `mode=resources` `PASS`

> Here are solid textbooks to learn from. Use your library or the publisher for a legitimate copy:
> 
> - **Data Communications and Networking** (Behrouz A. Forouzan): Layer-by-layer coverage from signals and modulation up to the application layer, with many worked examples. A good first book for an ECE data communication course.
> - **Computer Networking: A Top-Down Approach** (James F. Kurose and Keith W. Ross): Starts with applications and works down to the link layer, with a strong treatment of transport, routing and wireless/mobile networks.
> - **Computer Networks** (Andrew S. Tanenbaum and David J. Wetherall (newer editions list additional authors)): Follows the layers from physical to application, with detailed explanations of protocols and design trade-offs. Good for depth after a first course.

Resources: Data Communications and Networking; Computer Networking: A Top-Down Approach; Computer Networks

## 16. Give me official websites to study Mobile IP.

`intent=resources` `mode=resources` `PASS`

> Good places to study this:
> 
> - [RFC 5944 - IP Mobility Support for IPv4, Revised](https://www.rfc-editor.org/rfc/rfc5944): The current Mobile IPv4 specification: agent discovery, registration, tunneling, mobility bindings.
> - [RFC 3344 - IP Mobility Support for IPv4](https://www.rfc-editor.org/info/rfc3344/) *(Superseded by RFC 5944)*: The earlier Mobile IPv4 specification, kept for historical reference. Use RFC 5944 for the current text.
> - [Internet Engineering Task Force (IETF)](https://www.ietf.org/): The standards body behind the RFCs; starting point for finding and following internet standards.
> - [Cisco Networking Academy](https://www.netacad.com/): Structured networking courses: IP addressing, routing, switching and network fundamentals.
> - [Cloudflare Learning Center](https://www.cloudflare.com/learning/): Short, readable explainers on networking concepts such as IP addresses, DNS, TCP/UDP and tunneling.
> - [GeeksforGeeks: Computer Networks](https://www.geeksforgeeks.org/computer-network-tutorials/): Tutorial articles on computer-network topics (layers, addressing, routing, error control) with worked examples.
> 
> Note: RFC 3344 is the older Mobile IPv4 specification and has been superseded by RFC 5944, so use RFC 5944 for the current text.

Resources: RFC 5944 - IP Mobility Support for IPv4, Revised; RFC 3344 - IP Mobility Support for IPv4; Internet Engineering Task Force (IETF); Cisco Networking Academy; Cloudflare Learning Center; GeeksforGeeks: Computer Networks

## 17. Ask me difficult DCN viva questions.

`intent=quiz` `mode=quiz` `PASS`

> Here are 5 hard viva questions from the question bank. Try answering in your own words first, then say **show the answers**.
> 
> 1. *[hard]* What is longest-prefix match in IP routing? [1]
> 2. *[hard]* A channel has 3 kHz bandwidth and 30 dB SNR. What is the Shannon capacity? [2]
> 3. *[hard]* What is the difference between a router and a layer-2 switch? [3]
> 4. *[hard]* What is the difference between flow control and congestion control? [4]
> 5. *[hard]* Why is CRC better than a simple checksum at detecting burst errors? [5]

References: [1] Viva Question Bank > Q37 [hard] What is longest-prefix match in IP routing?; [2] Viva Question Bank > Q42 [hard] A channel has 3 kHz bandwidth and 30 dB SNR. What is the Shannon capacity?; [3] Viva Question Bank > Q44 [hard] What is the difference between a router and a layer-2 switch?; [4] Viva Question Bank > Q39 [hard] What is the difference between flow control and congestion control?; [5] Viva Question Bank > Q36 [hard] Why is CRC better than a simple checksum at detecting burst errors?

## 18. What is the responsibility of the agent you just explained?

`intent=technical` `mode=offline_extract` `PASS` interpreted as: *What is the responsibility of the Home Agent?*

> Here's what the loaded notes say about **Home Agent** (no language model is configured, so I'm showing the most relevant passages directly):
> 
> **Home Agent vs Foreign Agent** [1]
> | | Home Agent | Foreign Agent |
> |---|---|---|
> | Where | Mobile node's home network | Visited (foreign) network |
> | Keeps | Mobility binding for each away mobile node | Visitor list |
> | Intercepts packets for the node's home address | Yes (proxy ARP on the home link) | No |
> | Tunnel role | Starts the forward tunnel (encapsulates) | Ends the forward tunnel when an FA-CoA is used (decapsulates) |
> | Required? | Yes | Optional (co-located CoA works without it) |
> 
> **How the Home Agent intercepts packets** [2]
> The Home Agent must receive datagrams addressed to a mobile node that is not on the home link. It does this with **proxy ARP**: it answers ARP requests for the mobile node's home address on the mobile node's behalf, giving its own link-layer address. When a node registers a new care-of address, the Home Agent also sends **gratuitous ARP** so neighbours update cached entries. When the node returns home, gratuitous ARP restores the correct mapping.
> 
> **Q2 [easy] What is a Home Agent?** [3]
> Question: What is a Home Agent?
> Model answer: The Home Agent is a router on the mobile node's home network. It keeps the mobility binding (home address to care-of address) for each mobile node that is away, intercepts datagrams sent to that home address, and tunnels them to the care-of address.

References: [1] Mobile IP Overview > Home Agent vs Foreign Agent; [2] Packet Delivery and Routing in Mobile IP > How the Home Agent intercepts packets; [3] Viva Question Bank > Q2 [easy] What is a Home Agent?; [4] Glossary > Home agent (HA); [5] Viva Question Bank > Q34 [hard] What happens if the Home Agent fails?

Resources: RFC 5944 - IP Mobility Support for IPv4, Revised
