import GameModal from '../GameModal';
import { Sparkles, Clock } from 'lucide-react';

interface GachaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GachaModal = ({ isOpen, onClose }: GachaModalProps) => {
  return (
    <GameModal isOpen={isOpen} onClose={onClose} title="抽奖">
      <div className="space-y-4">
        {/* Featured banner */}
        <div className="relative p-4 rounded-xl bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 border border-neon-magenta/50 overflow-hidden">
          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-neon-gold">
            <Clock className="w-3 h-3" />
            <span>剩余 2天 15小时</span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-neon-magenta animate-pulse-glow" />
            <div>
              <h3 className="font-display text-lg text-foreground">限定赛博皮肤池</h3>
              <p className="text-sm text-muted-foreground">限时UP! 概率提升3倍</p>
            </div>
          </div>
        </div>

        {/* Gacha buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 rounded-xl cyber-button flex flex-col items-center gap-2">
            <span className="font-display text-lg">单抽</span>
            <span className="text-sm opacity-80">100 💎</span>
          </button>
          <button className="p-4 rounded-xl cyber-button-gold flex flex-col items-center gap-2">
            <span className="font-display text-lg">十连抽</span>
            <span className="text-sm opacity-80">900 💎</span>
          </button>
        </div>

        {/* Probability info */}
        <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground font-game">
          <p>· SSR皮肤: 2% | SR道具: 10% | R道具: 88%</p>
          <p>· 保底: 50抽必出SSR</p>
        </div>
      </div>
    </GameModal>
  );
};

export default GachaModal;
