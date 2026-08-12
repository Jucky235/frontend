import * as React from "react";

interface OptionBadgeProps {
  label: string;
  isCorrect?: boolean;
  className?: string;
}

export const OptionBadge: React.FC<OptionBadgeProps> = ({
  label,
  isCorrect = false,
  className = "",
}) => {
  return (
    <span
      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
        isCorrect
          ? "bg-emerald-600 text-white"
          : "bg-neutral-200 text-neutral-600"
      } ${className}`}
    >
      {label}
    </span>
  );
};

export default OptionBadge;
