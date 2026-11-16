"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  FiX,
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCopy,
  FiCheck,
  FiKey,
  FiMail,
  FiLock,
  FiMessageSquare,
} from "react-icons/fi";

export default function UserOrderDetailsModal({ isOpen, onClose, order }) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else if (type === "password") {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
    toast.success("Copied to clipboard!");
  };

  const isCompleted = order.orderStatus === "completed";
  const isPending = order.orderStatus === "pending";
  const isCancelled = order.orderStatus === "cancelled";

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto slim-scrollbar rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-gray-900">
                {order.orderId}
              </span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  <FiCheckCircle className="h-3 w-3" /> Completed
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                  <FiClock className="h-3 w-3" /> Verification Pending
                </span>
              )}
              {isCancelled && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700">
                  <FiAlertCircle className="h-3 w-3" /> Cancelled
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">Placed on {formattedDate}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Digital License / Account Delivery Details */}
        {isCompleted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <FiKey className="h-4 w-4 text-emerald-600" />
              <span>Digital License & Delivery Credentials</span>
            </div>

            {/* License Key if any */}
            {order.delivery?.licenseKey && (
              <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  License Key
                </span>
                <div className="flex items-center justify-between gap-2">
                  <code className="font-mono text-xs font-bold text-emerald-950 break-all select-all">
                    {order.delivery.licenseKey}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.delivery.licenseKey, "key")}
                    className="shrink-0 p-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all cursor-pointer"
                    title="Copy Key"
                  >
                    {copiedKey ? (
                      <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <FiCopy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Account Credentials if any */}
            {(order.delivery?.accountEmail || order.delivery?.accountPassword) && (
              <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-2 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Account Credentials
                </span>
                {order.delivery.accountEmail && (
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-gray-500 flex items-center gap-1">
                      <FiMail className="h-3.5 w-3.5 text-gray-400" /> Email:
                    </span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-gray-900">
                      <span>{order.delivery.accountEmail}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.delivery.accountEmail, "email")}
                        className="p-1 hover:text-emerald-600 cursor-pointer"
                      >
                        {copiedEmail ? <FiCheck className="h-3 w-3 text-emerald-600" /> : <FiCopy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                )}
                {order.delivery.accountPassword && (
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-gray-500 flex items-center gap-1">
                      <FiLock className="h-3.5 w-3.5 text-gray-400" /> Password:
                    </span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-gray-900">
                      <span>{order.delivery.accountPassword}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.delivery.accountPassword, "password")}
                        className="p-1 hover:text-emerald-600 cursor-pointer"
                      >
                        {copiedPassword ? <FiCheck className="h-3 w-3 text-emerald-600" /> : <FiCopy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Admin Note if provided */}
            {order.delivery?.adminNote && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs space-y-1">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <FiMessageSquare className="h-3.5 w-3.5 text-blue-600" />
                  Note from Paramount Support
                </span>
                <p className="text-blue-800 whitespace-pre-wrap leading-relaxed text-[11px]">
                  {order.delivery.adminNote}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <FiClock className="h-4 w-4 text-amber-600" />
              <span>Payment Verification in Progress</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              We received your payment details. Once verified by our team, your genuine license key or access credentials will appear here.
            </p>
            {order.delivery?.adminNote && (
              <div className="mt-2 rounded-xl border border-amber-200 bg-white p-2.5 text-[11px] text-amber-900">
                <strong>Admin Note:</strong> {order.delivery.adminNote}
              </div>
            )}
          </div>
        )}

        {/* Ordered Items */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-gray-700">Ordered Products</h4>
          <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden bg-white">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <FiShoppingBag className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{item.title}</p>
                    <p className="text-[11px] text-gray-500">
                      {item.duration} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-bold text-gray-900 shrink-0">
                  ৳ {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Payment Method:</span>
            <span className="font-bold uppercase text-gray-900">{order.payment?.method}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Sender Number:</span>
            <span className="font-mono font-bold text-gray-900">{order.payment?.senderNumber}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Transaction ID (TrxID):</span>
            <span className="font-mono font-bold text-gray-900">{order.payment?.trxId}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-extrabold text-gray-900">
            <span>Total Paid:</span>
            <span className="font-mono">৳ {order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
