const { Room } = require("colyseus");
const { Schema, type, MapSchema } = require("@colyseus/schema");
const PlayerSchema = require("../shared/PlayerSchema");

/**
 * GameState - Schema for the game state that will be synchronized with clients
 */
class GameState extends Schema {
  constructor() {
    super();
    
    // Initialize an empty MapSchema for players
    this.players = new MapSchema();
    
    // Game status and timer will be implemented in future steps
  }
}

// Define types for GameState properties
type({ map: PlayerSchema })(GameState.prototype, "players");

/**
 * GameRoom - The main room handling multiplayer gameplay
 * 
 * This room implements the core game logic following Cursor Rule #2,
 * with explicit handlers for room events.
 */
class GameRoom extends Room {
  /**
   * Called when the room is created
   */
  onCreate(options) {
    console.log("GameRoom created!");
    
    // Set the room state
    this.setState(new GameState());
    
    // Log room creation with any options
    console.log("Room created with options:", options);
  }

  /**
   * Called when a client joins the room
   * 
   * @param {object} client - The client that joined
   * @param {object} options - Join options from the client
   */
  onJoin(client, options) {
    console.log(`Client ${client.sessionId} joined the room`);
    
    // Create a new player with default values
    const player = new PlayerSchema();
    player.id = client.sessionId;
    player.x = 0;
    player.z = 0;
    player.team = "human"; // Default team, will implement team balancing later
    
    // Add the player to the game state
    this.state.players.set(client.sessionId, player);
    
    console.log(`Player ${player.id} added to the game`);
  }

  /**
   * Called when a client leaves the room
   * 
   * @param {object} client - The client that left
   * @param {boolean} consented - Whether the client left voluntarily
   */
  onLeave(client, consented) {
    console.log(`Client ${client.sessionId} left the room`);
    
    // Remove the player from the game state
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);
      console.log(`Player ${client.sessionId} removed from the game`);
    }
  }

  /**
   * Called when a client sends a message to the room
   * 
   * @param {object} client - The client that sent the message
   * @param {object} message - The message data
   */
  onMessage(client, message) {
    console.log(`Message from ${client.sessionId}:`, message);
    
    // Message handling will be implemented in future steps
  }
}

module.exports = GameRoom; 