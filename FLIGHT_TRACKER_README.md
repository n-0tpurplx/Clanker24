# 🎮 Clanker24 - Live Flight Tracker

A real-time flight tracking web application that connects to the ATC24 24data WebSocket API to display all current flights on an interactive map.

## ✨ Features

- **Live Flight Tracking**: Real-time aircraft positions streamed via WebSocket
- **Interactive Map**: Leaflet-based map with zoom and pan controls
- **Flight Details**: View altitude, heading, speed, and coordinates for each flight
- **Flight List Sidebar**: Sortable list of all active flights with quick selection
- **Dark Theme**: Professional dark UI optimized for extended viewing
- **Auto-Reconnect**: Automatic reconnection with exponential backoff
- **Responsive Design**: Works on desktop and tablet browsers

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for WebSocket and map tiles

### Local Development

```bash
# Start local server
npm start
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### GitHub Pages Deployment

This app is configured for GitHub Pages hosting. To deploy:

```bash
# Build and push to gh-pages branch
npm run deploy
```

Then enable GitHub Pages in your repository settings to serve from the `gh-pages` branch.

## 🏗️ Architecture

- **index.html**: Main page with Leaflet map and sidebar UI
- **src/main.js**: WebSocket connection, data processing, and map interactions
- **package.json**: Project configuration and deployment scripts

## 📡 WebSocket Connection

The app connects to `wss://24data.ptfs.app/wss` and listens for:
- `ACFT_DATA`: Main aircraft position data
- `EVENT_ACFT_DATA`: Event-based flight updates

## 🎨 UI Components

- **Sidebar**: Flight list with status indicator
- **Map**: Interactive Leaflet map with aircraft markers
- **Controls**: Center map and clear selection buttons
- **Popups**: Flight information on marker click

## 📝 Flight Data Fields

- **Player Name**: Flight callsign/identifier
- **Latitude/Longitude**: Aircraft position
- **Altitude**: Flight level in feet
- **Heading**: Aircraft direction (0-360°)
- **Speed**: Ground speed in knots

## ⚙️ Configuration

Modify `WS_URL` in `src/main.js` to connect to different WebSocket endpoints.

## 📄 License

MIT License