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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const HomeGoal = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
    {/* These colors are hardcoded to match the new vibrant Tailwind palette */}
    <polygon points="0,0 100,0 50,50" style={{fill: '#22c55e'}} /> {/* Green */}
    <polygon points="100,0 100,100 50,50" style={{fill: '#facc15'}} /> {/* Yellow */}
    <polygon points="0,100 100,100 50,50" style={{fill: '#0ea5e6'}} /> {/* Blue */}
    <polygon points="0,0 0,100 50,50" style={{fill: '#ef4444'}} /> {/* Red */}
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
        if (token.position === -1) { // In base
          gridPos = BASE_POSITIONS[player.id][tokenIndex];
        } else if (token.position >= 101 && token.position < 200) { // Home path
          gridPos = HOME_PATHS[player.id][token.position];
        } else if (token.position < 101) { // Main path
          const pathKeys = Object.keys(BOARD_LAYOUT).map(Number);
          const boardKey = pathKeys.find(key => key === token.position);
          if (boardKey !== undefined) {
             gridPos = BOARD_LAYOUT[boardKey];
          }
        }

        if (!gridPos || token.position === 200) return null;

        const isMovable = validMoves.includes(token.id);
        
        return (
          <div
            key={token.id}
            className="absolute transition-all duration-500 ease-in-out"
            style={{
              top: `calc(${((gridPos.row - 1) / 15) * 100}% + 2px)`,
              left: `calc(${((gridPos.col - 1) / 15) * 100}% + 2px)`,
              width: 'calc(100% / 15)',
              height: 'calc(100% / 15)',
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

  const getCellInfo = (row: number, col: number) => {
    // 1. Center Goal area
    if (row >= 7 && row <= 9 && col >= 7 && col <= 9) {
        return { bgColor: 'bg-transparent', content: null };
    }

    // 2. Bases
    if (row <= 6 && col <= 6) { // Red
        return { bgColor: (row >= 2 && row <= 5 && col >= 2 && col <= 5) ? 'bg-white' : PLAYER_COLORS.red.base, content: null };
    }
    if (row <= 6 && col >= 10) { // Green
        return { bgColor: (row >= 2 && row <= 5 && col >= 11 && col <= 14) ? 'bg-white' : PLAYER_COLORS.green.base, content: null };
    }
    if (row >= 10 && col >= 10) { // Yellow
        return { bgColor: (row >= 11 && row <= 14 && col >= 11 && col <= 14) ? 'bg-white' : PLAYER_COLORS.yellow.base, content: null };
    }
    if (row >= 10 && col <= 6) { // Blue
        return { bgColor: (row >= 11 && row <= 14 && col >= 2 && col <= 5) ? 'bg-white' : PLAYER_COLORS.blue.base, content: null };
    }

    // 3. Home paths
    const homePathColor = (Object.keys(HOME_PATHS) as PlayerColor[]).find(color => 
        Object.values(HOME_PATHS[color]).some(pos => pos.row === row && pos.col === col)
    );
    if (homePathColor) {
        return { bgColor: PLAYER_COLORS[homePathColor].path, content: null };
    }
    
    // 4. Main path
    const pathIndexStr = Object.keys(BOARD_LAYOUT).find(key => BOARD_LAYOUT[Number(key)].row === row && BOARD_LAYOUT[Number(key)].col === col);
    if (pathIndexStr) {
        const pathIndex = Number(pathIndexStr);
        const startColor = (Object.keys(START_POSITIONS) as PlayerColor[]).find(c => START_POSITIONS[c] === pathIndex);
        const bgColor = startColor ? PLAYER_COLORS[startColor].path : 'bg-white';
        const content = SAFE_SPOTS.includes(pathIndex) ? <StarIcon /> : null;
        return { bgColor, content };
    }

    // Default for any other cell
    return { bgColor: 'bg-transparent', content: null };
  };

  return (
    <div className="relative w-[90vw] h-[90vw] md:w-[600px] md:h-[600px] border-4 border-black rounded-2xl shadow-lg">
      <div className="grid grid-cols-15 grid-rows-15 w-full h-full">
        {cells.map((_, i) => {
          const row = Math.floor(i / 15) + 1;
          const col = (i % 15) + 1;
          const { bgColor, content } = getCellInfo(row, col);
          
          return (
            <div key={i} className={`w-full h-full flex items-center justify-center ${bgColor} border border-slate-300`}>
              {content}
            </div>
          );
        })}
      </div>
       {/* Center Goal Overlay */}
       <div 
        className="absolute pointer-events-none"
        style={{
            top: 'calc(6 * 100% / 15)',
            left: 'calc(6 * 100% / 15)',
            width: 'calc(3 * 100% / 15)',
            height: 'calc(3 * 100% / 15)',
        }}
      >
        <HomeGoal />
      </div>
      {renderTokens()}
    </div>
  );
};