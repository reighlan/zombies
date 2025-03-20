const express = require('express');
const http = require('http');
const { Server } = require('colyseus');
const { Room } = require('colyseus');

// Create an empty Game Room class
class GameRoom extends Room {
  onCreate(options) {
    console.log("GameRoom created!", options);
  }

  onJoin(client, options) {
    console.log("client joined!", client.sessionId);
  }

  onLeave(client, consented) {
    console.log("client left!", client.sessionId);
  }

  onMessage(client, message) {
    console.log("message received:", client.sessionId, message);
  }
}

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Create Colyseus server
const gameServer = new Server({
  server: server
});

// Register GameRoom
gameServer.define("game_room", GameRoom);

// Start server
const PORT = 2567;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle basic routes
app.get('/', (req, res) => {
  res.send('Zombies vs Humans Game Server');
}); 