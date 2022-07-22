export interface IGameState {
  players: IPlayer[];
  coins: ICoin[];
  fieldSize: {
    width: number;
    height: number;
  };
}

export interface IPlayer {
  id: string;
  name: string;
  score: number;
  x: number;
  y: number;
}

export interface ICoin {
  x: number;
  y: number;
}

export type Command = 'left' | 'right' | 'up' | 'down';
