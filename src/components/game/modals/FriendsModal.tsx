import GameModal from '../GameModal';
import { User, Gift, Circle } from 'lucide-react';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const friends = [
  { id: 1, name: '暗夜猎手', level: 45, online: true, lastActive: '在线' },
  { id: 2, name: '极速闪电', level: 32, online: true, lastActive: '在线' },
  { id: 3, name: '影子刺客', level: 28, online: false, lastActive: '2小时前' },
  { id: 4, name: '星际旅者', level: 51, online: false, lastActive: '1天前' },
];

const FriendsModal = ({ isOpen, onClose }: FriendsModalProps) => {
  return (
    <GameModal isOpen={isOpen} onClose={onClose} title="好友">
      <div className="space-y-2">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border hover:border-neon-cyan/50 transition-all"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-neon-cyan/30">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <Circle
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${
                  friend.online ? 'text-neon-green fill-neon-green' : 'text-muted-foreground fill-muted-foreground'
                }`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-game text-foreground">{friend.name}</span>
                <span className="text-xs text-neon-gold font-display">Lv.{friend.level}</span>
              </div>
              <span className="text-xs text-muted-foreground">{friend.lastActive}</span>
            </div>
            <button className="p-2 rounded-lg bg-neon-gold/20 hover:bg-neon-gold/30 transition-colors">
              <Gift className="w-4 h-4 text-neon-gold" />
            </button>
          </div>
        ))}
      </div>
    </GameModal>
  );
};

export default FriendsModal;
