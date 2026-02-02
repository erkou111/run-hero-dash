import { Trophy, RotateCcw, Home, Star, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameOverScreenProps {
  score: number;
  coins: number;
  isWin?: boolean;
  mode: 'endless' | 'level' | 'ranked';
  level?: number;
  rank?: number;
  onRestart: () => void;
}

const GameOverScreen = ({ score, coins, isWin, mode, level, rank, onRestart }: GameOverScreenProps) => {
  const navigate = useNavigate();
  const isNewHighScore = Math.random() > 0.7; // Simulated

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md">
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${isWin ? 'bg-neon-gold' : 'bg-neon-magenta'} opacity-30`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center animate-scale-in">
        {/* Title */}
        <div className="mb-8">
          {isWin ? (
            <>
              <Trophy className="w-20 h-20 mx-auto mb-4 text-neon-gold animate-pulse-glow" />
              <h1 className="font-display text-5xl md:text-6xl text-neon-gold animate-launch-pulse">
                {mode === 'level' ? '关卡通过!' : '胜利!'}
              </h1>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-6xl">💀</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl text-neon-magenta animate-launch-pulse">
                游戏结束
              </h1>
            </>
          )}
          
          {isNewHighScore && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-neon-gold fill-neon-gold" />
              <span className="font-display text-lg text-neon-gold">新纪录!</span>
              <Star className="w-5 h-5 text-neon-gold fill-neon-gold" />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="cyber-panel rounded-2xl p-6 mb-8 max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground font-game mb-1">最终得分</p>
              <p className="font-display text-3xl text-neon-cyan">{score.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Coins className="w-4 h-4 text-neon-gold" />
                <p className="text-sm text-muted-foreground font-game">获得金币</p>
              </div>
              <p className="font-display text-3xl text-neon-gold">{coins}</p>
            </div>
          </div>

          {mode === 'level' && (
            <div className="mt-4 p-3 rounded-lg bg-neon-magenta/10 border border-neon-magenta/30">
              <p className="font-display text-neon-magenta">
                关卡 {level} {isWin ? '完成' : '失败'}
              </p>
            </div>
          )}

          {mode === 'ranked' && rank && (
            <div className="mt-4 p-3 rounded-lg bg-neon-gold/10 border border-neon-gold/30">
              <p className="font-display text-neon-gold">
                本场排名: 第 {rank} 名
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 cyber-button rounded-xl"
          >
            <RotateCcw className="w-5 h-5" />
            <span>再来一次</span>
          </button>
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-muted border border-border hover:border-neon-cyan/50 transition-all font-display text-foreground"
          >
            <Home className="w-5 h-5" />
            <span>返回主页</span>
          </button>
        </div>

        {/* Rewards preview */}
        <div className="mt-8 text-sm text-muted-foreground font-game">
          <p>获得奖励: +{Math.floor(score / 100)} 经验值</p>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
