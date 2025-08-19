
export type PlayerColor = 'red' | 'green' | 'blue' | 'yellow';

export enum GameState {
  LOBBY = 'LOBBY',
  ROLLING = 'ROLLING',
  MOVING = 'MOVING',
  GAME_OVER = 'GAME_OVER',
}

export enum TokenState {
  BASE = 'BASE',
  HOME = 'HOME',
  SAFE = 'SAFE',
  ACTIVE = 'ACTIVE',
}

export interface Token {
  id: number;
  color: PlayerColor;
  position: number; // -1 for base, 0-51 for main track, 101-106 for home path, 200 for finished
  state: TokenState;
}

export interface Player {
  id: PlayerColor;
  name: string;
  tokens: Token[];
  isBot: boolean;
}

export interface GameStore {
  gameState: GameState;
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number;
  rolledSixCount: number;
  winner: PlayerColor | null;
  validMoves: number[]; // Array of token IDs that can move
  actions: {
    setupGame: (playerConfigs: { id: PlayerColor, isBot: boolean }[]) => void;
    rollDice: () => void;
    moveToken: (tokenId: number) => void;
    resetGame: () => void;
  };
}