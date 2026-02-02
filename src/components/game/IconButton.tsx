import { ReactNode } from 'react';

interface IconButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  badge?: number;
  variant?: 'default' | 'gold' | 'magenta';
}

const IconButton = ({ icon, label, onClick, badge, variant = 'default' }: IconButtonProps) => {
  const variantStyles = {
    default: 'border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_20px_hsl(180_100%_50%/0.5)]',
    gold: 'border-neon-gold/30 hover:border-neon-gold hover:shadow-[0_0_20px_hsl(45_100%_55%/0.5)]',
    magenta: 'border-neon-magenta/30 hover:border-neon-magenta hover:shadow-[0_0_20px_hsl(300_100%_60%/0.5)]',
  };

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all duration-300 bg-card/80 border ${variantStyles[variant]} hover:-translate-y-1`}
    >
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-destructive text-destructive-foreground text-xs font-bold rounded-full">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      <div className="text-foreground">{icon}</div>
      <span className="text-xs font-game text-muted-foreground">{label}</span>
    </button>
  );
};

export default IconButton;
