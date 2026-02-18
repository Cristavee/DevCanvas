import type { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthSessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "DevCanvas v3 — Developer OS",
  description: "Ship code. Build communities. Run experiments. The OS for serious developers.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
};

/* Next.js 14 viewport export — this is the CORRECT way to set viewport meta */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,    // prevents iOS auto-zoom breaking layout
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#070918",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try { session = await getServerSession(authOptions); } catch {}

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AuthSessionProvider session={session}>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
