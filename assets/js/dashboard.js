/**
 * Mobile IP Virtual Lab - Dashboard Core Script
 * Handles Tab Navigation, Video Player, Concepts Accordion & Search, Cases, and Modals.
 */

(function () {
  'use strict';

  // --- 1. TAB ROUTING & NAVIGATION ---
  const navTabs = document.querySelectorAll('.tab-btn');
  const tabViews = document.querySelectorAll('.tab-view');

  function switchTab(targetTabId, updateHash = true) {
    if (!targetTabId) targetTabId = 'simulation'; // Default priority tab

    // Normalize id
    const cleanId = targetTabId.replace('#', '');
    const activeView = document.getElementById(cleanId);
    if (!activeView) return;

    // Update Tab Buttons
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

    // Update Views
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

    // Leaflet map needs resize trigger when becoming visible
    if (cleanId === 'simulation' && window.MobileIPSimulation && window.MobileIPSimulation.invalidateMap) {
      setTimeout(() => {
        window.MobileIPSimulation.invalidateMap();
      }, 100);
    }
  }

  navTabs.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const target = btn.getAttribute('href');
      switchTab(target, true);
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash || '#simulation';
    switchTab(hash, false);
  });

  // Initial tab load
  const initialHash = window.location.hash || '#simulation';
  switchTab(initialHash, false);


  // --- 2. VIDEO LEARNING PLAYER ---
  const video = document.getElementById('labVideo');
  const videoPlaceholder = document.getElementById('videoPlaceholder');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const bigPlayBtn = document.getElementById('bigPlayBtn');
  const videoProgressContainer = document.getElementById('videoProgressContainer');
  const videoProgressFill = document.getElementById('videoProgressFill');
  const timeDisplay = document.getElementById('timeDisplay');
  const muteBtn = document.getElementById('muteBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const speedSelect = document.getElementById('speedSelect');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const customVideoInput = document.getElementById('customVideoInput');

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function updateVideoTime() {
    if (!video || !video.duration) return;
    const progress = (video.currentTime / video.duration) * 100;
    if (videoProgressFill) videoProgressFill.style.width = `${progress}%`;
    if (timeDisplay) timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  }

  function togglePlay() {
    if (!video) return;
    if (!video.src || video.src === window.location.href || video.src.endsWith('/')) {
      alert('Explanation video will be available soon! You can load and preview any MP4 file using the "Load Custom MP4" button below.');
      return;
    }

    if (video.paused || video.ended) {
      video.play().then(() => {
        if (videoPlaceholder) videoPlaceholder.classList.add('hidden');
        updatePlayIcons(true);
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    } else {
      video.pause();
      updatePlayIcons(false);
    }
  }

  function updatePlayIcons(isPlaying) {
    if (!playPauseBtn) return;
    if (isPlaying) {
      playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      playPauseBtn.setAttribute('title', 'Pause');
    } else {
      playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      playPauseBtn.setAttribute('title', 'Play');
    }
  }

  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
  if (bigPlayBtn) bigPlayBtn.addEventListener('click', togglePlay);

  if (video) {
    video.addEventListener('timeupdate', updateVideoTime);
    video.addEventListener('loadedmetadata', updateVideoTime);
    video.addEventListener('play', () => updatePlayIcons(true));
    video.addEventListener('pause', () => updatePlayIcons(false));
    video.addEventListener('ended', () => {
      updatePlayIcons(false);
      if (videoPlaceholder) videoPlaceholder.classList.remove('hidden');
    });

    // Check if assets/explanation.mp4 exists or can be played
    fetch('assets/explanation.mp4', { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          video.src = 'assets/explanation.mp4';
          video.load();
        }
      })
      .catch(() => {});
  }

  // Scrubbing
  if (videoProgressContainer) {
    videoProgressContainer.addEventListener('click', (e) => {
      if (!video || !video.duration) return;
      const rect = videoProgressContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * video.duration;
      updateVideoTime();
    });
  }

  // Volume
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      if (!video) return;
      video.volume = parseFloat(e.target.value);
      video.muted = video.volume === 0;
      updateMuteIcon();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      if (!video) return;
      video.muted = !video.muted;
      updateMuteIcon();
    });
  }

  function updateMuteIcon() {
    if (!muteBtn || !video) return;
    if (video.muted || video.volume === 0) {
      muteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
    } else {
      muteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
    }
  }

  // Playback Speed
  if (speedSelect) {
    speedSelect.addEventListener('change', (e) => {
      if (video) video.playbackRate = parseFloat(e.target.value);
    });
  }

  // Fullscreen
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

  // Local File Selector
  if (customVideoInput) {
    customVideoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && video) {
        const fileURL = URL.createObjectURL(file);
        video.src = fileURL;
        video.load();
        if (videoPlaceholder) videoPlaceholder.classList.add('hidden');
        video.play().then(() => updatePlayIcons(true)).catch(() => {});
      }
    });
  }


  // --- 3. CONCEPTS & QUESTIONS ACCORDION & SEARCH ---
  const qaCards = document.querySelectorAll('.qa-card');
  const searchInput = document.getElementById('searchQuestions');
  const filterPills = document.querySelectorAll('.filter-pill');
  const expandAllBtn = document.getElementById('expandAllBtn');
  const collapseAllBtn = document.getElementById('collapseAllBtn');
  const noQuestionsNotice = document.getElementById('noQuestionsFound');

  // Toggle single card
  qaCards.forEach(card => {
    const header = card.querySelector('.qa-header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      card.classList.toggle('open', !isOpen);
      card.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  });

  // Expand / Collapse All
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      qaCards.forEach(card => {
        if (card.style.display !== 'none') {
          card.classList.add('open');
          card.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => {
      qaCards.forEach(card => {
        card.classList.remove('open');
        card.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Filter & Search Logic
  let currentCategory = 'all';
  let searchQuery = '';

  function applyQuestionsFilter() {
    let visibleCount = 0;
    const q = searchQuery.toLowerCase().trim();

    qaCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = card.querySelector('.qa-title').textContent.toLowerCase();
      const content = card.querySelector('.qa-content').textContent.toLowerCase();

      const matchesCat = (currentCategory === 'all' || category === currentCategory);
      const matchesSearch = (!q || title.includes(q) || content.includes(q));

      if (matchesCat && matchesSearch) {
        card.style.display = 'block';
        visibleCount++;
        // Auto-open matching card if user typed a specific search query
        if (q.length > 2) {
          card.classList.add('open');
        }
      } else {
        card.style.display = 'none';
      }
    });

    if (noQuestionsNotice) {
      noQuestionsNotice.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      applyQuestionsFilter();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter') || 'all';
      applyQuestionsFilter();
    });
  });


  // --- 4. FAILURE SCENARIOS (CASES) INTERACTION ---
  const caseCards = document.querySelectorAll('.case-card');

  caseCards.forEach(card => {
    const testBtn = card.querySelector('.btn-test-case');
    const flowArea = card.querySelector('.case-mini-flow-area');
    if (!testBtn || !flowArea) return;

    testBtn.addEventListener('click', () => {
      const isSimulating = testBtn.getAttribute('data-state') === 'running';

      if (!isSimulating) {
        testBtn.setAttribute('data-state', 'running');
        testBtn.innerHTML = `<span>Reset Diagram</span>`;
        testBtn.style.background = '#fef2f2';
        testBtn.style.color = '#ef4444';
        testBtn.style.borderColor = '#fecaca';

        // Animate pulse on failure point
        const cross = flowArea.querySelector('.mini-break-cross');
        const brokenLine = flowArea.querySelector('.mini-flow-line.broken');

        if (cross) {
          cross.style.animation = 'bannerPop 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
          cross.style.transform = 'translate(-50%, -50%) scale(1.3)';
          setTimeout(() => {
            cross.style.transform = 'translate(-50%, -50%) scale(1)';
          }, 400);
        }
        if (brokenLine) {
          brokenLine.style.animation = 'pulseDot 1.5s infinite';
        }
      } else {
        testBtn.setAttribute('data-state', 'idle');
        testBtn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Simulate Scenario`;
        testBtn.style.background = '#ffffff';
        testBtn.style.color = 'var(--sky-deep)';
        testBtn.style.borderColor = 'var(--card-border)';

        const cross = flowArea.querySelector('.mini-break-cross');
        const brokenLine = flowArea.querySelector('.mini-flow-line.broken');
        if (cross) cross.style.transform = 'translate(-50%, -50%) scale(1)';
        if (brokenLine) brokenLine.style.animation = 'none';
      }
    });
  });


  // --- 5. REFERENCE MAP MODAL LIGHTBOX ---
  const openRefMapBtn = document.getElementById('viewRefMapBtn');
  const refMapModal = document.getElementById('mapRefModal');
  const closeRefMapBtn = document.getElementById('closeRefMapBtn');

  function openRefModal() {
    if (!refMapModal) return;
    refMapModal.classList.add('open');
    refMapModal.setAttribute('aria-hidden', 'false');
  }

  function closeRefModal() {
    if (!refMapModal) return;
    refMapModal.classList.remove('open');
    refMapModal.setAttribute('aria-hidden', 'true');
  }

  if (openRefMapBtn) openRefMapBtn.addEventListener('click', openRefModal);
  if (closeRefMapBtn) closeRefMapBtn.addEventListener('click', closeRefModal);
  if (refMapModal) {
    refMapModal.addEventListener('click', (e) => {
      if (e.target === refMapModal) closeRefModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && refMapModal && refMapModal.classList.contains('open')) {
      closeRefModal();
    }
  });

})();
