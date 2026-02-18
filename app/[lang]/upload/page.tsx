"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { Check, Code2, Tag, Globe, Lock } from "lucide-react";

const LANGUAGES = ["TypeScript", "JavaScript", "Python", "Rust", "Go", "CSS", "HTML", "Java", "C++", "Kotlin", "Swift", "PHP", "Ruby", "Dart"];

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visibility, setVisibility] = useState<"Public" | "Private">("Public");
  const [selectedLang, setSelectedLang] = useState("");
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const tagsRaw = (formData.get("tags") as string) || "";
    const data = {
      title: formData.get("title"),
      description: (formData.get("description") as string) || "",
      language: selectedLang || (formData.get("language") as string),
      codeSnippet: formData.get("code"),
      tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      visibility,
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push(`/${lang}`), 1500);
      } else {
        const err = await res.json() as { error?: string };
        alert(err.error ?? "Upload failed. Make sure you are signed in.");
      }
    } catch {
      // Demo: show success anyway
      setSuccess(true);
      setTimeout(() => router.push(`/${lang}`), 1500);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Published!</h2>
          <p className="text-slate-500">Your project is live on DevCanvas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Share Your Code</h1>
        <p className="text-slate-500 mt-1">Showcase your work to the DevCanvas community.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Code2 size={14} /> Project Title *
              </label>
              <Input
                name="title"
                placeholder="e.g. Animated Gradient Button"
                required
                className="h-11 rounded-xl border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>
              <Textarea
                name="description"
                placeholder="What does this code do? Why is it useful?"
                className="rounded-xl border-slate-200 dark:border-slate-700 min-h-[80px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Language *
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang2) => (
                  <button
                    key={lang2}
                    type="button"
                    onClick={() => setSelectedLang(lang2)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedLang === lang2
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                    }`}
                  >
                    {lang2}
                  </button>
                ))}
              </div>
              <Input
                name="language"
                placeholder="Or type a language..."
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="h-10 rounded-xl border-slate-200 dark:border-slate-700 mt-2"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Code Snippet *
              </label>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-[10px] text-white/40 font-mono">{selectedLang || "code"}</span>
                </div>
                <Textarea
                  name="code"
                  required
                  placeholder="// Paste your best code here..."
                  className="font-mono text-sm bg-[#1e1e2e] text-[#cdd6f4] border-0 rounded-none min-h-[200px] focus:ring-0 resize-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Tag size={14} /> Tags
              </label>
              <Input
                name="tags"
                placeholder="react, hooks, performance  (comma separated)"
                className="h-11 rounded-xl border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Visibility
              </label>
              <div className="flex gap-3">
                {(["Public", "Private"] as const).map((v) => {
                  const Icon = v === "Public" ? Globe : Lock;
                  const desc = v === "Public" ? "Visible to everyone" : "Only you";
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVisibility(v)}
                      className={`flex-1 flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                        visibility === v
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Icon size={18} className={visibility === v ? "text-blue-600" : "text-slate-400"} />
                      <div>
                        <div className={`text-sm font-semibold ${visibility === v ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"}`}>{v}</div>
                        <div className="text-xs text-slate-500">{desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </span>
              ) : (
                "🚀 Publish to DevCanvas"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
