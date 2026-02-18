import { getDictionary } from '@/lib/get-dictionary';
import { ProjectCard } from '@/components/ProjectCard';

const DEMO_PROJECTS = [
  {
    _id: '1',
    title: 'Animated Gradient Button',
    description: 'A beautiful CSS animated gradient button component.',
    codeSnippet: "const Button = styled.button`\n  background: linear-gradient(90deg, #667eea, #764ba2);\n  background-size: 200% 200%;\n  animation: gradientShift 3s ease infinite;\n  color: white;\n  padding: 12px 24px;\n  border-radius: 8px;\n  border: none;\n  cursor: pointer;\n`;",
    language: 'TypeScript',
    tags: ['css', 'animation', 'button'],
    likes: ['u1', 'u2', 'u3'],
    author: { name: 'Sarah Chen', _id: 'u1' },
  },
  {
    _id: '2',
    title: 'FastAPI Auth Middleware',
    description: 'JWT authentication middleware for FastAPI applications.',
    codeSnippet: "from fastapi import Depends, HTTPException\nfrom jose import JWTError, jwt\n\nasync def get_current_user(token: str = Depends(oauth2_scheme)):\n    try:\n        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n        username = payload.get('sub')\n        if username is None:\n            raise credentials_exception\n        return username\n    except JWTError:\n        raise credentials_exception",
    language: 'Python',
    tags: ['fastapi', 'jwt', 'auth'],
    likes: ['u1', 'u2'],
    author: { name: 'Alex Rivera', _id: 'u2' },
  },
  {
    _id: '3',
    title: 'Rust Concurrent File Processor',
    description: "Process thousands of files concurrently using Rust's async runtime.",
    codeSnippet: "use tokio::fs;\nuse futures::future::join_all;\n\nasync fn process_files(paths: Vec<PathBuf>) -> Vec<Result<String>> {\n    let tasks: Vec<_> = paths.into_iter()\n        .map(|p| tokio::spawn(async move {\n            let content = fs::read_to_string(&p).await?;\n            Ok(process_content(content))\n        }))\n        .collect();\n    join_all(tasks).await\n}",
    language: 'Rust',
    tags: ['async', 'concurrency', 'filesystem'],
    likes: ['u1'],
    author: { name: 'Marcus Wei', _id: 'u3' },
  },
  {
    _id: '4',
    title: 'React Custom Hook: useDebounce',
    description: 'A clean debounce hook for React with TypeScript support.',
    codeSnippet: "function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const handler = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n\n  return debouncedValue;\n}",
    language: 'TypeScript',
    tags: ['react', 'hooks', 'performance'],
    likes: ['u1', 'u2', 'u3', 'u4'],
    author: { name: 'Priya Sharma', _id: 'u4' },
  },
  {
    _id: '5',
    title: 'Go HTTP Rate Limiter',
    description: 'Token bucket rate limiter middleware for Go HTTP servers.',
    codeSnippet: 'func RateLimiter(rps float64, burst int) func(http.Handler) http.Handler {\n    limiter := rate.NewLimiter(rate.Limit(rps), burst)\n    return func(next http.Handler) http.Handler {\n        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n            if !limiter.Allow() {\n                http.Error(w, "Too Many Requests", http.StatusTooManyRequests)\n                return\n            }\n            next.ServeHTTP(w, r)\n        })\n    }\n}',
    language: 'Go',
    tags: ['http', 'middleware', 'rate-limiting'],
    likes: ['u1', 'u2'],
    author: { name: 'Jake Morrison', _id: 'u5' },
  },
  {
    _id: '6',
    title: 'CSS Grid Layout System',
    description: 'A responsive 12-column grid system using pure CSS Grid.',
    codeSnippet: ".grid {\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n  gap: clamp(16px, 2vw, 32px);\n  padding: 0 clamp(16px, 4vw, 64px);\n}\n\n.col-span-6 { grid-column: span 6; }\n.col-span-4 { grid-column: span 4; }\n.col-span-3 { grid-column: span 3; }\n\n@media (max-width: 768px) {\n  [class*=\"col-span-\"] { grid-column: span 12; }\n}",
    language: 'CSS',
    tags: ['css', 'grid', 'responsive'],
    likes: ['u1'],
    author: { name: 'Emma Davis', _id: 'u6' },
  },
];

export default async function HomePage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dict = await getDictionary(lang);

  let projects: typeof DEMO_PROJECTS = DEMO_PROJECTS;
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
        <div className="absolute inset-0 opacity-10 pointer-events-none">
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

      {/* STATS */}
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

      {/* TRENDING */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔥</span>
          <h2 className="text-lg font-bold">Trending Now</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
          {trending.map((project) => (
            <div key={project._id} className="min-w-[280px] flex-shrink-0">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </section>

      {/* ALL PROJECTS */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Latest Projects</h2>
          <a href={`/${lang}/search`} className="text-sm text-blue-600 hover:underline">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </section>

    </div>
  );
}
