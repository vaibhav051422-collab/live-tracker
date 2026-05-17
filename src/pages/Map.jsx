import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const STORAGE_KEY = "arena-room-session";

function hashCode(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) return null;
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function buildFallbackSession() {
  return {
    name: "Guest",
    code: "0000",
  };
}

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.latitude, center.longitude], map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function Map() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeParticipantId, setActiveParticipantId] = useState("self");
  const [geoState, setGeoState] = useState({ status: "loading", error: "", coords: null });
  const [participants, setParticipants] = useState([]);
  const [clientId, setClientId] = useState("");
  const [connectionState, setConnectionState] = useState("connecting");
  const [pingedEmojis, setPingedEmojis] = useState({});
  const [copyLinkText, setCopyLinkText] = useState("Copy invite link");
  const socketRef = useRef(null);
  const latestLocationRef = useRef(null);

  const session = useMemo(() => {
    const routeState = location.state || {};

    if (routeState.name && routeState.code) {
      return routeState;
    }

    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (stored?.name && stored?.code) {
        return stored;
      }
    } catch {
      
    }

    return buildFallbackSession();
  }, [location.state]);

  useEffect(() => {
    let watchId;

    if (!navigator.geolocation) {
      setGeoState({
        status: "error",
        error: "Location access is not supported in this browser.",
        coords: null,
      });
      return undefined;
    }

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        latestLocationRef.current = coords;
        setGeoState({
          status: "ready",
          error: "",
          coords,
        });

        const socket = socketRef.current;
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "location",
            roomCode: session.code,
            name: session.name,
            ...coords,
          }));
        }
      },
      () => {
        setGeoState({
          status: "error",
          error: "Location permission is required to show the exact dot position.",
          coords: null,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [session.code, session.name]);

  useEffect(() => {
    let socketUrl = import.meta.env.VITE_ROOM_SERVER_URL;
    
    if (!socketUrl) {
      if (import.meta.env.DEV) {
        socketUrl = `ws://${window.location.hostname}:3001`;
      } else {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        socketUrl = `${protocol}://${window.location.host}`;
      }
    }
    
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setConnectionState("connected");
      socket.send(JSON.stringify({
        type: "join",
        roomCode: session.code,
        name: session.name,
      }));
    });

    socket.addEventListener("message", (event) => {
      let message;

      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      if (message.type === "connected") {
        setClientId(message.clientId || "");
        return;
      }

      if (message.type === "joined") {
        setClientId(message.clientId || "");
        setParticipants(Array.isArray(message.participants) ? message.participants : []);
        if (latestLocationRef.current) {
          socket.send(JSON.stringify({
            type: "location",
            roomCode: session.code,
            name: session.name,
            ...latestLocationRef.current,
          }));
        }
        return;
      }

      if (message.type === "room-state") {
        setParticipants(Array.isArray(message.participants) ? message.participants : []);
        return;
      }

      if (message.type === "emoji") {
        setPingedEmojis(prev => ({ ...prev, [message.clientId]: message.emoji }));
        setTimeout(() => {
          setPingedEmojis(prev => {
            const next = { ...prev };
            if (next[message.clientId] === message.emoji) {
              delete next[message.clientId];
            }
            return next;
          });
        }, 3000);
        return;
      }

      if (message.type === "error") {
        setConnectionState("error");
      }
    });

    socket.addEventListener("close", () => {
      setConnectionState("disconnected");
    });

    socket.addEventListener("error", () => {
      setConnectionState("error");
    });

    return () => {
      try {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "leave",
            roomCode: session.code,
          }));
        }
      } catch {
        // Ignore close-time errors.
      }

      socket.close();
      socketRef.current = null;
    };
  }, [session.code, session.name]);

  useEffect(() => {
    if (session?.name && session?.code) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }, [session]);

  const selfParticipant = {
    id: clientId || "self",
    name: session.name || "You",
    latitude: geoState.coords?.latitude ?? null,
    longitude: geoState.coords?.longitude ?? null,
    accuracy: geoState.coords?.accuracy ?? null,
  };

  const activeParticipantList = useMemo(() => {
    const remoteParticipants = participants.filter((participant) => participant.id !== clientId);
    const selfInRoom = participants.find((participant) => participant.id === clientId);

    if (selfInRoom) {
      return participants;
    }

    return [selfParticipant, ...remoteParticipants].filter((participant) => participant.latitude !== null && participant.longitude !== null || participant.id === selfParticipant.id);
  }, [clientId, participants, selfParticipant]);

  useEffect(() => {
    if (!activeParticipantList.some((participant) => participant.id === activeParticipantId)) {
      setActiveParticipantId(activeParticipantList[0]?.id || "self");
    }
  }, [activeParticipantId, activeParticipantList]);

  const mapCenter = useMemo(() => {
    const coords = activeParticipantList.filter((participant) => participant.latitude !== null && participant.longitude !== null);
    if (!coords.length) {
      return null;
    }

    const totals = coords.reduce((accumulator, participant) => ({
      latitude: accumulator.latitude + participant.latitude,
      longitude: accumulator.longitude + participant.longitude,
    }), { latitude: 0, longitude: 0 });

    return {
      latitude: totals.latitude / coords.length,
      longitude: totals.longitude / coords.length,
    };
  }, [activeParticipantList]);

  const getParticipantPosition = (participant, index) => {
    if (participant.latitude === null || participant.longitude === null) {
      // If no location, fallback to London coords or map center with wide offset
      const baseLat = mapCenter ? mapCenter.latitude : 51.505;
      const baseLng = mapCenter ? mapCenter.longitude : -0.09;
      return [baseLat + (index * 0.01), baseLng + (index * 0.01)];
    }

    // Tiny jitter (~5 meters) to prevent exact overlaps when testing from same device
    const jitterLat = (index % 5) * 0.00005 - 0.0001;
    const jitterLng = Math.floor(index / 5) * 0.00005 - 0.00005;

    return [participant.latitude + jitterLat, participant.longitude + jitterLng];
  };

  const createCustomIcon = (color, name, isSelf, emoji) => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        ${emoji ? `<div style="position: absolute; top: -65px; left: 50%; transform: translateX(-50%); font-size: 1.5rem; background: white; padding: 0.2rem 0.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 10;">${emoji}</div>` : ''}
        <div style="position: relative; width: 46px; height: 46px; border-radius: 50%; background: rgba(255,255,255,0.8); display: grid; place-items: center; box-shadow: 0 12px 24px rgba(20, 33, 43, 0.16); border: 2px solid ${color};">
          <span style="position: absolute; inset: -12px; border-radius: 50%; opacity: 0.8; animation: pulse 1.8s ease-in-out infinite; background: ${color}33"></span>
          <span style="width: 16px; height: 16px; border-radius: 50%; position: relative; z-index: 2; background: ${color}"></span>
        </div>
        <div style="position: absolute; top: -34px; left: 50%; transform: translateX(-50%); padding: 0.3rem 0.65rem; border: 1px solid ${color}33; border-radius: 999px; background: rgba(255,255,255,0.9); font-size: 0.75rem; font-weight: 700; white-space: nowrap; color: #14212b;">
          ${name || (isSelf ? "You" : "Guest")}
        </div>
      `,
      iconSize: [46, 46],
      iconAnchor: [23, 23],
    });
  };

  const colors = ["#2563eb", "#f97316", "#0f766e", "#7c3aed", "#b45309"];

  const selectedParticipant = activeParticipantList.find((participant) => participant.id === activeParticipantId) || activeParticipantList[0] || selfParticipant;

  const sendEmoji = (emoji) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "emoji", emoji }));
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/code?room=${session.code}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopyLinkText("Copied!");
      setTimeout(() => setCopyLinkText("Copy invite link"), 2000);
    });
  };

  const distanceKm = getDistanceFromLatLonInKm(
    selfParticipant.latitude,
    selfParticipant.longitude,
    selectedParticipant.latitude,
    selectedParticipant.longitude
  );

  let distanceString = "Waiting...";
  if (selectedParticipant.id === selfParticipant.id) {
    distanceString = "0 m";
  } else if (distanceKm !== null) {
    if (distanceKm < 1) {
      distanceString = `${Math.round(distanceKm * 1000)} m`;
    } else {
      distanceString = `${distanceKm.toFixed(2)} km`;
    }
  }

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap');

        @keyframes pulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
      }

        * { box-sizing: border-box; }
      `}</style>

      <div style={styles.shell}>
        <div style={styles.topBar}>
          <Link to="/" style={styles.backLink}>← Back home</Link>
          <div style={styles.roomMeta}>
            <span>Room</span>
            <strong>{session.code}</strong>
          </div>
        </div>

        <div style={styles.header}>
          <p style={styles.kicker}>Live map room</p>
          <h1 style={styles.title}>Hi {session.name || "there"}. Your dot is live.</h1>
          <p style={styles.description}>
            The blue dot uses your browser&apos;s live geolocation. Other users in the same room code will appear as they connect.
          </p>
        </div>

        <div style={styles.layout}>
          <div style={styles.mapCard}>
            <div style={styles.mapHeader}>
              <div>
                <div style={styles.mapLabel}>Shared map</div>
                <div style={styles.mapSubLabel}>Room {session.code}</div>
              </div>
              <div style={styles.legend}>
                {activeParticipantList.map((participant, index) => (
                  <div style={styles.legendItem} key={participant.id}>
                    <span style={{ ...styles.legendDot, background: colors[index % colors.length] }} />
                    <span>{participant.name || (participant.id === clientId ? "You" : "Guest")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{...styles.mapCanvas, padding: 0}}>
              <MapContainer 
                center={mapCenter ? [mapCenter.latitude, mapCenter.longitude] : [51.505, -0.09]} 
                zoom={14} 
                style={{ height: '100%', width: '100%', minHeight: '560px', zIndex: 1 }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapRecenter center={mapCenter} />
                
                {activeParticipantList.map((participant, index) => {
                  const isSelf = participant.id === clientId || participant.id === "self";
                  const dotColor = colors[index % colors.length];
                  const position = getParticipantPosition(participant, index);

                  return (
                    <Marker 
                      key={participant.id} 
                      position={position}
                      icon={createCustomIcon(dotColor, participant.name, isSelf, pingedEmojis[participant.id])}
                      zIndexOffset={activeParticipantId === participant.id ? 1000 : 0}
                      eventHandlers={{
                        click: () => setActiveParticipantId(participant.id)
                      }}
                    />
                  );
                })}
              </MapContainer>

              <div style={{...styles.mapCorner, zIndex: 2}}>
                <div style={styles.cornerTitle}>Legend</div>
                {activeParticipantList.map((participant, index) => (
                  <div style={styles.cornerRow} key={participant.id}>
                    <span style={{ ...styles.cornerDot, background: colors[index % colors.length] }} />
                    {participant.name || (participant.id === clientId ? "You" : "Guest")}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside style={styles.sideCard}>
            <div>
              <div style={styles.sideLabel}>Selected dot</div>
              <h2 style={styles.sideTitle}>{selectedParticipant.name || "Guest"}</h2>
              <p style={styles.sideText}>
                {selectedParticipant.id === clientId ? "Your live location." : "Live location shared by the room."}
              </p>
            </div>

            <div style={styles.locationBox}>
              <div style={styles.locationRow}><span>Latitude</span><strong>{selectedParticipant.latitude !== null ? selectedParticipant.latitude.toFixed(6) : "Waiting..."}</strong></div>
              <div style={styles.locationRow}><span>Longitude</span><strong>{selectedParticipant.longitude !== null ? selectedParticipant.longitude.toFixed(6) : "Waiting..."}</strong></div>
              <div style={styles.locationRow}><span>Accuracy</span><strong>{selectedParticipant.id === clientId && geoState.coords?.accuracy ? `${Math.round(geoState.coords.accuracy)} m` : "Shared"}</strong></div>
              <div style={styles.locationRow}><span>Distance from you</span><strong>{distanceString}</strong></div>
              <div style={styles.locationRow}><span>Google Maps</span><strong>{selectedParticipant.latitude !== null ? "Live link" : "Unavailable"}</strong></div>
            </div>

            <a
              href={selectedParticipant.latitude !== null && selectedParticipant.longitude !== null ? `https://www.google.com/maps?q=${selectedParticipant.latitude},${selectedParticipant.longitude}` : "https://www.google.com/maps"}
              target="_blank"
              rel="noreferrer"
              style={styles.mapLink}
            >
              Open exact location in Google Maps
            </a>

            {selectedParticipant.id === clientId && geoState.error ? <p style={styles.errorText}>{geoState.error}</p> : null}
            {selectedParticipant.id === clientId && geoState.status === "loading" ? <p style={styles.errorText}>Getting your exact location now...</p> : null}
            <p style={styles.statusText}>Connection: {connectionState}. Participants: {activeParticipantList.length}</p>

            <div style={styles.emojiBar}>
              <button type="button" onClick={() => sendEmoji("👍")} style={styles.emojiButton} title="Okay!">👍</button>
              <button type="button" onClick={() => sendEmoji("🏃‍♂️")} style={styles.emojiButton} title="On my way!">🏃‍♂️</button>
              <button type="button" onClick={() => sendEmoji("📍")} style={styles.emojiButton} title="I'm here!">📍</button>
              <button type="button" onClick={() => sendEmoji("⏳")} style={styles.emojiButton} title="Waiting!">⏳</button>
            </div>

            <div style={styles.footerActions}>
              <button type="button" onClick={handleCopyLink} style={{...styles.secondaryButton, background: "#1e293b", color: "white", borderColor: "#1e293b"}}>
                {copyLinkText}
              </button>
              <button type="button" onClick={() => navigate("/code")} style={styles.secondaryButton}>
                Join another room
              </button>
              <Link to="/" style={styles.secondaryLink}>
                Leave room
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5efe4",
  },
  shell: {
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "1.5rem",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    marginBottom: "2rem",
  },
  backLink: {
    color: "#c2410c",
    textDecoration: "none",
    fontWeight: 600,
  },
  roomMeta: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    border: "1px solid rgba(20, 33, 43, 0.08)",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.7)",
  },
  header: {
    marginBottom: "1.5rem",
  },
  kicker: {
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    fontSize: "0.75rem",
    color: "#c2410c",
    fontWeight: 700,
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "clamp(2rem, 4vw, 3.4rem)",
    lineHeight: 1.05,
    margin: "0.6rem 0 0.75rem",
  },
  description: {
    margin: 0,
    maxWidth: "620px",
    color: "#64748b",
    fontSize: "1rem",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.6fr) minmax(300px, 0.7fr)",
    gap: "1rem",
    alignItems: "start",
  },
  mapCard: {
    border: "1px solid rgba(20, 33, 43, 0.08)",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.72)",
    padding: "1rem",
    boxShadow: "0 20px 50px rgba(20,33,43,0.08)",
  },
  mapHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  mapLabel: {
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  mapSubLabel: {
    fontSize: "0.9rem",
    color: "#64748b",
    marginTop: "0.25rem",
  },
  legend: {
    display: "flex",
    gap: "0.85rem",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.85rem",
    color: "#14212b",
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
  },
  mapCanvas: {
    position: "relative",
    minHeight: "560px",
    borderRadius: "16px",
    overflow: "hidden",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1)), radial-gradient(circle at 20% 20%, rgba(37,99,235,0.08), transparent 30%), radial-gradient(circle at 75% 65%, rgba(249,115,22,0.08), transparent 30%), #e8dfcf",
    border: "1px solid rgba(20, 33, 43, 0.08)",
  },
  mapGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(20, 33, 43, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 33, 43, 0.06) 1px, transparent 1px)",
    backgroundSize: "64px 64px",
    pointerEvents: "none",
    opacity: 0.7,
  },
  dotWrap: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
  },
  dotButton: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    border: "2px solid transparent",
    background: "rgba(255,255,255,0.8)",
    display: "grid",
    placeItems: "center",
    position: "relative",
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(20, 33, 43, 0.16)",
  },
  dotPulse: {
    position: "absolute",
    inset: "-12px",
    borderRadius: "50%",
    opacity: 0.8,
    animation: "pulse 1.8s ease-in-out infinite",
  },
  dotCore: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    position: "relative",
    zIndex: 2,
  },
  dotLabel: {
    position: "absolute",
    top: "-34px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "0.3rem 0.65rem",
    border: "1px solid",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.9)",
    fontSize: "0.75rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  mapCorner: {
    position: "absolute",
    right: "1rem",
    top: "1rem",
    padding: "0.85rem 1rem",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(20, 33, 43, 0.08)",
    borderRadius: "14px",
    backdropFilter: "blur(10px)",
  },
  cornerTitle: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 700,
    marginBottom: "0.6rem",
  },
  cornerRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.85rem",
    color: "#14212b",
  },
  cornerDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
  },
  sideCard: {
    border: "1px solid rgba(20, 33, 43, 0.08)",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.72)",
    padding: "1.25rem",
    boxShadow: "0 20px 50px rgba(20,33,43,0.08)",
    display: "grid",
    gap: "1rem",
  },
  sideLabel: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "#c2410c",
    fontWeight: 700,
  },
  sideTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.6rem",
    margin: "0.35rem 0 0.5rem",
  },
  sideText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
  },
  locationBox: {
    display: "grid",
    gap: "0.75rem",
    padding: "1rem",
    border: "1px solid rgba(20, 33, 43, 0.08)",
    borderRadius: "16px",
    background: "rgba(245,239,228,0.7)",
  },
  locationRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    fontSize: "0.9rem",
  },
  mapLink: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0.95rem 1rem",
    borderRadius: "12px",
    background: "#16202b",
    color: "#f6efe4",
    textDecoration: "none",
    fontWeight: 700,
    textAlign: "center",
  },
  errorText: {
    margin: 0,
    color: "#b91c1c",
    fontSize: "0.9rem",
  },
  statusText: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.85rem",
  },
  emojiBar: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "space-between",
    padding: "0.5rem 0",
  },
  emojiButton: {
    fontSize: "1.25rem",
    padding: "0.5rem",
    background: "white",
    border: "1px solid rgba(20, 33, 43, 0.08)",
    borderRadius: "12px",
    cursor: "pointer",
    flex: 1,
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    transition: "transform 0.1s",
  },
  footerActions: {
    display: "grid",
    gap: "0.75rem",
  },
  secondaryButton: {
    padding: "0.9rem 1rem",
    borderRadius: "12px",
    border: "1px solid rgba(20, 33, 43, 0.08)",
    background: "white",
    cursor: "pointer",
    fontWeight: 700,
    color: "#14212b",
  },
  secondaryLink: {
    textAlign: "center",
    color: "#c2410c",
    textDecoration: "none",
    fontWeight: 700,
  },
};
