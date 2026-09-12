import { Search, Filter } from "lucide-react";
import FilterTabButton from "@/components/atoms/FilterTabButton";
import { type ExamStatus } from "@/redux/exam/examApiSlice";

export type FilterStatus = "ALL" | ExamStatus;

interface ExamsFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (status: FilterStatus) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  categories: string[];
}

export default function ExamsFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: ExamsFilterBarProps) {
  const statusTabs: FilterStatus[] = ["ALL", "ACTIVE", "INACTIVE", "OUTDATED"];

  return (
    <div className="deck-filter-bar">
      <div className="relative w-full md:max-w-md">
        <Search className="deck-filter-search-icon w-4 h-4" />
        <input
          type="text"
          placeholder="Search by exam name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="deck-filter-search-input"
        />
      </div>
      <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto">
        <div className="examsfilter-select-wrapper">
          <Filter className="examsfilter-select-icon w-3.5 h-3.5" />
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="examsfilter-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="examsfilter-status-tabs">
          {statusTabs.map((status) => (
            <FilterTabButton
              key={status}
              label={status.toLowerCase()}
              active={statusFilter === status}
              onClick={() => onStatusFilterChange(status)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
