import * as express from 'express';
import { Server as SocketIoServer } from 'socket.io';
import { join } from 'path';
import { Game } from './game';

const app = express();
const clientDist = join(__dirname, '../../client/dist/ngx-io-js-client');
app.use(express.static(clientDist));
app.get('*', (_, res) => {
  res.sendFile(`${clientDist}/index.html`);
});

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.info(`server listening on port ${port}`);

const game = new Game();

const io = new SocketIoServer(server);
io.on('connection', async (socket) => {
  console.log(`player connected: ${socket.id}`);
  const name = await new Promise<string>((resolve) => {
    socket.once('name', (name: string) => resolve(name));
  });
  game.join(
    socket.id,
    name,
    (state) => socket.emit('stateChanged', state),
    (reason) => socket.emit('gameOver', reason)
  );
  socket.conn.on('close', () => game.drop(socket.id));
  socket.on('command', (data) => game.onPlayerCommand(socket.id, data.command));
});
