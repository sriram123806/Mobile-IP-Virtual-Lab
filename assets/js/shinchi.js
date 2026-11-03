/* ==========================================================================
   SHINCHI AI CHATBOT - CLIENT-SIDE INTELLIGENCE & PEDAGOGICAL ENGINE
   Primary Learning Resource: DCN.docx (Mobile IPv4 Q&A with 22 Diagrams)
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. CURATED TEXTBOOK RECOMMENDATIONS
  ------------------------------------------------------------------ */
  

  /* ------------------------------------------------------------------
     2. CURATED WEBSITES & RFC SPECIFICATIONS
  ------------------------------------------------------------------ */
  

  /* ------------------------------------------------------------------
     3. MOBILE IP & COMPUTER NETWORKING KNOWLEDGE BASE (DCN.docx PRIMARY)
  ------------------------------------------------------------------ */
  var KB = [
  {
    "id": "dcn_mobile_ip",
    "num": 1,
    "q": "What is Mobile IPv4?",
    "kw": [
      "what is mobile ipv4",
      "what is mobile ip",
      "mobile ipv4",
      "mobile ip",
      "define mobile ip",
      "rfc 5944",
      "mobile ip definition",
      "concept of mobile ip",
      "how mobile ip works",
      "about mobile ip"
    ],
    "a": "<p><strong>Mobile IPv4 Protocol</strong></p><p>Mobile IPv4 (RFC 5944) is a network-layer protocol that lets a device move across different networks and Wi-Fi access points without losing its permanent IP address or dropping active connections.</p><ul class=\"dcn-points\"><li>Allows a <b>Mobile Node (MN)</b> to retain its permanent <b>Home Address (HoA)</b> regardless of location.</li><li>Registers the current temporary <b>Care-of Address (CoA)</b> with its <b>Home Agent (HA)</b>.</li><li>The HA forwards packets sent to the Home Address through a secure tunnel to the current CoA.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Think of moving to a new house: instead of giving a new address to all your friends and banks, your old local post office (Home Agent) automatically forwards all mail to your new temporary address (Care-of Address). Your friends still write to your permanent address!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image1.png\" data-caption=\"Figure 1: Mobile IPv4 Network Overview & Entity Relationships\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image1.png\" alt=\"Mobile IPv4 overview diagram showing Mobile Node, Home Agent, Foreign Agent, and Correspondent Node\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 1: Mobile IPv4 Network Overview & Entity Relationships</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Mobile IPv4 (RFC 5944) is a network-layer protocol that lets a device move across different networks and Wi-Fi access points without losing its permanent IP address or dropping active connections.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Think of moving to a new house: instead of giving a new address to all your friends and banks, your old local post office (Home Agent) automatically forwards all mail to your new temporary address (Care-of Address). Your friends still write to your permanent address!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image1.png\" data-caption=\"Figure 1: Mobile IPv4 Network Overview & Entity Relationships\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image1.png\" alt=\"Mobile IPv4 overview diagram showing Mobile Node, Home Agent, Foreign Agent, and Correspondent Node\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 1: Mobile IPv4 Network Overview & Entity Relationships</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Mobile IPv4 Protocol</span><p>Think of moving to a new house: instead of giving a new address to all your friends and banks, your old local post office (Home Agent) automatically forwards all mail to your new temporary address (Care-of Address). Your friends still write to your permanent address!</p></div><p>This matches how <b>Mobile IPv4 Protocol</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image1.png\" data-caption=\"Figure 1: Mobile IPv4 Network Overview & Entity Relationships\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image1.png\" alt=\"Mobile IPv4 overview diagram showing Mobile Node, Home Agent, Foreign Agent, and Correspondent Node\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 1: Mobile IPv4 Network Overview & Entity Relationships</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Mobile IPv4 Protocol:</strong></p><ul class=\"dcn-points\"><li>Allows a <b>Mobile Node (MN)</b> to retain its permanent <b>Home Address (HoA)</b> regardless of location.</li><li>Registers the current temporary <b>Care-of Address (CoA)</b> with its <b>Home Agent (HA)</b>.</li><li>The HA forwards packets sent to the Home Address through a secure tunnel to the current CoA.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image1.png\" data-caption=\"Figure 1: Mobile IPv4 Network Overview & Entity Relationships\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image1.png\" alt=\"Mobile IPv4 overview diagram showing Mobile Node, Home Agent, Foreign Agent, and Correspondent Node\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 1: Mobile IPv4 Network Overview & Entity Relationships</span></div></div>",
    "chips": [
      "Why is Mobile IP required?",
      "Architecture of Mobile IP",
      "HA vs FA",
      "Care-of Address"
    ]
  },
  {
    "id": "dcn_why_required",
    "num": 2,
    "q": "Why is Mobile IPv4 required?",
    "kw": [
      "why is mobile ip required",
      "why mobile ip is required",
      "why is mobile ipv4 required",
      "why mobile ip required",
      "need for mobile ip",
      "why mobile ip",
      "why do we need mobile ip",
      "problem with normal ip",
      "traditional ip routing mobility",
      "why is it required",
      "need of mobile ip"
    ],
    "a": "<p><strong>Need for Mobile IPv4</strong></p><p>Traditional IP routing assumes an IP address never moves. When a device roams to another network, its old IP is topologically incorrect, causing all TCP/UDP connections to break immediately.</p><ul class=\"dcn-points\"><li>Normal IP addresses identify both a host identity and its physical point of network attachment.</li><li>Moving to another subnet makes the old IP unreachable under standard routing tables.</li><li>Changing the IP address tears down active TCP sockets, file downloads, and video streams.</li><li>Mobile IPv4 decouples identity (permanent Home Address) from routing location (temporary Care-of Address).</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>If your mobile phone number changed every time you drove into a new city, all your ongoing calls would drop and nobody could call you back. Mobile IPv4 works like global cellular roaming: your phone number stays permanent everywhere!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image2.png\" data-caption=\"Figure 2: The Location Dilemma in Traditional IPv4 vs Mobile IP Solution\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image2.png\" alt=\"Diagram showing why standard IP routing fails for mobile nodes and how Mobile IP solves it\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 2: The Location Dilemma in Traditional IPv4 vs Mobile IP Solution</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Traditional IP routing assumes an IP address never moves. When a device roams to another network, its old IP is topologically incorrect, causing all TCP/UDP connections to break immediately.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>If your mobile phone number changed every time you drove into a new city, all your ongoing calls would drop and nobody could call you back. Mobile IPv4 works like global cellular roaming: your phone number stays permanent everywhere!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image2.png\" data-caption=\"Figure 2: The Location Dilemma in Traditional IPv4 vs Mobile IP Solution\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image2.png\" alt=\"Diagram showing why standard IP routing fails for mobile nodes and how Mobile IP solves it\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 2: The Location Dilemma in Traditional IPv4 vs Mobile IP Solution</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Need for Mobile IPv4</span><p>If your mobile phone number changed every time you drove into a new city, all your ongoing calls would drop and nobody could call you back. Mobile IPv4 works like global cellular roaming: your phone number stays permanent everywhere!</p></div><p>This matches how <b>Need for Mobile IPv4</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image2.png\" data-caption=\"Figure 2: The Location Dilemma in Traditional IPv4 vs Mobile IP Solution\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image2.png\" alt=\"Diagram showing why standard IP routing fails for mobile nodes and how Mobile IP solves it\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 2: The Location Dilemma in Traditional IPv4 vs Mobile IP Solution</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Need for Mobile IPv4:</strong></p><ul class=\"dcn-points\"><li>Normal IP addresses identify both a host identity and its physical point of network attachment.</li><li>Moving to another subnet makes the old IP unreachable under standard routing tables.</li><li>Changing the IP address tears down active TCP sockets, file downloads, and video streams.</li><li>Mobile IPv4 decouples identity (permanent Home Address) from routing location (temporary Care-of Address).</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image2.png\" data-caption=\"Figure 2: The Location Dilemma in Traditional IPv4 vs Mobile IP Solution\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image2.png\" alt=\"Diagram showing why standard IP routing fails for mobile nodes and how Mobile IP solves it\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 2: The Location Dilemma in Traditional IPv4 vs Mobile IP Solution</span></div></div>",
    "chips": [
      "What is Mobile IPv4?",
      "Architecture of Mobile IP",
      "Home Address vs CoA",
      "Packet Delivery"
    ]
  },
  {
    "id": "dcn_architecture",
    "num": 3,
    "q": "Explain the architecture of Mobile IPv4.",
    "kw": [
      "architecture of mobile ip",
      "mobile ipv4 architecture",
      "mobile ip architecture",
      "explain architecture of mobile ip",
      "mobile ip components",
      "entities in mobile ip",
      "mobile ip network architecture",
      "explain architecture"
    ],
    "a": "<p><strong>Mobile IPv4 Architecture</strong></p><p>The Mobile IPv4 architecture consists of four primary network entities: the Mobile Node (MN), Home Agent (HA), Foreign Agent (FA), and Correspondent Node (CN).</p><ul class=\"dcn-points\"><li><b>Mobile Node (MN):</b> The moving device (laptop, smartphone) that changes its network point of attachment.</li><li><b>Home Agent (HA):</b> A router on the home network maintaining the node's current location binding and tunneling packets.</li><li><b>Foreign Agent (FA):</b> A router in the visited foreign network that assists the MN, relays registration, and decapsulates incoming packets.</li><li><b>Correspondent Node (CN):</b> Any standard host or web server communicating with the MN.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Imagine an overseas exchange program: MN is the visiting student, HA is the student's home university registrar, FA is the host international college office, and CN is a research collaborator sending documents.</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image3.png\" data-caption=\"Figure 3: Mobile IPv4 Architecture & Component Topology\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image3.png\" alt=\"Mobile IPv4 architectural diagram with Home Network, Foreign Network, and Internet\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 3: Mobile IPv4 Architecture & Component Topology</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> The Mobile IPv4 architecture consists of four primary network entities: the Mobile Node (MN), Home Agent (HA), Foreign Agent (FA), and Correspondent Node (CN).</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Imagine an overseas exchange program: MN is the visiting student, HA is the student's home university registrar, FA is the host international college office, and CN is a research collaborator sending documents.</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image3.png\" data-caption=\"Figure 3: Mobile IPv4 Architecture & Component Topology\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image3.png\" alt=\"Mobile IPv4 architectural diagram with Home Network, Foreign Network, and Internet\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 3: Mobile IPv4 Architecture & Component Topology</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Mobile IPv4 Architecture</span><p>Imagine an overseas exchange program: MN is the visiting student, HA is the student's home university registrar, FA is the host international college office, and CN is a research collaborator sending documents.</p></div><p>This matches how <b>Mobile IPv4 Architecture</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image3.png\" data-caption=\"Figure 3: Mobile IPv4 Architecture & Component Topology\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image3.png\" alt=\"Mobile IPv4 architectural diagram with Home Network, Foreign Network, and Internet\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 3: Mobile IPv4 Architecture & Component Topology</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Mobile IPv4 Architecture:</strong></p><ul class=\"dcn-points\"><li><b>Mobile Node (MN):</b> The moving device (laptop, smartphone) that changes its network point of attachment.</li><li><b>Home Agent (HA):</b> A router on the home network maintaining the node's current location binding and tunneling packets.</li><li><b>Foreign Agent (FA):</b> A router in the visited foreign network that assists the MN, relays registration, and decapsulates incoming packets.</li><li><b>Correspondent Node (CN):</b> Any standard host or web server communicating with the MN.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image3.png\" data-caption=\"Figure 3: Mobile IPv4 Architecture & Component Topology\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image3.png\" alt=\"Mobile IPv4 architectural diagram with Home Network, Foreign Network, and Internet\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 3: Mobile IPv4 Architecture & Component Topology</span></div></div>",
    "chips": [
      "Functions of MN HA FA",
      "What is Agent Discovery?",
      "Home Address vs CoA",
      "Registration Process"
    ]
  },
  {
    "id": "dcn_functions",
    "num": 4,
    "q": "What are the functions of MN, HA and FA?",
    "kw": [
      "functions of mn ha and fa",
      "functions of mn ha fa",
      "functions of mn ha",
      "functions of ha and fa",
      "role of ha and fa",
      "functions of mobile node",
      "functions of home agent",
      "functions of foreign agent",
      "role of mn ha fa cn",
      "agent duties",
      "mn ha fa"
    ],
    "a": "<p><strong>Functions of MN, HA, FA, and CN</strong></p><p>Each entity in Mobile IPv4 has a distinct role to keep communications alive while the node wanders between networks.</p><ul class=\"dcn-points\"><li><b>Mobile Node (MN):</b> Detects movement, discovers mobility agents, requests registration with its HA, and sends/receives user data.</li><li><b>Home Agent (HA):</b> Stores Home Address-to-CoA bindings, intercepts packets destined for the MN using Proxy ARP, and encapsulates them through tunnels.</li><li><b>Foreign Agent (FA):</b> Advertises mobility services, provides an FA Care-of Address, forwards registration requests/replies, and decapsulates packets before local delivery.</li><li><b>Correspondent Node (CN):</b> Transmits standard IP packets to the MN's permanent Home Address without needing any mobility software.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Think of a theatrical roadshow: MN is the traveling performer, HA is the booking agent back home forwarding contracts, FA is the local theater manager handling backstage logistics, and CN is the audience sending applause!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image4.png\" data-caption=\"Figure 4: Functional Breakdown of MN, HA, FA, and CN\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image4.png\" alt=\"Diagram displaying key responsibilities of Mobile Node, Home Agent, Foreign Agent, and Correspondent Node\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 4: Functional Breakdown of MN, HA, FA, and CN</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Each entity in Mobile IPv4 has a distinct role to keep communications alive while the node wanders between networks.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Think of a theatrical roadshow: MN is the traveling performer, HA is the booking agent back home forwarding contracts, FA is the local theater manager handling backstage logistics, and CN is the audience sending applause!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image4.png\" data-caption=\"Figure 4: Functional Breakdown of MN, HA, FA, and CN\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image4.png\" alt=\"Diagram displaying key responsibilities of Mobile Node, Home Agent, Foreign Agent, and Correspondent Node\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 4: Functional Breakdown of MN, HA, FA, and CN</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Functions of MN, HA, FA, and CN</span><p>Think of a theatrical roadshow: MN is the traveling performer, HA is the booking agent back home forwarding contracts, FA is the local theater manager handling backstage logistics, and CN is the audience sending applause!</p></div><p>This matches how <b>Functions of MN, HA, FA, and CN</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image4.png\" data-caption=\"Figure 4: Functional Breakdown of MN, HA, FA, and CN\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image4.png\" alt=\"Diagram displaying key responsibilities of Mobile Node, Home Agent, Foreign Agent, and Correspondent Node\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 4: Functional Breakdown of MN, HA, FA, and CN</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Functions of MN, HA, FA, and CN:</strong></p><ul class=\"dcn-points\"><li><b>Mobile Node (MN):</b> Detects movement, discovers mobility agents, requests registration with its HA, and sends/receives user data.</li><li><b>Home Agent (HA):</b> Stores Home Address-to-CoA bindings, intercepts packets destined for the MN using Proxy ARP, and encapsulates them through tunnels.</li><li><b>Foreign Agent (FA):</b> Advertises mobility services, provides an FA Care-of Address, forwards registration requests/replies, and decapsulates packets before local delivery.</li><li><b>Correspondent Node (CN):</b> Transmits standard IP packets to the MN's permanent Home Address without needing any mobility software.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image4.png\" data-caption=\"Figure 4: Functional Breakdown of MN, HA, FA, and CN\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image4.png\" alt=\"Diagram displaying key responsibilities of Mobile Node, Home Agent, Foreign Agent, and Correspondent Node\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 4: Functional Breakdown of MN, HA, FA, and CN</span></div></div>",
    "chips": [
      "Architecture of Mobile IP",
      "Home Address vs CoA",
      "What is Tunneling?",
      "Registration Process"
    ]
  },
  {
    "id": "dcn_hoa_vs_coa",
    "num": 5,
    "q": "Differentiate Home Address and Care-of Address.",
    "kw": [
      "home address vs care of address",
      "differentiate home address and care of address",
      "differentiate hoa and coa",
      "difference between home address and care of address",
      "what is home address",
      "what is care of address",
      "hoa vs coa",
      "difference between hoa and coa"
    ],
    "a": "<p><strong>Home Address (HoA) vs Care-of Address (CoA)</strong></p><p>The Home Address is your permanent identity, while the Care-of Address is your temporary topological location.</p><ul class=\"dcn-points\"><li><b>Home Address (HoA):</b> Permanent, static IPv4 address assigned to the MN on its home network. Never changes regardless of physical movement.</li><li><b>Care-of Address (CoA):</b> Temporary IPv4 address assigned to the MN in the visited network. Identifies current routing location.</li><li><b>Role in Routing:</b> CN communicates using the HoA; the HA uses the CoA as the destination endpoint of the tunnel.</li><li><b>Persistence:</b> HoA persists for the lifetime of the interface; CoA changes every time the node moves to a new subnet.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Your <b>Passport Number</b> is your Home Address (it never changes no matter where you travel in the world). Your <b>Hotel Room Address</b> is your Care-of Address (it changes every time you travel to a new city).</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image5.png\" data-caption=\"Figure 5: Permanent Home Address vs Temporary Care-of Address\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image5.png\" alt=\"Comparison diagram between Home Address and Care-of Address\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 5: Permanent Home Address vs Temporary Care-of Address</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> The Home Address is your permanent identity, while the Care-of Address is your temporary topological location.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Your <b>Passport Number</b> is your Home Address (it never changes no matter where you travel in the world). Your <b>Hotel Room Address</b> is your Care-of Address (it changes every time you travel to a new city).</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image5.png\" data-caption=\"Figure 5: Permanent Home Address vs Temporary Care-of Address\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image5.png\" alt=\"Comparison diagram between Home Address and Care-of Address\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 5: Permanent Home Address vs Temporary Care-of Address</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Home Address (HoA) vs Care-of Address (CoA)</span><p>Your <b>Passport Number</b> is your Home Address (it never changes no matter where you travel in the world). Your <b>Hotel Room Address</b> is your Care-of Address (it changes every time you travel to a new city).</p></div><p>This matches how <b>Home Address (HoA) vs Care-of Address (CoA)</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image5.png\" data-caption=\"Figure 5: Permanent Home Address vs Temporary Care-of Address\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image5.png\" alt=\"Comparison diagram between Home Address and Care-of Address\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 5: Permanent Home Address vs Temporary Care-of Address</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Home Address (HoA) vs Care-of Address (CoA):</strong></p><ul class=\"dcn-points\"><li><b>Home Address (HoA):</b> Permanent, static IPv4 address assigned to the MN on its home network. Never changes regardless of physical movement.</li><li><b>Care-of Address (CoA):</b> Temporary IPv4 address assigned to the MN in the visited network. Identifies current routing location.</li><li><b>Role in Routing:</b> CN communicates using the HoA; the HA uses the CoA as the destination endpoint of the tunnel.</li><li><b>Persistence:</b> HoA persists for the lifetime of the interface; CoA changes every time the node moves to a new subnet.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image5.png\" data-caption=\"Figure 5: Permanent Home Address vs Temporary Care-of Address\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image5.png\" alt=\"Comparison diagram between Home Address and Care-of Address\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 5: Permanent Home Address vs Temporary Care-of Address</span></div></div>",
    "chips": [
      "Foreign Agent CoA vs Co-located CoA",
      "What is a Mobility Binding?",
      "Packet Delivery",
      "Registration Process"
    ]
  },
  {
    "id": "dcn_agent_discovery",
    "num": 6,
    "q": "What is Agent Discovery?",
    "kw": [
      "what is agent discovery",
      "agent discovery in mobile ip",
      "agent discovery process",
      "how mn discovers agent",
      "discovering home agent foreign agent",
      "agent discovery"
    ],
    "a": "<p><strong>Agent Discovery Mechanism</strong></p><p>Agent Discovery is the process by which a Mobile Node discovers whether it is connected to its home network or a foreign network, and detects mobility agents.</p><ul class=\"dcn-points\"><li>Allows the MN to detect movement across network boundaries without user intervention.</li><li>Mobility agents periodically broadcast <b>Agent Advertisements</b> on local links.</li><li>Advertisements inform the MN about agent capabilities, flags, and available Care-of Addresses.</li><li>If an MN does not want to wait for the next periodic broadcast, it sends an <b>Agent Solicitation</b>.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>When you step into an airport or coffee shop with your laptop, the OS listens for beacon frames from nearby access points, or sends a probe request asking 'Are there any network agents available here?'</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image6.png\" data-caption=\"Figure 6: Agent Discovery Workflow (Advertisements & Solicitations)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image6.png\" alt=\"Agent Discovery diagram showing periodic advertisements and solicitations\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 6: Agent Discovery Workflow (Advertisements & Solicitations)</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Agent Discovery is the process by which a Mobile Node discovers whether it is connected to its home network or a foreign network, and detects mobility agents.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>When you step into an airport or coffee shop with your laptop, the OS listens for beacon frames from nearby access points, or sends a probe request asking 'Are there any network agents available here?'</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image6.png\" data-caption=\"Figure 6: Agent Discovery Workflow (Advertisements & Solicitations)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image6.png\" alt=\"Agent Discovery diagram showing periodic advertisements and solicitations\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 6: Agent Discovery Workflow (Advertisements & Solicitations)</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Agent Discovery Mechanism</span><p>When you step into an airport or coffee shop with your laptop, the OS listens for beacon frames from nearby access points, or sends a probe request asking 'Are there any network agents available here?'</p></div><p>This matches how <b>Agent Discovery Mechanism</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image6.png\" data-caption=\"Figure 6: Agent Discovery Workflow (Advertisements & Solicitations)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image6.png\" alt=\"Agent Discovery diagram showing periodic advertisements and solicitations\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 6: Agent Discovery Workflow (Advertisements & Solicitations)</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Agent Discovery Mechanism:</strong></p><ul class=\"dcn-points\"><li>Allows the MN to detect movement across network boundaries without user intervention.</li><li>Mobility agents periodically broadcast <b>Agent Advertisements</b> on local links.</li><li>Advertisements inform the MN about agent capabilities, flags, and available Care-of Addresses.</li><li>If an MN does not want to wait for the next periodic broadcast, it sends an <b>Agent Solicitation</b>.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image6.png\" data-caption=\"Figure 6: Agent Discovery Workflow (Advertisements & Solicitations)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image6.png\" alt=\"Agent Discovery diagram showing periodic advertisements and solicitations\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 6: Agent Discovery Workflow (Advertisements & Solicitations)</span></div></div>",
    "chips": [
      "Agent Advertisement vs Solicitation",
      "Registration Process",
      "Home Address vs CoA",
      "What is Mobile IPv4?"
    ]
  },
  {
    "id": "dcn_adv_vs_sol",
    "num": 7,
    "q": "Explain Agent Advertisement and Agent Solicitation.",
    "kw": [
      "agent advertisement and agent solicitation",
      "agent advertisement and solicitation",
      "agent advertisement vs solicitation",
      "difference between agent advertisement and solicitation",
      "icmp router advertisement extension",
      "agent solicitation",
      "agent advertisement"
    ],
    "a": "<p><strong>Agent Advertisement vs Agent Solicitation</strong></p><p>Agent Advertisement is a periodic announcement broadcast by agents, while Agent Solicitation is an on-demand probe broadcast by a newly arrived Mobile Node.</p><ul class=\"dcn-points\"><li><b>Agent Advertisement:</b> An ICMP Router Advertisement extended with a Mobile IPv4 mobility payload. Broadcast periodically (every 1\u20133s) by HA and FA. Contains flags (R, B, H, F, M, G, T) and one or more FA CoAs.</li><li><b>Agent Solicitation:</b> An ICMP Router Solicitation sent by an MN to request immediate advertisements, eliminating the need to wait for the next periodic timer.</li><li><b>Protocol:</b> Both run over ICMP (RFC 1256 + RFC 5944 extension).</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Agent Advertisement is like a hotel concierge holding up a greeting sign at arrivals ('Hotel Shuttle Available!'). Agent Solicitation is a tired traveler arriving late and asking at the information desk: 'Where is the hotel shuttle?'</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image7.png\" data-caption=\"Figure 7: Message Format and Interaction for Advertisements and Solicitations\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image7.png\" alt=\"Diagram detailing Agent Advertisement and Solicitation packet structures\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 7: Message Format and Interaction for Advertisements and Solicitations</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Agent Advertisement is a periodic announcement broadcast by agents, while Agent Solicitation is an on-demand probe broadcast by a newly arrived Mobile Node.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Agent Advertisement is like a hotel concierge holding up a greeting sign at arrivals ('Hotel Shuttle Available!'). Agent Solicitation is a tired traveler arriving late and asking at the information desk: 'Where is the hotel shuttle?'</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image7.png\" data-caption=\"Figure 7: Message Format and Interaction for Advertisements and Solicitations\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image7.png\" alt=\"Diagram detailing Agent Advertisement and Solicitation packet structures\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 7: Message Format and Interaction for Advertisements and Solicitations</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Agent Advertisement vs Agent Solicitation</span><p>Agent Advertisement is like a hotel concierge holding up a greeting sign at arrivals ('Hotel Shuttle Available!'). Agent Solicitation is a tired traveler arriving late and asking at the information desk: 'Where is the hotel shuttle?'</p></div><p>This matches how <b>Agent Advertisement vs Agent Solicitation</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image7.png\" data-caption=\"Figure 7: Message Format and Interaction for Advertisements and Solicitations\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image7.png\" alt=\"Diagram detailing Agent Advertisement and Solicitation packet structures\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 7: Message Format and Interaction for Advertisements and Solicitations</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Agent Advertisement vs Agent Solicitation:</strong></p><ul class=\"dcn-points\"><li><b>Agent Advertisement:</b> An ICMP Router Advertisement extended with a Mobile IPv4 mobility payload. Broadcast periodically (every 1\u20133s) by HA and FA. Contains flags (R, B, H, F, M, G, T) and one or more FA CoAs.</li><li><b>Agent Solicitation:</b> An ICMP Router Solicitation sent by an MN to request immediate advertisements, eliminating the need to wait for the next periodic timer.</li><li><b>Protocol:</b> Both run over ICMP (RFC 1256 + RFC 5944 extension).</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image7.png\" data-caption=\"Figure 7: Message Format and Interaction for Advertisements and Solicitations\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image7.png\" alt=\"Diagram detailing Agent Advertisement and Solicitation packet structures\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 7: Message Format and Interaction for Advertisements and Solicitations</span></div></div>",
    "chips": [
      "What is Agent Discovery?",
      "Registration Process",
      "Foreign Agent CoA vs Co-located CoA",
      "Functions of MN HA FA"
    ]
  },
  {
    "id": "dcn_registration_process",
    "num": 8,
    "q": "Explain the Mobile IPv4 registration process.",
    "kw": [
      "mobile ip registration process",
      "explain mobile ip registration process",
      "explain registration process",
      "mobile ipv4 registration process",
      "registration in mobile ip",
      "registration steps",
      "how registration works",
      "registration flow",
      "4 steps of registration",
      "registration procedure"
    ],
    "a": "<p><strong>Mobile IPv4 Registration Process</strong></p><p>Registration is the 4-step handshake where the Mobile Node informs its Home Agent of its current Care-of Address so packets can be tunneled properly.</p><ul class=\"dcn-points\"><li><b>Step 1 (CoA Acquisition):</b> MN receives an Agent Advertisement from the FA or gets a co-located CoA.</li><li><b>Step 2 (Request Transmission):</b> MN sends a <b>Registration Request</b> (UDP port 434) to the FA containing HoA, HA IP, CoA, lifetime, and identification.</li><li><b>Step 3 (Relay to HA):</b> The FA processes the request and relays it over the Internet to the HA.</li><li><b>Step 4 (Validation & Reply):</b> HA authenticates the request, creates or updates the Mobility Binding, and sends a <b>Registration Reply</b> (Code 0 = Success) back through the FA to the MN.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Checking in at an international branch office: You fill out a visitor registration form at the front desk (FA), the front desk faxes your credentials to your headquarters HR (HA), HR approves and issues an access badge, and the front desk hands you the badge!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image8.png\" data-caption=\"Figure 8: 4-Way Handshake of Mobile IPv4 Registration\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image8.png\" alt=\"Registration process sequence diagram between MN, FA, and HA\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 8: 4-Way Handshake of Mobile IPv4 Registration</span></div></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image9.png\" data-caption=\"Figure 9: Registration Request (MN \u2192 FA \u2192 HA) and Reply (HA \u2192 FA \u2192 MN) Path\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image9.png\" alt=\"Diagram showing the travel path of registration request and reply\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 9: Registration Request (MN \u2192 FA \u2192 HA) and Reply (HA \u2192 FA \u2192 MN) Path</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Registration is the 4-step handshake where the Mobile Node informs its Home Agent of its current Care-of Address so packets can be tunneled properly.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Checking in at an international branch office: You fill out a visitor registration form at the front desk (FA), the front desk faxes your credentials to your headquarters HR (HA), HR approves and issues an access badge, and the front desk hands you the badge!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image8.png\" data-caption=\"Figure 8: 4-Way Handshake of Mobile IPv4 Registration\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image8.png\" alt=\"Registration process sequence diagram between MN, FA, and HA\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 8: 4-Way Handshake of Mobile IPv4 Registration</span></div></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image9.png\" data-caption=\"Figure 9: Registration Request (MN \u2192 FA \u2192 HA) and Reply (HA \u2192 FA \u2192 MN) Path\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image9.png\" alt=\"Diagram showing the travel path of registration request and reply\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 9: Registration Request (MN \u2192 FA \u2192 HA) and Reply (HA \u2192 FA \u2192 MN) Path</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Mobile IPv4 Registration Process</span><p>Checking in at an international branch office: You fill out a visitor registration form at the front desk (FA), the front desk faxes your credentials to your headquarters HR (HA), HR approves and issues an access badge, and the front desk hands you the badge!</p></div><p>This matches how <b>Mobile IPv4 Registration Process</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image8.png\" data-caption=\"Figure 8: 4-Way Handshake of Mobile IPv4 Registration\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image8.png\" alt=\"Registration process sequence diagram between MN, FA, and HA\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 8: 4-Way Handshake of Mobile IPv4 Registration</span></div></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image9.png\" data-caption=\"Figure 9: Registration Request (MN \u2192 FA \u2192 HA) and Reply (HA \u2192 FA \u2192 MN) Path\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image9.png\" alt=\"Diagram showing the travel path of registration request and reply\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 9: Registration Request (MN \u2192 FA \u2192 HA) and Reply (HA \u2192 FA \u2192 MN) Path</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Mobile IPv4 Registration Process:</strong></p><ul class=\"dcn-points\"><li><b>Step 1 (CoA Acquisition):</b> MN receives an Agent Advertisement from the FA or gets a co-located CoA.</li><li><b>Step 2 (Request Transmission):</b> MN sends a <b>Registration Request</b> (UDP port 434) to the FA containing HoA, HA IP, CoA, lifetime, and identification.</li><li><b>Step 3 (Relay to HA):</b> The FA processes the request and relays it over the Internet to the HA.</li><li><b>Step 4 (Validation & Reply):</b> HA authenticates the request, creates or updates the Mobility Binding, and sends a <b>Registration Reply</b> (Code 0 = Success) back through the FA to the MN.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image8.png\" data-caption=\"Figure 8: 4-Way Handshake of Mobile IPv4 Registration\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image8.png\" alt=\"Registration process sequence diagram between MN, FA, and HA\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 8: 4-Way Handshake of Mobile IPv4 Registration</span></div></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image9.png\" data-caption=\"Figure 9: Registration Request (MN \u2192 FA \u2192 HA) and Reply (HA \u2192 FA \u2192 MN) Path\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image9.png\" alt=\"Diagram showing the travel path of registration request and reply\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 9: Registration Request (MN \u2192 FA \u2192 HA) and Reply (HA \u2192 FA \u2192 MN) Path</span></div></div>",
    "chips": [
      "Registration Request vs Reply",
      "What is a Mobility Binding?",
      "Encapsulation and Decapsulation",
      "Security in Mobile IP"
    ]
  },
  {
    "id": "dcn_reg_request_reply",
    "num": 9,
    "q": "What are Registration Request and Registration Reply?",
    "kw": [
      "registration request and registration reply",
      "registration request and reply",
      "registration request",
      "registration reply",
      "registration request format",
      "registration reply format",
      "udp port 434",
      "registration messages",
      "reg request and reply"
    ],
    "a": "<p><strong>Registration Request and Reply Messages</strong></p><p>Registration Request (Type 1) and Registration Reply (Type 3) are UDP port 434 signaling datagrams used to establish and confirm mobility bindings.</p><ul class=\"dcn-points\"><li><b>Registration Request (Type 1):</b> Sent by MN to ask HA to create/renew a binding. Contains flags (S, B, D, M, G, T), Lifetime, Home Address, Home Agent address, Care-of Address, and a 64-bit Identification field for replay protection.</li><li><b>Registration Reply (Type 3):</b> Sent by HA to accept or reject the request. Contains a Code (0 = accepted, 1 = accepted without simultaneous binding, 64-127 = FA rejection, 128+ = HA rejection), Lifetime granted, and the matching Identification.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>A formal passport visa application: The Request is your visa application form stating your requested stay (lifetime) and passport number (HoA); the Reply is the embassy's stamp showing 'Approved for 90 days' (Code 0 + Lifetime).</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image10.png\" data-caption=\"Figure 10: Packet Layout of Registration Request and Reply (UDP 434)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image10.png\" alt=\"Packet format diagram for Registration Request and Registration Reply\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 10: Packet Layout of Registration Request and Reply (UDP 434)</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Registration Request (Type 1) and Registration Reply (Type 3) are UDP port 434 signaling datagrams used to establish and confirm mobility bindings.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>A formal passport visa application: The Request is your visa application form stating your requested stay (lifetime) and passport number (HoA); the Reply is the embassy's stamp showing 'Approved for 90 days' (Code 0 + Lifetime).</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image10.png\" data-caption=\"Figure 10: Packet Layout of Registration Request and Reply (UDP 434)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image10.png\" alt=\"Packet format diagram for Registration Request and Registration Reply\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 10: Packet Layout of Registration Request and Reply (UDP 434)</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Registration Request and Reply Messages</span><p>A formal passport visa application: The Request is your visa application form stating your requested stay (lifetime) and passport number (HoA); the Reply is the embassy's stamp showing 'Approved for 90 days' (Code 0 + Lifetime).</p></div><p>This matches how <b>Registration Request and Reply Messages</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image10.png\" data-caption=\"Figure 10: Packet Layout of Registration Request and Reply (UDP 434)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image10.png\" alt=\"Packet format diagram for Registration Request and Registration Reply\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 10: Packet Layout of Registration Request and Reply (UDP 434)</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Registration Request and Reply Messages:</strong></p><ul class=\"dcn-points\"><li><b>Registration Request (Type 1):</b> Sent by MN to ask HA to create/renew a binding. Contains flags (S, B, D, M, G, T), Lifetime, Home Address, Home Agent address, Care-of Address, and a 64-bit Identification field for replay protection.</li><li><b>Registration Reply (Type 3):</b> Sent by HA to accept or reject the request. Contains a Code (0 = accepted, 1 = accepted without simultaneous binding, 64-127 = FA rejection, 128+ = HA rejection), Lifetime granted, and the matching Identification.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image10.png\" data-caption=\"Figure 10: Packet Layout of Registration Request and Reply (UDP 434)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image10.png\" alt=\"Packet format diagram for Registration Request and Registration Reply\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 10: Packet Layout of Registration Request and Reply (UDP 434)</span></div></div>",
    "chips": [
      "Explain the Registration Process",
      "Security in Mobile IPv4",
      "What is a Mobility Binding?",
      "What is Tunneling?"
    ]
  },
  {
    "id": "dcn_packet_delivery",
    "num": 10,
    "q": "How are packets delivered to a Mobile Node in a foreign network?",
    "kw": [
      "how are packets delivered",
      "how are packets delivered to mobile node",
      "packet delivery in foreign network",
      "packet delivery to mobile node",
      "packet forwarding to mn",
      "how packets reach mobile node",
      "packet journey in foreign network"
    ],
    "a": "<p><strong>Packet Delivery in Foreign Network</strong></p><p>When a Mobile Node is away from home, incoming packets travel through a 5-step journey: CN \u2192 Home Network \u2192 HA Interception \u2192 Tunneling to FA \u2192 Local Delivery to MN.</p><ul class=\"dcn-points\"><li>1. <b>CN Transmission:</b> The Correspondent Node sends a standard IP packet to the MN's permanent Home Address.</li><li>2. <b>HA Interception:</b> Since the MN is away, the Home Agent intercepts the packet on the home network using <b>Proxy ARP</b>.</li><li>3. <b>Encapsulation:</b> HA looks up the MN's CoA in its mobility table and wraps the packet in an outer IP header (Source: HA, Dest: CoA).</li><li>4. <b>Tunneling:</b> The encapsulated packet is routed across the Internet to the Foreign Agent.</li><li>5. <b>Decapsulation & Delivery:</b> FA strips the outer header and forwards the original packet to the MN over the local wireless link.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>A birthday card sent to your home address while you are on vacation: your mom (HA) receives it from the postal carrier (CN), puts it in a DHL express envelope addressed to your resort (FA), and the resort receptionist (FA) hands the original envelope directly to you!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image11.png\" data-caption=\"Figure 11: End-to-End Packet Delivery from CN to MN via HA and FA\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image11.png\" alt=\"End-to-end packet delivery path diagram from Correspondent Node to Mobile Node\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 11: End-to-End Packet Delivery from CN to MN via HA and FA</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> When a Mobile Node is away from home, incoming packets travel through a 5-step journey: CN \u2192 Home Network \u2192 HA Interception \u2192 Tunneling to FA \u2192 Local Delivery to MN.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>A birthday card sent to your home address while you are on vacation: your mom (HA) receives it from the postal carrier (CN), puts it in a DHL express envelope addressed to your resort (FA), and the resort receptionist (FA) hands the original envelope directly to you!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image11.png\" data-caption=\"Figure 11: End-to-End Packet Delivery from CN to MN via HA and FA\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image11.png\" alt=\"End-to-end packet delivery path diagram from Correspondent Node to Mobile Node\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 11: End-to-End Packet Delivery from CN to MN via HA and FA</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Packet Delivery in Foreign Network</span><p>A birthday card sent to your home address while you are on vacation: your mom (HA) receives it from the postal carrier (CN), puts it in a DHL express envelope addressed to your resort (FA), and the resort receptionist (FA) hands the original envelope directly to you!</p></div><p>This matches how <b>Packet Delivery in Foreign Network</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image11.png\" data-caption=\"Figure 11: End-to-End Packet Delivery from CN to MN via HA and FA\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image11.png\" alt=\"End-to-end packet delivery path diagram from Correspondent Node to Mobile Node\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 11: End-to-End Packet Delivery from CN to MN via HA and FA</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Packet Delivery in Foreign Network:</strong></p><ul class=\"dcn-points\"><li>1. <b>CN Transmission:</b> The Correspondent Node sends a standard IP packet to the MN's permanent Home Address.</li><li>2. <b>HA Interception:</b> Since the MN is away, the Home Agent intercepts the packet on the home network using <b>Proxy ARP</b>.</li><li>3. <b>Encapsulation:</b> HA looks up the MN's CoA in its mobility table and wraps the packet in an outer IP header (Source: HA, Dest: CoA).</li><li>4. <b>Tunneling:</b> The encapsulated packet is routed across the Internet to the Foreign Agent.</li><li>5. <b>Decapsulation & Delivery:</b> FA strips the outer header and forwards the original packet to the MN over the local wireless link.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image11.png\" data-caption=\"Figure 11: End-to-End Packet Delivery from CN to MN via HA and FA\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image11.png\" alt=\"End-to-end packet delivery path diagram from Correspondent Node to Mobile Node\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 11: End-to-End Packet Delivery from CN to MN via HA and FA</span></div></div>",
    "chips": [
      "What is Tunneling?",
      "Encapsulation and Decapsulation",
      "What is Triangle Routing?",
      "What is Reverse Tunneling?"
    ]
  },
  {
    "id": "dcn_tunneling",
    "num": 11,
    "q": "What is tunneling in Mobile IPv4?",
    "kw": [
      "what is tunneling",
      "what is tunneling in mobile ip",
      "tunneling in mobile ip",
      "tunneling concept",
      "how tunneling works",
      "tunnel entry and exit",
      "tunnel in mobile ipv4",
      "explain tunneling"
    ],
    "a": "<p><strong>Tunneling Mechanism</strong></p><p>Tunneling is the mechanism of encapsulating an entire original IP datagram inside a new outer IP datagram so it can be routed across intermediate networks to a temporary destination.</p><ul class=\"dcn-points\"><li><b>Tunnel Entry Point:</b> The Home Agent (HA) encapsulates the packet.</li><li><b>Tunnel Endpoint:</b> The Care-of Address (FA or the MN itself) decapsulates the packet.</li><li><b>Transparency:</b> Intermediate routers only examine the outer header, remaining completely unaware that the inner payload is an encapsulated mobile datagram.</li><li>Preserves the original source and destination IP addresses throughout the entire journey.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Loading your car onto a flatbed train to travel through the English Channel Eurotunnel: your car (original packet) doesn't drive on its own wheels, the train (outer carrier datagram) carries it smoothly to the destination station!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image12.png\" data-caption=\"Figure 12: Tunneling Concept: Entry Point (HA) to Endpoint (CoA)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image12.png\" alt=\"Tunneling diagram showing tunnel entry point and exit point\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 12: Tunneling Concept: Entry Point (HA) to Endpoint (CoA)</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Tunneling is the mechanism of encapsulating an entire original IP datagram inside a new outer IP datagram so it can be routed across intermediate networks to a temporary destination.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Loading your car onto a flatbed train to travel through the English Channel Eurotunnel: your car (original packet) doesn't drive on its own wheels, the train (outer carrier datagram) carries it smoothly to the destination station!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image12.png\" data-caption=\"Figure 12: Tunneling Concept: Entry Point (HA) to Endpoint (CoA)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image12.png\" alt=\"Tunneling diagram showing tunnel entry point and exit point\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 12: Tunneling Concept: Entry Point (HA) to Endpoint (CoA)</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Tunneling Mechanism</span><p>Loading your car onto a flatbed train to travel through the English Channel Eurotunnel: your car (original packet) doesn't drive on its own wheels, the train (outer carrier datagram) carries it smoothly to the destination station!</p></div><p>This matches how <b>Tunneling Mechanism</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image12.png\" data-caption=\"Figure 12: Tunneling Concept: Entry Point (HA) to Endpoint (CoA)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image12.png\" alt=\"Tunneling diagram showing tunnel entry point and exit point\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 12: Tunneling Concept: Entry Point (HA) to Endpoint (CoA)</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Tunneling Mechanism:</strong></p><ul class=\"dcn-points\"><li><b>Tunnel Entry Point:</b> The Home Agent (HA) encapsulates the packet.</li><li><b>Tunnel Endpoint:</b> The Care-of Address (FA or the MN itself) decapsulates the packet.</li><li><b>Transparency:</b> Intermediate routers only examine the outer header, remaining completely unaware that the inner payload is an encapsulated mobile datagram.</li><li>Preserves the original source and destination IP addresses throughout the entire journey.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image12.png\" data-caption=\"Figure 12: Tunneling Concept: Entry Point (HA) to Endpoint (CoA)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image12.png\" alt=\"Tunneling diagram showing tunnel entry point and exit point\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 12: Tunneling Concept: Entry Point (HA) to Endpoint (CoA)</span></div></div>",
    "chips": [
      "Encapsulation and Decapsulation",
      "IP-in-IP Encapsulation",
      "Packet Delivery",
      "Reverse Tunneling"
    ]
  },
  {
    "id": "dcn_encapsulation",
    "num": 12,
    "q": "Explain encapsulation and decapsulation.",
    "kw": [
      "explain encapsulation and decapsulation",
      "what is encapsulation",
      "what is decapsulation",
      "encapsulation and decapsulation",
      "encapsulation vs decapsulation",
      "outer header inner header",
      "how encapsulation works",
      "encapsulation"
    ],
    "a": "<p><strong>Encapsulation & Decapsulation</strong></p><p>Encapsulation wraps a packet in a new outer IP header at the Home Agent; decapsulation unwraps and removes that outer header at the tunnel endpoint.</p><ul class=\"dcn-points\"><li><b>Encapsulation (HA):</b> The Home Agent prepends a new outer IPv4 header around the complete original packet. Outer Source = HA IP, Outer Destination = CoA. The original packet remains pristine as the payload.</li><li><b>Decapsulation (FA / MN):</b> Upon reaching the tunnel destination (CoA), the tunnel endpoint strips and discards the outer IP header.</li><li>The original untouched packet (Source: CN, Destination: HoA) is then delivered locally to the Mobile Node.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p><b>The Double Envelope Technique:</b> You put a confidential letter into an envelope addressed to a friend. A courier takes that sealed envelope and places it inside a larger FedEx pouch addressed to their hotel reception. When the hotel reception opens the FedEx pouch, they hand your friend the inner envelope completely intact!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image13.png\" data-caption=\"Figure 13: Encapsulation at HA (Adding Outer Header) & Decapsulation at FA (Removing Outer Header)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image13.png\" alt=\"Diagram showing encapsulated packet structure with outer and inner headers\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 13: Encapsulation at HA (Adding Outer Header) & Decapsulation at FA (Removing Outer Header)</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Encapsulation wraps a packet in a new outer IP header at the Home Agent; decapsulation unwraps and removes that outer header at the tunnel endpoint.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p><b>The Double Envelope Technique:</b> You put a confidential letter into an envelope addressed to a friend. A courier takes that sealed envelope and places it inside a larger FedEx pouch addressed to their hotel reception. When the hotel reception opens the FedEx pouch, they hand your friend the inner envelope completely intact!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image13.png\" data-caption=\"Figure 13: Encapsulation at HA (Adding Outer Header) & Decapsulation at FA (Removing Outer Header)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image13.png\" alt=\"Diagram showing encapsulated packet structure with outer and inner headers\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 13: Encapsulation at HA (Adding Outer Header) & Decapsulation at FA (Removing Outer Header)</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Encapsulation & Decapsulation</span><p><b>The Double Envelope Technique:</b> You put a confidential letter into an envelope addressed to a friend. A courier takes that sealed envelope and places it inside a larger FedEx pouch addressed to their hotel reception. When the hotel reception opens the FedEx pouch, they hand your friend the inner envelope completely intact!</p></div><p>This matches how <b>Encapsulation & Decapsulation</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image13.png\" data-caption=\"Figure 13: Encapsulation at HA (Adding Outer Header) & Decapsulation at FA (Removing Outer Header)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image13.png\" alt=\"Diagram showing encapsulated packet structure with outer and inner headers\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 13: Encapsulation at HA (Adding Outer Header) & Decapsulation at FA (Removing Outer Header)</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Encapsulation & Decapsulation:</strong></p><ul class=\"dcn-points\"><li><b>Encapsulation (HA):</b> The Home Agent prepends a new outer IPv4 header around the complete original packet. Outer Source = HA IP, Outer Destination = CoA. The original packet remains pristine as the payload.</li><li><b>Decapsulation (FA / MN):</b> Upon reaching the tunnel destination (CoA), the tunnel endpoint strips and discards the outer IP header.</li><li>The original untouched packet (Source: CN, Destination: HoA) is then delivered locally to the Mobile Node.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image13.png\" data-caption=\"Figure 13: Encapsulation at HA (Adding Outer Header) & Decapsulation at FA (Removing Outer Header)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image13.png\" alt=\"Diagram showing encapsulated packet structure with outer and inner headers\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 13: Encapsulation at HA (Adding Outer Header) & Decapsulation at FA (Removing Outer Header)</span></div></div>",
    "chips": [
      "IP-in-IP Encapsulation",
      "What is Tunneling?",
      "Reverse Tunneling",
      "Packet Delivery"
    ]
  },
  {
    "id": "dcn_ipinip",
    "num": 13,
    "q": "Explain IP-in-IP encapsulation.",
    "kw": [
      "ip in ip encapsulation",
      "ip in ip",
      "what is ip in ip",
      "rfc 2003",
      "explain ip-in-ip",
      "protocol 4 encapsulation",
      "ip in ip packet format"
    ],
    "a": "<p><strong>IP-in-IP Encapsulation (RFC 2003)</strong></p><p>IP-in-IP (RFC 2003) is the mandatory default encapsulation protocol in Mobile IPv4 where an entire IPv4 datagram is inserted as the payload of another IPv4 header.</p><ul class=\"dcn-points\"><li><b>Outer IP Header:</b> Added by HA. Version = 4, Protocol field = <b>4</b> (signifying IPv4 payload inside), Source = HA IP, Destination = CoA.</li><li><b>Inner IP Header:</b> Untouched original header. Source = CN IP, Destination = Mobile Node Home Address (HoA).</li><li><b>Overhead:</b> Adds exactly 20 bytes of IPv4 header overhead to every transmitted packet.</li><li>Routers along the Internet backbone forward strictly using the outer header.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Placing a standard letter envelope directly inside another identical standard postal envelope. Neither the inner letter nor the address on the inside envelope is modified!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image14.png\" data-caption=\"Figure 14: IP-in-IP Packet Format: Outer IP Header (Protocol 4) + Inner IP Datagram\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image14.png\" alt=\"Detailed header layout of IP-in-IP encapsulation showing outer and inner fields\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 14: IP-in-IP Packet Format: Outer IP Header (Protocol 4) + Inner IP Datagram</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> IP-in-IP (RFC 2003) is the mandatory default encapsulation protocol in Mobile IPv4 where an entire IPv4 datagram is inserted as the payload of another IPv4 header.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Placing a standard letter envelope directly inside another identical standard postal envelope. Neither the inner letter nor the address on the inside envelope is modified!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image14.png\" data-caption=\"Figure 14: IP-in-IP Packet Format: Outer IP Header (Protocol 4) + Inner IP Datagram\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image14.png\" alt=\"Detailed header layout of IP-in-IP encapsulation showing outer and inner fields\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 14: IP-in-IP Packet Format: Outer IP Header (Protocol 4) + Inner IP Datagram</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: IP-in-IP Encapsulation (RFC 2003)</span><p>Placing a standard letter envelope directly inside another identical standard postal envelope. Neither the inner letter nor the address on the inside envelope is modified!</p></div><p>This matches how <b>IP-in-IP Encapsulation (RFC 2003)</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image14.png\" data-caption=\"Figure 14: IP-in-IP Packet Format: Outer IP Header (Protocol 4) + Inner IP Datagram\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image14.png\" alt=\"Detailed header layout of IP-in-IP encapsulation showing outer and inner fields\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 14: IP-in-IP Packet Format: Outer IP Header (Protocol 4) + Inner IP Datagram</span></div></div>",
    "more": "<p><strong>In-depth breakdown of IP-in-IP Encapsulation (RFC 2003):</strong></p><ul class=\"dcn-points\"><li><b>Outer IP Header:</b> Added by HA. Version = 4, Protocol field = <b>4</b> (signifying IPv4 payload inside), Source = HA IP, Destination = CoA.</li><li><b>Inner IP Header:</b> Untouched original header. Source = CN IP, Destination = Mobile Node Home Address (HoA).</li><li><b>Overhead:</b> Adds exactly 20 bytes of IPv4 header overhead to every transmitted packet.</li><li>Routers along the Internet backbone forward strictly using the outer header.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image14.png\" data-caption=\"Figure 14: IP-in-IP Packet Format: Outer IP Header (Protocol 4) + Inner IP Datagram\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image14.png\" alt=\"Detailed header layout of IP-in-IP encapsulation showing outer and inner fields\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 14: IP-in-IP Packet Format: Outer IP Header (Protocol 4) + Inner IP Datagram</span></div></div>",
    "chips": [
      "Encapsulation and Decapsulation",
      "What is Tunneling?",
      "Reverse Tunneling",
      "Triangle Routing"
    ]
  },
  {
    "id": "dcn_reverse_tunneling",
    "num": 14,
    "q": "What is Reverse Tunneling?",
    "kw": [
      "what is reverse tunneling",
      "reverse tunneling",
      "reverse tunnel in mobile ip",
      "rfc 3024",
      "why reverse tunneling",
      "ingress filtering mobile ip",
      "reverse tunnel"
    ],
    "a": "<p><strong>Reverse Tunneling (RFC 3024)</strong></p><p>Reverse Tunneling routes outgoing packets from the Mobile Node back through a tunnel to the Home Agent before sending them to the Correspondent Node.</p><ul class=\"dcn-points\"><li><b>The Problem (Ingress Filtering):</b> Many border routers enforce RFC 2827 ingress filtering, dropping outgoing packets whose source IP (HoA) does not belong to the foreign subnet.</li><li><b>The Solution:</b> The MN sends its outgoing packets through an encrypted tunnel from the FA back to the HA.</li><li><b>Delivery:</b> The HA decapsulates the packet and forwards it normally to the CN, where the source address (HoA) is topologically valid.</li><li>Also solves issues with TTL limits, private address spaces, and corporate firewalls.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>If you try to drop an envelope into a foreign street mailbox with an out-of-state return address, a strict local security guard might flag it. With reverse tunneling, you hand it to your company's local branch, which sends it via internal courier back to headquarters to be mailed out officially!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image15.png\" data-caption=\"Figure 15: Reverse Tunneling Flow (MN \u2192 FA \u2192 HA \u2192 CN) Overcoming Ingress Filtering\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image15.png\" alt=\"Diagram contrasting standard direct routing with reverse tunneling through the Home Agent\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 15: Reverse Tunneling Flow (MN \u2192 FA \u2192 HA \u2192 CN) Overcoming Ingress Filtering</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Reverse Tunneling routes outgoing packets from the Mobile Node back through a tunnel to the Home Agent before sending them to the Correspondent Node.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>If you try to drop an envelope into a foreign street mailbox with an out-of-state return address, a strict local security guard might flag it. With reverse tunneling, you hand it to your company's local branch, which sends it via internal courier back to headquarters to be mailed out officially!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image15.png\" data-caption=\"Figure 15: Reverse Tunneling Flow (MN \u2192 FA \u2192 HA \u2192 CN) Overcoming Ingress Filtering\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image15.png\" alt=\"Diagram contrasting standard direct routing with reverse tunneling through the Home Agent\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 15: Reverse Tunneling Flow (MN \u2192 FA \u2192 HA \u2192 CN) Overcoming Ingress Filtering</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Reverse Tunneling (RFC 3024)</span><p>If you try to drop an envelope into a foreign street mailbox with an out-of-state return address, a strict local security guard might flag it. With reverse tunneling, you hand it to your company's local branch, which sends it via internal courier back to headquarters to be mailed out officially!</p></div><p>This matches how <b>Reverse Tunneling (RFC 3024)</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image15.png\" data-caption=\"Figure 15: Reverse Tunneling Flow (MN \u2192 FA \u2192 HA \u2192 CN) Overcoming Ingress Filtering\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image15.png\" alt=\"Diagram contrasting standard direct routing with reverse tunneling through the Home Agent\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 15: Reverse Tunneling Flow (MN \u2192 FA \u2192 HA \u2192 CN) Overcoming Ingress Filtering</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Reverse Tunneling (RFC 3024):</strong></p><ul class=\"dcn-points\"><li><b>The Problem (Ingress Filtering):</b> Many border routers enforce RFC 2827 ingress filtering, dropping outgoing packets whose source IP (HoA) does not belong to the foreign subnet.</li><li><b>The Solution:</b> The MN sends its outgoing packets through an encrypted tunnel from the FA back to the HA.</li><li><b>Delivery:</b> The HA decapsulates the packet and forwards it normally to the CN, where the source address (HoA) is topologically valid.</li><li>Also solves issues with TTL limits, private address spaces, and corporate firewalls.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image15.png\" data-caption=\"Figure 15: Reverse Tunneling Flow (MN \u2192 FA \u2192 HA \u2192 CN) Overcoming Ingress Filtering\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image15.png\" alt=\"Diagram contrasting standard direct routing with reverse tunneling through the Home Agent\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 15: Reverse Tunneling Flow (MN \u2192 FA \u2192 HA \u2192 CN) Overcoming Ingress Filtering</span></div></div>",
    "chips": [
      "What is Triangle Routing?",
      "Encapsulation and Decapsulation",
      "Foreign Agent CoA vs Co-located CoA",
      "Security in Mobile IPv4"
    ]
  },
  {
    "id": "dcn_fa_vs_colocated",
    "num": 15,
    "q": "Differentiate Foreign Agent CoA and co-located CoA.",
    "kw": [
      "foreign agent coa vs colocated coa",
      "foreign agent coa vs co located coa",
      "fa coa vs colocated coa",
      "difference between fa coa and colocated coa",
      "types of care of address",
      "types of coa",
      "colocated coa",
      "co-located coa"
    ],
    "a": "<p><strong>Foreign Agent CoA vs Co-located CoA</strong></p><p>An FA CoA is an address owned and shared by the Foreign Agent router, while a Co-located CoA is a dedicated temporary address assigned directly to the Mobile Node itself.</p><ul class=\"dcn-points\"><li><b>Foreign Agent CoA:</b> Provided by the FA through Agent Advertisements. The FA is the tunnel endpoint and decapsulates packets. Conserves IPv4 addresses because hundreds of mobile nodes can share one FA CoA.</li><li><b>Co-located CoA:</b> Acquired dynamically by the MN (via DHCP or manual static assignment). The MN acts as the tunnel endpoint and decapsulates packets locally. Requires an additional public IP address per mobile device.</li><li><b>Infrastructure:</b> FA CoA requires an FA router in the visited network; Co-located CoA can work on any foreign network without an FA.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p><b>FA CoA</b> is like receiving your mail at the <b>Hotel Front Desk</b> (the hotel staff receives and sorts mail for all guests). <b>Co-located CoA</b> is like renting your own <b>Private P.O. Box</b> in the visited city.</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image16.png\" data-caption=\"Figure 16: Structural Difference: Foreign Agent CoA (FA Endpoint) vs Co-located CoA (MN Endpoint)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image16.png\" alt=\"Diagram comparing Foreign Agent CoA and Co-located CoA architectural models\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 16: Structural Difference: Foreign Agent CoA (FA Endpoint) vs Co-located CoA (MN Endpoint)</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> An FA CoA is an address owned and shared by the Foreign Agent router, while a Co-located CoA is a dedicated temporary address assigned directly to the Mobile Node itself.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p><b>FA CoA</b> is like receiving your mail at the <b>Hotel Front Desk</b> (the hotel staff receives and sorts mail for all guests). <b>Co-located CoA</b> is like renting your own <b>Private P.O. Box</b> in the visited city.</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image16.png\" data-caption=\"Figure 16: Structural Difference: Foreign Agent CoA (FA Endpoint) vs Co-located CoA (MN Endpoint)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image16.png\" alt=\"Diagram comparing Foreign Agent CoA and Co-located CoA architectural models\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 16: Structural Difference: Foreign Agent CoA (FA Endpoint) vs Co-located CoA (MN Endpoint)</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Foreign Agent CoA vs Co-located CoA</span><p><b>FA CoA</b> is like receiving your mail at the <b>Hotel Front Desk</b> (the hotel staff receives and sorts mail for all guests). <b>Co-located CoA</b> is like renting your own <b>Private P.O. Box</b> in the visited city.</p></div><p>This matches how <b>Foreign Agent CoA vs Co-located CoA</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image16.png\" data-caption=\"Figure 16: Structural Difference: Foreign Agent CoA (FA Endpoint) vs Co-located CoA (MN Endpoint)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image16.png\" alt=\"Diagram comparing Foreign Agent CoA and Co-located CoA architectural models\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 16: Structural Difference: Foreign Agent CoA (FA Endpoint) vs Co-located CoA (MN Endpoint)</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Foreign Agent CoA vs Co-located CoA:</strong></p><ul class=\"dcn-points\"><li><b>Foreign Agent CoA:</b> Provided by the FA through Agent Advertisements. The FA is the tunnel endpoint and decapsulates packets. Conserves IPv4 addresses because hundreds of mobile nodes can share one FA CoA.</li><li><b>Co-located CoA:</b> Acquired dynamically by the MN (via DHCP or manual static assignment). The MN acts as the tunnel endpoint and decapsulates packets locally. Requires an additional public IP address per mobile device.</li><li><b>Infrastructure:</b> FA CoA requires an FA router in the visited network; Co-located CoA can work on any foreign network without an FA.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image16.png\" data-caption=\"Figure 16: Structural Difference: Foreign Agent CoA (FA Endpoint) vs Co-located CoA (MN Endpoint)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image16.png\" alt=\"Diagram comparing Foreign Agent CoA and Co-located CoA architectural models\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 16: Structural Difference: Foreign Agent CoA (FA Endpoint) vs Co-located CoA (MN Endpoint)</span></div></div>",
    "chips": [
      "Home Address vs Care-of Address",
      "What is a Mobility Binding?",
      "Agent Discovery",
      "Tunneling in Mobile IP"
    ]
  },
  {
    "id": "dcn_mobility_binding",
    "num": 16,
    "q": "What is a Mobility Binding?",
    "kw": [
      "what is mobility binding",
      "what is a mobility binding",
      "mobility binding in mobile ip",
      "binding table",
      "mobility binding table",
      "binding lifetime",
      "ha binding entry"
    ],
    "a": "<p><strong>Mobility Binding Table</strong></p><p>A Mobility Binding is an active entry in the Home Agent's cache that associates a Mobile Node's permanent Home Address with its current Care-of Address.</p><ul class=\"dcn-points\"><li><b>Core Association:</b> Maps `Home Address (HoA) \u2794 Care-of Address (CoA)`.</li><li><b>Lifetime:</b> Each binding has a countdown timer (lifetime). The MN must periodically re-register to renew it before expiration.</li><li><b>Routing Role:</b> When packets arrive for the HoA, the HA checks this table to find the destination IP for encapsulation.</li><li>If the lifetime drops to 0 without renewal, the binding expires and the HA stops forwarding packets.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Like the call-forwarding entry on a telephone switch: 'Forward all incoming calls for +91-98400-XXXXX to temporary roaming number +44-7700-XXXXX for the next 48 hours'.</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image17.png\" data-caption=\"Figure 17: Home Agent Mobility Binding Table Structure & Lifetime Management\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image17.png\" alt=\"Diagram showing Mobility Binding Table entries with HoA, CoA, and Lifetime\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 17: Home Agent Mobility Binding Table Structure & Lifetime Management</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> A Mobility Binding is an active entry in the Home Agent's cache that associates a Mobile Node's permanent Home Address with its current Care-of Address.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Like the call-forwarding entry on a telephone switch: 'Forward all incoming calls for +91-98400-XXXXX to temporary roaming number +44-7700-XXXXX for the next 48 hours'.</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image17.png\" data-caption=\"Figure 17: Home Agent Mobility Binding Table Structure & Lifetime Management\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image17.png\" alt=\"Diagram showing Mobility Binding Table entries with HoA, CoA, and Lifetime\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 17: Home Agent Mobility Binding Table Structure & Lifetime Management</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Mobility Binding Table</span><p>Like the call-forwarding entry on a telephone switch: 'Forward all incoming calls for +91-98400-XXXXX to temporary roaming number +44-7700-XXXXX for the next 48 hours'.</p></div><p>This matches how <b>Mobility Binding Table</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image17.png\" data-caption=\"Figure 17: Home Agent Mobility Binding Table Structure & Lifetime Management\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image17.png\" alt=\"Diagram showing Mobility Binding Table entries with HoA, CoA, and Lifetime\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 17: Home Agent Mobility Binding Table Structure & Lifetime Management</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Mobility Binding Table:</strong></p><ul class=\"dcn-points\"><li><b>Core Association:</b> Maps `Home Address (HoA) \u2794 Care-of Address (CoA)`.</li><li><b>Lifetime:</b> Each binding has a countdown timer (lifetime). The MN must periodically re-register to renew it before expiration.</li><li><b>Routing Role:</b> When packets arrive for the HoA, the HA checks this table to find the destination IP for encapsulation.</li><li>If the lifetime drops to 0 without renewal, the binding expires and the HA stops forwarding packets.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image17.png\" data-caption=\"Figure 17: Home Agent Mobility Binding Table Structure & Lifetime Management\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image17.png\" alt=\"Diagram showing Mobility Binding Table entries with HoA, CoA, and Lifetime\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 17: Home Agent Mobility Binding Table Structure & Lifetime Management</span></div></div>",
    "chips": [
      "Explain the Registration Process",
      "Home Address vs CoA",
      "Handoff Between Networks",
      "Packet Delivery"
    ]
  },
  {
    "id": "dcn_handoff",
    "num": 17,
    "q": "What happens when a Mobile Node moves to another foreign network?",
    "kw": [
      "what happens when a mobile node moves",
      "what happens when mobile node moves",
      "moving to another foreign network",
      "handoff in mobile ip",
      "handover in mobile ip",
      "mobile node movement",
      "switching foreign networks",
      "handoff"
    ],
    "a": "<p><strong>Handoff Between Foreign Networks</strong></p><p>When a Mobile Node roams into a new foreign network, it performs a seamless handoff: discovering the new agent, acquiring a new CoA, and updating its Home Agent binding.</p><ul class=\"dcn-points\"><li>1. <b>Movement Detection:</b> MN detects signal fading from the old FA and receives advertisements from the new FA (or misses old advertisements).</li><li>2. <b>Acquire New CoA:</b> MN obtains a new Care-of Address (CoA2) from the new foreign network.</li><li>3. <b>Send Registration Request:</b> MN transmits a new Registration Request to its HA via the new FA.</li><li>4. <b>Update Binding:</b> HA validates the message, updates its mobility binding from `HoA \u2794 CoA1` to `HoA \u2794 CoA2`, and replies with confirmation.</li><li>5. <b>Subsequent Traffic:</b> Packets are immediately redirected through the new tunnel to CoA2 without terminating active sessions.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Driving along a highway while streaming music: as your phone moves out of range of Cell Tower A and into Cell Tower B, the base station handoff switches your link smoothly in milliseconds without the music stuttering!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image18.png\" data-caption=\"Figure 18: Mobile Node Handoff: Deregistration from FA1 and Registration with FA2\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image18.png\" alt=\"Handoff sequence diagram showing transition from old Foreign Agent to new Foreign Agent\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 18: Mobile Node Handoff: Deregistration from FA1 and Registration with FA2</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> When a Mobile Node roams into a new foreign network, it performs a seamless handoff: discovering the new agent, acquiring a new CoA, and updating its Home Agent binding.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Driving along a highway while streaming music: as your phone moves out of range of Cell Tower A and into Cell Tower B, the base station handoff switches your link smoothly in milliseconds without the music stuttering!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image18.png\" data-caption=\"Figure 18: Mobile Node Handoff: Deregistration from FA1 and Registration with FA2\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image18.png\" alt=\"Handoff sequence diagram showing transition from old Foreign Agent to new Foreign Agent\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 18: Mobile Node Handoff: Deregistration from FA1 and Registration with FA2</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Handoff Between Foreign Networks</span><p>Driving along a highway while streaming music: as your phone moves out of range of Cell Tower A and into Cell Tower B, the base station handoff switches your link smoothly in milliseconds without the music stuttering!</p></div><p>This matches how <b>Handoff Between Foreign Networks</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image18.png\" data-caption=\"Figure 18: Mobile Node Handoff: Deregistration from FA1 and Registration with FA2\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image18.png\" alt=\"Handoff sequence diagram showing transition from old Foreign Agent to new Foreign Agent\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 18: Mobile Node Handoff: Deregistration from FA1 and Registration with FA2</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Handoff Between Foreign Networks:</strong></p><ul class=\"dcn-points\"><li>1. <b>Movement Detection:</b> MN detects signal fading from the old FA and receives advertisements from the new FA (or misses old advertisements).</li><li>2. <b>Acquire New CoA:</b> MN obtains a new Care-of Address (CoA2) from the new foreign network.</li><li>3. <b>Send Registration Request:</b> MN transmits a new Registration Request to its HA via the new FA.</li><li>4. <b>Update Binding:</b> HA validates the message, updates its mobility binding from `HoA \u2794 CoA1` to `HoA \u2794 CoA2`, and replies with confirmation.</li><li>5. <b>Subsequent Traffic:</b> Packets are immediately redirected through the new tunnel to CoA2 without terminating active sessions.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image18.png\" data-caption=\"Figure 18: Mobile Node Handoff: Deregistration from FA1 and Registration with FA2\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image18.png\" alt=\"Handoff sequence diagram showing transition from old Foreign Agent to new Foreign Agent\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 18: Mobile Node Handoff: Deregistration from FA1 and Registration with FA2</span></div></div>",
    "chips": [
      "Registration Process",
      "What is a Mobility Binding?",
      "What is Agent Discovery?",
      "Triangle Routing"
    ]
  },
  {
    "id": "dcn_triangle_routing",
    "num": 18,
    "q": "What is Triangle Routing?",
    "kw": [
      "what is triangle routing",
      "triangle routing in mobile ip",
      "triangle routing",
      "triangular routing",
      "triangle routing problem",
      "dogleg routing",
      "asymmetric routing mobile ip"
    ],
    "a": "<p><strong>Triangle Routing Problem</strong></p><p>Triangle Routing is an efficiency issue in Mobile IPv4 where forward packets must travel through the Home Agent first, while return packets travel directly, forming an indirect triangle.</p><ul class=\"dcn-points\"><li><b>Forward Path:</b> `CN \u2794 HA \u2794 (Tunnel) \u2794 MN` (must detour through the home network).</li><li><b>Return Path:</b> `MN \u2794 CN` (sent directly using standard IP routing).</li><li><b>The Inefficiency:</b> Even if the Correspondent Node and Mobile Node are in the exact same room or city, traffic must detour thousands of miles through the Home Agent!</li><li>Increases latency, consumes unnecessary backbone bandwidth, and creates a single point of failure at the HA.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Two students from Chennai meet at a conference in San Francisco. To message each other, Student A's packet flies 9,000 miles to their university server in Chennai, which tunnels it 9,000 miles back to San Francisco to reach Student B sitting 2 feet away!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image19.png\" data-caption=\"Figure 19: The Triangle Routing Path (CN \u2192 HA \u2192 FA \u2192 MN \u2192 CN)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image19.png\" alt=\"Triangle routing topology diagram illustrating forward detour vs direct return path\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 19: The Triangle Routing Path (CN \u2192 HA \u2192 FA \u2192 MN \u2192 CN)</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Triangle Routing is an efficiency issue in Mobile IPv4 where forward packets must travel through the Home Agent first, while return packets travel directly, forming an indirect triangle.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Two students from Chennai meet at a conference in San Francisco. To message each other, Student A's packet flies 9,000 miles to their university server in Chennai, which tunnels it 9,000 miles back to San Francisco to reach Student B sitting 2 feet away!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image19.png\" data-caption=\"Figure 19: The Triangle Routing Path (CN \u2192 HA \u2192 FA \u2192 MN \u2192 CN)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image19.png\" alt=\"Triangle routing topology diagram illustrating forward detour vs direct return path\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 19: The Triangle Routing Path (CN \u2192 HA \u2192 FA \u2192 MN \u2192 CN)</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Triangle Routing Problem</span><p>Two students from Chennai meet at a conference in San Francisco. To message each other, Student A's packet flies 9,000 miles to their university server in Chennai, which tunnels it 9,000 miles back to San Francisco to reach Student B sitting 2 feet away!</p></div><p>This matches how <b>Triangle Routing Problem</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image19.png\" data-caption=\"Figure 19: The Triangle Routing Path (CN \u2192 HA \u2192 FA \u2192 MN \u2192 CN)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image19.png\" alt=\"Triangle routing topology diagram illustrating forward detour vs direct return path\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 19: The Triangle Routing Path (CN \u2192 HA \u2192 FA \u2192 MN \u2192 CN)</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Triangle Routing Problem:</strong></p><ul class=\"dcn-points\"><li><b>Forward Path:</b> `CN \u2794 HA \u2794 (Tunnel) \u2794 MN` (must detour through the home network).</li><li><b>Return Path:</b> `MN \u2794 CN` (sent directly using standard IP routing).</li><li><b>The Inefficiency:</b> Even if the Correspondent Node and Mobile Node are in the exact same room or city, traffic must detour thousands of miles through the Home Agent!</li><li>Increases latency, consumes unnecessary backbone bandwidth, and creates a single point of failure at the HA.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image19.png\" data-caption=\"Figure 19: The Triangle Routing Path (CN \u2192 HA \u2192 FA \u2192 MN \u2192 CN)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image19.png\" alt=\"Triangle routing topology diagram illustrating forward detour vs direct return path\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 19: The Triangle Routing Path (CN \u2192 HA \u2192 FA \u2192 MN \u2192 CN)</span></div></div>",
    "chips": [
      "What is Reverse Tunneling?",
      "Advantages and Limitations",
      "Packet Delivery",
      "Architecture of Mobile IP"
    ]
  },
  {
    "id": "dcn_security",
    "num": 19,
    "q": "Explain security in Mobile IPv4.",
    "kw": [
      "explain security in mobile ipv4",
      "explain security in mobile ip",
      "security in mobile ip",
      "mobile ip security",
      "security in mobile ipv4",
      "authentication extension",
      "replay protection in mobile ip",
      "mobile home authentication extension"
    ],
    "a": "<p><strong>Mobile IPv4 Security & Authentication</strong></p><p>Mobile IPv4 relies on mandatory authentication extensions and 64-bit replay protection to prevent malicious attackers from forging registrations and hijacking traffic.</p><ul class=\"dcn-points\"><li><b>The Threat:</b> Without authentication, an attacker could forge a Registration Request and redirect all of the victim's confidential traffic to their own rogue IP address.</li><li><b>Mobile-Home Authentication Extension (MHAE):</b> Mandatory cryptographic extension using HMAC-MD5 with a shared secret key between MN and HA.</li><li><b>Replay Protection:</b> The 64-bit Identification field in Registration packets uses timestamp-based or nonce-based sequencing to reject eavesdropped replay packets.</li><li>Optional FA extensions authenticate the Mobile-Foreign and Foreign-Home relationships.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Updating your registered mobile number on your net banking portal: the bank requires a secret PIN, multi-factor authentication, and a one-time timestamped OTP to ensure no fraudster can forge your request or reuse yesterday's code!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image20.png\" data-caption=\"Figure 20: Mobile-Home Authentication Extension (MHAE) & Replay Protection Architecture\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image20.png\" alt=\"Security architecture diagram illustrating MHAE extension and replay protection\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 20: Mobile-Home Authentication Extension (MHAE) & Replay Protection Architecture</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Mobile IPv4 relies on mandatory authentication extensions and 64-bit replay protection to prevent malicious attackers from forging registrations and hijacking traffic.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Updating your registered mobile number on your net banking portal: the bank requires a secret PIN, multi-factor authentication, and a one-time timestamped OTP to ensure no fraudster can forge your request or reuse yesterday's code!</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image20.png\" data-caption=\"Figure 20: Mobile-Home Authentication Extension (MHAE) & Replay Protection Architecture\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image20.png\" alt=\"Security architecture diagram illustrating MHAE extension and replay protection\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 20: Mobile-Home Authentication Extension (MHAE) & Replay Protection Architecture</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Mobile IPv4 Security & Authentication</span><p>Updating your registered mobile number on your net banking portal: the bank requires a secret PIN, multi-factor authentication, and a one-time timestamped OTP to ensure no fraudster can forge your request or reuse yesterday's code!</p></div><p>This matches how <b>Mobile IPv4 Security & Authentication</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image20.png\" data-caption=\"Figure 20: Mobile-Home Authentication Extension (MHAE) & Replay Protection Architecture\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image20.png\" alt=\"Security architecture diagram illustrating MHAE extension and replay protection\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 20: Mobile-Home Authentication Extension (MHAE) & Replay Protection Architecture</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Mobile IPv4 Security & Authentication:</strong></p><ul class=\"dcn-points\"><li><b>The Threat:</b> Without authentication, an attacker could forge a Registration Request and redirect all of the victim's confidential traffic to their own rogue IP address.</li><li><b>Mobile-Home Authentication Extension (MHAE):</b> Mandatory cryptographic extension using HMAC-MD5 with a shared secret key between MN and HA.</li><li><b>Replay Protection:</b> The 64-bit Identification field in Registration packets uses timestamp-based or nonce-based sequencing to reject eavesdropped replay packets.</li><li>Optional FA extensions authenticate the Mobile-Foreign and Foreign-Home relationships.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image20.png\" data-caption=\"Figure 20: Mobile-Home Authentication Extension (MHAE) & Replay Protection Architecture\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image20.png\" alt=\"Security architecture diagram illustrating MHAE extension and replay protection\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 20: Mobile-Home Authentication Extension (MHAE) & Replay Protection Architecture</span></div></div>",
    "chips": [
      "Registration Request and Reply",
      "Registration Process",
      "Advantages and Limitations",
      "What is Mobile IPv4?"
    ]
  },
  {
    "id": "dcn_pros_cons",
    "num": 20,
    "q": "State the advantages and limitations of Mobile IPv4.",
    "kw": [
      "advantages and limitations of mobile ipv4",
      "advantages and limitations of mobile ip",
      "advantages and limitations",
      "pros and cons of mobile ip",
      "advantages of mobile ip",
      "limitations of mobile ip",
      "disadvantages of mobile ip",
      "benefits of mobile ipv4"
    ],
    "a": "<p><strong>Advantages and Limitations of Mobile IPv4</strong></p><p>Mobile IPv4 offers seamless session continuity and application transparency, but suffers from triangle routing latency, encapsulation overhead, and IPv4 address limitations.</p><ul class=\"dcn-points\"><li><b>Key Advantages:</b><br>\u2022 Seamless mobility: TCP/IP connections never drop during handoffs.<br>\u2022 Transparency: Applications and correspondent nodes require zero modifications.<br>\u2022 Compatibility: Operates cleanly on standard IPv4 Internet backbones.</li><li><b>Key Limitations:</b><br>\u2022 Triangle routing: Detouring through HA adds significant packet latency.<br>\u2022 Overhead: IP-in-IP encapsulation adds 20 bytes to every packet, causing MTU fragmentation.<br>\u2022 Signaling overhead: Frequent periodic advertisements and registrations consume wireless bandwidth.<br>\u2022 Security management: Requires pre-configured shared secrets across mobile devices.</li></ul><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Like traveling first class on a commercial airline: total comfort and seamless service anywhere in the world (Advantages), but tickets cost extra luggage fees and flights must follow fixed airline route hubs rather than straight lines (Limitations).</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image21.png\" data-caption=\"Figure 21: Summary of Mobile IPv4 Advantages (Seamless Continuity & Transparency)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image21.png\" alt=\"Diagram listing core advantages of Mobile IPv4\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 21: Summary of Mobile IPv4 Advantages (Seamless Continuity & Transparency)</span></div></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image22.png\" data-caption=\"Figure 22: Summary of Mobile IPv4 Limitations (Overhead, Delay, and Scalability)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image22.png\" alt=\"Diagram highlighting key limitations of Mobile IPv4\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 22: Summary of Mobile IPv4 Limitations (Overhead, Delay, and Scalability)</span></div></div>",
    "simple": "<p><strong>In simple terms:</strong> Mobile IPv4 offers seamless session continuity and application transparency, but suffers from triangle routing latency, encapsulation overhead, and IPv4 address limitations.</p><div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Real-World Example</span><p>Like traveling first class on a commercial airline: total comfort and seamless service anywhere in the world (Advantages), but tickets cost extra luggage fees and flights must follow fixed airline route hubs rather than straight lines (Limitations).</p></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image21.png\" data-caption=\"Figure 21: Summary of Mobile IPv4 Advantages (Seamless Continuity & Transparency)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image21.png\" alt=\"Diagram listing core advantages of Mobile IPv4\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 21: Summary of Mobile IPv4 Advantages (Seamless Continuity & Transparency)</span></div></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image22.png\" data-caption=\"Figure 22: Summary of Mobile IPv4 Limitations (Overhead, Delay, and Scalability)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image22.png\" alt=\"Diagram highlighting key limitations of Mobile IPv4\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 22: Summary of Mobile IPv4 Limitations (Overhead, Delay, and Scalability)</span></div></div>",
    "ex": "<div class=\"dcn-example-box\"><span class=\"dcn-example-tag\">\ud83d\udca1 Practical Real-World Example: Advantages and Limitations of Mobile IPv4</span><p>Like traveling first class on a commercial airline: total comfort and seamless service anywhere in the world (Advantages), but tickets cost extra luggage fees and flights must follow fixed airline route hubs rather than straight lines (Limitations).</p></div><p>This matches how <b>Advantages and Limitations of Mobile IPv4</b> coordinates packets across subnets!</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image21.png\" data-caption=\"Figure 21: Summary of Mobile IPv4 Advantages (Seamless Continuity & Transparency)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image21.png\" alt=\"Diagram listing core advantages of Mobile IPv4\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 21: Summary of Mobile IPv4 Advantages (Seamless Continuity & Transparency)</span></div></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image22.png\" data-caption=\"Figure 22: Summary of Mobile IPv4 Limitations (Overhead, Delay, and Scalability)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image22.png\" alt=\"Diagram highlighting key limitations of Mobile IPv4\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 22: Summary of Mobile IPv4 Limitations (Overhead, Delay, and Scalability)</span></div></div>",
    "more": "<p><strong>In-depth breakdown of Advantages and Limitations of Mobile IPv4:</strong></p><ul class=\"dcn-points\"><li><b>Key Advantages:</b><br>\u2022 Seamless mobility: TCP/IP connections never drop during handoffs.<br>\u2022 Transparency: Applications and correspondent nodes require zero modifications.<br>\u2022 Compatibility: Operates cleanly on standard IPv4 Internet backbones.</li><li><b>Key Limitations:</b><br>\u2022 Triangle routing: Detouring through HA adds significant packet latency.<br>\u2022 Overhead: IP-in-IP encapsulation adds 20 bytes to every packet, causing MTU fragmentation.<br>\u2022 Signaling overhead: Frequent periodic advertisements and registrations consume wireless bandwidth.<br>\u2022 Security management: Requires pre-configured shared secrets across mobile devices.</li></ul><p>See the official diagram below for the architectural layout:</p><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image21.png\" data-caption=\"Figure 21: Summary of Mobile IPv4 Advantages (Seamless Continuity & Transparency)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image21.png\" alt=\"Diagram listing core advantages of Mobile IPv4\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 21: Summary of Mobile IPv4 Advantages (Seamless Continuity & Transparency)</span></div></div><div class=\"shinchi-diagram-card\"><div class=\"shinchi-diagram-wrapper\" data-zoom=\"assets/images/dcn/image22.png\" data-caption=\"Figure 22: Summary of Mobile IPv4 Limitations (Overhead, Delay, and Scalability)\"><span class=\"shinchi-diagram-badge\">\ud83d\udd0d Click to zoom</span><img src=\"assets/images/dcn/image22.png\" alt=\"Diagram highlighting key limitations of Mobile IPv4\" class=\"shinchi-diagram-img\" loading=\"lazy\"></div><div class=\"shinchi-diagram-caption\"><span>\ud83d\uddbc\ufe0f Figure 22: Summary of Mobile IPv4 Limitations (Overhead, Delay, and Scalability)</span></div></div>",
    "chips": [
      "What is Triangle Routing?",
      "What is Mobile IPv4?",
      "IP-in-IP Encapsulation",
      "Security in Mobile IPv4"
    ]
  },
  {
    "id": "osi_model",
    "q": "What is the OSI Model?",
    "kw": [
      "osi model",
      "7 layers",
      "osi layers",
      "open systems interconnection",
      "what are the 7 layers of osi"
    ],
    "a": "<p><strong>The 7-Layer OSI Model</strong></p><p>A reference architecture dividing network communication into seven logical layers:</p><ol><li><b>Physical:</b> Bits on wires/radio (Ethernet cable, Wi-Fi PHY).</li><li><b>Data Link:</b> Frames, MAC addresses (Ethernet 802.3, Wi-Fi 802.11).</li><li><b>Network:</b> Packets, IP addressing, routing (IPv4, Mobile IP, ICMP).</li><li><b>Transport:</b> End-to-end ports, reliability (TCP, UDP).</li><li><b>Session:</b> Dialogue control and token management.</li><li><b>Presentation:</b> Encryption, compression, format translation (TLS, ASCII).</li><li><b>Application:</b> User services (HTTP, DNS, SSH, SMTP).</li></ol>",
    "simple": "<p>The OSI model is a 7-step blueprint for how data travels from your screen to physical electrical wires and back.</p>",
    "ex": "<p>Like sending a physical parcel: you write a letter (App), translate to English (Presentation), book an appointment (Session), pick Express vs Standard mail (Transport), label postal codes (Network), seal in a sturdy box (Data Link), and hand to a delivery truck driver (Physical).</p>",
    "more": "<p><b>Remember:</b> <i>Please Do Not Throw Sausage Pizza Away</i> (Physical, Data Link, Network, Transport, Session, Presentation, Application)!</p>",
    "chips": [
      "TCP/IP vs OSI",
      "What is Mobile IPv4?",
      "TCP vs UDP",
      "Encapsulation and Decapsulation"
    ]
  },
  {
    "id": "tcp_vs_udp",
    "q": "What is the difference between TCP and UDP?",
    "kw": [
      "tcp vs udp",
      "difference between tcp and udp",
      "tcp and udp",
      "transmission control protocol",
      "user datagram protocol"
    ],
    "a": "<p><strong>TCP vs UDP (Transport Layer)</strong></p><ul><li><b>TCP (Transmission Control Protocol):</b> Connection-oriented (3-way handshake), reliable, guarantees in-order delivery via ACKs and retransmissions, flow control and congestion control. Used for Web (HTTP/HTTPS), Email, SSH, File Transfer.</li><li><b>UDP (User Datagram Protocol):</b> Connectionless, lightweight, unreliable 'fire-and-forget', minimal 8-byte header overhead, no retransmissions. Used for VoIP, Video Streaming, Gaming, and <b>Mobile IP Registration (UDP port 434)</b>!</li></ul>",
    "simple": "<p>TCP is like a recorded delivery letter with a signature required. UDP is like a postcard tossed in a mailbox: fast and simple, but not guaranteed to arrive.</p>",
    "ex": "<p>When downloading an operating system update, you need TCP so not a single byte is corrupted. When playing an online multiplayer shooting game or streaming live cricket, you use UDP for instantaneous zero-latency updates.</p>",
    "more": "<p><b>Mobile IP Connection:</b> Mobile IP registration uses UDP port 434 because registration is lightweight, periodic, and needs fast timeout recovery rather than heavy TCP connection overhead.</p>",
    "chips": [
      "Registration Request and Reply",
      "What is Mobile IPv4?",
      "Architecture of Mobile IP",
      "OSI Model"
    ]
  },
  {
    "id": "proxy_arp",
    "q": "What is Proxy ARP in Mobile IP?",
    "kw": [
      "proxy arp",
      "what is proxy arp",
      "arp in mobile ip",
      "address resolution protocol",
      "gratuitous arp"
    ],
    "a": "<p><strong>Proxy ARP in Mobile IPv4</strong></p><p>When a Mobile Node leaves its home network, other local nodes would normally broadcast an ARP request asking <i>'Who has IP 192.168.1.50?'</i></p><p>Since the MN is away, the <b>Home Agent (HA)</b> acts as a proxy: it replies with its own MAC address! This trick causes the local router to deliver the MN's incoming packets directly to the Home Agent, allowing the HA to tunnel them to the Care-of Address.</p>",
    "simple": "<p>Proxy ARP is when the Home Agent answers on behalf of the absent Mobile Node, pretending to be the node so it can collect its mail.</p>",
    "ex": "<p>Imagine living in an apartment: while you're away traveling, your roommate steps to the front door and says 'I will sign for his parcels while he is out!'.</p>",
    "more": "<p>When the MN returns home, it broadcasts a <b>Gratuitous ARP</b> to tell all local routers: 'I am back! Send packets directly to my physical MAC address again, not the Home Agent.'",
    "chips": [
      "Packet Delivery",
      "Functions of MN HA FA",
      "Encapsulation and Decapsulation",
      "Handoff Between Networks"
    ]
  }
];

  /* ------------------------------------------------------------------
     LOOKUP MAPS & KEYWORD WEIGHT SCORING
  ------------------------------------------------------------------ */
  var BY_ID = {};

  function normalize(t) {
    return ' ' + String(t).toLowerCase().replace(/['‘’`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
  }

  KB.forEach(function (e) {
    BY_ID[e.id] = e;
    e._k = e.kw.map(function (k) {
      var n = normalize(k).trim();
      return { n: ' ' + n + ' ', w: Math.max(2, n.split(' ').length * 2) };
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
    return bs >= 3 ? best : null;
  }

  /* ------------------------------------------------------------------
     4. CONVERSATIONAL LOGIC & MULTI-TURN CONTEXT
  ------------------------------------------------------------------ */
  var INTRO = '<p>Hi! I am <b>Shinchi</b>, your Mobile IP &amp; Computer Networking tutor! 👋</p>' +
    '<p>I have mastered your <b>Mobile IPv4 (DCN) syllabus</b>, complete with simple explanations, real-world analogies, and original architectural diagrams.</p>' +
    '<p>Type any question below &mdash; such as <i>"What is encapsulation?"</i>, <i>"Explain tunneling"</i>, or <i>"Why is Mobile IP required?"</i> to begin!</p>';

  var chatState = {
    last: null,
    shown: {}
  };

  function seen(id, v) {
    if (!chatState.shown[id]) chatState.shown[id] = {};
    chatState.shown[id][v] = true;
  }

  function hasSeen(id, v) {
    return !!(chatState.shown[id] && chatState.shown[id][v]);
  }

  function isExample(n) {
    return /\b(example|analogy|real world|instance|use case|scenario|story|illustrate|how does it look)\b/.test(n);
  }

  function isSimple(n) {
    return /\b(simple|simply|eli5|easy|plain english|beginner|short|brief|summarize|nutshell|quick)\b/.test(n);
  }

  function isMore(n) {
    return /\b(more|detail|details|deeper|elaborate|deep dive|in depth|rfc|technical|packet|fields)\b/.test(n);
  }

  function isFollowWord(n) {
    return /\b(yes|yeah|sure|ok|okay|continue|go on|next|proceed|tell me)\b/.test(n);
  }

  function variant(e, v) {
    seen(e.id, v);
    var lead = { ex: 'Here is a practical real-world analogy: ', simple: 'Let me explain it in simple terms: ', more: 'Here is the detailed breakdown: ' }[v];
    var body = e[v] || e.a;
    if (v === 'a') return body;
    return '<p><span class="lead"><strong>' + lead.trim() + '</strong></span></p>' + body;
  }

  function topicReply(e, n) {
    chatState.last = e;
    var v = 'a';
    if (isExample(n) && e.ex) v = 'ex';
    else if (isSimple(n)) v = e.simple ? 'simple' : (e.ex ? 'ex' : 'a');
    else if (isMore(n) && e.more) v = 'more';
    if (v === 'a') chatState.shown[e.id] = {};
    return { html: variant(e, v) };
  }

  function followUp(n) {
    var e = chatState.last;
    if (!e) return null;
    if (isExample(n) && e.ex) return { html: variant(e, 'ex') };
    if (isSimple(n)) {
      var sv = e.simple ? 'simple' : (e.ex ? 'ex' : 'a');
      return { html: variant(e, sv) };
    }
    if (isMore(n) || isFollowWord(n)) {
      var order = ['more', 'ex', 'simple'];
      for (var i = 0; i < order.length; i++) {
        var v = order[i];
        if (e[v] && !hasSeen(e.id, v)) return { html: variant(e, v) };
      }
      return {
        html: '<p>That covers the core essentials of <b>' + e.q.replace(/^What is (a |an )?|\?$/g, '') + '</b>! Feel free to ask another question anytime.</p>'
      };
    }
    return null;
  }

  function smallTalk(n) {
    if (/\b(hi|hello|hey|greetings|good (morning|afternoon|evening)|yo)\b/.test(n)) {
      return {
        html: '<p>Hello there! Ready to master Mobile IPv4? Ask me about <b>encapsulation</b>, <b>tunneling</b>, <b>HA/FA roles</b>, or any diagram from your DCN document!</p>'
      };
    }
    if (/\b(thanks|thank you|thx|awesome|great|cool|nice)\b/.test(n)) {
      return {
        html: '<p>You\'re very welcome! Keep asking questions, exploring diagrams, or test yourself with another networking concept! 🚀</p>'
      };
    }
    if (/\b(who are you|what is your name|your name|shinchi)\b/.test(n)) {
      return {
        html: '<p>I am <b>Shinchi</b>, your animated AI study companion and Mobile IP visual tutor. I know all 20 Mobile IPv4 concepts from your DCN document inside out!</p>'
      };
    }
    if (/\b(book|books|textbook|author|read|reading|study material)\b/.test(n)) {
      var bHtml = '<p><strong>Recommended Networking &amp; Mobile IP Textbooks:</strong></p><ul>';
      BOOKS.forEach(function (b) {
        bHtml += '<li><b>' + b.title + '</b> (' + b.edition + ') &mdash; <i>' + b.author + '</i><br><span style="font-size:0.85em;color:#93c5fd;">' + b.note + '</span> &bull; <a href="' + b.url + '" target="_blank" rel="noopener">Find on Google Books &rarr;</a></li>';
      });
      bHtml += '</ul>';
      return { html: bHtml };
    }
    if (/\b(website|sites|links|rfc|where to learn|online resources)\b/.test(n)) {
      var sHtml = '<p><strong>Authoritative Study Websites &amp; RFC Standards:</strong></p><ul>';
      SITES.forEach(function (s) {
        sHtml += '<li><a href="' + s.url + '" target="_blank" rel="noopener"><b>' + s.name + '</b></a>: ' + s.desc + '</li>';
      });
      sHtml += '</ul>';
      return { html: sHtml };
    }
    return null;
  }

  function fallback(raw) {
    return {
      html: '<p>I didn\'t quite catch that. Try asking about a specific Mobile IP or networking topic:</p>' +
        '<ul>' +
        '<li><b>What is encapsulation?</b> (Shows the double-envelope diagram)</li>' +
        '<li><b>What is tunneling?</b> (Shows tunnel entry &amp; exit points)</li>' +
        '<li><b>Home Address vs Care-of Address</b></li>' +
        '<li><b>Registration process</b> (Shows the 4-way handshake)</li>' +
        '<li><b>Triangle routing problem</b></li>' +
        '</ul>'
    };
  }

  function answer(text) {
    var n = normalize(text);
    var st = smallTalk(n);
    if (st) return st;
    var fu = followUp(n);
    if (fu) return fu;
    var t = bestTopic(n);
    if (t) return topicReply(t, n);
    return fallback(text);
  }

  /* ------------------------------------------------------------------
     5. UI CONTROLLER & CHAT INTERACTION
  ------------------------------------------------------------------ */
  var AVATAR_SVG = '<div class="shinchi-mini-avatar" aria-hidden="true"><img src="assets/images/shinchi-avatar.jpg" alt="Shinchi" class="avatar-img" onerror="this.style.display=\'none\'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="17" r="1.6" fill="currentColor" stroke="none"/><path d="M8.2 13.6a5.4 5.4 0 0 1 7.6 0M5 10.3a9.9 9.9 0 0 1 14 0M12 17v3.5"/></svg></div>';

  var launcher = document.getElementById('shinchiLauncher');
  var windowEl = document.getElementById('shinchiWindow');
  var fullscreenBtn = document.getElementById('shinchiFullscreen');
  var closeBtn = document.getElementById('shinchiClose');
  var resetBtn = document.getElementById('shinchiReset');
  var log = document.getElementById('shinchiLog');
  var form = document.getElementById('shinchiForm');
  var input = document.getElementById('shinchiInput');

  // Fullscreen controller
  function toggleFullscreen() {
    if (!windowEl) return;
    windowEl.classList.toggle('fullscreen');
    var isFull = windowEl.classList.contains('fullscreen');
    if (fullscreenBtn) {
      fullscreenBtn.setAttribute('title', isFull ? 'Restore original size' : 'Expand to fullscreen');
      fullscreenBtn.setAttribute('aria-label', isFull ? 'Restore original size' : 'Expand to fullscreen');
    }
    scrollDown();
  }

  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Lightbox elements
  var lightbox = document.getElementById('shinchiLightbox');
  var lightboxImg = document.getElementById('shinchiLightboxImg');
  var lightboxCaption = document.getElementById('shinchiLightboxCaption');
  var lightboxClose = document.getElementById('shinchiLightboxClose');
  var lightboxBackdrop = document.getElementById('shinchiLightboxBackdrop');

  function openLightbox(url, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = url;
    lightboxImg.alt = caption || 'Diagram';
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxImg) lightboxImg.src = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
      e.stopPropagation();
    }
  });

  // Diagram zoom delegate in chat log
  if (log) {
    log.addEventListener('click', function (e) {
      var wrapper = e.target.closest('.shinchi-diagram-wrapper');
      if (wrapper) {
        var zoomUrl = wrapper.getAttribute('data-zoom') || (wrapper.querySelector('img') ? wrapper.querySelector('img').src : '');
        var caption = wrapper.getAttribute('data-caption') || '';
        if (zoomUrl) openLightbox(zoomUrl, caption);
      }
    });
  }

  function scrollDown() {
    if (log) {
      setTimeout(function () {
        log.scrollTop = log.scrollHeight;
      }, 50);
    }
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

  function send(raw) {
    var text = (raw || (input ? input.value : '')).trim();
    if (!text) return;
    if (input) { input.value = ''; input.focus(); }
    addUser(text);
    var tRow = addTyping();

    // Check optional external backend API (hook)
    var apiUrl = window.SHINCHI_API_URL || null;
    if (apiUrl) {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: chatState })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (tRow && tRow.parentNode) tRow.parentNode.removeChild(tRow);
        if (data && data.reply) {
          addBot(data.reply);
        } else {
          deliverBuiltInReply(text);
        }
      })
      .catch(function () {
        if (tRow && tRow.parentNode) tRow.parentNode.removeChild(tRow);
        deliverBuiltInReply(text);
      });
      return;
    }

    // Pure client-side delivery with natural typing delay
    var delay = 320 + Math.random() * 200;
    setTimeout(function () {
      if (tRow && tRow.parentNode) tRow.parentNode.removeChild(tRow);
      deliverBuiltInReply(text);
    }, delay);
  }

  function deliverBuiltInReply(text) {
    var res = answer(text);
    addBot(res.html);
  }

  function start() {
    if (!log) return;
    log.innerHTML = '';
    chatState.last = null;
    chatState.shown = {};
    addBot(INTRO);
  }

  function openChat() {
    if (!windowEl) return;
    windowEl.classList.add('open');
    windowEl.setAttribute('aria-hidden', 'false');
    if (launcher) launcher.setAttribute('aria-expanded', 'true');
    if (log && log.children.length === 0) start();
    setTimeout(function () { if (input) input.focus(); }, 200);
  }

  function closeChat() {
    if (!windowEl) return;
    windowEl.classList.remove('open');
    windowEl.classList.remove('fullscreen');
    windowEl.setAttribute('aria-hidden', 'true');
    if (launcher) launcher.setAttribute('aria-expanded', 'false');
    if (fullscreenBtn) {
      fullscreenBtn.setAttribute('title', 'Expand to fullscreen');
      fullscreenBtn.setAttribute('aria-label', 'Expand to fullscreen');
    }
  }

  function toggleChat() {
    if (!windowEl) return;
    if (windowEl.classList.contains('open')) closeChat();
    else openChat();
  }

  if (launcher) launcher.addEventListener('click', toggleChat);
  if (closeBtn) closeBtn.addEventListener('click', closeChat);
  if (resetBtn) resetBtn.addEventListener('click', function () { start(); });

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      send();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (windowEl && windowEl.classList.contains('fullscreen')) {
        toggleFullscreen();
        e.stopPropagation();
      } else if (windowEl && windowEl.classList.contains('open')) {
        closeChat();
      }
    }
  });

  // Public API
  window.Shinchi = {
    open: openChat,
    close: closeChat,
    toggle: toggleChat,
    toggleFullscreen: toggleFullscreen,
    reset: start,
    ask: send,
    openLightbox: openLightbox,
    closeLightbox: closeLightbox,
    KB: KB
  };

})();
