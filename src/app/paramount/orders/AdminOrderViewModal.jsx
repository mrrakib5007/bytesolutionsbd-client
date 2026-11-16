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
  FiUser,
  FiCreditCard,
  FiEdit3,
} from "react-icons/fi";

export default function AdminOrderViewModal({
  isOpen,
  onClose,
  order,
  onOpenFulfill,
}) {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !order) return null;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isCompleted = order.orderStatus === "completed";
  const isPending = order.orderStatus === "pending";
  const isCancelled = order.orderStatus === "cancelled";

  const formattedDhakaDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-GB", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  const formattedDeliveryDate = order.delivery?.deliveredAt
    ? new Date(order.delivery.deliveredAt).toLocaleString("en-GB", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto slim-scrollbar rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-base font-extrabold text-gray-900">
                {order.orderId}
              </span>

              {isCompleted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  <FiCheckCircle className="h-3.5 w-3.5" /> Completed
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                  <FiClock className="h-3.5 w-3.5" /> Verification Pending
                </span>
              )}
              {isCancelled && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200/60 px-2.5 py-0.5 text-xs font-bold text-red-700">
                  <FiAlertCircle className="h-3.5 w-3.5" /> Cancelled
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Order Placed: <span className="font-medium text-gray-700">{formattedDhakaDate} (Dhaka Time)</span>
            </p>
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

        {/* Customer Information Card */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <FiUser className="h-3.5 w-3.5 text-gray-400" />
            Customer Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-gray-200/70">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Full Name</span>
              <p className="font-bold text-gray-900 mt-0.5 truncate">{order.customer?.name || "N/A"}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200/70">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Email Address</span>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <p className="font-medium text-gray-800 truncate" title={order.customer?.email}>
                  {order.customer?.email || "N/A"}
                </p>
                {order.customer?.email && (
                  <button
                    type="button"
                    onClick={() => handleCopy(order.customer.email, "email")}
                    className="text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                    title="Copy email"
                  >
                    {copiedField === "email" ? (
                      <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <FiCopy className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200/70">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">WhatsApp / Phone</span>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <p className="font-mono font-bold text-emerald-700 truncate">
                  {order.customer?.whatsapp || "N/A"}
                </p>
                {order.customer?.whatsapp && (
                  <button
                    type="button"
                    onClick={() => handleCopy(order.customer.whatsapp, "phone")}
                    className="text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                    title="Copy phone"
                  >
                    {copiedField === "phone" ? (
                      <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <FiCopy className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Verification Card */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <FiCreditCard className="h-3.5 w-3.5 text-gray-400" />
              Payment Verification Details
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                order.payment?.status === "verified"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              Status: {order.payment?.status === "verified" ? "Verified" : "Unverified"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-gray-200/70">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Method</span>
              <p className="font-extrabold uppercase text-gray-900 mt-0.5">
                {order.payment?.method || "Manual"}
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200/70">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Sender Number</span>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <p className="font-mono font-bold text-gray-800">
                  {order.payment?.senderNumber || "N/A"}
                </p>
                {order.payment?.senderNumber && (
                  <button
                    type="button"
                    onClick={() => handleCopy(order.payment.senderNumber, "sender")}
                    className="text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                    title="Copy sender number"
                  >
                    {copiedField === "sender" ? (
                      <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <FiCopy className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200/70">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Transaction ID</span>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <p className="font-mono font-bold text-emerald-700 truncate">
                  {order.payment?.trxId || "N/A"}
                </p>
                {order.payment?.trxId && (
                  <button
                    type="button"
                    onClick={() => handleCopy(order.payment.trxId, "trxId")}
                    className="text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                    title="Copy TrxID"
                  >
                    {copiedField === "trxId" ? (
                      <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <FiCopy className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Products Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <FiShoppingBag className="h-3.5 w-3.5 text-gray-400" />
            Ordered Items ({order.items?.length || 0})
          </h3>

          <div className="space-y-2">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-gray-200/80 bg-white"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300">
                        <FiShoppingBag className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-xs text-gray-900 truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-600 font-medium">
                        {item.duration} × {item.quantity}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400">
                        ৳ {item.price} each
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-xs text-gray-900">
                    ৳ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
            <span className="font-bold text-gray-600">Total Order Amount</span>
            <span className="font-mono font-extrabold text-base text-gray-950">
              ৳ {order.totalAmount?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* License & Credentials Delivery Information */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <FiKey className="h-3.5 w-3.5 text-gray-400" />
              Delivered License & Credentials
            </h3>
            {formattedDeliveryDate && (
              <span className="text-[11px] text-gray-400 font-mono">
                Delivered: {formattedDeliveryDate}
              </span>
            )}
          </div>

          {order.delivery?.licenseKey ? (
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase">License Key</span>
              <div className="flex items-center justify-between gap-2">
                <code className="font-mono font-bold text-emerald-800 text-xs break-all">
                  {order.delivery.licenseKey}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(order.delivery.licenseKey, "License Key")}
                  className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                  title="Copy license key"
                >
                  {copiedField === "License Key" ? (
                    <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <FiCopy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ) : order.delivery?.accountEmail ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Account Email</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-gray-800 font-bold truncate">
                    {order.delivery.accountEmail}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.delivery.accountEmail, "Email")}
                    className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                  >
                    {copiedField === "Email" ? (
                      <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <FiCopy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Account Password</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-gray-800 font-bold truncate">
                    {order.delivery.accountPassword}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.delivery.accountPassword, "Password")}
                    className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                  >
                    {copiedField === "Password" ? (
                      <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <FiCopy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400">
              No digital license or credentials delivered yet.
            </div>
          )}

          {order.delivery?.adminNote && (
            <div className="bg-amber-50/60 border border-amber-200/70 p-3 rounded-xl text-xs space-y-0.5">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Admin Note:</span>
              <p className="text-gray-700 whitespace-pre-wrap">{order.delivery.adminNote}</p>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Close
          </button>

          {onOpenFulfill && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFulfill(order);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
            >
              <FiEdit3 className="h-3.5 w-3.5" />
              <span>{isCompleted ? "Edit License / Credentials" : "Deliver License"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
