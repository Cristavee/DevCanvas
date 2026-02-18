import "../globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import { Home, Compass, Plus, MessageSquare, Users, Bell, Settings, Code2, TrendingUp, Bookmark, User, ChevronRight, Hash } from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "" },
  { icon: Compass, label: "Explore", href: "/search" },
  { icon: TrendingUp, label: "Trending", href: "/trending" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: MessageSquare, label: "Messages", href: "/chat", badge: 3 },
  { icon: Bookmark, label: "Saved", href: "/saved" },
];

const COMMUNITIES = [
  { name: "JavaScript", icon: "⚡", color: "from-yellow-400 to-orange-500" },
  { name: "Python", icon: "🐍", color: "from-blue-500 to-cyan-500" },
  { name: "Rust", icon: "🦀", color: "from-orange-500 to-red-600" },
  { name: "TypeScript", icon: "🔷", color: "from-blue-600 to-indigo-600" },
  { name: "Go", icon: "🔵", color: "from-cyan-500 to-teal-600" },
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
    <html lang={params.lang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        <div className="min-h-screen flex">

          {/* LEFT SIDEBAR desktop */}
          <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-border bg-sidebar shrink-0 fixed left-0 top-0 h-screen z-40">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-sidebar-border">
              <Link href={base} className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg tracking-tight text-foreground">DevCanvas</span>
                  <div className="text-xs text-muted-foreground font-medium leading-none mt-0.5">Code Community</div>
                </div>
              </Link>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map(({ icon: Icon, label, href, badge }: any) => (
                <Link
                  key={label}
                  href={`${base}${href}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-sm font-medium group"
                >
                  <Icon className="shrink-0" size={18} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 font-semibold leading-none">
                      {badge}
                    </span>
                  )}
                </Link>
              ))}

              <Link
                href={`${base}/upload`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity mt-3"
              >
                <Plus size={18} />
                <span>Share Code</span>
              </Link>

              {/* Communities */}
              <div className="pt-5">
                <div className="flex items-center justify-between px-3 mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Communities</span>
                  <Link href={`${base}/community`} className="text-xs text-primary hover:underline">All</Link>
                </div>
                {COMMUNITIES.map((c) => (
                  <Link
                    key={c.name}
                    href={`${base}/community/${c.name.toLowerCase()}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-sm group"
                  >
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-xs`}>
                      {c.icon}
                    </div>
                    <span className="font-medium">{c.name}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* User area */}
            <div className="px-3 py-4 border-t border-sidebar-border">
              <Link
                href={`${base}/profile`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                  U
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">Your Profile</div>
                  <div className="text-xs text-muted-foreground truncate">View & edit</div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href={`${base}/settings`}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-sm mt-0.5"
              >
                <Settings size={16} />
                <span>Settings</span>
              </Link>
            </div>
          </aside>

          {/* MAIN AREA */}
          <div className="flex-1 lg:pl-64 xl:pl-72 min-h-screen flex flex-col">
            {/* Mobile header */}
            <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
              <Link href={base} className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold tracking-tight text-foreground">DevCanvas</span>
              </Link>
              <div className="flex items-center gap-2">
                <Link href={`${base}/chat`} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                  <MessageSquare size={18} className="text-muted-foreground" />
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-primary rounded-full text-xs text-white font-bold flex items-center justify-center leading-none">3</span>
                </Link>
                <Link href={`${base}/profile`} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                  U
                </Link>
              </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 lg:px-8 py-6 pb-24 lg:pb-8">
              {children}
            </main>
          </div>

          {/* BOTTOM NAV mobile */}
          <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/90 backdrop-blur-md z-50 lg:hidden safe-area-inset-bottom">
            <div className="grid grid-cols-5 h-16">
              {[
                { icon: Home, label: "Home", href: "" },
                { icon: Compass, label: "Explore", href: "/search" },
                { icon: Plus, label: "Post", href: "/upload", special: true },
                { icon: MessageSquare, label: "Chat", href: "/chat" },
                { icon: User, label: "Me", href: "/profile" },
              ].map(({ icon: Icon, label, href, special }: any) => (
                <Link
                  key={label}
                  href={`${base}${href}`}
                  className={`flex flex-col items-center justify-center gap-0.5 transition-all ${
                    special ? "relative" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {special ? (
                    <div className="absolute -top-5 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-md text-white">
                      <Plus size={22} />
                    </div>
                  ) : (
                    <>
                      <Icon size={18} />
                      <span className="text-xs font-medium">{label}</span>
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
