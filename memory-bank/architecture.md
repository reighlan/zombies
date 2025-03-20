# Zombies vs Humans - Architecture Overview

## Project Structure

The application follows a modular architecture with clear separation of concerns:

```
zombies-vs-humans/
├── client/            # Frontend code (ThreeJS)
├── server/            # Backend code (Node.js, Colyseus)
│   └── index.js       # Main server entry point
├── shared/            # Shared schemas and utilities
│   └── PlayerSchema.js # Player data schema
└── package.json       # Project dependencies and scripts
```

## Directory Purposes

### `client/`
Contains all frontend-related code:
- ThreeJS for 3D rendering
- Player controls and input handling
- Game state visualization
- UI elements and game screens
- Asset loading and management

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
- Defines the GameRoom class with event handlers (onCreate, onJoin, onLeave, onMessage)
- Registers the game room with Colyseus
- Configures static file serving
- Starts the server on port 2567

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

This architecture supports the multiplayer nature of the game while maintaining clean code organization and efficient networking.
