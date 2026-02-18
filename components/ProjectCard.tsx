"use client";
import React, { useState } from "react";
import { Heart, Copy, Check, MessageSquare, Bookmark, Share2, ExternalLink } from "lucide-react";

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
}

const LANG_COLORS: Record<string, { bg: string; dot: string; label: string }> = {
  TypeScript: { bg: 'bg-blue-500', dot: '#3B82F6', label: 'TS' },
  JavaScript: { bg: 'bg-yellow-400', dot: '#FACC15', label: 'JS' },
  Python: { bg: 'bg-emerald-500', dot: '#10B981', label: 'PY' },
  Rust: { bg: 'bg-orange-500', dot: '#F97316', label: 'RS' },
  Go: { bg: 'bg-cyan-500', dot: '#06B6D4', label: 'GO' },
  CSS: { bg: 'bg-pink-500', dot: '#EC4899', label: 'CSS' },
  HTML: { bg: 'bg-red-500', dot: '#EF4444', label: 'HTML' },
  Java: { bg: 'bg-red-700', dot: '#B91C1C', label: 'JAVA' },
};

export const ProjectCard = ({ project }: { project: Project }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState((project.likes ?? []).length);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const code = project.codeSnippet ?? "// No preview available";
  const language = project.language ?? "JavaScript";
  const tags = project.tags ?? [];
  const author = project.author ?? { name: "Unknown" };
  const lang = LANG_COLORS[language] ?? { bg: 'bg-slate-500', dot: '#64748B', label: '?' };
  const lines = code.split("\n").slice(0, 9);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => { setLikeCount((c) => prev ? c - 1 : c + 1); return !prev; });
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer">

      {/* CODE PREVIEW */}
      <div className="relative h-48 overflow-hidden bg-[#0d1117] flex-shrink-0">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#161b22] border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors" />
          <span className="ml-3 text-[10px] text-white/25 font-mono tracking-wider">{language.toLowerCase()}</span>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: lang.dot }} />
            <span className="text-[10px] font-mono text-white/30">{lang.label}</span>
          </div>
        </div>

        <div className="px-4 py-3 overflow-hidden h-full">
          <pre className="text-[10.5px] font-mono leading-[1.6] text-[#e6edf3]">
            {lines.map((line: string, i: number) => (
              <div key={i} className="flex gap-3">
                <span className="text-[#484f58] select-none w-4 text-right flex-shrink-0 tabular-nums">{i + 1}</span>
                <span className="text-[#e6edf3] opacity-85 truncate">{line || ' '}</span>
              </div>
            ))}
          </pre>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-[2px]">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors border border-white/15"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors border border-white/15">
            <ExternalLink size={13} />
            View
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 flex-1">
            {project.title ?? "Untitled Project"}
          </h3>
          <span className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-md text-white ${lang.bg}`}>
            {lang.label}
          </span>
        </div>

        {project.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {project.description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] text-primary bg-primary/8 hover:bg-primary/15 px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[9px] font-bold shrink-0">
              {(author.name ?? "?")[0].toUpperCase()}
            </div>
            <span className="text-xs text-muted-foreground font-medium truncate max-w-20">
              {author.name ?? "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <MessageSquare size={13} />
              <span>{project.comments ?? 0}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSaved(s => !s); }}
              className={`transition-colors ${saved ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
            >
              <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
              <span className="text-xs font-semibold">{likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
