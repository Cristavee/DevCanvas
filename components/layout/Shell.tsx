"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home, Compass, Plus, MessageSquare, Users, Bell,
  Settings, Code2, TrendingUp, Bookmark, User, Hash,
  Zap, Trophy, BarChart2, Terminal, Search, Shield,
  LogOut, LogIn, Menu, X, UserPlus, ChevronRight,
  Star, Upload as UploadIcon,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────── */
interface SUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
  xp?: number;
}
interface Session { user?: SUser }
interface ShellProps {
  lang: string;
  session: Session | null;
  children: React.ReactNode;
}

/* ─── Nav config ────────────────────────────────────── */
const NAV = [
  { icon: Home, label: "Home", href: "" },
  { icon: Compass, label: "Explore", href: "/search" },
  { icon: TrendingUp, label: "Trending", href: "/trending" },
  { icon: MessageSquare, label: "Chat", href: "/chat", badge: 3 },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Bookmark, label: "Saved", href: "/saved" },
];
const TOOLS = [
  { icon: Terminal, label: "Code Runner", href: "/runner" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
];
const COMMUNITIES = [
  { slug: "javascript", icon: "⚡", name: "JavaScript" },
  { slug: "python", icon: "🐍", name: "Python" },
  { slug: "rust", icon: "🦀", name: "Rust" },
  { slug: "typescript", icon: "🔷", name: "TypeScript" },
  { slug: "go", icon: "🔵", name: "Go" },
];

/* ─── Helpers ───────────────────────────────────────── */
function getTier(xp = 0) {
  if (xp >= 10000) return { name: "Diamond", color: "#A8DAFF" };
  if (xp >= 5000) return { name: "Platinum", color: "#E5E4E2" };
  if (xp >= 2000) return { name: "Gold", color: "#FFB347" };
  if (xp >= 500) return { name: "Silver", color: "#C0C0C0" };
  return { name: "Bronze", color: "#CD7F32" };
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ─── Avatar ─────────────────────────────────────────── */
function Avatar({ user, size = 32 }: { user: SUser; size?: number }) {
  const letter = (user.name || user.email || "U")[0].toUpperCase();
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden"
      style={{ width: size, height: size }}>
      {user.image
        ? <img src={user.image} alt="" className="w-full h-full object-cover" />
        : <span className="w-full h-full flex items-center justify-center font-bold text-black"
            style={{
              fontSize: size * 0.38,
              background: "linear-gradient(135deg, var(--neon) 0%, var(--blue) 100%)",
            }}>
            {letter}
          </span>}
    </span>
  );
}

/* ─── NavLink ────────────────────────────────────────── */
function NavLink({
  href, icon: Icon, label, badge, active, onClick, accent = "neon",
}: {
  href: string; icon: any; label: string; badge?: number;
  active?: boolean; onClick?(): void; accent?: "neon" | "blue";
}) {
  const color = accent === "blue" ? "var(--blue)" : "var(--neon)";
  const dim   = accent === "blue" ? "var(--blue-dim)" : "var(--neon-dim)";
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
      style={active
        ? { background: dim, color }
        : { color: "hsl(var(--muted-foreground))" }}>
      <Icon size={16} className="shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge != null && (
        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full text-black"
          style={{ background: "var(--neon)" }}>{badge}</span>
      )}
    </Link>
  );
}

