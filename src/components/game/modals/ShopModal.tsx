import GameModal from '../GameModal';
import { Shirt, Zap, Gift, Package } from 'lucide-react';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shopItems = [
  { id: 1, name: '霓虹战士皮肤', type: 'skin', price: 500, icon: Shirt, color: 'cyan' },
  { id: 2, name: '体力补充包x10', type: 'stamina', price: 100, icon: Zap, color: 'green' },
  { id: 3, name: '新手礼包', type: 'bundle', price: 299, icon: Gift, color: 'gold' },
  { id: 4, name: '终极赛博皮肤', type: 'skin', price: 1200, icon: Shirt, color: 'magenta' },
  { id: 5, name: '道具宝箱', type: 'bundle', price: 50, icon: Package, color: 'cyan' },
  { id: 6, name: '体力补充包x50', type: 'stamina', price: 400, icon: Zap, color: 'green' },
];

const colorMap = {
  cyan: 'border-neon-cyan/50 hover:border-neon-cyan hover:shadow-[0_0_15px_hsl(180_100%_50%/0.3)]',
  green: 'border-neon-green/50 hover:border-neon-green hover:shadow-[0_0_15px_hsl(120_100%_50%/0.3)]',
  gold: 'border-neon-gold/50 hover:border-neon-gold hover:shadow-[0_0_15px_hsl(45_100%_55%/0.3)]',
  magenta: 'border-neon-magenta/50 hover:border-neon-magenta hover:shadow-[0_0_15px_hsl(300_100%_60%/0.3)]',
};

const ShopModal = ({ isOpen, onClose }: ShopModalProps) => {
  return (
    <GameModal isOpen={isOpen} onClose={onClose} title="商城">
      <div className="grid grid-cols-2 gap-3">
        {shopItems.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl bg-muted/50 border transition-all cursor-pointer ${colorMap[item.color as keyof typeof colorMap]}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className="w-8 h-8 text-foreground" />
              <span className="text-sm font-game text-foreground">{item.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {item.type === 'skin' ? '皮肤' : item.type === 'stamina' ? '体力' : '礼包'}
              </span>
              <span className="text-sm font-display text-neon-gold">{item.price} 💎</span>
            </div>
          </div>
        ))}
      </div>
    </GameModal>
  );
};

export default ShopModal;
