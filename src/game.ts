import { gameLogic, getInitialState, getUnoccupiedLocation } from './logic';
import { Command, Commands, IGameState } from './models';

export type UpdateCallback = (gameState: IGameState) => void;
export type GameOverCallback = (reason: string) => void;

const UPDATES_PER_SECOND = 10;

export class Game {
  private _gameState: IGameState;
  get gameState() {
    return { ...this._gameState };
  }
  private callbacks: Record<
    string,
    { update: UpdateCallback; gameOver: GameOverCallback }
  > = {};
  private playerCommands: Commands = {};
  private timer?: NodeJS.Timer;

  start() {
    console.log(`starting game (${UPDATES_PER_SECOND} updates per second)`);
    this.callbacks = {};
    this._gameState = getInitialState();
    this.timer = setInterval(
      () => this.updateGameState(),
      1000 / UPDATES_PER_SECOND
    );
  }

  join(
    id: string,
    name: string,
    updateCallback: UpdateCallback,
    gameOverCallback: GameOverCallback
  ) {
    if (!this.timer) {
      this.start();
    }

    this.callbacks[id] = {
      update: updateCallback,
      gameOver: gameOverCallback,
    };

    const location = getUnoccupiedLocation(this._gameState);

    this._gameState.players.push({
      ...location,
      id,
      name,
      score: 1,
    });
  }

  drop(id: string) {
    delete this.callbacks[id];
    this._gameState.players = this._gameState.players.filter(
      (p) => p.id !== id
    );

    if (!this._gameState.players.length) {
      console.log('stopping game (no players)');
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  onPlayerCommand(playerId: string, command: Command) {
    this.playerCommands[playerId] = command;
  }

  updateGameState() {
    const oldState = JSON.stringify(this._gameState);
    const newState = gameLogic(this._gameState, this.playerCommands);
    if (JSON.stringify(newState) === oldState) {
      return;
    }
    this._gameState = newState;
    this.playerCommands = {};
    Object.keys(this.callbacks).forEach((id) => {
      const callbacks = this.callbacks[id];
      callbacks.update(newState);
      const player = this._gameState.players.find((p) => p.id === id);
      if (!player) {
        const conquererId = this._gameState.eliminatedPlayers[id];
        const conquerer = this._gameState.players.find(
          (p) => p.id === conquererId
        );
        const message = conquerer
          ? `You were eliminated by ${conquerer.name}`
          : `You were eliminated`;
        callbacks.gameOver(message);
      }
    });
  }
}
