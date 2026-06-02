const WS_URL = "wss://24data.ptfs.app/wss";
const POLL_INTERVAL = 1000;

let map;
let markers = new Map();
let flights = new Map();
let selectedFlight = null;
let wsConnection = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    connectWebSocket();
    setupEventListeners();
});

function initializeMap() {
    map = L.map('map').setView([20, 0], 3);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    const style = document.createElement('style');
    style.textContent = `.leaflet-tile { filter: invert(0.93) hue-rotate(200deg) brightness(1.1) contrast(0.8); }`;
    document.head.appendChild(style);
}

function connectWebSocket() {
    try {
        wsConnection = new WebSocket(WS_URL);
        
        wsConnection.onopen = () => {
            console.log('✅ WebSocket connected');
            updateStatus('Connected', true);
        };
        
        wsConnection.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg && msg.t && msg.d) {
                    processFlightData(msg.d);
                }
            } catch (e) {
                console.error('Error parsing message:', e);
            }
        };
        
        wsConnection.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            updateStatus('Error', false);
        };
        
        wsConnection.onclose = () => {
            console.log('🔌 WebSocket disconnected');
            updateStatus('Disconnected', false);
            setTimeout(connectWebSocket, 3000);
        };
    } catch (e) {
        console.error('Failed to connect:', e);
        updateStatus('Failed', false);
    }
}

function processFlightData(data) {
    if (!data) return;
    
    const flightArray = Array.isArray(data) ? data : Object.values(data);
    
    flightArray.forEach(flight => {
        if (flight && flight.playerName && flight.latitude !== undefined && flight.longitude !== undefined) {
            flights.set(flight.playerName, flight);
            updateFlightMarker(flight);
        }
    });
    
    const currentCallsigns = new Set(flightArray.map(f => f.playerName).filter(Boolean));
    for (const callsign of flights.keys()) {
        if (!currentCallsigns.has(callsign)) {
            removeFlightMarker(callsign);
            flights.delete(callsign);
        }
    }
    
    updateFlightsList();
    updateFlightCount();
}

function updateFlightMarker(flight) {
    const { playerName, latitude, longitude, altitude, heading } = flight;
    
    if (markers.has(playerName)) {
        const marker = markers.get(playerName);
        marker.setLatLng([latitude, longitude]);
    } else {
        const marker = L.marker([latitude, longitude], {
            icon: createFlightIcon(heading || 0),
            title: playerName
        }).addTo(map);
        
        marker.bindPopup(createPopupContent(flight), { maxWidth: 300 });
        marker.on('click', () => selectFlight(playerName));
        markers.set(playerName, marker);
    }
    
    const marker = markers.get(playerName);
    marker.setPopupContent(createPopupContent(flight));
}

function createFlightIcon(heading) {
    return L.divIcon({
        className: 'flight-marker',
        html: `<div style="transform: rotate(${heading}deg); width: 24px; height: 24px; background: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364b5f6%22 stroke-width=%222%22><path d=%22M12 2v20M12 2l-8 8h6v4h4v-4h6l-8-8z%22/></svg>'); background-size: contain; background-repeat: no-repeat; background-position: center; filter: drop-shadow(0 0 2px rgba(100, 181, 246, 0.8));"></div>`,
        iconSize: [24, 24],
        popupAnchor: [0, -12]
    });
}

function createPopupContent(flight) {
    const { playerName, latitude, longitude, altitude, heading, speed } = flight;
    return `<div><h3 style="color: #64b5f6; margin-bottom: 8px;">${playerName || 'Unknown'}</h3><p><strong>Altitude:</strong> ${(altitude || 0).toFixed(0)} ft</p><p><strong>Heading:</strong> ${(heading || 0).toFixed(0)}°</p><p><strong>Speed:</strong> ${(speed || 0).toFixed(0)} kts</p><p><strong>Lat/Lon:</strong> ${latitude.toFixed(4)}° / ${longitude.toFixed(4)}°</p></div>`;
}

function removeFlightMarker(callsign) {
    if (markers.has(callsign)) {
        map.removeLayer(markers.get(callsign));
        markers.delete(callsign);
    }
}

function selectFlight(callsign) {
    selectedFlight = callsign;
    const flight = flights.get(callsign);
    
    if (flight) {
        map.setView([flight.latitude, flight.longitude], 8);
        updateFlightsList();
        const marker = markers.get(callsign);
        if (marker) marker.openPopup();
    }
}

function updateFlightsList() {
    const listContainer = document.getElementById('flights-list');
    
    if (flights.size === 0) {
        listContainer.innerHTML = '<div class="no-flights">No flights online</div>';
        return;
    }
    
    let html = '';
    const sortedFlights = Array.from(flights.values()).sort((a, b) => 
        (a.playerName || '').localeCompare(b.playerName || '')
    );
    
    sortedFlights.forEach(flight => {
        const isSelected = flight.playerName === selectedFlight;
        const altitude = flight.altitude || 0;
        const speed = flight.speed || 0;
        
        html += `<div class="flight-item ${isSelected ? 'selected' : ''}" data-callsign="${flight.playerName}">
            <div class="flight-callsign">${flight.playerName || 'UNKNOWN'}</div>
            <div class="flight-info">Alt: ${altitude.toFixed(0)}ft | Spd: ${speed.toFixed(0)}kt | Hdg: ${(flight.heading || 0).toFixed(0)}°</div>
        </div>`;
    });
    
    listContainer.innerHTML = html;
    
    document.querySelectorAll('.flight-item').forEach(item => {
        item.addEventListener('click', () => {
            const callsign = item.getAttribute('data-callsign');
            selectFlight(callsign);
        });
    });
}

function updateFlightCount() {
    const count = flights.size;
    document.getElementById('flight-count').textContent = `${count} flight${count !== 1 ? 's' : ''}`;
}

function updateStatus(text, connected) {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    
    statusText.textContent = text;
    statusDot.classList.toggle('connected', connected);
}

function setupEventListeners() {
    document.getElementById('center-btn').addEventListener('click', () => {
        if (selectedFlight) {
            const flight = flights.get(selectedFlight);
            if (flight) map.setView([flight.latitude, flight.longitude], 8);
        } else {
            map.setView([20, 0], 3);
        }
    });
    
    document.getElementById('clear-btn').addEventListener('click', () => {
        selectedFlight = null;
        updateFlightsList();
        map.closePopup();
    });
}

setInterval(() => {
    if (flights.size > 0) updateFlightsList();
}, POLL_INTERVAL);
