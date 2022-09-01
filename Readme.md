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
- `src/client/src/assets/keybindings.json`: a key-value mapping where the key is
  the key to receive input from (full list is at
  <https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values>),'
  value is the command name to execute (see the `Command` type in `src/models.ts`).
  Only single key bindings are supported.

## Sharing your app

To let others play your app:

- Sign up for a free account on NGROK (<https://dashboard.ngrok.com/signup>) - you
  can link with GitHub if you don't want to create another special account for it
- Go to <https://dashboard.ngrok.com/get-started/your-authtoken> and copy your
  authtoken.
- Make sure `npm start` is running
- In a separate terminal window/tab, run `npx ngrok accesstoken {your pasted access token}`
- Then run `npx ngrok http 3000`. This will give you public internet URLs you can
  share with others to play the game. Something like this:

  ```
  ngrok by @inconshreveable                                                 (Ctrl+C to quit)

  Session Status                online
  Account                       Joe Skeen (Plan: Free)
  Version                       2.3.40
  Region                        United States (us)
  Web Interface                 http://127.0.0.1:4040
  Forwarding                    http://8b75-69-55-98-34.ngrok.io -> http://localhost:3000
  Forwarding                    https://8b75-69-55-98-34.ngrok.io -> http://localhost:3000

  Connections                   ttl     opn     rt1     rt5     p50     p90
                                0       0       0.00    0.00    0.00    0.00
  ```

- Remember, the game is running on your computer, so you need to keep `npm start`
  running for the app to remain active.

## Submitting your ng-conf 2022 hackathon project

If you would like to be eligible for winning the grand prize for the ng-conf 2022 hackathon:

- Check in and push your code to a public GitHub repository.
- Keep your app running until the end of the judging.
- Submit your repo URL and public app URL here: <https://forms.gle/qNms32fdgkyMht2L6>

Hope you had fun, and Good luck!
