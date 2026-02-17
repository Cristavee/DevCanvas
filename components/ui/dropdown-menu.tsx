"use client";
import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType>({
  open: false,
  setOpen: () => {},
});

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { setOpen, open } = React.useContext(DropdownMenuContext);
  const child = React.Children.only(children) as React.ReactElement;
  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      setOpen(!open);
    },
  });
}

function DropdownMenuContent({
  children,
  align = "start",
  className,
}: {
  children: React.ReactNode;
  align?: "start" | "end" | "center";
  className?: string;
}) {
  const { open, setOpen } = React.useContext(DropdownMenuContext);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [setOpen]);

  if (!open) return null;

  const alignClass = align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-1 shadow-md",
        alignClass,
        className
      )}
    >
      {children}
    </div>
  );
}

function DropdownMenuItem({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = React.useContext(DropdownMenuContext);
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  );
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
