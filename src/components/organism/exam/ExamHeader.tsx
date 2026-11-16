// ExamHeader.tsx
import * as React from "react";
import { ChevronLeft } from "lucide-react";

interface ExamHeaderProps {
  examName: string;
  onBack: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({ examName, onBack }) => (
  <div className="flex items-center justify-between">
    <button
      onClick={onBack}
      type="button"
      className="flex items-center space-x-1 text-sm font-semibold text-foreground-subtle hover:text-pink-600 transition-colors cursor-pointer"
    >
      <ChevronLeft className="w-4 h-4" />
      <span>Quay lại</span>
    </button>
    <span className="text-xs font-bold uppercase tracking-widest text-foreground-subtle bg-border/60 px-3 py-1 rounded-md">
      {examName}
    </span>
  </div>
);
