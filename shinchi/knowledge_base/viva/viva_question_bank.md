---
title: Viva Question Bank
type: viva
status: starter
---
# Viva Question Bank

> Starter notes drafted by an AI assistant from the public Mobile IPv4 RFCs and standard networking textbook knowledge. Not lecturer material: replace or supplement with your own course notes.

### Q1 [easy] What is Mobile IP and what problem does it solve?
**Answer:** Mobile IP lets a node keep one permanent IP address while moving between networks. Without it, moving to a new network either breaks connections (the old address is not routable there) or forces a new address that other hosts do not know. Mobile IPv4 is specified in RFC 5944, which replaced RFC 3344.

### Q2 [easy] What is a Home Agent?
**Answer:** The Home Agent is a router on the mobile node's home network. It keeps the mobility binding (home address to care-of address) for each mobile node that is away, intercepts datagrams sent to that home address, and tunnels them to the care-of address.

### Q3 [easy] What is a Foreign Agent?
**Answer:** A Foreign Agent is a router on the visited network that advertises care-of addresses, relays registration messages between the mobile node and its Home Agent, and decapsulates tunneled datagrams to deliver them to the visiting mobile node. It is optional because a mobile node can use a co-located care-of address.

### Q4 [easy] What is a Care-of Address?
**Answer:** The care-of address is the address at the end of the tunnel on the foreign network, where the mobile node can currently be reached. It is either the foreign agent's address or an address the mobile node acquired itself (co-located). It is different from the permanent home address.

### Q5 [easy] What is the difference between the Home Address and the Care-of Address?
**Answer:** The home address is permanent and identifies the mobile node; correspondents use it. The care-of address is temporary and describes where the node currently is; only the Home Agent uses it as the tunnel destination.

### Q6 [easy] Who is the Correspondent Node?
**Answer:** The correspondent node is the peer that communicates with the mobile node. It sends datagrams to the mobile node's home address and does not need to know about Mobile IP. It is not the same as the mobile node.

### Q7 [medium] What is the mobility binding?
**Answer:** It is the Home Agent's record that associates a mobile node's home address with its current care-of address, along with the remaining registration lifetime. It is created or updated by an accepted registration and removed when the lifetime expires or the node deregisters.

### Q8 [medium] What is tunneling in Mobile IP?
**Answer:** Tunneling carries the original datagram, still addressed to the home address, inside a new IP datagram addressed to the care-of address. Routers in between look only at the outer header, so the packet reaches the care-of address.

### Q9 [medium] Where does the forward tunnel start and end?
**Answer:** The forward tunnel starts at the Home Agent, which encapsulates, and ends at the care-of address: the foreign agent for an FA-CoA, or the mobile node for a co-located CoA, which decapsulates.

### Q10 [medium] What is encapsulation?
**Answer:** Encapsulation adds an outer IP header around the original IP datagram. The original datagram, header included, is carried intact as the payload of the new datagram.

### Q11 [medium] What is decapsulation?
**Answer:** Decapsulation removes the outer IP header at the tunnel exit and recovers the original datagram, which is then delivered to the mobile node's home address.

### Q12 [hard] Why isn't the original IP header simply replaced during encapsulation?
**Answer:** The tunnel exit needs the original source and destination to deliver the datagram to the mobile node, so the original header must survive. Putting a complete new outer header in front keeps the original datagram intact; the outer header only steers it between the tunnel endpoints.

### Q13 [medium] What does the outer header contain in IP-in-IP encapsulation?
**Answer:** The outer source is the tunnel entry point (the Home Agent), the outer destination is the tunnel exit (the care-of address), and the protocol field is 4 for IP-in-IP. The inner header keeps the original source, the home address as destination and the original protocol.

### Q14 [hard] What is the difference between the inner and outer IP header?
**Answer:** The inner header is the original datagram's header (source: correspondent node, destination: home address) and is only examined at the tunnel exit. The outer header is added by the encapsulator (source: tunnel entry, destination: care-of address) and is used by routers along the tunnel.

