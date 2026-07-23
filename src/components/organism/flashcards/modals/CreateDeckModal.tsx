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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white border border-neutral-200/80 rounded-2xl shadow-xl overflow-hidden flex flex-col z-10 font-inter transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between text-white relative">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
              <FolderPlus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight">
                Create Study Deck
              </h3>
              <p className="text-[10px] text-white/80 font-medium">
                Flashcard Workspace Management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-7 h-7 bg-white/10 hover:bg-white/20 active:scale-90 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col space-y-5">
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-bold text-neutral-600 uppercase tracking-wider"
            >
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-neutral-400 disabled:bg-neutral-50"
              required
            />
          </div>

          {/* Description Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="text-xs font-bold text-neutral-600 uppercase tracking-wider"
            >
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-neutral-400 resize-none disabled:bg-neutral-50"
            />
          </div>

          {/* Category Scope (Read-only) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
              Target Category Scope
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-bold text-neutral-500 select-none">
              {formData.category} Module Baseline
            </div>
          </div>

          {/* Visibility Controls */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
              Deck Visibility Privacy
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleVisibilityChange("PRIVATE")}
                disabled={isSubmitting}
                className={`p-3 rounded-xl border flex flex-col items-start text-left cursor-pointer transition-all ${
                  formData.visibility === "PRIVATE"
                    ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                    : "border-neutral-200 bg-white hover:bg-neutral-50"
                } disabled:opacity-50`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <ShieldCheck
                    className={`w-4 h-4 ${formData.visibility === "PRIVATE" ? "text-indigo-600" : "text-neutral-400"}`}
                  />
                  <span className="text-xs font-bold text-neutral-800">
                    Private
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                  Only accessible inside your individual workspace context.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleVisibilityChange("PUBLIC")}
                disabled={isSubmitting}
                className={`p-3 rounded-xl border flex flex-col items-start text-left cursor-pointer transition-all ${
                  formData.visibility === "PUBLIC"
                    ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                    : "border-neutral-200 bg-white hover:bg-neutral-50"
                } disabled:opacity-50`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <Globe
                    className={`w-4 h-4 ${formData.visibility === "PUBLIC" ? "text-indigo-600" : "text-neutral-400"}`}
                  />
                  <span className="text-xs font-bold text-neutral-800">
                    Public Shared
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                  Discoverable and shareable across all system account domains.
                </p>
              </button>
            </div>
          </div>

          <hr className="border-neutral-200/60 pt-1" />

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center min-w-[90px]"
            >
              {isSubmitting ? "Creating..." : "Build Deck"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
