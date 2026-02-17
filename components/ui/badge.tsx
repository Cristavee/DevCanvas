import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const variantStyles: Record<string, string> = {
  default: "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 hover:bg-slate-800",
  secondary: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-200",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
