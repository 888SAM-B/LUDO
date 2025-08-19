
import {
  START_POSITIONS,
  TOTAL_PATH_LENGTH,
  HOME_ENTRANCE,
  HOME_PATH_START_INDEX,
  HOME_PATH_LENGTH,
  FINISHED_POSITION,
  BASE_POSITION,
  SAFE_SPOTS
} from '../constants';
import type { Player, Token, PlayerColor } from '../types';

/**
 * Calculates the next position of a token.
 * @param token The token being moved.
 * @param diceValue The value rolled on the dice.
 * @returns The new position index.
 */
const calculateNextPosition = (token: Token, diceValue: number): number => {
  if (token.position === BASE_POSITION) {
    return diceValue === 6 ? START_POSITIONS[token.color] : BASE_POSITION;
  }
  
  const homeEntrance = HOME_ENTRANCE[token.color];
  
  if (token.position >= HOME_PATH_START_INDEX) {
    const newPos = token.position + diceValue;
    return newPos <= HOME_PATH_START_INDEX + HOME_PATH_LENGTH -1 ? newPos : -1; // -1 indicates invalid move
  }

  let newPos = token.position + diceValue;

  const crossesFinishLine = (token.color === 'red' && token.position <= homeEntrance && newPos > homeEntrance) ||
                            (token.color !== 'red' && token.position < homeEntrance && newPos >= homeEntrance);

  if (crossesFinishLine) {
    const stepsIntoHome = newPos - homeEntrance;
    return HOME_PATH_START_INDEX + stepsIntoHome -1;
  }
  
  return newPos % TOTAL_PATH_LENGTH;
};


/**
 * Checks if a move is valid according to Ludo rules.
 * @param token The token to check.
 * @param diceValue The dice roll.
 * @param players All players in the game, to check for token stacking.
 * @returns boolean indicating if the move is valid.
 */
export const isMoveValid = (token: Token, diceValue: number, players: Player[]): boolean => {
  const player = players.find(p => p.id === token.color);
  if (!player) return false;

  // Rule: Must roll 6 to get a token out of base
  if (token.position === BASE_POSITION) {
    if (diceValue !== 6) return false;
    const startPos = START_POSITIONS[token.color];
    const tokenAtStart = player.tokens.some(t => t.position === startPos);
    return !tokenAtStart; // Can't move out if another of your tokens is at the start
  }

  const nextPos = calculateNextPosition(token, diceValue);

  // Rule: Invalid move if it overshoots the home path
  if (nextPos === -1) return false;
  if(nextPos >= HOME_PATH_START_INDEX + HOME_PATH_LENGTH){
    return false;
  }
  
  // Rule: Cannot land on a spot occupied by one of your own tokens
  const tokenAtDestination = player.tokens.some(t => t.position === nextPos);
  if (tokenAtDestination) return false;
  
  return true;
};

/**
 * Gets a list of all valid moves for a player.
 * @param player The current player.
 * @param diceValue The dice roll.
 * @param players All players.
 * @returns An array of token IDs that can be moved.
 */
export const getValidMoves = (player: Player, diceValue: number, players: Player[]): number[] => {
  return player.tokens
    .filter(token => token.position < FINISHED_POSITION && isMoveValid(token, diceValue, players))
    .map(token => token.id);
};

/**
 * Basic AI for bot players.
 * @param botPlayer The bot player object.
 * @param diceValue The current dice roll.
 * @param players All players in the game.
 * @returns A single valid move (token object) or null if no move is possible.
 */
export const getBotMove = (botPlayer: Player, diceValue: number, players: Player[]): { tokenId: number } | null => {
  const validMoves = getValidMoves(botPlayer, diceValue, players);
  if (validMoves.length === 0) return null;

  const movableTokens = botPlayer.tokens.filter(t => validMoves.includes(t.id));

  // Priorities for the bot:
  // 1. Capture an opponent's piece
  for (const token of movableTokens) {
    const nextPos = calculateNextPosition(token, diceValue);
    if (nextPos !== -1 && !SAFE_SPOTS.includes(nextPos)) {
      const isOpponentOnSpot = players
        .filter(p => p.id !== botPlayer.id)
        .some(p => p.tokens.some(t => t.position === nextPos));
      if (isOpponentOnSpot) return { tokenId: token.id };
    }
  }

  // 2. Get a token out of base if a 6 is rolled
  if (diceValue === 6) {
    const tokenInBase = movableTokens.find(t => t.position === BASE_POSITION);
    if (tokenInBase) return { tokenId: tokenInBase.id };
  }

  // 3. Move a token that is closest to home
  movableTokens.sort((a, b) => b.position - a.position);
  const tokenToMove = movableTokens[0];
  
  if(tokenToMove) {
    return { tokenId: tokenToMove.id };
  }

  return null;
};