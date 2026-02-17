"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const FilterDrawer = ({ dict }: { dict: any }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl border-slate-200 dark:border-slate-800">
          <SlidersHorizontal size={18} />
          {dict.search.filters}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white dark:bg-slate-950">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">{dict.search.filters}</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-8">
          {/* Language Filter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400">
              {dict.search.language}
            </h4>
            <div className="flex flex-wrap gap-2">
              {['TypeScript', 'Python', 'Rust', 'Go'].map((lang) => (
                <Button key={lang} variant="secondary" size="sm" className="rounded-full">
                  {lang}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400">
              {dict.search.popularity}
            </h4>
            <RadioGroup defaultValue="latest">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="latest" id="latest" />
                <Label htmlFor="latest">{dict.search.latest}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="liked" id="liked" />
                <Label htmlFor="liked">{dict.search.mostLiked}</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
