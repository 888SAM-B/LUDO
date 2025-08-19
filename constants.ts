import type { PlayerColor } from './types';

export const PLAYER_COLORS: Record<PlayerColor, { base: string, token: string, text: string, path: string }> = {
  red: { base: 'bg-red-500', token: 'bg-red-600', text: 'text-red-600', path: 'bg-red-400' },
  green: { base: 'bg-green-500', token: 'bg-green-600', text: 'text-green-600', path: 'bg-green-400' },
  blue: { base: 'bg-sky-500', token: 'bg-sky-600', text: 'text-sky-600', path: 'bg-sky-400' },
  yellow: { base: 'bg-yellow-400', token: 'bg-yellow-500', text: 'text-yellow-500', path: 'bg-yellow-300' },
};

export const START_POSITIONS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26, // Swapped with blue
  blue: 39,   // Swapped with yellow
};

export const HOME_ENTRANCE: Record<PlayerColor, number> = {
  red: 50,
  green: 11,
  yellow: 24, // Swapped with blue
  blue: 37,   // Swapped with yellow
};

export const HOME_PATH_START_INDEX = 101;
export const TOTAL_PATH_LENGTH = 52;
export const HOME_PATH_LENGTH = 6;
export const FINISHED_POSITION = 200;
export const BASE_POSITION = -1;

export const SAFE_SPOTS = [0, 8, 13, 21, 26, 34, 39, 47];

// Grid coordinates for the board layout (15x15 grid, 1-indexed)
export const BOARD_LAYOUT: { [key: number]: { row: number, col: number } } = {
  // Path from Red Start (left arm)
  0: { row: 7, col: 2 }, 1: { row: 7, col: 3 }, 2: { row: 7, col: 4 }, 3: { row: 7, col: 5 }, 4: { row: 7, col: 6 },
  5: { row: 6, col: 7 }, 6: { row: 5, col: 7 }, 7: { row: 4, col: 7 }, 8: { row: 3, col: 7 }, 9: { row: 2, col: 7 },
  10: { row: 1, col: 7 }, 11: { row: 1, col: 8 }, 12: { row: 1, col: 9 },

  // Path from Green Start (top arm)
  13: { row: 2, col: 9 }, 14: { row: 3, col: 9 }, 15: { row: 4, col: 9 }, 16: { row: 5, col: 9 }, 17: { row: 6, col: 9 },
  18: { row: 7, col: 10 }, 19: { row: 7, col: 11 }, 20: { row: 7, col: 12 }, 21: { row: 7, col: 13 }, 22: { row: 7, col: 14 },
  23: { row: 7, col: 15 }, 24: { row: 8, col: 15 }, 25: { row: 9, col: 15 },

  // Path from Yellow Start (right arm)
  26: { row: 9, col: 14 }, 27: { row: 9, col: 13 }, 28: { row: 9, col: 12 }, 29: { row: 9, col: 11 }, 30: { row: 9, col: 10 },
  31: { row: 10, col: 9 }, 32: { row: 11, col: 9 }, 33: { row: 12, col: 9 }, 34: { row: 13, col: 9 }, 35: { row: 14, col: 9 },
  36: { row: 15, col: 9 }, 37: { row: 15, col: 8 }, 38: { row: 15, col: 7 },

  // Path from Blue Start (bottom arm)
  39: { row: 14, col: 7 }, 40: { row: 13, col: 7 }, 41: { row: 12, col: 7 }, 42: { row: 11, col: 7 }, 43: { row: 10, col: 7 },
  44: { row: 9, col: 6 }, 45: { row: 9, col: 5 }, 46: { row: 9, col: 4 }, 47: { row: 9, col: 3 }, 48: { row: 9, col: 2 },
  49: { row: 9, col: 1 }, 50: { row: 8, col: 1 }, 51: { row: 7, col: 1 },
};

export const HOME_PATHS: Record<PlayerColor, { [key: number]: { row: number, col: number } }> = {
    red: {
      101: { row: 8, col: 2 }, 102: { row: 8, col: 3 }, 103: { row: 8, col: 4 }, 104: { row: 8, col: 5 }, 105: { row: 8, col: 6 }, 106: { row: 8, col: 7 }
    },
    green: {
      101: { row: 2, col: 8 }, 102: { row: 3, col: 8 }, 103: { row: 4, col: 8 }, 104: { row: 5, col: 8 }, 105: { row: 6, col: 8 }, 106: { row: 7, col: 8 }
    },
    yellow: { // This was blue's home path
      101: { row: 8, col: 14 }, 102: { row: 8, col: 13 }, 103: { row: 8, col: 12 }, 104: { row: 8, col: 11 }, 105: { row: 8, col: 10 }, 106: { row: 8, col: 9 }
    },
    blue: { // This was yellow's home path
      101: { row: 14, col: 8 }, 102: { row: 13, col: 8 }, 103: { row: 12, col: 8 }, 104: { row: 11, col: 8 }, 105: { row: 10, col: 8 }, 106: { row: 9, col: 8 }
    }
  };
  
export const BASE_POSITIONS: Record<PlayerColor, { row: number, col: number }[]> = {
  red: [{ row: 3, col: 3 }, { row: 3, col: 4 }, { row: 4, col: 3 }, { row: 4, col: 4 }],
  green: [{ row: 3, col: 12 }, { row: 3, col: 13 }, { row: 4, col: 12 }, { row: 4, col: 13 }],
  yellow: [{ row: 12, col: 12 }, { row: 12, col: 13 }, { row: 13, col: 12 }, { row: 13, col: 13 }], // Was blue
  blue: [{ row: 12, col: 3 }, { row: 12, col: 4 }, { row: 13, col: 3 }, { row: 13, col: 4 }], // Was yellow
};