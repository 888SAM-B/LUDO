
import React, { useState, useEffect } from 'react';
import { Board } from './components/Board';
import { PlayerInfo } from './components/PlayerInfo';
import { Dice } from './components/Dice';
import { WinnerModal } from './components/WinnerModal';
import { GameControls } from './components/GameControls';
import { useGameStore } from './store/gameStore';
import { getBotMove } from './utils/gameLogic';
import { GameState, type PlayerColor } from './types';
import '/src/globals.css';
const App: React.FC = () => {
  const {
    gameState,
    players,
    currentPlayerIndex,
    diceValue,
    winner,
    actions,
  } = useGameStore();

  const [isRolling, setIsRolling] = useState(false);
  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    const handleBotTurn = async () => {
      if (currentPlayer?.isBot && gameState !== GameState.GAME_OVER && !winner) {
        // Bot's turn to roll
        if (gameState === GameState.ROLLING) {
          setIsRolling(true);
          await new Promise(resolve => setTimeout(resolve, 1000));
          actions.rollDice();
          setIsRolling(false);
        }
        // Bot's turn to move
        else if (gameState === GameState.MOVING) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const bestMove = getBotMove(currentPlayer, diceValue, players);
          if (bestMove) {
            actions.moveToken(bestMove.tokenId);
          }
        }
      }
    };
    handleBotTurn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, currentPlayerIndex, currentPlayer?.isBot]);

  const handleStartGame = (playerCount: number, botCount: number) => {
    const playerColors: PlayerColor[] = ['red', 'green', 'blue', 'yellow'];
    const humanCount = playerCount - botCount;
    const isBot = (i: number) => i >= humanCount;
    
    actions.setupGame(
      Array.from({ length: playerCount }, (_, i) => ({
        id: playerColors[i],
        isBot: isBot(i),
      }))
    );
  };

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-1 font-sans">
      <header className="mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 tracking-wider" style={{ textShadow: '0 0 10px #22d3ee' }}>
          Ludo 
        </h1>
      </header>

      {gameState === GameState.LOBBY || gameState === GameState.GAME_OVER ? (
        <GameControls onStart={handleStartGame} />
      ) : (
        <main className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-7xl">
          <PlayerInfo />
          <div className="flex-shrink-0">
            <Board />
          </div>
          <div className="die">
          <Dice isRolling={isRolling} />
          </div>
        </main>
      )}

      {winner && <WinnerModal winnerColor={winner} onPlayAgain={() => handleStartGame(players.length, players.filter(p => p.isBot).length)} />}
    </div>
  );
};

export default App;