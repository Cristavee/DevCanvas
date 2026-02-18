"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Code2, Eye, EyeOff, ArrowRight, Github, Terminal } from "lucide-react";

export default function SignInPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lang   = (params?.lang as string) || "en";
  const initTab = searchParams?.get("tab") === "signup" ? "signup" : "signin";

  const [tab,     setTab]     = useState<"signin" | "signup">(initTab);
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [password,setPassword]= useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (tab === "signin") {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) setError("Invalid email or password");
      else router.push(`/${lang}`);
    } else {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); }
      else {
        await signIn("credentials", { email, password, redirect: false });
        router.push(`/${lang}`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col lg:flex-row"
      style={{ background: "hsl(var(--background))" }}>

      {/* ── Left decorative panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] shrink-0 flex-col relative overflow-hidden"
        style={{ background: "hsl(var(--sidebar-bg))", borderRight: "1px solid hsl(var(--sidebar-border))" }}>
        {/* Grid pattern bg */}
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        {/* Neon blob */}
        <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--neon-glow) 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 left-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--blue-dim) 0%, transparent 70%)" }} />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
              style={{ borderColor: "var(--neon)", background: "var(--neon-dim)" }}>
              <Code2 size={16} style={{ color: "var(--neon)" }} />
            </div>
            <div>
              <div className="font-bold text-lg text-white tracking-tight leading-none">DevCanvas</div>
              <div className="text-[10px] font-mono" style={{ color: "var(--neon)" }}>v3.0.0</div>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <div className="text-[11px] font-mono uppercase tracking-widest mb-3" style={{ color: "var(--neon)" }}>
              Developer OS
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
              Code together,<br />
              <span className="font-mono" style={{ color: "var(--neon)" }}>grow together.</span>
            </h1>
            <p className="text-sm xl:text-base" style={{ color: "hsl(var(--muted-foreground))" }}>
              The platform built for developers who take their craft seriously.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {[
              { icon: "⚡", text: "Share & discover code snippets" },
              { icon: "🏆", text: "Earn XP · climb the leaderboard" },
              { icon: "💬", text: "DMs, groups & language channels" },
              { icon: "🦀", text: "Join language communities" },
              { icon: "⚙️", text: "Run code in-browser (Beta)" },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Code preview */}
          <div className="mt-auto">
            <div className="code-window text-[11px]">
              <div className="code-titlebar">
                <span className="traffic-light tl-red"/><span className="traffic-light tl-yellow"/><span className="traffic-light tl-green"/>
                <span className="ml-2 font-mono" style={{ color: "#4DABFF", fontSize: 10 }}>devcanvas.ts</span>
              </div>
              <div className="px-4 py-3 font-mono text-[11px] leading-5" style={{ background: "#0d1117" }}>
                <div><span style={{ color: "#79c0ff" }}>const</span><span style={{ color: "#e6edf3" }}> life = </span><span style={{ color: "#79c0ff" }}>await</span><span style={{ color: "#e6edf3" }}> join(</span></div>
                <div><span style={{ color: "#e6edf3" }}>  </span><span style={{ color: "#a5d6ff" }}>"DevCanvas"</span><span style={{ color: "#e6edf3" }}>,</span></div>
                <div><span style={{ color: "#e6edf3" }}>  {"{ xp: "}</span><span style={{ color: "#79c0ff" }}>Infinity</span><span style={{ color: "#e6edf3" }}>{" }"}</span></div>
                <div><span style={{ color: "#e6edf3" }}>);</span></div>
                <div className="mt-1"><span style={{ color: "#8b949e" }}>{"// 🚀 ready to ship"}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center border"
              style={{ borderColor: "var(--neon)", background: "var(--neon-dim)" }}>
              <Code2 size={15} style={{ color: "var(--neon)" }} />
            </div>
            <div className="font-bold text-lg text-white">DevCanvas</div>
          </div>

          {/* Tab switcher */}
          <div className="mb-2">
            <h2 className="text-xl font-bold text-white mb-1">
              {tab === "signin" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
              {tab === "signin" ? "Sign in to your account" : "Free forever · no credit card"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex gap-1 p-1 rounded-xl my-5 border"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}>
            {(["signin","signup"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                className="flex-1 py-2 rounded-lg text-sm font-medium font-mono transition-all"
                style={tab === t
                  ? { background: "hsl(var(--card))", color: "var(--neon)" }
                  : { color: "hsl(var(--muted-foreground))" }}>
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* GitHub */}
          <button onClick={() => signIn("github", { callbackUrl: `/${lang}` })}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border text-sm font-medium transition-colors hover:bg-white/5 mb-5"
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
            <Github size={16} />Continue with GitHub
          </button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: "hsl(var(--border))" }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[11px] font-mono" style={{ background: "hsl(var(--background))", color: "hsl(var(--muted-foreground))" }}>
                or with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === "signup" && (
              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Full name
                </label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name" required minLength={2}
                  className="w-full px-3.5 py-3 rounded-xl border text-sm font-mono text-white placeholder:text-muted-foreground outline-none transition-all"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                  onFocus={e => e.target.style.borderColor = "var(--neon)"}
                  onBlur={e => e.target.style.borderColor = "hsl(var(--border))"}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full px-3.5 py-3 rounded-xl border text-sm font-mono text-white placeholder:text-muted-foreground outline-none transition-all"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                onFocus={e => e.target.style.borderColor = "var(--neon)"}
                onBlur={e => e.target.style.borderColor = "hsl(var(--border))"}
              />
            </div>
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required minLength={6}
                  className="w-full px-3.5 py-3 pr-11 rounded-xl border text-sm font-mono text-white placeholder:text-muted-foreground outline-none transition-all"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                  onFocus={e => e.target.style.borderColor = "var(--neon)"}
                  onBlur={e => e.target.style.borderColor = "hsl(var(--border))"}
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                  style={{ color: "hsl(var(--muted-foreground))" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3.5 py-2.5 rounded-xl border text-sm font-mono text-red-400"
                style={{ borderColor: "rgba(239,68,68,.3)", background: "rgba(239,68,68,.08)" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 disabled:opacity-50 mt-1"
              style={{ background: "var(--neon)" }}>
              {loading
                ? <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full" style={{ animation: "spin .7s linear infinite" }} />
                : <>{tab === "signin" ? "Sign In" : "Create Account"}<ArrowRight size={15} /></>}
            </button>
          </form>

          {tab === "signup" && (
            <div className="mt-4 px-4 py-3 rounded-xl text-[11px] font-mono border"
              style={{ borderColor: "var(--neon)", color: "var(--neon)", background: "var(--neon-dim)" }}>
              +50 XP on sign-up · Start at Bronze · No credit card
            </div>
          )}

          <p className="text-center text-[11px] font-mono mt-5" style={{ color: "hsl(var(--muted-foreground))" }}>
            By continuing you agree to our{" "}
            <a href="#" className="underline hover:text-white">Terms</a> &{" "}
            <a href="#" className="underline hover:text-white">Privacy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
