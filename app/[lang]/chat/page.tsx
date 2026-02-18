"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send, Search, Plus, Phone, Video, MoreHorizontal, Hash, Lock,
  Users, ChevronRight, Smile, Paperclip, Image as ImageIcon,
  ArrowLeft, Settings, UserPlus, Circle
} from "lucide-react";

/* ─── Types ─── */
type MessageType = { id: number; from: string; fromMe: boolean; text: string; time: string; avatar: string };
type ChatType = { id: number; name: string; type: 'dm' | 'group' | 'channel'; avatar: string; lastMsg: string; time: string; unread: number; online?: boolean; members?: number; color?: string };

/* ─── Sample Data ─── */
const CHATS: ChatType[] = [
  { id: 1, name: 'Sarah Chen', type: 'dm', avatar: 'SC', lastMsg: 'Nice implementation! 🔥', time: '2m', unread: 3, online: true, color: 'from-blue-400 to-cyan-500' },
  { id: 2, name: 'Alex Rivera', type: 'dm', avatar: 'AR', lastMsg: 'Can you review my PR?', time: '15m', unread: 1, online: true, color: 'from-emerald-400 to-teal-500' },
  { id: 3, name: 'JavaScript Devs', type: 'group', avatar: 'JS', lastMsg: 'Marcus: Check out this hook!', time: '1h', unread: 12, members: 45, color: 'from-yellow-400 to-orange-500' },
  { id: 4, name: 'Marcus Wei', type: 'dm', avatar: 'MW', lastMsg: 'The async pattern is elegant', time: '2h', unread: 0, online: false, color: 'from-purple-400 to-pink-500' },
  { id: 5, name: 'Code Review Team', type: 'group', avatar: 'CR', lastMsg: 'Priya: LGTM 👍', time: '3h', unread: 0, members: 8, color: 'from-red-400 to-pink-500' },
  { id: 6, name: '🌐 General', type: 'channel', avatar: '#', lastMsg: 'Welcome new members!', time: '5h', unread: 0, color: 'from-primary to-accent' },
  { id: 7, name: '🦀 Rustaceans', type: 'channel', avatar: '🦀', lastMsg: 'Emma: Ownership rules!', time: '1d', unread: 2, color: 'from-orange-500 to-red-500' },
];

