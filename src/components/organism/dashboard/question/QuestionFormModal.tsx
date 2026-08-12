import * as React from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import {
  type Question,
  type CreateQuestionPayload,
} from "@/redux/question/questionApiSlice";

interface QuestionFormModalProps {
  isOpen: boolean;
  editingQuestion: Question | null;
  formData: CreateQuestionPayload;
  formError: string;
  isSaving: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  onFormDataChange: (updated: CreateQuestionPayload) => void;
  onClearError: () => void;
}

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  isOpen,
  editingQuestion,
  formData,
  formError,
  isSaving,
  onClose,
  onSave,
  onFormDataChange,
  onClearError,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <h2 className="text-lg font-black text-neutral-800">
            {editingQuestion ? "Edit Question" : "Create New Question"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSave} className="p-6 space-y-5">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Part Selection & Right Answer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Exam Part
              </label>
              <select
                value={formData.partNumber || 1}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    partNumber: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800 focus:outline-none focus:border-[#5A67FF]"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <option key={num} value={num}>
                    Part {num}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Correct Answer
              </label>
              <select
                value={formData.right_answer}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    right_answer: e.target.value as "A" | "B" | "C" | "D",
                  })
                }
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800 focus:outline-none focus:border-[#5A67FF]"
              >
                {(["A", "B", "C", "D"] as const).map((opt) => (
                  <option key={opt} value={opt}>
                    Option {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Content */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Question Content *
            </label>
            <textarea
              rows={3}
              placeholder="Type question prompt here..."
              value={formData.content}
              onChange={(e) => {
                onClearError();
                onFormDataChange({ ...formData, content: e.target.value });
              }}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#5A67FF]/20 focus:border-[#5A67FF]"
            />
          </div>

          {/* Options Input */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Answer Options *
            </label>

            {(["A", "B", "C", "D"] as const).map((key) => (
              <div key={key} className="flex items-center space-x-2">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    formData.right_answer === key
                      ? "bg-emerald-600 text-white"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {key}
                </span>
                <input
                  type="text"
                  placeholder={`Option ${key} text...`}
                  value={formData.options[key] || ""}
                  onChange={(e) => {
                    onClearError();
                    onFormDataChange({
                      ...formData,
                      options: {
                        ...formData.options,
                        [key]: e.target.value,
                      },
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF]"
                />
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1">
              Explanation (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Provide reason for the correct answer..."
              value={formData.explanation || ""}
              onChange={(e) =>
                onFormDataChange({ ...formData, explanation: e.target.value })
              }
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF]"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#5A67FF] hover:bg-indigo-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {editingQuestion ? "Update Question" : "Save Question"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionFormModal;
