# Zombies vs Humans - Progress Log

## March 19, 2023

### Step 1: Project Structure Setup

- Created the main project directory `zombies-vs-humans`
- Set up subdirectories following the modular architecture principle:
  - `client/`: Will contain all frontend ThreeJS code and assets
  - `server/`: Will contain Colyseus server, game logic, and backend code
  - `shared/`: Will contain schema definitions and utilities shared between client and server
- Initialized a Node.js project in the root with `npm init -y`
- Generated package.json with default configuration

All tests passed for Step 1:
- Verified folder structure exists with client/, server/, and shared/ directories
- Confirmed package.json is present in the root directory

The setup enforces the modular architecture principle from Cursor Rule #1, keeping frontend and backend code properly separated while allowing shared schemas through the shared directory.

### Step 2: Install Core Dependencies

- Installed the following core dependencies:
  - `three`: ThreeJS library for 3D graphics rendering
  - `colyseus.js`: Client library for Colyseus multiplayer framework
  - `express`: Web server framework for Node.js
  - `colyseus`: Server-side multiplayer game framework
  - `cannon-es`: Physics engine for collision detection

All tests passed for Step 2:
- Verified all required packages were installed successfully
- Installed versions:
  - three@0.174.0
  - colyseus.js@0.16.11
  - colyseus@0.16.3
  - express@4.21.2
  - cannon-es@0.20.0

Note: There was a warning about Colyseus requiring Node.js 20.x while the current version is 18.17.1. This should be monitored if any compatibility issues arise.
