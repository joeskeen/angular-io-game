# Angular IO Game Seed Project

A starting point for quickly creating an IO game in Angular

## Getting started

1. Fork this repository: <https://github.com/joeskeen/angular-io-game/fork>
1. Clone the repository
1. Run `npm install` in the root
1. Run `npm start` in the root
1. Open a browser to **<http://localhost:3000>**

## What `npm start` does

Starts live reload mode for the entire full-stack application:

- Starts an ExpressJS server app, which is responsible for serving the
  Angular client application, allow users to connect to the server (via
  web sockets), maintain global game state, receive commands from clients,
  and send state change updates to the clients.
- Starts the Angular client application in build watch mode. The application
  allows users to set their name and connect to the game, translate user
  interaction (key presses) into game commands, and displays the current
  game state to the user.

## How the game currently works

- There is a playing field which is a 100x100 grid (so 10,000 unique locations)
- Players, when they join the game, spawn in a random unoccupied location on the
  playing field.
- Players can move around the grid using arrow keys or WASD keys on the keyboard.
- 100 Coins spawn in the playing field, and if a player moves onto a space with
  a coin, the coin is collected and another is spawned. The player's score is
  increased by 1.
- Other players may exist on the same server. If more than one player ends up on
  the same space, a coin is flipped and one of the players are eliminated. The
  surviving player wins all of the points from the eliminated player.

## Making this app your own

Unless you have a good reason to, there are several parts of the "plumbing" (the
communication between the client and the server, for example), that you probably
don't want to change/break. What you should probably start with for customizing
your IO app is to look at the following files:

- `src/models.ts`: define the shared interfaces for objects used in both the
  client and server applications. You can use these interfaces to add traits to
  the objects in the game that can be used in the game logic.
- `src/logic.ts`: functions for determining what the game should do.
  - `gameLogic()` is the function that is called each time the game loop executes
    (10 times per second). It's responsible for taking player commands
    and modifying the game state.
- `src/client/src/app/game/game.component.ts`: the component that
  receives game state and user input and handles events such as game
  over, navigation, etc.
- `src/client/src/app/field/field.component.ts`: the component for
  rendering the game state.
