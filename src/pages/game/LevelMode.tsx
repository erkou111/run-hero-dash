import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Pause, Play, Home, ChevronRight } from 'lucide-react';
import GameEngine from '@/components/game/GameEngine';
import GameOverScreen from '@/components/game/GameOverScreen';

const LevelMode = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialLevel = parseInt(searchParams.get('level') || '1', 10);
  
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalCoins, setFinalCoins] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [showLevelSelect, setShowLevelSelect] = useState(true);

  const handleGameEnd = useCallback((score: number, coins: number, win?: boolean) => {
    setFinalScore(score);
    setFinalCoins(coins);
    setIsWin(win || false);
    setGameOver(true);
  }, []);

  const handleRestart = () => {
    setGameOver(false);
    setFinalScore(0);
    setFinalCoins(0);
    setGameKey((prev) => prev + 1);
  };

  const handleNextLevel = () => {
    if (currentLevel < 100) {
      setCurrentLevel((prev) => prev + 1);
      setGameOver(false);
      setGameKey((prev) => prev + 1);
    }
  };

  const handleSelectLevel = (level: number) => {
    setCurrentLevel(level);
    setShowLevelSelect(false);
    setGameKey((prev) => prev + 1);
  };

  // Level select screen
  if (showLevelSelect) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/80 border border-border hover:border-neon-cyan/50 transition-all"
            >
              <Home className="w-4 h-4" />
              <span className="font-game text-sm">返回</span>
            </button>
            <h1 className="font-display text-3xl text-primary">选择关卡</h1>
            <div className="w-24" />
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {[...Array(100)].map((_, i) => {
              const level = i + 1;
              const isUnlocked = level <= 10; // Simulated: first 10 levels unlocked
              const isCompleted = level <= 5; // Simulated: first 5 completed
              
              return (
                <button
                  key={level}
                  onClick={() => isUnlocked && handleSelectLevel(level)}
                  disabled={!isUnlocked}
                  className={`aspect-square rounded-lg font-display text-sm transition-all ${
                    isCompleted
                      ? 'bg-neon-green/20 border-2 border-neon-green text-neon-green hover:shadow-[0_0_15px_hsl(120_100%_50%/0.3)]'
                      : isUnlocked
                      ? 'bg-card border-2 border-neon-cyan/50 text-foreground hover:border-neon-cyan hover:shadow-[0_0_15px_hsl(180_100%_50%/0.3)]'
                      : 'bg-muted/30 border border-border text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-4 text-sm font-game">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-neon-green/20 border border-neon-green" />
              <span className="text-muted-foreground">已完成</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-card border border-neon-cyan/50" />
              <span className="text-muted-foreground">可挑战</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted/30 border border-border" />
              <span className="text-muted-foreground">未解锁</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <button
          onClick={() => setShowLevelSelect(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/80 border border-border hover:border-neon-cyan/50 transition-all"
        >
          <Home className="w-4 h-4" />
          <span className="font-game text-sm">关卡选择</span>
        </button>
        
        <h1 className="font-display text-2xl text-neon-magenta">关卡 {currentLevel}</h1>
        
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
          mode="level"
          level={currentLevel}
          onGameEnd={handleGameEnd}
          isPaused={isPaused}
        />
        
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
        <div className="fixed inset-0 z-50">
          <GameOverScreen
            score={finalScore}
            coins={finalCoins}
            isWin={isWin}
            mode="level"
            level={currentLevel}
            onRestart={handleRestart}
          />
          {isWin && currentLevel < 100 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
              <button
                onClick={handleNextLevel}
                className="flex items-center gap-2 px-6 py-3 cyber-button-gold rounded-xl"
              >
                <span>下一关</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LevelMode;
