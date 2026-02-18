"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home, Compass, Plus, MessageSquare, Users, Bell, Settings,
  Code2, TrendingUp, Bookmark, User, Hash, Zap, Trophy,
  BarChart2, Terminal, Search, Shield, LogOut, LogIn,
  Menu, X, ChevronRight, Sun, Moon, Monitor, UserPlus,
  Flame, Star, Activity, Layers, Keyboard,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
  xp?: number;
}
interface Session { user?: SessionUser }
interface NavClientProps {
  lang: string;
  session: Session | null;
  children?: React.ReactNode;
}

// ─────────────────────────────────────────────
// Nav items
// ─────────────────────────────────────────────
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

const TIER_COLORS: Record<string, string> = {
  Diamond: "#A8DAFF", Platinum: "#E5E4E2", Gold: "#FFB347",
  Silver: "#C0C0C0", Bronze: "#CD7F32",
};

function getUserTier(xp: number) {
  if (xp >= 10000) return "Diamond";
  if (xp >= 5000) return "Platinum";
  if (xp >= 2000) return "Gold";
  if (xp >= 500) return "Silver";
  return "Bronze";
}

// ─────────────────────────────────────────────
// Avatar component
// ─────────────────────────────────────────────
function UserAvatar({ user, size = 8 }: { user: SessionUser; size?: number }) {
  const initials = (user.name || user.email || "U").charAt(0).toUpperCase();
  return (
    <div className={`relative w-${size} h-${size} rounded-full overflow-hidden flex-shrink-0`}>
      {user.image ? (
        <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-black"
          style={{ background: "linear-gradient(135deg, var(--neon-green), var(--electric-blue))" }}>
          {initials}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Sidebar nav link
// ─────────────────────────────────────────────
function SidebarLink({
  href, icon: Icon, label, badge, active, onClick, accent
}: {
  href: string; icon: any; label: string; badge?: number;
  active?: boolean; onClick?: () => void; accent?: "blue" | "green";
}) {
  const dimVar = accent === "blue" ? "var(--electric-blue-dim)" : "var(--neon-green-dim)";
  const colorVar = accent === "blue" ? "var(--electric-blue)" : "var(--neon-green)";
  return (
    <Link href={href} onClick={onClick}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all group relative ${active ? "" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
      style={active ? { background: dimVar, color: colorVar } : {}}>
      <Icon size={15} className={`flex-shrink-0 transition-colors ${active ? "" : "group-hover:text-[color:var(--neon-green)]"}`} />
      <span className="flex-1 text-sm truncate">{label}</span>
      {badge != null && (
        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full leading-none text-black"
          style={{ background: "var(--neon-green)" }}>
          {badge}
        </span>
      )}
    </Link>
  );
}

// ─────────────────────────────────────────────
// Command palette (⌘K)
// ─────────────────────────────────────────────
function CommandPalette({ open, onClose, lang }: { open: boolean; onClose: () => void; lang: string }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const base = `/${lang}`;

  const CMDS = [
    { icon: Home, label: "Home", href: `${base}` },
    { icon: Compass, label: "Explore", href: `${base}/search` },
    { icon: Plus, label: "New Snippet", href: `${base}/upload` },
    { icon: MessageSquare, label: "Chat", href: `${base}/chat` },
    { icon: Users, label: "Communities", href: `${base}/community` },
    { icon: Terminal, label: "Code Runner", href: `${base}/runner` },
    { icon: BarChart2, label: "Analytics", href: `${base}/analytics` },
    { icon: Trophy, label: "Leaderboard", href: `${base}/leaderboard` },
    { icon: User, label: "Profile", href: `${base}/profile` },
    { icon: Settings, label: "Settings", href: `${base}/settings` },
  ];
  const filtered = CMDS.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (open) { setQ(""); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4" onClick={onClose}
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg rounded-2xl border border-border overflow-hidden shadow-2xl animate-scale-in"
        style={{ background: "hsl(var(--popover))" }}
        onClick={e => e.stopPropagation()}>
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search pages, commands..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-mono"
            onKeyDown={e => e.key === "Escape" && onClose()} />
          <kbd className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground">ESC</kbd>
        </div>
        {/* Results */}
        <div className="py-2 max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-6 font-mono">No results for "{q}"</p>
          ) : filtered.map(cmd => (
            <Link key={cmd.href} href={cmd.href} onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors group">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "var(--neon-green-dim)" }}>
                <cmd.icon size={14} style={{ color: "var(--neon-green)" }} />
              </div>
              <span className="text-sm text-foreground">{cmd.label}</span>
              <span className="ml-auto text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100">↵ open</span>
            </Link>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-border flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1"><kbd className="bg-muted px-1 py-0.5 rounded border border-border">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="bg-muted px-1 py-0.5 rounded border border-border">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="bg-muted px-1 py-0.5 rounded border border-border">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// User dropdown (top-right, logged in)
// ─────────────────────────────────────────────
function UserDropdown({ user, lang, onClose }: { user: SessionUser; lang: string; onClose: () => void }) {
  const base = `/${lang}`;
  const xp = user.xp ?? 0;
  const tier = getUserTier(xp);
  const tierColor = TIER_COLORS[tier];

  return (
    <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl border border-border shadow-2xl z-[100] overflow-hidden animate-scale-in"
      style={{ background: "hsl(var(--popover))" }}>
      {/* User info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size={10} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
            <div className="text-[11px] text-muted-foreground truncate font-mono">{user.email}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-mono font-bold" style={{ color: "var(--neon-green)" }}>{xp.toLocaleString()} XP</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
                style={{ color: tierColor, background: tierColor + "20" }}>{tier}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Links */}
      <div className="py-1.5">
        {[
          { icon: User, label: "Your Profile", href: `${base}/profile` },
          { icon: BarChart2, label: "Analytics", href: `${base}/analytics` },
          { icon: Bookmark, label: "Saved Snippets", href: `${base}/saved` },
          { icon: Settings, label: "Settings", href: `${base}/settings` },
        ].map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href} onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-sm text-foreground">
            <Icon size={14} className="text-muted-foreground flex-shrink-0" />
            {label}
          </Link>
        ))}
        {user.role === "admin" && (
          <Link href={`${base}/admin`} onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-sm"
            style={{ color: "var(--electric-blue)" }}>
            <Shield size={14} className="flex-shrink-0" />
            Admin Panel
          </Link>
        )}
      </div>
      <div className="border-t border-border py-1.5">
        <button onClick={() => { signOut({ callbackUrl: `/${lang}` }); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-sm text-red-400 hover:text-red-300">
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Guest dropdown (not logged in)
// ─────────────────────────────────────────────
function GuestDropdown({ lang, onClose }: { lang: string; onClose: () => void }) {
  return (
    <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl border border-border shadow-2xl z-[100] overflow-hidden animate-scale-in"
      style={{ background: "hsl(var(--popover))" }}>
      <div className="p-4 border-b border-border">
        <p className="text-sm text-foreground font-semibold mb-1">Join DevCanvas</p>
        <p className="text-[11px] text-muted-foreground">Share code, join communities, and level up.</p>
      </div>
      <div className="p-3 space-y-2">
        <Link href={`/${lang}/auth/signin?tab=signup`} onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
          style={{ background: "var(--neon-green)" }}>
          <UserPlus size={14} />
          Create Account
        </Link>
        <Link href={`/${lang}/auth/signin`} onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors">
          <LogIn size={14} />
          Sign In
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Mobile drawer
// ─────────────────────────────────────────────
function MobileDrawer({
  open, onClose, lang, session, pathname,
}: {
  open: boolean; onClose: () => void; lang: string;
  session: Session | null; pathname: string;
}) {
  const base = `/${lang}`;
  const user = session?.user;

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 z-[80] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose} />
      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[280px] z-[90] flex flex-col border-r border-border transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "hsl(var(--sidebar-bg))" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
          <Link href={base} onClick={onClose} className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="absolute inset-0 rounded-lg opacity-30 blur-md" style={{ background: "var(--neon-green)" }} />
              <div className="relative w-8 h-8 rounded-lg border flex items-center justify-center" style={{ borderColor: "var(--neon-green)", background: "var(--neon-green-dim)" }}>
                <Code2 className="w-4 h-4" style={{ color: "var(--neon-green)" }} />
              </div>
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-foreground">DevCanvas</span>
              <div className="text-[10px] font-mono" style={{ color: "var(--neon-green)" }}>v3.0.0</div>
            </div>
          </Link>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        {/* User block in drawer */}
        {user ? (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <UserAvatar user={user} size={9} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
                <div className="text-[10px] font-mono text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-mono font-bold" style={{ color: "var(--neon-green)" }}>{(user.xp ?? 0).toLocaleString()} XP</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
                style={{ color: TIER_COLORS[getUserTier(user.xp ?? 0)], background: TIER_COLORS[getUserTier(user.xp ?? 0)] + "20" }}>
                {getUserTier(user.xp ?? 0)}
              </span>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 border-b border-sidebar-border space-y-2">
            <Link href={`${base}/auth/signin?tab=signup`} onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-black"
              style={{ background: "var(--neon-green)" }}>
              <UserPlus size={14} />
              Create Account
            </Link>
            <Link href={`${base}/auth/signin`} onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors">
              <LogIn size={14} />
              Sign In
            </Link>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 py-1.5">Navigation</div>
          {NAV_MAIN.map(({ icon, label, href, badge }: any) => (
            <SidebarLink key={label} href={`${base}${href}`} icon={icon} label={label} badge={badge}
              active={pathname === `${base}${href}` || (href === "" && pathname === base)}
              onClick={onClose} />
          ))}

          {user && (
            <>
              <Link href={`${base}/upload`} onClick={onClose}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-semibold mt-2 transition-all hover:opacity-90 font-mono"
                style={{ background: "var(--neon-green)", color: "hsl(var(--background))" }}>
                <Plus size={15} />
                <span>New Snippet</span>
              </Link>
            </>
          )}

          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 py-1.5 pt-4">Dev Tools</div>
          {NAV_TOOLS.map(({ icon, label, href }: any) => (
            <SidebarLink key={label} href={`${base}${href}`} icon={icon} label={label}
              active={pathname === `${base}${href}`} onClick={onClose} accent="blue" />
          ))}

          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 py-1.5 pt-4">Communities</div>
          {COMMUNITIES.map((c) => (
            <Link key={c.slug} href={`${base}/community/${c.slug}`} onClick={onClose}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all text-sm">
              <div className="w-5 h-5 rounded flex items-center justify-center text-xs">{c.icon}</div>
              <span className="text-sm">{c.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-3 border-t border-sidebar-border space-y-0.5">
          {user?.role === "admin" && (
            <Link href={`${base}/admin`} onClick={onClose}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all"
              style={{ color: "var(--electric-blue)" }}>
              <Shield size={14} />
              Admin Panel
            </Link>
          )}
          <Link href={`${base}/settings`} onClick={onClose}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all text-sm">
            <Settings size={14} />
            Settings
          </Link>
          {user && (
            <button onClick={() => { signOut({ callbackUrl: `/${lang}` }); onClose(); }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut size={14} />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Desktop sidebar
// ─────────────────────────────────────────────
function DesktopSidebar({ lang, session, pathname, onCmd }: {
  lang: string; session: Session | null;
  pathname: string; onCmd: () => void;
}) {
  const base = `/${lang}`;
  const user = session?.user;

  return (
    <aside className="hidden lg:flex flex-col w-60 xl:w-64 border-r border-sidebar-border flex-shrink-0 fixed left-0 top-0 h-screen z-40"
      style={{ background: "hsl(var(--sidebar-bg))" }}>
      {/* Logo */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <Link href={base} className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 rounded-lg opacity-20 blur-md group-hover:opacity-40 transition-opacity" style={{ background: "var(--neon-green)" }} />
            <div className="relative w-8 h-8 rounded-lg border flex items-center justify-center"
              style={{ borderColor: "var(--neon-green)", background: "var(--neon-green-dim)" }}>
              <Code2 className="w-4 h-4" style={{ color: "var(--neon-green)" }} />
            </div>
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-foreground">DevCanvas</span>
            <div className="text-[10px] font-mono" style={{ color: "var(--neon-green)" }}>v3.0.0</div>
          </div>
        </Link>
      </div>

      {/* ⌘K search */}
      <div className="px-4 pt-3">
        <button onClick={onCmd}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/50 text-muted-foreground text-xs hover:border-[var(--neon-green)]/30 transition-colors group">
          <Search size={12} />
          <span className="flex-1 text-left font-mono">Search or jump...</span>
          <kbd className="text-[10px] font-mono bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 py-1.5">Navigation</div>
        {NAV_MAIN.map(({ icon, label, href, badge }: any) => (
          <SidebarLink key={label} href={`${base}${href}`} icon={icon} label={label} badge={badge}
            active={pathname === `${base}${href}` || (href === "" && pathname === base)} />
        ))}

        {user ? (
          <Link href={`${base}/upload`}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-semibold mt-2 transition-all hover:opacity-90 font-mono"
            style={{ background: "var(--neon-green)", color: "hsl(var(--background))" }}>
            <Plus size={15} />
            <span>New Snippet</span>
            <span className="ml-auto text-[10px] opacity-70">⌘N</span>
          </Link>
        ) : (
          <Link href={`${base}/auth/signin`}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-semibold mt-2 transition-all border border-[var(--neon-green)]/40 text-[color:var(--neon-green)] hover:bg-[var(--neon-green-dim)]">
            <LogIn size={15} />
            <span>Sign In to Post</span>
          </Link>
        )}

        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 py-1.5 pt-4">Dev Tools</div>
        {NAV_TOOLS.map(({ icon, label, href }: any) => (
          <SidebarLink key={label} href={`${base}${href}`} icon={icon} label={label}
            active={pathname === `${base}${href}`} accent="blue" />
        ))}

        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 py-1.5 pt-4 flex items-center justify-between">
          <span>Communities</span>
          <Link href={`${base}/community`} className="text-[10px] font-mono hover:text-[color:var(--neon-green)] transition-colors">all →</Link>
        </div>
        {COMMUNITIES.map((c) => (
          <Link key={c.slug} href={`${base}/community/${c.slug}`}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all text-sm group">
            <div className="w-5 h-5 rounded flex items-center justify-center text-xs">{c.icon}</div>
            <span className="flex-1 text-sm">{c.name}</span>
            <Hash size={11} className="opacity-0 group-hover:opacity-50 transition-opacity" />
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-0.5">
        {user?.role === "admin" && (
          <Link href={`${base}/admin`}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all"
            style={{ color: "var(--electric-blue)" }}>
            <Shield size={14} />
            Admin Panel
          </Link>
        )}
        <Link href={`${base}/settings`}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all text-sm">
          <Settings size={14} />
          Settings
        </Link>
        {user ? (
          <Link href={`${base}/profile`}
            className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-muted/50 transition-all group mt-1">
            <UserAvatar user={user} size={7} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground truncate">{user.name}</div>
              <div className="text-[10px] font-mono text-muted-foreground">
                {(user.xp ?? 0).toLocaleString()} XP · {getUserTier(user.xp ?? 0)}
              </div>
            </div>
            <Zap size={12} style={{ color: "var(--neon-green)" }} />
          </Link>
        ) : (
          <Link href={`${base}/auth/signin`}
            className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-muted/50 transition-all text-muted-foreground hover:text-foreground text-sm mt-1">
            <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center flex-shrink-0">
              <User size={13} />
            </div>
            <span className="text-xs">Guest · Sign In</span>
          </Link>
        )}
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// Mobile header
// ─────────────────────────────────────────────
function MobileHeader({ lang, session, onMenu, onCmd, onUserMenu, showUserMenu }: {
  lang: string; session: Session | null;
  onMenu: () => void; onCmd: () => void;
  onUserMenu: () => void; showUserMenu: boolean;
}) {
  const base = `/${lang}`;
  const user = session?.user;

  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border glass sticky top-0 z-50">
      {/* Hamburger */}
      <button onClick={onMenu} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
        <Menu size={20} />
      </button>

      {/* Logo center */}
      <Link href={base} className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        <div className="w-6 h-6 rounded-md border flex items-center justify-center"
          style={{ borderColor: "var(--neon-green)", background: "var(--neon-green-dim)" }}>
          <Code2 className="w-3.5 h-3.5" style={{ color: "var(--neon-green)" }} />
        </div>
        <span className="font-bold text-sm tracking-tight text-foreground">DevCanvas</span>
        <span className="text-[10px] font-mono" style={{ color: "var(--neon-green)" }}>v3</span>
      </Link>

      {/* Right: search + user */}
      <div className="flex items-center gap-1.5">
        <button onClick={onCmd} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <Search size={18} />
        </button>

        <div className="relative">
          <button onClick={onUserMenu}
            className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-muted transition-colors">
            {user ? (
              <UserAvatar user={user} size={8} />
            ) : (
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground">
                <User size={15} />
              </div>
            )}
          </button>
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-[90]" onClick={onUserMenu} />
              <div className="relative z-[100]">
                {user ? (
                  <UserDropdown user={user} lang={lang} onClose={onUserMenu} />
                ) : (
                  <GuestDropdown lang={lang} onClose={onUserMenu} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// Top-right header bar (desktop) - right side
// ─────────────────────────────────────────────
function DesktopTopBar({ lang, session, onCmd }: {
  lang: string; session: Session | null; onCmd: () => void;
}) {
  const base = `/${lang}`;
  const user = session?.user;
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="hidden lg:flex items-center justify-end gap-2 px-6 py-3 border-b border-border sticky top-0 z-30 glass">
      {/* ⌘K button */}
      <button onClick={onCmd}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-muted-foreground text-xs hover:border-[var(--neon-green)]/30 hover:text-foreground transition-colors">
        <Search size={12} />
        <span className="font-mono hidden xl:inline">Search...</span>
        <kbd className="text-[10px] font-mono bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
      </button>

      {/* Notifications */}
      {user && (
        <Link href={`${base}/notifications`} className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "var(--neon-green)" }} />
        </Link>
      )}

      {user ? (
        <div className="relative">
          <button onClick={() => setShowUserMenu(s => !s)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-border hover:border-[var(--neon-green)]/40 hover:bg-muted transition-all">
            <UserAvatar user={user} size={7} />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-foreground leading-tight truncate max-w-[100px]">{user.name}</div>
              <div className="text-[10px] font-mono" style={{ color: "var(--neon-green)" }}>{(user.xp ?? 0).toLocaleString()} XP</div>
            </div>
            <Menu size={13} className="text-muted-foreground hidden xl:block" />
          </button>
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-[90]" onClick={() => setShowUserMenu(false)} />
              <div className="relative z-[100]">
                <UserDropdown user={user} lang={lang} onClose={() => setShowUserMenu(false)} />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link href={`${base}/auth/signin`}
            className="px-3.5 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors">
            Sign In
          </Link>
          <Link href={`${base}/auth/signin?tab=signup`}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
            style={{ background: "var(--neon-green)" }}>
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Mobile bottom nav
// ─────────────────────────────────────────────
function MobileBottomNav({ lang, session, pathname }: {
  lang: string; session: Session | null; pathname: string;
}) {
  const base = `/${lang}`;
  const user = session?.user;

  const items = [
    { icon: Home, label: "Home", href: "" },
    { icon: Compass, label: "Explore", href: "/search" },
    { icon: Plus, label: "New", href: user ? "/upload" : "/auth/signin", special: true },
    { icon: MessageSquare, label: "Chat", href: "/chat" },
    { icon: User, label: "Me", href: user ? "/profile" : "/auth/signin" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border glass z-50 lg:hidden">
      <div className="grid grid-cols-5" style={{ height: "56px" }}>
        {items.map(({ icon: Icon, label, href, special }: any) => {
          const fullHref = `${base}${href}`;
          const isActive = pathname === fullHref;
          return (
            <Link key={label} href={fullHref}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all ${special ? "relative" : isActive ? "" : "text-muted-foreground"}`}
              style={isActive && !special ? { color: "var(--neon-green)" } : {}}>
              {special ? (
                <div className="absolute -top-4 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg text-black"
                  style={{ background: "linear-gradient(135deg, var(--neon-green), var(--electric-blue))" }}>
                  <Icon size={20} />
                </div>
              ) : (
                <>
                  <Icon size={17} />
                  <span className="text-[9px] font-medium">{label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
      {/* safe area */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}

// ─────────────────────────────────────────────
// Root NavClient
// ─────────────────────────────────────────────
export function NavClient({ lang, session, children }: NavClientProps) {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(s => !s);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Full-screen chat: no padding
  const isChat = pathname.includes("/chat");
  const isAuthPage = pathname.includes("/auth/");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} lang={lang} />
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} lang={lang} session={session} pathname={pathname} />

      <div className="min-h-screen flex">
        <DesktopSidebar lang={lang} session={session} pathname={pathname} onCmd={() => setCmdOpen(true)} />

        <div className="flex-1 lg:pl-60 xl:pl-64 min-h-screen flex flex-col">
          <MobileHeader
            lang={lang} session={session}
            onMenu={() => setMobileOpen(true)}
            onCmd={() => setCmdOpen(true)}
            onUserMenu={() => setShowMobileUserMenu(s => !s)}
            showUserMenu={showMobileUserMenu}
          />
          <DesktopTopBar lang={lang} session={session} onCmd={() => setCmdOpen(true)} />

          <main className={`flex-1 w-full ${isChat ? "overflow-hidden" : "max-w-6xl mx-auto px-4 lg:px-8 py-6 pb-20 lg:pb-8"}`}>
            {children}
          </main>
        </div>

        <MobileBottomNav lang={lang} session={session} pathname={pathname} />
      </div>
    </>
  );
}
