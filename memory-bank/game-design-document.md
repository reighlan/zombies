# Zombies vs Humans - Game Design Document

## 1. Game Concept
Zombies vs Humans is a multiplayer game where players are split into two teams: **Zombies** and **Humans**. The Zombies' goal is to turn all Humans into Zombies by tapping them, while Humans aim to survive for 5 minutes using special items to defend themselves or convert Zombies. The game takes place in a city-like environment with simple, blocky graphics similar to *Minecraft* or *Roblox*.

## 2. Gameplay Mechanics
- **Movement**: Players can freely move around the game world.
- **Zombie Interaction**: Zombies turn Humans into Zombies by getting close and performing an action (e.g., "tapping" them).
- **Human Interaction**: Humans can only interact with Zombies using special items found in the game world:
  - **Flower of Life**: Turns a Zombie back into a Human.
  - **Cola**: Stuns a Zombie for 3 seconds, preventing movement or attacks.
  - **Baseball Bat**: Temporarily removes a Zombie from the game for 10 seconds.
- **Item Collection**: Special items are scattered across the map for Humans to pick up.
- **Team Switching**:
  - When a Human is turned, they join the Zombie team.
  - When a Zombie is hit with a Flower of Life, they join the Human team.
- **Respawn**: Zombies "killed" by a Baseball Bat respawn after 10 seconds.

## 3. Teams and Balancing
- **Team Size**: The game supports 2 to 20 players (1 to 10 per side).
- **Initial Setup**: Players are evenly divided into Zombies and Humans at the start.
- **Balancing**: Teams begin with equal numbers to ensure fairness, though sizes shift as players are turned or converted during gameplay.

## 4. Special Items
- **Flower of Life**:
  - **Effect**: Transforms a Zombie into a Human.
  - **Usage**: Single-use.
- **Cola**:
  - **Effect**: Stuns a Zombie for 3 seconds.
  - **Usage**: Single-use.
- **Baseball Bat**:
  - **Effect**: Removes a Zombie from the game for 10 seconds, after which it respawns.
  - **Usage**: Single-use.
- **Availability**: Items are placed at various points in the game world and respawn after a set interval (e.g., 30 seconds) at random locations.

## 5. Game World
- **Setting**: A city-like environment with buildings, streets, and hiding spots.
- **Graphics**: Simple, blocky style inspired by *Minecraft* and *Roblox*.
- **Features**: Includes areas where Humans can hide from Zombies, such as inside buildings or behind objects.

## 6. Win Conditions
- **Game Duration**: Each match lasts 5 minutes.
- **End Conditions**:
  - The game ends when the 5-minute timer runs out or when only one Human remains.
  - If time runs out and at least one Human is still alive, the Human team wins.
  - If all Humans are turned into Zombies before time runs out, the Zombie team wins.
- **Scoring**: Players’ win/loss records are updated based on the team they are on when the game ends.

## 7. User Accounts and Statistics
- **User IDs**: Players create accounts with unique usernames of their choice.
- **Tracking**: The game records each player’s wins and losses.
- **Multiplayer Support**: Matches accommodate 2 to 20 players, with options for public or private games (implementation details TBD).
