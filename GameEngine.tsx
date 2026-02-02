import { useEffect, useRef, useState, useCallback } from 'react';

interface GameEngineProps {
  mode: 'endless' | 'level' | 'ranked';
  level?: number;
  onGameEnd: (score: number, coins: number, isWin?: boolean) => void;
  isPaused: boolean;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'obstacle' | 'coin' | 'player';
  color?: string;
}

interface PlayerState {
  x: number;
  y: number;
  velocityY: number;
  isJumping: boolean;
  lane: number; // 0, 1, 2 for three lanes
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GROUND_Y = 320;
const PLAYER_SIZE = 40;
const LANE_WIDTH = 80;
const LANES = [GAME_WIDTH / 2 - LANE_WIDTH, GAME_WIDTH / 2, GAME_WIDTH / 2 + LANE_WIDTH];
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const SCROLL_SPEED = 5;
const MIN_OBSTACLE_GAP = 220;
const MAX_OBSTACLE_GAP = 380;
const MIN_COIN_GAP = 180;
const MAX_COIN_GAP = 320;
const randGap = (min: number, max: number) => min + Math.random() * (max - min);

const GameEngine = ({ mode, level = 1, onGameEnd, isPaused }: GameEngineProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameStateRef = useRef({
    score: 0,
    coins: 0,
    distance: 0,
    timeRemaining: 30, // For level mode: 30 seconds
    obstacles: [] as GameObject[],
    coinObjects: [] as GameObject[],
    scrollSpeed: SCROLL_SPEED,
    gameOver: false,
    levelComplete: false,
    obstacleCooldown: randGap(MIN_OBSTACLE_GAP, MAX_OBSTACLE_GAP),
    coinCooldown: randGap(MIN_COIN_GAP, MAX_COIN_GAP),
  });
  
  const playerRef = useRef<PlayerState>({
    x: LANES[1],
    y: GROUND_Y - PLAYER_SIZE,
    velocityY: 0,
    isJumping: false,
    lane: 1,
  });
  
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const keysPressed = useRef<Set<string>>(new Set());
  
  // Touch handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Tap detection (threshold 10px) - Jump
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
       keysPressed.current.add('w');
       setTimeout(() => keysPressed.current.delete('w'), 150);
    } else {
       // Swipe detection
       if (Math.abs(deltaX) > Math.abs(deltaY)) {
         // Horizontal swipe
         if (Math.abs(deltaX) > 30) { 
            const key = deltaX > 0 ? 'd' : 'a';
            keysPressed.current.add(key);
            // Hold enough to change lane (~200ms)
            setTimeout(() => keysPressed.current.delete(key), 200);
         }
       } else {
         // Vertical swipe
         if (Math.abs(deltaY) > 30) {
            const key = deltaY > 0 ? 's' : 'w';
            keysPressed.current.add(key);
            setTimeout(() => keysPressed.current.delete(key), 150);
         }
       }
    }
    touchStartRef.current = null;
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Spawn obstacles
  const spawnObstacle = useCallback(() => {
    const lane = Math.floor(Math.random() * 3);
    const height = 30 + Math.random() * 40;
    const obstacle: GameObject = {
      x: GAME_WIDTH + 50,
      y: GROUND_Y - height,
      width: 40,
      height: height,
      type: 'obstacle',
      color: `hsl(${Math.random() * 60 + 300}, 100%, 50%)`, // Magenta range
    };
    gameStateRef.current.obstacles.push(obstacle);
  }, []);

  // Spawn coins
  const spawnCoin = useCallback(() => {
    const yGround = GROUND_Y - 30;
    const trySpawn = () => {
      // 3 levels of height: Ground (0), Low Jump (-50), High Jump (-100)
      // All are physically reachable (Max jump height ~140px)
      const rand = Math.random();
      let yOffset = 0;
      if (rand > 0.66) yOffset = -50;
      else if (rand > 0.33) yOffset = -100;

      const candidate: GameObject = {
        x: GAME_WIDTH + 100 + Math.random() * 300,
        y: yGround + yOffset,
        width: 25,
        height: 25,
        type: 'coin',
      };
      
      // Strict non-overlap check with margin
      const margin = 20; // 20px buffer ensures no visual overlap
      const collides = gameStateRef.current.obstacles.some((obs) => {
        return (
          candidate.x < obs.x + obs.width + margin &&
          candidate.x + candidate.width + margin > obs.x &&
          candidate.y < obs.y + obs.height + margin &&
          candidate.y + candidate.height + margin > obs.y
        );
      });
      return collides ? null : candidate;
    };
    let result: GameObject | null = null;
    for (let i = 0; i < 10 && !result; i++) {
      result = trySpawn();
    }
    if (result) {
      gameStateRef.current.coinObjects.push(result);
    }
  }, []);

