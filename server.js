import { createServer } from "http";
import crypto from "crypto";
import { WebSocketServer } from "ws";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || process.env.ROOM_SERVER_PORT || 3001);
const rooms = new Map();

function getRoom(roomCode) {
  if (!rooms.has(roomCode)) {
    rooms.set(roomCode, new Map());
  }

  return rooms.get(roomCode);
}

function snapshotRoom(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) {
    return [];
  }

  return Array.from(room.values()).map((participant) => ({
    id: participant.id,
    name: participant.name,
    latitude: participant.latitude,
    longitude: participant.longitude,
    accuracy: participant.accuracy,
    updatedAt: participant.updatedAt,
  }));
}

function broadcastRoom(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) {
    return;
  }

  const message = JSON.stringify({
    type: "room-state",
    roomCode,
    participants: snapshotRoom(roomCode),
  });

  for (const participant of room.values()) {
    if (participant.socket.readyState === 1) {
      participant.socket.send(message);
    }
  }
}

function send(socket, payload) {
  if (socket.readyState === 1) {
    socket.send(JSON.stringify(payload));
  }
}

const app = express();

app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  socket.id = crypto.randomUUID();
  socket.roomCode = null;
  socket.participantId = socket.id;

  send(socket, {
    type: "connected",
    clientId: socket.id,
  });

  socket.on("message", (raw) => {
    let message;

    try {
      message = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (message.type === "join") {
      const roomCode = String(message.roomCode || "").trim().toUpperCase();
      const name = String(message.name || "Guest").trim() || "Guest";

      if (!roomCode) {
        send(socket, { type: "error", message: "Room code is required" });
        return;
      }

      if (socket.roomCode && socket.roomCode !== roomCode) {
        const previousRoom = rooms.get(socket.roomCode);
        if (previousRoom) {
          previousRoom.delete(socket.id);
          broadcastRoom(socket.roomCode);
          if (previousRoom.size === 0) {
            rooms.delete(socket.roomCode);
          }
        }
      }

      socket.roomCode = roomCode;
      socket.participantId = socket.id;

      const room = getRoom(roomCode);
      if (!room.has(socket.id)) {
        room.set(socket.id, {
          id: socket.id,
          name,
          latitude: null,
          longitude: null,
          accuracy: null,
          updatedAt: Date.now(),
          socket,
        });
      } else {
        const existing = room.get(socket.id);
        existing.name = name;
        existing.socket = socket;
      }

      send(socket, {
        type: "joined",
        clientId: socket.id,
        roomCode,
        participants: snapshotRoom(roomCode),
      });

      broadcastRoom(roomCode);
      return;
    }

    if (message.type === "location") {
      const roomCode = String(message.roomCode || socket.roomCode || "").trim().toUpperCase();
      if (!roomCode) {
        return;
      }

      const room = rooms.get(roomCode);
      if (!room || !room.has(socket.id)) {
        return;
      }

      const participant = room.get(socket.id);
      participant.latitude = Number(message.latitude);
      participant.longitude = Number(message.longitude);
      participant.accuracy = Number(message.accuracy) || null;
      participant.updatedAt = Date.now();
      participant.name = String(message.name || participant.name || "Guest").trim() || "Guest";
      participant.socket = socket;

      broadcastRoom(roomCode);
      return;
    }

    if (message.type === "leave") {
      const roomCode = String(message.roomCode || socket.roomCode || "").trim().toUpperCase();
      if (!roomCode) {
        return;
      }

      const room = rooms.get(roomCode);
      if (room && room.has(socket.id)) {
        room.delete(socket.id);
        broadcastRoom(roomCode);
        if (room.size === 0) {
          rooms.delete(roomCode);
        }
      }

      socket.roomCode = null;
    }
  });

  socket.on("close", () => {
    const roomCode = socket.roomCode;
    if (!roomCode) {
      return;
    }

    const room = rooms.get(roomCode);
    if (room && room.has(socket.id)) {
      room.delete(socket.id);
      broadcastRoom(roomCode);
      if (room.size === 0) {
        rooms.delete(roomCode);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Room server running on ws://localhost:${PORT}`);
});
