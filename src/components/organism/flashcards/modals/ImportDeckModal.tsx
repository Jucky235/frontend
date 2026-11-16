import React, { useEffect, useRef, useState } from "react";
import { X, Upload, Info, FolderPlus, ShieldCheck, Globe } from "lucide-react";

interface ImportDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportDeck: (data: {
    name: string;
    description?: string;
    category?: "GENERAL" | "TOEIC";
    visibility?: "PRIVATE" | "PUBLIC";
    csv: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export default function ImportDeckModal({
  isOpen,
  onClose,
  onImportDeck,
  isSubmitting = false,
}: ImportDeckModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "TOEIC" as "GENERAL" | "TOEIC",
    visibility: "PRIVATE" as "PRIVATE" | "PUBLIC",
    csv: "",
  });
  const [selectedFileName, setSelectedFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        category: "TOEIC",
        visibility: "PRIVATE",
        csv: "",
      });
      setSelectedFileName("");
      setError(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setError(null);

    try {
      const text = await file.text();
      setFormData((prev) => ({ ...prev, csv: text }));
    } catch (err) {
      console.error("Failed to read CSV file:", err);
      setError("Unable to read the selected CSV file. Please try another file.");
    }
  };

  const handleVisibilityChange = (type: "PRIVATE" | "PUBLIC") => {
    setFormData((prev) => ({ ...prev, visibility: type }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("A deck name is required before importing.");
      return;
    }

    if (!formData.csv.trim()) {
      setError("Please choose a CSV file to import.");
      return;
    }

    try {
      await onImportDeck({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        visibility: formData.visibility,
        csv: formData.csv,
      });
      onClose();
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        "Failed to import deck. Please check the CSV format and try again.";

      setError(errorMessage);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />

      <div className="modal-panel flex flex-col font-inter animate-in fade-in zoom-in-95 duration-200">
        <div className="deck-modal-header">
          <div className="flex items-center space-x-2.5">
            <div className="deck-modal-header-badge">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="deck-modal-header-title">Nhập bộ thẻ từ CSV</h3>
              <p className="deck-modal-header-subtitle">
                Tạo bộ thẻ mới với tên tùy chỉnh
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="deck-modal-header-close active:scale-90 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="modal-error-banner flex items-start space-x-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="modal-field">
            <label htmlFor="deck-name" className="modal-field-label">
              Tên bộ thẻ mới
            </label>
            <input
              id="deck-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              maxLength={50}
              placeholder="e.g. TOEIC Part 5 Review Pack"
              disabled={isSubmitting}
              className="modal-input"
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="deck-description" className="modal-field-label">
              Mô tả (không bắt buộc)
            </label>
            <textarea
              id="deck-description"
              name="description"
              rows={3}
              maxLength={200}
              value={formData.description}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="modal-input resize-none"
              placeholder="Tóm tắt ngắn về bộ thẻ mới"
            />
          </div>

          <div className="modal-field">
            <label className="modal-field-label">Danh mục đích</label>
            <div className="deck-modal-readonly">
              {formData.category} Thông tin mô-đun
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-field-label">Chế độ hiển thị bộ thẻ</label>
            <div className="deck-visibility-grid">
              <button
                type="button"
                onClick={() => handleVisibilityChange("PRIVATE")}
                disabled={isSubmitting}
                className={`deck-visibility-option cursor-pointer ${
                  formData.visibility === "PRIVATE" ? "is-selected" : ""
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <ShieldCheck
                    className={`deck-visibility-icon w-4 h-4 ${
                      formData.visibility === "PRIVATE" ? "is-selected" : ""
                    }`}
                  />
                  <span className="deck-visibility-label">Riêng tư</span>
                </div>
                <p className="deck-visibility-desc">
                  Chỉ tài khoản của bạn mới thấy nội dung này.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleVisibilityChange("PUBLIC")}
                disabled={isSubmitting}
                className={`deck-visibility-option cursor-pointer ${
                  formData.visibility === "PUBLIC" ? "is-selected" : ""
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <Globe
                    className={`deck-visibility-icon w-4 h-4 ${
                      formData.visibility === "PUBLIC" ? "is-selected" : ""
                    }`}
                  />
                  <span className="deck-visibility-label">Công khai</span>
                </div>
                <p className="deck-visibility-desc">
                  Có thể chia sẻ với mọi người trên nền tảng.
                </p>
              </button>
            </div>
          </div>

          <div className="modal-field">
            <label htmlFor="csv-file-input" className="modal-field-label">
              Tệp CSV
            </label>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                id="csv-file-input"
                type="file"
                accept=".csv,text/csv"
                disabled={isSubmitting}
                className="modal-input file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700"
                onChange={handleFileChange}
              />
              {selectedFileName && (
                <div className="rounded-lg border border-border bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  Tệp đã chọn: <span className="font-medium">{selectedFileName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
            Các cột CSV cần có: <strong>frontContent, backContent, explanation</strong>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="modal-btn-cancel cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.csv.trim()}
              className={`modal-btn-submit cursor-pointer active:scale-95 flex items-center justify-center min-w-[120px] ${
                isSubmitting || !formData.name.trim() || !formData.csv.trim()
                  ? "is-disabled"
                  : "is-enabled"
              }`}
            >
              {isSubmitting ? "Importing..." : "Nhập bộ thẻ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
