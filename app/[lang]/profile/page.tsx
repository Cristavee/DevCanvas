import { Code2, Heart, Star, Users, MessageSquare, Settings, GitBranch, Calendar, MapPin, Link as LinkIcon, Edit3 } from "lucide-react";
import Link from "next/link";

const DEMO_STATS = [
  { label: 'Snippets', value: '24' },
  { label: 'Likes received', value: '486' },
  { label: 'Followers', value: '128' },
  { label: 'Following', value: '64' },
];

const DEMO_SNIPPETS = [
  { id: '1', title: 'Animated Gradient Button', language: 'TypeScript', likes: 24, tags: ['css', 'animation'], color: 'from-blue-500 to-cyan-500' },
  { id: '2', title: 'Custom React Hooks Collection', language: 'TypeScript', likes: 67, tags: ['react', 'hooks'], color: 'from-purple-500 to-pink-500' },
  { id: '3', title: 'FastAPI Middleware Stack', language: 'Python', likes: 31, tags: ['fastapi', 'auth'], color: 'from-green-500 to-emerald-500' },
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: 'from-blue-500 to-blue-600',
  Python: 'from-emerald-500 to-teal-600',
  JavaScript: 'from-yellow-400 to-orange-500',
  Rust: 'from-orange-500 to-red-500',
};

export default async function ProfilePage({ params: { lang } }: { params: { lang: string } }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Profile Header */}
      <section className="bg-card border border-border rounded-3xl overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-primary via-primary/80 to-accent relative">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }} />
          <Link href={`/${lang}/settings`} className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/30 rounded-lg transition-colors">
            <Edit3 size={14} className="text-white" />
          </Link>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold border-4 border-card shadow-md">
              U
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Your Name</h1>
              <p className="text-muted-foreground text-sm">@username</p>
              <p className="text-sm text-foreground/80 mt-2 max-w-md">
                Full-stack developer passionate about clean code, open source, and elegant solutions. Building the future one commit at a time. 🚀
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><MapPin size={12} /> San Francisco, CA</div>
                <div className="flex items-center gap-1"><LinkIcon size={12} /> <a href="#" className="text-primary hover:underline">github.com/user</a></div>
                <div className="flex items-center gap-1"><Calendar size={12} /> Joined January 2025</div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
                Edit Profile
              </button>
              <Link href={`/${lang}/settings`} className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Settings size={16} />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-border">
            {DEMO_STATS.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-full">
        {['Snippets', 'Liked', 'Following', 'Communities'].map((t, i) => (
          <button key={t} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${i === 0 ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Snippets Grid */}
      <div className="space-y-3">
        {DEMO_SNIPPETS.map(s => (
          <div key={s.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${LANG_COLORS[s.language] ?? 'from-primary to-accent'} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {s.language.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-foreground">{s.title}</div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {s.tags.map(t => (
                  <span key={t} className="text-xs text-primary bg-primary/8 px-2 py-0.5 rounded-full">#{t}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Heart size={14} />
              <span className="text-xs font-semibold">{s.likes}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
