"use client";
import { useState } from "react";
import { TrendingUp, Eye, Heart, MessageSquare, Star, Code2, Users, BarChart2, Activity, ArrowUp, ArrowDown } from "lucide-react";

const MOCK_VIEWS = [12, 19, 8, 24, 31, 22, 18, 35, 28, 42, 39, 51, 47, 55, 48, 62];
const MOCK_LIKES = [2, 5, 1, 8, 11, 7, 4, 14, 9, 18, 13, 22, 19, 26, 21, 30];

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 80}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <polyline points={points + ` 100,100 0,100`} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TOP_SNIPPETS = [
  { title: 'React useDebounce Hook', views: 2840, likes: 94, comments: 21, trend: 'up' },
  { title: 'Rust Concurrent Processor', views: 1920, likes: 62, comments: 5, trend: 'up' },
  { title: 'CSS Grid Layout System', views: 1540, likes: 41, comments: 14, trend: 'down' },
  { title: 'Animated Gradient Button', views: 1280, likes: 48, comments: 12, trend: 'up' },
  { title: 'FastAPI Auth Middleware', views: 960, likes: 31, comments: 8, trend: 'down' },
];

const LANG_DIST = [
  { lang: 'TypeScript', pct: 38, color: '#3178C6' },
  { lang: 'Python', pct: 24, color: '#3776AB' },
  { lang: 'Rust', pct: 18, color: '#CE4A07' },
  { lang: 'Go', pct: 12, color: '#00ACD7' },
  { lang: 'CSS', pct: 8, color: '#2965F1' },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState('30d');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5 font-mono">Your developer footprint on DevCanvas</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-card">
          {['7d', '30d', '90d'].map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${range === r ? 'text-[color:var(--neon-green)] bg-[var(--neon-green-dim)]' : 'text-muted-foreground hover:text-foreground'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Views', value: '12,840', delta: '+18%', icon: Eye, color: 'var(--electric-blue)', data: MOCK_VIEWS },
          { label: 'Total Likes', value: '1,240', delta: '+24%', icon: Heart, color: '#FF6B6B', data: MOCK_LIKES },
          { label: 'Comments', value: '384', delta: '+12%', icon: MessageSquare, color: 'var(--neon-green)', data: MOCK_VIEWS.map(v => Math.round(v * 0.3)) },
          { label: 'Snippets', value: '24', delta: '+3 new', icon: Code2, color: '#FFB347', data: [1,1,2,1,1,2,1,3,1,2,1,1,2,2,1,2] },
        ].map(({ label, value, delta, icon: Icon, color, data }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={15} style={{ color }} />
              </div>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full text-[color:var(--neon-green)] bg-[var(--neon-green-dim)]">
                {delta}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
            <MiniChart data={data} color={color} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Top Snippets */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: 'var(--neon-green)' }} />
            <h2 className="text-sm font-semibold text-foreground">Top Performing Snippets</h2>
          </div>
          <div className="space-y-3">
            {TOP_SNIPPETS.map((s, i) => (
              <div key={s.title} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <span className="text-xs font-mono text-muted-foreground w-4 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{s.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <Eye size={10} /> {s.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <Heart size={10} /> {s.likes}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <MessageSquare size={10} /> {s.comments}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-mono ${s.trend === 'up' ? '' : 'text-red-400'}`}
                  style={s.trend === 'up' ? { color: 'var(--neon-green)' } : {}}>
                  {s.trend === 'up' ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language breakdown */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Code2 size={14} style={{ color: 'var(--electric-blue)' }} />
            <h2 className="text-sm font-semibold text-foreground">Language Distribution</h2>
          </div>
          <div className="space-y-3">
            {LANG_DIST.map(l => (
              <div key={l.lang} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-foreground">{l.lang}</span>
                  <span className="font-mono text-muted-foreground">{l.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${l.pct}%`, background: l.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-border">
            <div className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Profile Stats</div>
            <div className="space-y-2">
              {[
                { label: 'XP Points', value: '2,840', color: 'var(--neon-green)' },
                { label: 'Global Rank', value: '#12', color: '#FFB347' },
                { label: 'Followers', value: '128', color: 'var(--electric-blue)' },
                { label: 'Streak', value: '14 days 🔥', color: '#FF6B6B' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono font-semibold" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
