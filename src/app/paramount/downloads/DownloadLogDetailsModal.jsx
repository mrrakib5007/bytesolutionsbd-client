"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiX,
  FiDownload,
  FiGlobe,
  FiUserCheck,
  FiMonitor,
  FiSmartphone,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiClock,
  FiTrash2,
  FiShield,
  FiTerminal,
} from "react-icons/fi";

/**
 * Format timestamp into human-readable date & time
 */
function formatDateTime(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return String(dateStr);
  }
}

/**
 * Format relative time (e.g. 5m ago, 2h ago, 1d ago)
 */
function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  try {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  } catch {
    return "";
  }
}

export default function DownloadLogDetailsModal({
  log,
  uaInfo,
  onClose,
  onDelete,
}) {
  const [copiedField, setCopiedField] = useState(null);

  // Prevent background page from scrolling when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!log) return null;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName}`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    /* Outer Fixed Overlay (Centered, non-scrolling, traps clicks outside) */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Modal Dialog Container: Strictly fits viewport with max-h-[90vh], flex column */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Fixed Header (shrink-0) */}
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-2xs shrink-0">
              <FiDownload className="h-5 w-5 text-(--primary)" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight truncate">
                Download Activity Details
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                <span className="flex items-center gap-1">
                  <FiClock className="h-3 w-3 text-gray-400 shrink-0" />
                  <span>{formatDateTime(log.createdAt)}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-600 font-medium">
                  {formatRelativeTime(log.createdAt)}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            title="Close Modal"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Modal Body (All internal scrolling strictly confined here) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 slim-scrollbar">
          {/* Top 2x2 Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {/* Card 1: Software Package Information */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FiDownload className="h-3.5 w-3.5 text-(--primary) shrink-0" />
                  Target Software
                </span>
                {log.slug && (
                  <Link
                    href={`/downloads/${log.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-(--primary) hover:underline"
                    title="Open public download page"
                  >
                    <span>View Page</span>
                    <FiExternalLink className="h-3 w-3 shrink-0" />
                  </Link>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-snug wrap-break-word">
                  {log.title || "Unknown Software"}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 min-w-0">
                  <span className="text-xs font-mono text-gray-500 truncate">
                    /{log.slug}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(log.slug, "Slug")}
                    className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
                    title="Copy slug"
                  >
                    {copiedField === "Slug" ? (
                      <FiCheck className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <FiCopy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {log.downloadId && (
                <div className="pt-1.5 border-t border-gray-200/60 flex items-center justify-between text-[11px] gap-2">
                  <span className="text-gray-400 shrink-0">Software ID:</span>
                  <div className="flex items-center gap-1 font-mono text-gray-600 min-w-0">
                    <span className="truncate max-w-28 sm:max-w-36">{String(log.downloadId)}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(log.downloadId, "Software ID")}
                      className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
                      title="Copy ID"
                    >
                      {copiedField === "Software ID" ? (
                        <FiCheck className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <FiCopy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Requester Identity */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <FiShield className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                Requester Authentication
              </span>

              {log.isRegisteredUser ? (
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <FiUserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Registered Customer</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2 min-w-0">
                    <span className="text-xs font-mono font-semibold text-gray-900 truncate">
                      {log.userEmail}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(log.userEmail, "Email")}
                      className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
                      title="Copy email"
                    >
                      {copiedField === "Email" ? (
                        <FiCheck className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <FiCopy className="h-3 w-3" />
                      )}
                    </button>
                  </div>

                  {log.userId && (
                    <div className="pt-1.5 border-t border-gray-200/60 flex items-center justify-between text-[11px] gap-2">
                      <span className="text-gray-400 shrink-0">User ID:</span>
                      <span className="font-mono text-gray-600 truncate max-w-28 sm:max-w-36">
                        {String(log.userId)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium">
                    <FiGlobe className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>Guest / Public Visitor</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Unauthenticated visitor clicked download directly from the public storefront catalog.
                  </p>
                </div>
              )}
            </div>

            {/* Card 3: Network & Client IP */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <FiGlobe className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                Network & Client IP
              </span>

              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 gap-2">
                <span className="font-mono text-xs sm:text-sm font-extrabold text-gray-900 tracking-wider truncate">
                  {log.ip || "Unknown IP"}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(log.ip, "IP Address")}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer shrink-0"
                  title="Copy IP"
                >
                  {copiedField === "IP Address" ? (
                    <>
                      <FiCheck className="h-3 w-3 text-emerald-600" />
                      <span className="text-[11px] text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className="h-3 w-3" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-gray-400">
                Extracted securely from server reverse-proxy headers (<code className="font-mono">x-forwarded-for</code>).
              </p>
            </div>

            {/* Card 4: Device, Browser & Operating System */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                {uaInfo?.isMobile ? (
                  <FiSmartphone className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                ) : (
                  <FiMonitor className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                )}
                Client Environment
              </span>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="text-gray-500 shrink-0">Operating System:</span>
                  <span className="font-bold text-gray-900 truncate">{uaInfo?.os || "Unknown OS"}</span>
                </div>
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="text-gray-500 shrink-0">Web Browser:</span>
                  <span className="font-bold text-gray-900 truncate">{uaInfo?.browser || "Unknown Browser"}</span>
                </div>
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="text-gray-500 shrink-0">Device Category:</span>
                  <span className="font-semibold text-gray-700 truncate">
                    {uaInfo?.isMobile ? "Mobile Device" : "Desktop Computer"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Section: Raw User-Agent */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <FiTerminal className="h-3.5 w-3.5 text-gray-600 shrink-0" />
                Raw User-Agent String
              </span>
              <button
                type="button"
                onClick={() => handleCopy(log.userAgent, "User-Agent")}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-(--primary) transition-colors cursor-pointer shrink-0"
              >
                {copiedField === "User-Agent" ? (
                  <>
                    <FiCheck className="h-3 w-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="h-3 w-3" />
                    <span>Copy Full UA</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 rounded-lg bg-white text-gray-700 text-xs break-all leading-relaxed select-all border border-gray-200">
              {log.userAgent || "No user-agent string recorded."}
            </div>
          </div>

          {/* Record Metadata */}
          <div className="p-3 rounded-xl bg-white border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-500">
            <div className="min-w-0">
              <span className="font-semibold text-gray-600">Database Record ID: </span>
              <code className="font-mono text-gray-800 font-bold break-all">{String(log._id)}</code>
            </div>
            <div className="shrink-0">
              <span className="font-semibold text-gray-600">Recorded: </span>
              <span className="font-mono text-gray-800">{new Date(log.createdAt).toISOString()}</span>
            </div>
          </div>
        </div>

        {/* Sticky Fixed Footer (shrink-0) */}
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-3 sm:py-3.5 border-t border-gray-100 bg-gray-50/80">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onDelete) onDelete(log);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
          >
            <FiTrash2 className="h-3.5 w-3.5 shrink-0" />
            <span>Delete Record</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
