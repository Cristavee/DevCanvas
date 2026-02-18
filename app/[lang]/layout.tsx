import "../globals.css";
import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NavClient } from "@/components/layout/NavClient";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  let session = null;
  try { session = await getServerSession(authOptions); } catch {}

  return (
    <NavClient lang={params.lang} session={session}>
      {children}
    </NavClient>
  );
}
