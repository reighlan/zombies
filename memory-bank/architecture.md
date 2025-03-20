# Zombies vs Humans - Architecture Overview

## Project Structure

The application follows a modular architecture with clear separation of concerns:

```
zombies-vs-humans/
├── client/                 # Frontend code (ThreeJS)
│   ├── index.html          # Main game HTML with canvas element
│   ├── main.js             # Main game JavaScript with ThreeJS setup
│   └── test-client.html    # Test client for debugging Colyseus connections
├── server/                 # Backend code (Node.js, Colyseus)
│   ├── index.js            # Main server entry point
│   └── GameRoom.js         # Game room implementation with player management
├── shared/                 # Shared schemas and utilities
│   └── PlayerSchema.js     # Player data schema
└── package.json            # Project dependencies and scripts
```

## Directory Purposes

### `client/`
Contains all frontend-related code:
- ThreeJS for 3D rendering
- Player controls and input handling
- Game state visualization
- UI elements and game screens
- Asset loading and management

#### `client/index.html`
Main game HTML file that:
- Provides a canvas element for ThreeJS rendering
- Loads the main.js script for game logic
- Sets up viewport and basic styling

#### `client/main.js`
Main game JavaScript file that:
- Sets up the ThreeJS scene, camera, and renderer
- Handles game rendering and animation
- Will implement game logic and player interactions

#### `client/test-client.html`
A debugging interface that:
- Provides a UI for testing Colyseus server connections
- Displays connected players and room information
- Allows manual connection/disconnection for testing

### `server/`
Contains all backend-related code:
- Colyseus server setup
- Game room management
- Authoritative game state
- Physics calculations
- Win condition checking

#### `server/index.js`
Main server entry point that:
- Sets up Express for HTTP handling
- Creates and configures the Colyseus server
- Imports and registers the GameRoom class
- Configures static file serving
- Starts the server on port 2567

#### `server/GameRoom.js`
Implements the core multiplayer game room that:
- Defines a GameState schema for synchronized state
- Manages player connections and disconnections
- Tracks players in a MapSchema for efficient updates
- Provides handlers for all room events (create, join, leave, message)
- Will contain game logic for player movement and team changes

### `shared/`
Contains code shared between client and server:
- Schema definitions for state synchronization
- Constants and configuration
- Utility functions for common operations

#### `shared/PlayerSchema.js`
Defines the data structure for player entities:
- Uses Colyseus Schema system for efficient state synchronization
- Contains player position (x, z), team affiliation, and unique identifier
- Provides type definitions for each property to ensure data integrity
- Acts as the contract between server and client for player data representation

## Design Principles

1. **Modularity**: Code is organized into focused modules with specific responsibilities.
2. **Server Authority**: Game state is managed authoritatively on the server to prevent cheating.
3. **Efficient Synchronization**: Only changes to game state are transmitted to minimize bandwidth usage.
4. **Clean Separation**: Frontend and backend concerns are strictly separated to improve maintainability.
5. **Schema-Based State**: Using Colyseus schema system ensures efficient serialization and type safety.

This architecture supports the multiplayer nature of the game while maintaining clean code organization and efficient networking.
