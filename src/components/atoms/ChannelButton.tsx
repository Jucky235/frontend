import * as React from "react";
import { Hash, ChevronRight } from "lucide-react";

export interface ChannelButtonProps {
  id: string;
  name: string;
  activeIndicator?: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ChannelButton: React.FC<ChannelButtonProps> = ({
  id,
  name,
  activeIndicator,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full px-6 py-2 flex items-center justify-between transition-colors relative cursor-pointer ${
        isSelected
          ? "bg-brand-light text-brand"
          : "hover:bg-background-hover text-foreground-muted"
      }`}
    >
      <div className="flex items-center space-x-3">
        {activeIndicator && (
          <span className="absolute left-2 w-1 h-3.5 bg-status-active rounded-full" />
        )}
        <div
          className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-brand text-white"
              : "bg-background-hover text-foreground-subtle"
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
        </div>
        <span className="font-extrabold text-sm">#{name}</span>
      </div>

      {isSelected && <ChevronRight className="w-4 h-4 text-brand" />}
    </button>
  );
};

export default ChannelButton;
