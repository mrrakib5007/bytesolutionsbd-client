"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/Shared/ConfirmModal";
import {
  FiX,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiCopy,
  FiCheck,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminUserViewModal({
  isOpen,
  onClose,
  user,
  currentAdminId,
  onStatusToggled,
}) {
  const [copiedField, setCopiedField] = useState(null);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deactivationNote, setDeactivationNote] = useState("");

  // Copy helper
  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Format Bangladesh Dhaka time
  const formatDhakaDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-GB", {
      timeZone: "Asia/Dhaka",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!isOpen || !user) return null;

  const isSelf = user._id === currentAdminId;
  const isActive = user.isActive !== false;

  const handleRequestToggle = () => {
    if (isSelf && isActive) {
      toast.error("You cannot deactivate your own admin account.");
      return;
    }
    if (isActive) {
      setDeactivationNote(user.deactivationNote || "");
    }
    setIsConfirmOpen(true);
  };

  const handleExecuteToggle = async () => {
    const newStatus = !isActive;
    setTogglingStatus(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${user._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          isActive: newStatus,
          ...(newStatus === false && { deactivationNote: deactivationNote.trim() }),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || `Account ${newStatus ? "activated" : "deactivated"}!`);
        if (onStatusToggled) {
          onStatusToggled(data.data);
        }
        setIsConfirmOpen(false);
        setDeactivationNote("");
      } else {
        toast.error(data.message || "Failed to update account status.");
      }
    } catch (err) {
      console.error("Toggle user status error:", err);
      toast.error("Network error while updating user status.");
    } finally {
      setTogglingStatus(false);
    }
  };

  const DEFAULT_IMAGE = "https://i.ibb.co.com/ycfgs7BG/profile.jpg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto slim-scrollbar rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-gray-200 bg-gray-50 shrink-0 shadow-2xs">
              <Image
                src={user.image || DEFAULT_IMAGE}
                alt={user.name || "User Avatar"}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-gray-900">
                  {user.name}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    user.role === "admin"
                      ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                      : "bg-blue-50 text-blue-700 border border-blue-200/60"
                  }`}
                >
                  <FiShield className="h-3 w-3" />
                  {user.role === "admin" ? "Admin" : "Customer"}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : "bg-rose-50 text-rose-700 border border-rose-200/60"
                  }`}
                >
                  {isActive ? (
                    <>
                      <FiCheckCircle className="h-3 w-3" /> Active Account
                    </>
                  ) : (
                    <>
                      <FiAlertCircle className="h-3 w-3" /> Deactivated
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Joined: {formatDhakaDateTime(user.createdAt)} (Dhaka Time)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Deactivation Banner & Admin Internal Reason */}
        {!isActive && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                <FiAlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>Account Deactivated by Administration</span>
              </div>
              {user.deactivatedAt && (
                <span className="text-[11px] font-mono text-rose-600 font-semibold">
                  {formatDhakaDateTime(user.deactivatedAt)}
                </span>
              )}
            </div>

            <div className="rounded-xl bg-white/90 border border-rose-200/70 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Internal Reason / Admin Note:
                </span>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                  🔒 Hidden from Customer
                </span>
              </div>
              <p className="text-xs text-gray-900 font-medium whitespace-pre-wrap">
                {user.deactivationNote || "No specific note was recorded during deactivation."}
              </p>
              {user.deactivatedBy && (
                <span className="text-[10px] text-gray-400 block pt-0.5">
                  Action taken by: {user.deactivatedBy}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contact & Account Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Email Card */}
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
              Email Address
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-gray-900 truncate" title={user.email}>
                {user.email}
              </span>
              {user.email && (
                <button
                  type="button"
                  onClick={() => handleCopy(user.email, "Email")}
                  className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                  title="Copy email"
                >
                  {copiedField === "Email" ? (
                    <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <FiCopy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
              WhatsApp / Phone Number
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-bold text-emerald-800 truncate">
                {user.whatsapp || "Not provided"}
              </span>
              {user.whatsapp && (
                <button
                  type="button"
                  onClick={() => handleCopy(user.whatsapp, "Phone")}
                  className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                  title="Copy phone"
                >
                  {copiedField === "Phone" ? (
                    <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <FiCopy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Account Security & Fast Status Toggle */}
        <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
              Account Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    : "bg-rose-50 text-rose-700 border border-rose-200/60"
                }`}
              >
                {isActive ? (
                  <>
                    <FiCheckCircle className="h-3.5 w-3.5" /> Active Account
                  </>
                ) : (
                  <>
                    <FiAlertCircle className="h-3.5 w-3.5" /> Deactivated
                  </>
                )}
              </span>
              <span className="text-xs text-gray-500">
                {isActive
                  ? "User has full access to login and make purchases."
                  : "User is blocked from logging in or placing orders."}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={togglingStatus || (isSelf && isActive)}
              onClick={handleRequestToggle}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isActive
                  ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {togglingStatus ? (
                <LuLoader className="h-3.5 w-3.5 animate-spin" />
              ) : isActive ? (
                <FiLock className="h-3.5 w-3.5" />
              ) : (
                <FiUnlock className="h-3.5 w-3.5" />
              )}
              <span>
                {isActive ? "Deactivate Account" : "Activate Account"}
              </span>
            </button>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Custom Confirmation Popup Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeactivationNote("");
        }}
        onConfirm={handleExecuteToggle}
        loading={togglingStatus}
        variant={isActive ? "danger" : "success"}
        title={isActive ? "Deactivate User Account?" : "Activate User Account?"}
        message={
          isActive
            ? `Are you sure you want to deactivate ${user.name}'s account? They will be immediately logged out and cannot sign in.`
            : `Are you sure you want to activate ${user.name}'s account? The user will be able to sign in and use services.`
        }
        confirmText={isActive ? "Deactivate Account" : "Activate Account"}
      >
        {isActive && (
          <div className="space-y-1.5 mt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700">
                Reason for Deactivation (Admin Note)
              </label>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                🔒 Admin Only
              </span>
            </div>
            <textarea
              rows={3}
              value={deactivationNote}
              onChange={(e) => setDeactivationNote(e.target.value)}
              placeholder="e.g. Suspicious payment activity, fake account info, policy violation..."
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
            />
            <p className="text-[10px] text-gray-400">
              This note is strictly internal. The customer will NOT see this reason.
            </p>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}
