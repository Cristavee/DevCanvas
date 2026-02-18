import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "DevCanvas — Showcase your code visually",
  description: "The portfolio repository for modern developers. Share, discover, and showcase beautiful code.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