const MESSAGES_MAP: Record<number, MessageType[]> = {
  1: [
    { id: 1, from: 'Sarah Chen', fromMe: false, text: "Hey! Saw your CSS animation snippet — that gradient effect is 🔥", time: '10:02 AM', avatar: 'SC' },
    { id: 2, from: 'You', fromMe: true, text: "Thanks! Took me a while to get the timing right. Using background-size: 200% is the key.", time: '10:04 AM', avatar: 'U' },
    { id: 3, from: 'Sarah Chen', fromMe: false, text: "Brilliant. I'm going to use that in my project. Do you have a version with dark mode support?", time: '10:06 AM', avatar: 'SC' },
    { id: 4, from: 'You', fromMe: true, text: "Yes! Just prefers-color-scheme media query and adjust the gradient stops. I can share the full version.", time: '10:08 AM', avatar: 'U' },
    { id: 5, from: 'Sarah Chen', fromMe: false, text: "That would be amazing! Could you post it on DevCanvas too? The community would love it 💪", time: '10:09 AM', avatar: 'SC' },
    { id: 6, from: 'Sarah Chen', fromMe: false, text: "Nice implementation! 🔥", time: '10:11 AM', avatar: 'SC' },
  ],
  3: [
    { id: 1, from: 'Marcus Wei', fromMe: false, text: "Hey everyone! 👋 Anyone worked with the new React 19 features?", time: '9:00 AM', avatar: 'MW' },
    { id: 2, from: 'Priya Sharma', fromMe: false, text: "The `use()` hook is game-changing! Simplifies async data fetching a lot.", time: '9:05 AM', avatar: 'PS' },
    { id: 3, from: 'You', fromMe: true, text: "Actions API is also really nice for server mutations. No more useEffect hacks 😅", time: '9:07 AM', avatar: 'U' },
    { id: 4, from: 'Marcus Wei', fromMe: false, text: "Check out this hook! 👇 const data = use(fetchUser(id)) — that's it!", time: '9:10 AM', avatar: 'MW' },
    { id: 5, from: 'Emma Davis', fromMe: false, text: "Wild. Suspense boundaries become so much more ergonomic now.", time: '9:12 AM', avatar: 'ED' },
    { id: 6, from: 'Marcus Wei', fromMe: false, text: "Check out this hook!", time: '9:15 AM', avatar: 'MW' },
  ],
};

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<ChatType | null>(CHATS[0]);
  const [messages, setMessages] = useState<MessageType[]>(MESSAGES_MAP[1] || []);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectChat = (chat: ChatType) => {
    setActiveChat(chat);
    setMessages(MESSAGES_MAP[chat.id] || []);
    setShowSidebar(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: MessageType = {
      id: messages.length + 1,
      from: 'You',
      fromMe: true,
      text: input.trim(),
      time: formatTime(new Date()),
      avatar: 'U',
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  const filtered = CHATS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const dms = filtered.filter(c => c.type === 'dm');
  const groups = filtered.filter(c => c.type === 'group');
  const channels = filtered.filter(c => c.type === 'channel');

  return (
    <div className="flex h-[calc(100vh-120px)] lg:h-[calc(100vh-80px)] -mt-6 -mx-4 lg:-mx-8 overflow-hidden rounded-none lg:rounded-2xl border border-border bg-card">

      {/* ─── SIDEBAR ─── */}
      <div className={`
        ${showSidebar ? 'flex' : 'hidden lg:flex'}
        flex-col w-full lg:w-72 xl:w-80 border-r border-border bg-sidebar flex-shrink-0
      `}>
        {/* Header */}
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground text-base">Messages</h2>
            <div className="flex gap-1">
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <Plus size={16} />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <Settings size={16} />
              </button>
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-8 pr-3 py-2 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground border-0 outline-none focus:ring-2 ring-primary/30"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* DMs */}
          {dms.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                <span>Direct Messages</span>
                <button className="text-primary hover:text-primary/80"><Plus size={12} /></button>
              </div>
              {dms.map(chat => <ChatItem key={chat.id} chat={chat} active={activeChat?.id === chat.id} onClick={() => handleSelectChat(chat)} />)}
            </div>
          )}

          {/* Groups */}
          {groups.length > 0 && (
            <div className="mt-2">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                <span>Group Chats</span>
                <button className="text-primary hover:text-primary/80"><Plus size={12} /></button>
              </div>
              {groups.map(chat => <ChatItem key={chat.id} chat={chat} active={activeChat?.id === chat.id} onClick={() => handleSelectChat(chat)} />)}
            </div>
          )}

          {/* Channels */}
          {channels.length > 0 && (
            <div className="mt-2">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                <span>Channels</span>
                <button className="text-primary hover:text-primary/80"><Plus size={12} /></button>
              </div>
              {channels.map(chat => <ChatItem key={chat.id} chat={chat} active={activeChat?.id === chat.id} onClick={() => handleSelectChat(chat)} />)}
            </div>
          )}
        </div>
      </div>

      {/* ─── CHAT AREA ─── */}
      <div className={`${!showSidebar || activeChat ? 'flex' : 'hidden lg:flex'} flex-col flex-1 min-w-0`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border bg-card flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors mr-1"
                >
                  <ArrowLeft size={18} className="text-muted-foreground" />
                </button>
                <div className="relative">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeChat.color ?? 'from-primary to-accent'} flex items-center justify-center text-white text-xs font-bold`}>
                    {activeChat.type === 'channel' ? activeChat.avatar : activeChat.avatar}
                  </div>
                  {activeChat.type === 'dm' && activeChat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-card" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                    {activeChat.type === 'dm' && <Lock size={12} className="text-muted-foreground" />}
                    {activeChat.type === 'group' && <Users size={12} className="text-muted-foreground" />}
                    {activeChat.type === 'channel' && <Hash size={12} className="text-muted-foreground" />}
                    {activeChat.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activeChat.type === 'dm'
                      ? (activeChat.online ? '● Online' : '○ Offline')
                      : `${activeChat.members ?? 0} members`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {activeChat.type === 'dm' && (
                  <>
                    <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Phone size={16} />
                    </button>
                    <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Video size={16} />
                    </button>
                  </>
                )}
                {activeChat.type !== 'dm' && (
                  <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                    <UserPlus size={16} />
                  </button>
                )}
                <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {messages.map((msg, i) => {
                const prevMsg = messages[i - 1];
                const isGrouped = prevMsg && prevMsg.from === msg.from && !msg.fromMe === !prevMsg.fromMe;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${msg.fromMe ? 'flex-row-reverse' : 'flex-row'} ${isGrouped ? 'mt-0.5' : 'mt-3'} animate-fade-in-up`}
                  >
                    {/* Avatar */}
                    {!isGrouped ? (
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${CHATS.find(c => c.name === msg.from)?.color ?? 'from-primary to-accent'} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                        {msg.avatar}
                      </div>
                    ) : (
                      <div className="w-7 shrink-0" />
                    )}

                    <div className={`flex flex-col ${msg.fromMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                      {!isGrouped && !msg.fromMe && (
                        <span className="text-[11px] text-muted-foreground font-medium mb-1 ml-1">{msg.from}</span>
                      )}
                      <div className={`
                        relative px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                        ${msg.fromMe
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm'
                        }
                      `}>
                        {msg.text}
                      </div>
                      {!isGrouped && (
                        <span className="text-[10px] text-muted-foreground mt-1 mx-1">{msg.time}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border bg-card flex-shrink-0">
              <div className="flex items-center gap-2 bg-muted rounded-2xl px-4 py-2.5 border border-border focus-within:border-primary/50 focus-within:bg-card transition-all">
                <button className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
                  <Paperclip size={16} />
                </button>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={`Message ${activeChat.name}...`}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
                  <Smile size={16} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-7 h-7 bg-primary rounded-xl flex items-center justify-center text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-all hover:scale-105 disabled:hover:scale-100"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </>
        ) : (
          // Empty state
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={28} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Your messages</h3>
              <p className="text-sm text-muted-foreground">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Chat Item Component ─── */
function ChatItem({ chat, active, onClick }: { chat: ChatType; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all hover:bg-muted/70 ${active ? 'bg-primary/8 border-r-2 border-primary' : ''}`}
    >
      <div className="relative shrink-0">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${chat.color ?? 'from-primary to-accent'} flex items-center justify-center text-white text-xs font-bold`}>
          {chat.avatar}
        </div>
        {chat.type === 'dm' && chat.online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-sidebar" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className={`text-sm truncate ${chat.unread ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
            {chat.name}
          </span>
          <span className="text-[10px] text-muted-foreground shrink-0">{chat.time}</span>
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <span className="text-xs text-muted-foreground truncate">{chat.lastMsg}</span>
          {chat.unread > 0 && (
            <span className="shrink-0 min-w-[18px] h-[18px] bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center px-1">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
