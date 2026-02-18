"use client";
import React, { useState } from "react";
import { Heart, ExternalLink, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Author {
  name?: string;
}

interface Project {
  _id?: string | { toString(): string };
  title?: string;
  description?: string;
  codeSnippet?: string;
  language?: string;
  tags?: string[];
  likes?: string[];
  author?: Author;
}

interface ProjectCardProps {
  project: Project;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-500",
  CSS: "bg-pink-500",
  HTML: "bg-red-500",
  Java: "bg-red-700",
  "C++": "bg-purple-500",
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState((project.likes ?? []).length);
  const [copied, setCopied] = useState(false);

  const code = project.codeSnippet ?? "// No preview available";
  const language = project.language ?? "JavaScript";
  const tags = project.tags ?? [];
  const author = project.author ?? { name: "Unknown" };
  const langColor = LANG_COLORS[language] ?? "bg-slate-500";
  const lines = code.split("\n").slice(0, 8);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => {
      setLikeCount((c) => prev ? c - 1 : c + 1);
      return !prev;
    });
  };

  return (
    <Card className="group overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-white dark:bg-slate-950">

      {/* CODE PREVIEW */}
      <div className="relative h-48 overflow-hidden bg-[#1e1e2e]">
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#181825] border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[10px] text-white/30 font-mono">{language.toLowerCase()}</span>
        </div>

        <div className="px-4 py-3 overflow-hidden">
          <pre className="text-[10px] font-mono leading-relaxed text-[#cdd6f4] opacity-90">
            {lines.map((line: string, i: number) => (
              <div key={i} className="flex">
                <span className="text-[#6c7086] mr-3 select-none w-4 text-right flex-shrink-0">{i + 1}</span>
                <span className="truncate">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px]">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors border border-white/20"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors border border-white/20">
            <ExternalLink size={14} />
            View
          </button>
        </div>

        <div className={`absolute top-2 right-3 w-2 h-2 rounded-full ${langColor} shadow-lg`} />
      </div>

      {/* CONTENT */}
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-bold text-base line-clamp-1 text-slate-900 dark:text-slate-50">
            {project.title ?? "Untitled Project"}
          </h3>
          <Badge
            variant="secondary"
            className="shrink-0 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-0"
          >
            {language}
          </Badge>
        </div>

        {project.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
            {project.description}
          </p>
        )}

        <div className="flex gap-1.5 flex-wrap">
          {tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">
              {(author.name ?? "?")[0].toUpperCase()}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {author.name ?? "Unknown"}
          </span>
        </div>

        <button
          onClick={handleLike}
          className={`flex items-center gap-1 transition-colors ${
            liked ? "text-red-500" : "text-slate-400 hover:text-red-500"
          }`}
        >
          <Heart size={15} fill={liked ? "currentColor" : "none"} />
          <span className="text-xs font-semibold">{likeCount}</span>
        </button>
      </CardFooter>
    </Card>
  );
};
