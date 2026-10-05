import * as React from "react";
import { Search, Filter } from "lucide-react";

interface ForumFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: "latest" | "popular";
  onSortChange: (sort: "latest" | "popular") => void;
}

export const ForumFilterBar: React.FC<ForumFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-background-card border border-border/80 p-3 rounded-2xl shadow-xs">
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-foreground-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search discussions or tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-background-hover border border-transparent rounded-xl text-xs font-medium text-foreground placeholder:text-foreground-subtle focus:outline-none focus:bg-background-card focus:border-primary transition-all"
        />
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        <Filter className="w-3.5 h-3.5 text-foreground-subtle" />
        <div className="bg-background-hover p-1 rounded-xl flex items-center space-x-1">
          <button
            onClick={() => onSortChange("latest")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              sortBy === "latest"
                ? "bg-background-card text-primary shadow-xs border border-border"
                : "text-foreground-subtle hover:text-foreground"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => onSortChange("popular")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              sortBy === "popular"
                ? "bg-background-card text-primary shadow-xs border border-border"
                : "text-foreground-subtle hover:text-foreground"
            }`}
          >
            Top
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumFilterBar;
