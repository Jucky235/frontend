import * as React from "react";

interface FilterTabButtonProps {
  label: string;
  isActive?: boolean;
  active?: boolean;
  onClick: () => void;
}

export const FilterTabButton: React.FC<FilterTabButtonProps> = ({
  label,
  isActive,
  active,
  onClick,
}) => {
  const isSelected = isActive ?? active ?? false;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`deck-filter-tab-btn ${isSelected ? "is-active" : "is-inactive"}`}
    >
      {label.replace("-", " ")}
    </button>
  );
};

export default FilterTabButton;
