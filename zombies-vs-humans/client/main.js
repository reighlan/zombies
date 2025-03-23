/**
 * main.js - Main entry point for the Zombies vs Humans game client
 * 
 * This file handles the ThreeJS setup and rendering, creating the 3D scene
 * that will be used for the game. It initializes the scene, camera, renderer,
 * and basic ground plane. It also connects to the Colyseus server for multiplayer
 * functionality.
 */

// Import Three.js from the CDN since we're not using a bundler
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.js';

// Global variables
let scene, camera, renderer;
let groundPlane;

// Colyseus client variables
/** @type {import('colyseus.js').Client} */
let client;
/** @type {import('colyseus.js').Room} */
let room;

// Player objects map - stores ThreeJS objects for each player
/** @type {Map<string, THREE.Mesh>} */
const playerMeshes = new Map();

// Movement variables
const keys = {
  w: false,
  a: false,
  s: false,
  d: false
};
const MOVEMENT_SPEED = 0.1; // Units per frame
let lastMovementUpdate = 0;
const MOVEMENT_UPDATE_RATE = 50; // Send updates every 50ms

// Debug element reference
const debugElement = document.getElementById('debug');

/**
 * Update the debug information display
 * @param {string} message - The message to display
 */
function updateDebug(message) {
  if (debugElement) {
    debugElement.textContent = message;
  }
  console.log(message);
}

/**
 * Initialize the ThreeJS scene, camera, and renderer
 */
function initScene() {
  // Create a new scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Light blue sky color
  
  // Create a perspective camera
  camera = new THREE.PerspectiveCamera(
    75,                                   // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1,                                  // Near clipping plane
    1000                                  // Far clipping plane
  );
  
  // Position the camera above and back from the origin
  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);
  
  // Create the WebGL renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('gameCanvas'),
    antialias: true
  });
  
  // Set renderer size to match the canvas
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
}

/**
 * Create the ground plane (10x10 units at y=0)
 */
function createGround() {
  // Create a 10x10 plane geometry
  const geometry = new THREE.PlaneGeometry(10, 10);
  
  // Create a green material for the ground
  const material = new THREE.MeshBasicMaterial({
    color: 0x7cfc00,   // Lawn green color
    side: THREE.DoubleSide
  });
  
  // Create the mesh and add it to the scene
  groundPlane = new THREE.Mesh(geometry, material);
  
  // Rotate the plane to be horizontal (it's vertical by default)
  groundPlane.rotation.x = Math.PI / 2;
  
  // Position at y=0 as specified
  groundPlane.position.y = 0;
  
  // Add the ground plane to the scene
  scene.add(groundPlane);
}

/**
 * Set up keyboard event listeners for player movement
 */
function setupMovementControls() {
  // Key down event
  window.addEventListener('keydown', (e) => {
    // Update key states
    if (e.key.toLowerCase() === 'w') keys.w = true;
    if (e.key.toLowerCase() === 'a') keys.a = true;
    if (e.key.toLowerCase() === 's') keys.s = true;
    if (e.key.toLowerCase() === 'd') keys.d = true;
  });
  
  // Key up event
  window.addEventListener('keyup', (e) => {
    // Update key states
    if (e.key.toLowerCase() === 'w') keys.w = false;
    if (e.key.toLowerCase() === 'a') keys.a = false;
    if (e.key.toLowerCase() === 's') keys.s = false;
    if (e.key.toLowerCase() === 'd') keys.d = false;
  });
}

/**
 * Update player position based on keyboard input
 */
function updatePlayerPosition() {
  if (!room || !room.state || !room.state.players) return;
  
  // Get the local player
  const localPlayer = room.state.players.get(room.sessionId);
  if (!localPlayer) return;
  
  // Calculate movement
  let moved = false;
  let dx = 0;
  let dz = 0;
  
  // Apply movement based on keys
  if (keys.w) {
    dz -= MOVEMENT_SPEED;
    moved = true;
  }
  if (keys.s) {
    dz += MOVEMENT_SPEED;
    moved = true;
  }
  if (keys.a) {
    dx -= MOVEMENT_SPEED;
    moved = true;
  }
  if (keys.d) {
    dx += MOVEMENT_SPEED;
    moved = true;
  }
  
  // If player moved, send update to server
  if (moved) {
    const now = Date.now();
    
    // Limit the update rate to avoid flooding the server
    if (now - lastMovementUpdate > MOVEMENT_UPDATE_RATE) {
      // Calculate new position
      const newX = localPlayer.x + dx;
      const newZ = localPlayer.z + dz;
      
      // Ensure the player stays within the ground plane bounds (10x10)
      const boundedX = Math.max(-5, Math.min(5, newX));
      const boundedZ = Math.max(-5, Math.min(5, newZ));
      
      // Send the position update to the server
      room.send('move', { x: boundedX, z: boundedZ });
      
      // Update timestamp
      lastMovementUpdate = now;
    }
  }
}

/**
 * Create or update a player mesh based on player state
 * @param {string} id - The player's unique ID
 * @param {Object} playerData - The player's state data
 */
