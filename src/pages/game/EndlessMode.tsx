import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pause, Play, Home } from 'lucide-react';
import GameEngine from '@/components/game/GameEngine';
import GameOverScreen from '@/components/game/GameOverScreen';

const EndlessMode = () => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalCoins, setFinalCoins] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  const handleGameEnd = useCallback((score: number, coins: number) => {
    setFinalScore(score);
    setFinalCoins(coins);
    setGameOver(true);
  }, []);

  const handleRestart = () => {
    setGameOver(false);
    setFinalScore(0);
    setFinalCoins(0);
    setGameKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/80 border border-border hover:border-neon-cyan/50 transition-all"
        >
          <Home className="w-4 h-4" />
          <span className="font-game text-sm">返回</span>
        </button>
        
        <h1 className="font-display text-2xl text-primary">无尽模式</h1>
        
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/80 border border-border hover:border-neon-cyan/50 transition-all"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span className="font-game text-sm">{isPaused ? '继续' : '暂停'}</span>
        </button>
      </div>

      {/* Game area */}
      <div className="relative">
        <GameEngine
          key={gameKey}
          mode="endless"
          onGameEnd={handleGameEnd}
          isPaused={isPaused}
        />
        
        {/* Pause overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <div className="text-center">
              <h2 className="font-display text-3xl text-primary mb-4">游戏暂停</h2>
              <button
                onClick={() => setIsPaused(false)}
                className="px-6 py-3 cyber-button rounded-xl"
              >
                继续游戏
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Game over screen */}
      {gameOver && (
        <GameOverScreen
          score={finalScore}
          coins={finalCoins}
          mode="endless"
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default EndlessMode;
