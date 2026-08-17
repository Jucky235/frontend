import * as React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
}: ConfirmModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: "bg-status-danger-icon-bg text-status-danger",
      buttonBg:
        "bg-status-danger hover:bg-status-danger-hover focus:ring-status-danger",
    },
    warning: {
      iconBg: "bg-status-warning-icon-bg text-status-warning",
      buttonBg:
        "bg-status-warning hover:bg-status-warning-hover focus:ring-status-warning",
    },
    info: {
      iconBg: "bg-status-info-icon-bg text-status-info",
      buttonBg:
        "bg-status-info hover:bg-status-info-hover focus:ring-status-info",
    },
  }[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={!isLoading ? onClose : undefined}
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-background-card rounded-2xl shadow-xl border border-border p-6 z-10 animate-in zoom-in-95 duration-200">
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 text-foreground-subtle hover:text-foreground rounded-lg hover:bg-background-hover transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-4">
          {/* Icon Badge */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${variantStyles.iconBg}`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>

          {/* Text Content */}
          <div className="flex-1 pr-4">
            <h3 className="text-base font-extrabold text-foreground tracking-tight">
              {title}
            </h3>
            <div className="text-xs text-foreground-subtle font-medium mt-1.5 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground-muted hover:bg-background-subtle-hover transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-2 disabled:opacity-50 ${variantStyles.buttonBg}`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
