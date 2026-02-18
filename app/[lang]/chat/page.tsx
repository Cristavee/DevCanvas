"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send, Search, Plus, Phone, Video, MoreHorizontal, Hash, Lock,
  Users, Smile, Paperclip, ArrowLeft, Settings, UserPlus,
  MessageSquare, Code2, AtSign, Bell, Pin
} from "lucide-react";

type MessageType = { id: number; from: string; fromMe: boolean; text: string; time: string; avatar: string };
type ChatType = { id: number; name: string; type: "dm" | "group" | "channel"; avatar: string; lastMsg: string; time: string; unread: number; online?: boolean; members?: number; color: string };

const CHATS: ChatType[] = [
  { id: 1, name: "Sarah Chen", type: "dm", avatar: "SC", lastMsg: "Nice implementation! 🔥", time: "2m", unread: 3, online: true, color: "#00C8B4" },
  { id: 2, name: "Alex Rivera", type: "dm", avatar: "AR", lastMsg: "Can you review my PR?", time: "15m", unread: 1, online: true, color: "#4DABFF" },
  { id: 3, name: "Marcus Wei", type: "dm", avatar: "MW", lastMsg: "The async pattern is elegant", time: "2h", unread: 0, online: false, color: "#FF6B6B" },
  { id: 4, name: "JavaScript Devs", type: "group", avatar: "JS", lastMsg: "Marcus: Check out this hook!", time: "1h", unread: 12, members: 45, color: "#F7DF1E" },
  { id: 5, name: "Code Review Team", type: "group", avatar: "CR", lastMsg: "Priya: LGTM 👍", time: "3h", unread: 0, members: 8, color: "#FF6B6B" },
  { id: 6, name: "general", type: "channel", avatar: "#", lastMsg: "Welcome new members!", time: "5h", unread: 0, color: "#00FFB3" },
  { id: 7, name: "code-review", type: "channel", avatar: "#", lastMsg: "Emma: Ownership rules!", time: "1d", unread: 2, color: "#4DABFF" },
  { id: 8, name: "rust-lang", type: "channel", avatar: "🦀", lastMsg: "New RFC dropped!", time: "2d", unread: 0, color: "#CE4A07" },
];

