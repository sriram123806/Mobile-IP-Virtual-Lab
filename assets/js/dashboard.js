/**
 * Mobile IP Virtual Lab - Dashboard Script
 * Handles Tab Navigation with Dynamic Background Switching (Images 1-4),
 * Video Player, 10-Question Accordion, and 5 Case Workflows.
 */

(function () {
  'use strict';

  // --- 1. GLOBAL TAB NAVIGATION & DYNAMIC BACKGROUND SWITCHING ---
  const navTabs = document.querySelectorAll('.tab-btn');
  const tabViews = document.querySelectorAll('.tab-view');
  const casesListView = document.getElementById('casesListView');
  const caseWorkflowViews = document.querySelectorAll('.case-workflow-view');

  const bgLayers = {
    video: document.getElementById('bgLayerVideo'),
    concepts: document.getElementById('bgLayerConcepts'),
    simulation: document.getElementById('bgLayerSimulation'),
    cases: document.getElementById('bgLayerCases'),
    casesWorkflow: document.getElementById('bgLayerCasesWorkflow')
  };

  function updateBackground(tabName) {
    Object.keys(bgLayers).forEach(key => {
      if (bgLayers[key]) {
        bgLayers[key].classList.toggle('active', key === tabName);
      }
    });
  }

  function switchTab(targetId, updateHash = true) {
    const cleanId = (targetId || 'video').replace('#', '');

    // Reset case workflow view back to list when navigating tabs
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

    // Switch full-page background image
    updateBackground(cleanId);

    if (updateHash) {
      history.replaceState(null, null, `#${cleanId}`);
    }

    // Leaflet map refresh when becoming visible
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
    const hash = window.location.hash || '#video';
    if (hash.startsWith('#case-')) {
      const caseNum = hash.replace('#case-', '');
      openCaseWorkflow(caseNum, false);
    } else {
      switchTab(hash, false);
    }
  });

  // Initial load
  const initialHash = window.location.hash || '#video';
  if (initialHash.startsWith('#case-')) {
    switchTab('cases', false);
    openCaseWorkflow(initialHash.replace('#case-', ''), false);
  } else {
    switchTab(initialHash, false);
  }


  // --- 2. VIDEO LEARNING MODULE (Image 1 Background) ---
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
      alert('Video placeholder ready! Place your video at assets/explanation.mp4 or select a file using the preview button below.');
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


  // --- 3. PAGE TWO: EXACTLY 10 CONCEPTS ACCORDION ---
  const qaCards = document.querySelectorAll('.qa-card');

  qaCards.forEach(card => {
    const header = card.querySelector('.qa-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');

      qaCards.forEach(c => {
        if (c !== card) c.classList.remove('open');
      });

      card.classList.toggle('open', !isOpen);
    });
  });


  // --- 4. PAGE FOUR & FIVE: EXACTLY 5 CASE WORKFLOWS (Image 4 Background) ---
  const caseData = {
    1: {
      title: "Case 1: Home Agent Cannot Find the Mobile Node",
      intro: "A Correspondent Node sends packets to the Mobile Node's permanent Home Address, but the Home Agent has no valid Care-of Address in its binding cache.",
      steps: [
        {
          name: "START",
          title: "Step 1: CN Transmits Datagram",
          desc: "The Correspondent Node addresses an IP datagram to the Mobile Node's permanent Home Address. Standard IP routing delivers it across the Internet to the Home Network."
        },
        {
          name: "Cache Check",
          title: "Step 2: Home Agent Cache Lookup",
          desc: "The Home Agent intercepts the packet on the home network and inspects its Binding Cache. The binding entry is missing or expired, meaning HA does not possess any valid Care-of Address (CoA)."
        },
        {
          name: "Local ARP",
          title: "Step 3: Home Link ARP Broadcast",
          desc: "Because no Care-of Address is registered, the HA queries the local home link by broadcasting an ARP request to resolve the MN's physical MAC address."
        },
        {
          name: "Timeout",
          title: "Step 4: ARP Request Times Out",
          desc: "Because the Mobile Node is physically away in a foreign network and has not registered its location, no device replies to the ARP broadcast on the home link."
        },
        {
          name: "RESULT: Packet Loss",
          title: "Result: Packet Dropped & ICMP Error",
          desc: "The Home Agent discards the datagram and returns an ICMP Destination Host Unreachable error message to the Correspondent Node. The session fails."
        }
      ]
    },
    2: {
      title: "Case 2: Foreign Agent Registration Failure",
      intro: "The Mobile Node enters a visited network and requests registration via the Foreign Agent, but the FA fails to relay the registration to the Home Agent.",
      steps: [
        {
          name: "START",
          title: "Step 1: MN Sends Registration Request",
          desc: "The Mobile Node connects to a foreign network, discovers the Foreign Agent via an Agent Advertisement, and delivers a Registration Request containing its Home Address."
        },
        {
          name: "Relay Attempt",
          title: "Step 2: Foreign Agent Relay Attempt",
          desc: "The Foreign Agent attempts to forward the registration request to the Home Agent via UDP port 434. However, upstream network congestion or firewall filtering drops the packet."
        },
        {
          name: "Unaware HA",
          title: "Step 3: Home Agent Unaware of Roaming",
          desc: "Because the Registration Request never reaches the Home Agent, the HA's binding table remains unchanged. It either holds an obsolete CoA or no location at all."
        },
        {
          name: "RESULT: Black Hole",
          title: "Result: Communication Black Hole",
          desc: "Packets sent by the Correspondent Node continue to be tunneled to the obsolete location or dropped at the Home Agent. The Mobile Node cannot receive incoming traffic."
        }
      ]
    },
    3: {
      title: "Case 3: Encapsulation Failure at Home Agent",
      intro: "The Home Agent attempts to encapsulate the original packet inside an outer IP header, but the resulting packet exceeds the path Maximum Transmission Unit (MTU).",
      steps: [
        {
          name: "START",
          title: "Step 1: Full-Sized Inbound Packet",
          desc: "A full-sized IP packet (1500 bytes) arrives at the Home Agent with the Don't Fragment (DF) flag set in its header."
        },
        {
          name: "Add Outer Header",
          title: "Step 2: Adding 20-Byte Outer IP Header",
          desc: "The Home Agent encapsulates the packet for forward tunneling by adding an outer IP header (20 bytes). The resulting packet size increases to 1520 bytes."
        },
        {
          name: "MTU Exceeded",
          title: "Step 3: Tunnel Path MTU Exceeded",
          desc: "The outgoing tunnel route only supports a standard 1500-byte MTU. Because the DF bit is set, intermediate routers are forbidden from fragmenting the packet."
        },
        {
          name: "RESULT: Packet Dropped",
          title: "Result: Packet Discarded & PMTUD Triggered",
          desc: "The Home Agent drops the datagram and returns an ICMP 'Fragmentation Needed and DF Set' message to the Correspondent Node to reduce its maximum segment size."
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
          desc: "The Foreign Agent inspects the outer IP header. An in-flight transmission corruption or unsupported encapsulation protocol format is detected."
        },
        {
          name: "Strip Rejection",
          title: "Step 3: Decapsulation Engine Rejection",
          desc: "Because the outer header cannot be safely parsed, the FA's decapsulation engine refuses to strip the header to prevent delivering corrupted payloads."
        },
        {
          name: "RESULT: Silently Dropped",
          title: "Result: Packet Discarded at Visited Agent",
          desc: "The Foreign Agent increments its protocol error counter and silently drops the packet. The Mobile Node never receives the message."
        }
      ]
    },
    5: {
      title: "Case 5: Mobile Node Changes Network During Transmission",
      intro: "While encapsulated packets are in flight through the tunnel towards Foreign Agent A, the Mobile Node abruptly roams and attaches to Foreign Agent B.",
      steps: [
        {
          name: "START",
          title: "Step 1: HA Tunnels to Old Location (FA-A)",
          desc: "The Home Agent forwards packets through the forward tunnel towards Foreign Agent A based on its current active binding cache."
        },
        {
          name: "Mid-Flight Roam",
          title: "Step 2: MN Roams to Foreign Agent B",
          desc: "Before the tunneled packets arrive at FA-A, the Mobile Node physically moves out of range and attaches to a new foreign network managed by FA-B."
        },
        {
          name: "Arrival at FA-A",
          title: "Step 3: FA-A Decapsulates Packet",
          desc: "FA-A successfully removes the outer IP header and searches its local wireless link to deliver the packet to the Mobile Node."
        },
        {
          name: "RESULT: In-Flight Loss",
          title: "Result: Local Delivery Times Out",
          desc: "Because the Mobile Node is no longer on FA-A's subnet, local Layer-2 delivery times out and in-flight packets are dropped until the HA receives updated registration for FA-B."
        }
      ]
    }
  };

  const caseState = {
    currentCase: 1,
    currentStep: 0
  };

  function openCaseWorkflow(caseNum, updateHash = true) {
    caseNum = parseInt(caseNum, 10);
    if (!caseData[caseNum]) caseNum = 1;

    caseState.currentCase = caseNum;
    caseState.currentStep = 0;

    switchTab('cases', false);

    if (casesListView) casesListView.style.display = 'none';
    caseWorkflowViews.forEach(v => v.classList.remove('active'));

    const workflowView = document.getElementById('caseWorkflowView');
    if (workflowView) {
      workflowView.classList.add('active');
      renderWorkflow(caseNum, 0);
    }

    // Switch specifically to the new uploaded background image for individual Case Study -> View workflow pages
    updateBackground('casesWorkflow');

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

    const titleEl = document.getElementById('wfCaseTitle');
    const introEl = document.getElementById('wfCaseIntro');
    if (titleEl) titleEl.textContent = data.title;
    if (introEl) introEl.textContent = data.intro;

    const flowContainer = document.getElementById('wfFlowchartBlocks');
    if (flowContainer) {
      flowContainer.innerHTML = '';
      steps.forEach((step, idx) => {
        const isTerminal = idx === 0 || idx === steps.length - 1;
        const block = document.createElement('div');
        block.className = `flow-block ${isTerminal ? 'terminal-block' : ''} ${idx === stepIndex ? 'active' : ''}`;
        block.textContent = step.name;

        block.addEventListener('click', () => {
          renderWorkflow(caseNum, idx);
        });

        flowContainer.appendChild(block);

        if (idx < steps.length - 1) {
          const arrow = document.createElement('div');
          arrow.className = 'flow-arrow';
          arrow.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`;
          flowContainer.appendChild(arrow);
        }
      });
    }

    const currentStepData = steps[stepIndex];
    const stepTagEl = document.getElementById('wfStepTag');
    const stepTitleEl = document.getElementById('wfStepTitle');
    const stepDescEl = document.getElementById('wfStepDesc');

    if (stepTagEl) stepTagEl.textContent = `Workflow Step ${stepIndex + 1} of ${steps.length}`;
    if (stepTitleEl) stepTitleEl.textContent = currentStepData.title;
    if (stepDescEl) stepDescEl.textContent = currentStepData.desc;

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

  document.querySelectorAll('.btn-view-case').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseNum = btn.getAttribute('data-case');
      openCaseWorkflow(caseNum, true);
    });
  });

  const backToCasesBtn = document.getElementById('wfBackToCasesBtn');
  if (backToCasesBtn) {
    backToCasesBtn.addEventListener('click', () => {
      if (casesListView) casesListView.style.display = 'block';
      const workflowView = document.getElementById('caseWorkflowView');
      if (workflowView) workflowView.classList.remove('active');
      updateBackground('cases');
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
