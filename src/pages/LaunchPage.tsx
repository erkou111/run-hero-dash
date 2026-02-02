import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LaunchPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          setTimeout(() => setShowEnter(true), 300);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 cyber-grid" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-neon-cyan opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo/Title */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-6xl md:text-8xl font-black tracking-wider mb-4 animate-launch-pulse text-primary">
            CYBER
          </h1>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-widest neon-text-magenta">
            RUNNER
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-muted-foreground text-lg md:text-xl font-game tracking-wider mb-12 text-center">
          穿越未来 · 极速奔跑 · 无尽挑战
        </p>

        {/* Loading bar or Enter button */}
        <div className="w-64 md:w-80">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-2 bg-muted rounded-full overflow-hidden neon-border">
                <div
                  className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                />
              </div>
              <p className="text-center text-muted-foreground font-game text-sm tracking-wider">
                加载中... {Math.min(Math.floor(loadingProgress), 100)}%
              </p>
            </div>
          ) : (
            <button
              onClick={handleEnter}
              className={`w-full py-4 px-8 cyber-button rounded-lg text-xl tracking-widest transform transition-all duration-500 ${
                showEnter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              点击进入
            </button>
          )}
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-game">
            <span className="w-8 h-px bg-neon-cyan/50" />
            <span>© 2024 CYBER RUNNER</span>
            <span className="w-8 h-px bg-neon-cyan/50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchPage;
