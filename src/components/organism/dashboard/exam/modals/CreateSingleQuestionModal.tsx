import React, { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setCreateModalOpen } from "@/redux/question/questionSlice";
import {
  useCreateQuestionMutation,
  type CreateQuestionPayload,
} from "@/redux/question/questionApiSlice";
import {
  ToastContainer,
  type ToastMessage,
} from "@/components/organism/common/Toast";

// Re-export type for external components requiring form data shape
export type CreateQuestionFormData = CreateQuestionPayload;

export interface CreateSingleQuestionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (data: CreateQuestionFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export const CreateSingleQuestionModal: React.FC<
  CreateSingleQuestionModalProps
> = ({
  isOpen: propsIsOpen,
  onClose: propsOnClose,
  onSubmit,
  isSubmitting,
}) => {
  const dispatch = useAppDispatch();
  const reduxIsOpen = useAppSelector(
    (state) => state.question.isCreateModalOpen,
  );

  // Controlled locally or via Redux state
  const isOpen = propsIsOpen !== undefined ? propsIsOpen : reduxIsOpen;

  const [createQuestion, { isLoading: isMutationLoading }] =
    useCreateQuestionMutation();

  const isLoading = isSubmitting || isMutationLoading;

  // Local Form State
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("TOEIC");
  const [partNumber, setPartNumber] = useState<number | "">(1);
  const [explanation, setExplanation] = useState("");
  const [rightAnswer, setRightAnswer] = useState<"A" | "B" | "C" | "D">("A");

  const [options, setOptions] = useState<{ key: string; text: string }[]>([
    { key: "A", text: "" },
    { key: "B", text: "" },
    { key: "C", text: "" },
    { key: "D", text: "" },
  ]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Toast Notification State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message?: string,
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    if (propsOnClose) {
      propsOnClose();
    } else {
      dispatch(setCreateModalOpen(false));
    }
  };

  const handleOptionChange = (key: string, value: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.key === key ? { ...opt, text: value } : opt)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!content.trim()) {
      const msg = "Vui lòng nhập nội dung câu hỏi.";
      setErrorMessage(msg);
      addToast("warning", "Thiếu thông tin", msg);
      return;
    }

    const formattedOptions: Record<string, string> = {};
    for (const opt of options) {
      if (!opt.text.trim()) {
        const msg = `Vui lòng nhập nội dung cho đáp án ${opt.key}.`;
        setErrorMessage(msg);
        addToast("warning", "Thiếu thông tin", msg);
        return;
      }
      formattedOptions[opt.key] = opt.text.trim();
    }

    const payload: CreateQuestionFormData = {
      content: content.trim(),
      options: formattedOptions as any,
      right_answer: rightAnswer,
      category,
      partNumber: partNumber !== "" ? Number(partNumber) : undefined,
      explanation: explanation.trim() || undefined,
    };

    // 🔍 DEBUG STEP 1: KIỂM TRA PAYLOAD TRƯỚC KHI GỬI
    console.log("=== 1. PAYLOAD TO SUBMIT ===", payload);
    console.log("=== 2. IS USING PROPS.ONSUBMIT? ===", Boolean(onSubmit));

    try {
      let res: any;
      if (onSubmit) {
        console.log("--> Calling custom prop onSubmit()...");
        res = await onSubmit(payload);
        console.log("<-- Prop onSubmit finished, response:", res);
      } else {
        console.log("--> Calling RTK Query createQuestion mutation...");
        res = await createQuestion(payload).unwrap();
        console.log("<-- RTK Query mutation SUCCESS, response:", res);
      }

      // Success Toast
      addToast(
        "success",
        "Tạo câu hỏi thành công",
        "Câu hỏi mới đã được thêm vào ngân hàng câu hỏi.",
      );

      // Reset form
      setContent("");
      setExplanation("");
      setOptions([
        { key: "A", text: "" },
        { key: "B", text: "" },
        { key: "C", text: "" },
        { key: "D", text: "" },
      ]);
      setRightAnswer("A");

      setTimeout(() => {
        handleClose();
      }, 400);
    } catch (err: any) {
      // 🔍 DEBUG STEP 3: LOG LỖI CHI TIẾT TỪ BACKEND
      console.error("=== 3. CREATE QUESTION ERROR ===", err);

      const errorText =
        err?.data?.message ||
        err?.message ||
        "Đã xảy ra lỗi khi tạo câu hỏi. Vui lòng thử lại.";
      setErrorMessage(errorText);

      addToast("error", "Tạo câu hỏi thất bại", errorText);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Tạo câu hỏi mới
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <form
            onSubmit={handleSubmit}
            className="max-h-[80vh] space-y-4 overflow-y-auto p-6"
          >
            {errorMessage && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            {/* Meta Info: Category & Part Number */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Danh mục (Category)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="TOEIC">TOEIC</option>
                  <option value="IELTS">IELTS</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Part (Phần thi)
                </label>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={partNumber}
                  onChange={(e) =>
                    setPartNumber(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="VD: 1, 2, 3..."
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Question Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nội dung câu hỏi <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung câu hỏi tại đây..."
                className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Answer Options */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Các lựa chọn & Đáp án đúng{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {options.map((opt) => {
                  const isSelected = rightAnswer === opt.key;
                  return (
                    <div key={opt.key} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setRightAnswer(opt.key as "A" | "B" | "C" | "D")
                        }
                        className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border font-bold transition-colors ${
                          isSelected
                            ? "border-green-600 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                        title={
                          isSelected ? "Đáp án đúng" : "Đánh dấu là đáp án đúng"
                        }
                      >
                        {opt.key}
                      </button>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) =>
                          handleOptionChange(opt.key, e.target.value)
                        }
                        placeholder={`Nội dung lựa chọn ${opt.key}...`}
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                * Bấm vào chữ cái (A, B, C, D) để đánh dấu đáp án đúng.
              </p>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Giải thích đáp án (Tùy chọn)
              </label>
              <textarea
                rows={2}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Giải thích vì sao chọn đáp án này..."
                className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t pt-4 dark:border-gray-700">
              <button
                type="button"
                onClick={handleClose}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Đang lưu..." : "Lưu câu hỏi"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Render active Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </>
  );
};

export default CreateSingleQuestionModal;
