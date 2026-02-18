"use client";
import React, { useState } from "react";
import { Heart, Copy, Check, MessageSquare, Bookmark, ExternalLink, Star, Play, Terminal } from "lucide-react";

interface Author { name?: string; }
interface Project {
  _id?: string | { toString(): string };
  title?: string;
  description?: string;
  codeSnippet?: string;
  language?: string;
  tags?: string[];
  likes?: string[];
  author?: Author;
  comments?: number;
  stars?: number;
}

const LANG_META: Record<string, { color: string; label: string; accent: string }> = {
  TypeScript: { color: '#3178C6', label: 'TS', accent: 'rgba(49,120,198,0.12)' },
  JavaScript: { color: '#F7DF1E', label: 'JS', accent: 'rgba(247,223,30,0.1)' },
  Python: { color: '#3776AB', label: 'PY', accent: 'rgba(55,118,171,0.12)' },
  Rust: { color: '#CE4A07', label: 'RS', accent: 'rgba(206,74,7,0.12)' },
  Go: { color: '#00ACD7', label: 'GO', accent: 'rgba(0,172,215,0.12)' },
  CSS: { color: '#2965F1', label: 'CSS', accent: 'rgba(41,101,241,0.1)' },
  HTML: { color: '#E34C26', label: 'HTML', accent: 'rgba(227,76,38,0.1)' },
  Java: { color: '#ED8B00', label: 'JAVA', accent: 'rgba(237,139,0,0.1)' },
};

export const ProjectCardV3 = ({ project }: { project: Project }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState((project.likes ?? []).length);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);

  const code = project.codeSnippet ?? "// No preview available";
  const language = project.language ?? "JavaScript";
  const tags = project.tags ?? [];
  const author = project.author ?? { name: "Unknown" };
  const meta = LANG_META[language] ?? { color: '#64748B', label: '?', accent: 'rgba(100,116,139,0.1)' };
  const lines = code.split("\n").slice(0, 8);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-[var(--neon-green)]/30 hover:shadow-[0_0_0_1px_var(--neon-green-dim),0_8px_24px_rgba(0,0,0,0.3)] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* CODE PREVIEW */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: '160px', background: '#0d1117' }}>
        {/* Window bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ background: '#161b22', borderColor: '#30363d' }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F57' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FEBC2E' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28C840' }} />
          <span className="ml-2 text-[10px] font-mono" style={{ color: '#6e7681' }}>
            {project.title?.toLowerCase().replace(/\s+/g, '-')}.{language === 'TypeScript' ? 'ts' : language === 'Python' ? 'py' : language === 'Rust' ? 'rs' : language === 'Go' ? 'go' : language.toLowerCase()}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: meta.accent, color: meta.color, border: `1px solid ${meta.color}30` }}>
              {meta.label}
            </span>
          </div>
        </div>

        {/* Code */}
        <div className="px-3 py-2.5 overflow-hidden h-full">
          <pre className="text-[10px] font-mono leading-relaxed" style={{ color: '#e6edf3' }}>
            {lines.map((line: string, i: number) => (
              <div key={i} className="flex gap-3">
                <span className="select-none w-4 text-right flex-shrink-0 tabular-nums" style={{ color: '#3d4550' }}>{i + 1}</span>
                <span className="truncate opacity-90">{line || ' '}</span>
              </div>
            ))}
          </pre>
        </div>

        {/* Overlay on hover */}
        <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(2px)' }}>
          <button onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-[var(--neon-green)]/40 transition-colors"
            style={{ background: 'var(--neon-green-dim)', color: 'var(--neon-green)' }}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-[var(--electric-blue)]/40 transition-colors"
            style={{ background: 'var(--electric-blue-dim)', color: 'var(--electric-blue)' }}>
            <Play size={11} />
            Run
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-1 flex-1">
            {project.title ?? "Untitled"}
          </h3>
        </div>

        {project.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2.5 leading-relaxed">
            {project.description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-2.5">
            {tags.slice(0, 3).map((tag: string) => (
              <span key={tag}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground hover:border-[var(--neon-green)]/50 hover:text-[color:var(--neon-green)] transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-black"
              style={{ background: 'linear-gradient(135deg, var(--neon-green), var(--electric-blue))' }}>
              {(author.name ?? "?")[0].toUpperCase()}
            </div>
            <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[80px]">
              {author.name ?? "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {project.stars && (
              <div className="flex items-center gap-1 text-muted-foreground text-[11px] font-mono">
                <Star size={11} />
                <span>{project.stars}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground text-[11px] font-mono">
              <MessageSquare size={11} />
              <span>{project.comments ?? 0}</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setSaved(s => !s); }}
              className={`transition-colors ${saved ? '' : 'text-muted-foreground hover:text-foreground'}`}
              style={saved ? { color: 'var(--electric-blue)' } : {}}>
              <Bookmark size={13} fill={saved ? 'currentColor' : 'none'} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setLiked(prev => { setLikeCount(c => prev ? c - 1 : c + 1); return !prev; }); }}
              className={`flex items-center gap-1 text-[11px] font-mono transition-colors ${liked ? '' : 'text-muted-foreground hover:text-red-400'}`}
              style={liked ? { color: '#FF6B6B' } : {}}>
              <Heart size={12} fill={liked ? 'currentColor' : 'none'} />
              <span>{likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
