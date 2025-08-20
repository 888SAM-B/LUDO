
import React from 'react';
import { useGameStore } from '../store/gameStore';
import { PLAYER_COLORS, FINISHED_POSITION } from '../constants';
import type { PlayerColor } from '../types';

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.157 2.376a1.5 1.5 0 011.686 0l4 2.5a1.5 1.5 0 010 2.648l-4 2.5a1.5 1.5 0 01-1.686 0l-4-2.5a1.5 1.5 0 010-2.648l4-2.5zM11 10.582l3.235-2.022L11 6.538 7.765 8.56 11 10.582zM2 11.5a1.5 1.5 0 011.5-1.5h13a1.5 1.5 0 010 3h-13A1.5 1.5 0 012 11.5zM4 15a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
)

export const PlayerInfo: React.FC = () => {
  const { players, currentPlayerIndex } = useGameStore();

  return (
    <div className="w-full lg:w-64 bg-slate-700/50 p-4 rounded-lg shadow-lg flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center text-cyan-300 border-b-2 border-cyan-400/30 pb-2 fflex-wrap">Players</h2>
      <div className="flex flex-row lg:flex-col gap-3 justify-center fflex-wrap">
        {players.map((player, index) => {
          const isActive = index === currentPlayerIndex;
          const colorClass = PLAYER_COLORS[player.id as PlayerColor];
          const tokensHome = player.tokens.filter(t => t.position === FINISHED_POSITION).length;
          
          return (
            <div
              key={player.id}
              className={`p-3 rounded-lg border-2 transition-all duration-300
                ${isActive ? `border-cyan-400 shadow-lg shadow-cyan-500/30 scale-105` : `border-transparent bg-slate-800/50`}
                `}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${colorClass.token} border-2 border-slate-300/50`}></div>
                <div className="flex-1">
                  <p className={`font-bold text-lg ${colorClass.text}`}>{player.name}{player.isBot && ' (Bot)'}</p>
                  <div className="flex items-center gap-1">
                     <TrophyIcon />
                     <p className="text-sm text-slate-300">{tokensHome} / 4</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};