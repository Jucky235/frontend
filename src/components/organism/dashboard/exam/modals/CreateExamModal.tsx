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
      <div className="modal-overlay">
        <div className="modal-backdrop" />

        <div className="modal-panel exam-modal-panel flex flex-col">
          <div className="modal-header">
            <h2 className="modal-title flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand" />
              Tạo đề thi mới
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="modal-close-btn cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="exam-modal-form modal-form">
            {errorMessage && (
              <div className="modal-error-banner">{errorMessage}</div>
            )}

            <div className="space-y-4">
              <h3 className="exam-modal-section-heading">Thông tin chung</h3>

              <div className="modal-field">
                <label className="exam-modal-input-label">
                  Tên đề thi <span className="exam-modal-required">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: TOEIC Official Practice Test 2026 - Test 01"
                  className="exam-modal-text-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="modal-field">
                  <label className="exam-modal-input-label">Danh mục</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="exam-modal-select"
                  >
                    <option value="TOEIC">TOEIC</option>
                    <option value="IELTS">IELTS</option>
                    <option value="GENERAL">General English</option>
                  </select>
                </div>

                <div className="modal-field">
                  <label className="exam-modal-input-label">Loại đề thi</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="exam-modal-select"
                  >
                    <option value="FULL_TEST">Full Test</option>
                    <option value="MINI_TEST">Mini Test</option>
                    <option value="PRACTICE">Luyện tập</option>
                  </select>
                </div>

                <div className="modal-field">
                  <label className="exam-modal-input-label">
                    <Clock className="exam-modal-input-label-icon w-3.5 h-3.5" />
                    Thời gian (Phút){" "}
                    <span className="exam-modal-required">*</span>
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
                    className="exam-modal-text-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="modal-field">
                  <label className="exam-modal-input-label">
                    <Award className="exam-modal-input-label-icon w-3.5 h-3.5" />
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
                    className="exam-modal-text-input"
                  />
                </div>

                <div className="modal-field">
                  <label className="exam-modal-input-label">
                    Mô tả / Ghi chú
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="VD: Đề thi thử cập nhật cấu trúc mới nhất"
                    className="exam-modal-text-input"
                  />
                </div>
              </div>
            </div>

            <hr className="modal-divider" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="exam-modal-section-heading">
                    Cấu trúc đề thi (Sections)
                  </h3>
                  <p className="exam-modal-section-subtext">
                    Chia đề thi thành các phần nhỏ (Listening Part 1, Reading
                    Part 5...)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="exam-modal-add-section-btn cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Thêm phần thi
                </button>
              </div>

              <div className="space-y-3">
                {sections.map((section, idx) => (
                  <div key={idx} className="exam-modal-section-row">
                    <span className="exam-modal-section-index">{idx + 1}</span>

                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          handleSectionChange(idx, "title", e.target.value)
                        }
                        placeholder={`Tên phần thi ${idx + 1}`}
                        className="exam-modal-section-input"
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
                        className="exam-modal-section-input"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSection(idx)}
                      className="exam-modal-section-remove-btn cursor-pointer"
                      title="Xóa phần thi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="modal-actions"
              style={{
                borderTop: "1px solid var(--color-border)",
                paddingTop: "1rem",
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                className="modal-btn-cancel cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`modal-btn-submit cursor-pointer ${
                  isSubmitting ? "is-disabled" : "is-enabled"
                }`}
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
