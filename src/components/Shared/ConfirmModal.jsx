"use client";

import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import { LuLoader } from "react-icons/lu";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Please confirm this action.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary", // "primary" | "danger" | "success" | "warning"
  loading = false,
}) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <FiAlertTriangle className="h-6 w-6 text-rose-600" />,
      iconBg: "bg-rose-50 border-rose-100",
      confirmBtn:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500",
    },
    success: {
      icon: <FiCheckCircle className="h-6 w-6 text-emerald-600" />,
      iconBg: "bg-emerald-50 border-emerald-100",
      confirmBtn:
        "bg-(--primary) hover:bg-(--primary-hover) text-white shadow-xs focus:ring-(--primary)",
    },
    warning: {
      icon: <FiAlertTriangle className="h-6 w-6 text-amber-600" />,
      iconBg: "bg-amber-50 border-amber-100",
      confirmBtn:
        "bg-amber-600 hover:bg-amber-700 text-white shadow-xs focus:ring-amber-500",
    },
    primary: {
      icon: <FiInfo className="h-6 w-6 text-(--primary)" />,
      iconBg: "bg-emerald-50 border-emerald-100",
      confirmBtn:
        "bg-(--primary) hover:bg-(--primary-hover) text-white shadow-xs focus:ring-(--primary)",
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Icon */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer disabled:opacity-40"
          aria-label="Close dialog"
        >
          <FiX className="h-4 w-4" />
        </button>

        {/* Content: Icon + Title + Description */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-2xl border shrink-0 ${currentVariant.iconBg}`}
          >
            {currentVariant.icon}
          </div>

          <div className="space-y-1.5 pr-6">
            <h3 className="text-base font-extrabold text-gray-900 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${currentVariant.confirmBtn}`}
          >
            {loading && <LuLoader className="h-3.5 w-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
