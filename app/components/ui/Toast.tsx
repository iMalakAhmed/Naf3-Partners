"use client";

import { useCallback, useEffect, useState } from "react";

export type ToastVariant = "success" | "error" | "info";

export type ToastMessage = {
  id: number;
  title: string;
  message?: string;
  variant: ToastVariant;
};

const styles: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-[#19BBB6]/25 bg-[#f4fbfa] text-[#006B6A]",
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((current) => [...current, { ...toast, id }].slice(-4));
      return id;
    },
    []
  );

  return { toasts, showToast, removeToast };
}

function ToastItem({
  toast,
  onClose,
}: {
  toast: ToastMessage;
  onClose: (id: number) => void;
}) {
  useEffect(() => {
    const timeout = window.setTimeout(() => onClose(toast.id), 4500);
    return () => window.clearTimeout(timeout);
  }, [onClose, toast.id]);

  return (
    <div
      className={`w-full rounded-2xl border px-4 py-3 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.5)] ${styles[toast.variant]}`}
      role={toast.variant === "error" ? "alert" : "status"}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.message ? (
            <p className="mt-1 text-xs opacity-85">{toast.message}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className="rounded-full px-2 text-sm font-semibold opacity-70 transition hover:opacity-100"
          aria-label="Dismiss notification"
        >
          x
        </button>
      </div>
    </div>
  );
}

export function ToastStack({
  toasts,
  onClose,
}: {
  toasts: ToastMessage[];
  onClose: (id: number) => void;
}) {
  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-4 z-50 grid w-[calc(100vw-2rem)] max-w-sm gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
