import * as express from 'express';
import { Server as SocketIoServer } from 'socket.io';
import { join } from 'path';
import { Game } from './game';
import { Command } from './models';

console.info(`starting app...`);

const app = express();

const clientDist = join(__dirname, 'client');
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
  const name = await new Promise<string>((resolve) => {
    socket.once('name', (name: string) => resolve(name));
  });
  console.log(`player connected: ${name} (${socket.id})`);
  game.join(
    socket.id,
    name,
    (state) => socket.emit('stateChanged', state),
    (reason) => socket.emit('gameOver', reason)
  );
  socket.conn.on('close', () => game.drop(socket.id));
  socket.on('command', (command: Command) =>
    game.onPlayerCommand(socket.id, command)
  );
  // initial push of state
  socket.emit('stateChanged', game.gameState);
});
