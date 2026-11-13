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
      className={`flex w-auto shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2 transition-colors relative cursor-pointer lg:w-full lg:px-5 ${
        isSelected
          ? "bg-brand/10 text-brand"
          : "hover:bg-background-hover text-foreground-muted"
      }`}
    >
      <div className="flex items-center space-x-3">
        {activeIndicator && (
          <span className="absolute left-2 h-3.5 w-1 rounded-full bg-emerald-500" />
        )}
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors ${
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
