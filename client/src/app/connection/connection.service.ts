import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, fromEvent, merge } from 'rxjs';
import { first, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Command, IGameState } from '../../../../models/index';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  constructor() {}

  getConnection(): Connection {
    return new Connection();
  }
}

export class Connection {
  private socket?: Socket<any, any>;
  private _dataStream?: Observable<IMessage>;

  constructor() {}

  async connect(name: string) {
    const socketProtocol = window.location.protocol.includes('https')
      ? 'wss'
      : 'ws';
    const socket = io(`${socketProtocol}://${window.location.host}`, {
      reconnection: false,
    });

    const stateChange$ = fromEvent(socket, 'stateChanged').pipe(
      map(
        (state: IGameState) =>
          ({
            event: 'stateChanged',
            state,
          } as IMessage)
      )
    );

    const gameOver$ = fromEvent(socket, 'gameOver').pipe(
      map(
        (reason: string) =>
          ({
            event: 'gameOver',
            reason,
          } as IMessage)
      )
    );

    const disconnect$ = fromEvent(socket, 'disconnect').pipe(
      tap(() => {
        console.log('socket disconnected');
        this.dispose();
      })
    );

    this._dataStream = fromEvent(socket, 'connect').pipe(
      first(),
      tap(() => socket.emit('name', name)),
      tap(() => console.log(`connected on socket ${socket.id} as ${name}`)),
      switchMap(() => merge(stateChange$, gameOver$)),
      takeUntil(disconnect$)
    );

    this.socket = socket;
  }

  get dataStream(): Observable<IMessage> | undefined {
    return this._dataStream;
  }

  sendCommand(command: Command) {
    if (!this.socket) {
      throw new Error('Failed to send data: no connected socket');
    }

    this.socket.emit('command', command);
  }

  dispose() {
    this.socket?.disconnect();
    this.socket = undefined;
    this._dataStream = undefined;
  }
}

interface IMessage {
  event: 'stateChanged' | 'gameOver';
  state?: IGameState;
  reason?: string;
}
