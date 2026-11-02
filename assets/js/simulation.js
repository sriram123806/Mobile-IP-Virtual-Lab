/**
 * Mobile IP Virtual Lab - Simulation & Live Signal Engine
 * Real animated packet journey across Tamil Nadu, user message data input,
 * 8-bit ASCII binary encoding, and synchronized physical/protocol signal visualization.
 */

(function () {
  'use strict';

  // --- 1. ACCURATE TAMIL NADU CITY COORDINATES ---
  const CITIES = {
    chennai: { name: 'Chennai', lat: 13.0827, lng: 80.2707, hoa: '10.0.1.50', coa: '10.0.1.254' },
    kanyakumari: { name: 'Kanyakumari', lat: 8.0883, lng: 77.5385, hoa: '192.168.10.50', coa: '192.168.10.254' },
    ooty: { name: 'Ooty', lat: 11.4102, lng: 76.6950, hoa: '172.16.50.50', coa: '172.16.50.254' },
    madurai: { name: 'Madurai', lat: 9.9252, lng: 78.1198, hoa: '172.16.20.50', coa: '172.16.20.254' },
    coimbatore: { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, hoa: '192.168.30.50', coa: '192.168.30.254' },
    salem: { name: 'Salem', lat: 11.6643, lng: 78.1460, hoa: '10.0.40.50', coa: '10.0.40.254' },
    trichy: { name: 'Trichy', lat: 10.7905, lng: 78.7047, hoa: '192.168.60.50', coa: '192.168.60.254' },
    tirunelveli: { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567, hoa: '172.16.70.50', coa: '172.16.70.254' },
    vellore: { name: 'Vellore', lat: 12.9165, lng: 79.1325, hoa: '10.0.80.50', coa: '10.0.80.254' },
    thanjavur: { name: 'Thanjavur', lat: 10.7870, lng: 79.1378, hoa: '192.168.90.50', coa: '192.168.90.254' }
  };

  // --- 2. SIMULATION STATE ---
  let state = {
    cnKey: 'chennai',
    haKey: 'kanyakumari',
    faKey: 'ooty',
    isConfirmed: false,
    userMessage: 'Hello, I am Sriram!',
    binaryString: '',
    charData: [],
    isDataReady: false,
    currentStep: 0, // 0 = Ready, 1..6 = Simulation stages
    isPlaying: false,
    isPaused: false,
    animId: null,
    timerId: null,
    // Precision Pause/Resume tracking
    pausedFraction: 0,
    activeFrom: null,
    activeTo: null,
    activeDuration: 0,
    activeStartTime: 0,
    activeIsEncap: false,
    activeHasTrail: false,
    activeOnComplete: null
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
  let tunnelTrailPolyline = null;
  let packetMarker = null;

  // Custom Leaflet Pin Icons
  function createPinIcon(role, cityName) {
    let bubbleClass = 'cn-bubble';
    if (role === 'HA') bubbleClass = 'ha-bubble';
    if (role === 'FA') bubbleClass = 'fa-bubble';
    if (role === 'MN') bubbleClass = 'mn-bubble';

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

  // Visual animated packet marker on the map
  function updatePacketMarker(latlng, isEncapsulated) {
    const snippet = state.userMessage ? (state.userMessage.length > 12 ? state.userMessage.substring(0, 10) + '…' : state.userMessage) : 'DATA';

    const htmlContent = isEncapsulated
      ? `<div class="sim-packet-pill encapsulated"><span class="packet-icon">📦</span><span class="packet-label">[OUTER IP] ➔ CoA</span></div>`
      : `<div class="sim-packet-pill"><span class="packet-icon">✉️</span><span class="packet-label">IP: "${snippet}"</span></div>`;

    if (!packetMarker) {
      packetMarker = L.marker(latlng, {
        icon: L.divIcon({
          className: 'sim-packet-container',
          html: htmlContent,
          iconSize: isEncapsulated ? [140, 36] : [120, 34],
          iconAnchor: isEncapsulated ? [70, 18] : [60, 17]
        }),
        zIndexOffset: 1200
      }).addTo(packetLayer);
    } else {
      packetMarker.setLatLng(latlng);
      const el = packetMarker.getElement();
      if (el) {
        el.className = 'sim-packet-container leaflet-zoom-animated';
        el.innerHTML = htmlContent;
      }
    }
  }

  function removePacketMarker() {
    if (packetMarker) {
      packetLayer.removeLayer(packetMarker);
      packetMarker = null;
    }
    clearTunnelTrail();
  }

  // Dynamic moving tunnel motion trail polyline
  function updateTunnelTrail(startLatLng, currentLatLng) {
    if (!tunnelTrailPolyline) {
      tunnelTrailPolyline = L.polyline([startLatLng, currentLatLng], {
        color: '#10b981',
        weight: 6,
        opacity: 0.95,
        className: 'tunnel-motion-trail'
      }).addTo(pathsLayer);
    } else {
      tunnelTrailPolyline.setLatLngs([startLatLng, currentLatLng]);
    }
  }

  function clearTunnelTrail() {
    if (tunnelTrailPolyline) {
      pathsLayer.removeLayer(tunnelTrailPolyline);
      tunnelTrailPolyline = null;
    }
  }

  // Render the 3 confirmed nodes + MN on the map
  function renderConfirmedNodes() {
    markersLayer.clearLayers();
    pathsLayer.clearLayers();
    clearTunnelTrail();

    if (!state.isConfirmed) return;

    const cn = CITIES[state.cnKey];
    const ha = CITIES[state.haKey];
    const fa = CITIES[state.faKey];
    const mnLat = fa.lat - 0.08;
    const mnLng = fa.lng + 0.12;

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

    // MN Marker (Pink - roaming at FA location)
    const mnMarker = L.marker([mnLat, mnLng], { icon: createPinIcon('MN', 'Mobile Node') });
    mnMarker.bindPopup(`<strong>Mobile Node (MN)</strong><br>Current Location: Visited Foreign Subnet (${fa.name})<br>Permanent HoA: <code>${ha.hoa}</code>`);
    markersLayer.addLayer(mnMarker);

    // Static Route Guides
    // CN -> HA (Blue dashed line)
    L.polyline([[cn.lat, cn.lng], [ha.lat, ha.lng]], {
      color: '#38bdf8',
      weight: 3.5,
      opacity: 0.55,
      dashArray: '6, 8'
    }).addTo(pathsLayer);

    // HA -> FA (Purple tunnel guide tube)
    L.polyline([[ha.lat, ha.lng], [fa.lat, fa.lng]], {
      color: '#c084fc',
      weight: 4.5,
      opacity: 0.65,
      dashArray: '8, 8'
    }).addTo(pathsLayer);

    // FA -> MN (Green local wireless link)
    L.polyline([[fa.lat, fa.lng], [mnLat, mnLng]], {
      color: '#10b981',
      weight: 3,
      opacity: 0.75,
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
    map.fitBounds(bounds.pad(0.32), { maxZoom: 8, animate: true, duration: 0.6 });
  }

  // --- 4. DATA INPUT & 8-BIT ASCII CONVERSION ---
  const dataInputSection = document.getElementById('dataInputSection');
  const userMessageInput = document.getElementById('userMessageInput');
  const btnDataOk = document.getElementById('btnDataOk');
  const dataConversionResults = document.getElementById('dataConversionResults');
  const resOriginalMsg = document.getElementById('resOriginalMsg');
  const resTotalChars = document.getElementById('resTotalChars');
  const resTotalBits = document.getElementById('resTotalBits');
  const resBinaryStream = document.getElementById('resBinaryStream');
  const resCharChips = document.getElementById('resCharChips');
  const simFlowHint = document.getElementById('simFlowHint');

  function convertTextTo8BitAscii(text) {
    const charData = [];
    let fullBinary = '';

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const asciiCode = ch.charCodeAt(0);
      const bin8 = asciiCode.toString(2).padStart(8, '0');
      charData.push({ char: ch, code: asciiCode, bin: bin8 });
      fullBinary += bin8;
    }

    return { charData, fullBinary };
  }

  function handleDataConfirmation() {
    const rawText = userMessageInput ? userMessageInput.value : '';
    const message = rawText.length > 0 ? rawText : 'Hello, I am Sriram!';

    state.userMessage = message;
    const { charData, fullBinary } = convertTextTo8BitAscii(message);
    state.charData = charData;
    state.binaryString = fullBinary;
    state.isDataReady = true;

    // Display metadata
    if (resOriginalMsg) resOriginalMsg.textContent = `"${message}"`;
    if (resTotalChars) resTotalChars.textContent = message.length;
    if (resTotalBits) resTotalBits.textContent = `${fullBinary.length} bits (${message.length} bytes)`;

    // Display formatted binary stream (grouped in 8-bit octets)
    if (resBinaryStream) {
      const octets = fullBinary.match(/.{1,8}/g) || [];
      resBinaryStream.textContent = octets.join(' ');
    }

    // Display Character-by-Character breakdown chips
    if (resCharChips) {
      resCharChips.innerHTML = '';
      charData.forEach(item => {
        const chip = document.createElement('div');
        chip.className = 'char-chip';
        const displayChar = item.char === ' ' ? '␣ (space)' : item.char;
        chip.innerHTML = `
          <span class="char-letter">${displayChar}</span>
          <span class="char-bits">${item.bin}</span>
        `;
        resCharChips.appendChild(chip);
      });
    }

    // Reveal results panel
    if (dataConversionResults) {
      dataConversionResults.style.display = 'flex';
    }

    // Enable Start Simulation button!
    updateControlButtons();

    if (simFlowHint) {
      simFlowHint.innerHTML = `<span style="color: var(--mint);">✓ Message converted to ${fullBinary.length} bits! Click START SIMULATION to begin.</span>`;
    }

    // Update Live Signal visualization with actual encoded data
    updateSignalBox(0);
  }

  if (btnDataOk) {
    btnDataOk.addEventListener('click', handleDataConfirmation);
  }

  if (userMessageInput) {
    userMessageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleDataConfirmation();
      }
    });

    userMessageInput.addEventListener('input', () => {
      // If user modifies message, require clicking OK again
      state.isDataReady = false;
      updateControlButtons();
      if (simFlowHint) {
        simFlowHint.innerHTML = `<span style="color: #fbcfe8;">Message changed. Click OK to convert into binary bits.</span>`;
      }
    });
  }

  // --- 5. SMOOTH ROUTE INTERPOLATION WITH PRECISE PAUSE/RESUME ---
  function interpolateRoute(fromLatLng, toLatLng, durationMs, isEncapsulated, hasTrail, onComplete) {
    if (state.animId) cancelAnimationFrame(state.animId);

    state.activeFrom = fromLatLng;
    state.activeTo = toLatLng;
    state.activeDuration = durationMs;
    state.activeIsEncap = isEncapsulated;
    state.activeHasTrail = hasTrail;
    state.activeOnComplete = onComplete;
    state.activeStartTime = performance.now();

    function frame(now) {
      if (!state.isPlaying || state.isPaused) return;

      const elapsed = (now - state.activeStartTime) + (state.pausedFraction * durationMs);
      const progress = Math.min(elapsed / durationMs, 1);
      state.pausedFraction = progress;

      // Smooth easeInOut interpolation
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      const lat = fromLatLng[0] + (toLatLng[0] - fromLatLng[0]) * ease;
      const lng = fromLatLng[1] + (toLatLng[1] - fromLatLng[1]) * ease;

      updatePacketMarker([lat, lng], isEncapsulated);

      if (hasTrail) {
        updateTunnelTrail([fromLatLng[0], fromLatLng[1]], [lat, lng]);
      }

      if (progress < 1) {
        state.animId = requestAnimationFrame(frame);
      } else {
        state.pausedFraction = 0;
        if (onComplete) onComplete();
      }
    }

    state.animId = requestAnimationFrame(frame);
  }

  // --- 6. LIVE SIGNAL & PHYSICAL LAYER WAVEFORM ---
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

    // Draw reference center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    const midY = canvas.height / 2;
    ctx.beginPath();

    if (stage === 0 || stage === 1) {
      // Stage 1: Digital Baseband Waveform (discrete pulses matching user data)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      const stepWidth = 36;
      for (let x = 0; x < canvas.width; x += stepWidth) {
        const bitIdx = Math.floor((x / stepWidth + Math.floor(waveOffset / 6))) % Math.max(state.binaryString.length, 1);
        const bit = state.binaryString.length > 0 ? (state.binaryString[bitIdx] === '1' ? 1 : 0) : 1;
        const y = bit ? midY - 28 : midY + 28;
        if (x === 0) ctx.moveTo(x, y);
        else {
          ctx.lineTo(x, y);
          ctx.lineTo(x + stepWidth, y);
        }
      }
      ctx.stroke();
    } else if (stage === 2 || stage === 3) {
      // Stage 2/3: Encapsulation Modulation (Manchester / FSK)
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      for (let x = 0; x < canvas.width; x++) {
        const freq = (x % 70 < 35) ? 0.08 : 0.04;
        const y = midY + Math.sin(x * freq + waveOffset * 0.12) * 32;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (stage === 4) {
      // Stage 4: High-frequency forward tunnel carrier wave
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      for (let x = 0; x < canvas.width; x++) {
        const y = midY + Math.sin(x * 0.07 - waveOffset * 0.22) * 35;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (stage === 5) {
      // Stage 5: Channel Noise & Decapsulation (signal jitter)
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2.5;
      for (let x = 0; x < canvas.width; x++) {
        const noise = (Math.random() - 0.5) * 12;
        const y = midY + Math.sin(x * 0.06 - waveOffset * 0.18) * 28 + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (stage === 6) {
      // Stage 6: Recovered clean original baseband signal
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      for (let x = 0; x < canvas.width; x++) {
        const y = midY + Math.sin(x * 0.05 - waveOffset * 0.15) * 32;
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
    const msg = state.userMessage || 'Hello, I am Sriram!';
    const binSample = state.binaryString.length > 0
      ? (state.binaryString.length > 36 ? state.binaryString.substring(0, 36) + '…' : state.binaryString)
      : '01001000 01101001';

    switch (step) {
      case 1:
        if (signalStageBadge) signalStageBadge.textContent = 'Stage 1: Packet Generation';
        if (reprPayload) reprPayload.textContent = `IP DATAGRAM: [Src: ${cn.name} (CN) | Dst: HoA (${ha.hoa})] + PAYLOAD: "${msg}"`;
        if (reprBinary) reprBinary.textContent = `STREAM: ${binSample} (${state.binaryString.length} bits total)`;
        if (signalDescBanner) signalDescBanner.textContent = `Original IP packet is generated at Correspondent Node (${cn.name}) addressed to the Mobile Node's permanent Home Address.`;
        break;

      case 2:
        if (signalStageBadge) signalStageBadge.textContent = 'Stage 2: Home Agent Interception';
        if (reprPayload) reprPayload.textContent = `INTERCEPTED: [HoA: ${ha.hoa}] ➔ Binding Cache Lookup: CoA is ${fa.name} (${fa.coa})`;
        if (reprBinary) reprBinary.textContent = `VERIFIED: Mobile Node registered away from home. Ready for encapsulation.`;
        if (signalDescBanner) signalDescBanner.textContent = `Home Agent at ${ha.name} intercepts the incoming packet via Proxy ARP and locates the active Care-of Address (${fa.name}).`;
        break;

      case 3:
        if (signalStageBadge) signalStageBadge.textContent = 'Stage 3: Binary Encapsulation';
        if (reprPayload) reprPayload.textContent = `[OUTER IP HEADER: ${ha.name} ➔ ${fa.name} (CoA: ${fa.coa})] ↳ [INNER IP: CN ➔ HoA | "${msg}"]`;
        if (reprBinary) reprBinary.textContent = `ENCAPSULATED FRAME: Outer 20-byte IP header wrapped around original intact datagram`;
        if (signalDescBanner) signalDescBanner.textContent = `Home Agent encloses the original packet inside an outer IP header addressed to the Care-of Address at ${fa.name}.`;
        break;

      case 4:
        if (signalStageBadge) signalStageBadge.textContent = 'Stage 4: Forward Tunneling';
        if (reprPayload) reprPayload.textContent = `FORWARD TUNNEL [IP Protocol 4 / Encapsulated IP-in-IP] ➔ Care-of Address (${fa.coa})`;
        if (reprBinary) reprBinary.textContent = `TUNNEL TRANSMISSION: Modulated high-speed bitstream traverses South India route`;
        if (signalDescBanner) signalDescBanner.textContent = `The encapsulated packet travels through the forward tunnel from Home Agent (${ha.name}) to Foreign Agent (${fa.name}).`;
        break;

      case 5:
        if (signalStageBadge) signalStageBadge.textContent = 'Stage 5: Decapsulation at Visited Network';
        if (reprPayload) reprPayload.textContent = `DECAPSULATED AT FA: Outer header stripped ➔ Original IP packet restored with payload "${msg}"`;
        if (reprBinary) reprBinary.textContent = `FILTERED STREAM: Outer IP removed | Checksum verified | Recovered: ${binSample}`;
        if (signalDescBanner) signalDescBanner.textContent = `Foreign Agent at ${fa.name} terminates the tunnel, removes the outer IP header, and recovers the pristine original datagram.`;
        break;

      case 6:
        if (signalStageBadge) signalStageBadge.textContent = 'Stage 6: Final Delivery Complete';
        if (reprPayload) reprPayload.textContent = `DELIVERED TO MOBILE NODE: "${msg}" (Integrity 100% Verified ✓)`;
        if (reprBinary) reprBinary.textContent = `ACK SENT: Delivery confirmed back to Home Agent (${ha.name})`;
        if (signalDescBanner) signalDescBanner.textContent = `Original packet is successfully delivered to the Mobile Node at ${fa.name}. Notification confirmed to Home Agent!`;
        break;

      default:
        if (signalStageBadge) signalStageBadge.textContent = state.isDataReady ? 'Ready for Transmission' : 'Waiting for Data Confirmation';
        if (reprPayload) reprPayload.textContent = state.isDataReady ? `ENCODED PAYLOAD: "${msg}"` : `Please enter your message above and click OK.`;
        if (reprBinary) reprBinary.textContent = state.isDataReady ? `BINARY BITSTREAM: ${binSample}` : `Binary representation will appear after data confirmation.`;
        if (signalDescBanner) signalDescBanner.textContent = state.isDataReady ? `Data is encoded and ready. Click "Start Simulation" to begin the packet journey.` : `Select locations, click Confirm Locations, then enter your transmission message.`;
    }
  }

  // --- 7. THE 6 STEP SYNCHRONIZED EXECUTION ENGINE ---
  function updateStepPanel(step) {
    document.querySelectorAll('.step-item-card').forEach((card, idx) => {
      card.classList.toggle('active', (idx + 1) === step);
    });

    const overlay = document.getElementById('mapVisualOverlay');
    if (overlay && step === 0) overlay.innerHTML = '';

    updateSignalBox(step);
  }

  function executeStep(step) {
    if (!state.isConfirmed) {
      alert('Please click "CONFIRM LOCATIONS" first.');
      return;
    }
    if (!state.isDataReady) {
      alert('Please enter your message in the Data Preparation card and click OK.');
      return;
    }

    state.currentStep = step;
    updateStepPanel(step);

    const cn = CITIES[state.cnKey];
    const ha = CITIES[state.haKey];
    const fa = CITIES[state.faKey];
    const mnLat = fa.lat - 0.08;
    const mnLng = fa.lng + 0.12;
    const overlay = document.getElementById('mapVisualOverlay');

    clearTimeout(state.timerId);
    if (state.animId) cancelAnimationFrame(state.animId);

    // =========================================================================
    // STAGE 1: CN -> HA (Original Packet Transmission)
    // =========================================================================
    if (step === 1) {
      clearTunnelTrail();
      updatePacketMarker([cn.lat, cn.lng], false);

      if (overlay) {
        overlay.innerHTML = `
          <div class="stage-popup-card">
            <h4><span style="color:var(--blue-accent);">✉️</span> STAGE 1: PACKET GENERATION</h4>
            <p>CN at <strong>${cn.name}</strong> generates an original IP packet addressed to the Mobile Node's permanent Home Address (<code>${ha.hoa}</code>).</p>
            <div class="popup-inner-data">
              Data Payload: "${state.userMessage}"
            </div>
          </div>
        `;
      }

      if (state.isPlaying && !state.isPaused) {
        interpolateRoute([cn.lat, cn.lng], [ha.lat, ha.lng], 3800, false, false, () => {
          if (state.isPlaying && !state.isPaused) {
            state.timerId = setTimeout(() => executeStep(2), 1100);
          }
        });
      }
    }

    // =========================================================================
    // STAGE 2: HOME AGENT INTERCEPTION AT HA
    // =========================================================================
    else if (step === 2) {
      updatePacketMarker([ha.lat, ha.lng], false);

      if (overlay) {
        overlay.innerHTML = `
          <div class="stage-popup-card" style="border-color: var(--pink-accent);">
            <h4><span style="color:var(--pink-accent);">🔍</span> STAGE 2: HA INTERCEPTION</h4>
            <p>The packet arrives at Home Agent (<strong>${ha.name}</strong>). The HA intercepts the datagram and verifies the Mobile Node is currently roaming in a foreign network.</p>
            <div class="popup-inner-data" style="color:#fbcfe8;">
              ● Binding Cache: MN is at <strong>${fa.name}</strong><br>
              ● Registered Care-of Address: <code>${fa.coa}</code>
            </div>
          </div>
        `;
      }

      if (state.isPlaying && !state.isPaused) {
        state.timerId = setTimeout(() => executeStep(3), 2400);
      }
    }

    // =========================================================================
    // STAGE 3: ENCAPSULATION AT HA
    // =========================================================================
    else if (step === 3) {
      updatePacketMarker([ha.lat, ha.lng], true);

      if (overlay) {
        overlay.innerHTML = `
          <div class="stage-popup-card encap-card">
            <h4><span style="color:#fbbf24;">📦</span> STAGE 3: ENCAPSULATION AT HA</h4>
            <p>Home Agent wraps the original packet inside an outer IP header addressed to the Care-of Address at ${fa.name}.</p>
            <div class="popup-inner-data">
              [OUTER IP] Src: ${ha.name} (HA) ➔ Dst: ${fa.name} (CoA: ${fa.coa})<br>
              ↳ [INNER IP] Src: ${cn.name} (CN) ➔ Dst: HoA (${ha.hoa}) | "${state.userMessage}"
            </div>
          </div>
        `;
      }

      if (state.isPlaying && !state.isPaused) {
        state.timerId = setTimeout(() => executeStep(4), 2600);
      }
    }

    // =========================================================================
    // STAGE 4: FORWARD TUNNELING (HA -> FA)
    // =========================================================================
    else if (step === 4) {
      updatePacketMarker([ha.lat, ha.lng], true);

      if (overlay) {
        overlay.innerHTML = `
          <div class="stage-popup-card encap-card">
            <h4><span style="color:#10b981;">⚡</span> STAGE 4: FORWARD TUNNELING</h4>
            <p>The encapsulated packet travels through the IP-in-IP tunnel across South India from <strong>${ha.name}</strong> to <strong>${fa.name}</strong>.</p>
            <div class="popup-inner-data" style="color:var(--mint);">
              Tunnel Status: Active IP-in-IP Carrier | Motion Trail Active
            </div>
          </div>
        `;
      }

      if (state.isPlaying && !state.isPaused) {
        interpolateRoute([ha.lat, ha.lng], [fa.lat, fa.lng], 4600, true, true, () => {
          if (state.isPlaying && !state.isPaused) {
            state.timerId = setTimeout(() => executeStep(5), 1100);
          }
        });
      }
    }

    // =========================================================================
    // STAGE 5: DECAPSULATION AT FA
    // =========================================================================
    else if (step === 5) {
      updatePacketMarker([fa.lat, fa.lng], false);

      if (overlay) {
        overlay.innerHTML = `
          <div class="stage-popup-card decap-card">
            <h4><span style="color:var(--mint);">🔓</span> STAGE 5: DECAPSULATION AT FA</h4>
            <p>Outer IP header removed. Original IP packet recovered completely intact!</p>
            <div class="popup-inner-data">
              Original Message Recovered: "${state.userMessage}"
            </div>
          </div>
        `;
      }

      if (state.isPlaying && !state.isPaused) {
        state.timerId = setTimeout(() => executeStep(6), 2500);
      }
    }

    // =========================================================================
    // STAGE 6: FINAL DELIVERY TO MOBILE NODE
    // =========================================================================
    else if (step === 6) {
      updatePacketMarker([fa.lat, fa.lng], false);

      if (state.isPlaying && !state.isPaused) {
        interpolateRoute([fa.lat, fa.lng], [mnLat, mnLng], 1800, false, false, () => {
          state.isPlaying = false;
          updateControlButtons();

          if (overlay) {
            overlay.innerHTML = `
              <div class="stage-popup-card delivery-card">
                <h4>🎉 MESSAGE DELIVERED SUCCESSFULLY</h4>
                <p>The Mobile Node has received the message over the foreign subnet at <strong>${fa.name}</strong>.</p>
                <div class="popup-inner-data" style="font-size: 0.95rem; font-weight: bold; color: #ffffff;">
                  "${state.userMessage}"
                </div>
                <div class="popup-ack-badge">
                  🔔 Delivery confirmation (ACK) delivered to Home Agent at ${ha.name}!
                </div>
              </div>
            `;
          }

          // Trigger confirmation pulse to HA marker
          const ackLine = L.polyline([[fa.lat, fa.lng], [ha.lat, ha.lng]], {
            color: '#10b981',
            weight: 3.5,
            opacity: 0.85,
            dashArray: '4, 6'
          }).addTo(pathsLayer);

          setTimeout(() => {
            pathsLayer.removeLayer(ackLine);
          }, 3500);
        });
      }
    }
  }

  // --- 8. CONTROLS: START, PAUSE / RESUME, RESET ---
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
      // Start is enabled only if locations are confirmed AND user data is ready
      startBtn.disabled = !(state.isConfirmed && state.isDataReady);
      if (pauseBtn) {
        pauseBtn.disabled = (state.currentStep === 0 || state.currentStep === 6);
        if (pauseResumeLabel) pauseResumeLabel.textContent = 'Pause / Resume';
      }
    }
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (!state.isConfirmed || !state.isDataReady) return;

      state.isPlaying = true;
      state.isPaused = false;
      state.pausedFraction = 0;
      updateControlButtons();
      executeStep(1);
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      if (!state.isPlaying) return;

      if (!state.isPaused) {
        // PAUSE: Freeze packet in place at exact fractional progress
        state.isPaused = true;
        clearTimeout(state.timerId);
        if (state.animId) cancelAnimationFrame(state.animId);
      } else {
        // RESUME: Continue animation from exact position
        state.isPaused = false;
        state.activeStartTime = performance.now();

        if (state.pausedFraction > 0 && state.pausedFraction < 1 && state.activeFrom && state.activeTo) {
          interpolateRoute(
            state.activeFrom,
            state.activeTo,
            state.activeDuration,
            state.activeIsEncap,
            state.activeHasTrail,
            state.activeOnComplete
          );
        } else {
          // Progress to next step if paused between intervals
          if (state.currentStep >= 1 && state.currentStep < 6) {
            executeStep(state.currentStep + 1);
          }
        }
      }
      updateControlButtons();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.isPlaying = false;
      state.isPaused = false;
      state.pausedFraction = 0;
      clearTimeout(state.timerId);
      if (state.animId) cancelAnimationFrame(state.animId);

      removePacketMarker();
      state.currentStep = 0;
      updateStepPanel(0);
      updateControlButtons();

      const overlay = document.getElementById('mapVisualOverlay');
      if (overlay) overlay.innerHTML = '';

      if (state.isConfirmed) {
        renderConfirmedNodes();
      }

      if (simFlowHint) {
        simFlowHint.innerHTML = `<span style="color: var(--mint);">Simulation reset. Click START SIMULATION to run again.</span>`;
      }
    });
  }

  // --- 9. LOCATION SELECTION DROPDOWNS & CONFIRM BUTTON ---
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

      // Stop any running animation
      state.isPlaying = false;
      state.isPaused = false;
      state.pausedFraction = 0;
      clearTimeout(state.timerId);
      if (state.animId) cancelAnimationFrame(state.animId);
      removePacketMarker();
      state.currentStep = 0;
      updateStepPanel(0);

      // Render the 3 selected nodes + MN on the map
      renderConfirmedNodes();

      // Reveal Data Input Section
      if (dataInputSection) {
        dataInputSection.style.display = 'block';
      }

      // Automatically compute initial conversion for the default text
      handleDataConfirmation();

      confirmBtn.innerHTML = `<span>✓ LOCATIONS SET</span>`;
      setTimeout(() => {
        confirmBtn.innerHTML = `<span>Confirm Locations</span>`;
      }, 1500);

      if (simFlowHint) {
        simFlowHint.innerHTML = `<span style="color: var(--mint);">Locations confirmed! You can now edit the message and click OK, or click START SIMULATION.</span>`;
      }
    });
  }

  populateDropdowns();
  updateControlButtons();
  updateSignalBox(0);

})();
