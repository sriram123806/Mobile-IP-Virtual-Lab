/**
 * Shinchi Chatbot Engine - Mobile IP Virtual Lab Integration
 * Comprehensive Mobile IP & Networking Knowledge Base, Multi-Turn Conversation,
 * Dynamic Follow-Ups, Book Recommendations, Clickable Educational Links,
 * and Native Glassmorphism UI Controller.
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. LINK HELPERS & RESOURCE DATABASES
  ------------------------------------------------------------------ */
  function a(href, text) {
    return '<a href="' + href + '" target="_blank" rel="noopener noreferrer">' + text + '</a>';
  }

  function book(title, author, why, search, extraHref, extraText) {
    var url = 'https://openlibrary.org/search?q=' + encodeURIComponent(search || title);
    return '<li>' + a(url, title) + ' <small>' + author + '. ' + why + '</small>' +
      (extraHref ? '<small class="also">' + a(extraHref, extraText) + '</small>' : '') + '</li>';
  }

  function site(href, name, why) {
    return '<li>' + a(href, name) + ' <small>' + why + '</small></li>';
  }

  var BOOKS =
    '<ul class="res">' +
    book('Computer Networking: A Top-Down Approach', 'Kurose and Ross', 'Very clear for beginners, and includes a full Mobile IP section in the wireless chapter.', 'Computer Networking A Top-Down Approach Kurose Ross', 'https://gaia.cs.umass.edu/kurose_ross/', 'Free companion site with lecture videos') +
    book('Mobile Communications', 'Jochen Schiller', 'Has a dedicated chapter on Mobile IP, so it is the best match for this virtual lab.', 'Mobile Communications Schiller') +
    book('Computer Networks', 'Andrew Tanenbaum and David Wetherall', 'The classic layer-by-layer networking textbook.', 'Computer Networks Tanenbaum Wetherall') +
    book('Data Communications and Networking', 'Behrouz Forouzan', 'Popular in university syllabi, with clear network diagrams.', 'Data Communications and Networking Forouzan') +
    book('Computer Networks: A Systems Approach', 'Peterson and Davie', 'Practical, open-source and very readable.', 'Computer Networks A Systems Approach Peterson Davie', 'https://book.systemsapproach.org/', 'Read it free online') +
    book('TCP/IP Illustrated, Volume 1', 'W. Richard Stevens (Kevin Fall)', 'A deep look into real packet headers and protocols.', 'TCP/IP Illustrated Volume 1 Stevens') +
    '</ul>';

  var SITES =
    '<ul class="res">' +
    site('https://www.netacad.com/', 'Cisco Networking Academy', 'Free beginner courses and the Packet Tracer simulator.') +
    site('https://www.cloudflare.com/learning/', 'Cloudflare Learning Center', 'Short, friendly explainers on IP, DNS, TCP, and networking.') +
    site('https://gaia.cs.umass.edu/kurose_ross/', 'Kurose & Ross Companion Site', 'Free lecture slides and videos following the textbook.') +
    site('https://nptel.ac.in/', 'NPTEL Computer Networks', 'Free high-quality video courses from Indian Institute of Technology (IIT).') +
    site('https://www.practicalnetworking.net/', 'Practical Networking', 'Plain-language lessons on subnets, routing, and headers.') +
    site('https://www.wireshark.org/', 'Wireshark Packet Analyzer', 'Free tool to inspect real IP-in-IP encapsulated headers.') +
    site('https://www.rfc-editor.org/rfc/rfc5944', 'RFC 5944: IP Mobility Support for IPv4', 'The official IETF Mobile IPv4 specification.') +
    site('https://www.rfc-editor.org/rfc/rfc2003', 'RFC 2003: IP Encapsulation within IP', 'The official RFC describing IP-in-IP tunneling.') +
    '</ul>';

  /* ------------------------------------------------------------------
     2. COMPREHENSIVE MOBILE IP & NETWORKING KNOWLEDGE BASE
  ------------------------------------------------------------------ */
  var KB = [
    {
      id: 'packetflow', q: 'How does Mobile IP work step by step?',
      kw: ['how does mobile ip work', 'how mobile ip works', 'mobile ip working', 'working of mobile ip', 'step by step', 'packet journey', 'packet flow', 'delivery process', 'full process', 'how does it work'],
      a: '<p>Here is the complete packet journey when the Mobile Node (MN) is away from home:</p><ol>' +
        '<li>The <b>Correspondent Node (CN)</b> sends a packet to the MN\'s permanent <b>Home Address</b>.</li>' +
        '<li>The packet reaches the <b>Home Network</b>, where the <b>Home Agent (HA)</b> intercepts it via Proxy ARP.</li>' +
        '<li>The HA <b>encapsulates</b> it by wrapping a new outer IP header (HA ➔ Care-of Address).</li>' +
        '<li>The packet traverses the <b>forward tunnel</b> to the <b>Foreign Agent (FA)</b>.</li>' +
        '<li>The FA <b>decapsulates</b> the packet, removing the outer IP header.</li>' +
        '<li>The FA delivers the pristine original packet locally to the <b>Mobile Node (MN)</b>.</li></ol>' +
        '<pre class="mini">CN ──► HA ═══ Forward Tunnel ═══► FA ──► MN</pre>',
      ex: '<p>For example in our lab: CN in Chennai sends to a Mobile Node whose home is Kanyakumari but is roaming in Ooty. The packet travels Chennai → Kanyakumari (HA) → IP Tunnel → Ooty (FA) → MN. The CN never needs to know the phone moved!</p>',
      simple: '<p>Think of postal mail forwarding! Friends write to your permanent home address. Your home post office wraps your mail in a new envelope addressed to your temporary hotel, and the local post office delivers it to your hands.</p>',
      more: '<p>Before tunneling happens, the MN must <b>register</b> its Care-of Address with the HA. Ask me about <i>registration</i> or <i>tunneling</i>!</p>',
      next: ['ha', 'encap', 'registration', 'tunneling']
    },
    {
      id: 'cmp-addr', q: 'Home address vs Care-of Address',
      kw: ['home address vs care of address', 'home address and care of address', 'difference between home address and care of address', 'home address vs coa', 'home address and coa', 'home address coa difference', 'home address care of address difference'],
      a: '<p><b>Home Address</b> is permanent. It identifies the Mobile Node regardless of its physical location, and all open TCP/IP sessions bind to it.</p>' +
        '<p><b>Care-of Address (CoA)</b> is temporary. It specifies where the MN is <i>physically located right now</i>, changing every time the MN roams to another foreign network.</p>' +
        '<p>The Home Agent binds the pair (<code>Home Address ↔ Care-of Address</code>) in its Mobility Binding Cache.</p>',
      ex: '<p>In our lab, the MN\'s Home Address in Kanyakumari is <code>192.168.10.50</code>. While roaming in Ooty, its Care-of Address is <code>172.16.50.254</code>.</p>',
      simple: '<p>Your Home Address is like your permanent Aadhaar/passport address. Your Care-of Address is the temporary hotel room number you are staying at this week.</p>',
      next: ['homeaddr', 'coa', 'registration']
    },
    {
      id: 'cmp-agents', q: 'Home Agent vs Foreign Agent',
      kw: ['home agent vs foreign agent', 'home agent and foreign agent', 'ha vs fa', 'ha and fa', 'difference between home agent and foreign agent', 'difference between ha and fa', 'foreign agent vs home agent'],
      a: '<ul><li><b>Home Agent (HA)</b>: Located on the MN\'s <i>home network</i>. Intercepts incoming packets, encapsulates them in a new outer header, and tunnels them forward.</li>' +
        '<li><b>Foreign Agent (FA)</b>: Located on the <i>visited foreign network</i>. Advertises Care-of Addresses, terminates the tunnel, decapsulates packets, and delivers them locally to the MN.</li></ul>' +
        '<p>Summary: The HA <b>enters packets into the tunnel</b>, while the FA <b>extracts packets from the tunnel</b>.</p>',
      ex: '<p>MN home: Kanyakumari; visited location: Ooty. The HA in Kanyakumari wraps the packet, and the FA in Ooty unwraps and delivers it.</p>',
      simple: '<p>The HA is the home post office that forwards your letters. The FA is the local post office that receives the bundle and hands your letter to you.</p>',
      next: ['ha', 'fa', 'tunneling']
    },
    {
      id: 'forward', q: 'What is a forward tunnel?',
      kw: ['forward tunnel', 'forward tunneling', 'forward tunnelling', 'forward direction'],
      a: '<p>The <b>forward tunnel</b> carries packets <b>towards the Mobile Node</b>: from the Home Agent to the Care-of Address (Foreign Agent). Route: <code>CN ──► HA ══ Tunnel ══► FA ──► MN</code>.</p>',
      ex: '<p>Chennai (CN) → Kanyakumari (HA) → Forward Tunnel across South India → Ooty (FA) → MN.</p>',
      more: '<p>Replies from the MN can either travel straight back to the CN (triangular routing) or return via a <b>reverse tunnel</b> if ingress filtering is enforced.</p>',
      next: ['reverse', 'tunneling', 'triangle']
    },
    {
      id: 'reverse', q: 'What is a reverse tunnel?',
      kw: ['reverse tunnel', 'reverse tunneling', 'reverse tunnelling', 'rfc 3024'],
      a: '<p>A <b>reverse tunnel</b> (RFC 3024) carries packets <b>from the Mobile Node back to its Home Agent</b> before reaching the Correspondent Node:</p>' +
        '<pre class="mini">MN ──► FA ══ Reverse Tunnel ══► HA ──► CN</pre>' +
        '<p>It prevents foreign firewalls from dropping outgoing packets because of <i>ingress filtering</i> (where source IP does not match the local subnet).</p>',
      ex: '<p>When a phone in Ooty sends packets with its Kanyakumari home address, foreign routers might suspect IP spoofing. Reverse tunneling safely routes it back through the Home Agent first.</p>',
      next: ['forward', 'triangle', 'tunneling']
    },
    {
      id: 'outer', q: 'Why is an outer IP header added?',
      kw: ['outer ip header', 'outer header', 'extra header', 'new ip header', 'why outer'],
      a: '<p>The original packet is addressed to the MN\'s permanent <b>Home Address</b>. Routers across the Internet would deliver it to the Home Network where the MN is <i>absent</i>.</p>' +
        '<p>The HA wraps it in a <b>new outer IP header</b> addressed to the <b>Care-of Address</b> (<code>Src: HA, Dst: CoA</code>), allowing standard internet routers to deliver it to the MN\'s visited location.</p>',
      ex: '<p>Inner header: <code>CN → Home Address</code>. Outer header: <code>HA → CoA</code>. Routers along the way only inspect the outer header.</p>',
      simple: '<p>It is like putting an addressed envelope inside a larger courier bag with a forwarding address on the outside.</p>',
      next: ['preserved', 'encap', 'decap']
    },
    {
      id: 'preserved', q: 'Why is the original packet preserved?',
      kw: ['original packet', 'original ip packet', 'preserved', 'preserve', 'why original', 'unchanged'],
      a: '<p>The original IP packet remains completely intact because:</p><ul>' +
        '<li>Active transport sessions (like TCP) rely on fixed IP addresses. Modifying the header would immediately break connections.</li>' +
        '<li>The CN and higher-layer applications remain completely unaware that the MN has moved (transparent mobility).</li>' +
        '<li>Only tunnel endpoints add and strip the outer header; intermediate routers operate normally.</li></ul>',
      ex: '<p>A video stream or SSH session continues seamlessly while you travel from Kanyakumari to Ooty because both endpoints see the exact same original packet headers.</p>',
      next: ['outer', 'encap', 'homeaddr']
    },
    {
      id: 'encap', q: 'What is encapsulation?',
      kw: ['encapsulation', 'encapsulate', 'encapsulated', 'encapsulating'],
      a: '<p><b>Encapsulation</b> is the process of enclosing an entire original IP datagram inside a new outer IP packet for tunneling:</p>' +
        '<pre class="mini">┌─ OUTER IP HEADER (Src: HA, Dst: CoA)\n└─ ORIGINAL IP PACKET\n   ├─ ORIGINAL IP HEADER (Src: CN, Dst: HoA)\n   └─ USER DATA PAYLOAD</pre>' +
        '<p>Performed by the Home Agent using IP-in-IP (RFC 2003, Protocol number 4).</p>',
      ex: '<p>In our lab: Outer IP adds <code>HA (Kanyakumari) ➔ CoA (Ooty)</code> around the original datagram from Chennai.</p>',
      simple: '<p>Like sliding an existing letter into a larger parcel box with forwarding instructions on the outside.</p>',
      more: '<p>Adding the 20-byte outer header increases total packet size. If the packet exceeds the Path MTU and has the DF (Don\'t Fragment) bit set, encapsulation failure occurs (see Case 3 in our lab!).</p>',
      next: ['decap', 'outer', 'tunneling']
    },
    {
      id: 'decap', q: 'What is decapsulation?',
      kw: ['decapsulation', 'decapsulate', 'decapsulated', 'decapsulating'],
      a: '<p><b>Decapsulation</b> is the reverse process executed at the Foreign Agent. It terminates the tunnel, strips off the outer IP header, and recovers the original, unmodified IP packet.</p>',
      ex: '<p>The FA at Ooty receives <code>HA ➔ CoA</code>, strips off the outer header, verifies packet integrity, and delivers the original datagram to the Mobile Node.</p>',
      simple: '<p>Opening the parcel box, throwing away the outer wrapping, and pulling out the original letter inside.</p>',
      more: '<p>The FA uses its local <b>Visitor List</b> to match the MN\'s Home Address with its physical MAC address for local link delivery.</p>',
      next: ['fa', 'encap', 'delivery']
    },
    {
      id: 'tunneling', q: 'What is tunneling?',
      kw: ['tunneling', 'tunnelling', 'tunnel', 'tunnels', 'ip in ip', 'ip over ip'],
      a: '<p><b>Tunneling</b> is the mechanism of transporting packets across a network by encapsulating them inside outer headers. In Mobile IP, the tunnel spans from the <b>Home Agent</b> to the <b>Care-of Address</b>.</p>' +
        '<pre class="mini">HA ═════════ IP-in-IP Tunnel ═════════► FA</pre>' +
        '<p>Intermediate routers only route according to the outer IP header; the inner payload remains untouched.</p>',
      ex: '<p>A packet addressed to a phone\'s Kanyakumari home address travels through the tunnel straight to Ooty where the phone is currently roaming.</p>',
      simple: '<p>Think of a sealed subway tunnel through a mountain. You enter at the Home Agent and exit at the Foreign Agent untouched.</p>',
      next: ['encap', 'decap', 'forward']
    },
    {
      id: 'registration', q: 'How does the Home Agent know where the MN is?',
      kw: ['registration', 'register', 'registering', 'registered', 'binding', 'mobility binding', 'binding table', 'home agent know', 'how does the home agent know', 'knows the location', 'mobile node location', 'where is the mobile node', 'registration request', 'registration reply', 'lifetime'],
      a: '<p>Through <b>Mobile IP Registration</b>! When the MN visits a foreign network:</p><ol>' +
        '<li>The MN sends a <b>Registration Request</b> (via FA) containing its Home Address and new Care-of Address.</li>' +
        '<li>The HA validates the request, updates its <b>Mobility Binding Cache</b> (<code>HoA ↔ CoA</code> + Lifetime), and returns a <b>Registration Reply</b>.</li></ol>' +
        '<p>Registration messages use <b>UDP port 434</b>.</p>',
      ex: '<p>Phone arrives in Ooty → FA advertises CoA <code>172.16.50.254</code> → MN registers → HA updates binding cache. HA now tunnels all traffic for <code>192.168.10.50</code> to Ooty.</p>',
      simple: '<p>You give your forwarding address to the post office so they know where to forward your mail.</p>',
      next: ['agentdisc', 'handoff', 'coa']
    },
    {
      id: 'agentdisc', q: 'What is agent discovery?',
      kw: ['agent discovery', 'agent advertisement', 'agent advertisements', 'advertisement', 'agent solicitation', 'solicitation', 'movement detection', 'detect movement', 'how does the mobile node know it moved'],
      a: '<p><b>Agent Discovery</b> is how an MN discovers its network attachments:</p><ul>' +
        '<li><b>Agent Advertisements</b>: Routers periodically broadcast ICMP Router Advertisements with mobility extensions.</li>' +
        '<li><b>Agent Solicitations</b>: If an MN needs an immediate advertisement without waiting, it broadcasts a solicitation.</li></ul>',
      ex: '<p>When your laptop connects to Ooty Wi-Fi, it hears the Ooty FA\'s Agent Advertisement, learns it is on a foreign network, and obtains the CoA.</p>',
      next: ['registration', 'coa', 'handoff']
    },
    {
      id: 'handoff', q: 'What happens when the MN changes networks?',
      kw: ['changes network', 'changes networks', 'change network', 'move to another network', 'moves to another network', 'moves to a new network', 'mobile node moves', 'handoff', 'handover', 'roaming', 'roam', 'switch network', 'new foreign network'],
      a: '<p>During a network handoff / roaming:</p><ol>' +
        '<li>MN detects network movement via Agent Advertisements.</li>' +
        '<li>MN obtains a <b>new Care-of Address</b> from the new FA.</li>' +
        '<li>MN registers the new CoA with its Home Agent.</li>' +
        '<li>HA updates its binding cache, redirecting tunnel traffic to the new FA.</li></ol>' +
        '<p><b>The MN\'s Home Address never changes!</b></p>',
      ex: '<p>Ooty → Coimbatore: HA updates its binding from Ooty CoA to Coimbatore CoA. The remote sender in Chennai notices zero interruption.</p>',
      more: '<p>In-flight packets sent to the old FA during the handoff transition may be lost unless smooth handoff / buffer forwarding is implemented (see Case 5 in our lab!).</p>',
      next: ['registration', 'returnhome', 'coa']
    },
    {
      id: 'returnhome', q: 'What if the MN returns to its Home Network?',
      kw: ['return home', 'returns home', 'returns to its home network', 'back to home network', 'comes back home', 'deregister', 'deregistration', 'back home', 'returns to home'],
      a: '<p>When the MN returns home, it hears its own Home Agent\'s advertisements and <b>deregisters</b> (Registration Request with lifetime = 0).</p>' +
        '<p>The HA deletes the binding cache entry and disables Proxy ARP. Packets are delivered directly over the home link without tunneling.</p>',
      ex: '<p>Phone returns to Kanyakumari: HA removes the Ooty CoA. Packets from Chennai now reach the phone directly.</p>',
      next: ['registration', 'handoff', 'ha']
    },
    {
      id: 'triangle', q: 'What is triangular routing?',
      kw: ['triangular routing', 'triangle routing', 'route optimization', 'route optimisation'],
      a: '<p><b>Triangular Routing</b> occurs when the forward path goes indirectly through the HA (<code>CN ──► HA ──► FA ──► MN</code>), while return packets can travel straight to the CN (<code>MN ──► CN</code>).</p>' +
        '<p>The two asymmetric paths form a triangle. Route Optimization addresses this by caching the CoA directly at the CN.</p>',
      next: ['reverse', 'forward', 'ha']
    },
    {
      id: 'homeaddr', q: 'What is a Home Address?',
      kw: ['home address', 'permanent address', 'permanent ip', 'permanent ip address'],
      a: '<p>A <b>Home Address (HoA)</b> is the Mobile Node\'s permanent IP address assigned from its home network prefix. It remains static wherever the device roams, ensuring persistent TCP and application connections.</p>',
      ex: '<p>In our lab, the MN\'s permanent Home Address is <code>192.168.10.50</code> (Kanyakumari subnet).</p>',
      next: ['coa', 'cmp-addr', 'homenet']
    },
    {
      id: 'coa', q: 'What is a Care-of Address (CoA)?',
      kw: ['care of address', 'coa', 'care of', 'co located', 'colocated', 'co located coa', 'foreign agent care of address'],
      a: '<p>A <b>Care-of Address (CoA)</b> is a temporary IP address that identifies the MN\'s current point of attachment in a visited network. Two types exist:</p><ul>' +
        '<li><b>FA Care-of Address</b>: The IP address of the Foreign Agent. Shared by multiple visiting nodes; the FA terminates and decapsulates the tunnel (used in our lab).</li>' +
        '<li><b>Co-located Care-of Address</b>: A temporary address acquired directly by the MN (via DHCP); the MN decapsulates the tunnel itself.</li></ul>',
      ex: '<p>In Ooty, the FA\'s CoA is <code>172.16.50.254</code>. The HA sets this as the outer destination.</p>',
      next: ['cmp-addr', 'registration', 'fa']
    },
    {
      id: 'homenet', q: 'What is a Home Network?',
      kw: ['home network', 'home subnet', 'home link'],
      a: '<p>A <b>Home Network</b> is the subnet whose IP prefix matches the Mobile Node\'s permanent Home Address. The Home Agent is stationed here.</p>',
      ex: '<p>If the MN\'s Home Address is <code>192.168.10.50</code>, its Home Network is <code>192.168.10.0/24</code> in Kanyakumari.</p>',
      next: ['foreignnet', 'ha', 'homeaddr']
    },
    {
      id: 'foreignnet', q: 'What is a Foreign Network?',
      kw: ['foreign network', 'visited network', 'foreign link', 'foreign subnet'],
      a: '<p>A <b>Foreign Network</b> is any network visited by the Mobile Node other than its home network. The Foreign Agent resides here.</p>',
      ex: '<p>When a student travels from Kanyakumari to Ooty, the Ooty network is the foreign visited network.</p>',
      next: ['homenet', 'fa', 'coa']
    },
    {
      id: 'ha', q: 'What is a Home Agent (HA)?',
      kw: ['home agent', 'ha'],
      a: '<p>A <b>Home Agent (HA)</b> is a specialized router on the MN\'s home network that:</p><ul>' +
        '<li>Maintains the <b>Mobility Binding Cache</b> (<code>HoA ↔ CoA</code>).</li>' +
        '<li>Intercepts incoming packets for the absent MN via <b>Proxy ARP</b>.</li>' +
        '<li><b>Encapsulates</b> intercepted packets in outer IP headers and tunnels them to the CoA.</li></ul>',
      ex: '<p>The HA at Kanyakumari intercepts datagrams from Chennai and tunnels them forward to Ooty.</p>',
      next: ['fa', 'encap', 'registration']
    },
    {
      id: 'fa', q: 'What is a Foreign Agent (FA)?',
      kw: ['foreign agent', 'fa'],
      a: '<p>A <b>Foreign Agent (FA)</b> is a router on the visited foreign network that:</p><ul>' +
        '<li>Broadcasts <b>Agent Advertisements</b> offering Care-of Addresses.</li>' +
        '<li>Relays Registration Requests & Replies between the MN and HA.</li>' +
        '<li>Terminates the tunnel, <b>decapsulates</b> received packets, and delivers them locally to the MN.</li></ul>',
      ex: '<p>The FA in Ooty receives tunneled packets from Kanyakumari, removes the outer header, and delivers the data to the roaming phone.</p>',
      next: ['ha', 'decap', 'coa']
    },
    {
      id: 'delivery', q: 'How does the FA deliver the original packet?',
      kw: ['how does the foreign agent deliver', 'foreign agent deliver', 'fa deliver', 'final delivery', 'deliver the original packet', 'visitor list'],
      a: '<p>After decapsulation, the FA cannot use normal IP routing because the MN\'s Home Address does not belong to the foreign subnet.</p>' +
        '<p>Instead, the FA inspects its <b>Visitor List</b>, matches the MN\'s Home Address to its recorded Layer-2 <b>MAC address</b>, and transmits the frame directly across the local wireless/Ethernet link.</p>',
      next: ['decap', 'fa', 'mac']
    },
    {
      id: 'mn', q: 'What is a Mobile Node (MN)?',
      kw: ['mobile node', 'mn', 'mobile host', 'mobile device'],
      a: '<p>A <b>Mobile Node (MN)</b> is any host or router (smartphone, laptop, connected vehicle) that changes its network point of attachment while maintaining uninterrupted connectivity via its permanent Home Address.</p>',
      ex: '<p>Your roaming smartphone travelling between cities is the Mobile Node.</p>',
      next: ['cn', 'homeaddr', 'coa']
    },
    {
      id: 'cn', q: 'What is a Correspondent Node (CN)?',
      kw: ['correspondent node', 'cn', 'correspondent', 'correspondent host'],
      a: '<p>A <b>Correspondent Node (CN)</b> is the communication partner communicating with the Mobile Node (e.g., web server, streaming server, or peer).</p>' +
        '<p>The CN sends packets normally to the MN\'s Home Address with zero knowledge of its roaming location.</p>',
      ex: '<p>A web server in Chennai streaming video to a roaming phone is the Correspondent Node.</p>',
      next: ['mn', 'ha', 'packetflow']
    },
    {
      id: 'mobileip', q: 'What is Mobile IP?',
      kw: ['mobile ip', 'mobileip', 'mobile internet protocol', 'ip mobility', 'mobility support', 'mipv4', 'mip'],
      a: '<p><b>Mobile IP (RFC 5944)</b> is an open network standard that enables devices to roam across disparate networks without altering their IP address, preserving all active network connections and application sessions transparently.</p>' +
        '<p>It comprises three core mechanisms: <b>Agent Discovery</b>, <b>Registration</b>, and <b>Tunneling</b>.</p>',
      ex: '<p>Like postal mail forwarding: you move from Kanyakumari to Ooty, but friends still send letters to your home address. The home post office forwards them to your temporary hotel!</p>',
      next: ['packetflow', 'mn', 'ha', 'tunneling']
    },

    /* ---------------- General Networking Topics ---------------- */
    {
      id: 'ip', q: 'What is an IP address?',
      kw: ['ip address', 'ip addresses', 'what is ip', 'internet protocol', 'ipv4 address', 'ip addr'],
      a: '<p>An <b>IP address</b> is a numerical label identifying a device on an IP network. IPv4 uses 32-bit addresses formatted as dotted-quads (e.g. <code>192.168.1.10</code>), split into a <b>network ID</b> and <b>host ID</b>.</p>',
      next: ['subnet', 'ipv', 'mac']
    },
    {
      id: 'subnet', q: 'What is a subnet mask?',
      kw: ['subnet', 'subnet mask', 'subnetting', 'netmask', 'cidr', 'slash 24'],
      a: '<p>A <b>subnet mask</b> distinguishes the network portion of an IP address from the host portion. A <code>/24</code> mask (<code>255.255.255.0</code>) allocates 24 bits for the network and 8 bits for up to 254 usable hosts.</p>',
      next: ['ip', 'routing', 'nat']
    },
    {
      id: 'mac', q: 'What is a MAC address?',
      kw: ['mac address', 'mac', 'hardware address', 'physical address'],
      a: '<p>A <b>MAC address</b> is a globally unique 48-bit physical identifier burnt into network interface cards (NICs), e.g. <code>AA:BB:CC:11:22:33</code>. Used for hop-by-hop delivery on Layer 2 local links.</p>',
      next: ['arp', 'ip', 'routersw']
    },
    {
      id: 'osi', q: 'What is the OSI model?',
      kw: ['osi', 'osi model', 'seven layers', '7 layers', 'layers of network', 'network layers'],
      a: '<p>The <b>OSI 7-Layer Model</b> standardizes network telecommunications:</p><ol>' +
        '<li>Physical (Bits)</li><li>Data Link (Frames)</li><li>Network (Packets - where Mobile IP operates)</li>' +
        '<li>Transport (Segments - TCP/UDP)</li><li>Session</li><li>Presentation</li><li>Application</li></ol>' +
        '<p>Mnemonic: <i>Please Do Not Throw Sausage Pizza Away</i>.</p>',
      next: ['tcpip', 'ip', 'tcpudp']
    },
    {
      id: 'tcpip', q: 'What is the TCP/IP model?',
      kw: ['tcp ip', 'tcpip', 'tcp ip model', 'internet layer', 'internet model'],
      a: '<p>The <b>TCP/IP 4-Layer Model</b> reflects the real-world Internet: <b>Application</b>, <b>Transport</b> (TCP/UDP), <b>Internet</b> (IP/ICMP), and <b>Network Access / Link</b>.</p>',
      next: ['osi', 'tcpudp', 'ip']
    },
    {
      id: 'tcpudp', q: 'TCP vs UDP',
      kw: ['tcp', 'udp', 'tcp vs udp', 'tcp and udp', 'difference between tcp and udp'],
      a: '<ul><li><b>TCP (Transmission Control Protocol)</b>: Connection-oriented, guaranteed delivery, flow control, retransmissions (HTTP, SSH, file transfer).</li>' +
        '<li><b>UDP (User Datagram Protocol)</b>: Connectionless, lightweight, low-latency, no retransmission overhead (DNS, VoIP, video streaming).</li></ul>' +
        '<p>Mobile IP registration messages use <b>UDP port 434</b>.</p>',
      next: ['port', 'tcpip', 'dns']
    },
    {
      id: 'port', q: 'What is a port number?',
      kw: ['port number', 'port numbers', 'ports', 'port'],
      a: '<p>A <b>port number</b> is a 16-bit identifier (0–65535) directing incoming network segments to specific software applications. Common ports: HTTP (80), HTTPS (443), DNS (53), Mobile IP Registration (UDP 434).</p>',
      next: ['tcpudp', 'ip', 'dns']
    },
    {
      id: 'dns', q: 'What is DNS?',
      kw: ['dns', 'domain name', 'domain name system', 'name server'],
      a: '<p>The <b>Domain Name System (DNS)</b> translates human-friendly hostnames (like <code>github.com</code>) into routable IP addresses (the phonebook of the Internet).</p>',
      next: ['ip', 'dhcp', 'tcpudp']
    },
    {
      id: 'dhcp', q: 'What is DHCP?',
      kw: ['dhcp', 'dynamic host'],
      a: '<p><b>Dynamic Host Configuration Protocol (DHCP)</b> dynamically allocates IP addresses, subnet masks, and default gateways to joining client devices. Mobile Nodes can acquire co-located CoAs via DHCP.</p>',
      next: ['coa', 'ip', 'dns']
    },
    {
      id: 'arp', q: 'What is ARP?',
      kw: ['arp', 'address resolution', 'proxy arp', 'gratuitous arp'],
      a: '<p><b>Address Resolution Protocol (ARP)</b> maps IP addresses to physical MAC addresses on local subnets. The Home Agent uses <b>Proxy ARP</b> to intercept packets destined for absent roaming nodes.</p>',
      next: ['mac', 'ha', 'ip']
    },
    {
      id: 'routersw', q: 'Router vs Switch',
      kw: ['router', 'routers', 'switch', 'switches', 'hub', 'router vs switch', 'difference between router and switch'],
      a: '<ul><li><b>Switch (Layer 2)</b>: Forwards frames inside a single local network using MAC address tables.</li>' +
        '<li><b>Router (Layer 3)</b>: Connects different subnets and routes packets across networks using IP routing tables. Home and Foreign Agents are routers.</li></ul>',
      next: ['routing', 'mac', 'ha']
    },
    {
      id: 'routing', q: 'What is routing?',
      kw: ['routing', 'routing table', 'route', 'routes', 'ospf', 'bgp', 'rip', 'gateway', 'default gateway'],
      a: '<p><b>Routing</b> is the process of selecting paths across networks using routing tables (longest prefix match). Protocols like OSPF, BGP, and RIP dynamically propagate routing updates.</p>',
      next: ['routersw', 'subnet', 'ip']
    },
    {
      id: 'nat', q: 'What is NAT?',
      kw: ['nat', 'network address translation', 'private ip', 'public ip', 'private address'],
      a: '<p><b>Network Address Translation (NAT)</b> allows multiple private IP devices to share a single public IP. NAT traversal in Mobile IP is handled via UDP encapsulation (RFC 3519).</p>',
      next: ['ip', 'subnet', 'tunneling']
    },
    {
      id: 'ping', q: 'What is ping (ICMP)?',
      kw: ['ping', 'icmp', 'traceroute', 'tracert'],
      a: '<p><b>ping</b> sends ICMP Echo Request packets to verify host reachability and measure round-trip time (RTT). <b>traceroute</b> records intermediate router hops.</p>',
      next: ['routing', 'ip', 'osi']
    },
    {
      id: 'ipv', q: 'IPv4 vs IPv6',
      kw: ['ipv6', 'ipv4', 'ipv4 vs ipv6', 'mobile ipv6', 'mipv6', 'ipv6 vs ipv4'],
      a: '<ul><li><b>IPv4</b>: 32-bit addresses (~4.3 billion addresses, exhausted).</li>' +
        '<li><b>IPv6</b>: 128-bit addresses (virtually unlimited). Mobile IPv6 (RFC 6275) integrates mobility natively without requiring Foreign Agents.</li></ul>',
      next: ['ip', 'mobileip', 'fa']
    },

    /* ---------------- Recommendations & Resources ---------------- */
    {
      id: 'books', q: 'Recommend books',
      kw: ['book', 'books', 'textbook', 'textbooks', 'reference book', 'reference books', 'reading list'],
      a: '<p>Here are the recommended textbooks for Computer Networks and Mobile IP:</p>' + BOOKS +
        '<p>Start with <b>Kurose & Ross</b> for fundamentals, and consult <b>Jochen Schiller</b> for in-depth Mobile IP chapters!</p>',
      next: ['websites', 'mobileip', 'osi']
    },
    {
      id: 'websites', q: 'Study websites',
      kw: ['website', 'websites', 'web site', 'tutorial', 'tutorials', 'course', 'courses', 'rfc', 'rfcs', 'nptel', 'youtube', 'where can i learn', 'where to learn', 'learn more'],
      a: '<p>Curated educational websites and official RFC references:</p>' + SITES +
        '<p>Read <b>RFC 5944</b> for the exact IETF Mobile IPv4 protocol specification.</p>',
      next: ['books', 'mobileip', 'tunneling']
    },
    {
      id: 'resources', q: 'Books and websites',
      kw: ['resources', 'resource', 'study material', 'study materials', 'study resources', 'books and websites', 'recommend', 'suggest', 'suggestions', 'materials'],
      a: '<p><b>Recommended Textbooks:</b></p>' + BOOKS + '<p><b>Online Resources & RFCs:</b></p>' + SITES,
      next: ['mobileip', 'packetflow', 'osi']
    }
  ];

  /* ------------------------------------------------------------------
     3. NORMALIZATION & SCORING ENGINE
  ------------------------------------------------------------------ */
  var BY_ID = {};
  function normalize(t) {
    return ' ' + String(t).toLowerCase().replace(/[’‘`]/g, "'").replace(/'/g, '').replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
  }

  KB.forEach(function (e) {
    BY_ID[e.id] = e;
    e._k = e.kw.map(function (k) {
      var n = normalize(k).trim();
      return { n: ' ' + n + ' ', w: Math.max(2, n.split(' ').length) };
    });
  });

  function score(e, n) {
    var s = 0;
    for (var i = 0; i < e._k.length; i++) {
      if (n.indexOf(e._k[i].n) !== -1) s += e._k[i].w;
    }
    return s;
  }

  function bestTopic(n) {
    var best = null, bs = 0;
    KB.forEach(function (e) {
      var s = score(e, n);
      if (s > bs) { bs = s; best = e; }
    });
    return bs >= 2 ? best : null;
  }

  /* ------------------------------------------------------------------
     4. CONVERSATIONAL LOGIC & MULTI-TURN CONTEXT
  ------------------------------------------------------------------ */
  var INTRO = '<p>Hi! I am <b>Shinchi</b>, your Mobile IP and Computer Networking buddy! 👋</p>' +
    '<p>I can explain <b>Mobile IP principles</b> (HA, FA, CoA, tunneling), answer general networking questions, and recommend books and RFCs.</p>' +
    '<p>Pick a question below or ask me anything!</p>';

  var START_CHIPS = ['What is Mobile IP?', 'Home Agent vs Foreign Agent', 'Explain tunneling', 'Recommend books', 'Study websites'];
  var FOLLOW_CHIPS = { ex: 'Show an example', simple: 'Explain simply', more: 'Tell me more' };

  var chatState = { last: null, shown: {} };

  function seen(id, v) { (chatState.shown[id] = chatState.shown[id] || {})[v] = true; }
  function hasSeen(id, v) { return !!(chatState.shown[id] && chatState.shown[id][v]); }

  function isExample(n) { return /( example | examples | for instance | sample | demo | show me )/.test(n); }
  function isSimple(n) { return /( simple | simply | easy | easier | eli5 | confused | confusing | dont get | dont understand | do not understand | layman | analogy | explain like )/.test(n); }
  function isMore(n) { return /( more | elaborate | details | detail | deeper | continue | go on | what else | explain again | go ahead )/.test(n); }
  function isFollowWord(n) { return /^ (why|how|how come|really|ok|okay|yes|yeah|yep|yup|sure|please|and|then|so|next|what next|go on|k) $/.test(n); }

  function chipsFor(e, shownVariant) {
    var list = [];
    ['ex', 'simple', 'more'].forEach(function (v) {
      if (v === shownVariant) return;
      if (v === 'ex' && !e.ex) return;
      if (v === 'simple' && !e.simple) return;
      if (v === 'more' && !e.more) return;
      list.push(FOLLOW_CHIPS[v]);
    });
    list = list.slice(0, 2);
    (e.next || []).forEach(function (id) {
      if (BY_ID[id] && list.length < 5) list.push(BY_ID[id].q);
    });
    return list;
  }

  function variant(e, v) {
    seen(e.id, v);
    var lead = { ex: 'Here is an example: ', simple: 'Let me make it simple: ', more: 'A bit more detail: ' }[v];
    var body = e[v] || e.a;
    if (v === 'a') return body;
    return '<p><span class="lead">' + lead.trim() + '</span></p>' + body;
  }

  function topicReply(e, n) {
    chatState.last = e;
    var v = 'a';
    if (isExample(n) && e.ex) v = 'ex';
    else if (isSimple(n)) v = e.simple ? 'simple' : (e.ex ? 'ex' : 'a');
    else if (isMore(n) && e.more) v = 'more';
    if (v === 'a') chatState.shown[e.id] = {};
    return { html: variant(e, v), chips: chipsFor(e, v) };
  }

  function followUp(n) {
    var e = chatState.last;
    if (!e) return null;
    if (isExample(n) && e.ex) return { html: variant(e, 'ex'), chips: chipsFor(e, 'ex') };
    if (isSimple(n)) {
      var sv = e.simple ? 'simple' : (e.ex ? 'ex' : 'a');
      return { html: variant(e, sv), chips: chipsFor(e, sv) };
    }
    if (isMore(n) || isFollowWord(n)) {
      var order = ['more', 'ex', 'simple'];
      for (var i = 0; i < order.length; i++) {
        var v = order[i];
        if (e[v] && !hasSeen(e.id, v)) return { html: variant(e, v), chips: chipsFor(e, v) };
      }
      return {
        html: '<p>That covers the essentials of <b>' + e.q.replace(/^What is (a |an )?|\?$/g, '') + '</b>! Would you like to explore a related concept?</p>',
        chips: chipsFor(e, 'none').filter(function (c) { return !/^(Show|Explain|Tell)/.test(c); }).concat(['Recommend books']).slice(0, 4)
      };
    }
    return null;
  }

  function smallTalk(n) {
    if (/^ (hi|hii+|hello|hey|heya|hola|yo|sup|namaste|vanakkam|hi there|hello there|hey there|good morning|good afternoon|good evening|good night|greetings)( shinchi)? $/.test(n) ||
        /^ (hi|hello|hey|vanakkam|namaste) /.test(n) && n.trim().split(' ').length <= 3) {
      return { html: '<p>Hello there! 😊 Great to see you in the Mobile IP Virtual Lab! What would you like to explore today?</p>', chips: START_CHIPS };
    }
    if (/ how are you | how r you | whats up | how do you do /.test(n)) {
      return { html: '<p>I am doing great and ready to talk networking! 🚀 What Mobile IP topic shall we look at?</p>', chips: START_CHIPS };
    }
    if (/ (thanks|thank you|thankyou|thx|ty|tq|cool thanks|great|awesome|nice|got it|understood) /.test(n) && n.trim().split(' ').length <= 5) {
      return { html: '<p>You are very welcome! 🌟 Feel free to ask another question or tap a suggestion below.</p>', chips: chatState.last ? chipsFor(chatState.last, 'none').slice(0, 4) : START_CHIPS };
    }
    if (/^ (bye|goodbye|see you|see ya|good bye|cya|tata|ok bye|bye bye)( shinchi)? $/.test(n)) {
      return { html: '<p>Goodbye for now! Best of luck with your DCN lab studies! 👋</p>', chips: ['What is Mobile IP?'] };
    }
    if (/ (who are you|your name|what are you|what can you do|what do you do|introduce yourself) /.test(n)) {
      return { html: '<p>I am <b>Shinchi</b>, your native AI learning buddy for this Mobile IP Virtual Lab. I can explain tunneling, encapsulation, agents (HA/FA), Care-of Addresses, general networking, and recommend books and websites!</p>', chips: START_CHIPS };
    }
    if (/^ (help|menu|options|topics|start) $/.test(n) || / (what can i ask|what should i ask) /.test(n)) {
      return { html: '<p>Here are some great topics to ask about:</p><ul><li>How does Mobile IP work step by step?</li><li>Home Agent vs Foreign Agent</li><li>What is encapsulation and tunneling?</li><li>Recommend books and study websites</li></ul>', chips: START_CHIPS };
    }
    return null;
  }

  function fallback() {
    return {
      html: '<p>Hmm, I don\'t have that specific detail yet. 🤔 Try asking about <b>Mobile IP</b> (HA, FA, MN, CoA, tunneling, encapsulation), basic <b>networking</b> (IP, TCP/UDP, DNS, subnets), or ask for <b>books and websites</b>!</p>',
      chips: START_CHIPS
    };
  }

  function answer(text) {
    var n = normalize(text);
    var e = bestTopic(n);
    if (e) return topicReply(e, n);
    return smallTalk(n) || followUp(n) || fallback();
  }

  /* ------------------------------------------------------------------
     5. UI CONTROLLER & EVENT BINDINGS
  ------------------------------------------------------------------ */
  var launcher = document.getElementById('shinchiLauncher');
  var windowEl = document.getElementById('shinchiWindow');
  var closeBtn = document.getElementById('shinchiClose');
  var resetBtn = document.getElementById('shinchiReset');
  var log = document.getElementById('shinchiLog');
  var form = document.getElementById('shinchiForm');
  var input = document.getElementById('shinchiInput');
  var chipsEl = document.getElementById('shinchiChips');

  var AVATAR_SVG = '<div class="shinchi-mini-avatar" aria-hidden="true"><img src="assets/images/shinchi-avatar.jpg" alt="Shinchi" class="avatar-img" onerror="this.style.display=\'none\'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="17" r="1.6" fill="currentColor" stroke="none"/><path d="M8.2 13.6a5.4 5.4 0 0 1 7.6 0M5 10.3a9.9 9.9 0 0 1 14 0M12 17v3.5"/></svg></div>';

  function scrollDown() {
    if (log) log.scrollTop = log.scrollHeight;
  }

  function addUser(text) {
    if (!log) return;
    var row = document.createElement('div');
    row.className = 'shinchi-row user';
    var b = document.createElement('div');
    b.className = 'shinchi-bubble';
    b.textContent = text;
    row.appendChild(b);
    log.appendChild(row);
    scrollDown();
  }

  function addBot(html) {
    if (!log) return;
    var row = document.createElement('div');
    row.className = 'shinchi-row bot';
    row.innerHTML = AVATAR_SVG + '<div class="shinchi-bubble">' + html + '</div>';
    log.appendChild(row);
    scrollDown();
    return row;
  }

  function addTyping() {
    if (!log) return null;
    var row = document.createElement('div');
    row.className = 'shinchi-row bot';
    row.innerHTML = AVATAR_SVG + '<div class="shinchi-bubble shinchi-typing" aria-label="Shinchi is typing"><i></i><i></i><i></i></div>';
    log.appendChild(row);
    scrollDown();
    return row;
  }

  function setChips(list) {
    if (!chipsEl) return;
    chipsEl.innerHTML = '';
    (list || START_CHIPS).forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'shinchi-chip';
      b.textContent = t;
      b.addEventListener('click', function () { send(t); });
      chipsEl.appendChild(b);
    });
    chipsEl.scrollLeft = 0;
  }

  function send(text) {
    text = String(text || '').trim();
    if (!text) return;
    addUser(text);
    if (input) input.value = '';

    // Typing animation
    var typing = addTyping();

    // Check if an external backend API URL is configured (optional extension)
    if (window.SHINCHI_API_URL) {
      fetch(window.SHINCHI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (typing && typing.remove) typing.remove();
        addBot(data.reply || data.html || answer(text).html);
        setChips(data.chips || answer(text).chips);
      })
      .catch(function () {
        // Fall back gracefully to built-in knowledge base
        deliverBuiltInReply(typing, text);
      });
    } else {
      deliverBuiltInReply(typing, text);
    }
  }

  function deliverBuiltInReply(typing, text) {
    var reply = answer(text);
    var delay = Math.min(320 + Math.min(reply.html.length, 900) * 0.35, 750);
    setTimeout(function () {
      if (typing && typing.remove) typing.remove();
      addBot(reply.html);
      setChips(reply.chips || START_CHIPS);
    }, delay);
  }

  function start() {
    if (!log) return;
    log.innerHTML = '';
    chatState = { last: null, shown: {} };
    addBot(INTRO);
    setChips(START_CHIPS);
  }

  function openChat() {
    if (!windowEl) return;
    windowEl.classList.add('open');
    windowEl.setAttribute('aria-hidden', 'false');
    if (launcher) launcher.setAttribute('aria-expanded', 'true');
    setTimeout(function () {
      if (input) input.focus();
    }, 150);
  }

  function closeChat() {
    if (!windowEl) return;
    windowEl.classList.remove('open');
    windowEl.setAttribute('aria-hidden', 'true');
    if (launcher) launcher.setAttribute('aria-expanded', 'false');
  }

  function toggleChat() {
    if (!windowEl) return;
    if (windowEl.classList.contains('open')) {
      closeChat();
    } else {
      openChat();
    }
  }

  if (launcher) launcher.addEventListener('click', toggleChat);
  if (closeBtn) closeBtn.addEventListener('click', closeChat);
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      start();
      if (input) input.focus();
    });
  }

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (input) send(input.value);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && windowEl && windowEl.classList.contains('open')) {
      closeChat();
    }
  });

  // Initialize
  start();

  // Export global API
  window.Shinchi = {
    answer: answer,
    send: send,
    start: start,
    open: openChat,
    close: closeChat,
    toggle: toggleChat
  };

})();
