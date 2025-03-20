**Zombies vs Humans \- Implementation Plan**

This plan outlines step-by-step instructions to build the base multiplayer game "Zombies vs Humans." Each step is small, specific, and includes a test to validate correct implementation. The focus is on core functionality: multiplayer setup, movement, team switching, and win conditions. Special items and advanced features will be added later.

**Prerequisites**

* Use the recommended tech stack: ThreeJS (frontend), Colyseus/Node.js (backend), MongoDB Atlas (database).  
* Follow Cursor Rules for modularity, networking, and server-side authority.

---

**Step 1: Set Up Project Structure**

* **Instruction**: Create a new project folder with subdirectories: client/ for frontend files, server/ for backend files, and shared/ for shared schemas or utilities.  
* **Details**: Use separate folders to enforce modularity per Cursor Rule \#1. Initialize a Node.js project in the root with npm init \-y.  
* **Test**: Verify the folder structure exists (client/, server/, shared/) and that package.json is present in the root directory.

---

**Step 2: Install Core Dependencies**

* **Instruction**: In the root directory, run npm install to add dependencies: three (ThreeJS), colyseus.js (Colyseus client), express, colyseus, and cannon-es (Cannon.js).  
* **Details**: These packages support 3D rendering, multiplayer networking, and server-side physics.  
* **Test**: Run npm list in the terminal and confirm all listed packages are installed without errors.

---

**Step 3: Set Up Basic Server with Colyseus**

* **Instruction**: In server/index.js, create a basic Node.js server with Colyseus that listens on port 2567 and defines an empty game room called "game\_room".  
* **Details**: Use Express.js to handle HTTP and Colyseus for WebSocket rooms, per Cursor Rule \#2.  
* **Test**: Run node server/index.js and ensure the server starts without crashing, logging "Server running on port 2567" to the console.

---

**Step 4: Define Player State Schema**

* **Instruction**: In shared/PlayerSchema.js, define a Colyseus schema with properties: x (number), z (number), team (string: "human" or "zombie"), and id (string).  
* **Details**: This schema will track player position and team for synchronization.  
* **Test**: Manually import and log the schema in server/index.js to confirm it has the expected properties (e.g., { x: 0, z: 0, team: "human", id: "test" }).

---

**Step 5: Create Game Room Logic**

* **Instruction**: In server/GameRoom.js, define a Colyseus room "game\_room" that initializes with an empty state and adds players to the state with onJoin using the PlayerSchema.  
* **Details**: Assign each player a unique id and default position (x: 0, z: 0). Use Cursor Rule \#2 for explicit handlers.  
* **Test**: Update server/index.js to use this room, start the server, and connect two browser tabs using the Colyseus client (manually via console). Check the server logs to see two players added with unique IDs.

---

**Step 6: Set Up Basic Client HTML**

* **Instruction**: In client/index.html, create an HTML file with a \<canvas\> element (id: "gameCanvas") and a \<script\> tag to load client/main.js.  
* **Details**: This will host the ThreeJS game.  
* **Test**: Open client/index.html in a browser and confirm the canvas appears without errors in the console.

---

**Step 7: Initialize ThreeJS Scene**

* **Instruction**: In client/main.js, set up a ThreeJS scene with a camera, renderer (tied to "gameCanvas"), and a basic plane (10x10 units) as the ground.  
* **Details**: Use simple blocky graphics per the GDD, with the plane at y: 0.  
* **Test**: Load client/index.html in a browser and verify a flat plane renders on the screen without errors.

---

**Step 8: Connect Client to Server**

* **Instruction**: In client/main.js, add Colyseus client logic to connect to "game\_room" on ws://localhost:2567 and log the assigned player ID on join.  
* **Details**: Use the Colyseus client library for WebSocket connection.  
* **Test**: Start the server, open client/index.html in a browser, and check the console for a unique player ID logged after connecting.

---

**Step 9: Render Players as Cubes**

* **Instruction**: In client/main.js, listen for Colyseus state updates and render each player as a 1x1x1 cube (humans red, zombies green) at their x, z coordinates.  
* **Details**: Use ThreeJS to create cubes based on the PlayerSchema state, per Cursor Rule \#5.  
* **Test**: Connect two browser tabs to the server. Verify one tab shows a red cube and the other a green cube at (0, 0\) on the plane.

---

**Step 10: Implement Basic Movement**

* **Instruction**: In client/main.js, add keyboard controls (WASD) to update the local player's x and z positions and send them to the server via Colyseus send.  
* **Details**: Send updates on key press/release; the server broadcasts them to all clients.  
* **Test**: Move a player in one tab (e.g., press W) and confirm the cube moves in both tabs, maintaining synchronized positions.

---

**Step 11: Add Server-Side Physics Check**

* **Instruction**: In server/GameRoom.js, use Cannon.js to check player collisions (distance \< 1 unit) and update team state when a zombie "taps" a human.  
* **Details**: If a zombie collides with a human, change the human's team to "zombie", per Cursor Rule \#3.  
* **Test**: Move a zombie cube near a human cube in two tabs. Confirm the human cube turns green (zombie) in both tabs after contact.

---

**Step 12: Implement Game Timer**

* **Instruction**: In server/GameRoom.js, add a 5-minute (300-second) countdown that starts when two or more players join, broadcasting the time remaining to clients.  
* **Details**: Use a simple interval to track time.  
* **Test**: Join two players, wait 5 seconds, and check that both clients receive a time update (e.g., 295 seconds remaining) via console logs.

---

**Step 13: Define Win Conditions**

* **Instruction**: In server/GameRoom.js, end the game when either: (a) time reaches 0 and humans remain, or (b) all players are zombies. Broadcast the winner ("humans" or "zombies").  
* **Details**: Check player states on each update or timer tick.  
* **Test**: Join two players (one human, one zombie). Turn the human into a zombie and confirm the server logs "zombies win". Alternatively, wait 5 minutes with one human alive and confirm "humans win".

---

**Step 14: Deploy Backend to Heroku**

* **Instruction**: Create a Procfile in the root with web: node server/index.js, push the project to a Heroku app, and deploy it.  
* **Details**: Ensure WebSocket support is enabled on Heroku.  
* **Test**: Access the deployed URL (e.g., ws://your-app.herokuapp.com) from a browser tab and confirm the client connects to "game\_room".

---

**Step 15: Deploy Frontend to Netlify**

* **Instruction**: Push the client/ folder to a Netlify site, updating the Colyseus client URL in client/main.js to the Heroku WebSocket address.  
* **Details**: Use Netlify's drag-and-drop or CLI deployment.  
* **Test**: Open the Netlify URL in two browser tabs, join the game, and confirm both see synchronized cubes moving on the plane.

---

**Next Steps**

* Add user authentication with Passport.js and MongoDB Atlas.  
* Implement special items (Flower of Life, Cola, Baseball Bat).  
* Expand the city-like environment with buildings and hiding spots.

---

This plan builds the base game incrementally, ensuring each step is validated before moving forward. It delivers a functional multiplayer experience with movement, team switching, and win conditions, ready for further feature development.  
