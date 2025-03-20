/**
 * main.js - Main entry point for the Zombies vs Humans game client
 * 
 * This file handles the ThreeJS setup and rendering, creating the 3D scene
 * that will be used for the game. It initializes the scene, camera, renderer,
 * and basic ground plane.
 */

// Import Three.js from the CDN since we're not using a bundler
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.js';

// Global variables
let scene, camera, renderer;
let groundPlane;

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
  renderer.render(scene, camera);
}

/**
 * Initialize the game scene and start the render loop
 */
function init() {
  console.log('Initializing ThreeJS scene...');
  
  // Set up the scene, camera, and renderer
  initScene();
  
  // Create the ground plane
  createGround();
  
  // Set up event handlers
  handleResize();
  
  // Start the animation loop
  animate();
  
  console.log('ThreeJS scene initialized successfully');
}

// Start the initialization when the page loads
window.addEventListener('load', init); 