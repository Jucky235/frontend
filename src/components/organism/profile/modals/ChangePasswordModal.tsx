import * as React from "react";
import { X, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { useChangePasswordMutation } from "@/redux/user/userApiSlice";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  // Hook up your RTK Query mutation hook
  const [changePassword, { isLoading: isUpdating }] =
    useChangePasswordMutation();

  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const [formData, setFormData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Clear states when dialog resets or closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const requirements = {
    length: formData.newPassword.length >= 8,
    match:
      formData.newPassword === formData.confirmPassword &&
      formData.confirmPassword !== "",
  };

  const canSubmit =
    requirements.length &&
    requirements.match &&
    formData.currentPassword !== "" &&
    !isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setErrorMessage(null);

    try {
      // Execute query using unwrap to process errors within the catch container
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      onClose();
    } catch (error: any) {
      setErrorMessage(
        error?.data?.error || "Failed to update security credentials.",
      );
    }
  };

  return (
    <div className="modal-overlay selection:bg-brand-light">
      {/* 1. Blur Overlay Backdrop */}
      <div
        className="modal-backdrop"
        onClick={!isUpdating ? onClose : undefined}
      />

      {/* 2. Central Dialog Box Wrapper */}
      <div className="modal-panel font-inter animate-in fade-in zoom-in-95 duration-200">
        {/* Header Block Panel */}
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <div className="modal-icon-badge">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="modal-title">Update Security Credentials</h2>
              <p className="modal-subtitle">
                Revoke current runtime tokens and provision a new access pass.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="modal-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <hr className="modal-divider" />

        {/* 3. High-Density Parameter Input Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Runtime Error Message Notification Panel */}
          {errorMessage && (
            <div className="modal-error-banner">{errorMessage}</div>
          )}

          {/* Field: Current Token Verification */}
          <div className="modal-field">
            <label className="modal-field-label">Current Password</label>
            <div className="modal-input-wrapper">
              <input
                type={showCurrent ? "text" : "password"}
                disabled={isUpdating}
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                placeholder="Enter current password ..."
                className="modal-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                disabled={isUpdating}
                className="modal-input-toggle-btn"
              >
                {showCurrent ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Field: New Target Key Generation */}
          <div className="modal-field">
            <label className="modal-field-label">New Password</label>
            <div className="modal-input-wrapper">
              <input
                type={showNew ? "text" : "password"}
                disabled={isUpdating}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                placeholder="Minimum 8 characters..."
                className="modal-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                disabled={isUpdating}
                className="modal-input-toggle-btn"
              >
                {showNew ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Field: Confirm Target Key Generation */}
          <div className="modal-field">
            <label className="modal-field-label">Confirm New Password</label>
            <div className="modal-input-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                disabled={isUpdating}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Verify matching value..."
                className="modal-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                disabled={isUpdating}
                className="modal-input-toggle-btn"
              >
                {showConfirm ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* 4. Real-time Array Condition Trackers */}
          <div className="modal-requirements-panel">
            <div className="modal-requirement">
              <span
                className={`modal-requirement-dot ${requirements.length ? "is-met" : ""}`}
              />
              <span
                className={`modal-requirement-text ${requirements.length ? "is-met" : ""}`}
              >
                Must contain at least 8 characters
              </span>
            </div>
            <div className="modal-requirement">
              <span
                className={`modal-requirement-dot ${requirements.match ? "is-met" : ""}`}
              />
              <span
                className={`modal-requirement-text ${requirements.match ? "is-met" : ""}`}
              >
                New credentials match perfectly
              </span>
            </div>
          </div>

          {/* 5. Execution Controls Baseline Row */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="modal-btn-cancel active:scale-97"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`modal-btn-submit active:scale-97 ${
                canSubmit ? "is-enabled" : "is-disabled"
              }`}
            >
              {isUpdating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              <span>{isUpdating ? "Committing..." : "Commit Change"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
