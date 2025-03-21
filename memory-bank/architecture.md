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
- Uses ES6 modules for modern JavaScript imports

#### `client/main.js`
Main game JavaScript file that:
- Sets up the ThreeJS scene, camera, and renderer
- Creates a 3D environment with a ground plane
- Handles game rendering and animation loop
- Connects to the Colyseus multiplayer server
- Manages room connection and state synchronization
- Implements responsive design via window resize handling
- Uses modular function design with proper documentation
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

## Communication Flow

1. **Client Initialization**:
   - ThreeJS sets up the 3D scene and rendering
   - Colyseus client connects to the server via WebSocket
   - Client joins the game room and receives a unique session ID

2. **State Synchronization**:
   - Server maintains authoritative game state
   - Changes to game state are broadcast to all connected clients
   - Clients receive state updates and render accordingly
   - Only changed properties are transmitted to minimize bandwidth

3. **Player Interaction**:
   - Client captures player input
   - Input is sent to the server via Colyseus messages
   - Server validates input and updates game state
   - Updated state is synchronized to all clients

## Design Principles

1. **Modularity**: Code is organized into focused modules with specific responsibilities.
2. **Server Authority**: Game state is managed authoritatively on the server to prevent cheating.
3. **Efficient Synchronization**: Only changes to game state are transmitted to minimize bandwidth usage.
4. **Clean Separation**: Frontend and backend concerns are strictly separated to improve maintainability.
5. **Schema-Based State**: Using Colyseus schema system ensures efficient serialization and type safety.
6. **Documentation-First**: All code is thoroughly documented with JSDoc comments for clarity and maintainability.

This architecture supports the multiplayer nature of the game while maintaining clean code organization and efficient networking.
