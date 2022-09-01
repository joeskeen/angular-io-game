import { AfterViewInit, Component, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, filter, throttleTime, takeWhile } from 'rxjs/operators';
import {
  Connection,
  ConnectionService,
} from '../connection/connection.service';
import * as KEY_BINDINGS from '../../assets/keybindings.json';
import { StateService } from '../state/state.service';
import { Router } from '@angular/router';
import { Command, IGameState, IPlayer } from '../../../../models';
import { ReloadService } from '../reload.service';

const MAX_ALLOWABLE_MOVE_COMMANDS_PER_SECOND = 15;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  private keyBindings = KEY_BINDINGS as Record<string, Command>;
  private gameActive = false;
  private connection?: Connection;

  @Input()
  gameState?: IGameState;

  player?: IPlayer;
  playerId?: string;

  constructor(
    private connectionService: ConnectionService,
    private stateService: StateService,
    private router: Router,
    private reloadService: ReloadService
  ) {}

  ngAfterViewInit(): void {
    this.initKeyBindings();
    this.startGame();
  }

  private async startGame() {
    const playerName = this.stateService.playerName;
    if (!playerName) {
      this.router.navigate(['/']);
      return;
    }

    this.connection = this.connectionService.getConnection();
    const connectionPromise = this.connection.connect(playerName);
    this.connection.dataStream
      ?.pipe(takeWhile(() => this.gameActive))
      .subscribe((data) => {
        switch (data.event) {
          case 'stateChanged':
            this.updateGame(data.state!);
            break;
          case 'gameOver':
            this.gameOver(data.reason!);
            break;
        }
      });
    const id = await connectionPromise;
    this.playerId = id;
    this.gameActive = true;

    setTimeout(() => {
      if (!this.gameState) {
        // There's a bug where the socket somehow doesn't connect properly.
        // a refresh can sometimes fix it. It's a race condition I haven't
        // gotten a chance to fix yet.
        this.reloadService.reloadPage();
      }
    }, 500);
  }

  private updateGame(state: IGameState) {
    this.gameState = state;
    this.player = this.gameState.players.find((p) => p.id === this.playerId);
  }

  private gameOver(reason: string) {
    console.log('game over!');
    this.endGame();
    alert(`Game Over: ${reason}`);
    this.router.navigate(['/']);
  }

  private endGame() {
    this.gameActive = false;
    this.connection?.dispose();
    this.gameState = undefined;
    this.playerId = undefined;
    this.player = undefined;
  }

  private initKeyBindings() {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        // Only care about key events while game is active
        filter(() => this.gameActive),
        // Get the key from the event
        map((e) => e.key),
        // ignore unmapped keys
        filter((k) => Object.keys(this.keyBindings).includes(k)),
        // map the key to the command
        map((k) => this.keyBindings[k]),
        // only allow 25 commands per second
        throttleTime(1000 / MAX_ALLOWABLE_MOVE_COMMANDS_PER_SECOND)
      )
      .subscribe((command) => {
        this.connection?.sendCommand(command);
      });
  }
}