const MESSAGES_MAP: Record<number, MessageType[]> = {
  1: [
    { id: 1, from: "Sarah Chen", fromMe: false, text: "Hey! Saw your CSS animation snippet — that gradient effect is 🔥", time: "10:02 AM", avatar: "SC" },
    { id: 2, from: "You", fromMe: true, text: "Thanks! Took me a while to get the timing right. background-size: 200% is the key.", time: "10:04 AM", avatar: "U" },
    { id: 3, from: "Sarah Chen", fromMe: false, text: "Brilliant. I'm going to use that in my project. Do you have a dark mode version?", time: "10:06 AM", avatar: "SC" },
    { id: 4, from: "You", fromMe: true, text: "Yes! Just prefers-color-scheme media query and adjust the gradient stops. I can share the full version.", time: "10:08 AM", avatar: "U" },
    { id: 5, from: "Sarah Chen", fromMe: false, text: "That would be amazing! Could you post it on DevCanvas too? The community would love it 💪", time: "10:09 AM", avatar: "SC" },
    { id: 6, from: "Sarah Chen", fromMe: false, text: "Nice implementation! 🔥", time: "10:11 AM", avatar: "SC" },
  ],
};

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<ChatType | null>(CHATS[0]);
  const [messages, setMessages] = useState<MessageType[]>(MESSAGES_MAP[1] || []);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectChat = (chat: ChatType) => {
    setActiveChat(chat);
    setMessages(MESSAGES_MAP[chat.id] || []);
    setShowSidebar(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1, from: "You", fromMe: true,
      text: input.trim(), time: formatTime(new Date()), avatar: "U",
    }]);
    setInput("");
  };

  const filtered = CHATS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const dms = filtered.filter(c => c.type === "dm");
  const groups = filtered.filter(c => c.type === "group");
  const channels = filtered.filter(c => c.type === "channel");

  return (
    /* Full height — fills main area which is flex-1 */
    <div className="flex h-[calc(100svh-56px-56px)] lg:h-[calc(100svh-56px)] -mt-6 -mx-4 lg:-mx-8 overflow-hidden rounded-none lg:rounded-xl border border-border">

      {/* ─── SIDEBAR ─── */}
      <div className={`${showSidebar ? "flex" : "hidden lg:flex"} flex-col w-full lg:w-64 xl:w-72 border-r border-border flex-shrink-0`}
        style={{ background: "hsl(var(--sidebar-bg))" }}>
        <div className="px-4 py-3.5 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground text-sm">Messages</h2>
            <div className="flex gap-1">
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Plus size={14} /></button>
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Settings size={14} /></button>
            </div>
          </div>
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="w-full pl-8 pr-3 py-2 bg-muted rounded-lg text-xs text-foreground placeholder:text-muted-foreground border-0 outline-none focus:ring-1 ring-[var(--neon-green)]/40 font-mono" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {[{ label: "Direct Messages", items: dms }, { label: "Group Chats", items: groups }, { label: "Channels", items: channels }].map(({ label, items }) =>
            items.length > 0 && (
              <div key={label} className="mb-2">
                <div className="px-4 py-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                  <span>{label}</span>
                  <button className="hover:text-[color:var(--neon-green)] transition-colors"><Plus size={11} /></button>
                </div>
                {items.map(chat => (
                  <button key={chat.id} onClick={() => handleSelectChat(chat)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all ${activeChat?.id === chat.id ? "" : "hover:bg-muted/60"}`}
                    style={activeChat?.id === chat.id ? { background: "var(--neon-green-dim)", borderLeft: "2px solid var(--neon-green)" } : {}}>
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-black"
                        style={{ background: chat.color }}>
                        {chat.type === "channel" ? <Hash size={14} style={{ color: "black" }} /> : chat.avatar}
                      </div>
                      {chat.type === "dm" && (
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[hsl(var(--sidebar-bg))] ${chat.online ? "status-online" : "status-offline"}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs truncate ${chat.unread ? "font-semibold text-foreground" : "text-foreground/80"}`}>{chat.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <span className="text-[11px] text-muted-foreground truncate">{chat.lastMsg}</span>
                        {chat.unread > 0 && (
                          <span className="flex-shrink-0 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 text-black"
                            style={{ background: "var(--neon-green)" }}>{chat.unread}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* ─── CHAT AREA ─── */}
      <div className={`${!showSidebar || activeChat ? "flex" : "hidden lg:flex"} flex-col flex-1 min-w-0 bg-card`}>
        {activeChat ? (
          <>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowSidebar(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors mr-1">
                  <ArrowLeft size={16} className="text-muted-foreground" />
                </button>
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-black"
                    style={{ background: activeChat.color }}>
                    {activeChat.type === "channel" ? <Hash size={14} style={{ color: "black" }} /> : activeChat.avatar}
                  </div>
                  {activeChat.type === "dm" && (
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${activeChat.online ? "status-online" : "status-offline"}`} />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{activeChat.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {activeChat.type === "dm" ? (activeChat.online ? "● online" : "○ offline") : `${activeChat.members ?? 0} members`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {activeChat.type === "dm" && (
                  <>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><Phone size={15} /></button>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><Video size={15} /></button>
                  </>
                )}
                <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><Pin size={15} /></button>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><MoreHorizontal size={15} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {messages.map((msg, i) => {
                const prev = messages[i - 1];
                const grouped = prev && prev.from === msg.from;
                return (
                  <div key={msg.id} className={`flex items-end gap-2.5 ${msg.fromMe ? "flex-row-reverse" : ""} ${grouped ? "mt-0.5" : "mt-4"}`}>
                    {!grouped ? (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-black flex-shrink-0"
                        style={{ background: CHATS.find(c => c.name === msg.from)?.color ?? "linear-gradient(135deg, var(--neon-green), var(--electric-blue))" }}>
                        {msg.fromMe ? "U" : msg.avatar}
                      </div>
                    ) : <div className="w-7 flex-shrink-0" />}
                    <div className={`flex flex-col ${msg.fromMe ? "items-end" : "items-start"} max-w-[72%]`}>
                      {!grouped && !msg.fromMe && (
                        <span className="text-[11px] font-semibold text-foreground mb-1 ml-1">{msg.from}</span>
                      )}
                      <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${msg.fromMe ? "rounded-br-sm" : "rounded-bl-sm"}`}
                        style={msg.fromMe
                          ? { background: "var(--neon-green)", color: "hsl(var(--background))" }
                          : { background: "hsl(var(--muted))" }}>
                        {msg.text}
                      </div>
                      {!grouped && <span className="text-[10px] text-muted-foreground font-mono mt-1 mx-1">{msg.time}</span>}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-border flex-shrink-0">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-muted focus-within:border-[var(--neon-green)]/50 focus-within:bg-card transition-all">
                <button className="text-muted-foreground hover:text-foreground transition-colors"><Paperclip size={15} /></button>
                <button className="text-muted-foreground hover:text-foreground transition-colors"><Code2 size={15} /></button>
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder={`Message ${activeChat.type === "channel" ? "#" : ""}${activeChat.name}...`}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-mono" />
                <button className="text-muted-foreground hover:text-foreground transition-colors"><AtSign size={15} /></button>
                <button className="text-muted-foreground hover:text-foreground transition-colors"><Smile size={15} /></button>
                <button onClick={handleSend} disabled={!input.trim()}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-40 text-black"
                  style={{ background: "var(--neon-green)" }}>
                  <Send size={12} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--neon-green)]/30"
                style={{ background: "var(--neon-green-dim)" }}>
                <MessageSquare size={24} style={{ color: "var(--neon-green)" }} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Select a conversation</h3>
              <p className="text-xs text-muted-foreground font-mono">DMs · Groups · Channels</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
