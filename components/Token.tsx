
import React from 'react';
import { PLAYER_COLORS } from '../constants';
import type { PlayerColor } from '../types';

interface TokenProps {
  color: PlayerColor;
  onClick: () => void;
  isMovable: boolean;
}

export const Token: React.FC<TokenProps> = ({ color, onClick, isMovable }) => {
  const colorClasses = PLAYER_COLORS[color];

  return (
    <div
      className={`w-full h-full p-1 rounded-full flex items-center justify-center token
        ${isMovable ? 'cursor-pointer animate-pulse' : ''}`}
      onClick={onClick}
    >
      <div
        className={`w-full h-full rounded-full ${colorClasses.token} border-2 border-slate-300/80 shadow-md transform transition-transform 
          ${isMovable ? 'scale-110 shadow-lg shadow-white/50' : ''}`}
      ></div>
    </div>
  );
};