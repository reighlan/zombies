const { Schema, type } = require("@colyseus/schema");

/**
 * PlayerSchema - Defines the data structure for a player in the game
 * 
 * This schema is used for synchronizing player state between server and clients
 * using Colyseus' efficient data serialization system.
 */
class PlayerSchema extends Schema {
  constructor() {
    super();
    
    // Set default values
    this.x = 0;
    this.z = 0;
    this.team = "human"; // Default team
    this.id = "";
  }
}

// Define the types for each property
type("number")(PlayerSchema.prototype, "x");
type("number")(PlayerSchema.prototype, "z");
type("string")(PlayerSchema.prototype, "team");
type("string")(PlayerSchema.prototype, "id");

module.exports = PlayerSchema; 