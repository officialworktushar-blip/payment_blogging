"use client";

import { useEffect } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

interface ToastProps {
  message: string;
  tone?: "success" | "error";
  onDismiss: () => void;
}

export function Toast({ message, tone = "success", onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) {
    return null;
  }

  const success = tone === "success";

  return (
    <div
      role="status"
      className={`fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-card ${
        success
          ? "border-success/30 bg-white text-success-dark"
          : "border-error/30 bg-white text-error-dark"
      }`}
    >
      {success ? (
        <CheckCircle2 aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
      ) : (
        <XCircle aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
      )}
      <span className="flex-1">{message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification">
        <X aria-hidden="true" size={14} />
      </button>
    </div>
  );
}