function createOrUpdatePlayerMesh(id, playerData) {
  // Get the player mesh if it exists
  let playerMesh = playerMeshes.get(id);
  
  // If the player mesh doesn't exist, create it
  if (!playerMesh) {
    // Create a 1x1x1 cube geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // Create material based on team (human = green, zombie = red)
    const material = new THREE.MeshBasicMaterial({
      color: playerData.team === 'human' ? 0x00ff00 : 0xff0000
    });
    
    // Create the mesh
    playerMesh = new THREE.Mesh(geometry, material);
    
    // Add the mesh to the scene
    scene.add(playerMesh);
    
    // Store the mesh in the playerMeshes map
    playerMeshes.set(id, playerMesh);
    
    console.log(`Created ${playerData.team} cube for player ${id}`);
  } else {
    // Update the material color if the team changed
    const color = playerData.team === 'human' ? 0x00ff00 : 0xff0000;
    if (playerMesh.material.color.getHex() !== color) {
      playerMesh.material.color.setHex(color);
      console.log(`Updated player ${id} color to ${playerData.team}`);
    }
  }
  
  // Update the position from the player data
  // Note: We set y=0.5 to place the cube on top of the ground (cube is 1x1x1)
  playerMesh.position.set(playerData.x, 0.5, playerData.z);
}

/**
 * Remove a player mesh from the scene
 * @param {string} id - The player's unique ID
 */
function removePlayerMesh(id) {
  const playerMesh = playerMeshes.get(id);
  if (playerMesh) {
    // Remove from scene
    scene.remove(playerMesh);
    
    // Remove from map
    playerMeshes.delete(id);
    
    console.log(`Removed player ${id} mesh`);
  }
}

/**
 * Update all player meshes based on the current game state
 * @param {Object} state - The current game state
 */
function updatePlayerMeshes(state) {
  if (!state || !state.players) return;
  
  // Get all current player IDs
  const currentPlayerIds = new Set();
  
  // Update existing players and create new ones
  state.players.forEach((playerData, id) => {
    createOrUpdatePlayerMesh(id, playerData);
    currentPlayerIds.add(id);
  });
  
  // Remove any players that are no longer in the state
  playerMeshes.forEach((mesh, id) => {
    if (!currentPlayerIds.has(id)) {
      removePlayerMesh(id);
    }
  });
}

/**
 * Connect to the Colyseus server and join the game room
 * @returns {Promise<void>} A promise that resolves when connected
 */
async function connectToServer() {
  try {
    updateDebug("Connecting to Colyseus server...");
    
    // Ensure Colyseus is defined as a global object
    if (typeof window.Colyseus === 'undefined') {
      throw new Error('Colyseus library not loaded. Check your script tags.');
    }
    
    // Create a Colyseus client instance using the global Colyseus object
    client = new window.Colyseus.Client('ws://localhost:2567');
    
    // Join or create the game_room
    room = await client.joinOrCreate('game_room');
    console.log("Room:", room);
    
    // Log the player's session ID
    updateDebug(`Connected! Player ID: ${room.sessionId}`);
    
    // Set up room state change listener for future steps
    room.onStateChange((state) => {
      console.log("State updated:", state);
      
      // Update player meshes based on the new state
      updatePlayerMeshes(state);
      
      if (state.players) {
        const playerCount = state.players.size;
        updateDebug(`Connected as ${room.sessionId} | Players: ${playerCount}`);
        
        // Log details of all players
        state.players.forEach((player, key) => {
          console.log(`Player ${key}: Team=${player.team}, Position=(${player.x}, ${player.z})`);
        });
      }
    });
    
    // Handle room leave event
    room.onLeave((code) => {
      updateDebug(`Disconnected (Code: ${code})`);
    });
    
    // Handle room error event
    room.onError((code, message) => {
      updateDebug(`Error: ${message} (Code: ${code})`);
      console.error(`Room error: ${code} - ${message}`);
    });
    
    return room;
  } catch (error) {
    updateDebug(`Connection failed: ${error.message}`);
    console.error("Failed to connect to Colyseus server:", error);
    throw error;
  }
}

/**
 * Handle window resize events to maintain proper aspect ratio
 */
function handleResize() {
  window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/**
 * Animation loop for rendering the scene
 */
function animate() {
  requestAnimationFrame(animate);
  
  // Update player position based on keyboard input
  updatePlayerPosition();
  
  // Render the scene
  renderer.render(scene, camera);
}

/**
 * Initialize the game scene and start the render loop
 */
async function init() {
  console.log('Initializing ThreeJS scene...');
  
  // Set up the scene, camera, and renderer
  initScene();
  
  // Create the ground plane
  createGround();
  
  // Set up keyboard controls
  setupMovementControls();
  
  // Set up event handlers
  handleResize();
  
  // Start the animation loop
  animate();
  
  console.log('ThreeJS scene initialized successfully');
  
  // Connect to the Colyseus server
  try {
    await connectToServer();
  } catch (error) {
    console.error('Could not connect to multiplayer server:', error);
  }
}

// Start the initialization when the page loads
window.addEventListener('load', init); 