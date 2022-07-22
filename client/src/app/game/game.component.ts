import { AfterViewInit, Component } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, filter, throttleTime, takeWhile } from 'rxjs/operators';
import {
  Connection,
  ConnectionService,
} from '../connection/connection.service';

const MAX_ALLOWABLE_MOVE_COMMANDS_PER_SECOND = 25;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  private gameActive = false;
  private connection?: Connection;

  keyBindings: Record<string, Movement> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right',
  };

  constructor(private connectionService: ConnectionService) {}

  ngAfterViewInit(): void {
    this.initKeyBindings();
    this.startGame();
  }

  private async startGame() {
    this.connection = this.connectionService.getConnection();
    await this.connection.connect();
    this.connection.dataStream
      ?.pipe(takeWhile(() => this.gameActive))
      .subscribe((data) => this.updateGame(data));
    this.gameActive = true;
  }

  private updateGame(data: any) {
    console.log(data);
  }

  private endGame() {
    this.gameActive = false;
    this.connection?.dispose();
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
        // map the key to the movement
        map((k) => this.keyBindings[k]),
        // only allow 25 move commands per second
        throttleTime(1000 / MAX_ALLOWABLE_MOVE_COMMANDS_PER_SECOND)
      )
      .subscribe(console.log);
  }
}

type Movement = 'up' | 'down' | 'left' | 'right';
