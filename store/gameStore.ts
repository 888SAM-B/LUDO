
import { create } from 'zustand';
import type { GameStore, Player, Token, PlayerColor, GameState as GameStateEnum } from '../types';
import { TokenState, GameState } from '../types';
import { 
  START_POSITIONS, 
  BASE_POSITION, 
  TOTAL_PATH_LENGTH,
  HOME_ENTRANCE,
  HOME_PATH_START_INDEX,
  HOME_PATH_LENGTH,
  FINISHED_POSITION,
  SAFE_SPOTS
} from '../constants';
import { getValidMoves } from '../utils/gameLogic';

const createInitialPlayer = (color: PlayerColor, isBot: boolean): Player => {
  const tokens: Token[] = Array.from({ length: 4 }, (_, i) => ({
    id: parseInt(`${Object.keys(START_POSITIONS).indexOf(color)}${i}`), // e.g., red token 0 is 00, green token 1 is 11
    color,
    position: BASE_POSITION,
    state: TokenState.BASE,
  }));
  return { id: color, name: `${color.charAt(0).toUpperCase() + color.slice(1)} Player`, tokens, isBot };
};

const useGameStore = create<GameStore>((set, get) => ({
  gameState: GameState.LOBBY,
  players: [],
  currentPlayerIndex: 0,
  diceValue: 0,
  rolledSixCount: 0,
  winner: null,
  validMoves: [],
  actions: {
    setupGame: (playerConfigs) => {
      const players = playerConfigs.map(config => createInitialPlayer(config.id, config.isBot));
      set({
        players,
        gameState: GameState.ROLLING,
        currentPlayerIndex: 0,
        diceValue: 0,
        rolledSixCount: 0,
        winner: null,
        validMoves: [],
      });
    },
    resetGame: () => {
        set({ gameState: GameState.LOBBY });
    },
    rollDice: () => {
      const diceValue = Math.floor(Math.random() * 6) + 1;
      // const diceValue = 6; // for testing
      const { currentPlayerIndex, players, rolledSixCount } = get();
      const currentPlayer = players[currentPlayerIndex];

      if (diceValue === 6) {
        if (rolledSixCount === 2) {
          // Third consecutive 6, forfeit turn
          set(state => ({
            rolledSixCount: 0,
            diceValue,
            currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
            gameState: GameState.ROLLING,
            validMoves: [],
          }));
          return;
        }
        set({ rolledSixCount: rolledSixCount + 1 });
      } else {
        set({ rolledSixCount: 0 });
      }
      
      const validMoves = getValidMoves(currentPlayer, diceValue, players);
      
      if (validMoves.length > 0) {
        set({ diceValue, gameState: GameState.MOVING, validMoves });
      } else {
        // No valid moves, pass turn
        set(state => ({
          diceValue,
          currentPlayerIndex: diceValue === 6 ? state.currentPlayerIndex : (state.currentPlayerIndex + 1) % state.players.length,
          gameState: GameState.ROLLING,
          validMoves: [],
        }));
      }
    },
    moveToken: (tokenId) => {
      let { players, currentPlayerIndex, diceValue } = get();
      let newPlayers = JSON.parse(JSON.stringify(players));
      const currentPlayer = newPlayers[currentPlayerIndex];
      const tokenToMove = currentPlayer.tokens.find((t: Token) => t.id === tokenId);

      if (!tokenToMove || !get().validMoves.includes(tokenId)) return;

      // Move from base
      if (tokenToMove.position === BASE_POSITION && diceValue === 6) {
        tokenToMove.position = START_POSITIONS[currentPlayer.id];
      } else {
        // Normal move
        const homeEntrance = HOME_ENTRANCE[currentPlayer.id];
        let currentPos = tokenToMove.position;
        
        if (currentPos >= HOME_PATH_START_INDEX) {
            tokenToMove.position += diceValue;
        } else {
            // Check if it passes home entrance
            const playerStart = START_POSITIONS[currentPlayer.id];
            let stepsMoved = 0;
            let tempPos = currentPos;
            
            while(stepsMoved < diceValue) {
                if (tempPos === homeEntrance) {
                    currentPos = HOME_PATH_START_INDEX;
                    break;
                }
                tempPos = (tempPos + 1) % TOTAL_PATH_LENGTH;
                stepsMoved++;
            }
            if(currentPos >= HOME_PATH_START_INDEX) {
                 tokenToMove.position = currentPos + (diceValue - stepsMoved -1)
            } else {
                 tokenToMove.position = (currentPos + diceValue) % TOTAL_PATH_LENGTH;
            }
        }
      }

      if (tokenToMove.position >= HOME_PATH_START_INDEX + HOME_PATH_LENGTH-1) {
        tokenToMove.position = FINISHED_POSITION;
        tokenToMove.state = TokenState.HOME;
      }
      
      // Capture logic
      const targetPos = tokenToMove.position;
      if (targetPos < HOME_PATH_START_INDEX && !SAFE_SPOTS.includes(targetPos)) {
        newPlayers.forEach((p: Player) => {
          if (p.id !== currentPlayer.id) {
            p.tokens.forEach((t: Token) => {
              if (t.position === targetPos) {
                t.position = BASE_POSITION;
                t.state = TokenState.BASE;
              }
            });
          }
        });
      }

      // Check for winner
      if (currentPlayer.tokens.every((t: Token) => t.position === FINISHED_POSITION)) {
        set({ players: newPlayers, winner: currentPlayer.id, gameState: GameState.GAME_OVER });
        return;
      }

      // Determine next state
      const rolledSix = diceValue === 6 || get().rolledSixCount > 0;
      const nextPlayerIndex = rolledSix ? currentPlayerIndex : (currentPlayerIndex + 1) % newPlayers.length;
      
      set({
        players: newPlayers,
        currentPlayerIndex: nextPlayerIndex,
        gameState: GameState.ROLLING,
        validMoves: [],
      });
    },
  }
}));

export { useGameStore };