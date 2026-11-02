/**
 * Mobile IP Virtual Lab - Dashboard Script
 * Handles Tab Navigation, Video Player, 10-Question Accordion, and 5 Case Workflows.
 */

(function () {
  'use strict';

  // --- 1. GLOBAL TAB NAVIGATION ---
  const navTabs = document.querySelectorAll('.tab-btn');
  const tabViews = document.querySelectorAll('.tab-view');
  const casesListView = document.getElementById('casesListView');
  const caseWorkflowViews = document.querySelectorAll('.case-workflow-view');

  function switchTab(targetId, updateHash = true) {
    const cleanId = (targetId || 'simulation').replace('#', '');

    // Reset case workflow views back to list when navigating tabs
    if (casesListView) casesListView.style.display = 'block';
    caseWorkflowViews.forEach(v => v.classList.remove('active'));

    navTabs.forEach(btn => {
      const href = btn.getAttribute('href').replace('#', '');
      if (href === cleanId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    tabViews.forEach(view => {
      if (view.id === cleanId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    if (updateHash) {
      history.replaceState(null, null, `#${cleanId}`);
    }

    // Invalidate map for smooth rendering
    if (cleanId === 'simulation' && window.MobileIPSimulation && window.MobileIPSimulation.invalidateMap) {
      setTimeout(() => {
        window.MobileIPSimulation.invalidateMap();
      }, 100);
    }
  }

  navTabs.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      switchTab(btn.getAttribute('href'), true);
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash || '#simulation';
    // If hash starts with case-, open that case
    if (hash.startsWith('#case-')) {
      const caseNum = hash.replace('#case-', '');
      openCaseWorkflow(caseNum, false);
    } else {
      switchTab(hash, false);
    }
  });

  // Initial load
  const initialHash = window.location.hash || '#simulation';
  if (initialHash.startsWith('#case-')) {
    switchTab('cases', false);
    openCaseWorkflow(initialHash.replace('#case-', ''), false);
  } else {
    switchTab(initialHash, false);
  }


  // --- 2. VIDEO LEARNING MODULE ---
  const video = document.getElementById('labVideo');
  const videoPlaceholder = document.getElementById('videoPlaceholder');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const bigPlayBtn = document.getElementById('bigPlayBtn');
  const videoProgressContainer = document.getElementById('videoProgressContainer');
  const videoProgressFill = document.getElementById('videoProgressFill');
  const timeDisplay = document.getElementById('timeDisplay');
  const muteBtn = document.getElementById('muteBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const customVideoInput = document.getElementById('customVideoInput');

  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function updateVideoProgress() {
    if (!video || !video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (videoProgressFill) videoProgressFill.style.width = `${pct}%`;
    if (timeDisplay) timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  }

  function togglePlay() {
    if (!video) return;
    if (!video.src || video.src === window.location.href || video.src.endsWith('/')) {
      alert('Your anime-style Shin-chan video placeholder is ready! Place your video at assets/explanation.mp4 or use the preview button below to test.');
      return;
    }

    if (video.paused || video.ended) {
      video.play().then(() => {
        if (videoPlaceholder) videoPlaceholder.classList.add('hidden');
        setPlayIcon(true);
      }).catch(() => {});
    } else {
      video.pause();
      setPlayIcon(false);
    }
  }

  function setPlayIcon(isPlaying) {
    if (!playPauseBtn) return;
    if (isPlaying) {
      playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    } else {
      playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    }
  }

  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
  if (bigPlayBtn) bigPlayBtn.addEventListener('click', togglePlay);

  if (video) {
    video.addEventListener('timeupdate', updateVideoProgress);
    video.addEventListener('loadedmetadata', updateVideoProgress);
    video.addEventListener('play', () => setPlayIcon(true));
    video.addEventListener('pause', () => setPlayIcon(false));
    video.addEventListener('ended', () => {
      setPlayIcon(false);
      if (videoPlaceholder) videoPlaceholder.classList.remove('hidden');
    });

    // Check if assets/explanation.mp4 exists
    fetch('assets/explanation.mp4', { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          video.src = 'assets/explanation.mp4';
          video.load();
        }
      })
      .catch(() => {});
  }

  if (videoProgressContainer) {
    videoProgressContainer.addEventListener('click', (e) => {
      if (!video || !video.duration) return;
      const rect = videoProgressContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * video.duration;
      updateVideoProgress();
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      if (!video) return;
      video.volume = parseFloat(e.target.value);
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      if (!video) return;
      video.muted = !video.muted;
      muteBtn.style.color = video.muted ? 'var(--pink-accent)' : 'var(--white)';
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const card = document.querySelector('.video-player-card');
      if (!card) return;
      if (!document.fullscreenElement) {
        card.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  if (customVideoInput) {
    customVideoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && video) {
        video.src = URL.createObjectURL(file);
        video.load();
        if (videoPlaceholder) videoPlaceholder.classList.add('hidden');
        video.play().then(() => setPlayIcon(true)).catch(() => {});
      }
    });
  }


  // --- 3. PAGE TWO: 10 CONCEPTS ACCORDION ---
  const qaCards = document.querySelectorAll('.qa-card');

  qaCards.forEach(card => {
    const header = card.querySelector('.qa-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');

      // Close all others for a neat, focused view
      qaCards.forEach(c => {
        if (c !== card) c.classList.remove('open');
      });

      card.classList.toggle('open', !isOpen);
    });
  });


  // --- 4. PAGE FOUR & FIVE: CASE WORKFLOWS ---
  const caseData = {
    1: {
      title: "Case 1: Home Agent Has No Mobile Node Location",
      intro: "A Correspondent Node transmits packets to the Mobile Node's permanent Home Address, but the Home Agent has no valid registration binding in its cache.",
      steps: [
        {
          name: "START",
          title: "Step 1: CN Transmits Datagram",
          desc: "The Correspondent Node addresses an IP datagram to the Mobile Node's permanent Home Address. Standard IP routing forwards the datagram across the Internet to the Home Network."
        },
        {
          name: "HA Check",
          title: "Step 2: Home Agent Cache Lookup",
          desc: "The Home Agent intercepts the packet on the home link and searches its internal Binding Cache. The binding is missing or expired, meaning HA does not know any current Care-of Address (CoA)."
        },
        {
          name: "Local ARP",
          title: "Step 3: Home Link ARP Broadcast",
          desc: "Because no Care-of Address exists, the HA assumes the MN might be at home. It broadcasts an ARP request on the local home subnet seeking the MN's MAC address."
        },
        {
          name: "Timeout",
          title: "Step 4: ARP Request Times Out",
          desc: "Since the Mobile Node is physically away in a distant location and not registered, no device replies to the ARP broadcast on the home link."
        },
        {
          name: "RESULT: Packet Loss",
          title: "Result: Packet Dropped & ICMP Error",
          desc: "The Home Agent drops the datagram and transmits an ICMP Destination Host Unreachable message back to the Correspondent Node. The communication session fails."
        }
      ]
    },
    2: {
      title: "Case 2: Foreign Agent Registration Relay Failure",
      intro: "The Mobile Node enters a visited network and requests registration via the Foreign Agent, but the FA fails to forward the request to the Home Agent.",
      steps: [
        {
          name: "START",
          title: "Step 1: MN Sends Registration Request",
          desc: "The Mobile Node connects to a foreign network, obtains the Foreign Agent's Care-of Address from an Agent Advertisement, and delivers a Registration Request to the FA."
        },
        {
          name: "FA Relay",
          title: "Step 2: Foreign Agent Relay Attempt",
          desc: "The Foreign Agent is expected to forward this request to the Home Agent over UDP port 434. However, network congestion or firewall filtering drops the registration packet."
        },
        {
          name: "No Binding",
          title: "Step 3: Home Agent Unaware of Move",
          desc: "Because the Registration Request never reaches the Home Agent, the HA's binding table remains unchanged. It either holds an obsolete CoA or no location at all."
        },
        {
          name: "RESULT: Black Hole",
          title: "Result: Communication Black Hole",
          desc: "Packets sent by the Correspondent Node continue to be tunneled to the old location or dropped at the Home Agent. The Mobile Node cannot receive incoming traffic."
        }
      ]
    },
    3: {
      title: "Case 3: Encapsulation Failure at Home Agent",
      intro: "The Home Agent attempts to encapsulate the original packet inside an outer IP header, but the resulting packet exceeds the path Maximum Transmission Unit (MTU).",
      steps: [
        {
          name: "START",
          title: "Step 1: Inbound Packet Reaches HA",
          desc: "A full-sized IP packet (e.g. 1500 bytes) arrives at the Home Agent with the Don't Fragment (DF) flag set in the IP header."
        },
        {
          name: "Encap Check",
          title: "Step 2: Adding 20-Byte Outer IP Header",
          desc: "The Home Agent prepares to wrap the packet for forward tunneling by adding an outer IP header (20 bytes). The new total size becomes 1520 bytes."
        },
        {
          name: "MTU Exceeded",
          title: "Step 3: Tunnel Path MTU Exceeded",
          desc: "The outgoing tunnel interface only supports standard 1500-byte MTU. Because the packet has the DF bit set, the router is forbidden from fragmenting it."
        },
        {
          name: "RESULT: Packet Dropped",
          title: "Result: Datagram Discarded & PMTUD Triggered",
          desc: "The Home Agent discards the packet and sends an ICMP 'Fragmentation Needed and DF Set' notification to the Correspondent Node to reduce its segment size."
        }
      ]
    },
    4: {
      title: "Case 4: Decapsulation Failure at Foreign Agent",
      intro: "The encapsulated packet traverses the tunnel to the Foreign Agent, but the FA cannot decapsulate the packet due to header checksum errors or unsupported tunneling protocols.",
      steps: [
        {
          name: "START",
          title: "Step 1: Tunneled Packet Arrives at FA",
          desc: "The Foreign Agent receives the encapsulated datagram addressed to its Care-of Address over the forward tunnel from the Home Agent."
        },
        {
          name: "Header Verify",
          title: "Step 2: Outer Header Protocol Verification",
          desc: "The Foreign Agent inspects the IP Protocol field. A transit corruption or mismatched tunneling format (such as unsupported GRE or corrupted IP Protocol 4) is detected."
        },
        {
          name: "Strip Failed",
          title: "Step 3: Decapsulation Engine Rejects Packet",
          desc: "Because the header cannot be safely parsed, the FA's decapsulation engine refuses to strip the outer header to prevent delivering corrupted payloads."
        },
        {
          name: "RESULT: Silently Dropped",
          title: "Result: Packet Discarded at Visited Agent",
          desc: "The Foreign Agent increments its protocol error counter and silently drops the packet. The Mobile Node never receives the message."
        }
      ]
    },
    5: {
      title: "Case 5: Mobile Node Moves Mid-Transmission",
      intro: "While encapsulated packets are in flight through the tunnel towards Foreign Agent A, the Mobile Node abruptly dissociates and connects to Foreign Agent B.",
      steps: [
        {
          name: "START",
          title: "Step 1: HA Tunnels to Old Location (FA-A)",
          desc: "The Home Agent forwards packets through the established tunnel towards Foreign Agent A based on the active binding cache."
        },
        {
          name: "In-Flight Move",
          title: "Step 2: MN Roams to Foreign Agent B",
          desc: "Before the tunneled packets arrive at FA-A, the Mobile Node physically roams out of range and attaches to a new foreign network managed by FA-B."
        },
        {
          name: "Arrival at FA-A",
          title: "Step 3: FA-A Decapsulates Packet",
          desc: "FA-A successfully removes the outer IP header and looks for the Mobile Node on its local wireless link to deliver the packet."
        },
        {
          name: "RESULT: In-Flight Loss",
          title: "Result: Local Delivery Times Out",
          desc: "Because the Mobile Node is no longer on FA-A's subnet, local Layer-2 delivery fails and in-flight packets are dropped until HA receives the updated registration for FA-B."
        }
      ]
    }
  };

  const caseState = {
    currentCase: 1,
    currentStep: 0 // index in steps
  };

  function openCaseWorkflow(caseNum, updateHash = true) {
    caseNum = parseInt(caseNum, 10);
    if (!caseData[caseNum]) caseNum = 1;

    caseState.currentCase = caseNum;
    caseState.currentStep = 0;

    // Switch tab view to Cases
    switchTab('cases', false);

    // Hide list, show workflow
    if (casesListView) casesListView.style.display = 'none';
    caseWorkflowViews.forEach(v => v.classList.remove('active'));

    const workflowView = document.getElementById('caseWorkflowView');
    if (workflowView) {
      workflowView.classList.add('active');
      renderWorkflow(caseNum, 0);
    }

    if (updateHash) {
      history.replaceState(null, null, `#case-${caseNum}`);
    }
  }

  function renderWorkflow(caseNum, stepIndex) {
    const data = caseData[caseNum];
    if (!data) return;

    const steps = data.steps;
    if (stepIndex < 0) stepIndex = 0;
    if (stepIndex >= steps.length) stepIndex = steps.length - 1;
    caseState.currentStep = stepIndex;

    // Title & Intro
    const titleEl = document.getElementById('wfCaseTitle');
    const introEl = document.getElementById('wfCaseIntro');
    if (titleEl) titleEl.textContent = data.title;
    if (introEl) introEl.textContent = data.intro;

    // Render flowchart blocks
    const flowContainer = document.getElementById('wfFlowchartBlocks');
    if (flowContainer) {
      flowContainer.innerHTML = '';
      steps.forEach((step, idx) => {
        const isTerminal = idx === 0 || idx === steps.length - 1;
        const block = document.createElement('div');
        block.className = `flow-block ${isTerminal ? 'terminal-block' : ''} ${idx === stepIndex ? 'active' : ''}`;
        block.textContent = step.name;

        // Clicking a block jumps directly to it
        block.addEventListener('click', () => {
          renderWorkflow(caseNum, idx);
        });

        flowContainer.appendChild(block);

        // Arrow between blocks
        if (idx < steps.length - 1) {
          const arrow = document.createElement('div');
          arrow.className = 'flow-arrow';
          arrow.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`;
          flowContainer.appendChild(arrow);
        }
      });
    }

    // Explanation panel
    const currentStepData = steps[stepIndex];
    const stepTagEl = document.getElementById('wfStepTag');
    const stepTitleEl = document.getElementById('wfStepTitle');
    const stepDescEl = document.getElementById('wfStepDesc');

    if (stepTagEl) stepTagEl.textContent = `Workflow Step ${stepIndex + 1} of ${steps.length}`;
    if (stepTitleEl) stepTitleEl.textContent = currentStepData.title;
    if (stepDescEl) stepDescEl.textContent = currentStepData.desc;

    // Nav buttons state
    const prevBtn = document.getElementById('wfPrevBtn');
    const nextBtn = document.getElementById('wfNextBtn');

    if (prevBtn) prevBtn.disabled = stepIndex === 0;
    if (nextBtn) {
      if (stepIndex === steps.length - 1) {
        nextBtn.textContent = 'Completed';
        nextBtn.disabled = true;
      } else {
        nextBtn.textContent = 'Next Step ›';
        nextBtn.disabled = false;
      }
    }
  }

  // Bind View Case buttons in Page 4
  document.querySelectorAll('.btn-view-case').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseNum = btn.getAttribute('data-case');
      openCaseWorkflow(caseNum, true);
    });
  });

  // Workflow navigation controls
  const backToCasesBtn = document.getElementById('wfBackToCasesBtn');
  if (backToCasesBtn) {
    backToCasesBtn.addEventListener('click', () => {
      if (casesListView) casesListView.style.display = 'block';
      const workflowView = document.getElementById('caseWorkflowView');
      if (workflowView) workflowView.classList.remove('active');
      history.replaceState(null, null, '#cases');
    });
  }

  const wfPrevBtn = document.getElementById('wfPrevBtn');
  if (wfPrevBtn) {
    wfPrevBtn.addEventListener('click', () => {
      renderWorkflow(caseState.currentCase, caseState.currentStep - 1);
    });
  }

  const wfNextBtn = document.getElementById('wfNextBtn');
  if (wfNextBtn) {
    wfNextBtn.addEventListener('click', () => {
      renderWorkflow(caseState.currentCase, caseState.currentStep + 1);
    });
  }

})();