### Q15 [medium] How does the Home Agent receive packets meant for an absent mobile node?
**Answer:** It uses proxy ARP on the home link, answering ARP requests for the mobile node's home address with its own link-layer address, and sends gratuitous ARP when the binding is created. Packets sent to the home address therefore arrive at the Home Agent.

### Q16 [hard] Why does the Home Agent answer ARP for a node that is not there?
**Answer:** The correspondent's traffic is routed to the home network and then needs a link-layer address on that link. The mobile node is away, so the Home Agent claims the address (proxy ARP) to capture the datagrams and tunnel them.

### Q17 [medium] Describe the complete packet delivery process from a correspondent node to a mobile node.
**Answer:** CN sends to the home address; routing delivers it to the home network; the Home Agent intercepts it using proxy ARP; it encapsulates it with the care-of address as outer destination; the tunneled datagram is routed to the care-of address; the original datagram is decapsulated there; the foreign agent (or the mobile node itself) delivers it to the mobile node.

### Q18 [medium] What is triangle routing?
**Answer:** Triangle routing is the asymmetric path in basic Mobile IPv4: datagrams from the correspondent go to the home network, through the Home Agent and tunnel to the mobile node, while the mobile node's replies go directly to the correspondent.

### Q19 [medium] What is reverse tunneling and why is it used?
**Answer:** Reverse tunneling sends the mobile node's outgoing datagrams back to the Home Agent through a tunnel from the care-of address, so the Home Agent forwards them with the home address as source. It avoids drops caused by ingress filtering, because outgoing packets no longer carry a topologically incorrect source address. It is specified in RFC 3024.

### Q20 [hard] Where does the reverse tunnel start and end?
**Answer:** It starts at the care-of address (the foreign agent for an FA-CoA, or the mobile node for a co-located CoA), which encapsulates, and ends at the Home Agent, which decapsulates and forwards the original datagram.

### Q21 [medium] What does the Home Agent do when it receives a datagram for a mobile node with no binding?
**Answer:** With no unexpired binding it has no care-of address to tunnel to, so it treats the node as being on the home link and attempts local delivery. If the node is not there the datagram is dropped, usually with an ICMP unreachable error to the sender.

### Q22 [medium] What are the two types of care-of address?
**Answer:** A foreign-agent care-of address, which is the foreign agent's own address shared by visitors and where the FA decapsulates, and a co-located care-of address, which the mobile node obtains itself (for example by DHCP) and where it decapsulates.

### Q23 [medium] How does a mobile node learn about agents on a network?
**Answer:** Through agent advertisements (ICMP router advertisements with a mobility agent extension) sent periodically by agents, or by sending an agent solicitation to prompt one.

### Q24 [easy] What transport and port does Mobile IPv4 registration use?
**Answer:** Registration requests and replies are UDP messages sent to port 434.

### Q25 [hard] Why must registration messages be authenticated?
**Answer:** Without authentication anyone could send a forged registration and redirect a mobile node's traffic to a care-of address of their choice. Mobile IPv4 requires a Mobile-Home authentication extension, and the Identification field provides replay protection.

### Q26 [medium] What happens when the mobile node returns to its home network?
**Answer:** It deregisters with its Home Agent (lifetime zero). The Home Agent deletes the binding, stops proxy ARP and sends gratuitous ARP so neighbours learn the real link-layer address, and datagrams are delivered normally without a tunnel.

### Q27 [easy] What does the OSI network layer do?
**Answer:** It moves packets from source to destination across multiple networks, using logical addressing (IP) and routing.

### Q28 [medium] Explain TCP versus UDP.
**Answer:** TCP is connection-oriented and gives reliable, ordered delivery with flow and congestion control. UDP is connectionless, adds almost no overhead and gives no delivery guarantee.

### Q29 [medium] What is subnetting? Subnet 192.168.10.0/24 into four equal subnets.
**Answer:** Subnetting divides a network by borrowing host bits for the network part. Borrowing 2 bits gives /26 (mask 255.255.255.192): 192.168.10.0/26, 192.168.10.64/26, 192.168.10.128/26 and 192.168.10.192/26, each with 62 usable hosts.

