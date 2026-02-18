"use client";
import { useState } from "react";
import { Hash, Users, TrendingUp, Plus, Search, MessageSquare, Star, ArrowRight, Lock, Globe, Zap } from "lucide-react";
import Link from "next/link";

const COMMUNITIES = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '⚡',
    accent: '#F7DF1E',
    members: 12400,
    description: 'Everything JavaScript — ES2024, frameworks, patterns, and the eternal debates.',
    channels: ['#general', '#help', '#showcase', '#jobs', '#react', '#node'],
    tags: ['web', 'frontend', 'fullstack'],
    posts: 284,
    online: 192,
    joined: true,
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    accent: '#3776AB',
    members: 9800,
    description: 'Python for web, data science, AI/ML, automation, and everything in between.',
    channels: ['#general', '#data-science', '#django', '#fastapi', '#ai-ml'],
    tags: ['data', 'ai', 'backend'],
    posts: 197,
    online: 134,
    joined: false,
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: '🦀',
    accent: '#CE4A07',
    members: 4200,
    description: 'Systems programming for the modern era. Safe, fast, and fearless concurrency.',
    channels: ['#general', '#beginners', '#async', '#embedded', '#wasm'],
    tags: ['systems', 'performance', 'safety'],
    posts: 118,
    online: 76,
    joined: true,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    accent: '#3178C6',
    members: 8100,
    description: 'Type-safe JavaScript at scale. Types, generics, decorators, and tooling.',
    channels: ['#general', '#types', '#nextjs', '#tooling', '#patterns'],
    tags: ['types', 'frontend', 'fullstack'],
    posts: 203,
    online: 148,
    joined: false,
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🔵',
    accent: '#00ACD7',
    members: 5600,
    description: "Google's language for cloud-native, microservices, and high-performance systems.",
    channels: ['#general', '#cloud', '#goroutines', '#gin', '#grpc'],
    tags: ['cloud', 'backend', 'devops'],
    posts: 142,
    online: 89,
    joined: false,
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: '☁️',
    accent: '#FF9900',
    members: 3200,
    description: 'Kubernetes, Docker, CI/CD, infrastructure as code, and cloud platforms.',
    channels: ['#general', '#kubernetes', '#terraform', '#github-actions', '#aws'],
    tags: ['cloud', 'infra', 'k8s'],
    posts: 94,
    online: 52,
    joined: false,
  },
];

export default function CommunityPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = COMMUNITIES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'joined') return matchSearch && c.joined;
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Communities</h1>
          <p className="text-muted-foreground text-sm mt-0.5 font-mono">Join sub-communities built around languages and technologies</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-mono transition-all hover:opacity-90 text-black w-fit"
          style={{ background: 'var(--neon-green)' }}>
          <Plus size={15} />
          Create Community
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon-green)]/50 transition-colors font-mono"
          />
        </div>
        <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
          {['all', 'joined', 'trending'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${filter === f ? 'text-[color:var(--neon-green)] bg-[var(--neon-green-dim)]' : 'text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Community grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.id}
            className="group rounded-xl border border-border bg-card overflow-hidden hover:border-[var(--neon-green)]/30 transition-all hover:shadow-[0_0_0_1px_var(--neon-green-dim)]">
            {/* Header gradient bar */}
            <div className="h-1.5" style={{ background: c.accent }} />
            
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border border-border"
                    style={{ background: c.accent + '15' }}>
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{c.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                        <Users size={10} />
                        {c.members.toLocaleString()}
                      </div>
                      <span className="text-muted-foreground text-[10px]">·</span>
                      <div className="flex items-center gap-1 text-[10px] font-mono" style={{ color: 'var(--neon-green)' }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse-neon inline-block" style={{ background: 'var(--neon-green)' }} />
                        {c.online} online
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex-shrink-0 ${c.joined ? 'border border-border text-muted-foreground hover:bg-muted' : 'text-black hover:opacity-90'}`}
                  style={!c.joined ? { background: 'var(--neon-green)' } : {}}>
                  {c.joined ? 'Joined' : 'Join'}
                </button>
              </div>

              <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">{c.description}</p>

              {/* Channels */}
              <div className="flex gap-1 flex-wrap mb-3">
                {c.channels.slice(0, 4).map(ch => (
                  <span key={ch} className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-[var(--electric-blue)]/40 transition-colors cursor-pointer">
                    {ch}
                  </span>
                ))}
                {c.channels.length > 4 && (
                  <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5">+{c.channels.length - 4} more</span>
                )}
              </div>

              {/* Tags & stats */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {c.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                  <MessageSquare size={10} />
                  {c.posts}/day
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-muted-foreground font-mono text-sm">No communities found for "{search}"</p>
        </div>
      )}
    </div>
  );
}
