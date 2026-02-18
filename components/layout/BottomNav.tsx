"use client";
import Link from 'next/link';
import { Home, Search, Plus, User, Star } from 'lucide-react';

export const BottomNav = ({ lang }: { lang: string }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 md:hidden flex items-center justify-around px-4">
      <Link href={`/${lang}`} className="flex flex-col items-center text-slate-500 dark:text-slate-400 gap-0.5">
        <Home size={20} />
        <span className="text-[10px]">Home</span>
      </Link>
      <Link href={`/${lang}/following`} className="flex flex-col items-center text-slate-500 dark:text-slate-400 gap-0.5">
        <Star size={20} />
        <span className="text-[10px]">Following</span>
      </Link>
      <div className="relative -top-4">
        <Link
          href={`/${lang}/upload`}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-full shadow-lg shadow-blue-500/40 border-4 border-white dark:border-slate-950"
        >
          <Plus size={26} />
        </Link>
      </div>
      <Link href={`/${lang}/search`} className="flex flex-col items-center text-slate-500 dark:text-slate-400 gap-0.5">
        <Search size={20} />
        <span className="text-[10px]">Search</span>
      </Link>
      <Link href={`/${lang}/profile`} className="flex flex-col items-center text-slate-500 dark:text-slate-400 gap-0.5">
        <User size={20} />
        <span className="text-[10px]">Profile</span>
      </Link>
    </nav>
  );
};
