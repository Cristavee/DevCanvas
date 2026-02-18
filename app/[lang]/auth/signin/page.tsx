"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Github, Code2, Eye, EyeOff, ArrowRight, CheckCircle2, Terminal, Zap } from "lucide-react";

export default function SignInPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = (params?.lang as string) || "en";
  const defaultTab = searchParams?.get("tab") === "signup" ? "signup" : "signin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (tab === "signin") {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) setError("Invalid email or password.");
      else router.push("/" + lang);
    } else {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        await signIn("credentials", { email, password, redirect: false });
        router.push("/" + lang);
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed.");
      }
    }
    setLoading(false);
  };

  const FEATURES = [
    { icon: "⚡", text: "Share & discover code snippets" },
    { icon: "🏆", text: "Earn XP and climb the leaderboard" },
    { icon: "💬", text: "Private DMs, groups & channels" },
    { icon: "🦀", text: "Join language communities" },
    { icon: "⚙️", text: "Run code in the browser (soon)" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(160deg, hsl(222, 47%, 8%) 0%, hsl(210, 60%, 10%) 100%)" }}>
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--neon-green-dim) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--electric-blue-dim) 0%, transparent 70%)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl border flex items-center justify-center"
              style={{ borderColor: "var(--neon-green)", background: "var(--neon-green-dim)" }}>
              <Code2 className="w-5 h-5" style={{ color: "var(--neon-green)" }} />
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-tight">DevCanvas</span>
              <div className="text-[10px] font-mono" style={{ color: "var(--neon-green)" }}>v3.0.0</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "var(--neon-green)" }}>Developer OS</div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Code together,<br />
              <span style={{ color: "var(--neon-green)" }}>grow together.</span>
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed text-sm font-mono">
              The platform built for developers who take their craft seriously.
            </p>
            <div className="space-y-3">
              {FEATURES.map(f => (
                <div key={f.text} className="flex items-center gap-3">
                  <span>{f.icon}</span>
                  <span className="text-white/70 text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom code snippet preview */}
        <div className="relative z-10">
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "hsl(222, 28%, 20%)" }}>
            <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: "#161b22" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#FF5F57" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "#FEBC2E" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "#28C840" }} />
              <span className="text-[10px] font-mono ml-2" style={{ color: "#4DABFF" }}>devcanvas.ts</span>
            </div>
            <pre className="px-4 py-3 text-[11px] font-mono leading-relaxed" style={{ background: "#0d1117" }}>
              <span style={{ color: "#79c0ff" }}>const</span>
              <span style={{ color: "#e6edf3" }}> life </span>
              <span style={{ color: "#ff7b72" }}>=</span>
              <span style={{ color: "#79c0ff" }}> await</span>
              <span style={{ color: "#e6edf3" }}> join(</span>{"\n"}
              <span style={{ color: "#e6edf3" }}>  </span>
              <span style={{ color: "#a5d6ff" }}>"DevCanvas"</span>
              <span style={{ color: "#e6edf3" }}>,</span>{"\n"}
              <span style={{ color: "#e6edf3" }}>  {"{ xp: "}</span>
              <span style={{ color: "#79c0ff" }}>Infinity</span>
              <span style={{ color: "#e6edf3" }}>{" }"}</span>{"\n"}
              <span style={{ color: "#e6edf3" }}>);</span>{"\n"}
              <span style={{ color: "#8b949e" }}>// 🚀 ready to ship</span>
            </pre>
          </div>
          <div className="text-white/25 text-xs font-mono mt-4">© 2025 DevCanvas · Built for devs</div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
            <div className="w-8 h-8 rounded-lg border flex items-center justify-center"
              style={{ borderColor: "var(--neon-green)", background: "var(--neon-green-dim)" }}>
              <Code2 className="w-4 h-4" style={{ color: "var(--neon-green)" }} />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">DevCanvas</span>
            <span className="text-[10px] font-mono" style={{ color: "var(--neon-green)" }}>v3</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {tab === "signin" ? "Welcome back" : "Join DevCanvas"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-mono">
              {tab === "signin" ? "Sign in to your developer account" : "Create your free account · earn 50 XP"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl border border-border bg-muted/50 mb-6">
            {(["signin", "signup"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium font-mono transition-all ${tab === t ? "text-[color:var(--neon-green)] bg-card" : "text-muted-foreground hover:text-foreground"}`}>
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* GitHub */}
          <button onClick={() => signIn("github", { callbackUrl: `/${lang}` })}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted hover:border-[var(--neon-green)]/30 transition-all mb-4 font-mono">
            <Github size={16} />
            Continue with GitHub
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-[11px] text-muted-foreground font-mono">or email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === "signup" && (
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Full name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name" required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon-green)]/50 focus:ring-1 ring-[var(--neon-green)]/20 transition-all" />
              </div>
            )}
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon-green)]/50 focus:ring-1 ring-[var(--neon-green)]/20 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required minLength={6}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-border bg-card text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon-green)]/50 focus:ring-1 ring-[var(--neon-green)]/20 transition-all" />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2.5 rounded-xl font-mono">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-60 mt-1 text-sm font-mono text-black"
              style={{ background: "var(--neon-green)" }}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {tab === "signin" ? "Sign In" : "Create Account · Free"}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {tab === "signup" && (
            <div className="mt-4 p-3 rounded-xl border border-[var(--neon-green)]/20 text-[11px] text-muted-foreground font-mono"
              style={{ background: "var(--neon-green-dim)" }}>
              <span style={{ color: "var(--neon-green)" }}>+50 XP</span> awarded on account creation · No credit card needed
            </div>
          )}

          <p className="text-center text-[11px] text-muted-foreground mt-5 font-mono">
            By continuing, you agree to our{" "}
            <a href="#" className="hover:underline" style={{ color: "var(--neon-green)" }}>Terms</a> and{" "}
            <a href="#" className="hover:underline" style={{ color: "var(--neon-green)" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
