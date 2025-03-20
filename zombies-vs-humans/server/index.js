const express = require('express');
const http = require('http');
const { Server } = require('colyseus');
const PlayerSchema = require('../shared/PlayerSchema');
const GameRoom = require('./GameRoom');

// Test PlayerSchema (for Step 4)
const testPlayer = new PlayerSchema();
testPlayer.id = "test";
testPlayer.x = 0;
testPlayer.z = 0;
testPlayer.team = "human";
console.log("PlayerSchema test:", testPlayer);

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create Colyseus server
const gameServer = new Server({
  server: server
});

// Register the GameRoom as "game_room"
gameServer.define("game_room", GameRoom);

// Static file serving middleware
app.use(express.static('client'));

// Define a port (use 2567 as specified)
const PORT = process.env.PORT || 2567;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle basic routes
app.get('/', (req, res) => {
  res.send('Zombies vs Humans Game Server');
}); 