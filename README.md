# Arena Map

Arena Map is a React + Vite app for joining a room and sharing live location on a map. It includes a client-side experience for entering a room code and a small Express/WebSocket server that broadcasts room state between connected users.

## Features

- Join a room with a name and numeric room code.
- View yourself and other participants on a live Leaflet map.
- Share location updates in real time over WebSockets.
- Static pages for privacy, terms, legal, and contact information.

## Tech Stack

- React 19
- Vite
- React Router
- Leaflet and React Leaflet
- Express
- ws

## Project Structure

- `src/main.jsx` - application entry point and route setup.
- `src/pages/LandingPage.jsx` - marketing landing page.
- `src/pages/Code.jsx` - room code and name entry form.
- `src/pages/Map.jsx` - live map and participant tracking.
- `server.js` - Express + WebSocket room server.

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the app in development

```bash
npm run dev
```

This starts Vite for the frontend and `server.js` for the websocket backend.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Start the room server only

```bash
npm start
```

## Configuration

The app uses these environment values when available:

- `VITE_ROOM_SERVER_URL` - websocket URL used by the map page.
- `PORT` or `ROOM_SERVER_PORT` - port for the room server, defaulting to `3001`.

## Notes

- The map page stores the last joined room locally in the browser.
- Geolocation permission is required to publish your live position.
- The server serves the built frontend from `dist` in production.
