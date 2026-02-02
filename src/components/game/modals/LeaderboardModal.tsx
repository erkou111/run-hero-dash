import { useState } from 'react';
import GameModal from '../GameModal';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const modes = ['无尽模式', '关卡模式', '排位模式'];

const leaderboardData = [
  { rank: 1, name: '极速王者', score: 999999, level: 99 },
  { rank: 2, name: '光之使者', score: 888888, level: 87 },
  { rank: 3, name: '暗夜之王', score: 777777, level: 82 },
  { rank: 4, name: '星际猎人', score: 666666, level: 76 },
  { rank: 5, name: '闪电战士', score: 555555, level: 71 },
  { rank: 6, name: '影子刺客', score: 444444, level: 65 },
  { rank: 7, name: '宇宙漫游', score: 333333, level: 58 },
  { rank: 8, name: '极限玩家', score: 222222, level: 52 },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-neon-gold" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
  if (rank === 3) return <Award className="w-5 h-5 text-accent" />;
  return <span className="w-5 h-5 flex items-center justify-center text-sm font-display text-muted-foreground">{rank}</span>;
};

const LeaderboardModal = ({ isOpen, onClose }: LeaderboardModalProps) => {
  const [activeMode, setActiveMode] = useState(0);

  return (
    <GameModal isOpen={isOpen} onClose={onClose} title="排行榜">
      <div className="space-y-3">
        {/* Mode tabs */}
        <div className="flex gap-1">
          {modes.map((mode, i) => (
            <button
              key={mode}
              onClick={() => setActiveMode(i)}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-game transition-all ${
                activeMode === i
                  ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan'
                  : 'bg-muted/50 border border-border text-muted-foreground'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Leaderboard list */}
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {leaderboardData.map((player) => (
            <div
              key={player.rank}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                player.rank <= 3 ? 'bg-neon-gold/10 border border-neon-gold/30' : 'bg-muted/30'
              }`}
            >
              <div className="w-8 flex justify-center">{getRankIcon(player.rank)}</div>
              <div className="flex-1">
                <span className="font-game text-foreground">{player.name}</span>
                <span className="ml-2 text-xs text-neon-gold font-display">Lv.{player.level}</span>
              </div>
              <span className="font-display text-sm text-neon-cyan">{player.score.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Your rank */}
        <div className="p-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30">
          <div className="flex items-center justify-between">
            <span className="font-game text-foreground">我的排名</span>
            <span className="font-display text-neon-cyan">#156</span>
          </div>
        </div>
      </div>
    </GameModal>
  );
};

export default LeaderboardModal;
