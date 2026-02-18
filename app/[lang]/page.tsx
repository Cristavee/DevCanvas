import { getDictionary } from '@/lib/get-dictionary';
import { ProjectCard } from '@/components/ProjectCard';

// Dummy data so page works without MongoDB configured
const DEMO_PROJECTS = [
  {
    _id: '1',
    title: 'Animated Gradient Button',
    description: 'A beautiful CSS animated gradient button component.',
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
    visibility: 'Public',
    author: { name: 'Sarah Chen', _id: 'u1' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'FastAPI Auth Middleware',
    description: 'JWT authentication middleware for FastAPI applications.',
    codeSnippet: `from fastapi import Depends, HTTPException
from jose import JWTError, jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception`,
    language: 'Python',
    tags: ['fastapi', 'jwt', 'auth'],
    likes: ['u1', 'u2'],
    visibility: 'Public',
    author: { name: 'Alex Rivera', _id: 'u2' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    title: 'Rust Concurrent File Processor',
    description: 'Process thousands of files concurrently using Rust\'s async runtime.',
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
    tags: ['async', 'concurrency', 'filesystem'],
    likes: ['u1'],
    visibility: 'Public',
    author: { name: 'Marcus Wei', _id: 'u3' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: '4',
    title: 'React Custom Hook: useDebounce',
    description: 'A clean debounce hook for React with TypeScript support.',
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
    visibility: 'Public',
    author: { name: 'Priya Sharma', _id: 'u4' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: '5',
    title: 'Go HTTP Rate Limiter',
    description: 'Token bucket rate limiter middleware for Go HTTP servers.',
    codeSnippet: `func RateLimiter(rps float64, burst int) func(http.Handler) http.Handler {
    limiter := rate.NewLimiter(rate.Limit(rps), burst)
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            if !limiter.Allow() {
                http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
                return
            }
            next.ServeHTTP(w, r)
        })
    }
}`,
    language: 'Go',
    tags: ['http', 'middleware', 'rate-limiting'],
    likes: ['u1', 'u2'],
    visibility: 'Public',
    author: { name: 'Jake Morrison', _id: 'u5' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: '6',
    title: 'CSS Grid Layout System',
    description: 'A responsive 12-column grid system using pure CSS Grid.',
    codeSnippet: `.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(16px, 2vw, 32px);
  padding: 0 clamp(16px, 4vw, 64px);
}

.col-span-6 { grid-column: span 6; }
.col-span-4 { grid-column: span 4; }
.col-span-3 { grid-column: span 3; }

@media (max-width: 768px) {
  [class*="col-span-"] { grid-column: span 12; }
}`,
    language: 'CSS',
    tags: ['css', 'grid', 'responsive'],
    likes: ['u1'],
    visibility: 'Public',
    author: { name: 'Emma Davis', _id: 'u6' },
    createdAt: new Date().toISOString(),
  },
];

export default async function HomePage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dict = await getDictionary(lang);

  // Try to fetch from DB, fallback to demo data
  let projects = DEMO_PROJECTS;
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
  } catch {
    // Use demo data if DB not connected
  }

  const trending = projects.slice(0, 3);

  return (
    <div className="space-y-10">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 p-8 md:p-12 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-32 h-32 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-4 right-4 w-48 h-48 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Open Platform · Free Forever
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
            {dict.home.heroTitle}
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-xl mb-6">
            {dict.home.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`/${lang}/upload`}
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              + {dict.home.uploadBtn}
            </a>
            <a
              href={`/${lang}/search`}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-medium px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors border border-white/30"
            >
              Explore Projects
            </a>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { label: 'Projects', value: `${projects.length * 12}+` },
          { label: 'Developers', value: '500+' },
          { label: 'Languages', value: '30+' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-blue-600">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </section>

      {/* TRENDING STRIP */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔥</span>
          <h2 className="text-lg font-bold">Trending Now</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
          {trending.map((project: any) => (
            <div key={project._id?.toString?.() || project._id} className="min-w-[280px] flex-shrink-0">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </section>

      {/* ALL PROJECTS GRID */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Latest Projects</h2>
          <a href={`/${lang}/search`} className="text-sm text-blue-600 hover:underline">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project: any) => (
            <ProjectCard
              key={project._id?.toString?.() || project._id}
              project={project}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
