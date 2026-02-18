import { getDictionary } from "@/lib/get-dictionary";
import { ProjectCard } from "@/components/ProjectCard";

const FOLLOWING_PROJECTS = [
  {
    _id: "f1",
    title: "React useDebounce Hook",
    description: "A clean debounce hook for React with TypeScript support.",
    codeSnippet: `function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}`,
    language: "TypeScript",
    tags: ["react", "hooks"],
    likes: ["u1", "u2", "u3", "u4"],
    visibility: "Public",
    author: { name: "Priya Sharma" },
  },
];

const SUGGESTED_DEVS = [
  { name: "Sarah Chen", role: "Frontend Engineer", projects: 12, avatar: "S" },
  { name: "Marcus Wei", role: "Systems Engineer", projects: 8, avatar: "M" },
  { name: "Emma Davis", role: "UI Developer", projects: 15, avatar: "E" },
];

export default async function FollowingPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang);
  return (
    <div className="max-w-7xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Following</h1>
        <p className="text-slate-500 text-sm mt-1">Latest from developers you follow.</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Recent Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FOLLOWING_PROJECTS.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
        <div className="lg:w-72">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Suggested Developers</h2>
          <div className="space-y-3">
            {SUGGESTED_DEVS.map((dev) => (
              <div key={dev.name} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {dev.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 dark:text-white truncate">{dev.name}</div>
                  <div className="text-xs text-slate-500">{dev.role} - {dev.projects} projects</div>
                </div>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Trending Languages</h3>
            <div className="flex flex-wrap gap-1.5">
              {["TypeScript", "Python", "Rust", "Go", "CSS"].map((l) => (
                <a key={l} href={"/" + lang + "/search?langTag=" + l} className="text-xs px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
