
import React from 'react';
import type { PlayerColor } from '../types';
import { PLAYER_COLORS } from '../constants';

interface WinnerModalProps {
  winnerColor: PlayerColor;
  onPlayAgain: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({ winnerColor, onPlayAgain }) => {
  const colorClass = PLAYER_COLORS[winnerColor];
  const winnerName = winnerColor.charAt(0).toUpperCase() + winnerColor.slice(1);
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 border-2 border-cyan-400 rounded-xl shadow-2xl p-8 text-center animate-fade-in-up">
        <h2 className="text-4xl font-bold mb-4">
          <span className={`${colorClass.text}`}>{winnerName}</span> Wins!
        </h2>
        <p className="text-lg text-slate-300 mb-8">Congratulations!</p>
        <button
          onClick={onPlayAgain}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105"
        >
          Play Again
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};