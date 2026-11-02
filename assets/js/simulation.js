/**
 * Mobile IP Virtual Lab - Interactive Simulation Engine
 * Leaflet-powered South India (Tamil Nadu) Network Topology & 6-Step Tunneling Animation.
 */

(function () {
  'use strict';

  // --- 1. CITY DATABASE & REAL COORDINATES ---
  const CITIES = {
    chennai: {
      name: 'Chennai',
      lat: 13.0827,
      lng: 80.2707,
      subnet: '10.0.1.0/24',
      haIp: '10.0.1.1',
      faIp: '10.0.1.254',
      mnHoA: '10.0.1.75',
      cnIp: '10.0.1.20'
    },
    madurai: {
      name: 'Madurai',
      lat: 9.9252,
      lng: 78.1198,
      subnet: '172.16.20.0/24',
      haIp: '172.16.20.1',
      faIp: '172.16.20.254',
      mnHoA: '172.16.20.55',
      cnIp: '172.16.20.10'
    },
    coimbatore: {
      name: 'Coimbatore',
      lat: 11.0168,
      lng: 76.9558,
      subnet: '192.168.30.0/24',
      haIp: '192.168.30.1',
      faIp: '192.168.30.254',
      mnHoA: '192.168.30.40',
      cnIp: '192.168.30.15'
    },
    ooty: {
      name: 'Ooty',
      lat: 11.4102,
      lng: 76.6950,
      subnet: '172.16.50.0/24',
      haIp: '172.16.50.1',
      faIp: '172.16.50.254',
      mnHoA: '172.16.50.60',
      cnIp: '172.16.50.18'
    },
    salem: {
      name: 'Salem',
      lat: 11.6643,
      lng: 78.1460,
      subnet: '10.0.40.0/24',
      haIp: '10.0.40.1',
      faIp: '10.0.40.254',
      mnHoA: '10.0.40.80',
      cnIp: '10.0.40.22'
    },
    trichy: {
      name: 'Trichy',
      lat: 10.7905,
      lng: 78.7047,
      subnet: '192.168.60.0/24',
      haIp: '192.168.60.1',
      faIp: '192.168.60.254',
      mnHoA: '192.168.60.35',
      cnIp: '192.168.60.12'
    },
    tirunelveli: {
      name: 'Tirunelveli',
      lat: 8.7139,
      lng: 77.7567,
      subnet: '172.16.70.0/24',
      haIp: '172.16.70.1',
      faIp: '172.16.70.254',
      mnHoA: '172.16.70.90',
      cnIp: '172.16.70.24'
    },
    kanyakumari: {
      name: 'Kanyakumari',
      lat: 8.0883,
      lng: 77.5385,
      subnet: '192.168.10.0/24',
      haIp: '192.168.10.1',
      faIp: '192.168.10.254',
      mnHoA: '192.168.10.50',
      cnIp: '192.168.10.14'
    },
    vellore: {
      name: 'Vellore',
      lat: 12.9165,
      lng: 79.1325,
      subnet: '10.0.80.0/24',
      haIp: '10.0.80.1',
      faIp: '10.0.80.254',
      mnHoA: '10.0.80.65',
      cnIp: '10.0.80.19'
    },
    thanjavur: {
      name: 'Thanjavur',
      lat: 10.7870,
      lng: 79.1378,
      subnet: '192.168.90.0/24',
      haIp: '192.168.90.1',
      faIp: '192.168.90.254',
      mnHoA: '192.168.90.45',
      cnIp: '192.168.90.16'
    }
  };

  // --- 2. SIMULATION STATE ---
  let state = {
    cnCityKey: 'chennai',
    homeCityKey: 'kanyakumari',
    currentCityKey: 'ooty',
    currentStep: 1, // 1 to 6
    isPlaying: false,
    speedMultiplier: 1.0,
    animationFrameId: null,
    stepTimerId: null
  };

  // --- 3. LEAFLET MAP INITIALIZATION ---
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Center Tamil Nadu
  const map = L.map('map', {
    center: [10.8505, 78.7047],
    zoom: 7.2,
    minZoom: 6,
    maxZoom: 12,
    zoomControl: true,
    scrollWheelZoom: true
  });

  // OpenStreetMap Tile Layer with attribution
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Expose map resize helper
  window.MobileIPSimulation = {
    invalidateMap: function () {
      if (map) {
        map.invalidateSize();
        fitSelectedNodes();
      }
    }
  };

  // Layer groups for dynamic simulation elements
  const nodeMarkersLayer = L.layerGroup().addTo(map);
  const routePathsLayer = L.layerGroup().addTo(map);
  const movingPacketLayer = L.layerGroup().addTo(map);
  const overlayLabelsLayer = L.layerGroup().addTo(map);

  // --- 4. CUSTOM SVG ICONS ---
  function createTowerIcon(role, cityName) {
    let pinClass = 'pin-idle';
    let badgeHtml = '';

    if (role === 'CN') {
      pinClass = 'pin-cn';
      badgeHtml = `<span class="node-pin-badge badge-cn">CN</span>`;
    } else if (role === 'HA') {
      pinClass = 'pin-ha';
      badgeHtml = `<span class="node-pin-badge badge-ha">HA</span>`;
    } else if (role === 'FA') {
      pinClass = 'pin-fa';
      badgeHtml = `<span class="node-pin-badge badge-fa">FA</span>`;
    }

    const svgTower = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v20M4 22h16M7 12l5-5 5 5M9 7l3-3 3 3M5 17l7-7 7 7"/>
      </svg>
    `;

    return L.divIcon({
      className: 'custom-node-icon',
      html: `
        <div class="tower-pin ${pinClass}">
          ${svgTower}
          ${badgeHtml}
        </div>
        <div class="node-city-label">${cityName}</div>
      `,
      iconSize: [44, 52],
      iconAnchor: [22, 42]
    });
  }

  function createMobileNodeIcon() {
    const svgPhone = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
      </svg>
    `;

    return L.divIcon({
      className: 'mn-device-icon',
      html: `
        <div class="mn-device-bubble">
          ${svgPhone}
        </div>
        <div class="mn-label">MN</div>
      `,
      iconSize: [36, 44],
      iconAnchor: [18, 22]
    });
  }

  // Moving packet marker
  let movingPacketMarker = null;

  function updateMovingPacketMarker(latlng, isEncapsulated) {
    if (!movingPacketMarker) {
      movingPacketMarker = L.marker(latlng, {
        icon: L.divIcon({
          className: `animated-packet-marker ${isEncapsulated ? 'encapsulated' : ''}`,
          html: isEncapsulated ? '📦' : '✉️',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        }),
        zIndexOffset: 1000
      }).addTo(movingPacketLayer);
    } else {
      movingPacketMarker.setLatLng(latlng);
      const el = movingPacketMarker.getElement();
      if (el) {
        el.className = `animated-packet-marker leaflet-zoom-animated ${isEncapsulated ? 'encapsulated' : ''}`;
        el.innerHTML = isEncapsulated ? '📦' : '✉️';
      }
    }
  }

  function clearMovingPacketMarker() {
    if (movingPacketMarker) {
      movingPacketLayer.removeLayer(movingPacketMarker);
      movingPacketMarker = null;
    }
  }

  // --- 5. RENDER MAP NODES & ROLES ---
  function renderMapNodes() {
    nodeMarkersLayer.clearLayers();

    Object.keys(CITIES).forEach(key => {
      const city = CITIES[key];
      let role = 'IDLE';

      if (key === state.cnCityKey) role = 'CN';
      else if (key === state.homeCityKey) role = 'HA';
      else if (key === state.currentCityKey) role = 'FA';

      const icon = createTowerIcon(role, city.name);
      const marker = L.marker([city.lat, city.lng], { icon: icon });

      // Node details on click
      let popupText = `<strong>${city.name} Station</strong><br>Subnet: <code>${city.subnet}</code>`;
      if (role === 'CN') popupText += `<br><span style="color:#2563eb;font-weight:bold;">● Correspondent Node (Sender)</span><br>IP: <code>${city.cnIp}</code>`;
      if (role === 'HA') popupText += `<br><span style="color:#7c3aed;font-weight:bold;">● Home Agent (Home Network)</span><br>HA IP: <code>${city.haIp}</code><br>MN Permanent HoA: <code>${city.mnHoA}</code>`;
      if (role === 'FA') popupText += `<br><span style="color:#10b981;font-weight:bold;">● Foreign Agent (Foreign Network)</span><br>FA CoA: <code>${city.faIp}</code>`;

      marker.bindPopup(popupText);
      nodeMarkersLayer.addLayer(marker);
    });

    // Render Mobile Node (MN) near current location
    const currCity = CITIES[state.currentCityKey];
    if (currCity) {
      // Place MN with a slight offset so it doesn't overlap the tower
      const mnLat = currCity.lat - 0.08;
      const mnLng = currCity.lng + 0.12;
      const mnMarker = L.marker([mnLat, mnLng], {
        icon: createMobileNodeIcon(),
        zIndexOffset: 500
      });
      mnMarker.bindPopup(`<strong>Mobile Node (MN)</strong><br>Current Location: ${currCity.name}<br>Permanent HoA: <code>${CITIES[state.homeCityKey].mnHoA}</code><br>Attached CoA: <code>${currCity.faIp}</code>`);
      nodeMarkersLayer.addLayer(mnMarker);
    }
  }

  function fitSelectedNodes() {
    const cn = CITIES[state.cnCityKey];
    const ha = CITIES[state.homeCityKey];
    const fa = CITIES[state.currentCityKey];
    if (!cn || !ha || !fa) return;

    const bounds = L.latLngBounds([
      [cn.lat, cn.lng],
      [ha.lat, ha.lng],
      [fa.lat, fa.lng]
    ]);
    map.fitBounds(bounds.pad(0.35), { maxZoom: 8, animate: true, duration: 0.6 });
  }

  // --- 6. ROUTE PATHS & TUNNELS ---
  function drawStaticRoutes() {
    routePathsLayer.clearLayers();
    overlayLabelsLayer.clearLayers();

    const cn = CITIES[state.cnCityKey];
    const ha = CITIES[state.homeCityKey];
    const fa = CITIES[state.currentCityKey];

    // 1. CN -> HA Route (Standard IP Route)
    const cnToHa = L.polyline([[cn.lat, cn.lng], [ha.lat, ha.lng]], {
      color: '#2563eb',
      weight: 3.5,
      opacity: 0.5,
      dashArray: '4, 8'
    }).addTo(routePathsLayer);

    // 2. HA -> FA Tunnel (Encapsulated Tunnel Route)
    const haToFa = L.polyline([[ha.lat, ha.lng], [fa.lat, fa.lng]], {
      color: '#7c3aed',
      weight: 5,
      opacity: 0.65,
      dashArray: '8, 8',
      lineCap: 'round'
    }).addTo(routePathsLayer);

    // Tunnel midpoint label
    const midLat = (ha.lat + fa.lat) / 2;
    const midLng = (ha.lng + fa.lng) / 2;
    const tunnelLabel = L.marker([midLat, midLng], {
      icon: L.divIcon({
        className: 'tunnel-path-label',
        html: `<div style="background:#7c3aed;color:#fff;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:999px;border:1px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);white-space:nowrap;">🚇 FORWARD TUNNEL (IP-in-IP)</div>`,
        iconAnchor: [70, 10]
      })
    }).addTo(overlayLabelsLayer);

    // 3. FA -> MN Local Delivery
    const mnLat = fa.lat - 0.08;
    const mnLng = fa.lng + 0.12;
    L.polyline([[fa.lat, fa.lng], [mnLat, mnLng]], {
      color: '#10b981',
      weight: 3,
      opacity: 0.8,
      dashArray: '3, 5'
    }).addTo(routePathsLayer);
  }

  // --- 7. PACKET INTERPOLATION ANIMATION ---
  function interpolateRoute(fromLatLng, toLatLng, durationMs, isEncapsulated, onComplete) {
    if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);

    const startTime = performance.now();
    const actualDuration = durationMs / state.speedMultiplier;

    function frame(now) {
      if (!state.isPlaying) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / actualDuration, 1);

      // Smooth ease-in-out
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;

      const currentLat = fromLatLng[0] + (toLatLng[0] - fromLatLng[0]) * ease;
      const currentLng = fromLatLng[1] + (toLatLng[1] - fromLatLng[1]) * ease;

      updateMovingPacketMarker([currentLat, currentLng], isEncapsulated);

      if (progress < 1) {
        state.animationFrameId = requestAnimationFrame(frame);
      } else {
        if (onComplete) onComplete();
      }
    }

    state.animationFrameId = requestAnimationFrame(frame);
  }

  // --- 8. THE 6 SIMULATION STAGES ---
  /*
    STEP 1: Original Message Generation (CN -> HA)
    STEP 2: Home Agent Interception (HA Binding Cache Lookup)
    STEP 3: Encapsulation (Outer Header Added)
    STEP 4: Forward Tunnel (HA -> FA in IP-in-IP tunnel)
    STEP 5: Foreign Agent Decapsulation (Outer Header Stripped)
    STEP 6: Final Delivery (FA -> MN)
  */

  function updateTelemetryAndInspector(step) {
    const cn = CITIES[state.cnCityKey];
    const ha = CITIES[state.homeCityKey];
    const fa = CITIES[state.currentCityKey];

    const stageBadge = document.getElementById('inspectorStageBadge');
    const telStage = document.getElementById('telStage');
    const telSrc = document.getElementById('telSrc');
    const telDst = document.getElementById('telDst');
    const telOuter = document.getElementById('telOuter');
    const telOriginal = document.getElementById('telOriginal');
    const telAgent = document.getElementById('telAgent');
    const telLocation = document.getElementById('telLocation');
    const inspectorExplanation = document.getElementById('inspectorExplanation');
    const deliveryBanner = document.getElementById('deliverySuccessBanner');
    const outerPacketBox = document.getElementById('outerPacketBox');

    // Reset banner
    if (deliveryBanner) deliveryBanner.style.display = 'none';

    // Step dots in progress bar
    document.querySelectorAll('.stage-step-item').forEach((item, idx) => {
      const stepNum = idx + 1;
      item.classList.remove('active', 'completed');
      if (stepNum === step) item.classList.add('active');
      else if (stepNum < step) item.classList.add('completed');
    });

    switch (step) {
      case 1:
        if (stageBadge) stageBadge.textContent = 'Step 1/6: Original Packet Generation';
        if (telStage) telStage.innerHTML = '<span class="badge-status status-active">Step 1: Original Packet</span>';
        if (telSrc) telSrc.innerHTML = `CN: <code>${cn.cnIp}</code>`;
        if (telDst) telDst.innerHTML = `MN HoA: <code>${ha.mnHoA}</code>`;
        if (telOuter) telOuter.innerHTML = '<span class="badge-status status-none">None (Standard IP)</span>';
        if (telOriginal) telOriginal.innerHTML = '<span class="badge-status status-active">Generated &amp; Intact</span>';
        if (telAgent) telAgent.innerHTML = 'None (Standard Internet Route)';
        if (telLocation) telLocation.textContent = `Transit: ${cn.name} → ${ha.name}`;

        if (outerPacketBox) outerPacketBox.classList.add('dissolved');

        if (inspectorExplanation) {
          inspectorExplanation.innerHTML = `
            <strong>Correspondent Node Sends Packet:</strong>
            The Correspondent Node (CN in <em>${cn.name}</em>) wants to send data to the Mobile Node (MN).
            The CN only knows the Mobile Node's permanent <strong>Home Address (${ha.mnHoA})</strong>.
            Standard IP routing naturally delivers this packet directly to the MN's <strong>Home Network (${ha.name})</strong>.
          `;
        }
        break;

      case 2:
        if (stageBadge) stageBadge.textContent = 'Step 2/6: Home Agent Interception';
        if (telStage) telStage.innerHTML = '<span class="badge-status status-active">Step 2: HA Interception</span>';
        if (telSrc) telSrc.innerHTML = `CN: <code>${cn.cnIp}</code>`;
        if (telDst) telDst.innerHTML = `MN HoA: <code>${ha.mnHoA}</code>`;
        if (telOuter) telOuter.innerHTML = '<span class="badge-status status-none">None</span>';
        if (telOriginal) telOriginal.innerHTML = '<span class="badge-status status-active">Preserved</span>';
        if (telAgent) telAgent.innerHTML = `<span class="badge-status status-tunnel">Home Agent (${ha.name})</span>`;
        if (telLocation) telLocation.textContent = `At Home Agent: ${ha.name}`;

        if (outerPacketBox) outerPacketBox.classList.add('dissolved');

        if (inspectorExplanation) {
          inspectorExplanation.innerHTML = `
            <strong>Home Agent Intercepts Packet:</strong>
            The packet arrives at <em>${ha.name}</em>. Because the Mobile Node is currently away, the <strong>Home Agent (HA)</strong> intercepts the packet using Proxy ARP.
            The HA consults its <strong>Binding Cache</strong> and discovers the MN is currently residing in <em>${fa.name}</em> with Care-of Address: <strong>${fa.faIp}</strong>.
          `;
        }
        break;

      case 3:
        if (stageBadge) stageBadge.textContent = 'Step 3/6: IP-in-IP Encapsulation';
        if (telStage) telStage.innerHTML = '<span class="badge-status status-tunnel">Step 3: Encapsulation</span>';
        if (telSrc) telSrc.innerHTML = `Outer: <code>${ha.haIp} (HA)</code><br>Inner: <code>${cn.cnIp} (CN)</code>`;
        if (telDst) telDst.innerHTML = `Outer: <code>${fa.faIp} (CoA)</code><br>Inner: <code>${ha.mnHoA} (MN)</code>`;
        if (telOuter) telOuter.innerHTML = '<span class="badge-status status-tunnel">Added (IP Protocol 4)</span>';
        if (telOriginal) telOriginal.innerHTML = '<span class="badge-status status-active">Preserved &amp; Wrapped</span>';
        if (telAgent) telAgent.innerHTML = `Home Agent (${ha.name})`;
        if (telLocation) telLocation.textContent = `Encapsulation Engine at ${ha.name}`;

        if (outerPacketBox) outerPacketBox.classList.remove('dissolved');

        if (inspectorExplanation) {
          inspectorExplanation.innerHTML = `
            <strong>Encapsulation in Action:</strong>
            The Home Agent wraps the original IP packet inside a brand new <strong>Outer IP Header</strong>.
            Outer Source: <code>${ha.haIp}</code> (HA).
            Outer Destination: <code>${fa.faIp}</code> (Care-of Address).
            The original IP packet (with CN's IP and MN's Home Address) remains completely unchanged inside!
          `;
        }
        break;

      case 4:
        if (stageBadge) stageBadge.textContent = 'Step 4/6: Forward Tunneling';
        if (telStage) telStage.innerHTML = '<span class="badge-status status-tunnel">Step 4: Forward Tunnel</span>';
        if (telSrc) telSrc.innerHTML = `Outer: <code>${ha.haIp}</code> | Inner: <code>${cn.cnIp}</code>`;
        if (telDst) telDst.innerHTML = `Outer: <code>${fa.faIp}</code> | Inner: <code>${ha.mnHoA}</code>`;
        if (telOuter) telOuter.innerHTML = '<span class="badge-status status-tunnel">In Transit (Active)</span>';
        if (telOriginal) telOriginal.innerHTML = '<span class="badge-status status-active">Intact inside Tunnel</span>';
        if (telAgent) telAgent.innerHTML = 'Transit via Tunnel';
        if (telLocation) telLocation.textContent = `Tunnel: ${ha.name} (HA) → ${fa.name} (FA)`;

        if (outerPacketBox) outerPacketBox.classList.remove('dissolved');

        if (inspectorExplanation) {
          inspectorExplanation.innerHTML = `
            <strong>Forward Tunnel Traversal:</strong>
            Intermediate routers inspect ONLY the outer IP header and route the packet towards the <strong>Care-of Address (${fa.faIp})</strong> in <em>${fa.name}</em>.
            Routers along the way have no idea that the payload is another IP packet.
          `;
        }
        break;

      case 5:
        if (stageBadge) stageBadge.textContent = 'Step 5/6: Foreign Agent Decapsulation';
        if (telStage) telStage.innerHTML = '<span class="badge-status status-active">Step 5: Decapsulation</span>';
        if (telSrc) telSrc.innerHTML = `Original: <code>${cn.cnIp} (CN)</code>`;
        if (telDst) telDst.innerHTML = `Original: <code>${ha.mnHoA} (MN)</code>`;
        if (telOuter) telOuter.innerHTML = '<span class="badge-status status-none">Stripped &amp; Discarded</span>';
        if (telOriginal) telOriginal.innerHTML = '<span class="badge-status status-active">Recovered Perfectly</span>';
        if (telAgent) telAgent.innerHTML = `<span class="badge-status status-active">Foreign Agent (${fa.name})</span>`;
        if (telLocation) telLocation.textContent = `Foreign Agent: ${fa.name}`;

        if (outerPacketBox) outerPacketBox.classList.add('dissolved');

        if (inspectorExplanation) {
          inspectorExplanation.innerHTML = `
            <strong>Decapsulation at Foreign Agent:</strong>
            The Foreign Agent receives the packet addressed to its CoA (<code>${fa.faIp}</code>).
            It sees IP Protocol 4 (IP-in-IP), strips off the outer IP header, and recovers the pristine original IP packet!
          `;
        }
        break;

      case 6:
        if (stageBadge) stageBadge.textContent = 'Step 6/6: Final Local Delivery';
        if (telStage) telStage.innerHTML = '<span class="badge-status status-active">Step 6: Final Delivery</span>';
        if (telSrc) telSrc.innerHTML = `CN: <code>${cn.cnIp}</code>`;
        if (telDst) telDst.innerHTML = `MN: <code>${ha.mnHoA}</code>`;
        if (telOuter) telOuter.innerHTML = '<span class="badge-status status-none">None</span>';
        if (telOriginal) telOriginal.innerHTML = '<span class="badge-status status-active">Delivered Successfully</span>';
        if (telAgent) telAgent.innerHTML = `Local Link at ${fa.name}`;
        if (telLocation) telLocation.textContent = `Mobile Node in ${fa.name}`;

        if (outerPacketBox) outerPacketBox.classList.add('dissolved');

        if (deliveryBanner) deliveryBanner.style.display = 'block';

        if (inspectorExplanation) {
          inspectorExplanation.innerHTML = `
            <strong>Packet Delivered to Mobile Node:</strong>
            The Foreign Agent transmits the original packet across the local foreign subnet to the Mobile Node (using MN's MAC address).
            The Mobile Node receives the exact packet sent by CN without any broken TCP connections!
          `;
        }
        break;
    }
  }

  function executeStep(step, autoAdvance = true) {
    state.currentStep = step;
    updateTelemetryAndInspector(step);

    const cn = CITIES[state.cnCityKey];
    const ha = CITIES[state.homeCityKey];
    const fa = CITIES[state.currentCityKey];
    const mnLat = fa.lat - 0.08;
    const mnLng = fa.lng + 0.12;

    clearTimeout(state.stepTimerId);
    if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);

    if (step === 1) {
      // CN -> HA
      updateMovingPacketMarker([cn.lat, cn.lng], false);
      if (state.isPlaying) {
        interpolateRoute([cn.lat, cn.lng], [ha.lat, ha.lng], 3200, false, () => {
          if (autoAdvance && state.isPlaying) {
            state.stepTimerId = setTimeout(() => executeStep(2, true), 1200 / state.speedMultiplier);
          }
        });
      }
    } else if (step === 2) {
      // Arrived at HA, pulse and lookup
      updateMovingPacketMarker([ha.lat, ha.lng], false);
      if (state.isPlaying && autoAdvance) {
        state.stepTimerId = setTimeout(() => executeStep(3, true), 2200 / state.speedMultiplier);
      }
    } else if (step === 3) {
      // Encapsulation visual at HA
      updateMovingPacketMarker([ha.lat, ha.lng], true);
      if (state.isPlaying && autoAdvance) {
        state.stepTimerId = setTimeout(() => executeStep(4, true), 2400 / state.speedMultiplier);
      }
    } else if (step === 4) {
      // HA -> FA Forward Tunnel
      updateMovingPacketMarker([ha.lat, ha.lng], true);
      if (state.isPlaying) {
        interpolateRoute([ha.lat, ha.lng], [fa.lat, fa.lng], 4000, true, () => {
          if (autoAdvance && state.isPlaying) {
            state.stepTimerId = setTimeout(() => executeStep(5, true), 1200 / state.speedMultiplier);
          }
        });
      }
    } else if (step === 5) {
      // Decapsulation at FA
      updateMovingPacketMarker([fa.lat, fa.lng], false);
      if (state.isPlaying && autoAdvance) {
        state.stepTimerId = setTimeout(() => executeStep(6, true), 2200 / state.speedMultiplier);
      }
    } else if (step === 6) {
      // FA -> MN Local Delivery
      updateMovingPacketMarker([fa.lat, fa.lng], false);
      if (state.isPlaying) {
        interpolateRoute([fa.lat, fa.lng], [mnLat, mnLng], 1800, false, () => {
          state.isPlaying = false;
          updateSimulationControls();
        });
      }
    }
  }

  // --- 9. SIMULATION CONTROLS & EVENT HANDLERS ---
  const startBtn = document.getElementById('startSimBtn');
  const pauseBtn = document.getElementById('pauseSimBtn');
  const resetBtn = document.getElementById('resetSimBtn');
  const prevBtn = document.getElementById('prevStepBtn');
  const nextBtn = document.getElementById('nextStepBtn');

  function updateSimulationControls() {
    if (!startBtn) return;
    if (state.isPlaying) {
      startBtn.innerHTML = `<span>Simulating...</span>`;
      startBtn.style.background = '#059669';
      if (pauseBtn) {
        pauseBtn.disabled = false;
        pauseBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> Pause`;
      }
    } else {
      startBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> ${state.currentStep === 6 ? 'Replay Simulation' : 'Start Simulation'}`;
      startBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      if (pauseBtn) {
        pauseBtn.disabled = state.currentStep === 1 || state.currentStep === 6;
        pauseBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Resume`;
      }
    }
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      state.isPlaying = true;
      updateSimulationControls();
      if (state.currentStep === 6) {
        executeStep(1, true);
      } else {
        executeStep(state.currentStep, true);
      }
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      if (state.isPlaying) {
        state.isPlaying = false;
        clearTimeout(state.stepTimerId);
        if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);
      } else {
        state.isPlaying = true;
        executeStep(state.currentStep, true);
      }
      updateSimulationControls();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.isPlaying = false;
      clearTimeout(state.stepTimerId);
      if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);
      state.currentStep = 1;
      executeStep(1, false);
      updateSimulationControls();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      state.isPlaying = false;
      clearTimeout(state.stepTimerId);
      if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);
      if (state.currentStep > 1) {
        executeStep(state.currentStep - 1, false);
      }
      updateSimulationControls();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      state.isPlaying = false;
      clearTimeout(state.stepTimerId);
      if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);
      if (state.currentStep < 6) {
        executeStep(state.currentStep + 1, false);
      }
      updateSimulationControls();
    });
  }

  // Clickable Stage Step Items
  document.querySelectorAll('.stage-step-item').forEach((item, idx) => {
    item.addEventListener('click', () => {
      state.isPlaying = false;
      clearTimeout(state.stepTimerId);
      if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);
      executeStep(idx + 1, false);
      updateSimulationControls();
    });
  });

  // Speed chips
  document.querySelectorAll('.speed-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.speedMultiplier = parseFloat(btn.getAttribute('data-speed')) || 1.0;
    });
  });

  // --- 10. CITY SELECTORS & PRESETS ---
  const cnSelect = document.getElementById('cnNodeSelect');
  const homeSelect = document.getElementById('homeNodeSelect');
  const currentSelect = document.getElementById('currentNodeSelect');

  function populateDropdowns() {
    const cityKeys = Object.keys(CITIES);

    [cnSelect, homeSelect, currentSelect].forEach(sel => {
      if (!sel) return;
      sel.innerHTML = '';
      cityKeys.forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = `${CITIES[k].name}`;
        sel.appendChild(opt);
      });
    });

    if (cnSelect) cnSelect.value = state.cnCityKey;
    if (homeSelect) homeSelect.value = state.homeCityKey;
    if (currentSelect) currentSelect.value = state.currentCityKey;

    updateCityMetaInfo();
  }

  function updateCityMetaInfo() {
    const cn = CITIES[state.cnCityKey];
    const ha = CITIES[state.homeCityKey];
    const fa = CITIES[state.currentCityKey];

    const cnMeta = document.getElementById('cnMetaIp');
    const haMeta = document.getElementById('haMetaIp');
    const faMeta = document.getElementById('faMetaIp');

    if (cnMeta) cnMeta.innerHTML = `CN IP: <code>${cn.cnIp}</code> (${cn.subnet})`;
    if (haMeta) haMeta.innerHTML = `HA IP: <code>${ha.haIp}</code> | MN HoA: <code>${ha.mnHoA}</code>`;
    if (faMeta) faMeta.innerHTML = `FA CoA: <code>${fa.faIp}</code> (${fa.subnet})`;

    // Check same city edge cases
    const warningNotice = document.getElementById('sameCityNotice');
    if (warningNotice) {
      if (state.homeCityKey === state.currentCityKey) {
        warningNotice.style.display = 'block';
        warningNotice.innerHTML = `<strong>Special Case: MN is at Home Network (${ha.name})</strong>. No Foreign Agent or tunnel required! Packets are delivered directly.`;
      } else {
        warningNotice.style.display = 'none';
      }
    }
  }

  function onSelectionChange() {
    state.isPlaying = false;
    clearTimeout(state.stepTimerId);
    if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);

    if (cnSelect) state.cnCityKey = cnSelect.value;
    if (homeSelect) state.homeCityKey = homeSelect.value;
    if (currentSelect) state.currentCityKey = currentSelect.value;

    updateCityMetaInfo();
    renderMapNodes();
    drawStaticRoutes();
    fitSelectedNodes();

    state.currentStep = 1;
    executeStep(1, false);
    updateSimulationControls();
  }

  if (cnSelect) cnSelect.addEventListener('change', onSelectionChange);
  if (homeSelect) homeSelect.addEventListener('change', onSelectionChange);
  if (currentSelect) currentSelect.addEventListener('change', onSelectionChange);

  // Preset Buttons
  document.querySelectorAll('.preset-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const cn = btn.getAttribute('data-cn');
      const home = btn.getAttribute('data-home');
      const curr = btn.getAttribute('data-curr');

      if (cn && CITIES[cn]) state.cnCityKey = cn;
      if (home && CITIES[home]) state.homeCityKey = home;
      if (curr && CITIES[curr]) state.currentCityKey = curr;

      if (cnSelect) cnSelect.value = state.cnCityKey;
      if (homeSelect) homeSelect.value = state.homeCityKey;
      if (currentSelect) currentSelect.value = state.currentCityKey;

      onSelectionChange();
    });
  });

  // Fit bounds button on map header
  const fitBtn = document.getElementById('fitNodesBtn');
  if (fitBtn) fitBtn.addEventListener('click', fitSelectedNodes);

  // --- 11. INITIAL SETUP ---
  populateDropdowns();
  renderMapNodes();
  drawStaticRoutes();
  executeStep(1, false);
  updateSimulationControls();
  fitSelectedNodes();

})();
