import { Command, IGameState } from '../../models';

export function gameLogic(
  state: IGameState,
  commands: Record<string, Command>
): IGameState {
  Object.keys(commands).forEach((playerId) => {
    const player = state.players.find((p) => p.id === playerId);
    if (!player) {
      return;
    }
    const command = commands[playerId];
    if (command === 'up') {
      const newY = player.y - 1;
      if (newY < 0) {
        return;
      }
      player.y = newY;
    } else if (command === 'down') {
      const newY = player.y + 1;
      if (newY > state.fieldSize.height) {
        return;
      }
      player.y = newY;
    } else if (command === 'left') {
      const newX = player.x - 1;
      if (newX < 0) {
        return;
      }
      player.x = newX;
    } else if (command === 'right') {
      const newX = player.x + 1;
      if (newX > state.fieldSize.width) {
        return;
      }
      player.x = newX;
    }
  });
  return state;
}

export function getInitialState(): IGameState {
  return {
    players: [],
    coins: [],
    fieldSize: {
      width: 1000,
      height: 1000,
    },
  };
}
