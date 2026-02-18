"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Code2, Tag, Globe, Lock, Check, ChevronDown, Sparkles, LogIn, AlertCircle, Upload } from "lucide-react";

const LANGUAGES = [
  "TypeScript","JavaScript","Python","Rust","Go","CSS","HTML",
  "Java","C++","C#","Swift","Kotlin","Ruby","PHP","Shell","SQL","Dart",
];
const LANG_COLORS: Record<string,string> = {
  TypeScript:"#3178C6",JavaScript:"#F7DF1E",Python:"#3776AB",
  Rust:"#CE4A07",Go:"#00ACD7",CSS:"#2965F1",HTML:"#E34C26",
};
const LANG_EXT: Record<string,string> = {
  TypeScript:"ts",JavaScript:"js",Python:"py",Rust:"rs",Go:"go",CSS:"css",HTML:"html",
};

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const lang   = (params?.lang as string) || "en";

  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [code,        setCode]        = useState("");
  const [language,    setLanguage]    = useState("TypeScript");
  const [tags,        setTags]        = useState("");
  const [visibility,  setVisibility]  = useState<"Public"|"Private">("Public");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [done,        setDone]        = useState(false);
  const [showLang,    setShowLang]    = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--neon)", animation: "spin .7s linear infinite" }} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border"
          style={{ borderColor: "var(--neon)", background: "var(--neon-dim)" }}>
          <LogIn size={24} style={{ color: "var(--neon)" }} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Sign in to share code</h2>
        <p className="text-sm mb-6 max-w-xs font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
          Your snippets are saved to MongoDB and visible to the whole community.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={() => router.push(`/${lang}/auth/signin?tab=signup`)}
            className="w-full py-3 rounded-xl text-sm font-bold text-black"
            style={{ background: "var(--neon)" }}>
            Create Free Account
          </button>
          <button onClick={() => router.push(`/${lang}/auth/signin`)}
            className="w-full py-3 rounded-xl text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border animate-scale-in"
          style={{ borderColor: "var(--neon)", background: "var(--neon-dim)" }}>
          <Check size={24} style={{ color: "var(--neon)" }} />
        </div>
        <h2 className="text-xl font-bold text-white mb-1">Snippet published!</h2>
        <p className="text-sm mb-1 font-mono" style={{ color: "var(--neon)" }}>Saved to MongoDB · +50 XP earned 🎉</p>
        <p className="text-xs mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
          Your snippet is live on the feed.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={() => { setDone(false); setTitle(""); setCode(""); setDescription(""); setTags(""); }}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-black"
            style={{ background: "var(--neon)" }}>
            Share Another
          </button>
          <button onClick={() => router.push(`/${lang}`)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
            Browse Feed
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, codeSnippet: code, language, tags, visibility }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to publish"); setLoading(false); return; }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const ext = LANG_EXT[language] ?? "txt";

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} style={{ color: "var(--neon)" }} />
          <h1 className="text-xl font-bold text-white">Share Code</h1>
        </div>
        <p className="text-xs font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
          Saved to MongoDB · Public by default · +50 XP on publish
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="rounded-2xl border p-4" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
          <label className="block text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required maxLength={120}
            placeholder="Give your snippet a title..."
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono text-white placeholder:text-muted-foreground outline-none transition-all"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}
            onFocus={e => e.target.style.borderColor = "var(--neon)"}
            onBlur={e => e.target.style.borderColor = "hsl(var(--border))"}
          />
        </div>

        {/* Language + visibility row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Language */}
          <div className="rounded-2xl border p-4" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
            <label className="block text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Language</label>
            <div className="relative">
              <button type="button" onClick={() => setShowLang(s => !s)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-mono text-white transition-all"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}>
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: LANG_COLORS[language] ?? "#64748B" }} />
                <span className="flex-1 text-left truncate">{language}</span>
                <ChevronDown size={12} style={{ color: "hsl(var(--muted-foreground))" }} className={showLang ? "rotate-180 transition-transform" : "transition-transform"} />
              </button>
              {showLang && (
                <div className="absolute z-20 w-full mt-1 rounded-xl border overflow-hidden shadow-xl max-h-48 overflow-y-auto"
                  style={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}>
                  {LANGUAGES.map(l => (
                    <button key={l} type="button" onClick={() => { setLanguage(l); setShowLang(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-mono transition-colors hover:bg-white/5"
                      style={language === l ? { color: "var(--neon)", background: "var(--neon-dim)" } : { color: "hsl(var(--foreground))" }}>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: LANG_COLORS[l] ?? "#64748B" }} />
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Visibility */}
          <div className="rounded-2xl border p-4" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
            <label className="block text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Visibility</label>
            <div className="grid grid-cols-2 gap-1.5">
              {([["Public", Globe], ["Private", Lock]] as const).map(([v, Icon]) => (
                <button key={v} type="button" onClick={() => setVisibility(v as any)}
                  className="flex flex-col items-center gap-1 py-2 rounded-xl border text-[10px] font-mono transition-all"
                  style={visibility === v
                    ? { borderColor: "var(--neon)", color: "var(--neon)", background: "var(--neon-dim)" }
                    : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                  <Icon size={13} />{v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Code editor */}
        <div className="code-window">
          <div className="code-titlebar">
            <span className="traffic-light tl-red"/><span className="traffic-light tl-yellow"/><span className="traffic-light tl-green"/>
            <span className="flex-1 text-center font-mono" style={{ color: "#6e7681", fontSize: 11 }}>snippet.{ext}</span>
            <span className="text-[10px] font-mono" style={{ color: "#484f58" }}>{code.split("\n").length} lines</span>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} required rows={14}
            placeholder={`// Paste your ${language} code here...`}
            className="w-full px-4 py-3.5 text-[13px] font-mono outline-none resize-y"
            style={{ background: "#0d1117", color: "#e6edf3", caretColor: "var(--neon)", minHeight: 200, lineHeight: "1.6" }}
          />
        </div>

        {/* Description */}
        <div className="rounded-2xl border p-4" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
          <label className="block text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} maxLength={500}
            placeholder="What does this snippet do?"
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-white placeholder:text-muted-foreground outline-none resize-none transition-all"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}
            onFocus={e => e.target.style.borderColor = "var(--neon)"}
            onBlur={e => e.target.style.borderColor = "hsl(var(--border))"}
          />
        </div>

        {/* Tags */}
        <div className="rounded-2xl border p-4" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
          <label className="block text-[11px] font-mono uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            <Tag size={10} />Tags
          </label>
          <input value={tags} onChange={e => setTags(e.target.value)}
            placeholder="react, hooks, performance (comma separated)"
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono text-white placeholder:text-muted-foreground outline-none transition-all"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}
            onFocus={e => e.target.style.borderColor = "var(--neon)"}
            onBlur={e => e.target.style.borderColor = "hsl(var(--border))"}
          />
          {tags.trim() && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                  style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm font-mono text-red-400"
            style={{ borderColor: "rgba(239,68,68,.3)", background: "rgba(239,68,68,.08)" }}>
            <AlertCircle size={15} className="shrink-0 mt-0.5" />{error}
          </div>
        )}

        <button type="submit" disabled={loading || !title.trim() || !code.trim()}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-black transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--neon)" }}>
          {loading
            ? <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full" style={{ animation: "spin .7s linear infinite" }} />
            : <><Upload size={15} />Publish to MongoDB</>}
        </button>
      </form>
    </div>
  );
}
