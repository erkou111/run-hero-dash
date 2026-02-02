import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroDisplayProps {
  heroName: string;
  heroSkin: string;
  onHeroChange?: (heroIndex: number) => void;
  onSkinChange?: (skinIndex: number) => void;
}

const heroes = [
  { name: '赛博战士', skins: ['默认皮肤', '霓虹皮肤', '暗影皮肤', '烈焰皮肤', '冰霜皮肤'] },
  { name: '极速猎手', skins: ['默认皮肤', '电光皮肤', '星际皮肤'] },
  { name: '暗夜刺客', skins: ['默认皮肤', '幻影皮肤', '血月皮肤', '虚空皮肤'] },
];

const heroColors = [
  { primary: 'hsl(180, 100%, 50%)', secondary: 'hsl(300, 100%, 60%)' },
  { primary: 'hsl(45, 100%, 55%)', secondary: 'hsl(30, 100%, 45%)' },
  { primary: 'hsl(270, 100%, 60%)', secondary: 'hsl(300, 100%, 50%)' },
];

const HeroDisplay = ({ onHeroChange, onSkinChange }: HeroDisplayProps) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [skinIndex, setSkinIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const currentHero = heroes[heroIndex];
  const currentSkin = currentHero.skins[skinIndex];
  const colors = heroColors[heroIndex];

  const handlePrevHero = () => {
    const newIndex = heroIndex === 0 ? heroes.length - 1 : heroIndex - 1;
    setHeroIndex(newIndex);
    setSkinIndex(0);
    onHeroChange?.(newIndex);
  };

  const handleNextHero = () => {
    const newIndex = heroIndex === heroes.length - 1 ? 0 : heroIndex + 1;
    setHeroIndex(newIndex);
    setSkinIndex(0);
    onHeroChange?.(newIndex);
  };

  const handlePrevSkin = () => {
    const newIndex = skinIndex === 0 ? currentHero.skins.length - 1 : skinIndex - 1;
    setSkinIndex(newIndex);
    onSkinChange?.(newIndex);
  };

  const handleNextSkin = () => {
    const newIndex = skinIndex === currentHero.skins.length - 1 ? 0 : skinIndex + 1;
    setSkinIndex(newIndex);
    onSkinChange?.(newIndex);
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hero switcher buttons */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={handlePrevHero}
          className="p-3 rounded-full bg-card/80 border border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_20px_hsl(180_100%_50%/0.5)] transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-neon-cyan" />
        </button>
      </div>
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={handleNextHero}
          className="p-3 rounded-full bg-card/80 border border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_20px_hsl(180_100%_50%/0.5)] transition-all"
        >
          <ChevronRight className="w-6 h-6 text-neon-cyan" />
        </button>
      </div>

      {/* Platform glow effect */}
      <div 
        className="absolute bottom-0 w-48 h-4 rounded-full blur-xl transition-colors duration-500"
        style={{ backgroundColor: colors.primary, opacity: 0.3 }}
      />
      
      {/* Hero character */}
      <div className={`relative transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}>
        <div className="relative w-40 h-64 flex items-end justify-center">
          {/* Glow behind character */}
          <div 
            className="absolute inset-0 rounded-full blur-2xl transition-colors duration-500"
            style={{ background: `linear-gradient(to top, ${colors.primary}33, transparent)` }}
          />
          
          {/* Character body - stylized runner */}
          <svg
            viewBox="0 0 100 160"
            className="w-full h-full animate-float"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`bodyGradient-${heroIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.primary} />
                <stop offset="100%" stopColor={colors.secondary} />
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
            <circle cx="50" cy="25" r="15" fill={`url(#bodyGradient-${heroIndex})`} filter="url(#glow)" />
            
            {/* Visor */}
            <rect x="38" y="20" width="24" height="8" rx="4" fill={colors.primary} opacity="0.8" />
            
            {/* Torso */}
            <path
              d="M35 45 L50 40 L65 45 L62 85 L38 85 Z"
              fill={`url(#bodyGradient-${heroIndex})`}
              filter="url(#glow)"
            />
            
            {/* Arms */}
            <path
              d="M35 50 L20 70 L25 72 L38 55"
              stroke={`url(#bodyGradient-${heroIndex})`}
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <path
              d="M65 50 L80 65 L75 68 L62 55"
              stroke={`url(#bodyGradient-${heroIndex})`}
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            
            {/* Legs */}
            <path
              d="M42 85 L35 120 L40 122 L48 90"
              stroke={`url(#bodyGradient-${heroIndex})`}
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <path
              d="M58 85 L70 115 L65 118 L52 90"
              stroke={`url(#bodyGradient-${heroIndex})`}
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            
            {/* Feet */}
            <ellipse cx="37" cy="125" rx="8" ry="4" fill={`url(#bodyGradient-${heroIndex})`} filter="url(#glow)" />
            <ellipse cx="68" cy="120" rx="8" ry="4" fill={`url(#bodyGradient-${heroIndex})`} filter="url(#glow)" />
            
            {/* Energy trails */}
            <path
              d="M85 65 Q 95 70 100 60"
              stroke={colors.primary}
              strokeWidth="2"
              opacity="0.6"
              strokeLinecap="round"
            />
            <path
              d="M75 118 Q 85 120 95 115"
              stroke={colors.secondary}
              strokeWidth="2"
              opacity="0.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      
      {/* Hero info */}
      <div className="mt-6 text-center">
        <h3 className="font-display text-xl text-primary mb-1">{currentHero.name}</h3>
        <p className="text-sm text-muted-foreground font-game">{currentSkin}</p>
      </div>
      
      {/* Skin switcher */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handlePrevSkin}
          className="p-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        
        <div className="flex gap-2">
          {currentHero.skins.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === skinIndex ? 'bg-neon-cyan scale-125' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              onClick={() => {
                setSkinIndex(i);
                onSkinChange?.(i);
              }}
            />
          ))}
        </div>
        
        <button
          onClick={handleNextSkin}
          className="p-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default HeroDisplay;
