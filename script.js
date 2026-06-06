const aircraft = {
    parked: [
        {
            callsign: "AAL123",
            aircraft: "Boeing 737",
            pilot: "PilotA",
            altitude: "0 ft"
        }
    ],

    taxiing: [
        {
            callsign: "DAL456",
            aircraft: "Airbus A320",
            pilot: "PilotB",
            altitude: "GS 18 kt"
        }
    ],

    departing: [
        {
            callsign: "SHAMROCK-1337",
            aircraft: "Airbus A380",
            pilot: "PTC_Helper",
            altitude: "1450 ft"
        }
    ],

    enroute: [
        {
            callsign: "UAE001",
            aircraft: "Boeing 777",
            pilot: "PilotC",
            altitude: "32000 ft"
        },
        {
            callsign: "DLH500",
            aircraft: "Airbus A350",
            pilot: "PilotD",
            altitude: "28000 ft"
        }
    ]
};

function createStrip(data) {
    return `
        <div class="strip">
            <div class="callsign">${data.callsign}</div>
            <div class="info">
                ${data.aircraft}<br>
                ${data.pilot}<br>
                ${data.altitude}
            </div>
        </div>
    `;
}

function renderColumn(id, aircraftList) {
    const column = document.getElementById(id);

    aircraftList.forEach(acft => {
        column.innerHTML += createStrip(acft);
    });
}

renderColumn("parked", aircraft.parked);
renderColumn("taxiing", aircraft.taxiing);
renderColumn("departing", aircraft.departing);
renderColumn("enroute", aircraft.enroute);
