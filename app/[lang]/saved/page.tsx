import { Bookmark } from "lucide-react";

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bookmark size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Saved</h1>
        </div>
        <p className="text-muted-foreground text-sm">Your bookmarked snippets</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Bookmark size={28} className="text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">Nothing saved yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Tap the bookmark icon on any snippet to save it here for later.
        </p>
      </div>
    </div>
  );
}