/* ─── SidebarContent ─────────────────────────────────── */
function SidebarContent({
  lang, session, pathname, onClose,
}: {
  lang: string; session: Session | null; pathname: string; onClose?(): void;
}) {
  const base = `/${lang}`;
  const user = session?.user;
  const tier = getTier(user?.xp);
  const isActive = (href: string) =>
    href === "" ? pathname === base : pathname.startsWith(`${base}${href}`);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* User card */}
      {user ? (
        <div className="px-3 py-3 border-b shrink-0" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
          <Link href={`${base}/profile`} onClick={onClose}
            className="flex items-center gap-2.5 p-2 rounded-xl transition-colors hover:bg-white/5">
            <Avatar user={user} size={36} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate leading-tight">{user.name}</div>
              <div className="text-[11px] truncate font-mono mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{user.email}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-mono font-bold" style={{ color: "var(--neon)" }}>{(user.xp ?? 0).toLocaleString()} XP</span>
                <span className="text-[10px] font-mono px-1.5 py-px rounded-full" style={{ color: tier.color, background: tier.color + "22" }}>{tier.name}</span>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div className="px-3 py-3 border-b shrink-0 space-y-2" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
          <Link href={`${base}/auth/signin?tab=signup`} onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-black transition-opacity hover:opacity-90"
            style={{ background: "var(--neon)" }}>
            <UserPlus size={14} />Create Account
          </Link>
          <Link href={`${base}/auth/signin`} onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
            <LogIn size={14} />Sign In
          </Link>
        </div>
      )}

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <p className="text-[10px] font-mono uppercase tracking-widest px-2 pb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Navigation</p>
        {NAV.map(({ icon, label, href, badge }: any) => (
          <NavLink key={label} href={`${base}${href}`} icon={icon} label={label}
            badge={badge} active={isActive(href)} onClick={onClose} />
        ))}

        {user ? (
          <Link href={`${base}/upload`} onClick={onClose}
            className="mt-2 flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-bold text-black transition-opacity hover:opacity-90"
            style={{ background: "var(--neon)" }}>
            <Plus size={16} /><span>New Snippet</span>
          </Link>
        ) : (
          <Link href={`${base}/auth/signin`} onClick={onClose}
            className="mt-2 flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-semibold border"
            style={{ borderColor: "var(--neon)", color: "var(--neon)", background: "var(--neon-dim)" }}>
            <LogIn size={15} /><span>Sign in to post</span>
          </Link>
        )}

        <p className="text-[10px] font-mono uppercase tracking-widest px-2 pt-4 pb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Dev Tools</p>
        {TOOLS.map(({ icon, label, href }) => (
          <NavLink key={label} href={`${base}${href}`} icon={icon} label={label}
            active={isActive(href)} onClick={onClose} accent="blue" />
        ))}

        <div className="flex items-center justify-between px-2 pt-4 pb-1.5">
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "hsl(var(--muted-foreground))" }}>Communities</p>
          <Link href={`${base}/community`} onClick={onClose}
            className="text-[10px] font-mono transition-colors hover:text-white"
            style={{ color: "hsl(var(--muted-foreground))" }}>all →</Link>
        </div>
        {COMMUNITIES.map(c => (
          <Link key={c.slug} href={`${base}/community/${c.slug}`} onClick={onClose}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-colors hover:bg-white/5"
            style={{ color: "hsl(var(--muted-foreground))" }}>
            <span className="text-base w-5 text-center shrink-0">{c.icon}</span>
            <span className="truncate">{c.name}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t shrink-0 space-y-0.5" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        {user?.role === "admin" && (
          <Link href={`${base}/admin`} onClick={onClose}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: "var(--blue)" }}>
            <Shield size={14} /><span>Admin Panel</span>
          </Link>
        )}
        <Link href={`${base}/settings`} onClick={onClose}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
          style={{ color: "hsl(var(--muted-foreground))" }}>
          <Settings size={14} /><span>Settings</span>
        </Link>
        {user && (
          <button
            onClick={() => { onClose?.(); signOut({ callbackUrl: `/${lang}` }); }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-red-500/10 text-red-400">
            <LogOut size={14} /><span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── MobileDrawer ───────────────────────────────────── */
function MobileDrawer({
  open, onClose, lang, session, pathname,
}: {
  open: boolean; onClose(): void; lang: string; session: Session | null; pathname: string;
}) {
  // Prevent body scroll while drawer open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] transition-opacity duration-300 lg:hidden"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
      />
      {/* Panel — 80% of screen width, max 300px */}
      <div
        className="fixed top-0 left-0 h-full z-[80] flex flex-col border-r transition-transform duration-300 ease-out lg:hidden"
        style={{
          width: "min(300px, 82vw)",
          background: "hsl(var(--sidebar-bg))",
          borderColor: "hsl(var(--sidebar-border))",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          WebkitOverflowScrolling: "touch",
        }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0"
          style={{ borderColor: "hsl(var(--sidebar-border))", minHeight: "var(--header-h)" }}>
          <Link href={`/${lang}`} onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
              style={{ borderColor: "var(--neon)", background: "var(--neon-dim)" }}>
              <Code2 size={14} style={{ color: "var(--neon)" }} />
            </div>
            <div>
              <div className="font-bold text-sm text-white leading-none">DevCanvas</div>
              <div className="text-[9px] font-mono" style={{ color: "var(--neon)" }}>v3.0</div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-white/10"
            style={{ color: "hsl(var(--muted-foreground))" }}>
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <SidebarContent lang={lang} session={session} pathname={pathname} onClose={onClose} />
        </div>
      </div>
    </>
  );
}

/* ─── DesktopSidebar ─────────────────────────────────── */
function DesktopSidebar({
  lang, session, pathname, onSearch,
}: {
  lang: string; session: Session | null; pathname: string; onSearch(): void;
}) {
  return (
    <aside
      className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 border-r"
      style={{
        width: "var(--sidebar-width)",
        background: "hsl(var(--sidebar-bg))",
        borderColor: "hsl(var(--sidebar-border))",
      }}>
      {/* Logo */}
      <div className="px-4 py-4 border-b shrink-0" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <Link href={`/${lang}`} className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all group-hover:shadow-[0_0_12px_var(--neon-glow)]"
            style={{ borderColor: "var(--neon)", background: "var(--neon-dim)" }}>
            <Code2 size={16} style={{ color: "var(--neon)" }} />
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-tight leading-none">DevCanvas</div>
            <div className="text-[10px] font-mono" style={{ color: "var(--neon)" }}>v3.0.0</div>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 shrink-0">
        <button
          onClick={onSearch}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-colors hover:border-[var(--neon)]/30"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}>
          <Search size={12} style={{ color: "hsl(var(--muted-foreground))" }} />
          <span className="flex-1 text-xs font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>Search...</span>
          <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>⌘K</kbd>
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <SidebarContent lang={lang} session={session} pathname={pathname} />
      </div>
    </aside>
  );
}

/* ─── MobileHeader ───────────────────────────────────── */
function MobileHeader({
  lang, session, onMenu, onSearch,
}: {
  lang: string; session: Session | null;
  onMenu(): void; onSearch(): void;
}) {
  const user = session?.user;
  const [showUser, setShowUser] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!showUser) return;
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setShowUser(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showUser]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:hidden glass"
      style={{ height: "var(--header-h)" }}>
      {/* Hamburger */}
      <button
        onClick={onMenu}
        className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors hover:bg-white/10 shrink-0"
        aria-label="Open menu">
        <Menu size={20} style={{ color: "hsl(var(--foreground))" }} />
      </button>

      {/* Logo — centered absolutely */}
      <Link
        href={`/${lang}`}
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center border shrink-0"
          style={{ borderColor: "var(--neon)", background: "var(--neon-dim)" }}>
          <Code2 size={13} style={{ color: "var(--neon)" }} />
        </div>
        <span className="font-bold text-sm text-white tracking-tight">DevCanvas</span>
        <span className="text-[9px] font-mono" style={{ color: "var(--neon)" }}>v3</span>
      </Link>

      {/* Right: search + user */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onSearch}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
          style={{ color: "hsl(var(--muted-foreground))" }}>
          <Search size={18} />
        </button>

        <div ref={dropRef} className="relative">
          <button
            onClick={() => setShowUser(s => !s)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
            aria-label="User menu">
            {user ? <Avatar user={user} size={28} /> : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center border" style={{ borderColor: "hsl(var(--border))" }}>
                <User size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
              </div>
            )}
          </button>

          {showUser && (
            <UserDropdown user={user} lang={lang} onClose={() => setShowUser(false)} />
          )}
        </div>
      </div>
    </header>
  );
}

/* ─── DesktopTopbar ──────────────────────────────────── */
function DesktopTopbar({
  lang, session, onSearch,
}: {
  lang: string; session: Session | null; onSearch(): void;
}) {
  const user = session?.user;
  const [showUser, setShowUser] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showUser) return;
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setShowUser(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showUser]);

  return (
    <header
      className="hidden lg:flex items-center justify-end gap-3 px-6 border-b sticky top-0 z-30 glass"
      style={{ height: "var(--header-h)", borderColor: "hsl(var(--border))" }}>
      {/* Search shortcut */}
      <button
        onClick={onSearch}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono transition-colors hover:border-[var(--neon)]/30"
        style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
        <Search size={12} />
        <span className="hidden xl:inline">Quick search...</span>
        <kbd className="text-[9px] bg-black/30 px-1.5 py-0.5 rounded border" style={{ borderColor: "hsl(var(--border))" }}>⌘K</kbd>
      </button>

      {/* Notifications */}
      {user && (
        <Link href={`/${lang}/notifications`}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-white/10"
          style={{ color: "hsl(var(--muted-foreground))" }}>
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-neon" style={{ background: "var(--neon)" }} />
        </Link>
      )}

      {/* User */}
      <div ref={dropRef} className="relative">
        {user ? (
          <button
            onClick={() => setShowUser(s => !s)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all hover:border-[var(--neon)]/40"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
            <Avatar user={user} size={26} />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-white truncate max-w-[100px] leading-none">{user.name}</div>
              <div className="text-[10px] font-mono mt-0.5" style={{ color: "var(--neon)" }}>{(user.xp ?? 0).toLocaleString()} XP</div>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link href={`/${lang}/auth/signin`}
              className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-white/5"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
              Sign In
            </Link>
            <Link href={`/${lang}/auth/signin?tab=signup`}
              className="px-4 py-2 rounded-xl text-sm font-bold text-black transition-opacity hover:opacity-90"
              style={{ background: "var(--neon)" }}>
              Sign Up
            </Link>
          </div>
        )}
        {showUser && user && (
          <UserDropdown user={user} lang={lang} onClose={() => setShowUser(false)} />
        )}
      </div>
    </header>
  );
}

