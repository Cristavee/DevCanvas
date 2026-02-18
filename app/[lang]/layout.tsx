import "../globals.css";
import Link from "next/link";
import { Home, Star, Plus, Search, User } from "lucide-react";
import { headers } from "next/headers";

// Server-side active link detection
function NavLink({
  href,
  icon: Icon,
  label,
  pathname,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  pathname: string;
}) {
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link href={href}>
      <div
        className={`flex flex-col items-center gap-0.5 transition-colors ${
          isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-slate-400 dark:text-slate-500 hover:text-slate-600"
        }`}
      >
        <Icon size={20} />
        <span className="text-[10px] font-medium">{label}</span>
      </div>
    </Link>
  );
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const base = `/${params.lang}`;
  // Read pathname from headers (set by middleware/Next internals)
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";

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
          <main className="flex-1 overflow-y-auto px-4 py-6 pb-24">
            {children}
          </main>

          {/* BOTTOM NAV (mobile) */}
          <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/90 backdrop-blur-md z-50 md:hidden">
            <div className="relative grid grid-cols-5 text-center text-xs py-2 px-4 max-w-screen-xl mx-auto">
              <NavLink href={base} icon={Home} label="Home" pathname={pathname} />
              <NavLink href={`${base}/following`} icon={Star} label="Following" pathname={pathname} />

              {/* FLOATING UPLOAD BUTTON */}
              <div className="flex items-center justify-center">
                <Link
                  href={`${base}/upload`}
                  className="absolute -top-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border-4 border-background hover:scale-105 transition-transform"
                >
                  <Plus size={24} />
                </Link>
              </div>

              <NavLink href={`${base}/search`} icon={Search} label="Search" pathname={pathname} />
              <NavLink href={`${base}/profile`} icon={User} label="Profile" pathname={pathname} />
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
