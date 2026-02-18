import { getDictionary } from '@/lib/get-dictionary';
import Link from 'next/link';
import {
  TrendingUp, Zap, Users, Code2, ArrowRight, Star,
  GitBranch, MessageSquare, LayoutGrid, List, Columns3,
  Terminal, Trophy, Activity, Flame, Clock
} from 'lucide-react';
import { ProjectCardV3 } from '@/components/ProjectCardV3';

const DEMO_PROJECTS = [
  {
    _id: '1',
    title: 'Animated Gradient Button',
    description: 'A beautiful CSS animated gradient button with smooth color transitions and hover effects.',
    codeSnippet: `const Button = styled.button\`
  background: linear-gradient(90deg, #00FFB3, #4DABFF);
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
  color: #0a0f1e;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
\`;`,
    language: 'TypeScript',
    tags: ['css', 'animation', 'button'],
    likes: ['u1', 'u2', 'u3'],
    author: { name: 'Sarah Chen', _id: 'u1' },
    comments: 12,
    stars: 48,
  },
  {
    _id: '2',
    title: 'FastAPI Auth Middleware',
    description: 'JWT authentication middleware for FastAPI with refresh tokens and role-based access.',
    codeSnippet: `from fastapi import Depends, HTTPException
from jose import JWTError, jwt

async def get_current_user(
  token: str = Depends(oauth2_scheme)
):
    try:
        payload = jwt.decode(
          token, SECRET_KEY, algorithms=[ALGORITHM]
        )
        username = payload.get('sub')
        return username
    except JWTError:
        raise credentials_exception`,
    language: 'Python',
    tags: ['fastapi', 'jwt', 'auth'],
    likes: ['u1', 'u2'],
    author: { name: 'Alex Rivera', _id: 'u2' },
    comments: 8,
    stars: 31,
  },
  {
    _id: '3',
    title: 'Rust Concurrent Processor',
    description: "Process thousands of files concurrently using Rust's async runtime.",
    codeSnippet: `use tokio::fs;
use futures::future::join_all;

async fn process_files(
  paths: Vec<PathBuf>
) -> Vec<Result<String>> {
    let tasks: Vec<_> = paths.into_iter()
        .map(|p| tokio::spawn(async move {
            let content = fs::read_to_string(&p).await?;
            Ok(process_content(content))
        }))
        .collect();
    join_all(tasks).await
}`,
    language: 'Rust',
    tags: ['async', 'concurrency', 'tokio'],
    likes: ['u1'],
    author: { name: 'Marcus Wei', _id: 'u3' },
    comments: 5,
    stars: 62,
  },
  {
    _id: '4',
    title: 'React useDebounce Hook',
    description: 'A clean, type-safe debounce hook for React with automatic cleanup.',
    codeSnippet: `function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
    language: 'TypeScript',
    tags: ['react', 'hooks', 'performance'],
    likes: ['u1', 'u2', 'u3', 'u4'],
    author: { name: 'Priya Sharma', _id: 'u4' },
    comments: 21,
    stars: 94,
  },
  {
    _id: '5',
    title: 'Go HTTP Rate Limiter',
    description: 'Token bucket rate limiter middleware for Go HTTP servers.',
    codeSnippet: `func RateLimiter(rps float64, burst int) Middleware {
    limiter := rate.NewLimiter(rate.Limit(rps), burst)
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(
          func(w http.ResponseWriter, r *http.Request) {
            if !limiter.Allow() {
                http.Error(w, "Too Many Requests", 429)
                return
            }
            next.ServeHTTP(w, r)
        })
    }
}`,
    language: 'Go',
    tags: ['http', 'middleware', 'rate-limiting'],
    likes: ['u1', 'u2'],
    author: { name: 'Jake Morrison', _id: 'u5' },
    comments: 7,
    stars: 27,
  },
  {
    _id: '6',
    title: 'CSS Grid Layout System',
    description: 'A responsive 12-column grid system using pure CSS Grid with fluid breakpoints.',
    codeSnippet: `.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(16px, 2vw, 32px);
  padding: 0 clamp(16px, 4vw, 64px);
}

