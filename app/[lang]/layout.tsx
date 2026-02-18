import "../globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import { Home, Star, Plus, Search, User } from "lucide-react";

export default function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  const base = `/${params.lang}`;

  return (
    <html lang={params.lang}>
      <body className="bg-background text-foreground antialiased">
        <div className="min-h-screen flex flex-col max-w-screen-xl mx-auto">
          {/* TOP NAV */}
          <header className="flex items-center justify-between px-4 py-3 border-b backdrop-blur-md bg-background/80 sticky top-0 z-50">
            <Link href={base} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">DC</span>
              </div>
              <span className="font-bold tracking-tight text-lg">DevCanvas</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href={`${base}/search`}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm hover:bg-slate-200 transition-colors"
              >
                <Search size={14} />
                Search projects...
              </Link>
              <Link
                href={`${base}/upload`}
                className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus size={14} />
                Upload
              </Link>
              <Link
                href={`${base}/profile`}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <User size={16} className="text-slate-500" />
              </Link>
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 overflow-y-auto px-4 py-6 pb-28">
            {children}
          </main>

          {/* BOTTOM NAV (mobile) */}
          <nav className="fixed bottom-0 left-0 right-0 border-t bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-50 md:hidden">
            <div className="relative grid grid-cols-5 text-center text-xs py-2 px-4 max-w-screen-xl mx-auto h-16 items-end">
              <Link href={base} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-blue-600 transition-colors pb-1">
                <Home size={20} />
                <span className="text-[10px] font-medium">Home</span>
              </Link>
              <Link href={`${base}/following`} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-blue-600 transition-colors pb-1">
                <Star size={20} />
                <span className="text-[10px] font-medium">Following</span>
              </Link>

              {/* FLOATING UPLOAD BUTTON */}
              <div className="flex items-center justify-center">
                <Link
                  href={`${base}/upload`}
                  className="absolute -top-5 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border-4 border-white dark:border-slate-950 hover:scale-105 transition-transform"
                >
                  <Plus size={24} />
                </Link>
              </div>

              <Link href={`${base}/search`} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-blue-600 transition-colors pb-1">
                <Search size={20} />
                <span className="text-[10px] font-medium">Search</span>
              </Link>
              <Link href={`${base}/profile`} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-blue-600 transition-colors pb-1">
                <User size={20} />
                <span className="text-[10px] font-medium">Profile</span>
              </Link>
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
