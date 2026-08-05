import * as React from "react";

interface QuestionOptionProps {
  optKey: string;
  optText: string;
  isSelected: boolean;
  isCorrect: boolean;
  isSubmitted: boolean;
  isSubmitting: boolean;
  onSelectOption: (optionKey: string) => void;
}

export const QuestionOption: React.FC<QuestionOptionProps> = ({
  optKey,
  optText,
  isSelected,
  isCorrect,
  isSubmitted,
  isSubmitting,
  onSelectOption,
}) => {
  let optionStyle =
    "border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300";
  let badgeStyle = "bg-neutral-100 text-neutral-600 border-neutral-300";

  if (!isSubmitted) {
    if (isSelected) {
      optionStyle = "border-[#5A67FF] bg-indigo-50/40 shadow-xs";
      badgeStyle = "bg-[#5A67FF] text-white border-[#5A67FF]";
    }
  } else {
    if (isCorrect) {
      optionStyle =
        "border-emerald-500 bg-emerald-50/30 text-emerald-900 shadow-xs";
      badgeStyle = "bg-emerald-500 text-white border-emerald-500";
    } else if (isSelected && !isCorrect) {
      optionStyle = "border-rose-400 bg-rose-50/30 text-rose-900";
      badgeStyle = "bg-rose-500 text-white border-rose-500";
    } else {
      optionStyle = "border-neutral-200 bg-white opacity-60";
    }
  }

  return (
    <button
      type="button"
      onClick={() => onSelectOption(optKey)}
      disabled={isSubmitting}
      className={`border rounded-xl p-3.5 flex items-center space-x-3 text-left transition-all font-medium text-sm text-neutral-700 select-none ${
        !isSubmitted && !isSubmitting
          ? "cursor-pointer active:scale-[0.99]"
          : "cursor-default"
      } ${optionStyle}`}
    >
      <span
        className={`w-6 h-6 text-xs font-bold border rounded-lg flex items-center justify-center shrink-0 tracking-tight transition-colors ${badgeStyle}`}
      >
        {optKey}
      </span>
      <span className="leading-tight">{optText}</span>
    </button>
  );
};
