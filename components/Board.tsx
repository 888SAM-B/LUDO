import React from 'react';
import { Token as TokenComponent } from './Token';
import { useGameStore } from '../store/gameStore';
import {
  BOARD_LAYOUT,
  HOME_PATHS,
  BASE_POSITIONS,
  PLAYER_COLORS,
  SAFE_SPOTS,
  START_POSITIONS
} from '../constants';
import type { PlayerColor } from '../types';

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const Board: React.FC = () => {
  const { players, validMoves, actions } = useGameStore();
  const { moveToken } = actions;

  const cells = Array.from({ length: 15 * 15 });

  const renderTokens = () => {
    return players.flatMap(player =>
      player.tokens.map((token, tokenIndex) => {
        let gridPos;
        if (token.position === -1) {
          gridPos = BASE_POSITIONS[player.id][tokenIndex];
        } else if (token.position >= 101 && token.position < 200) {
          gridPos = HOME_PATHS[player.id][token.position];
        } else if (token.position < 101) {
          const boardKey = Object.keys(BOARD_LAYOUT).map(Number).find(key => key === token.position);
          if (boardKey !== undefined) gridPos = BOARD_LAYOUT[boardKey];
        }

        if (!gridPos || token.position === 200) return null;
        const isMovable = validMoves.includes(token.id);

        return (
          <div
            key={token.id}
            className="absolute transition-all duration-500 ease-in-out token"
            style={{
              top: `calc(${((gridPos.row - 1) / 15) * 100}% + 2px)`,
              left: `calc(${((gridPos.col - 1) / 15) * 100}% + 2px)`,
              width: 'calc(100% / 10)',
              height: 'calc(100% / 10)',
            }}
          >
            <TokenComponent
              color={player.id}
              onClick={() => isMovable && moveToken(token.id)}
              isMovable={isMovable}
            />
          </div>
        );
      })
    );
  };

 // Board.tsx la return section modify pannunga
return (
  <div className="flex items-center justify-center  w-full bg-gradient-to-br from-slate-800 via-slate-900 to-black ">
    <div className="relative w-[90vw] h-[90vw] md:w-[600px] md:h-[600px] bg-white border-4 border-black rounded-2xl shadow-2xl shadow-cyan-500/20 p-2 try">
      {/* ...rest of your board code... */}
      <div className="main-culprit">
        {cells.map((_, i) => {
          // your existing cell rendering logic
        })}
      </div>

      {/* Center Goal Overlay */}
      {/* <div className="absolute top-1/2 left-1/2 w-[20%] h-[20%] -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 grid-rows-2">
        <div className={`${PLAYER_COLORS.red.path} clip-triangle-tl`}></div>
        <div className={`${PLAYER_COLORS.yellow.path} clip-triangle-tr`}></div>
        <div className={`${PLAYER_COLORS.green.path} clip-triangle-bl`}></div>
        <div className={`${PLAYER_COLORS.blue.path} clip-triangle-br`}></div>
      </div> */}

      {renderTokens()}
    </div>
  </div>
);

};
