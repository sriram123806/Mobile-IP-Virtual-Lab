/**
 * Mobile IP Virtual Lab - Simulation & Live Signal Engine
 * Interactive Tamil Nadu Map + Synchronized Physical-Layer Signal Waveform.
 */

(function () {
  'use strict';

  // --- 1. CITY DATABASE (ACCURATE TAMIL NADU COORDINATES) ---
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

  // --- 2. SIMULATION STATE ---
  let state = {
    cnKey: 'chennai',
    haKey: 'kanyakumari',
    faKey: 'ooty',
    isConfirmed: false,
    currentStep: 0, // 1 to 6
    isPlaying: false,
    isPaused: false,
    animId: null,
    timerId: null
  };

  // --- 3. LEAFLET MAP INITIALIZATION ---
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  const map = L.map('map', {
    center: [10.8505, 78.7047],
    zoom: 7.2,
    minZoom: 6,
    maxZoom: 12,
    zoomControl: true
  });

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

  // Render ONLY the 3 selected markers after Confirm
  function renderConfirmedNodes() {
    markersLayer.clearLayers();
    pathsLayer.clearLayers();

    if (!state.isConfirmed) return;

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

    // Static Routes
    L.polyline([[cn.lat, cn.lng], [ha.lat, ha.lng]], {
      color: '#38bdf8',
      weight: 3,
      opacity: 0.5,
      dashArray: '5, 8'
    }).addTo(pathsLayer);

    L.polyline([[ha.lat, ha.lng], [fa.lat, fa.lng]], {
      color: '#c084fc',
      weight: 4.5,
      opacity: 0.75,
      dashArray: '8, 8'
    }).addTo(pathsLayer);

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

  // Smooth route interpolation
  function interpolateRoute(fromLatLng, toLatLng, durationMs, isEncapsulated, onComplete) {
    if (state.animId) cancelAnimationFrame(state.animId);

    const startTime = performance.now();

    function frame(now) {
      if (!state.isPlaying || state.isPaused) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

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

  // --- 4. SIGNAL & PACKET VISUALISATION (CANVAS & DATA REPR) ---
  const canvas = document.getElementById('signalCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const reprPayload = document.getElementById('reprPayload');
  const reprBinary = document.getElementById('reprBinary');
  const signalStageBadge = document.getElementById('signalStageBadge');
  const signalDescBanner = document.getElementById('signalDescBanner');

  let waveOffset = 0;
  let waveAnimId = null;

  function drawWaveform(stage) {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw baseline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    const midY = canvas.height / 2;
    ctx.beginPath();

    if (stage === 1 || stage === 0) {
      // Discrete pulse blocks (digital baseband)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      for (let x = 0; x < canvas.width; x += 40) {
        const bit = Math.sin((x + waveOffset * 2) * 0.05) > 0 ? 1 : 0;
        const y = bit ? midY - 25 : midY + 25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (stage === 2 || stage === 3) {
      // Encapsulated Manchester / FSK encoding
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      for (let x = 0; x < canvas.width; x++) {
        const freq = (x % 80 < 40) ? 0.08 : 0.04;
        const y = midY + Math.sin(x * freq + waveOffset * 0.15) * 32;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (stage === 4) {
      // Stage 4: Physical transmission waveform (smooth sinusoidal carrier)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      for (let x = 0; x < canvas.width; x++) {
        const y = midY + Math.sin(x * 0.06 - waveOffset * 0.2) * 35;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (stage === 5) {
      // Stage 5: Channel Noise / Distortion (Waveform with visible jitter & noise)
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2.5;
      for (let x = 0; x < canvas.width; x++) {
        const noise = (Math.random() - 0.5) * 16;
        const y = midY + Math.sin(x * 0.06 - waveOffset * 0.2) * 30 + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (stage === 6) {
      // Stage 6: Decoded clean recovered signal
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      for (let x = 0; x < canvas.width; x++) {
        const y = midY + Math.sin(x * 0.06 - waveOffset * 0.15) * 35;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    if (state.isPlaying && !state.isPaused) {
      waveOffset += 2;
    }
  }

  function startWaveAnimation() {
    if (waveAnimId) cancelAnimationFrame(waveAnimId);
    function loop() {
      drawWaveform(state.currentStep);
      waveAnimId = requestAnimationFrame(loop);
    }
    loop();
  }

  startWaveAnimation();

  function updateSignalBox(step) {
    const cn = CITIES[state.cnKey];
    const ha = CITIES[state.haKey];
    const fa = CITIES[state.faKey];

    switch (step) {
      case 1:
        if (signalStageBadge) signalStageBadge.textContent = 'Stage 1: Application Data';
        if (reprPayload) reprPayload.textContent = `GENERIC PAYLOAD: [DCN Virtual Lab Message (0x54 0x4E 0x5F 0x4D 0x4E)]`;
        if (reprBinary) reprBinary.textContent = `01001000 01100101 01101100 01101100 01101111`;
        if (signalDescBanner) signalDescBanner.textContent = `Application layer prepares the message payload at Correspondent Node (${cn.name}).`;
        break;
      case 2:
        if (signalStageBadge) signalStageBadge.textContent = 'Stage 2: Original IP Packet';
        if (reprPayload) reprPayload.textContent = `IP HEADER [Src: ${cn.name} (CN) | Dst: ${ha.name} (HoA: ${ha.hoa})] + PAYLOAD`;
        if (reprBinary) reprBinary.textContent = `01000101 00000000 00111100 10101011 00010000`;
        if (signalDescBanner) signalDescBanner.textContent = `Original IP datagram is constructed and intercepted at Home Agent (${ha.name}).`;
        break;
      case 3:
        if (signalStageBadge) signalStageBadge.textContent = 'Stage 3: Binary Encapsulation';
        if (reprPayload) reprPayload.textContent = `[OUTER IP: ${ha.name} → ${fa.name} (CoA: ${fa.coa})] ↳ [ORIGINAL IP: CN → HoA]`;
        if (reprBinary) reprBinary.textContent = `11001010 00110101 11100010 01011011 11010010`;
        if (signalDescBanner) signalDescBanner.textContent = `Outer IP header is added. The bitstream prepares for forward tunneling.`;
        break;
      case 4:
        if (signalStageBadge) signalStageBadge.textContent = 'Stage 4: Physical Signal Transmission';
        if (reprPayload) reprPayload.textContent = `FORWARD TUNNEL [IP Protocol 4 / Physical Carrier Waveform Active]`;
        if (reprBinary) reprBinary.textContent = `TRANSMITTING CARRIER: 2.4 GHz QPSK Modulation [HA → FA]`;
        if (signalDescBanner) signalDescBanner.textContent = `Modulated physical waveform propagates across forward tunnel link.`;
        break;
      case 5:
        if (signalStageBadge) signalStageBadge.textContent = 'Stage 5: Channel Noise & Decapsulation';
        if (reprPayload) reprPayload.textContent = `RECEIVED AT FA [Outer Header Stripped ➔ Original IP Packet Preserved]`;
        if (reprBinary) reprBinary.textContent = `CHANNEL NOISE FILTERED: BER < 10⁻⁶ | Decapsulating Payload`;
        if (signalDescBanner) signalDescBanner.textContent = `Channel noise is filtered by the Foreign Agent, and outer IP header is stripped.`;
        break;
      case 6:
        if (signalStageBadge) signalStageBadge.textContent = 'Stage 6: Packet Recovery & Final Delivery';
        if (reprPayload) reprPayload.textContent = `DELIVERED TO MN: [Original IP Header & Data Intact at ${fa.name}]`;
        if (reprBinary) reprBinary.textContent = `01001000 01100101 01101100 01101100 01101111 (VERIFIED ✓)`;
        if (signalDescBanner) signalDescBanner.textContent = `Original packet is recovered and delivered to Mobile Node with confirmation sent to HA.`;
        break;
      default:
        if (signalStageBadge) signalStageBadge.textContent = 'Ready: Waiting for Simulation';
        if (reprPayload) reprPayload.textContent = `0x45 0x00 0x00 0x3C [PAYLOAD: Mobile IPv4 Telemetry Datagram]`;
        if (reprBinary) reprBinary.textContent = `10110100 11001010 00110101 11100010`;
        if (signalDescBanner) signalDescBanner.textContent = `Application data will be generated when simulation begins.`;
    }
  }

  // --- 5. THE 6 MAP SIMULATION STEPS ---
  function updateStepPanel(step) {
    document.querySelectorAll('.step-item-card').forEach((card, idx) => {
      card.classList.toggle('active', (idx + 1) === step);
    });

    const overlay = document.getElementById('mapVisualOverlay');
    if (overlay) overlay.innerHTML = '';

    updateSignalBox(step);
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

      if (state.isPlaying && !state.isPaused) {
        interpolateRoute([cn.lat, cn.lng], [ha.lat, ha.lng], 3200, false, () => {
          if (state.isPlaying && !state.isPaused) {
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

      if (state.isPlaying && !state.isPaused) {
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

      if (state.isPlaying && !state.isPaused) {
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

      if (state.isPlaying && !state.isPaused) {
        interpolateRoute([ha.lat, ha.lng], [fa.lat, fa.lng], 3800, true, () => {
          if (state.isPlaying && !state.isPaused) {
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

      if (state.isPlaying && !state.isPaused) {
        state.timerId = setTimeout(() => executeStep(6), 2200);
      }
    } else if (step === 6) {
      // Step 6: Final Delivery
      const mnLat = fa.lat - 0.08;
      const mnLng = fa.lng + 0.12;
      updatePacketMarker([fa.lat, fa.lng], false);

      if (state.isPlaying && !state.isPaused) {
        interpolateRoute([fa.lat, fa.lng], [mnLat, mnLng], 1600, false, () => {
          state.isPlaying = false;
          updateControlButtons();

          if (overlay) {
            overlay.innerHTML = `
              <div class="delivery-notice-badge">
                <h4>✓ PACKET DELIVERED SUCCESSFULLY</h4>
                <p>Delivered to Mobile Node at ${fa.name}.</p>
                <p style="font-size:0.78rem; opacity:0.9; margin-top:2px;">
                  🔔 <strong>Notification sent to Home Agent (${ha.name}):</strong> Delivery confirmed.
                </p>
              </div>
            `;
          }
        });
      }
    }
  }

  // --- 6. THREE MAIN CONTROLS: START, PAUSE / RESUME, RESET ---
  const startBtn = document.getElementById('simStartBtn');
  const pauseBtn = document.getElementById('simPauseBtn');
  const resetBtn = document.getElementById('simResetBtn');
  const pauseResumeLabel = document.getElementById('pauseResumeLabel');

  function updateControlButtons() {
    if (!startBtn) return;

    if (state.isPlaying) {
      startBtn.disabled = true;
      if (pauseBtn) {
        pauseBtn.disabled = false;
        if (pauseResumeLabel) pauseResumeLabel.textContent = state.isPaused ? 'Resume' : 'Pause';
      }
    } else {
      startBtn.disabled = false;
      if (pauseBtn) {
        pauseBtn.disabled = (state.currentStep === 0 || state.currentStep === 6);
        if (pauseResumeLabel) pauseResumeLabel.textContent = 'Pause / Resume';
      }
    }
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      state.isPlaying = true;
      state.isPaused = false;
      updateControlButtons();
      executeStep(1);
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      if (!state.isPlaying) return;

      if (!state.isPaused) {
        // Pause
        state.isPaused = true;
        clearTimeout(state.timerId);
        if (state.animId) cancelAnimationFrame(state.animId);
      } else {
        // Resume
        state.isPaused = false;
        if (state.currentStep >= 1 && state.currentStep < 6) {
          executeStep(state.currentStep + 1);
        }
      }
      updateControlButtons();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.isPlaying = false;
      state.isPaused = false;
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

  // --- 7. LOCATION DROPDOWNS & CONFIRM BUTTON ---
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

      state.isPlaying = false;
      state.isPaused = false;
      clearTimeout(state.timerId);
      if (state.animId) cancelAnimationFrame(state.animId);
      removePacketMarker();
      state.currentStep = 0;
      updateStepPanel(0);
      updateControlButtons();

      renderConfirmedNodes();

      confirmBtn.innerHTML = `<span>✓ LOCATIONS SET</span>`;
      setTimeout(() => {
        confirmBtn.innerHTML = `<span>Confirm Locations</span>`;
      }, 1500);
    });
  }

  populateDropdowns();
  updateControlButtons();
  updateSignalBox(0);

})();