/* ─── UserDropdown ───────────────────────────────────── */
function UserDropdown({ user, lang, onClose }: { user?: SUser; lang: string; onClose(): void }) {
  if (!user) return (
    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border overflow-hidden shadow-2xl z-[100] animate-scale-in"
      style={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}>
      <div className="p-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
        <p className="text-sm font-semibold text-white mb-1">Join DevCanvas</p>
        <p className="text-[11px] font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>Share code · Earn XP · Level up</p>
      </div>
      <div className="p-3 space-y-2">
        <Link href={`/${lang}/auth/signin?tab=signup`} onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-black"
          style={{ background: "var(--neon)" }}>
          <UserPlus size={14} />Create Account
        </Link>
        <Link href={`/${lang}/auth/signin`} onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-white/5"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
          <LogIn size={14} />Sign In
        </Link>
      </div>
    </div>
  );

  const tier = getTier(user.xp);
  const links = [
    { icon: User, label: "Profile", href: `/${lang}/profile` },
    { icon: BarChart2, label: "Analytics", href: `/${lang}/analytics` },
    { icon: Bookmark, label: "Saved", href: `/${lang}/saved` },
    { icon: Settings, label: "Settings", href: `/${lang}/settings` },
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border overflow-hidden shadow-2xl z-[100] animate-scale-in"
      style={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}>
      {/* User info */}
      <div className="p-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="flex items-center gap-3">
          <Avatar user={user} size={36} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user.name}</div>
            <div className="text-[11px] font-mono truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{user.email}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-mono font-bold" style={{ color: "var(--neon)" }}>{(user.xp ?? 0).toLocaleString()} XP</span>
              <span className="text-[10px] font-mono px-1.5 py-px rounded-full" style={{ color: tier.color, background: tier.color + "22" }}>{tier.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="py-1.5">
        {links.map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href} onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
            style={{ color: "hsl(var(--foreground))" }}>
            <Icon size={14} style={{ color: "hsl(var(--muted-foreground))" }} className="shrink-0" />
            {label}
          </Link>
        ))}
        {user.role === "admin" && (
          <Link href={`/${lang}/admin`} onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
            style={{ color: "var(--blue)" }}>
            <Shield size={14} className="shrink-0" />Admin Panel
          </Link>
        )}
      </div>

      <div className="border-t py-1.5" style={{ borderColor: "hsl(var(--border))" }}>
        <button
          onClick={() => { onClose(); signOut({ callbackUrl: `/${lang}` }); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10">
          <LogOut size={14} className="shrink-0" />Sign Out
        </button>
      </div>
    </div>
  );
}

