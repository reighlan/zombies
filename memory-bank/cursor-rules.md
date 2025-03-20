# Cursor Rules for Senior Game Developer (ThreeJS, Node.js, Colyseus, MongoDB)

## 1. Modular Architecture Over Monoliths
**Rule:** Structure your codebase into multiple, small, focused modules (e.g., separate files for player movement, rendering, networking) instead of a single giant file. Store these in logical directories like `src/networking/` or `src/rendering/`.

**Implementation:** Use Cursor’s project rules in `.cursor/rules` with glob patterns (e.g., `src/**/*.js`) to enforce modular conventions per directory.

**Why:** Modularity improves readability, debugging, and scalability, preventing the chaos of a monolithic file that’s hard to maintain.

---

## 2. Leverage Colyseus for Networking
**Rule:** Use Colyseus to manage real-time multiplayer features. Define game rooms with explicit `onJoin`, `onLeave`, and `onMessage` handlers to streamline player interactions.

**Implementation:** Create a rule in `.cursor/rules/networking.md` with `@file` references to Colyseus schema files for context.

**Why:** Colyseus ensures efficient state synchronization and low-latency communication, critical for multiplayer games.

---

## 3. Authoritative Server-Side Physics
**Rule:** Run physics simulations (e.g., with Cannon.js) on the server via Node.js to maintain a single, authoritative game state, sending updates to ThreeJS clients.

**Implementation:** Add a rule in `.cursor/rules/physics.md` applying to `server/**/*.js` to enforce server-side logic.

**Why:** This prevents cheating and ensures all players see a consistent world, avoiding client-side discrepancies.

---

## 4. Optimize MongoDB Data Access
**Rule:** Use MongoDB for persistent data (e.g., player stats) and leverage cursors to fetch large datasets in batches, avoiding full memory loads.

**Implementation:** Define a `.cursor/rules/database.md` rule for `db/**/*.js` to encourage cursor usage and indexing.

**Why:** Efficient data handling reduces memory overhead and speeds up queries, vital for scalability.

---

## 5. ThreeJS Rendering Efficiency
**Rule:** Minimize draw calls in ThreeJS by grouping objects with shared materials and using instancing for repeated geometry.

**Implementation:** Set a `.cursor/rules/rendering.md` rule for `client/**/*.js` to enforce optimization patterns.

**Why:** Optimized rendering ensures smooth frame rates, especially in browser-based 3D games.

---

## 6. Delta-Based State Synchronization
**Rule:** Sync game state from server to clients using Colyseus’s delta compression, sending only state changes instead of full updates.

**Implementation:** Include this in `.cursor/rules/networking.md` with examples of schema diffs.

**Why:** This minimizes bandwidth usage and keeps clients responsive, enhancing performance.

---

## 7. Robust Error Handling
**Rule:** Implement error handling and logging on both client and server (e.g., Winston for Node.js) to catch and track issues.

**Implementation:** Add a global rule in Cursor Settings > Rules for AI: “Always include try-catch blocks and log errors.”

**Why:** Reliable error tracking ensures stability and simplifies debugging in production.

---

## 8. Clear Documentation
**Rule:** Use JSDoc to document all modules and functions, keeping code self-explanatory for team collaboration.

**Implementation:** Enforce via a `.cursor/rules/docs.md` rule applying to `**/*.js` with JSDoc examples.

**Why:** Good documentation speeds up onboarding and maintains long-term code clarity.
