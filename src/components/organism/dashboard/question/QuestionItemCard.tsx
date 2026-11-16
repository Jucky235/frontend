import * as React from "react";
import {
  Edit2,
  Trash2,
  Volume2,
  Image as ImageIcon,
  Check,
  Loader2,
} from "lucide-react";
import OptionBadge from "@/components/atoms/OptionBadge";
import { type Question } from "@/redux/question/questionApiSlice"; // Adjust import path if needed

interface QuestionItemCardProps {
  question: Question;
  index: number;
  onEdit: (question: Question) => void;
  onDelete: (id: string | number) => void;
  isDeleting?: boolean;
}

export type QuestionItem = Question;

export const QuestionItemCard: React.FC<QuestionItemCardProps> = ({
  question,
  index,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  return (
    <div className="bg-background-card border border-border/80 rounded-2xl p-6 shadow-xs hover:border-border transition-all space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          {question.partNumber && (
            <span className="text-xs font-extrabold text-brand bg-pink-50 px-3 py-1 rounded-lg shrink-0">
              Phần {question.partNumber}
            </span>
          )}
          {typeof question.category === "string" && question.category && (
            <span className="text-xs font-bold text-foreground-muted bg-background-hover px-2.5 py-1 rounded-lg shrink-0">
              {question.category}
            </span>
          )}
          <span className="text-xs font-bold text-foreground-subtle font-mono">
            ID: {question.id}
          </span>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(question)}
            disabled={isDeleting}
            className="p-2 text-foreground-subtle hover:text-brand hover:bg-pink-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            title="Chỉnh sửa câu hỏi"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(question.id)}
            disabled={isDeleting}
            className="p-2 text-foreground-subtle hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            title="Xóa câu hỏi"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <span className="text-sm font-black text-pink-500 bg-pink-50 w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5">
          {index + 1}
        </span>
        <h3 className="text-base font-bold text-foreground leading-snug">
          {question.content}
        </h3>
      </div>

      {(question.audioPath || question.imagePath) && (
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap gap-2">
            {question.audioPath && (
              <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Đã đính kèm âm thanh</span>
              </span>
            )}
            {question.imagePath && (
              <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Đã đính kèm hình ảnh</span>
              </span>
            )}
          </div>

          {question.imagePath && (
            <div className="max-w-xs overflow-hidden rounded-xl border border-border bg-background">
              <img
                src={question.imagePath}
                alt="Phương tiện câu hỏi"
                className="w-full h-auto max-h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}

          {question.audioPath && (
            <audio controls className="w-full max-w-md h-8 rounded-lg">
              <source src={question.audioPath} />
              Trình duyệt của bạn không hỗ trợ phát âm thanh.
            </audio>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
        {Object.entries(question.options || {}).map(([key, optText]) => {
          const isCorrect = question.right_answer === key;
          return (
            <div
              key={key}
              className={`flex items-center space-x-3 p-3 rounded-xl text-xs font-semibold border transition-all ${
                isCorrect
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                  : "bg-background border-border/80 text-foreground-muted"
              }`}
            >
              <OptionBadge label={key} isCorrect={isCorrect} />
              <span className="flex-1 truncate">{optText}</span>
              {isCorrect && (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {question.explanation && (
        <div className="p-3 bg-blue-50/60 text-blue-900 text-xs rounded-xl border border-blue-100 font-medium space-y-1">
          <span className="font-extrabold uppercase text-[10px] tracking-wider text-blue-700 block">
            Giải thích
          </span>
          <p className="leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionItemCard;
