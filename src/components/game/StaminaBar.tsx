import { Zap } from 'lucide-react';

interface StaminaBarProps {
  current: number;
  max: number;
}

const StaminaBar = ({ current, max }: StaminaBarProps) => {
  const percentage = (current / max) * 100;

  return (
    <div className="flex items-center gap-2">
      <Zap className="w-5 h-5 text-neon-green" />
      <div className="relative w-32 h-4 bg-muted rounded-full overflow-hidden border border-neon-green/30">
        <div
          className="absolute inset-y-0 left-0 stamina-bar rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-display text-foreground font-bold drop-shadow-lg">
            {current}/{max}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StaminaBar;
