import { AfterViewInit, Component } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, filter, throttleTime, takeWhile } from 'rxjs/operators';
import { Command, IGameState } from '../../../../models';
import {
  Connection,
  ConnectionService,
} from '../connection/connection.service';
import * as KEY_BINDINGS from '../../assets/keybindings.json';

const MAX_ALLOWABLE_MOVE_COMMANDS_PER_SECOND = 25;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  private keyBindings = KEY_BINDINGS as Record<string, Command>;
  private gameActive = false;
  private connection?: Connection;

  gameState?: IGameState;

  constructor(private connectionService: ConnectionService) {}

  ngAfterViewInit(): void {
    this.initKeyBindings();
    this.startGame();
  }

  private async startGame() {
    this.connection = this.connectionService.getConnection();
    await this.connection.connect('Me'); // TODO: pass in player name
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
    this.gameActive = true;
  }

  private updateGame(state: IGameState) {
    this.gameState = state;
  }

  private gameOver(reason: string) {
    console.log('game over!');
    this.endGame();
  }

  private endGame() {
    this.gameActive = false;
    this.connection?.dispose();
    this.gameState = undefined;
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
