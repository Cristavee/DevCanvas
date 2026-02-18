"use client";
import { useState } from "react";
import { Trophy, Zap, Code2, Star, TrendingUp, Medal } from "lucide-react";

const USERS = [
  { rank: 1, name: 'Priya Sharma', username: 'priyaS', xp: 12840, snippets: 48, likes: 1240, streak: 31, lang: 'TypeScript', badge: '🏆', tier: 'Diamond' },
  { rank: 2, name: 'Marcus Wei', username: 'marcusW', xp: 11220, snippets: 42, likes: 980, streak: 24, lang: 'Rust', badge: '🥈', tier: 'Platinum' },
  { rank: 3, name: 'Sarah Chen', username: 'sarahC', xp: 9750, snippets: 38, likes: 820, streak: 18, lang: 'CSS', badge: '🥉', tier: 'Platinum' },
  { rank: 4, name: 'Emma Davis', username: 'emmaD', xp: 8430, snippets: 31, likes: 710, streak: 14, lang: 'Python', badge: '', tier: 'Gold' },
  { rank: 5, name: 'Alex Rivera', username: 'alexR', xp: 7890, snippets: 29, likes: 650, streak: 11, lang: 'Go', badge: '', tier: 'Gold' },
  { rank: 6, name: 'Jake Morrison', username: 'jakeM', xp: 6540, snippets: 24, likes: 520, streak: 8, lang: 'Go', badge: '', tier: 'Gold' },
  { rank: 7, name: 'You', username: 'you', xp: 2840, snippets: 11, likes: 180, streak: 14, lang: 'TypeScript', badge: '', tier: 'Silver', isMe: true },
  { rank: 12, name: 'Yuki Tanaka', username: 'yukiT', xp: 2120, snippets: 8, likes: 140, streak: 5, lang: 'Python', badge: '', tier: 'Silver' },
];

const TIERS = ['All', 'Diamond', 'Platinum', 'Gold', 'Silver'];

const TIER_COLOR: Record<string, string> = {
  Diamond: '#A8DAFF',
  Platinum: '#E5E4E2',
  Gold: '#FFB347',
  Silver: '#C0C0C0',
  Bronze: '#CD7F32',
};

export default function LeaderboardPage() {
  const [tab, setTab] = useState('weekly');
  const [tier, setTier] = useState('All');

  const filtered = tier === 'All' ? USERS : USERS.filter(u => u.tier === tier);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy size={22} style={{ color: '#FFB347' }} />
          Leaderboard
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5 font-mono">Reputation system — earn XP by sharing, helping, and engaging</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-card w-fit">
        {['weekly', 'monthly', 'alltime'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-mono capitalize transition-all ${tab === t ? 'text-[color:var(--neon-green)] bg-[var(--neon-green-dim)]' : 'text-muted-foreground hover:text-foreground'}`}>
            {t === 'alltime' ? 'All Time' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3">
        {[USERS[1], USERS[0], USERS[2]].map((u, i) => {
          const isCenter = i === 1;
          return (
            <div key={u.rank}
              className={`relative flex flex-col items-center p-4 rounded-xl border transition-all ${isCenter ? 'border-[var(--neon-green)]/40 bg-[var(--neon-green-dim)]' : 'border-border bg-card'}`}>
              {isCenter && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-black"
                  style={{ background: 'var(--neon-green)' }}>
                  #1 RANK
                </div>
              )}
              <div className="text-2xl mb-2">{u.badge || '🏅'}</div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black mb-2"
                style={{ background: 'linear-gradient(135deg, var(--neon-green), var(--electric-blue))' }}>
                {u.name[0]}
              </div>
              <div className="text-sm font-semibold text-foreground text-center">{u.name}</div>
              <div className="text-[10px] font-mono text-muted-foreground">@{u.username}</div>
              <div className="mt-2 text-lg font-bold font-mono" style={{ color: 'var(--neon-green)' }}>
                {u.xp.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted-foreground">XP</div>
              <div className="mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono"
                style={{ background: TIER_COLOR[u.tier] + '20', color: TIER_COLOR[u.tier] }}>
                {u.tier}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tier filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-muted-foreground">Filter:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {TIERS.map(t => (
            <button key={t} onClick={() => setTier(t)}
              className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all ${tier === t ? 'border-[var(--electric-blue)] bg-[var(--electric-blue-dim)] text-[color:var(--electric-blue)]' : 'border-border text-muted-foreground hover:text-foreground'}`}
              style={t !== 'All' ? { borderColor: tier === t ? 'var(--electric-blue)' : TIER_COLOR[t] + '40', color: tier === t ? 'var(--electric-blue)' : TIER_COLOR[t] } : {}}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_80px_80px_80px_80px] gap-4 px-4 py-3 border-b border-border bg-muted/30 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          <div>#</div>
          <div>Developer</div>
          <div className="text-right">XP</div>
          <div className="text-right hidden sm:block">Snippets</div>
          <div className="text-right hidden md:block">Streak</div>
          <div className="text-right">Tier</div>
        </div>
        {filtered.map((u) => (
          <div key={u.rank}
            className={`grid grid-cols-[40px_1fr_80px_80px_80px_80px] gap-4 px-4 py-3.5 border-b border-border last:border-0 transition-colors ${u.isMe ? 'bg-[var(--neon-green-dim)]' : 'hover:bg-muted/30'}`}>
            <div className="flex items-center">
              <span className={`text-sm font-mono font-bold ${u.rank <= 3 ? '' : 'text-muted-foreground'}`}
                style={u.rank <= 3 ? { color: u.rank === 1 ? '#FFB347' : u.rank === 2 ? '#C0C0C0' : '#CD7F32' } : {}}>
                {u.badge || `#${u.rank}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                style={{ background: u.isMe ? 'linear-gradient(135deg, var(--neon-green), var(--electric-blue))' : 'linear-gradient(135deg, #4a5568, #718096)' }}>
                {u.name[0]}
              </div>
              <div>
                <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  {u.name}
                  {u.isMe && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: 'var(--neon-green)', color: 'black' }}>You</span>}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">@{u.username} · {u.lang}</div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-mono font-bold" style={{ color: 'var(--neon-green)' }}>
                {u.xp.toLocaleString()}
              </span>
            </div>
            <div className="hidden sm:flex items-center justify-end">
              <span className="text-xs font-mono text-muted-foreground">{u.snippets}</span>
            </div>
            <div className="hidden md:flex items-center justify-end gap-1">
              <span className="text-xs font-mono text-muted-foreground">{u.streak}d</span>
              <span className="text-[10px]">🔥</span>
            </div>
            <div className="flex items-center justify-end">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                style={{ background: TIER_COLOR[u.tier] + '18', color: TIER_COLOR[u.tier] }}>
                {u.tier}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* XP guide */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap size={14} style={{ color: 'var(--neon-green)' }} />
          How to Earn XP
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { action: 'Post a snippet', xp: '+50 XP' },
            { action: 'Get a like', xp: '+5 XP' },
            { action: 'Get a comment', xp: '+10 XP' },
            { action: 'Daily streak', xp: '+20 XP/day' },
            { action: 'Community post', xp: '+30 XP' },
            { action: 'Help answer', xp: '+40 XP' },
            { action: 'Get featured', xp: '+200 XP' },
            { action: 'Milestone', xp: 'Bonus' },
          ].map(({ action, xp }) => (
            <div key={action} className="flex items-center justify-between p-2.5 rounded-lg border border-border text-xs">
              <span className="text-muted-foreground">{action}</span>
              <span className="font-mono font-semibold" style={{ color: 'var(--neon-green)' }}>{xp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
