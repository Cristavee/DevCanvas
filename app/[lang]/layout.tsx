import "../globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Home, Compass, Plus, MessageSquare, Users, Bell, Settings,
  Code2, TrendingUp, Bookmark, User, Hash, Zap, Trophy,
  BarChart2, Terminal, Search, Shield
} from "lucide-react";

const NAV_MAIN = [
  { icon: Home, label: "Home", href: "" },
  { icon: Compass, label: "Explore", href: "/search" },
  { icon: TrendingUp, label: "Trending", href: "/trending" },
  { icon: MessageSquare, label: "Chat", href: "/chat", badge: 3 },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Bookmark, label: "Saved", href: "/saved" },
];

const NAV_TOOLS = [
  { icon: Terminal, label: "Code Runner", href: "/runner" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
];

const COMMUNITIES = [
  { name: "JavaScript", slug: "javascript", icon: "⚡", accent: "#F7DF1E" },
  { name: "Python", slug: "python", icon: "🐍", accent: "#3776AB" },
  { name: "Rust", slug: "rust", icon: "🦀", accent: "#CE4A07" },
  { name: "TypeScript", slug: "typescript", icon: "🔷", accent: "#3178C6" },
  { name: "Go", slug: "go", icon: "🔵", accent: "#00ACD7" },
];

export default function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  const base = `/${params.lang}`;

  return (
    <html lang={params.lang} className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0a0f1e" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <div className="min-h-screen flex">

          {/* ═══ LEFT SIDEBAR ═══ */}
          <aside className="hidden lg:flex flex-col w-60 xl:w-64 border-r border-sidebar-border bg-[hsl(var(--sidebar-bg))] shrink-0 fixed left-0 top-0 h-screen z-40">
            
            {/* Logo */}
            <div className="px-4 py-4 border-b border-sidebar-border">
              <Link href={base} className="flex items-center gap-3 group">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <div className="absolute inset-0 rounded-lg bg-[var(--neon-green)] opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
                  <div className="relative w-8 h-8 rounded-lg bg-[var(--sidebar-bg)] border border-[var(--neon-green)]/40 flex items-center justify-center">
                    <Code2 className="w-4 h-4" style={{ color: 'var(--neon-green)' }} />
                  </div>
                </div>
                <div>
                  <span className="font-bold text-base tracking-tight text-foreground">DevCanvas</span>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--neon-green)' }}>v3.0.0</div>
                </div>
              </Link>
            </div>

            {/* ⌘K hint */}
            <div className="px-4 pt-3">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/50 text-muted-foreground text-xs hover:border-[var(--neon-green)]/30 transition-colors group">
                <Search size={12} />
                <span className="flex-1 text-left">Search or jump...</span>
                <kbd className="text-[10px] font-mono bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
              </button>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 py-1.5">Navigation</div>
              {NAV_MAIN.map(({ icon: Icon, label, href, badge }: any) => (
                <Link
                  key={label}
                  href={`${base}${href}`}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[var(--neon-green-dim)] transition-all text-sm font-medium group relative"
                >
                  <Icon size={15} className="flex-shrink-0 group-hover:text-[color:var(--neon-green)] transition-colors" />
                  <span className="flex-1 text-sm">{label}</span>
                  {badge && (
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full leading-none"
                      style={{ background: 'var(--neon-green)', color: 'hsl(var(--background))' }}>
                      {badge}
                    </span>
                  )}
                </Link>
              ))}

              <Link
                href={`${base}/upload`}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-semibold mt-2 transition-all hover:opacity-90 font-mono"
                style={{ background: 'var(--neon-green)', color: 'hsl(var(--background))' }}
              >
                <Plus size={15} />
                <span>New Snippet</span>
                <span className="ml-auto text-[10px] opacity-70">⌘N</span>
              </Link>

              {/* Tools */}
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 py-1.5 pt-4">Dev Tools</div>
              {NAV_TOOLS.map(({ icon: Icon, label, href }: any) => (
                <Link
                  key={label}
                  href={`${base}${href}`}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[var(--electric-blue-dim)] transition-all text-sm font-medium group"
                >
                  <Icon size={15} className="flex-shrink-0 group-hover:text-[color:var(--electric-blue)] transition-colors" />
                  <span className="text-sm">{label}</span>
                </Link>
              ))}

              {/* Communities */}
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 py-1.5 pt-4 flex items-center justify-between">
                <span>Communities</span>
                <Link href={`${base}/community`} className="text-[10px] font-mono hover:text-[color:var(--neon-green)] transition-colors">all →</Link>
              </div>
              {COMMUNITIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`${base}/community/${c.slug}`}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all text-sm group"
                >
                  <div className="w-5 h-5 rounded flex items-center justify-center text-xs">{c.icon}</div>
                  <span className="flex-1 text-sm">{c.name}</span>
                  <Hash size={11} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                </Link>
              ))}
            </nav>

            {/* Bottom user area */}
            <div className="px-3 py-3 border-t border-sidebar-border space-y-0.5">
              <Link href={`${base}/admin`} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all text-sm">
                <Shield size={14} />
                <span>Admin Panel</span>
              </Link>
              <Link href={`${base}/settings`} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all text-sm">
                <Settings size={14} />
                <span>Settings</span>
              </Link>
              <Link href={`${base}/profile`} className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-muted/50 transition-all group mt-1">
                <div className="relative w-7 h-7 rounded-full flex-shrink-0 overflow-hidden">
                  <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, var(--neon-green), var(--electric-blue))' }} />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">U</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">Your Profile</div>
                  <div className="text-[10px] text-muted-foreground font-mono">2,840 XP · Rank #12</div>
                </div>
                <Zap size={12} style={{ color: 'var(--neon-green)' }} />
              </Link>
            </div>
          </aside>

          {/* ═══ MAIN AREA ═══ */}
          <div className="flex-1 lg:pl-60 xl:pl-64 min-h-screen flex flex-col">
            
            {/* Mobile header */}
            <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border glass sticky top-0 z-30">
              <Link href={base} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg border flex items-center justify-center" style={{ borderColor: 'var(--neon-green)', background: 'var(--neon-green-dim)' }}>
                  <Code2 className="w-4 h-4" style={{ color: 'var(--neon-green)' }} />
                </div>
                <span className="font-bold tracking-tight text-foreground">DevCanvas</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--neon-green)' }}>v3</span>
              </Link>
              <div className="flex items-center gap-1.5">
                <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                  <Bell size={17} className="text-muted-foreground" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--neon-green)' }} />
                </button>
                <Link href={`${base}/profile`} className="relative w-7 h-7 rounded-full overflow-hidden">
                  <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, var(--neon-green), var(--electric-blue))' }} />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">U</span>
                </Link>
              </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 lg:px-8 py-6 pb-24 lg:pb-8">
              {children}
            </main>
          </div>

          {/* ═══ MOBILE BOTTOM NAV ═══ */}
          <nav className="fixed bottom-0 left-0 right-0 border-t border-border glass z-50 lg:hidden">
            <div className="grid grid-cols-5 h-16">
              {[
                { icon: Home, label: "Home", href: "" },
                { icon: Compass, label: "Explore", href: "/search" },
                { icon: Plus, label: "New", href: "/upload", special: true },
                { icon: MessageSquare, label: "Chat", href: "/chat" },
                { icon: User, label: "Me", href: "/profile" },
              ].map(({ icon: Icon, label, href, special }: any) => (
                <Link
                  key={label}
                  href={`${base}${href}`}
                  className={`flex flex-col items-center justify-center gap-0.5 transition-all ${special ? "relative" : "text-muted-foreground"}`}
                >
                  {special ? (
                    <div className="absolute -top-5 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg text-black font-bold"
                      style={{ background: 'linear-gradient(135deg, var(--neon-green), var(--electric-blue))' }}>
                      <Plus size={20} />
                    </div>
                  ) : (
                    <>
                      <Icon size={17} />
                      <span className="text-[10px] font-medium">{label}</span>
                    </>
                  )}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
