import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';

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
  private _dataStream?: Observable<any>;

  constructor() {}

  async connect() {
    const socketProtocol = window.location.protocol.includes('https')
      ? 'wss'
      : 'ws';
    const socket = io(`${socketProtocol}://${window.location.host}`, {
      reconnection: false,
    });

    await new Promise<void>((resolve) => {
      socket.on('connect', () => {
        console.log(`connected to web socket: ${socket.id}`);
        resolve();
      });
    });

    this._dataStream = fromEvent(socket, 'connect').pipe(
      first(),
      tap(() => console.info(`connected to web socket`)),
      switchMap(() => fromEvent(socket, 'update'))
    );

    fromEvent(socket, 'disconnect').subscribe(() => {
      console.log('socket disconnected');
      this.dispose();
    });

    this.socket = socket;
  }

  get dataStream(): Observable<any> | undefined {
    return this._dataStream;
  }

  sendData(data: any) {
    if (!this.socket) {
      throw new Error('Failed to send data: no connected socket');
    }

    this.socket.emit('data', JSON.stringify(data));
  }

  dispose() {
    this.socket?.disconnect();
    this.socket = undefined;
    this._dataStream = undefined;
  }
}
