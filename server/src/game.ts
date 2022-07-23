import { Command, IGameState } from '../../models';
import { gameLogic, getInitialState } from './logic';

export type UpdateCallback = (gameState: IGameState) => void;
export type GameOverCallback = (reason: string) => void;

const UPDATES_PER_SECOND = 10;

export class Game {
  private gameState: IGameState;
  private callbacks: Record<
    string,
    { update: UpdateCallback; gameOver: GameOverCallback }
  > = {};
  private playerCommands: Record<string, Command> = {};
  private timer: NodeJS.Timer;

  start() {
    console.log(`starting game (${UPDATES_PER_SECOND} updates per second)`);
    this.callbacks = {};
    this.gameState = getInitialState();
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

    const x = Math.floor(Math.random() * this.gameState.fieldSize.width);
    const y = Math.floor(Math.random() * this.gameState.fieldSize.height);

    this.gameState.players.push({
      id,
      name,
      score: 1,
      x,
      y,
    });
  }

  drop(id: string) {
    delete this.callbacks[id];
    this.gameState.players = this.gameState.players.filter((p) => p.id !== id);

    if (!this.gameState.players.length) {
      console.log('stopping game (no players)');
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onPlayerCommand(playerId: string, command: Command) {
    this.playerCommands[playerId] = command;
  }

  updateGameState() {
    const oldState = JSON.stringify(this.gameState);
    const newState = gameLogic(this.gameState, this.playerCommands);
    if (JSON.stringify(newState) === oldState) {
      return;
    }
    this.gameState = newState;
    this.playerCommands = {};
    Object.values(this.callbacks).forEach((cb) => cb.update(newState));
    // TODO: get game over callbacks working
  }
}
