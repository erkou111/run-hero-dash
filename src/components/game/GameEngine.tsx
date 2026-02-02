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

const GameEngine = ({ mode, level = 1, onGameEnd, isPaused }: GameEngineProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameStateRef = useRef({
    score: 0,
    coins: 0,
    distance: 0,
    obstacles: [] as GameObject[],
    coinObjects: [] as GameObject[],
    scrollSpeed: SCROLL_SPEED,
    gameOver: false,
    levelComplete: false,
  });
  
  const [player, setPlayer] = useState<PlayerState>({
    x: LANES[1],
    y: GROUND_Y - PLAYER_SIZE,
    velocityY: 0,
    isJumping: false,
    lane: 1,
  });
  
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const keysPressed = useRef<Set<string>>(new Set());

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
    const lane = Math.floor(Math.random() * 3);
    const yOffset = Math.random() > 0.5 ? 0 : -50; // Some coins in the air
    const coin: GameObject = {
      x: GAME_WIDTH + 50 + Math.random() * 200,
      y: GROUND_Y - 30 + yOffset,
      width: 25,
      height: 25,
      type: 'coin',
    };
    gameStateRef.current.coinObjects.push(coin);
  }, []);

  // Check collision
  const checkCollision = (a: GameObject, b: { x: number; y: number; width: number; height: number }) => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
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

    // Update player position based on input
    setPlayer((prev) => {
      let newPlayer = { ...prev };
      
      // Horizontal movement (A/D)
      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
        newPlayer.x = Math.max(50, newPlayer.x - 8);
      }
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
        newPlayer.x = Math.min(GAME_WIDTH - 50 - PLAYER_SIZE, newPlayer.x + 8);
      }
      
      // Jump (W or Space)
      if ((keysPressed.current.has('w') || keysPressed.current.has(' ') || keysPressed.current.has('arrowup')) && !newPlayer.isJumping) {
        newPlayer.velocityY = JUMP_FORCE;
        newPlayer.isJumping = true;
      }
      
      // Crouch/Fast fall (S)
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
        if (newPlayer.isJumping) {
          newPlayer.velocityY += 2; // Faster fall
        }
      }
      
      // Apply gravity
      newPlayer.velocityY += GRAVITY;
      newPlayer.y += newPlayer.velocityY;
      
      // Ground collision
      if (newPlayer.y >= GROUND_Y - PLAYER_SIZE) {
        newPlayer.y = GROUND_Y - PLAYER_SIZE;
        newPlayer.velocityY = 0;
        newPlayer.isJumping = false;
      }
      
      return newPlayer;
    });

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

    // Spawn new obstacles and coins
    if (Math.random() < 0.02) spawnObstacle();
    if (Math.random() < 0.03) spawnCoin();

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
    state.score = Math.floor(state.distance / 10) + state.coins * 100;
    setScore(state.score);

    // Level mode: check completion
    if (mode === 'level') {
      const levelDistance = level * 1000; // Each level is longer
      if (state.distance >= levelDistance) {
        state.levelComplete = true;
        onGameEnd(state.score, state.coins, true);
        return;
      }
    }

    // Increase difficulty over time
    state.scrollSpeed = SCROLL_SPEED + Math.floor(state.distance / 2000) * 0.5;

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
  }, [isPaused, player, mode, level, onGameEnd, spawnObstacle, spawnCoin]);

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
    <div className="relative">
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
        <div className="absolute top-4 right-4 z-10">
          <div className="px-4 py-2 rounded-lg bg-card/80 border border-neon-magenta/50">
            <span className="font-display text-neon-magenta">关卡 {level}</span>
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
        className="rounded-xl border-2 border-neon-cyan/30 shadow-[0_0_30px_hsl(180_100%_50%/0.2)]"
      />
    </div>
  );
};

export default GameEngine;
