import "../globals.css";
import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Shell } from "@/components/layout/Shell";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  let session = null;
  try { session = await getServerSession(authOptions); } catch {}

  return <Shell lang={params.lang} session={session}>{children}</Shell>;
}
