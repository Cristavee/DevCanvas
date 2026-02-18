"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Code2, Tag, Globe, Lock, Upload, Check, ChevronDown, Sparkles, LogIn, AlertCircle } from "lucide-react";

const LANGUAGES = [
  'TypeScript','JavaScript','Python','Rust','Go','CSS','HTML',
  'Java','C++','C#','Swift','Kotlin','Ruby','PHP','Shell','SQL','Dart','Elixir'
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6', JavaScript: '#F7DF1E', Python: '#3776AB',
  Rust: '#CE4A07', Go: '#00ACD7', CSS: '#2965F1', HTML: '#E34C26',
};

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('TypeScript');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'Public' | 'Private'>('Public');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [savedId, setSavedId] = useState('');

  // Redirect to sign in if not authed
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-[var(--neon-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-16 h-16 rounded-2xl border border-[var(--neon-green)]/40 flex items-center justify-center mx-auto mb-6"
          style={{ background: "var(--neon-green-dim)" }}>
          <LogIn size={28} style={{ color: "var(--neon-green)" }} />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Sign in to share code</h2>
        <p className="text-muted-foreground text-sm mb-8 font-mono">
          You need an account to publish snippets to DevCanvas.
          <br />Your snippets are saved to the database and visible to the community.
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={() => router.push(`/${lang}/auth/signin?tab=signup`)}
            className="w-full py-3 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90 font-mono"
            style={{ background: "var(--neon-green)" }}>
            Create Account (Free)
          </button>
          <button
            onClick={() => router.push(`/${lang}/auth/signin`)}
            className="w-full py-3 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          codeSnippet: code.trim(),
          language,
          tags,
          visibility,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to publish snippet. Please try again.');
        setLoading(false);
        return;
      }

      const project = await res.json();
      setSavedId(project._id || '');
      setSubmitted(true);
    } catch (err) {
      setError('Network error. Please check your connection.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="w-16 h-16 rounded-2xl border border-[var(--neon-green)]/40 flex items-center justify-center mx-auto mb-6 animate-scale-in"
          style={{ background: "var(--neon-green-dim)" }}>
          <Check size={28} style={{ color: "var(--neon-green)" }} />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Snippet published!</h2>
        <p className="text-muted-foreground text-sm mb-1 font-mono">
          Saved to database · +50 XP earned 🎉
        </p>
        <p className="text-muted-foreground text-xs mb-8">Your code snippet is now live on DevCanvas.</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => { setSubmitted(false); setTitle(''); setCode(''); setDescription(''); setTags(''); setSavedId(''); }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-black hover:opacity-90 transition-all font-mono"
            style={{ background: "var(--neon-green)" }}>
            Share Another
          </button>
          <button onClick={() => router.push(`/${lang}`)}
            className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Browse Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} style={{ color: "var(--neon-green)" }} />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Share Code</h1>
        </div>
        <p className="text-muted-foreground text-sm font-mono">
          Snippet will be saved to database · publicly visible · +50 XP on publish
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-xs font-mono font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Title *</label>
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Give your snippet a descriptive title..."
            required maxLength={100}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon-green)]/50 focus:ring-1 ring-[var(--neon-green)]/20 transition-all font-mono"
          />
          <div className="text-[10px] text-muted-foreground font-mono mt-1.5 text-right">{title.length}/100</div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-xs font-mono font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Explain what this snippet does, when to use it..."
            rows={3} maxLength={500}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon-green)]/50 transition-all resize-none" />
        </div>

        {/* Language */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-xs font-mono font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Language *</label>
          <div className="relative">
            <button type="button" onClick={() => setShowLangDropdown(s => !s)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm text-foreground hover:border-[var(--neon-green)]/30 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: LANG_COLORS[language] ?? '#64748B' }} />
                <span className="font-mono">{language}</span>
              </div>
              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showLangDropdown && (
              <div className="absolute z-20 w-full mt-1 rounded-xl border border-border shadow-xl overflow-hidden max-h-52 overflow-y-auto"
                style={{ background: "hsl(var(--popover))" }}>
                {LANGUAGES.map(l => (
                  <button key={l} type="button"
                    onClick={() => { setLanguage(l); setShowLangDropdown(false); }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm hover:bg-muted transition-colors font-mono ${language === l ? 'text-[color:var(--neon-green)] bg-[var(--neon-green-dim)]' : 'text-foreground'}`}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: LANG_COLORS[l] ?? '#64748B' }} />
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#161b22", borderBottom: "1px solid #30363d" }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F57' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FEBC2E' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28C840' }} />
            </div>
            <span className="text-xs font-mono" style={{ color: '#6e7681' }}>
              snippet.{language === 'TypeScript' ? 'ts' : language === 'Python' ? 'py' : language === 'Rust' ? 'rs' : language === 'Go' ? 'go' : 'js'}
            </span>
            <div className="ml-auto text-[10px] font-mono" style={{ color: '#6e7681' }}>
              {code.split('\n').length} lines
            </div>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)}
            placeholder="// Paste your code here..."
            required rows={14}
            className="w-full px-4 py-3.5 text-[13px] font-mono placeholder:text-[#484f58] outline-none resize-none leading-relaxed"
            style={{ background: "#0d1117", color: "#e6edf3", caretColor: "var(--neon-green)" }} />
        </div>

        {/* Tags */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-xs font-mono font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Tag size={11} /> Tags
          </label>
          <input value={tags} onChange={e => setTags(e.target.value)}
            placeholder="react, hooks, performance (comma separated)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon-green)]/50 transition-all" />
          {tags && (
            <div className="flex gap-1.5 flex-wrap mt-2">
              {tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border text-muted-foreground">#{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Visibility */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-xs font-mono font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Visibility</label>
          <div className="grid grid-cols-2 gap-2.5">
            {([
              { value: 'Public', icon: Globe, label: 'Public', desc: 'Visible to everyone' },
              { value: 'Private', icon: Lock, label: 'Private', desc: 'Only you can see' },
            ] as const).map(({ value, icon: Icon, label, desc }) => (
              <button key={value} type="button" onClick={() => setVisibility(value)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${visibility === value ? 'border-[var(--neon-green)] bg-[var(--neon-green-dim)]' : 'border-border hover:border-border hover:bg-muted/50'}`}>
                <Icon size={16} style={visibility === value ? { color: 'var(--neon-green)' } : { color: 'hsl(var(--muted-foreground))' }} />
                <div>
                  <div className={`text-sm font-semibold font-mono ${visibility === value ? '' : 'text-muted-foreground'}`}
                    style={visibility === value ? { color: 'var(--neon-green)' } : {}}>
                    {label}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !title.trim() || !code.trim()}
          className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 text-sm font-mono text-black"
          style={{ background: "var(--neon-green)" }}>
          {loading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload size={16} />
              Publish Snippet · Save to DB
            </>
          )}
        </button>
      </form>
    </div>
  );
}
