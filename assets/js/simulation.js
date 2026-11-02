/**
 * Mobile IP Virtual Lab - Simulation Engine
 * Clean, map-focused Mobile IPv4 Simulation across South India (Tamil Nadu).
 */

(function () {
  'use strict';

  // --- 1. CITY DATABASE ---
  const CITIES = {
    chennai: { name: 'Chennai', lat: 13.0827, lng: 80.2707, hoa: '10.0.1.50', coa: '10.0.1.254' },
    madurai: { name: 'Madurai', lat: 9.9252, lng: 78.1198, hoa: '172.16.20.50', coa: '172.16.20.254' },
    coimbatore: { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, hoa: '192.168.30.50', coa: '192.168.30.254' },
    ooty: { name: 'Ooty', lat: 11.4102, lng: 76.6950, hoa: '172.16.50.50', coa: '172.16.50.254' },
    salem: { name: 'Salem', lat: 11.6643, lng: 78.1460, hoa: '10.0.40.50', coa: '10.0.40.254' },
    trichy: { name: 'Trichy', lat: 10.7905, lng: 78.7047, hoa: '192.168.60.50', coa: '192.168.60.254' },
    tirunelveli: { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567, hoa: '172.16.70.50', coa: '172.16.70.254' },
    kanyakumari: { name: 'Kanyakumari', lat: 8.0883, lng: 77.5385, hoa: '192.168.10.50', coa: '192.168.10.254' },
    vellore: { name: 'Vellore', lat: 12.9165, lng: 79.1325, hoa: '10.0.80.50', coa: '10.0.80.254' },
    thanjavur: { name: 'Thanjavur', lat: 10.7870, lng: 79.1378, hoa: '192.168.90.50', coa: '192.168.90.254' }
  };

  // --- 2. STATE ---
  let state = {
    cnKey: 'chennai',
    haKey: 'kanyakumari',
    faKey: 'ooty',
    isConfirmed: false,
    currentStep: 0, // 1 to 6
    isPlaying: false,
    animId: null,
    timerId: null
  };

  // --- 3. LEAFLET MAP SETUP ---
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  const map = L.map('map', {
    center: [10.8505, 78.7047],
    zoom: 7.2,
    minZoom: 6,
    maxZoom: 12,
    zoomControl: true
  });

  // OpenStreetMap Tile Layer
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
  }).addTo(map);

  window.MobileIPSimulation = {
    invalidateMap: function () {
      if (map) {
        map.invalidateSize();
        if (state.isConfirmed) fitSelectedNodes();
      }
    }
  };

  const markersLayer = L.layerGroup().addTo(map);
  const pathsLayer = L.layerGroup().addTo(map);
  const packetLayer = L.layerGroup().addTo(map);

  // Custom Markers
  function createPinIcon(role, cityName) {
    let bubbleClass = 'cn-bubble';
    if (role === 'HA') bubbleClass = 'ha-bubble';
    if (role === 'FA') bubbleClass = 'fa-bubble';

    return L.divIcon({
      className: 'sim-node-pin',
      html: `
        <div class="node-pin-bubble ${bubbleClass}">${role}</div>
        <div class="node-pin-label">${cityName}</div>
      `,
      iconSize: [44, 52],
      iconAnchor: [22, 42]
    });
  }

  // Moving Packet Marker
  let packetMarker = null;

  function updatePacketMarker(latlng, isEncapsulated) {
    if (!packetMarker) {
      packetMarker = L.marker(latlng, {
        icon: L.divIcon({
          className: `sim-packet-dot ${isEncapsulated ? 'encapsulated' : ''}`,
          html: isEncapsulated ? '📦' : '✉️',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        }),
        zIndexOffset: 1000
      }).addTo(packetLayer);
    } else {
      packetMarker.setLatLng(latlng);
      const el = packetMarker.getElement();
      if (el) {
        el.className = `sim-packet-dot leaflet-zoom-animated ${isEncapsulated ? 'encapsulated' : ''}`;
        el.innerHTML = isEncapsulated ? '📦' : '✉️';
      }
    }
  }

  function removePacketMarker() {
    if (packetMarker) {
      packetLayer.removeLayer(packetMarker);
      packetMarker = null;
    }
  }

  // --- 4. RENDER ONLY THE 3 SELECTED LOCATIONS AFTER CONFIRM ---
  function renderConfirmedNodes() {
    markersLayer.clearLayers();
    pathsLayer.clearLayers();

    if (!state.isConfirmed) return; // Initially clean map!

    const cn = CITIES[state.cnKey];
    const ha = CITIES[state.haKey];
    const fa = CITIES[state.faKey];

    // CN Marker (Blue)
    const cnMarker = L.marker([cn.lat, cn.lng], { icon: createPinIcon('CN', cn.name) });
    cnMarker.bindPopup(`<strong>Correspondent Node (CN)</strong><br>Location: ${cn.name}<br>Role: Packet Sender`);
    markersLayer.addLayer(cnMarker);

    // HA Marker (Purple)
    const haMarker = L.marker([ha.lat, ha.lng], { icon: createPinIcon('HA', ha.name) });
    haMarker.bindPopup(`<strong>Home Agent (HA)</strong><br>Location: ${ha.name}<br>Home Address: <code>${ha.hoa}</code>`);
    markersLayer.addLayer(haMarker);

    // FA Marker (Green)
    const faMarker = L.marker([fa.lat, fa.lng], { icon: createPinIcon('FA', fa.name) });
    faMarker.bindPopup(`<strong>Foreign Agent (FA)</strong><br>Location: ${fa.name}<br>Care-of Address: <code>${fa.coa}</code>`);
    markersLayer.addLayer(faMarker);

    // Draw static route lines
    // Normal Route: CN -> HA
    L.polyline([[cn.lat, cn.lng], [ha.lat, ha.lng]], {
      color: '#38bdf8',
      weight: 3,
      opacity: 0.5,
      dashArray: '5, 8'
    }).addTo(pathsLayer);

    // Forward Tunnel: HA -> FA (Glowing purple path)
    L.polyline([[ha.lat, ha.lng], [fa.lat, fa.lng]], {
      color: '#a855f7',
      weight: 4.5,
      opacity: 0.75,
      dashArray: '8, 8'
    }).addTo(pathsLayer);

    // Local delivery line: FA -> MN (offset)
    L.polyline([[fa.lat, fa.lng], [fa.lat - 0.08, fa.lng + 0.12]], {
      color: '#10b981',
      weight: 3,
      opacity: 0.7,
      dashArray: '3, 5'
    }).addTo(pathsLayer);

    fitSelectedNodes();
  }

  function fitSelectedNodes() {
    const cn = CITIES[state.cnKey];
    const ha = CITIES[state.haKey];
    const fa = CITIES[state.faKey];
    if (!cn || !ha || !fa) return;

    const bounds = L.latLngBounds([
      [cn.lat, cn.lng],
      [ha.lat, ha.lng],
      [fa.lat, fa.lng]
    ]);
    map.fitBounds(bounds.pad(0.35), { maxZoom: 8, animate: true, duration: 0.6 });
  }

  // --- 5. SMOOTH ANIMATION INTERPOLATION ---
  function interpolateRoute(fromLatLng, toLatLng, durationMs, isEncapsulated, onComplete) {
    if (state.animId) cancelAnimationFrame(state.animId);

    const startTime = performance.now();

    function frame(now) {
      if (!state.isPlaying) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Smooth ease
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      const lat = fromLatLng[0] + (toLatLng[0] - fromLatLng[0]) * ease;
      const lng = fromLatLng[1] + (toLatLng[1] - fromLatLng[1]) * ease;

      updatePacketMarker([lat, lng], isEncapsulated);

      if (progress < 1) {
        state.animId = requestAnimationFrame(frame);
      } else {
        if (onComplete) onComplete();
      }
    }

    state.animId = requestAnimationFrame(frame);
  }

  // --- 6. THE 6 SIMULATION STEPS ---
  /*
    STEP 1: CN generates packet -> Travels towards MN Home Address at HA.
    STEP 2: HA intercepts packet -> Notice MN is not present in home network.
    STEP 3: Encapsulation -> Outer IP Header added (Src: HA, Dst: CoA).
    STEP 4: Forward Tunnel -> Encapsulated packet travels HA to FA.
    STEP 5: Decapsulation -> FA removes outer IP header, recovers original packet.
    STEP 6: Final Delivery -> Packet delivered to MN + Notification to HA!
  */

  function updateStepPanel(step) {
    document.querySelectorAll('.step-item-card').forEach((card, idx) => {
      card.classList.toggle('active', (idx + 1) === step);
    });

    const overlay = document.getElementById('mapVisualOverlay');
    if (overlay) overlay.innerHTML = '';
  }

  function executeStep(step) {
    if (!state.isConfirmed) {
      alert('Please click "CONFIRM LOCATIONS" first to display the chosen network nodes on the map.');
      state.isPlaying = false;
      updateControlButtons();
      return;
    }

    state.currentStep = step;
    updateStepPanel(step);

    const cn = CITIES[state.cnKey];
    const ha = CITIES[state.haKey];
    const fa = CITIES[state.faKey];
    const overlay = document.getElementById('mapVisualOverlay');

    clearTimeout(state.timerId);
    if (state.animId) cancelAnimationFrame(state.animId);

    if (step === 1) {
      // Step 1: CN -> HA
      updatePacketMarker([cn.lat, cn.lng], false);
      if (overlay) {
        overlay.innerHTML = `
          <div class="encap-visual-badge">
            <h4>ORIGINAL IP PACKET</h4>
            <div class="encap-diagram">
              <div class="inner-packet-line">
                Src: ${cn.name} (CN) &nbsp;→&nbsp; Dst: ${ha.name} (MN Home Address: <code>${ha.hoa}</code>)
              </div>
            </div>
          </div>
        `;
      }

      if (state.isPlaying) {
        interpolateRoute([cn.lat, cn.lng], [ha.lat, ha.lng], 3000, false, () => {
          if (state.isPlaying) {
            state.timerId = setTimeout(() => executeStep(2), 1200);
          }
        });
      }
    } else if (step === 2) {
      // Step 2: HA Interception
      updatePacketMarker([ha.lat, ha.lng], false);
      if (overlay) {
        overlay.innerHTML = `
          <div class="encap-visual-badge" style="border-color: var(--pink-accent);">
            <h4>HOME AGENT INTERCEPTION</h4>
            <div class="encap-diagram" style="color: #fbcfe8;">
              ● Mobile Node is NOT present in Home Network.<br>
              ● HA checks binding cache: MN is currently at <strong>${fa.name}</strong> (CoA: <code>${fa.coa}</code>).
            </div>
          </div>
        `;
      }

      if (state.isPlaying) {
        state.timerId = setTimeout(() => executeStep(3), 2200);
      }
    } else if (step === 3) {
      // Step 3: Encapsulation
      updatePacketMarker([ha.lat, ha.lng], true);
      if (overlay) {
        overlay.innerHTML = `
          <div class="encap-visual-badge">
            <h4>ENCAPSULATION</h4>
            <div class="encap-diagram">
              <div class="outer-header-line">
                [OUTER IP HEADER] Src: ${ha.name} (HA) &nbsp;→&nbsp; Dst: ${fa.name} (CoA: <code>${fa.coa}</code>)
              </div>
              <div class="inner-packet-line">
                &nbsp;&nbsp;↳ [ORIGINAL IP HEADER] Src: CN &nbsp;|&nbsp; Dst: MN HoA (<code>${ha.hoa}</code>)
              </div>
            </div>
          </div>
        `;
      }

      if (state.isPlaying) {
        state.timerId = setTimeout(() => executeStep(4), 2400);
      }
    } else if (step === 4) {
      // Step 4: Forward Tunnel (HA -> FA)
      updatePacketMarker([ha.lat, ha.lng], true);
      if (overlay) {
        overlay.innerHTML = `
          <div class="encap-visual-badge">
            <h4>FORWARD TUNNEL</h4>
            <div class="encap-diagram">
              Traversing IP-in-IP tunnel across South India from ${ha.name} (HA) to ${fa.name} (FA).
            </div>
          </div>
        `;
      }

      if (state.isPlaying) {
        interpolateRoute([ha.lat, ha.lng], [fa.lat, fa.lng], 3800, true, () => {
          if (state.isPlaying) {
            state.timerId = setTimeout(() => executeStep(5), 1200);
          }
        });
      }
    } else if (step === 5) {
      // Step 5: Decapsulation
      updatePacketMarker([fa.lat, fa.lng], false);
      if (overlay) {
        overlay.innerHTML = `
          <div class="encap-visual-badge" style="border-color: var(--mint);">
            <h4>DECAPSULATION</h4>
            <div class="encap-diagram">
              Foreign Agent removes outer IP header.<br>
              <span style="color:var(--mint);">✓ Original IP packet recovered completely intact!</span>
            </div>
          </div>
        `;
      }

      if (state.isPlaying) {
        state.timerId = setTimeout(() => executeStep(6), 2200);
      }
    } else if (step === 6) {
      // Step 6: Final Delivery & Notification to HA
      const mnLat = fa.lat - 0.08;
      const mnLng = fa.lng + 0.12;
      updatePacketMarker([fa.lat, fa.lng], false);

      if (state.isPlaying) {
        interpolateRoute([fa.lat, fa.lng], [mnLat, mnLng], 1600, false, () => {
          state.isPlaying = false;
          updateControlButtons();

          if (overlay) {
            overlay.innerHTML = `
              <div class="delivery-notice-badge">
                <h4>✓ SUCCESS: PACKET DELIVERED!</h4>
                <p>Delivered to Mobile Node at ${fa.name}.</p>
                <p style="font-size:0.78rem; opacity:0.9; margin-top:2px;">
                  🔔 <strong>Notification sent to Home Agent (${ha.name}):</strong> Session confirmed active.
                </p>
              </div>
            `;
          }
        });
      }
    }
  }

  // --- 7. CONTROLS ---
  const startBtn = document.getElementById('simStartBtn');
  const pauseBtn = document.getElementById('simPauseBtn');
  const resumeBtn = document.getElementById('simResumeBtn');
  const resetBtn = document.getElementById('simResetBtn');

  function updateControlButtons() {
    if (!startBtn) return;

    if (state.isPlaying) {
      startBtn.disabled = true;
      if (pauseBtn) pauseBtn.disabled = false;
      if (resumeBtn) resumeBtn.disabled = true;
    } else {
      startBtn.disabled = false;
      if (pauseBtn) pauseBtn.disabled = true;
      if (resumeBtn) resumeBtn.disabled = (state.currentStep === 0 || state.currentStep === 6);
    }
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      state.isPlaying = true;
      updateControlButtons();
      executeStep(1);
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      state.isPlaying = false;
      clearTimeout(state.timerId);
      if (state.animId) cancelAnimationFrame(state.animId);
      updateControlButtons();
    });
  }

  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      if (state.currentStep > 0 && state.currentStep < 6) {
        state.isPlaying = true;
        updateControlButtons();
        executeStep(state.currentStep + 1);
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.isPlaying = false;
      clearTimeout(state.timerId);
      if (state.animId) cancelAnimationFrame(state.animId);
      removePacketMarker();
      state.currentStep = 0;
      updateStepPanel(0);
      updateControlButtons();
      const overlay = document.getElementById('mapVisualOverlay');
      if (overlay) overlay.innerHTML = '';
      if (state.isConfirmed) fitSelectedNodes();
    });
  }

  // --- 8. DROPDOWNS & CONFIRM BUTTON ---
  const cnSelect = document.getElementById('cnLocationSelect');
  const haSelect = document.getElementById('haLocationSelect');
  const faSelect = document.getElementById('faLocationSelect');
  const confirmBtn = document.getElementById('confirmNodesBtn');

  function populateDropdowns() {
    const keys = Object.keys(CITIES);
    [cnSelect, haSelect, faSelect].forEach(sel => {
      if (!sel) return;
      sel.innerHTML = '';
      keys.forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = CITIES[k].name;
        sel.appendChild(opt);
      });
    });

    if (cnSelect) cnSelect.value = state.cnKey;
    if (haSelect) haSelect.value = state.haKey;
    if (faSelect) faSelect.value = state.faKey;
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      state.cnKey = cnSelect.value;
      state.haKey = haSelect.value;
      state.faKey = faSelect.value;
      state.isConfirmed = true;

      // Reset any active simulation
      state.isPlaying = false;
      clearTimeout(state.timerId);
      if (state.animId) cancelAnimationFrame(state.animId);
      removePacketMarker();
      state.currentStep = 0;
      updateStepPanel(0);
      updateControlButtons();

      renderConfirmedNodes();

      confirmBtn.innerHTML = `<span>✓ LOCATIONS SET</span>`;
      setTimeout(() => {
        confirmBtn.innerHTML = `<span>CONFIRM LOCATIONS</span>`;
      }, 1500);
    });
  }

  populateDropdowns();
  updateControlButtons();

})();
