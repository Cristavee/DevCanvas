"use client";
import { useState } from "react";
import { Users, Code2, MessageSquare, TrendingUp, Shield, AlertTriangle, CheckCircle, Ban, Eye, Search, Filter, BarChart2, Bell, Settings, Activity, Globe, Zap } from "lucide-react";

const TABS = ['Overview', 'Users', 'Content', 'Reports', 'Settings'];

const MOCK_USERS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@dev.io', role: 'admin', status: 'active', joined: '2024-01-15', snippets: 48, xp: 12840 },
  { id: 2, name: 'Marcus Wei', email: 'marcus@dev.io', role: 'moderator', status: 'active', joined: '2024-02-08', snippets: 42, xp: 11220 },
  { id: 3, name: 'Spam User 1', email: 'spam@fake.xyz', role: 'user', status: 'banned', joined: '2024-03-10', snippets: 0, xp: 0 },
  { id: 4, name: 'Jake Morrison', email: 'jake@dev.io', role: 'user', status: 'active', joined: '2024-01-29', snippets: 24, xp: 6540 },
  { id: 5, name: 'Emma Davis', email: 'emma@dev.io', role: 'user', status: 'active', joined: '2024-02-14', snippets: 31, xp: 8430 },
];

const REPORTS = [
  { id: 1, type: 'spam', target: 'Snippet: "Buy crypto now"', reporter: 'Sarah Chen', status: 'pending', time: '2h ago' },
  { id: 2, type: 'inappropriate', target: 'User: spam_user_1', reporter: 'Marcus Wei', status: 'resolved', time: '5h ago' },
  { id: 3, type: 'spam', target: 'Comment: "click here..."', reporter: 'Emma Davis', status: 'pending', time: '1d ago' },
];

function StatCard({ icon: Icon, label, value, delta, color }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full" style={{ color: 'var(--neon-green)', background: 'var(--neon-green-dim)' }}>
          {delta}
        </span>
      </div>
      <div className="text-2xl font-bold font-mono text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  active: 'var(--neon-green)',
  banned: '#FF6B6B',
  pending: '#FFB347',
  resolved: 'var(--electric-blue)',
};

export default function AdminPage() {
  const [tab, setTab] = useState('Overview');
  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield size={22} style={{ color: 'var(--electric-blue)' }} />
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5 font-mono">DevCanvas Control Center · v3.0</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--neon-green)]/30 text-xs font-mono" style={{ color: 'var(--neon-green)', background: 'var(--neon-green-dim)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-neon" style={{ background: 'var(--neon-green)' }} />
            System healthy
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border border-border bg-card w-fit overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${tab === t ? 'text-[color:var(--electric-blue)] bg-[var(--electric-blue-dim)]' : 'text-muted-foreground hover:text-foreground'}`}>
            {t}
            {t === 'Reports' && <span className="ml-1.5 text-[10px] px-1 py-0.5 rounded-full text-black" style={{ background: '#FFB347' }}>2</span>}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={Users} label="Total Users" value="1,284" delta="+18 today" color="var(--electric-blue)" />
            <StatCard icon={Code2} label="Snippets" value="2,847" delta="+34 today" color="var(--neon-green)" />
            <StatCard icon={MessageSquare} label="Messages" value="18,420" delta="+290 today" color="#FF6B6B" />
            <StatCard icon={TrendingUp} label="Daily Active" value="342" delta="+12%" color="#FFB347" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent reports */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle size={14} style={{ color: '#FFB347' }} />
                  Pending Reports
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-black" style={{ background: '#FFB347' }}>2 open</span>
              </div>
              <div className="space-y-2.5">
                {REPORTS.filter(r => r.status === 'pending').map(r => (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <AlertTriangle size={14} style={{ color: '#FFB347' }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">{r.target}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">by {r.reporter} · {r.time}</div>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="px-2 py-1 rounded text-[10px] font-mono border border-[var(--neon-green)]/40 text-[color:var(--neon-green)] hover:bg-[var(--neon-green-dim)] transition-colors">
                        Resolve
                      </button>
                      <button className="px-2 py-1 rounded text-[10px] font-mono border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System metrics */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity size={14} style={{ color: 'var(--electric-blue)' }} />
                System Metrics
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'API Response Time', value: '124ms', status: 'ok', pct: 85 },
                  { label: 'DB Query Time', value: '12ms', status: 'ok', pct: 95 },
                  { label: 'CDN Hit Rate', value: '98.2%', status: 'ok', pct: 98 },
                  { label: 'Error Rate', value: '0.02%', status: 'ok', pct: 99 },
                  { label: 'Uptime', value: '99.98%', status: 'ok', pct: 100 },
                ].map(m => (
                  <div key={m.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-mono">{m.label}</span>
                      <span className="font-mono font-semibold" style={{ color: 'var(--neon-green)' }}>{m.value}</span>
                    </div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: 'var(--neon-green)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Users' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm font-mono outline-none focus:border-[var(--electric-blue)]/50 transition-colors" />
            </div>
          </div>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_80px_80px_120px] gap-4 px-5 py-3 border-b border-border bg-muted/30 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              <div>User</div>
              <div>Role</div>
              <div className="text-right">Snippets</div>
              <div className="text-right">XP</div>
              <div className="text-right">Status</div>
            </div>
            {filteredUsers.map(u => (
              <div key={u.id} className="grid grid-cols-[1fr_120px_80px_80px_120px] gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--neon-green), var(--electric-blue))' }}>
                    {u.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{u.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{u.email}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize ${u.role === 'admin' ? 'text-[color:var(--electric-blue)] bg-[var(--electric-blue-dim)]' : u.role === 'moderator' ? '' : 'text-muted-foreground bg-muted'}`}
                    style={u.role === 'moderator' ? { color: '#FFB347', background: '#FFB34718' } : {}}>
                    {u.role}
                  </span>
                </div>
                <div className="flex items-center justify-end text-sm font-mono text-muted-foreground">{u.snippets}</div>
                <div className="flex items-center justify-end text-sm font-mono" style={{ color: 'var(--neon-green)' }}>{u.xp.toLocaleString()}</div>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full capitalize"
                    style={{ color: STATUS_COLORS[u.status], background: STATUS_COLORS[u.status] + '18' }}>
                    {u.status}
                  </span>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                    {u.status === 'banned' ? <CheckCircle size={13} /> : <Ban size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(tab === 'Content' || tab === 'Reports' || tab === 'Settings') && (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <Shield size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-mono text-muted-foreground">{tab} panel — full implementation in v3.1</p>
        </div>
      )}
    </div>
  );
}