.col-span-6 { grid-column: span 6; }
.col-span-4 { grid-column: span 4; }

@media (max-width: 768px) {
  [class*="col-span-"] { grid-column: span 12; }
}`,
    language: 'CSS',
    tags: ['css', 'grid', 'responsive'],
    likes: ['u1'],
    author: { name: 'Emma Davis', _id: 'u6' },
    comments: 14,
    stars: 41,
  },
];

const COMMUNITIES = [
  { name: 'javascript', display: 'JavaScript', members: '12.4k', icon: '⚡', accent: '#F7DF1E', posts: 284 },
  { name: 'python', display: 'Python', members: '9.8k', icon: '🐍', accent: '#3776AB', posts: 197 },
  { name: 'rust', display: 'Rust', members: '4.2k', icon: '🦀', accent: '#CE4A07', posts: 118 },
  { name: 'typescript', display: 'TypeScript', members: '8.1k', icon: '🔷', accent: '#3178C6', posts: 203 },
];

const LEADERBOARD = [
  { rank: 1, name: 'Priya Sharma', xp: '12,840', badge: '🏆', lang: 'TS' },
  { rank: 2, name: 'Marcus Wei', xp: '11,220', badge: '🥈', lang: 'Rust' },
  { rank: 3, name: 'Sarah Chen', xp: '9,750', badge: '🥉', lang: 'CSS' },
];

export default async function HomePage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang);
  let projects = DEMO_PROJECTS as any[];

  try {
    const { default: dbConnect } = await import('@/lib/mongodb');
    const { default: Project } = await import('@/models/Project');
    await dbConnect();
    const dbProjects = await Project.find({ visibility: 'Public' })
      .sort({ createdAt: -1 }).limit(12)
      .populate('author', 'name avatar').lean();
    if (dbProjects.length > 0) projects = JSON.parse(JSON.stringify(dbProjects));
  } catch { /* Use demo data */ }

  return (
    <div className="space-y-8">

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 100% 0%, var(--neon-green-dim) 0%, transparent 60%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 0% 100%, var(--electric-blue-dim) 0%, transparent 60%)' }} />

        <div className="relative z-10 px-6 md:px-10 py-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono mb-6"
            style={{ borderColor: 'var(--neon-green)', color: 'var(--neon-green)', background: 'var(--neon-green-dim)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-neon" style={{ background: 'var(--neon-green)' }} />
            v3.0 · Developer OS · Live
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.1]">
            Your developer
            <br />
            <span className="font-mono" style={{ color: 'var(--neon-green)' }}>operating system</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-8 leading-relaxed">
            Ship code. Build communities. Run experiments. DevCanvas is where serious developers collaborate — not just share.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href={`/${lang}/upload`}
              className="inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:opacity-90 font-mono"
              style={{ background: 'var(--neon-green)', color: 'hsl(var(--background))' }}>
              <Code2 size={15} />
              New Snippet
            </Link>
            <Link href={`/${lang}/runner`}
              className="inline-flex items-center gap-2 font-medium px-5 py-2.5 rounded-xl text-sm border border-border hover:border-[var(--electric-blue)] hover:bg-[var(--electric-blue-dim)] transition-all text-foreground">
              <Terminal size={15} style={{ color: 'var(--electric-blue)' }} />
              Code Runner
            </Link>
            <Link href={`/${lang}/search`}
              className="inline-flex items-center gap-2 font-medium px-5 py-2.5 rounded-xl text-sm border border-border hover:bg-muted transition-all text-muted-foreground">
              Explore
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-border">
            {[
              { icon: Code2, value: '2,400+', label: 'Snippets', color: 'var(--neon-green)' },
              { icon: Users, value: '500+', label: 'Devs', color: 'var(--electric-blue)' },
              { icon: MessageSquare, value: '1,200+', label: 'Messages', color: '#FF6B6B' },
              { icon: Trophy, value: '48', label: 'Top ranked', color: '#FFB347' },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <Icon size={14} style={{ color }} />
                <span className="font-bold font-mono text-foreground">{value}</span>
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEED HEADER (layout switcher) ═══ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-foreground text-sm">Feed</h2>
          <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-border bg-card">
            {[
              { icon: Flame, label: 'Hot' },
              { icon: Clock, label: 'New' },
              { icon: Star, label: 'Top' },
            ].map(({ icon: Icon, label }) => (
              <button key={label}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${label === 'Hot' ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                style={label === 'Hot' ? { background: 'var(--neon-green-dim)', color: 'var(--neon-green)' } : {}}>
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-1.5 rounded-lg border border-border bg-card">
          {[LayoutGrid, List, Columns3].map((Icon, i) => (
            <button key={i}
              className={`p-1.5 rounded transition-all ${i === 0 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              style={i === 0 ? { background: 'var(--neon-green-dim)', color: 'var(--neon-green)' } : {}}>
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* ═══ TRENDING STRIP ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} style={{ color: '#FF6B6B' }} />
          <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Trending Now</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
          {projects.slice(0, 3).map((project) => (
            <div key={project._id} className="min-w-[280px] md:min-w-[310px] flex-shrink-0">
              <ProjectCardV3 project={project} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ MAIN GRID: Projects + Sidebar ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        {/* Projects */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} style={{ color: 'var(--electric-blue)' }} />
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Latest</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.slice(0, 6).map((project) => (
              <ProjectCardV3 key={project._id} project={project} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href={`/${lang}/search`}
              className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground border border-border hover:border-[var(--neon-green)] px-4 py-2 rounded-lg transition-all hover:bg-[var(--neon-green-dim)]">
              Load more
              <ArrowRight size={12} />
            </Link>
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="space-y-4">
          {/* Communities */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Communities</span>
              <Link href={`/${lang}/community`} className="text-[10px] font-mono hover:text-[color:var(--neon-green)] transition-colors text-muted-foreground">all →</Link>
            </div>
            <div className="space-y-2">
              {COMMUNITIES.map((c) => (
                <Link key={c.name} href={`/${lang}/community/${c.name}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-all group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 border border-border"
                    style={{ background: c.accent + '18' }}>
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{c.display}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{c.members} members · {c.posts} posts</div>
                  </div>
                  <ArrowRight size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Leaderboard preview */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Trophy size={11} style={{ color: '#FFB347' }} />
                Leaderboard
              </span>
              <Link href={`/${lang}/leaderboard`} className="text-[10px] font-mono hover:text-[color:var(--neon-green)] transition-colors text-muted-foreground">full →</Link>
            </div>
            <div className="space-y-2">
              {LEADERBOARD.map((u) => (
                <div key={u.rank} className="flex items-center gap-3 px-2 py-2 rounded-lg">
                  <span className="text-base w-5 text-center">{u.badge}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{u.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{u.lang}</div>
                  </div>
                  <span className="text-xs font-mono font-semibold" style={{ color: 'var(--neon-green)' }}>{u.xp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity pulse */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Activity size={11} style={{ color: 'var(--electric-blue)' }} />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Live Activity</span>
            </div>
            <div className="space-y-2.5">
              {[
                { user: 'Marcus', action: 'posted', item: 'Rust HashMap patterns', time: '2m' },
                { user: 'Emma', action: 'liked', item: 'CSS Grid trick', time: '4m' },
                { user: 'Jake', action: 'commented', item: 'Go middleware', time: '7m' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <div className="w-5 h-5 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-black"
                    style={{ background: 'linear-gradient(135deg, var(--neon-green), var(--electric-blue))' }}>
                    {a.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-foreground font-medium">{a.user}</span>
                    <span className="text-muted-foreground"> {a.action} </span>
                    <span className="text-foreground truncate">{a.item}</span>
                  </div>
                  <span className="text-muted-foreground font-mono text-[10px] flex-shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