### Q30 [hard] State the Shannon capacity formula and explain it.
**Answer:** C = B log2(1 + SNR), where B is the bandwidth in Hz and SNR is the signal-to-noise power ratio (not in dB). It is the theoretical upper limit on error-free data rate over a noisy channel.

### Q31 [medium] How does CRC detect errors?
**Answer:** The sender divides the data (with zeros appended) by a generator polynomial and appends the remainder, so the transmitted frame is divisible by the generator. The receiver divides again; a non-zero remainder means an error. CRC is especially good at detecting burst errors.

### Q32 [medium] Compare circuit switching and packet switching.
**Answer:** Circuit switching reserves a dedicated path for the whole call: constant delay but wasted capacity when idle. Packet switching sends independently routed packets, giving better utilisation for bursty data but variable delay.

### Q33 [hard] What does ARP do and what is special about proxy ARP?
**Answer:** ARP maps an IP address to a link-layer address on the local network. Proxy ARP means a device answers ARP requests on behalf of another host; a Mobile IP Home Agent uses it to capture traffic for absent mobile nodes.

### Q34 [hard] What happens if the Home Agent fails?
**Answer:** While it is down, nothing intercepts or tunnels datagrams for the mobile node's home address and the node cannot register or renew its binding. The base Mobile IPv4 specification does not define a standard way for Home Agents to share binding state, so redundancy is deployment-specific.

### Q35 [hard] Why is RFC 3344 not the current Mobile IPv4 specification?
**Answer:** RFC 5944 is the revised specification and obsoletes RFC 3344. RFC 3344 remains useful as historical background, but RFC 5944 is the one to cite.

### Q36 [hard] Why is CRC better than a simple checksum at detecting burst errors?
**Answer:** A CRC with an r-bit remainder detects every burst error up to length r, and most longer ones, because it is a polynomial division. A simple additive checksum can miss errors that cancel in the sum, such as swapped words or compensating bit flips.

### Q37 [hard] What is longest-prefix match in IP routing?
**Answer:** When several routing-table entries match a destination address, the router uses the one with the longest prefix (most specific network). For example, 10.1.2.0/24 beats 10.1.0.0/16 for the address 10.1.2.5.

### Q38 [hard] Compare go-back-N and selective repeat.
**Answer:** In go-back-N the receiver accepts only in-order frames, so after an error the sender retransmits the lost frame and all that followed. In selective repeat the receiver buffers out-of-order frames and only the lost frame is retransmitted, at the cost of a larger receiver window and more complexity.

### Q39 [hard] What is the difference between flow control and congestion control?
**Answer:** Flow control stops a sender from overwhelming a slow receiver (an end-to-end matter between two hosts). Congestion control stops senders from overloading the network itself (routers and links in between).

### Q40 [medium] What is the purpose of the TCP three-way handshake?
**Answer:** It establishes a connection and synchronises initial sequence numbers: SYN from the client, SYN-ACK from the server, then ACK from the client. Both sides then know the other is ready and reachable.

### Q41 [hard] How many parity bits does a Hamming code need for m data bits?
**Answer:** The smallest r with 2^r >= m + r + 1. For 4 data bits r = 3 (the (7,4) Hamming code). The parity bits sit at positions that are powers of two and let the receiver locate a single-bit error from the syndrome.

### Q42 [hard] A channel has 3 kHz bandwidth and 30 dB SNR. What is the Shannon capacity?
**Answer:** 30 dB is a power ratio of 1000, so C = 3000 x log2(1 + 1000) = 3000 x about 9.97, roughly 29.9 kbit/s. No coding scheme can give error-free transmission above this rate.

### Q43 [medium] What are ASK, FSK and PSK?
**Answer:** They are digital modulation schemes that vary the amplitude (ASK), frequency (FSK) or phase (PSK) of a carrier to represent bits.

### Q44 [hard] What is the difference between a router and a layer-2 switch?
**Answer:** A switch forwards frames within a network using MAC addresses (data link layer). A router forwards packets between networks using IP addresses and routing tables (network layer) and decrements the TTL.

