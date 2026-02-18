import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextType {
  value: string;
  onChange: (v: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextType>({ value: "", onChange: () => {} });

function RadioGroup({
  children,
  value,
  defaultValue,
  className,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  className?: string;
  onValueChange?: (v: string) => void;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const controlled = value !== undefined;
  const currentValue = controlled ? value : internalValue;

  const handleChange = (v: string) => {
    if (!controlled) setInternalValue(v);
    onValueChange?.(v);
  };

  return (
    <RadioGroupContext.Provider value={{ value: currentValue, onChange: handleChange }}>
      <div role="radiogroup" className={cn("grid gap-2", className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

function RadioGroupItem({ value, id, className }: { value: string; id?: string; className?: string }) {
  const ctx = React.useContext(RadioGroupContext);
  return (
    <button
      id={id}
      type="button"
      role="radio"
      aria-checked={ctx.value === value}
      onClick={() => ctx.onChange(value)}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-slate-300 dark:border-slate-600 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        ctx.value === value ? "bg-blue-600 border-blue-600" : "bg-white dark:bg-slate-950",
        className
      )}
    />
  );
}

export { RadioGroup, RadioGroupItem };
