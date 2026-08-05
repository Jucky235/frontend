import * as React from "react";
import { Search } from "lucide-react";
import FilterTabButton from "@/components/atoms/FilterTabButton";

export type DeckFilterTab = "all" | "in-progress" | "completed";

interface DeckSearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: DeckFilterTab;
  onTabChange: (tab: DeckFilterTab) => void;
}

const TABS: DeckFilterTab[] = ["all", "in-progress", "completed"];

export const DeckSearchFilterBar: React.FC<DeckSearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-indigo-500 transition-all"
        />
      </div>

      <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto">
        {TABS.map((tab) => (
          <FilterTabButton
            key={tab}
            label={tab}
            isActive={activeTab === tab}
            onClick={() => onTabChange(tab)}
          />
        ))}
      </div>
    </div>
  );
};

export default DeckSearchFilterBar;
