import { useState } from 'react';

interface HeroDisplayProps {
  heroName: string;
  heroSkin: string;
}

const HeroDisplay = ({ heroName, heroSkin }: HeroDisplayProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex flex-col items-center justify-center h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Platform glow effect */}
      <div className="absolute bottom-0 w-48 h-4 bg-neon-cyan/30 rounded-full blur-xl" />
      
      {/* Hero character placeholder */}
      <div className={`relative transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}>
        {/* Character silhouette with glow */}
        <div className="relative w-40 h-64 flex items-end justify-center">
          {/* Glow behind character */}
          <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/20 to-transparent rounded-full blur-2xl" />
          
          {/* Character body - stylized runner */}
          <svg
            viewBox="0 0 100 160"
            className="w-full h-full animate-float"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Body glow */}
            <defs>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(180, 100%, 50%)" />
                <stop offset="100%" stopColor="hsl(300, 100%, 60%)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Head */}
            <circle cx="50" cy="25" r="15" fill="url(#bodyGradient)" filter="url(#glow)" />
            
            {/* Visor */}
            <rect x="38" y="20" width="24" height="8" rx="4" fill="hsl(180, 100%, 70%)" opacity="0.8" />
            
            {/* Torso */}
            <path
              d="M35 45 L50 40 L65 45 L62 85 L38 85 Z"
              fill="url(#bodyGradient)"
              filter="url(#glow)"
            />
            
            {/* Arms */}
            <path
              d="M35 50 L20 70 L25 72 L38 55"
              stroke="url(#bodyGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <path
              d="M65 50 L80 65 L75 68 L62 55"
              stroke="url(#bodyGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            
            {/* Legs */}
            <path
              d="M42 85 L35 120 L40 122 L48 90"
              stroke="url(#bodyGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <path
              d="M58 85 L70 115 L65 118 L52 90"
              stroke="url(#bodyGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            
            {/* Feet */}
            <ellipse cx="37" cy="125" rx="8" ry="4" fill="url(#bodyGradient)" filter="url(#glow)" />
            <ellipse cx="68" cy="120" rx="8" ry="4" fill="url(#bodyGradient)" filter="url(#glow)" />
            
            {/* Energy trails */}
            <path
              d="M85 65 Q 95 70 100 60"
              stroke="hsl(180, 100%, 50%)"
              strokeWidth="2"
              opacity="0.6"
              strokeLinecap="round"
            />
            <path
              d="M75 118 Q 85 120 95 115"
              stroke="hsl(300, 100%, 60%)"
              strokeWidth="2"
              opacity="0.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      
      {/* Hero info */}
      <div className="mt-6 text-center">
        <h3 className="font-display text-xl text-primary mb-1">{heroName}</h3>
        <p className="text-sm text-muted-foreground font-game">{heroSkin}</p>
      </div>
      
      {/* Skin indicator dots */}
      <div className="flex gap-2 mt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === 1 ? 'bg-neon-cyan' : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroDisplay;
