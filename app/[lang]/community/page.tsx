import Link from "next/link";
import { Users, TrendingUp, Hash, ArrowRight, Plus, Globe, Flame } from "lucide-react";

const COMMUNITIES = [
  { slug: 'javascript', name: 'JavaScript', icon: '⚡', color: 'from-yellow-400 to-orange-500', members: 12400, posts: 3200, description: 'Everything JavaScript — frameworks, patterns, tips and the latest ecosystem news.', tags: ['react', 'node', 'typescript'], hot: true },
  { slug: 'python', name: 'Python', icon: '🐍', color: 'from-blue-400 to-cyan-500', members: 9800, posts: 2100, description: 'Python community for data science, web dev, automation and everything in between.', tags: ['django', 'fastapi', 'ml'], hot: true },
  { slug: 'rust', name: 'Rustaceans', icon: '🦀', color: 'from-orange-500 to-red-500', members: 4200, posts: 980, description: 'Memory safety without garbage collection. Systems programming for the future.', tags: ['systems', 'wasm', 'async'] },
  { slug: 'typescript', name: 'TypeScript', icon: '🔷', color: 'from-blue-600 to-indigo-600', members: 8100, posts: 1900, description: 'Typed JavaScript at any scale. Share patterns, decorators and generics wizardry.', tags: ['types', 'generics', 'tooling'] },
  { slug: 'go', name: 'Gophers', icon: '🔵', color: 'from-cyan-400 to-teal-500', members: 3500, posts: 750, description: 'Simple, fast, concurrent. Go language for backend systems and CLI tools.', tags: ['goroutines', 'channels', 'api'] },
  { slug: 'css', name: 'CSS Art & Design', icon: '🎨', color: 'from-pink-500 to-rose-500', members: 6200, posts: 1500, description: 'Beautiful CSS animations, layouts and design system discussions.', tags: ['animations', 'grid', 'variables'], hot: true },
  { slug: 'devops', name: 'DevOps & Cloud', icon: '☁️', color: 'from-slate-400 to-slate-600', members: 5100, posts: 1200, description: 'Docker, Kubernetes, CI/CD and cloud architecture patterns.', tags: ['docker', 'k8s', 'terraform'] },
  { slug: 'web3', name: 'Web3 & Blockchain', icon: '⛓️', color: 'from-purple-500 to-indigo-500', members: 2800, posts: 620, description: 'Smart contracts, DeFi protocols and decentralized application development.', tags: ['solidity', 'ethereum', 'defi'] },
];

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function CommunityPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Communities</h1>
          <p className="text-muted-foreground text-sm mt-1">Find your people. Join a community.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm">
          <Plus size={16} />
          Create Community
        </button>
      </section>

      {/* Featured / Hot */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Flame size={16} className="text-orange-500" />
          <h2 className="font-semibold text-base text-foreground">Hot Communities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMMUNITIES.filter(c => c.hot).slice(0, 3).map(c => (
            <Link
              key={c.slug}
              href={`./community/${c.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-card-hover transition-all p-5"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${c.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none`} />
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-xl mb-4 shadow-sm`}>
                {c.icon}
              </div>
              <div className="font-bold text-foreground mb-1">{c.name}</div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{c.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users size={12} />
                  <span>{fmt(c.members)} members</span>
                </div>
                <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Communities */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} className="text-muted-foreground" />
          <h2 className="font-semibold text-base text-foreground">All Communities</h2>
        </div>
        <div className="space-y-2">
          {COMMUNITIES.map((c, i) => (
            <Link
              key={c.slug}
              href={`./community/${c.slug}`}
              className="group flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/20 hover:bg-muted/30 transition-all"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-lg shrink-0 shadow-sm`}>
                {c.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-foreground">{c.name}</span>
                  {c.hot && <span className="text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-semibold">HOT</span>}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{c.description}</p>
              </div>

              <div className="hidden sm:flex flex-col items-end shrink-0 gap-0.5">
                <span className="text-sm font-semibold text-foreground">{fmt(c.members)}</span>
                <span className="text-xs text-muted-foreground">members</span>
              </div>

              <div className="hidden md:flex flex-col items-end shrink-0 gap-0.5">
                <span className="text-sm font-semibold text-foreground">{fmt(c.posts)}</span>
                <span className="text-xs text-muted-foreground">posts</span>
              </div>

              <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-primary/40 text-primary rounded-lg text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-all shrink-0">
                Join
              </button>

              <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 sm:hidden" />
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
