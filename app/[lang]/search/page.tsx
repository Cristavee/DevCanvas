"use client";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, Code2 } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";

const ALL_PROJECTS = [
  { _id: '1', title: 'Animated Gradient Button', description: 'A beautiful CSS animated gradient button component with smooth hover states.', codeSnippet: `const Button = styled.button\`
  background: linear-gradient(90deg, #667eea, #764ba2);
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
\`;`, language: 'TypeScript', tags: ['css', 'animation', 'button'], likes: Array(42).fill('u'), author: { name: 'Sarah Chen' }, comments: 12 },
  { _id: '2', title: 'FastAPI Auth Middleware', description: 'JWT authentication middleware for FastAPI with role-based access control.', codeSnippet: `async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get('sub')
    except JWTError:
        raise credentials_exception`, language: 'Python', tags: ['fastapi', 'jwt', 'auth'], likes: Array(28).fill('u'), author: { name: 'Alex Rivera' }, comments: 8 },
  { _id: '3', title: 'Rust Concurrent Processor', description: 'Concurrent file processing using Rust tokio runtime with graceful error handling.', codeSnippet: `async fn process_files(paths: Vec<PathBuf>) -> Vec<Result<String>> {
    let tasks: Vec<_> = paths.into_iter()
        .map(|p| tokio::spawn(async move {
            let content = fs::read_to_string(&p).await?;
            Ok(process_content(content))
        }))
        .collect();
    join_all(tasks).await
}`, language: 'Rust', tags: ['async', 'tokio', 'concurrency'], likes: Array(19).fill('u'), author: { name: 'Marcus Wei' }, comments: 5 },
  { _id: '4', title: 'React useDebounce Hook', description: 'Clean debounce hook with TypeScript generics and cleanup.', codeSnippet: `function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}`, language: 'TypeScript', tags: ['react', 'hooks', 'performance'], likes: Array(67).fill('u'), author: { name: 'Priya Sharma' }, comments: 21 },
  { _id: '5', title: 'Go HTTP Rate Limiter', description: 'Token bucket rate limiter for Go HTTP servers.', codeSnippet: `func RateLimiter(rps float64, burst int) func(http.Handler) http.Handler {
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
}`, language: 'Go', tags: ['http', 'middleware', 'rate-limiting'], likes: Array(34).fill('u'), author: { name: 'Jake Morrison' }, comments: 7 },
  { _id: '6', title: 'CSS Grid Layout System', description: 'Responsive 12-column grid with fluid breakpoints.', codeSnippet: `.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(16px, 2vw, 32px);
}
@media (max-width: 768px) {
  [class*="col-span-"] { grid-column: span 12; }
}`, language: 'CSS', tags: ['css', 'grid', 'responsive'], likes: Array(15).fill('u'), author: { name: 'Emma Davis' }, comments: 14 },
  { _id: '7', title: 'Zustand Store Pattern', description: 'Type-safe Zustand store with immer and persistence middleware.', codeSnippet: `const useStore = create(
  persist(
    immer<Store>((set) => ({
      count: 0,
      increment: () => set(state => { state.count++ }),
    })),
    { name: 'my-store' }
  )
);`, language: 'TypeScript', tags: ['zustand', 'state', 'react'], likes: Array(88).fill('u'), author: { name: 'Sarah Chen' }, comments: 33 },
  { _id: '8', title: 'Python Async Context Manager', description: 'Clean async resource management with __aenter__ and __aexit__.', codeSnippet: `class AsyncDB:
    async def __aenter__(self):
        self.conn = await connect(DATABASE_URL)
        return self
    
    async def __aexit__(self, *exc_info):
        await self.conn.close()

async with AsyncDB() as db:
    result = await db.execute(query)`, language: 'Python', tags: ['async', 'context', 'database'], likes: Array(22).fill('u'), author: { name: 'Marcus Wei' }, comments: 9 },
];

const LANGUAGES = ['All', 'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'CSS', 'HTML'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeLang, setActiveLang] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = ALL_PROJECTS;
    if (activeLang !== 'All') result = result.filter(p => p.language === activeLang);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.language.toLowerCase().includes(q)
      );
    }
    return result;
  }, [query, activeLang]);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Explore</h1>
        <p className="text-muted-foreground text-sm">Search through {ALL_PROJECTS.length} code snippets</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, language, tag..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-primary/30 focus:border-primary/40 transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted transition-colors">
              <X size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(s => !s)}
          className={`p-3 rounded-2xl border transition-all ${showFilters ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'}`}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Language filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {LANGUAGES.map(lang => (
          <button
            key={lang}
            onClick={() => setActiveLang(lang)}
            className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeLang === lang
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            {activeLang !== 'All' && ` in ${activeLang}`}
            {query && ` for "${query}"`}
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(p => (
              <ProjectCard key={p._id} project={p as any} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-4">
              <Code2 size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No results found</h3>
            <p className="text-sm text-muted-foreground">Try a different search term or language</p>
            <button
              onClick={() => { setQuery(''); setActiveLang('All'); }}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
