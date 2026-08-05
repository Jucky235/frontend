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
          ? "bg-indigo-50 text-indigo-600"
          : "text-neutral-500 hover:bg-neutral-50"
      }`}
    >
      {label.replace("-", " ")}
    </button>
  );
};

export default FilterTabButton;
