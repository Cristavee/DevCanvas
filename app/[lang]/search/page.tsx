import { Suspense } from "react";
import { getDictionary } from "@/lib/get-dictionary";
import { ProjectCard } from "@/components/ProjectCard";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterDrawer } from "@/components/search/FilterDrawer";

const ALL_DEMO_PROJECTS = [
  {
    _id: "1",
    title: "Animated Gradient Button",
    description: "A beautiful CSS animated gradient button component.",
    codeSnippet: "const Button = styled.button`\n  background: linear-gradient(90deg, #667eea, #764ba2);\n  animation: gradientShift 3s ease infinite;\n  color: white;\n  padding: 12px 24px;\n`;",
    language: "TypeScript",
    tags: ["css", "animation", "button"],
    likes: ["u1", "u2", "u3"],
    author: { name: "Sarah Chen" },
  },
  {
    _id: "2",
    title: "FastAPI Auth Middleware",
    description: "JWT authentication middleware for FastAPI applications.",
    codeSnippet: "async def get_current_user(token: str = Depends(oauth2_scheme)):\n    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n    username = payload.get('sub')\n    if username is None:\n        raise credentials_exception\n    return username",
    language: "Python",
    tags: ["fastapi", "jwt", "auth"],
    likes: ["u1", "u2"],
    author: { name: "Alex Rivera" },
  },
  {
    _id: "3",
    title: "Rust Concurrent File Processor",
    description: "Process thousands of files concurrently using Rust's async runtime.",
    codeSnippet: "async fn process_files(paths: Vec<PathBuf>) -> Vec<Result<String>> {\n    let tasks: Vec<_> = paths.into_iter()\n        .map(|p| tokio::spawn(async move {\n            let content = fs::read_to_string(&p).await?;\n            Ok(process_content(content))\n        })).collect();\n    join_all(tasks).await\n}",
    language: "Rust",
    tags: ["async", "concurrency", "filesystem"],
    likes: ["u1"],
    author: { name: "Marcus Wei" },
  },
  {
    _id: "4",
    title: "React useDebounce Hook",
    description: "A clean debounce hook for React with TypeScript support.",
    codeSnippet: "function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n  return debouncedValue;\n}",
    language: "TypeScript",
    tags: ["react", "hooks", "performance"],
    likes: ["u1", "u2", "u3", "u4"],
    author: { name: "Priya Sharma" },
  },
  {
    _id: "5",
    title: "Go HTTP Rate Limiter",
    description: "Token bucket rate limiter middleware for Go HTTP servers.",
    codeSnippet: "func RateLimiter(rps float64, burst int) func(http.Handler) http.Handler {\n    limiter := rate.NewLimiter(rate.Limit(rps), burst)\n    return func(next http.Handler) http.Handler {\n        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n            if !limiter.Allow() {\n                http.Error(w, \"Too Many Requests\", 429)\n                return\n            }\n            next.ServeHTTP(w, r)\n        })\n    }\n}",
    language: "Go",
    tags: ["http", "middleware", "rate-limiting"],
    likes: ["u1", "u2"],
    author: { name: "Jake Morrison" },
  },
  {
    _id: "6",
    title: "CSS Responsive Grid System",
    description: "A 12-column grid system using pure CSS Grid with clamp.",
    codeSnippet: ".grid {\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n  gap: clamp(16px, 2vw, 32px);\n  padding: 0 clamp(16px, 4vw, 64px);\n}\n@media (max-width: 768px) {\n  [class*=\"col-span-\"] { grid-column: span 12; }\n}",
    language: "CSS",
    tags: ["css", "grid", "responsive"],
    likes: ["u1"],
    author: { name: "Emma Davis" },
  },
  {
    _id: "7",
    title: "Python Async Web Scraper",
    description: "Concurrent web scraping with aiohttp and BeautifulSoup.",
    codeSnippet: "async def scrape_all(urls: list[str]) -> list[dict]:\n    async with aiohttp.ClientSession() as session:\n        tasks = [scrape_url(session, url) for url in urls]\n        return await asyncio.gather(*tasks)",
    language: "Python",
    tags: ["scraping", "async", "aiohttp"],
    likes: ["u1", "u2", "u3"],
    author: { name: "Lucia Park" },
  },
  {
    _id: "8",
    title: "TypeScript Generic Repository",
    description: "Type-safe repository pattern for any entity.",
    codeSnippet: "class Repository<T extends { id: string }> {\n  private items: Map<string, T> = new Map();\n\n  async findById(id: string): Promise<T | undefined> {\n    return this.items.get(id);\n  }\n\n  async save(entity: T): Promise<T> {\n    this.items.set(entity.id, entity);\n    return entity;\n  }\n}",
    language: "TypeScript",
    tags: ["patterns", "generics", "clean-code"],
    likes: ["u1", "u2"],
    author: { name: "Ben Carter" },
  },
];

const POPULAR_LANGS = ["TypeScript", "Python", "Rust", "Go", "CSS", "JavaScript"];

export default async function SearchPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: string };
  searchParams: { q?: string; langTag?: string; sort?: string };
}) {
  const dict = await getDictionary(lang);

  let results = ALL_DEMO_PROJECTS;

  try {
    const { default: dbConnect } = await import("@/lib/mongodb");
    const { default: Project } = await import("@/models/Project");
    await dbConnect();
    const query: Record<string, unknown> = { visibility: "Public" };
    if (searchParams.q) query.title = { $regex: searchParams.q, $options: "i" };
    if (searchParams.langTag) query.language = searchParams.langTag;
    const dbResults = await Project.find(query)
      .populate("author", "name")
      .sort(searchParams.sort === "liked" ? { likes: -1 } : { createdAt: -1 })
      .limit(24)
      .lean();
    if (dbResults.length > 0) {
      results = JSON.parse(JSON.stringify(dbResults));
    }
  } catch {
    if (searchParams.q) {
      const q = searchParams.q.toLowerCase();
      results = ALL_DEMO_PROJECTS.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.language.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (searchParams.langTag) {
      const tag = searchParams.langTag.toLowerCase();
      results = results.filter((p) => p.language.toLowerCase() === tag);
    }
    if (searchParams.sort === "liked") {
      results = [...results].sort((a, b) => b.likes.length - a.likes.length);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Explore Projects</h1>
        <p className="text-slate-500 text-sm">Discover code snippets from the DevCanvas community</p>
      </div>

      {/* SearchBar and FilterDrawer need Suspense because they use useSearchParams */}
      <div className="flex gap-3 mb-4">
        <Suspense fallback={<div className="flex-1 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />}>
          <SearchBar placeholder={dict.search.placeholder} />
        </Suspense>
        <Suspense fallback={<div className="h-11 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />}>
          <FilterDrawer dict={dict} />
        </Suspense>
      </div>

      {/* Quick filter pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        <a
          href={`/${lang}/search`}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            !searchParams.langTag
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400"
          }`}
        >
          All
        </a>
        {POPULAR_LANGS.map((l) => (
          <a
            key={l}
            href={`/${lang}/search?langTag=${l}${searchParams.q ? `&q=${searchParams.q}` : ""}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              searchParams.langTag === l
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400"
            }`}
          >
            {l}
          </a>
        ))}
      </div>

      {searchParams.q && (
        <p className="mb-4 text-slate-500 text-sm">
          {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">&ldquo;{searchParams.q}&rdquo;</span>
        </p>
      )}

      {results.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300">No results found</h3>
          <p className="text-slate-500 text-sm mt-1">Try different keywords or clear the filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((project: any) => (
            <ProjectCard key={String(project._id)} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
