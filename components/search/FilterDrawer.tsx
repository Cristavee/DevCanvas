"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

const FILTER_LANGS = ["TypeScript", "JavaScript", "Python", "Rust", "Go", "CSS", "Java", "Kotlin"];

export const FilterDrawer = ({ dict }: { dict: any }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");
  const currentLang = searchParams.get("langTag") || "";

  const applyFilter = (langTag?: string, newSort?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (langTag !== undefined) {
      if (langTag) params.set("langTag", langTag);
      else params.delete("langTag");
    }
    if (newSort) params.set("sort", newSort);
    router.push(pathname + "?" + params.toString());
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-11 gap-2 rounded-xl border-slate-200 dark:border-slate-700 whitespace-nowrap">
          <SlidersHorizontal size={16} />
          {dict.search.filters}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[360px] bg-white dark:bg-slate-950">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">{dict.search.filters}</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-8">
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400">
              {dict.search.language}
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyFilter("")}
                className={
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all " +
                  (!currentLang
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700 hover:border-blue-400")
                }
              >
                All
              </button>
              {FILTER_LANGS.map((lang) => (
                <button
                  key={lang}
                  onClick={() => applyFilter(lang)}
                  className={
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all " +
                    (currentLang === lang
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700 hover:border-blue-400")
                  }
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400">
              {dict.search.popularity}
            </h4>
            <RadioGroup
              value={sort}
              onValueChange={(v: string) => {
                setSort(v);
                applyFilter(undefined, v);
              }}
            >
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="latest" id="latest" />
                <Label htmlFor="latest" className="cursor-pointer">{dict.search.latest}</Label>
              </div>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="liked" id="liked" />
                <Label htmlFor="liked" className="cursor-pointer">{dict.search.mostLiked}</Label>
              </div>
            </RadioGroup>
          </div>

          <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
