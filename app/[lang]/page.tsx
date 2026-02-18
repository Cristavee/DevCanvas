import { getDictionary } from '@/lib/get-dictionary';
import { ProjectCard } from '@/components/ProjectCard';
import Link from 'next/link';
import { TrendingUp, Zap, Users, Code2, ArrowRight, Star, GitBranch, MessageSquare } from 'lucide-react';

const DEMO_PROJECTS = [
  {
    _id: '1',
    title: 'Animated Gradient Button',
    description: 'A beautiful CSS animated gradient button with smooth color transitions and hover effects.',
    codeSnippet: `const Button = styled.button\`
  background: linear-gradient(90deg, #667eea, #764ba2);
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
  color: white;
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
  },
  {
    _id: '2',
    title: 'FastAPI Auth Middleware',
    description: 'JWT authentication middleware for FastAPI with refresh tokens and role-based access.',
    codeSnippet: `from fastapi import Depends, HTTPException
from jose import JWTError, jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get('sub')
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception`,
    language: 'Python',
    tags: ['fastapi', 'jwt', 'auth'],
    likes: ['u1', 'u2'],
    author: { name: 'Alex Rivera', _id: 'u2' },
    comments: 8,
  },
  {
    _id: '3',
    title: 'Rust Concurrent File Processor',
    description: "Process thousands of files concurrently using Rust's async runtime with tokio.",
    codeSnippet: `use tokio::fs;
use futures::future::join_all;

async fn process_files(paths: Vec<PathBuf>) -> Vec<Result<String>> {
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
  },
  {
    _id: '5',
    title: 'Go HTTP Rate Limiter',
    description: 'Token bucket rate limiter middleware for Go HTTP servers with configurable limits.',
    codeSnippet: `func RateLimiter(rps float64, burst int) func(http.Handler) http.Handler {
    limiter := rate.NewLimiter(rate.Limit(rps), burst)
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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
  },
];

const ACTIVE_COMMUNITIES = [
  { name: 'javascript', display: 'JavaScript', members: '12.4k', color: 'from-yellow-400 to-orange-500', icon: '⚡' },
  { name: 'python', display: 'Python', members: '9.8k', color: 'from-blue-400 to-cyan-500', icon: '🐍' },
  { name: 'rust', display: 'Rust', members: '4.2k', color: 'from-orange-500 to-red-500', icon: '🦀' },
  { name: 'typescript', display: 'TypeScript', members: '8.1k', color: 'from-blue-600 to-indigo-600', icon: '🔷' },
];

export default async function HomePage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang);
  let projects = DEMO_PROJECTS as any[];

  try {
    const { default: dbConnect } = await import('@/lib/mongodb');
    const { default: Project } = await import('@/models/Project');
    await dbConnect();
    const dbProjects = await Project.find({ visibility: 'Public' })
      .sort({ createdAt: -1 })
      .limit(12)
      .populate('author', 'name avatar')
      .lean();
    if (dbProjects.length > 0) {
      projects = JSON.parse(JSON.stringify(dbProjects));
    }
  } catch { /* Use demo data */ }

  const trending = projects.slice(0, 3);
  const latest = projects.slice(0, 6);

  return (
    <div className="space-y-10">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 via-primary to-accent p-8 md:p-12">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-white mb-5 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Open Platform · Free Forever
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Where developers<br />
            <span className="text-white/80">build together</span>
          </h1>

          <p className="text-white/70 text-base md:text-lg max-w-xl mb-8 leading-relaxed">
            Share code snippets, discover patterns, join communities, and chat with developers around the world.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${lang}/upload`}
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
            >
              <Code2 size={16} />
              Share Code
            </Link>
            <Link
              href={`/${lang}/search`}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-medium px-5 py-2.5 rounded-xl hover:bg-white/25 transition-all border border-white/25"
            >
              Explore Projects
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-white/20">
            {[
              { icon: Code2, label: 'Code snippets', value: '2,400+' },
              { icon: Users, label: 'Developers', value: '500+' },
              { icon: MessageSquare, label: 'Discussions', value: '1,200+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 text-white">
                <Icon size={14} className="opacity-70" />
                <span className="font-bold">{value}</span>
                <span className="text-white/60 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVE COMMUNITIES */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-muted-foreground" />
            <h2 className="text-base font-semibold text-foreground">Active Communities</h2>
          </div>
          <Link href={`/${lang}/community`} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ACTIVE_COMMUNITIES.map((c) => (
            <Link
              key={c.name}
              href={`/${lang}/community/${c.name}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/30 transition-all hover:shadow-md p-4"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-lg mb-3`}>
                {c.icon}
              </div>
              <div className="font-semibold text-sm text-foreground">{c.display}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{c.members} members</div>
              <ArrowRight size={14} className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-orange-500" />
          <h2 className="text-base font-semibold text-foreground">Trending Now</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {trending.map((project) => (
            <div key={project._id} className="min-w-[300px] md:min-w-[320px] flex-shrink-0">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </section>

      {/* LATEST */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">Latest Projects</h2>
          </div>
          <Link href={`/${lang}/search`} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {latest.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </section>

      {/* COMMUNITY CTA */}
      <section className="rounded-3xl border border-border bg-gradient-to-br from-muted/50 to-card p-8 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users size={28} className="text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Join the conversation</h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
          Connect with developers, join communities, chat privately or in groups. Your next breakthrough is one conversation away.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href={`/${lang}/community`} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm">
            Browse Communities
          </Link>
          <Link href={`/${lang}/chat`} className="inline-flex items-center gap-2 bg-card border border-border text-foreground font-medium px-5 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm">
            <MessageSquare size={16} />
            Open Chat
          </Link>
        </div>
      </section>

    </div>
  );
}
