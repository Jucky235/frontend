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
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by exam name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-indigo-500 transition-all"
        />
      </div>

      <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto">
        <div className="flex items-center space-x-1.5 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs text-neutral-600">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="bg-transparent font-semibold focus:outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-1 bg-neutral-100 p-1 rounded-xl">
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
