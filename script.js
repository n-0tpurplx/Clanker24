const API = "https://clanker24-be.onrender.com/aircraft";

const airportSelect = document.getElementById("airportSelect");
let airport = airportSelect.value;

airportSelect.addEventListener("change", () => {
    airport = airportSelect.value;
    load();
});

const columns = {
    PARKED: document.getElementById("PARKED"),
    TAXIING: document.getElementById("TAXIING"),
    DEPARTING: document.getElementById("DEPARTING"),
    ENROUTE: document.getElementById("ENROUTE")
};

function strip(acft) {
    const div = document.createElement("div");
    div.className = "strip";

    div.innerHTML = `
        <div class="callsign">${acft.callsign}</div>
        <div class="info">
            ${acft.aircraft}<br>
            ${acft.pilot}<br>
            ${acft.altitude} ft<br>
            ${acft.groundSpeed ?? acft.speed} kt
        </div>
    `;

    return div;
}

async function load() {
    try {
        const res = await fetch(`${API}?airport=${airport}`);
        const data = await res.json();

        document.querySelector(".stats").innerText =
            `${data.count} Aircraft Online`;

        // clear columns (IMPORTANT)
        Object.values(columns).forEach(c => c.innerHTML = "");

        // render strips
        for (const acft of data.aircraft) {
            if (columns[acft.strip]) {
                columns[acft.strip].appendChild(strip(acft));
            }
        }

    } catch (err) {
        console.log("error:", err);
    }
}

load();
setInterval(load, 3000);
