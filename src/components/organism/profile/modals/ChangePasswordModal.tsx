import * as React from "react";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  X,
} from "lucide-react";
import { useChangePasswordMutation } from "@/redux/user/userApiSlice";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
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

  React.useEffect(() => {
    if (!isOpen) {
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErrorMessage(null);
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isUpdating) onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, isUpdating, onClose]);

  if (!isOpen) return null;

  const hasMinimumLength = formData.newPassword.length >= 8;
  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.newPassword === formData.confirmPassword;
  const canSubmit =
    Boolean(formData.currentPassword) &&
    hasMinimumLength &&
    passwordsMatch &&
    !isUpdating;

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setErrorMessage(null);

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();
      onClose();
    } catch (error: any) {
      setErrorMessage(
        error?.data?.error || "We couldn’t update your password. Check your current password and try again.",
      );
    }
  };

  const passwordField = (
    id: string,
    label: string,
    value: string,
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    placeholder: string,
    field: keyof typeof formData,
    autoComplete: string,
  ) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-foreground">
        {label}
      </label>
      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => updateField(field, event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={isUpdating}
          required
          className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-11 text-sm text-foreground outline-none transition placeholder:text-foreground-subtle/70 focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setVisible((previous) => !previous)}
          disabled={isUpdating}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-foreground-subtle transition hover:bg-background-hover hover:text-foreground disabled:opacity-50"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isUpdating) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        className="relative my-auto w-full max-w-md overflow-hidden rounded-3xl border border-border bg-background-card shadow-2xl shadow-black/30 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
        <header className="relative flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-7">
          <div className="flex items-start gap-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand">Account security</p>
              <h2 id="change-password-title" className="mt-1 text-lg font-extrabold tracking-tight text-foreground">Change password</h2>
              <p className="mt-1 text-xs leading-5 text-foreground-subtle">Choose a new password to keep your account secure.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            aria-label="Close dialog"
            className="rounded-xl p-2 text-foreground-subtle transition hover:bg-background-hover hover:text-foreground disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="relative space-y-4 px-6 py-5 sm:px-7 sm:py-6">
          {errorMessage && <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-3 text-xs leading-5 text-rose-600 dark:text-rose-300"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{errorMessage}</div>}

          {passwordField("current-password", "Current password", formData.currentPassword, showCurrent, setShowCurrent, "Enter your current password", "currentPassword", "current-password")}
          {passwordField("new-password", "New password", formData.newPassword, showNew, setShowNew, "At least 8 characters", "newPassword", "new-password")}
          {passwordField("confirm-password", "Confirm new password", formData.confirmPassword, showConfirm, setShowConfirm, "Enter the new password again", "confirmPassword", "new-password")}

          <div className="rounded-2xl border border-border bg-background-hover/50 p-3.5">
            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-foreground-subtle">Password checks</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[{ label: "At least 8 characters", met: hasMinimumLength }, { label: "Passwords match", met: passwordsMatch }].map(({ label, met }) => <div key={label} className={`flex items-center gap-2 text-[10px] font-medium ${met ? "text-emerald-600 dark:text-emerald-400" : "text-foreground-subtle"}`}><span className={`grid h-4 w-4 place-items-center rounded-full ${met ? "bg-emerald-500/15" : "bg-background-hover"}`}>{met && <Check className="h-3 w-3"/>}</span>{label}</div>)}
            </div>
          </div>

          <footer className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={isUpdating} className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-foreground-muted transition hover:bg-background-hover disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={!canSubmit} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-brand-foreground shadow-sm shadow-brand/20 transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-45">
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin"/> : <ShieldCheck className="h-4 w-4"/>}
              {isUpdating ? "Updating password…" : "Update password"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
