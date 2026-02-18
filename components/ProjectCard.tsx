"use client";
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { lucario } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Heart, Code2, User2, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProjectCardProps {
  project: {
    title: string;
    codeSnippet: string;
    language: string;
    author: { name: string; avatar?: string };
    likes: string[];
    tags: string[];
  };
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
      {/* Code Preview Area */}
      <div className="relative h-48 overflow-hidden bg-[#2b3e50] border-b border-slate-200 dark:border-slate-800">
        <div className="absolute top-3 left-4 flex gap-1.5 z-10">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        
        <div className="text-[11px] pt-10 px-4 opacity-80 group-hover:opacity-100 transition-opacity">
          <SyntaxHighlighter
            language={project.language.toLowerCase()}
            style={lucario}
            customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
          >
            {project.codeSnippet.length > 150 
              ? `${project.codeSnippet.substring(0, 150)}...` 
              : project.codeSnippet}
          </SyntaxHighlighter>
        </div>
        
        {/* Glassmorphism Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <ExternalLink className="text-white w-8 h-8" />
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 line-clamp-1">
            {project.title}
          </h3>
          <Badge variant="secondary" className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-none">
            {project.language}
          </Badge>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs text-slate-500 dark:text-slate-400">#{tag}</span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-5 py-4 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <User2 size={14} className="text-slate-500" />
          </div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {project.author.name}
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
          <Heart size={18} />
          <span className="text-xs font-semibold">{project.likes.length}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
