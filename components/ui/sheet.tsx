import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetContextType {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType>({ open: false, setOpen: () => {} });

function Sheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>;
}

function SheetTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { setOpen } = React.useContext(SheetContext);
  const child = React.Children.only(children) as React.ReactElement;
  return React.cloneElement(child, { onClick: () => setOpen(true) });
}

function SheetContent({ children, side = "right", className }: {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
}) {
  const { open, setOpen } = React.useContext(SheetContext);
  if (!open) return null;

  const sideStyles = {
    right: "right-0 top-0 h-full",
    left: "left-0 top-0 h-full",
    top: "top-0 left-0 w-full",
    bottom: "bottom-0 left-0 w-full",
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className={cn(
        "fixed z-50 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-6 shadow-xl",
        sideStyles[side],
        className
      )}>
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}

function SheetHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col space-y-2 mb-4", className)}>{children}</div>;
}

function SheetTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-semibold text-slate-900 dark:text-slate-100", className)}>{children}</h2>;
}

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle };
