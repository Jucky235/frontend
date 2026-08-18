import React, { useState, useEffect } from "react";
import { X, FolderPlus, Info, ShieldCheck, Globe } from "lucide-react";

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDeck: (data: {
    name: string;
    description: string;
    category: "TOEIC";
    visibility: "PRIVATE" | "PUBLIC";
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export default function CreateDeckModal({
  isOpen,
  onClose,
  onCreateDeck,
  isSubmitting = false,
}: CreateDeckModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "TOEIC" as const,
    visibility: "PRIVATE" as "PRIVATE" | "PUBLIC",
  });

  const [error, setError] = useState<string | null>(null);

  // Reset form state whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        category: "TOEIC",
        visibility: "PRIVATE",
      });
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisibilityChange = (type: "PRIVATE" | "PUBLIC") => {
    setFormData((prev) => ({ ...prev, visibility: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Deck name is required.");
      return;
    }

    try {
      await onCreateDeck(formData);
      onClose();
    } catch (err: any) {
      // Robust error parsing for RTK Query & generic API errors
      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        "Failed to create new deck. Please try again.";

      setError(errorMessage);
    }
  };

  return (
    <div className="modal-overlay">
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose} />

      {/* Modal Container */}
      <div className="modal-panel flex flex-col font-inter animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="deck-modal-header">
          <div className="flex items-center space-x-2.5">
            <div className="deck-modal-header-badge">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="deck-modal-header-title">Create Study Deck</h3>
              <p className="deck-modal-header-subtitle">
                Flashcard Workspace Management
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="modal-error-banner flex items-start space-x-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="modal-field">
            <label htmlFor="name" className="modal-field-label">
              Deck Title
            </label>
            <input
              type="text"
              id="name"
              name="name"
              maxLength={50}
              placeholder="e.g. TOEIC Essential Vocab - Part 5"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="modal-input"
              required
            />
          </div>

          {/* Description Input */}
          <div className="modal-field">
            <label htmlFor="description" className="modal-field-label">
              Short Summary Description
            </label>
            <textarea
              id="description"
              name="description"
              maxLength={200}
              rows={3}
              placeholder="Provide a context outline summarizing this flashcard learning track."
              value={formData.description}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="modal-input resize-none"
            />
          </div>

          {/* Category Scope (Read-only) */}
          <div className="modal-field">
            <label className="modal-field-label">Target Category Scope</label>
            <div className="deck-modal-readonly">
              {formData.category} Module Baseline
            </div>
          </div>

          {/* Visibility Controls */}
          <div className="modal-field">
            <label className="modal-field-label">Deck Visibility Privacy</label>
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
                  <span className="deck-visibility-label">Private</span>
                </div>
                <p className="deck-visibility-desc">
                  Only accessible inside your individual workspace context.
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
                  <span className="deck-visibility-label">Public Shared</span>
                </div>
                <p className="deck-visibility-desc">
                  Discoverable and shareable across all system account domains.
                </p>
              </button>
            </div>
          </div>

          <hr className="modal-divider" />

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="modal-btn-cancel cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className={`modal-btn-submit cursor-pointer active:scale-95 flex items-center justify-center min-w-[90px] ${
                isSubmitting || !formData.name.trim()
                  ? "is-disabled"
                  : "is-enabled"
              }`}
            >
              {isSubmitting ? "Creating..." : "Build Deck"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
