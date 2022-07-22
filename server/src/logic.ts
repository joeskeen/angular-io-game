import { Command, IGameState } from '../../models';

export function gameLogic(
  state: IGameState,
  commands: Record<string, Command>
): IGameState {
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
