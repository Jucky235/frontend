import * as React from "react";
import { HelpCircle } from "lucide-react";
import QuestionItemCard, { type QuestionItem } from "./QuestionItemCard";

interface QuestionListProps {
  questions: QuestionItem[];
  onEdit: (question: QuestionItem) => void;
  onDelete: (id: string | number) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onEdit,
  onDelete,
}) => {
  if (questions.length === 0) {
    return (
      <div className="bg-background-card p-12 text-center rounded-2xl border border-border/80 shadow-xs space-y-3">
        <HelpCircle className="w-10 h-10 text-neutral-300 mx-auto" />
        <p className="text-base font-bold text-foreground-muted">
          No questions found
        </p>
        <p className="text-xs text-foreground-subtle max-w-sm mx-auto">
          Try adjusting your search keywords or part filter, or create a new
          question.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <QuestionItemCard
          key={q.id}
          question={q}
          index={idx}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default QuestionList;
