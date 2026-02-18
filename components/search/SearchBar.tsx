"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { useTransition, useState } from "react";

export function SearchBar({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1">
      <SearchIcon
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        size={18}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      )}
    </form>
  );
}
