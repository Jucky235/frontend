import React, { useState } from "react";
import { X, Plus, Trash2, Clock, Award, FileText } from "lucide-react";
import {
  ToastContainer,
  type ToastMessage,
} from "@/components/organism/common/Toast";

export interface ExamSectionInput {
  title: string;
  partNumber: number;
  description?: string;
}

export interface CreateExamFormData {
  title: string;
  category: string;
  type: "FULL_TEST" | "MINI_TEST" | "PRACTICE";
  durationMinutes: number;
  passingScore: number;
  description?: string;
  sections: ExamSectionInput[];
}

export interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateExamFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export const CreateExamModal: React.FC<CreateExamModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("TOEIC");
  const [type, setType] = useState<"FULL_TEST" | "MINI_TEST" | "PRACTICE">(
    "FULL_TEST",
  );
  const [durationMinutes, setDurationMinutes] = useState<number | "">(120);
  const [passingScore, setPassingScore] = useState<number | "">(450);
  const [description, setDescription] = useState("");

  const [sections, setSections] = useState<ExamSectionInput[]>([
    {
      title: "Listening - Part 1",
      partNumber: 1,
      description: "",
    },
  ]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    toastType: "success" | "error" | "info" | "warning",
    toastTitle: string,
    message?: string,
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [
      ...prev,
      { id, type: toastType, title: toastTitle, message },
    ]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (!isOpen) return null;

  const handleReset = () => {
    setTitle("");
    setCategory("TOEIC");
    setType("FULL_TEST");
    setDurationMinutes(120);
    setPassingScore(450);
    setDescription("");
    setSections([
      {
        title: "Listening - Part 1",
        partNumber: 1,
        description: "",
      },
    ]);
    setErrorMessage(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleAddSection = () => {
    const nextPart = sections.length + 1;
    setSections((prev) => [
      ...prev,
      {
        title: `Part ${nextPart}`,
        partNumber: nextPart,
        description: "",
      },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length === 1) {
      addToast(
        "warning",
        "Không thể xóa",
        "Đề thi phải có ít nhất 1 phần thi (Section).",
      );
      return;
    }
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSectionChange = (
    index: number,
    field: keyof ExamSectionInput,
    value: any,
  ) => {
    setSections((prev) =>
      prev.map((sec, i) => (i === index ? { ...sec, [field]: value } : sec)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      const msg = "Vui lòng nhập tên đề thi.";
      setErrorMessage(msg);
      addToast("warning", "Thiếu thông tin", msg);
      return;
    }

    if (!durationMinutes || Number(durationMinutes) <= 0) {
      const msg = "Thời gian làm bài phải lớn hơn 0 phút.";
      setErrorMessage(msg);
      addToast("warning", "Dữ liệu không hợp lệ", msg);
      return;
    }

    if (sections.some((s) => !s.title.trim())) {
      const msg = "Tên các phần thi (Section) không được để trống.";
      setErrorMessage(msg);
      addToast("warning", "Thiếu thông tin", msg);
      return;
    }

    const payload: CreateExamFormData = {
      title: title.trim(),
      category,
      type,
      durationMinutes: Number(durationMinutes),
      passingScore: Number(passingScore) || 0,
      description: description.trim() || undefined,
      sections: sections.map((s, idx) => ({
        ...s,
        title: s.title.trim(),
        partNumber: idx + 1,
        description: s.description?.trim() || undefined,
      })),
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
      }

      addToast(
        "success",
        "Tạo đề thi thành công",
        "Đề thi mới đã được khởi tạo trong hệ thống.",
      );

      setTimeout(() => {
        handleClose();
      }, 400);
    } catch (err: any) {
      const errorText =
        err?.data?.message || err?.message || "Đã xảy ra lỗi khi tạo đề thi.";
      setErrorMessage(errorText);
      addToast("error", "Tạo đề thi thất bại", errorText);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-xl dark:bg-gray-800 flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Tạo đề thi mới
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {errorMessage && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Thông tin chung
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tên đề thi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: TOEIC Official Practice Test 2026 - Test 01"
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Danh mục
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="TOEIC">TOEIC</option>
                    <option value="IELTS">IELTS</option>
                    <option value="GENERAL">General English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Loại đề thi
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="FULL_TEST">Full Test</option>
                    <option value="MINI_TEST">Mini Test</option>
                    <option value="PRACTICE">Luyện tập</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    Thời gian (Phút) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={durationMinutes}
                    onChange={(e) =>
                      setDurationMinutes(
                        e.target.value ? Number(e.target.value) : "",
                      )
                    }
                    placeholder="120"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-gray-500" />
                    Điểm đạt (Passing Score)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={passingScore}
                    onChange={(e) =>
                      setPassingScore(
                        e.target.value ? Number(e.target.value) : "",
                      )
                    }
                    placeholder="450"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mô tả / Ghi chú
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="VD: Đề thi thử cập nhật cấu trúc mới nhất"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Cấu trúc đề thi (Sections)
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Chia đề thi thành các phần nhỏ (Listening Part 1, Reading
                    Part 5...)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  <Plus className="w-4 h-4" /> Thêm phần thi
                </button>
              </div>

              <div className="space-y-3">
                {sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                      {idx + 1}
                    </span>

                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          handleSectionChange(idx, "title", e.target.value)
                        }
                        placeholder={`Tên phần thi ${idx + 1}`}
                        className="w-full rounded-md border border-gray-300 p-2 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      />
                      <input
                        type="text"
                        value={section.description || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            idx,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Mô tả ngắn (Tùy chọn)"
                        className="w-full rounded-md border border-gray-300 p-2 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSection(idx)}
                      className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Xóa phần thi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

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
                disabled={isSubmitting}
                className="cursor-pointer flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Đang tạo..." : "Tạo đề thi"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </>
  );
};

export default CreateExamModal;
