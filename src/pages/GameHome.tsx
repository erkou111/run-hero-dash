import { useState } from 'react';
import { 
  ShoppingBag, 
  Backpack, 
  Gift, 
  Users, 
  MessageCircle, 
  Trophy,
  Play
} from 'lucide-react';
import HeroDisplay from '@/components/game/HeroDisplay';
import StaminaBar from '@/components/game/StaminaBar';
import IconButton from '@/components/game/IconButton';
import PlayerAvatar from '@/components/game/PlayerAvatar';
import ShopModal from '@/components/game/modals/ShopModal';
import BackpackModal from '@/components/game/modals/BackpackModal';
import GachaModal from '@/components/game/modals/GachaModal';
import FriendsModal from '@/components/game/modals/FriendsModal';
import ChannelModal from '@/components/game/modals/ChannelModal';
import LeaderboardModal from '@/components/game/modals/LeaderboardModal';
import ProfileModal from '@/components/game/modals/ProfileModal';
import GameModeModal from '@/components/game/modals/GameModeModal';

const GameHome = () => {
  // Modal states
  const [shopOpen, setShopOpen] = useState(false);
  const [backpackOpen, setBackpackOpen] = useState(false);
  const [gachaOpen, setGachaOpen] = useState(false);
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [channelOpen, setChannelOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [gameModeOpen, setGameModeOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 cyber-grid opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-neon-cyan opacity-20"
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
      <div className="relative z-10 min-h-screen flex flex-col p-4">
        {/* Top bar */}
        <header className="flex items-center justify-between mb-4">
          {/* Player info */}
          <PlayerAvatar
            name="赛博玩家"
            level={28}
            onClick={() => setProfileOpen(true)}
          />

          {/* Stamina */}
          <StaminaBar current={45} max={60} />
        </header>

        {/* Main area */}
        <div className="flex-1 flex gap-4">
          {/* Left sidebar - Menu buttons */}
          <aside className="flex flex-col gap-2 w-20">
            <IconButton
              icon={<ShoppingBag className="w-6 h-6" />}
              label="商城"
              onClick={() => setShopOpen(true)}
              variant="gold"
            />
            <IconButton
              icon={<Backpack className="w-6 h-6" />}
              label="背包"
              onClick={() => setBackpackOpen(true)}
            />
            <IconButton
              icon={<Gift className="w-6 h-6" />}
              label="抽奖"
              onClick={() => setGachaOpen(true)}
              variant="magenta"
              badge={1}
            />
            <IconButton
              icon={<Users className="w-6 h-6" />}
              label="好友"
              onClick={() => setFriendsOpen(true)}
              badge={3}
            />
          </aside>

          {/* Center - Hero display */}
          <main className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md h-96">
              <HeroDisplay heroName="赛博战士" heroSkin="默认皮肤" />
            </div>
          </main>

          {/* Right sidebar - More buttons */}
          <aside className="flex flex-col gap-2 w-20">
            <IconButton
              icon={<MessageCircle className="w-6 h-6" />}
              label="频道"
              onClick={() => setChannelOpen(true)}
            />
            <IconButton
              icon={<Trophy className="w-6 h-6" />}
              label="排行榜"
              onClick={() => setLeaderboardOpen(true)}
              variant="gold"
            />
          </aside>
        </div>

        {/* Bottom - Start game button */}
        <footer className="flex justify-center mt-4">
          <button
            onClick={() => setGameModeOpen(true)}
            className="group relative px-12 py-4 cyber-button-gold rounded-xl text-xl tracking-widest font-display overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Play className="w-6 h-6" />
              开始游戏
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-gold via-neon-magenta to-neon-gold opacity-0 group-hover:opacity-30 transition-opacity bg-[length:200%_100%] animate-shimmer" />
          </button>
        </footer>
      </div>

      {/* Modals */}
      <ShopModal isOpen={shopOpen} onClose={() => setShopOpen(false)} />
      <BackpackModal isOpen={backpackOpen} onClose={() => setBackpackOpen(false)} />
      <GachaModal isOpen={gachaOpen} onClose={() => setGachaOpen(false)} />
      <FriendsModal isOpen={friendsOpen} onClose={() => setFriendsOpen(false)} />
      <ChannelModal isOpen={channelOpen} onClose={() => setChannelOpen(false)} />
      <LeaderboardModal isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <GameModeModal isOpen={gameModeOpen} onClose={() => setGameModeOpen(false)} />
    </div>
  );
};

export default GameHome;
