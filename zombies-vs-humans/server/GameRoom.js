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
    
    // Game timer - 5 minutes (300 seconds)
    this.timeRemaining = 300;
  }
}

// Define types for GameState properties
type({ map: PlayerSchema })(GameState.prototype, "players");
type("number")(GameState.prototype, "timeRemaining");

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
    
    // Timer interval reference
    this.timerInterval = null;
    
    // Register message handlers for specific message types
    this.onMessage("move", this.handleMoveMessage.bind(this));
    
    // Set up physics simulation (collision detection) with interval
    this.setSimulationInterval(() => this.checkCollisions(), 50);
    
    // Log room creation with any options
    console.log("Room created with options:", options);
  }

  /**
   * Starts the game timer that counts down from 5 minutes
   */
  startGameTimer() {
    // Only start the timer if it's not already running
    if (this.timerInterval) return;
    
    console.log("Starting game timer! 5 minutes on the clock.");
    
    // Set interval to decrease timer every second
    this.timerInterval = setInterval(() => {
      // Decrease time remaining
      this.state.timeRemaining--;
      
      // Log current time every 5 seconds
      if (this.state.timeRemaining % 5 === 0 || this.state.timeRemaining <= 10) {
        console.log(`Time remaining: ${this.state.timeRemaining} seconds`);
      }
      
      // When time runs out, stop the timer
      if (this.state.timeRemaining <= 0) {
        console.log("Time's up!");
        clearInterval(this.timerInterval);
      }
    }, 1000);
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
    
    // For testing step 9, assign the first player as human and others as zombies
    // Count current players to determine team
    const playerCount = this.state.players.size;
    player.team = playerCount === 0 ? "human" : "zombie";
    
    // Assign random starting positions based on team
    // Humans start on the right side (positive X), zombies on the left (negative X)
    if (player.team === "human") {
      // Humans: Random position on right half of map
      player.x = Math.random() * 4 + 1; // Range: 1 to 5
      player.z = Math.random() * 8 - 4; // Range: -4 to 4
    } else {
      // Zombies: Random position on left half of map
      player.x = Math.random() * -4 - 1; // Range: -5 to -1
      player.z = Math.random() * 8 - 4; // Range: -4 to 4
    }
    
    // Add the player to the game state
    this.state.players.set(client.sessionId, player);
    
    console.log(`Player ${player.id} added to the game as ${player.team} at position (${player.x.toFixed(2)}, ${player.z.toFixed(2)})`);
    
    // Start the timer if we now have at least 2 players and timer isn't running yet
    if (this.state.players.size >= 2 && !this.timerInterval) {
      this.startGameTimer();
    }
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
    
    // If no players left, stop the timer
    if (this.state.players.size === 0 && this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      console.log("Game timer stopped - no players remaining");
      
      // Reset the timer for a new game
      this.state.timeRemaining = 300;
    }
  }

  /**
   * Handler for move messages
   * 
   * @param {object} client - The client that sent the message
   * @param {object} data - The position data {x, z}
   */
  handleMoveMessage(client, data) {
    // Get the player from the state
    const player = this.state.players.get(client.sessionId);
    
    // If player exists, update position
    if (player) {
      // Update player position
      player.x = data.x;
      player.z = data.z;
      
      console.log(`Player ${player.id} moved to (${player.x}, ${player.z})`);
      
      // Check for collisions immediately when a player moves
      this.checkCollisions();
    }
  }

  /**
   * Calculate the distance between two players
   * 
   * @param {PlayerSchema} player1 - First player
   * @param {PlayerSchema} player2 - Second player
   * @returns {number} Distance between the players
   */
  calculateDistance(player1, player2) {
    const dx = player1.x - player2.x;
    const dz = player1.z - player2.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  /**
   * Check for collisions between zombies and humans
   * If a zombie collides with a human (distance < 1 unit), turn the human into a zombie
   */
  checkCollisions() {
    const { players } = this.state;
    
    // Skip if we have less than 2 players
    if (players.size < 2) return;
    
    // Find all zombies and humans
    const zombies = [];
    const humans = [];
    
    players.forEach((player) => {
      if (player.team === 'zombie') {
        zombies.push(player);
      } else if (player.team === 'human') {
        humans.push(player);
      }
    });
    
    // If no humans or no zombies, skip collision check
    if (humans.length === 0 || zombies.length === 0) return;
    
    // Check for collisions between zombies and humans
    for (const zombie of zombies) {
      for (const human of humans) {
        const distance = this.calculateDistance(zombie, human);
        
        // If distance is less than 1 unit, collision occurred
        if (distance < 1) {
          console.log(`Collision detected! Zombie ${zombie.id} infected Human ${human.id}`);
          
          // Turn human into zombie
          human.team = 'zombie';
          
          // Add to zombies array for further collision checks in this frame
          zombies.push(human);
          
          // Remove from humans array
          const index = humans.indexOf(human);
          if (index !== -1) {
            humans.splice(index, 1);
          }
        }
      }
    }
    
    // Check if all players are zombies (game over condition for Step 13)
    if (humans.length === 0 && players.size > 0) {
      console.log("All players are now zombies!");
    }
  }
}

module.exports = GameRoom; 