import * as React from "react";
import { Search, Filter } from "lucide-react";

interface QuestionFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedPartFilter: number | "ALL";
  onPartFilterChange: (value: number | "ALL") => void;
}

export const QuestionFilterBar: React.FC<QuestionFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedPartFilter,
  onPartFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-background-card p-4 rounded-2xl border border-border/80 shadow-xs">
      {/* Search Input */}
      <div className="relative w-full sm:w-96">
        <Search className="w-4 h-4 text-foreground-subtle absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search question content or options..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm font-medium text-foreground placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
        />
      </div>

      {/* Part Filter */}
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        <Filter className="w-4 h-4 text-foreground-subtle shrink-0" />
        <span className="text-xs font-bold text-foreground-subtle uppercase tracking-wider shrink-0">
          Part:
        </span>
        <select
          value={selectedPartFilter}
          onChange={(e) =>
            onPartFilterChange(
              e.target.value === "ALL" ? "ALL" : Number(e.target.value),
            )
          }
          className="w-full sm:w-auto px-3 py-2 bg-background border border-border rounded-xl text-sm font-bold text-foreground-muted focus:outline-none focus:border-brand cursor-pointer"
        >
          <option value="ALL">All Parts</option>
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <option key={num} value={num}>
              Part {num}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default QuestionFilterBar;
