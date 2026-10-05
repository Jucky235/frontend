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
      className={`deck-filter-tab-btn ${isActive ? "is-active" : "is-inactive"}`}
    >
      {label.replace("-", " ")}
    </button>
  );
};

export default FilterTabButton;