  // Check collision
  const checkCollision = (a: GameObject, b: { x: number; y: number; width: number; height: number }) => {
    // Shrink hitbox slightly to be more forgiving
    const padding = 5;
    return (
      a.x + padding < b.x + b.width - padding &&
      a.x + a.width - padding > b.x + padding &&
      a.y + padding < b.y + b.height - padding &&
      a.y + a.height - padding > b.y + padding
    );
  };

  // Main game loop
  const gameLoop = useCallback(() => {
    if (isPaused || gameStateRef.current.gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;
    const player = playerRef.current;

    // Level difficulty scaling (1-100)
    // Speed: 5 -> 12
    const levelMultiplier = Math.min(level, 100);
    const targetSpeed = 5 + (levelMultiplier - 1) * 0.07;
    state.scrollSpeed = targetSpeed;

    // Update player position based on input
    // Horizontal movement (A/D)
    if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
      player.x = Math.max(50, player.x - 8);
    }
    if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
      player.x = Math.min(GAME_WIDTH - 50 - PLAYER_SIZE, player.x + 8);
    }
    
    // Jump (W or Space)
    if ((keysPressed.current.has('w') || keysPressed.current.has(' ') || keysPressed.current.has('arrowup')) && !player.isJumping) {
      player.velocityY = JUMP_FORCE;
      player.isJumping = true;
    }
    
    // Crouch/Fast fall (S)
    if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
      if (player.isJumping) {
        player.velocityY += 2; // Faster fall
      }
    }
    
    // Apply gravity
    player.velocityY += GRAVITY;
    player.y += player.velocityY;
    
    // Ground collision
    if (player.y >= GROUND_Y - PLAYER_SIZE) {
      player.y = GROUND_Y - PLAYER_SIZE;
      player.velocityY = 0;
      player.isJumping = false;
    }

    // Update obstacles
    state.obstacles = state.obstacles.filter((obs) => {
      obs.x -= state.scrollSpeed;
      return obs.x > -100;
    });

    // Update coins
    state.coinObjects = state.coinObjects.filter((coin) => {
      coin.x -= state.scrollSpeed;
      return coin.x > -50;
    });

    // Spawning controlled by gap cooldowns
    // Adjust gap based on level: Higher level = smaller gaps
    // Gap factor: 1.0 (Lvl 1) -> 0.6 (Lvl 100)
    const gapFactor = Math.max(0.6, 1 - (levelMultiplier - 1) * 0.004);
    
    state.obstacleCooldown -= state.scrollSpeed;
    if (state.obstacleCooldown <= 0) {
      spawnObstacle();
      state.obstacleCooldown = randGap(MIN_OBSTACLE_GAP * gapFactor, MAX_OBSTACLE_GAP * gapFactor);
    }
    state.coinCooldown -= state.scrollSpeed;
    if (state.coinCooldown <= 0) {
      spawnCoin();
      state.coinCooldown = randGap(MIN_COIN_GAP, MAX_COIN_GAP);
    }

    // Check collisions
    const playerHitbox = {
      x: player.x,
      y: player.y,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
    };

    // Obstacle collision
    for (const obs of state.obstacles) {
      if (checkCollision(obs, playerHitbox)) {
        state.gameOver = true;
        onGameEnd(state.score, state.coins, false);
        return;
      }
    }

    // Coin collection
    state.coinObjects = state.coinObjects.filter((coin) => {
      if (checkCollision(coin, playerHitbox)) {
        state.coins += 1;
        state.score += 100;
        setCoins(state.coins);
        setScore(state.score);
        return false;
      }
      return true;
    });

    // Update score
    state.distance += state.scrollSpeed;
    // Score based on distance + coins
    state.score = Math.floor(state.distance / 10) + state.coins * 100;
    setScore(state.score);

    // Level mode: check completion (Time based: 60 seconds)
    if (mode === 'level') {
      // timeRemaining is in seconds
      state.timeRemaining -= 1 / 60; // Approx 60 FPS
      if (state.timeRemaining <= 0) {
        state.levelComplete = true;
        onGameEnd(state.score, state.coins, true);
        return;
      }
    }

