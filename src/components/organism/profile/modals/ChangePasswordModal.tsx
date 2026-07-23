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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 selection:bg-indigo-100">
      {/* 1. Blur Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={!isUpdating ? onClose : undefined}
      />

      {/* 2. Central Dialog Box Wrapper */}
      <div className="bg-white w-full max-w-md rounded-2xl border border-neutral-200 shadow-2xl relative z-10 overflow-hidden font-inter animate-in fade-in zoom-in-95 duration-200">
        {/* Header Block Panel */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-700">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-neutral-800 tracking-tight">
                Update Security Credentials
              </h2>
              <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                Revoke current runtime tokens and provision a new access pass.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="w-7 h-7 inline-flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <hr className="border-neutral-100" />

        {/* 3. High-Density Parameter Input Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Runtime Error Message Notification Panel */}
          {errorMessage && (
            <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Field: Current Token Verification */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                disabled={isUpdating}
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                placeholder="Enter current password ..."
                className="w-full pl-3 pr-10 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF] transition-all disabled:bg-neutral-50 disabled:text-neutral-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                disabled={isUpdating}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
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
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                disabled={isUpdating}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                placeholder="Minimum 8 characters..."
                className="w-full pl-3 pr-10 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF] transition-all disabled:bg-neutral-50 disabled:text-neutral-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                disabled={isUpdating}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
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
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                disabled={isUpdating}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Verify matching value..."
                className="w-full pl-3 pr-10 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF] transition-all disabled:bg-neutral-50 disabled:text-neutral-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                disabled={isUpdating}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
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
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60 space-y-2 text-[11px] font-semibold">
            <div className="flex items-center space-x-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${requirements.length ? "bg-emerald-500" : "bg-neutral-300"}`}
              />
              <span
                className={
                  requirements.length
                    ? "text-emerald-700 font-bold"
                    : "text-neutral-400"
                }
              >
                Must contain at least 8 characters
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${requirements.match ? "bg-emerald-500" : "bg-neutral-300"}`}
              />
              <span
                className={
                  requirements.match
                    ? "text-emerald-700 font-bold"
                    : "text-neutral-400"
                }
              >
                New credentials match perfectly
              </span>
            </div>
          </div>

          {/* 5. Execution Controls Baseline Row */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-97 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`font-bold text-xs px-4 py-2.5 rounded-xl tracking-wide shadow-md transition-all flex items-center space-x-1.5 cursor-pointer active:scale-97 ${
                canSubmit
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed shadow-none"
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
