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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-neutral-200/80 p-3 rounded-2xl shadow-xs">
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search discussions or tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-neutral-100 border border-transparent rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:bg-white focus:border-[#5A67FF] transition-all"
        />
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        <Filter className="w-3.5 h-3.5 text-neutral-400" />
        <div className="bg-neutral-100 p-1 rounded-xl flex items-center space-x-1">
          <button
            onClick={() => onSortChange("latest")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              sortBy === "latest"
                ? "bg-white text-[#5A67FF] shadow-xs"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => onSortChange("popular")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              sortBy === "popular"
                ? "bg-white text-[#5A67FF] shadow-xs"
                : "text-neutral-500 hover:text-neutral-800"
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
