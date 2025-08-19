
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameState } from '../types';

interface DiceProps {
  isRolling: boolean;
}

export const Dice: React.FC<DiceProps> = ({ isRolling }) => {
  const { diceValue, gameState, currentPlayerIndex, players, actions } = useGameStore();
  const { rollDice } = actions;
  const [displayValue, setDisplayValue] = useState(1);
  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 50);
      return () => clearInterval(interval);
    } else {
      setDisplayValue(diceValue || 1);
    }
  }, [isRolling, diceValue]);
  
  const canRoll = gameState === GameState.ROLLING && !currentPlayer.isBot;

  const DiceFace = ({ value }: { value: number }) => {
    const pips = Array.from({ length: value }, (_, i) => (
      <div key={i} className={`pip dot-${value}-${i+1}`}></div>
    ));

    return <div className={`face face-${value}`}>{pips}</div>;
  };
  
  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-slate-700/50 shadow-lg">
      <h3 className="text-xl font-bold text-cyan-300">Dice</h3>
      <div
        onClick={canRoll ? rollDice : undefined}
        className={`relative w-24 h-24 perspective-800 ${canRoll ? 'cursor-pointer hover:scale-105' : 'opacity-70'}`}
      >
         <style>{`
          .face { position: absolute; width: 100%; height: 100%; display: flex; flex-wrap: wrap; justify-content: space-around; align-items: space-around; padding: 1rem; border: 2px solid #67e8f9; border-radius: 10px; background: #1e293b; color: white; }
          .pip { width: 1.25rem; height: 1.25rem; background-color: white; border-radius: 50%; box-shadow: 0 0 5px #fff; }
          .face-1 { justify-content: center; align-items: center; }
          .face-2 { justify-content: space-between; } .dot-2-1 { align-self: flex-start; } .dot-2-2 { align-self: flex-end; }
          .face-3 { justify-content: space-between; } .dot-3-1 { align-self: flex-start; } .dot-3-2 { align-self: center; } .dot-3-3 { align-self: flex-end; }
          .face-4 .pip { width: 1rem; height: 1rem; }
          .face-5 .pip { width: 1rem; height: 1rem; }
          .dot-5-3 { align-self: center; }
          .face-6 .pip { width: 1rem; height: 1rem; }
         `}</style>
        <DiceFace value={displayValue} />
      </div>
      <p className="text-sm text-slate-400 h-6">
        {gameState === GameState.ROLLING ? "Click dice to roll" : "Select a token to move"}
      </p>
    </div>
  );
};