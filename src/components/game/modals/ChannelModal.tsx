import { useState } from 'react';
import GameModal from '../GameModal';
import { Globe, Users, Send } from 'lucide-react';

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const worldMessages = [
  { id: 1, user: '系统', message: '欢迎来到赛博跑酷世界频道!', isSystem: true },
  { id: 2, user: '暗夜猎手', message: '有人一起排位吗?', isSystem: false },
  { id: 3, user: '极速闪电', message: '刚抽到SSR皮肤!太帅了!', isSystem: false },
  { id: 4, user: '星际旅者', message: '新活动什么时候开?', isSystem: false },
];

const friendMessages = [
  { id: 1, user: '暗夜猎手', message: '在吗?', isSystem: false },
  { id: 2, user: '你', message: '在的,怎么了?', isSystem: false, isMe: true },
  { id: 3, user: '暗夜猎手', message: '一起双排?', isSystem: false },
];

const ChannelModal = ({ isOpen, onClose }: ChannelModalProps) => {
  const [activeTab, setActiveTab] = useState<'world' | 'friend'>('world');
  const [message, setMessage] = useState('');

  const messages = activeTab === 'world' ? worldMessages : friendMessages;

  return (
    <GameModal isOpen={isOpen} onClose={onClose} title="频道">
      <div className="space-y-3">
        {/* Tab switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('world')}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all ${
              activeTab === 'world'
                ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan'
                : 'bg-muted/50 border border-border text-muted-foreground'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="font-game">世界频道</span>
          </button>
          <button
            onClick={() => setActiveTab('friend')}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all ${
              activeTab === 'friend'
                ? 'bg-neon-magenta/20 border border-neon-magenta text-neon-magenta'
                : 'bg-muted/50 border border-border text-muted-foreground'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="font-game">好友频道</span>
          </button>
        </div>

        {/* Messages */}
        <div className="h-48 overflow-y-auto space-y-2 p-2 rounded-lg bg-muted/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`text-sm ${msg.isSystem ? 'text-neon-gold' : ''} ${
                'isMe' in msg && msg.isMe ? 'text-right' : ''
              }`}
            >
              {!('isMe' in msg && msg.isMe) && (
                <span className={`font-display ${msg.isSystem ? 'text-neon-gold' : 'text-neon-cyan'}`}>
                  [{msg.user}]:{' '}
                </span>
              )}
              <span className="font-game text-foreground">{msg.message}</span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border focus:border-neon-cyan focus:outline-none font-game text-foreground"
          />
          <button className="p-2 cyber-button rounded-lg">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </GameModal>
  );
};

export default ChannelModal;
