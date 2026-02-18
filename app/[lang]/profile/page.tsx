"use client";
import { useState } from "react";
import { Code2, Star, Heart, MessageSquare, Users, GitBranch, Zap, Trophy, Calendar, MapPin, Link2, Twitter, Github, Edit3, TrendingUp, Clock } from "lucide-react";

const TABS = ['Overview', 'Snippets', 'Stars', 'Activity'];

const CONTRIBUTION_DATA = [
  [0,1,3,0,2,4,1],[2,0,1,3,2,1,0],[1,4,2,3,1,0,2],[3,1,0,2,4,3,1],
  [0,2,3,1,0,2,4],[4,1,2,0,3,1,2],[1,3,0,4,2,1,3],[2,0,4,1,3,2,0],
  [3,2,1,0,4,3,1],[1,4,2,3,0,1,2],[0,1,3,2,4,0,1],[4,2,0,1,3,4,2],
];

function ContribCell({ value }: { value: number }) {
  const opacity = value === 0 ? 0.05 : value === 1 ? 0.25 : value === 2 ? 0.45 : value === 3 ? 0.65 : 0.9;
  return (
    <div className="w-3 h-3 rounded-sm transition-opacity hover:opacity-100"
      style={{ background: `rgba(0, 255, 179, ${opacity})` }}
      title={`${value} contributions`} />
  );
}

const SNIPPETS = [
  { title: 'React useDebounce Hook', lang: 'TypeScript', likes: 94, stars: 48, time: '2d ago' },
  { title: 'CSS Grid Layout System', lang: 'CSS', likes: 41, stars: 22, time: '5d ago' },
  { title: 'Rust Concurrent Processor', lang: 'Rust', likes: 62, stars: 31, time: '1w ago' },
];

const BADGES = [
  { icon: '🔥', label: 'Hot Streak', desc: '14 day streak' },
  { icon: '🚀', label: 'Sharpshooter', desc: '10 snippets' },
  { icon: '⭐', label: 'Rising Star', desc: '100+ likes' },
  { icon: '🦾', label: 'TypeScript Pro', desc: 'Top TS author' },
  { icon: '💎', label: 'Contributor', desc: '500+ XP' },
  { icon: '🌍', label: 'Global Dev', desc: '5 languages' },
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6', Python: '#3776AB', Rust: '#CE4A07',
  Go: '#00ACD7', CSS: '#2965F1', JavaScript: '#F7DF1E',
};

export default function ProfilePage() {
  const [tab, setTab] = useState('Overview');

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Header */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="h-28 relative grid-pattern" style={{ background: 'linear-gradient(135deg, var(--neon-green-dim), var(--electric-blue-dim))' }}>
          <button className="absolute top-3 right-3 px-3 py-1.5 rounded-lg border border-border bg-card/80 backdrop-blur-sm text-xs font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            <Edit3 size={11} />
            Edit Profile
          </button>
        </div>
        <div className="px-6 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-card flex-shrink-0">
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--neon-green), var(--electric-blue))' }} />
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-black">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Your Name</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-black" style={{ background: 'var(--neon-green)' }}>PRO</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border" style={{ borderColor: '#FFB347', color: '#FFB347', background: '#FFB34718' }}>Gold Tier</span>
              </div>
              <div className="text-sm text-muted-foreground font-mono mt-0.5">@yourusername</div>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">Full-stack developer passionate about TypeScript, Rust, and open-source. Building the future one snippet at a time. 🚀</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
            {[
              { icon: MapPin, text: 'San Francisco, CA' },
              { icon: Link2, text: 'yourwebsite.dev' },
              { icon: Twitter, text: '@yourtw' },
              { icon: Github, text: 'yourgithub' },
              { icon: Calendar, text: 'Joined March 2024' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                <Icon size={12} />
                <span className="font-mono">{text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-5">
            {[
              { value: '2,840', label: 'XP', color: 'var(--neon-green)' },
              { value: '#12', label: 'Rank', color: '#FFB347' },
              { value: '24', label: 'Snippets' },
              { value: '1,240', label: 'Total Likes' },
              { value: '128', label: 'Followers' },
              { value: '14d 🔥', label: 'Streak' },
            ].map(({ value, label, color }) => (
              <div key={label} className="text-center">
                <div className="text-lg font-bold font-mono" style={{ color: color ?? 'hsl(var(--foreground))' }}>{value}</div>
                <div className="text-[10px] text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border border-border bg-card w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${tab === t ? 'text-[color:var(--neon-green)] bg-[var(--neon-green-dim)]' : 'text-muted-foreground hover:text-foreground'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
          <div className="space-y-5">
            {/* Contribution graph */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp size={14} style={{ color: 'var(--neon-green)' }} />
                  Contribution Activity
                </h2>
                <span className="text-xs font-mono text-muted-foreground">Last 84 days</span>
              </div>
              <div className="overflow-x-auto">
                <div className="flex gap-1">
                  {CONTRIBUTION_DATA.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1">
                      {week.map((day, di) => <ContribCell key={di} value={day} />)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-muted-foreground">
                  <span>Less</span>
                  {[0.05, 0.25, 0.45, 0.65, 0.9].map(o => (
                    <div key={o} className="w-3 h-3 rounded-sm" style={{ background: `rgba(0, 255, 179, ${o})` }} />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* Recent snippets */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Recent Snippets</h2>
              <div className="space-y-3">
                {SNIPPETS.map((s) => (
                  <div key={s.title} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: LANG_COLORS[s.lang] ?? '#64748B' }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{s.title}</div>
                      <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{s.lang} · {s.time}</div>
                    </div>
                    <div className="flex items-center gap-2.5 text-[11px] font-mono text-muted-foreground">
                      <span className="flex items-center gap-1"><Star size={11} /> {s.stars}</span>
                      <span className="flex items-center gap-1"><Heart size={11} /> {s.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Badges */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <Trophy size={13} style={{ color: '#FFB347' }} />
                Achievements
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {BADGES.map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-border hover:border-[var(--neon-green)]/30 hover:bg-[var(--neon-green-dim)] transition-all cursor-pointer text-center">
                    <span className="text-xl">{b.icon}</span>
                    <span className="text-[10px] font-mono text-foreground leading-tight">{b.label}</span>
                    <span className="text-[9px] text-muted-foreground">{b.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lang stats */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">Languages</h2>
              <div className="space-y-2.5">
                {[
                  { lang: 'TypeScript', pct: 42 },
                  { lang: 'Rust', pct: 28 },
                  { lang: 'CSS', pct: 18 },
                  { lang: 'Python', pct: 12 },
                ].map(({ lang, pct }) => (
                  <div key={lang} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-mono text-muted-foreground">{lang}</span>
                      <span className="font-mono text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: LANG_COLORS[lang] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab !== 'Overview' && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="w-12 h-12 rounded-xl border border-border flex items-center justify-center mx-auto mb-3">
            <Clock size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground font-mono">{tab} view coming in v3.1</p>
        </div>
      )}
    </div>
  );
}
