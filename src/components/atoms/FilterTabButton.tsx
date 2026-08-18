import * as React from "react";

interface FilterTabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const FilterTabButton: React.FC<FilterTabButtonProps> = ({
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap capitalize ${
        isActive
          ? "bg-brand-light text-brand"
          : "text-foreground-subtle hover:bg-background-subtle-hover"
      }`}
    >
      {label.replace("-", " ")}
    </button>
  );
};

export default FilterTabButton;
