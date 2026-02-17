"use client";
import React from 'react';
import Link from 'next/link';
import { Home, Search, Plus, User, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUploadModal } from '@/hooks/use-upload-modal'; // Zustand store

export const BottomNav = ({ lang }: { lang: string }) => {
  const { onOpen } = useUploadModal();

  const navItems = [
    { icon: Home, href: `/${lang}/`, label: 'Home' },
    { icon: Search, href: `/${lang}/search`, label: 'Search' },
    { icon: null, isFAB: true }, // Placeholder for the FAB
    { icon: Briefcase, href: `/${lang}/portfolio`, label: 'Work' },
    { icon: User, href: `/${lang}/profile`, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 md:hidden flex items-center justify-around px-4">
      {navItems.map((item, i) => (
        item.isFAB ? (
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
        ) : (
          <Link key={item.href} href={item.href!} className="flex flex-col items-center text-slate-500 dark:text-slate-400">
            <item.icon size={22} />
          </Link>
        )
      ))}
    </nav>
  );
};
