"use client";
import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface RadioGroupContextType {
  value: string;
  onChange: (v: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextType>({ value: "", onChange: () => {} });

function RadioGroup({ children, defaultValue, className, onValueChange }: {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
  onValueChange?: (v: string) => void;
}) {
  const [value, setValue] = React.useState(defaultValue ?? "");
  return (
    <RadioGroupContext.Provider value={{
      value,
      onChange: (v) => { setValue(v); onValueChange?.(v); }
    }}>
      <div role="radiogroup" className={cn("grid gap-2", className)}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

function RadioGroupItem({ value, id, className }: { value: string; id?: string; className?: string }) {
  const ctx = React.useContext(RadioGroupContext);
  return (
    <button
      id={id}
      role="radio"
      aria-checked={ctx.value === value}
      onClick={() => ctx.onChange(value)}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-slate-300 dark:border-slate-600 text-blue-600 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        ctx.value === value ? "bg-blue-600 border-blue-600" : "bg-white dark:bg-slate-950",
        className
      )}
    />
  );
}

export { RadioGroup, RadioGroupItem };