    // Clear and draw
    ctx.fillStyle = 'hsl(222, 47%, 5%)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw grid background
    ctx.strokeStyle = 'hsla(180, 100%, 50%, 0.05)';
    ctx.lineWidth = 1;
    for (let x = (state.distance % 50); x < GAME_WIDTH; x += 50) {
      ctx.beginPath();
      ctx.moveTo(GAME_WIDTH - x, 0);
      ctx.lineTo(GAME_WIDTH - x, GAME_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < GAME_HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(GAME_WIDTH, y);
      ctx.stroke();
    }

    // Draw ground
    const gradient = ctx.createLinearGradient(0, GROUND_Y, 0, GAME_HEIGHT);
    gradient.addColorStop(0, 'hsl(180, 100%, 50%)');
    gradient.addColorStop(1, 'hsla(180, 100%, 50%, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

    // Draw ground line
    ctx.strokeStyle = 'hsl(180, 100%, 50%)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'hsl(180, 100%, 50%)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(GAME_WIDTH, GROUND_Y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw obstacles
    for (const obs of state.obstacles) {
      ctx.fillStyle = obs.color || 'hsl(300, 100%, 60%)';
      ctx.shadowColor = obs.color || 'hsl(300, 100%, 60%)';
      ctx.shadowBlur = 15;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.shadowBlur = 0;
    }

    // Draw coins
    for (const coin of state.coinObjects) {
      ctx.beginPath();
      ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(45, 100%, 55%)';
      ctx.shadowColor = 'hsl(45, 100%, 55%)';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Inner circle
      ctx.beginPath();
      ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(45, 100%, 70%)';
      ctx.fill();
    }

    // Draw player
    const px = player.x;
    const py = player.y;
    
    // Player glow
    ctx.shadowColor = 'hsl(180, 100%, 50%)';
    ctx.shadowBlur = 20;
    
    // Player body
    const playerGradient = ctx.createLinearGradient(px, py, px + PLAYER_SIZE, py + PLAYER_SIZE);
    playerGradient.addColorStop(0, 'hsl(180, 100%, 50%)');
    playerGradient.addColorStop(1, 'hsl(300, 100%, 60%)');
    ctx.fillStyle = playerGradient;
    
    // Draw player as a stylized shape
    ctx.beginPath();
    ctx.moveTo(px + PLAYER_SIZE / 2, py);
    ctx.lineTo(px + PLAYER_SIZE, py + PLAYER_SIZE * 0.3);
    ctx.lineTo(px + PLAYER_SIZE * 0.8, py + PLAYER_SIZE);
    ctx.lineTo(px + PLAYER_SIZE * 0.2, py + PLAYER_SIZE);
    ctx.lineTo(px, py + PLAYER_SIZE * 0.3);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowBlur = 0;

    // Draw visor
    ctx.fillStyle = 'hsl(180, 100%, 70%)';
    ctx.fillRect(px + PLAYER_SIZE * 0.2, py + PLAYER_SIZE * 0.2, PLAYER_SIZE * 0.6, PLAYER_SIZE * 0.15);

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isPaused, mode, level, onGameEnd, spawnObstacle, spawnCoin]);

  // Start game loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  return (
    <div 
      className="relative w-full max-w-[800px] mx-auto touch-none select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Score and coins display */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/80 border border-neon-cyan/50">
          <span className="font-display text-neon-cyan text-sm">分数</span>
          <span className="font-display text-xl text-foreground">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/80 border border-neon-gold/50">
          <span className="text-neon-gold text-xl">💰</span>
          <span className="font-display text-xl text-foreground">{coins}</span>
        </div>
      </div>

      {/* Level indicator for level mode */}
      {mode === 'level' && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
          <div className="px-4 py-2 rounded-lg bg-card/80 border border-neon-magenta/50">
            <span className="font-display text-neon-magenta">关卡 {level}</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-card/80 border border-neon-cyan/50">
            <span className="font-display text-neon-cyan">
              ⏱️ {Math.max(0, Math.ceil(gameStateRef.current.timeRemaining))}s
            </span>
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 z-10 text-xs text-muted-foreground font-game">
        <span className="px-2 py-1 rounded bg-muted mr-1">W</span> 跳跃
        <span className="px-2 py-1 rounded bg-muted mx-1">A</span>
        <span className="px-2 py-1 rounded bg-muted mr-1">D</span> 移动
        <span className="px-2 py-1 rounded bg-muted mx-1">S</span> 下落
      </div>

      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="block w-full h-auto rounded-xl border-2 border-neon-cyan/30 shadow-[0_0_30px_hsl(180_100%_50%/0.2)]"
      />
    </div>
  );
};

export default GameEngine;
