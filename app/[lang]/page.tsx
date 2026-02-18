"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Code2, Zap, ArrowRight, Star, MessageSquare, Bookmark, Heart, TrendingUp, Flame, Clock, Users, Terminal } from "lucide-react";

type Project = {
  _id: string;
  title: string;
  description: string;
  codeSnippet: string;
  language: string;
  tags: string[];
  likes: string[];
  views: number;
  author: { name: string; avatar?: string; xp: number; tier: string };
  createdAt: string;
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178C6", JavaScript: "#F7DF1E", Python: "#3776AB",
  Rust: "#CE4A07", Go: "#00ACD7", CSS: "#2965F1", HTML: "#E34C26",
  Java: "#E76F00", "C++": "#659AD2", Swift: "#FA7343", Kotlin: "#7F52FF",
};
const LANG_EXT: Record<string, string> = {
  TypeScript: "ts", JavaScript: "js", Python: "py", Rust: "rs",
  Go: "go", CSS: "css", HTML: "html", Java: "java",
};

function SnippetCard({ project, lang }: { project: Project; lang: string }) {
  const lines = project.codeSnippet.split("\n").slice(0, 8);
  const ext   = LANG_EXT[project.language] ?? "txt";
  const color = LANG_COLORS[project.language] ?? "#64748B";

  return (
    <Link href={`/${lang}/projects/${project._id}`}
      className="block rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
      {/* Code preview */}
      <div className="code-window rounded-none border-0 border-b" style={{ borderColor: "#30363d" }}>
        <div className="code-titlebar">
          <div className="flex gap-1.5 shrink-0">
            <span className="traffic-light tl-red" />
            <span className="traffic-light tl-yellow" />
            <span className="traffic-light tl-green" />
          </div>
          <span className="flex-1 text-center text-[11px] font-mono truncate" style={{ color: "#6e7681" }}>
            snippet.{ext}
          </span>
          <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: color + "20", color }}>
            {project.language}
          </span>
        </div>
        <div className="px-4 py-3 overflow-hidden" style={{ maxHeight: 160 }}>
          {lines.map((line, i) => (
            <div key={i} className="flex gap-3 text-[11px] font-mono leading-5">
              <span className="select-none shrink-0 w-4 text-right" style={{ color: "#484f58" }}>{i + 1}</span>
              <span className="truncate" style={{ color: "#e6edf3" }}>{line || " "}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm truncate mb-1">{project.title}</h3>
        {project.description && (
          <p className="text-xs line-clamp-2 mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
            {project.description}
          </p>
        )}
        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-3">
            {project.tags.slice(0, 3).map(t => (
              <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded-full border"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                #{t}
              </span>
            ))}
          </div>
        )}
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {project.author.avatar ? (
              <img src={project.author.avatar} className="w-5 h-5 rounded-full shrink-0" alt="" />
            ) : (
              <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold text-black"
                style={{ background: "linear-gradient(135deg, var(--neon), var(--blue))" }}>
                {project.author.name[0]}
              </div>
            )}
            <span className="text-[11px] truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
              {project.author.name}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 text-[11px] font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
              <Star size={11} />{project.likes.length}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
              <Zap size={11} />{project.views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
      <div className="skeleton h-40 rounded-none" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}

const SORT_TABS = [
  { key: "new", icon: Clock, label: "Latest" },
  { key: "hot", icon: Flame, label: "Hot" },
  { key: "top", icon: Star, label: "Top" },
];

export default function HomePage() {
  const params = useParams();
  const lang   = (params?.lang as string) || "en";
  const { data: session } = useSession();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [sort, setSort]         = useState("new");
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(false);
  const [total, setTotal]       = useState(0);

  useEffect(() => {
    setLoading(true);
    setProjects([]);
    fetch(`/api/projects?sort=${sort}&page=1&limit=12`)
      .then(r => r.json())
      .then(d => {
        setProjects(d.projects || []);
        setTotal(d.pagination?.total || 0);
        setHasMore((d.pagination?.pages || 1) > 1);
        setPage(1);
      })
      .finally(() => setLoading(false));
  }, [sort]);

  const loadMore = () => {
    const next = page + 1;
    fetch(`/api/projects?sort=${sort}&page=${next}&limit=12`)
      .then(r => r.json())
      .then(d => {
        setProjects(prev => [...prev, ...(d.projects || [])]);
        setPage(next);
        setHasMore(next < (d.pagination?.pages || 1));
      });
  };

  return (
    <div className="space-y-6">
      {/* Hero — only show on first load / homepage */}
      {!loading && projects.length === 0 && (
        <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 border" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
          <div className="dot-pattern absolute inset-0 opacity-30" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-4"
              style={{ borderColor: "var(--neon)", color: "var(--neon)", background: "var(--neon-dim)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-neon" style={{ background: "var(--neon)" }} />
              v3.0 · Developer OS · Live
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
              Your developer<br />
              <span className="font-mono" style={{ color: "var(--neon)" }}>operating system</span>
            </h1>
            <p className="text-sm sm:text-base mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              Ship code. Build communities. Run experiments.
            </p>
            <div className="flex gap-3 flex-wrap">
              {session ? (
                <Link href={`/${lang}/upload`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black"
                  style={{ background: "var(--neon)" }}>
                  <Code2 size={15} />New Snippet
                </Link>
              ) : (
                <Link href={`/${lang}/auth/signin?tab=signup`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black"
                  style={{ background: "var(--neon)" }}>
                  Join Free <ArrowRight size={14} />
                </Link>
              )}
              <Link href={`/${lang}/runner`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                <Terminal size={14} />Code Runner
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Sort tabs */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white text-base">Feed</h2>
        <div className="flex items-center gap-1 p-1 rounded-xl border" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}>
          {SORT_TABS.map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setSort(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={sort === key
                ? { background: "var(--neon-dim)", color: "var(--neon)" }
                : { color: "hsl(var(--muted-foreground))" }}>
              <Icon size={12} />{label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : projects.map(p => <SnippetCard key={p._id} project={p} lang={lang} />)
        }
      </div>

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border"
            style={{ borderColor: "var(--neon)", background: "var(--neon-dim)" }}>
            <Code2 size={24} style={{ color: "var(--neon)" }} />
          </div>
          <h3 className="font-semibold text-white mb-1">No snippets yet</h3>
          <p className="text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
            Be the first to share code with the community.
          </p>
          <Link href={`/${lang}/upload`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black"
            style={{ background: "var(--neon)" }}>
            <Code2 size={15} />Share a Snippet
          </Link>
        </div>
      )}

      {/* Load more */}
      {hasMore && !loading && (
        <div className="text-center pt-2">
          <button onClick={loadMore}
            className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
            Load more · {total} total
          </button>
        </div>
      )}
    </div>
  );
}
