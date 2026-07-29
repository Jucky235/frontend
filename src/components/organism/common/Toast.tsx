import * as React from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200/80 bg-emerald-50/30",
    error: "border-red-200/80 bg-red-50/30",
    warning: "border-amber-200/80 bg-amber-50/30",
    info: "border-indigo-200/80 bg-indigo-50/30",
  };

  return (
    <div
      className={`flex items-start space-x-3 w-80 p-4 bg-white/95 backdrop-blur-md rounded-2xl border shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${
        borders[toast.type]
      }`}
    >
      {icons[toast.type]}

      <div className="flex-1 pr-2">
        <h4 className="text-xs font-extrabold text-neutral-800 tracking-tight">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-[11px] font-medium text-neutral-500 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Container component that stays fixed in the corner
export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
