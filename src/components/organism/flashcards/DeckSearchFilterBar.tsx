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
    <div className="deck-filter-bar">
      <div className="relative w-full md:max-w-md">
        <Search className="deck-filter-search-icon w-4 h-4" />
        <input
          type="text"
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="deck-filter-search-input"
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
