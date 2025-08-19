
import React, { useState } from 'react';

interface GameControlsProps {
  onStart: (playerCount: number, botCount: number) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ onStart }) => {
  const [playerCount, setPlayerCount] = useState(4);
  const [botCount, setBotCount] = useState(1);

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlayerCount = parseInt(e.target.value);
    setPlayerCount(newPlayerCount);
    if (botCount > newPlayerCount - 1) {
      setBotCount(newPlayerCount - 1);
    }
  };

  const handleBotCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBotCount(parseInt(e.target.value));
  };

  const handleStart = () => {
    onStart(playerCount, botCount);
  };

  return (
    <div className="bg-slate-700/50 p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300">New Game</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="playerCount" className="block text-lg mb-2 text-slate-300">Number of Players</label>
          <select
            id="playerCount"
            value={playerCount}
            onChange={handlePlayerCountChange}
            className="w-full p-2 rounded bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="2">2 Players</option>
            <option value="3">3 Players</option>
            <option value="4">4 Players</option>
          </select>
        </div>
        <div>
          <label htmlFor="botCount" className="block text-lg mb-2 text-slate-300">Number of Bots</label>
          <select
            id="botCount"
            value={botCount}
            onChange={handleBotCountChange}
            className="w-full p-2 rounded bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {[...Array(playerCount)].map((_, i) => (
              <option key={i} value={i}>{i} Bots</option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleStart}
        className="mt-8 w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-3 px-4 rounded-lg text-xl transition-transform transform hover:scale-105"
      >
        Start Game
      </button>
    </div>
  );
};