/* ─── BottomNav ──────────────────────────────────────── */
function BottomNav({
  lang, session, pathname,
}: {
  lang: string; session: Session | null; pathname: string;
}) {
  const base = `/${lang}`;
  const user = session?.user;

  const items = [
    { icon: Home, label: "Home", href: base },
    { icon: Compass, label: "Explore", href: `${base}/search` },
    { icon: Plus, label: "New", href: user ? `${base}/upload` : `${base}/auth/signin`, special: true },
    { icon: MessageSquare, label: "Chat", href: `${base}/chat` },
    { icon: User, label: "Profile", href: user ? `${base}/profile` : `${base}/auth/signin` },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t lg:hidden glass"
      style={{
        borderColor: "hsl(var(--border))",
        height: "calc(var(--bottomnav-h) + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
      <div className="grid grid-cols-5 h-[var(--bottomnav-h)]">
        {items.map(({ icon: Icon, label, href, special }) => {
          const active = href === base ? pathname === base : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center justify-center gap-1 relative transition-all"
              style={special ? {} : { color: active ? "var(--neon)" : "hsl(var(--muted-foreground))" }}>
              {special ? (
                <div
                  className="absolute -top-5 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg text-black"
                  style={{ background: "linear-gradient(135deg, var(--neon) 0%, var(--blue) 100%)" }}>
                  <Icon size={22} />
                </div>
              ) : (
                <>
                  <Icon size={18} />
                  <span className="text-[10px] font-medium leading-none">{label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ─── CommandSearch ──────────────────────────────────── */
function CommandSearch({ open, onClose, lang }: { open: boolean; onClose(): void; lang: string }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const base = `/${lang}`;

  const ALL = [
    { icon: Home, label: "Home", href: base },
    { icon: Compass, label: "Explore Snippets", href: `${base}/search` },
    { icon: Plus, label: "New Snippet", href: `${base}/upload` },
    { icon: MessageSquare, label: "Chat", href: `${base}/chat` },
    { icon: Users, label: "Communities", href: `${base}/community` },
    { icon: Terminal, label: "Code Runner", href: `${base}/runner` },
    { icon: BarChart2, label: "Analytics", href: `${base}/analytics` },
    { icon: Trophy, label: "Leaderboard", href: `${base}/leaderboard` },
    { icon: User, label: "My Profile", href: `${base}/profile` },
    { icon: Settings, label: "Settings", href: `${base}/settings` },
  ];
  const filtered = ALL.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (open) { setQ(""); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  // ⌘K shortcut
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); open ? onClose() : null; }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  const [q2, setQ2] = useState(q); // alias for useState re-declaration avoidance
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center px-4"
      style={{ paddingTop: "12vh", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border overflow-hidden shadow-2xl animate-scale-in"
        style={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} className="shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search pages and commands..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-muted-foreground outline-none font-mono"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0"
            style={{ background: "hsl(var(--muted))", borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
            ESC
          </kbd>
        </div>
        <div className="py-2 max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-sm font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>No results for "{q}"</p>
          ) : filtered.map(c => (
            <Link key={c.href} href={c.href} onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5 group">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--neon-dim)" }}>
                <c.icon size={15} style={{ color: "var(--neon)" }} />
              </div>
              <span className="text-sm text-white">{c.label}</span>
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-50 shrink-0"
                style={{ color: "hsl(var(--muted-foreground))" }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Shell (root export) ────────────────────────────── */
export function Shell({ lang, session, children }: ShellProps) {
  const pathname = usePathname() || "";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isAuth = pathname.includes("/auth/");

  // ⌘K open shortcut
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(s => !s); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // Auth pages — full screen, no nav
  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} lang={lang} />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        lang={lang}
        session={session}
        pathname={pathname}
      />

      {/* Fixed desktop sidebar */}
      <DesktopSidebar
        lang={lang}
        session={session}
        pathname={pathname}
        onSearch={() => setSearchOpen(true)}
      />

      {/* Scrollable content column */}
      <div className="layout-content flex flex-col min-h-screen">
        {/* Mobile header */}
        <MobileHeader
          lang={lang}
          session={session}
          onMenu={() => setDrawerOpen(true)}
          onSearch={() => setSearchOpen(true)}
        />

        {/* Desktop topbar */}
        <DesktopTopbar
          lang={lang}
          session={session}
          onSearch={() => setSearchOpen(true)}
        />

        {/* Main page content */}
        <main className="flex-1 page-padding-mobile max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav lang={lang} session={session} pathname={pathname} />
    </>
  );
}
