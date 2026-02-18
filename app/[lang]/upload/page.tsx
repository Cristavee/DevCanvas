"use client";
import { useState } from "react";
import { Code2, Tag, Globe, Lock, Upload, Check, ChevronDown, Sparkles } from "lucide-react";

const LANGUAGES = ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'CSS', 'HTML', 'Java', 'C++', 'C#', 'Swift', 'Kotlin', 'Ruby', 'PHP', 'Shell'];

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3B82F6', JavaScript: '#F59E0B', Python: '#10B981',
  Rust: '#F97316', Go: '#06B6D4', CSS: '#EC4899', HTML: '#EF4444',
};

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('TypeScript');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'Public' | 'Private'>('Public');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Snippet shared!</h2>
        <p className="text-muted-foreground text-sm mb-6">Your code snippet has been published to the community.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => { setSubmitted(false); setTitle(''); setCode(''); setDescription(''); setTags(''); }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Share Another
          </button>
          <a href="./" className="px-4 py-2 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Browse Feed
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Share Code</h1>
        </div>
        <p className="text-muted-foreground text-sm">Share your snippet with the developer community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-sm font-semibold text-foreground mb-3">Title *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Give your snippet a descriptive title..."
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-sm font-semibold text-foreground mb-3">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Explain what this snippet does, when to use it..."
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-primary/30 focus:border-primary/50 transition-all resize-none"
          />
        </div>

        {/* Language */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-sm font-semibold text-foreground mb-3">Language *</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangDropdown(s => !s)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm text-foreground hover:border-primary/40 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: LANG_COLORS[language] ?? '#64748B' }} />
                {language}
              </div>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
            {showLangDropdown && (
              <div className="absolute z-20 w-full mt-1 bg-popover border border-border rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                {LANGUAGES.map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => { setLanguage(l); setShowLangDropdown(false); }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-muted transition-colors ${language === l ? 'bg-primary/8 text-primary font-medium' : 'text-foreground'}`}
                  >
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
          <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-white/30 font-mono ml-2">{language.toLowerCase()} snippet</span>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="// Paste your code here..."
            required
            rows={14}
            className="w-full px-4 py-3 bg-[#0d1117] text-[#e6edf3] text-xs font-mono placeholder:text-[#484f58] outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Tags */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Tag size={14} /> Tags
          </label>
          <input
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="react, hooks, performance (comma separated)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Visibility */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-sm font-semibold text-foreground mb-3">Visibility</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: 'Public', icon: Globe, label: 'Public', desc: 'Visible to everyone' },
              { value: 'Private', icon: Lock, label: 'Private', desc: 'Only you can see' },
            ] as const).map(({ value, icon: Icon, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setVisibility(value)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                  visibility === value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30 hover:bg-muted/50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${visibility === value ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Icon size={14} />
                </div>
                <div>
                  <div className={`text-sm font-medium ${visibility === value ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !title || !code}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 shadow-sm text-sm"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload size={16} />
              Publish Snippet
            </>
          )}
        </button>

      </form>
    </div>
  );
}
