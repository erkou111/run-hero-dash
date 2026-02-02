import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameModal from '../GameModal';
import { Infinity, Layers, Trophy, Sparkles, Users } from 'lucide-react';

interface GameModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const modes = [
  {
    id: 'endless',
    name: '无尽模式',
    description: '挑战你的极限,看看能跑多远!',
    icon: Infinity,
    color: 'cyan',
    available: true,
    route: '/game/endless',
  },
  {
    id: 'level',
    name: '关卡模式',
    description: '100个关卡,由易到难,逐个突破!',
    icon: Layers,
    color: 'magenta',
    available: true,
    route: '/game/level',
  },
  {
    id: 'ranked',
    name: '排位模式',
    description: '多人竞技,争夺最高排名!',
    icon: Trophy,
    color: 'gold',
    available: true,
    route: '/game/ranked',
  },
  {
    id: 'other',
    name: '其他玩法',
    description: '敬请期待...',
    icon: Sparkles,
    color: 'purple',
    available: false,
    route: '',
  },
];

const colorMap = {
  cyan: 'border-neon-cyan hover:shadow-[0_0_20px_hsl(180_100%_50%/0.4)] bg-neon-cyan/10',
  magenta: 'border-neon-magenta hover:shadow-[0_0_20px_hsl(300_100%_60%/0.4)] bg-neon-magenta/10',
  gold: 'border-neon-gold hover:shadow-[0_0_20px_hsl(45_100%_55%/0.4)] bg-neon-gold/10',
  purple: 'border-neon-purple/50 bg-muted/50',
};

const iconColorMap = {
  cyan: 'text-neon-cyan',
  magenta: 'text-neon-magenta',
  gold: 'text-neon-gold',
  purple: 'text-neon-purple/50',
};

const GameModeModal = ({ isOpen, onClose }: GameModeModalProps) => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [rankedTeamSize, setRankedTeamSize] = useState(1);

  const handleModeSelect = (modeId: string, available: boolean) => {
    if (!available) return;
    setSelectedMode(modeId);
  };

  const handleStart = () => {
    const mode = modes.find((m) => m.id === selectedMode);
    if (!mode || !mode.route) return;
    
    if (selectedMode === 'ranked') {
      navigate(`${mode.route}?team=${rankedTeamSize}`);
    } else {
      navigate(mode.route);
    }
    onClose();
  };

  return (
    <GameModal isOpen={isOpen} onClose={onClose} title="选择模式">
      <div className="space-y-4">
        {/* Mode selection */}
        <div className="grid grid-cols-2 gap-3">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeSelect(mode.id, mode.available)}
              disabled={!mode.available}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                colorMap[mode.color as keyof typeof colorMap]
              } ${
                selectedMode === mode.id
                  ? 'ring-2 ring-offset-2 ring-offset-background ring-current'
                  : ''
              } ${!mode.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <mode.icon className={`w-8 h-8 mb-2 ${iconColorMap[mode.color as keyof typeof iconColorMap]}`} />
              <h3 className="font-display text-foreground">{mode.name}</h3>
              <p className="text-xs text-muted-foreground font-game mt-1">{mode.description}</p>
            </button>
          ))}
        </div>

        {/* Ranked team size selector */}
        {selectedMode === 'ranked' && (
          <div className="p-4 rounded-xl bg-muted/50 border border-neon-gold/30">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-neon-gold" />
              <span className="font-game text-foreground">选择队伍人数</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((size) => (
                <button
                  key={size}
                  onClick={() => setRankedTeamSize(size)}
                  className={`flex-1 py-2 rounded-lg font-display transition-all ${
                    rankedTeamSize === size
                      ? 'bg-neon-gold text-primary-foreground'
                      : 'bg-muted border border-border text-foreground hover:border-neon-gold/50'
                  }`}
                >
                  {size === 1 ? '单排' : size === 2 ? '双排' : size === 3 ? '三排' : '四排'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!selectedMode}
          className={`w-full py-4 rounded-xl font-display text-xl tracking-wider transition-all ${
            selectedMode
              ? 'cyber-button-gold'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          开始游戏
        </button>
      </div>
    </GameModal>
  );
};

export default GameModeModal;
