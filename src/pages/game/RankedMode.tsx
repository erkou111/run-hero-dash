import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Pause, Play, Home, Users, Trophy } from 'lucide-react';
import GameEngine from '@/components/game/GameEngine';
import GameOverScreen from '@/components/game/GameOverScreen';

interface Player {
  id: number;
  name: string;
  score: number;
  isYou: boolean;
}

const RankedMode = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamSize = parseInt(searchParams.get('team') || '1', 10);
  
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalCoins, setFinalCoins] = useState(0);
  const [playerRank, setPlayerRank] = useState(1);
  const [gameKey, setGameKey] = useState(0);
  const [showMatchmaking, setShowMatchmaking] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [players, setPlayers] = useState<Player[]>([]);

  // Simulate matchmaking
  useEffect(() => {
    if (showMatchmaking) {
      const playerNames = ['暗夜猎手', '极速闪电', '星际旅者', '影子刺客'];
      const simulatedPlayers: Player[] = [
        { id: 0, name: '你', score: 0, isYou: true },
        ...Array(teamSize * 2 - 1).fill(null).map((_, i) => ({
          id: i + 1,
          name: playerNames[i % playerNames.length],
          score: 0,
          isYou: false,
        })),
      ].slice(0, Math.min(4, teamSize * 2));
      
      setPlayers(simulatedPlayers);
      
      const timer = setTimeout(() => {
        setShowMatchmaking(false);
        startCountdown();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showMatchmaking, teamSize]);

  const startCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Simulate other players' scores
  useEffect(() => {
    if (!showMatchmaking && countdown === 0 && !gameOver && !isPaused) {
      const interval = setInterval(() => {
        setPlayers((prev) => 
          prev.map((p) => ({
            ...p,
            score: p.isYou ? finalScore : p.score + Math.floor(Math.random() * 100),
          }))
        );
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [showMatchmaking, countdown, gameOver, isPaused, finalScore]);

  const handleGameEnd = useCallback((score: number, coins: number) => {
    setFinalScore(score);
    setFinalCoins(coins);
    
    // Calculate rank
    const sortedPlayers = [...players]
      .map((p) => ({ ...p, score: p.isYou ? score : p.score }))
      .sort((a, b) => b.score - a.score);
    const rank = sortedPlayers.findIndex((p) => p.isYou) + 1;
    setPlayerRank(rank);
    setIsWin(rank === 1);
    setGameOver(true);
  }, [players]);

  const handleRestart = () => {
    setGameOver(false);
    setFinalScore(0);
    setFinalCoins(0);
    setShowMatchmaking(true);
    setGameKey((prev) => prev + 1);
  };

  // Matchmaking screen
  if (showMatchmaking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-neon-gold animate-pulse" />
          <h1 className="font-display text-3xl text-primary mb-4">匹配中...</h1>
          <p className="text-muted-foreground font-game mb-8">
            {teamSize === 1 ? '单排' : teamSize === 2 ? '双排' : teamSize === 3 ? '三排' : '四排'} 模式
          </p>
          <div className="flex justify-center gap-4">
            {players.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-xl ${
                  player.isYou ? 'bg-neon-cyan/20 border-2 border-neon-cyan' : 'bg-card border border-border'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-muted mx-auto mb-2" />
                <p className="font-game text-sm text-foreground">{player.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Countdown screen
  if (countdown > 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-8xl text-neon-cyan animate-pulse-glow">
            {countdown}
          </h1>
          <p className="text-muted-foreground font-game mt-4">准备开始!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/80 border border-border hover:border-neon-cyan/50 transition-all"
        >
          <Home className="w-4 h-4" />
          <span className="font-game text-sm">退出</span>
        </button>
        
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-neon-gold" />
          <h1 className="font-display text-2xl text-neon-gold">排位赛</h1>
        </div>
        
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/80 border border-border hover:border-neon-cyan/50 transition-all"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span className="font-game text-sm">{isPaused ? '继续' : '暂停'}</span>
        </button>
      </div>

      {/* Player scores sidebar */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 space-y-2 z-20">
        {[...players]
          .map((p) => ({ ...p, score: p.isYou ? finalScore : p.score }))
          .sort((a, b) => b.score - a.score)
          .map((player, index) => (
            <div
              key={player.id}
              className={`px-3 py-2 rounded-lg text-sm ${
                player.isYou
                  ? 'bg-neon-cyan/20 border border-neon-cyan'
                  : 'bg-card/80 border border-border'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-neon-gold">#{index + 1}</span>
                <span className="font-game text-foreground">{player.name}</span>
              </div>
              <p className="font-display text-xs text-muted-foreground">
                {player.score.toLocaleString()}
              </p>
            </div>
          ))}
      </div>

      {/* Game area */}
      <div className="relative">
        <GameEngine
          key={gameKey}
          mode="ranked"
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
        <GameOverScreen
          score={finalScore}
          coins={finalCoins}
          isWin={isWin}
          mode="ranked"
          rank={playerRank}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default RankedMode;
