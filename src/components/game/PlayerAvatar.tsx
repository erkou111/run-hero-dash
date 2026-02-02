import { User } from 'lucide-react';

interface PlayerAvatarProps {
  avatarUrl?: string;
  name: string;
  level: number;
  onClick: () => void;
}

const PlayerAvatar = ({ avatarUrl, name, level, onClick }: PlayerAvatarProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-xl bg-card/80 border border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_20px_hsl(180_100%_50%/0.3)] transition-all duration-300"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden neon-border">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <span className="absolute -bottom-1 -right-1 w-6 h-6 flex items-center justify-center bg-neon-gold text-primary-foreground text-xs font-bold rounded-full font-display">
          {level}
        </span>
      </div>
      <div className="text-left">
        <p className="text-sm font-display text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground font-game">点击查看资料</p>
      </div>
    </button>
  );
};

export default PlayerAvatar;
