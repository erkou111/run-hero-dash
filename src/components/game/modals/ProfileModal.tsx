import { useState } from 'react';
import GameModal from '../GameModal';
import { User, Edit2, Trophy, Target, Clock, Check } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const stats = [
  { icon: Trophy, label: '最高分', value: '156,789' },
  { icon: Target, label: '总游戏次数', value: '342' },
  { icon: Clock, label: '总游戏时长', value: '48小时' },
];

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('赛博玩家');

  return (
    <GameModal isOpen={isOpen} onClose={onClose} title="个人资料">
      <div className="space-y-4">
        {/* Avatar section */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full neon-border overflow-hidden bg-muted flex items-center justify-center">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-neon-cyan text-primary-foreground">
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
          
          {/* Name */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-1 rounded-lg bg-muted border border-neon-cyan focus:outline-none font-game text-foreground text-center"
                  autoFocus
                />
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 rounded-lg bg-neon-green text-primary-foreground"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <span className="font-display text-xl text-foreground">{name}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-0.5 rounded bg-neon-gold/20 text-neon-gold font-display">Lv.28</span>
            <span className="text-muted-foreground font-game">UID: 12345678</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {stats.map((stat) => (
            <div key={stat.label} className="p-3 rounded-xl bg-muted/50 text-center">
              <stat.icon className="w-5 h-5 mx-auto mb-1 text-neon-cyan" />
              <p className="font-display text-lg text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-game">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent records */}
        <div>
          <h3 className="font-display text-sm text-muted-foreground mb-2">最近战绩</h3>
          <div className="space-y-1">
            {[
              { mode: '无尽模式', score: 45678, date: '今天' },
              { mode: '排位模式', score: 23456, date: '昨天', rank: '#2' },
              { mode: '关卡模式', score: 'Lv.45', date: '2天前' },
            ].map((record, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-game text-foreground">{record.mode}</span>
                  {record.rank && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-neon-gold/20 text-neon-gold">{record.rank}</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-display text-neon-cyan">{record.score}</span>
                  <span className="text-xs text-muted-foreground ml-2">{record.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameModal>
  );
};

export default ProfileModal;
