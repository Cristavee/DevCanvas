"use client";
import React from 'react';
import Link from 'next/link';
import { Home, Search, Plus, User, Briefcase, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUploadModal } from '@/hooks/use-upload-modal';

type NavItem = {
  icon?: LucideIcon;
  href?: string;
  label?: string;
  isFAB?: boolean;
};

export const BottomNav = ({ lang }: { lang: string }) => {
  const { onOpen } = useUploadModal();

  const navItems: NavItem[] = [
    { icon: Home, href: `/${lang}/`, label: 'Home' },
    { icon: Search, href: `/${lang}/search`, label: 'Search' },
    { isFAB: true },
    { icon: Briefcase, href: `/${lang}/portfolio`, label: 'Work' },
    { icon: User, href: `/${lang}/profile`, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 md:hidden flex items-center justify-around px-4">
      {navItems.map((item, i) => {
        if (item.isFAB) {
          return (
            <div key="fab" className="relative -top-5">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onOpen}
                className="p-4 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/40 border-4 border-white dark:border-slate-950"
              >
                <Plus size={28} />
              </motion.button>
            </div>
          );
        }

        const Icon = item.icon!;
        return (
          <Link key={item.href} href={item.href!} className="flex flex-col items-center text-slate-500 dark:text-slate-400">
            <Icon size={22} />
          </Link>
        );
      })}
    </nav>
  );
};
