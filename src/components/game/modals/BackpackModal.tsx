import GameModal from '../GameModal';
import { Shirt, Zap, Shield, Star } from 'lucide-react';

interface BackpackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inventoryItems = [
  { id: 1, name: '默认皮肤', quantity: 1, type: 'skin', icon: Shirt, equipped: true },
  { id: 2, name: '体力药水', quantity: 15, type: 'consumable', icon: Zap },
  { id: 3, name: '护盾道具', quantity: 3, type: 'item', icon: Shield },
  { id: 4, name: '经验加成卡', quantity: 2, type: 'boost', icon: Star },
];

const BackpackModal = ({ isOpen, onClose }: BackpackModalProps) => {
  return (
    <GameModal isOpen={isOpen} onClose={onClose} title="背包">
      <div className="space-y-2">
        {inventoryItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-xl bg-muted/50 border transition-all ${
              item.equipped 
                ? 'border-neon-cyan shadow-[0_0_10px_hsl(180_100%_50%/0.3)]' 
                : 'border-border hover:border-neon-cyan/50'
            }`}
          >
            <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center">
              <item.icon className="w-6 h-6 text-neon-cyan" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-game text-foreground">{item.name}</span>
                {item.equipped && (
                  <span className="text-xs px-2 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan font-display">
                    装备中
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">数量: {item.quantity}</span>
            </div>
            {!item.equipped && (
              <button className="px-3 py-1 text-xs cyber-button rounded-lg">
                使用
              </button>
            )}
          </div>
        ))}
      </div>
    </GameModal>
  );
};

export default BackpackModal;
