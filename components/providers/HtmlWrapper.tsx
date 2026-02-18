"use client";
import { useEffect } from "react";

export function HtmlWrapper({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.add("dark");
    document.body.className = "bg-background text-foreground antialiased";
  }, [lang]);
  return null;
}
