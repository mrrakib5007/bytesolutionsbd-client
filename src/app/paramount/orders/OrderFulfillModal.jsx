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
  FiKey,
  FiMail,
  FiLock,
  FiMessageSquare,
  FiSave,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";

export default function OrderFulfillModal({ isOpen, onClose, order, onOrderUpdated }) {
  const [orderStatus, setOrderStatus] = useState(order?.orderStatus || "completed");
  const [deliveryType, setDeliveryType] = useState(
    order?.delivery?.deliveryType === "account_credentials"
      ? "account_credentials"
      : "license_key"
  );
  const [licenseKey, setLicenseKey] = useState(order?.delivery?.licenseKey || "");
  const [accountEmail, setAccountEmail] = useState(order?.delivery?.accountEmail || "");
  const [accountPassword, setAccountPassword] = useState(order?.delivery?.accountPassword || "");
  const [adminNote, setAdminNote] = useState(order?.delivery?.adminNote || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        orderStatus,
        deliveryType,
        licenseKey: deliveryType === "license_key" ? licenseKey : "",
        accountEmail: deliveryType === "account_credentials" ? accountEmail : "",
        accountPassword: deliveryType === "account_credentials" ? accountPassword : "",
        adminNote,
      };

      const res = await fetch(`http://localhost:5000/api/admin/orders/${order._id}/deliver`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Order status & delivery information updated!");
        if (onOrderUpdated) {
          onOrderUpdated(data.data);
        }
        onClose();
      } else {
        toast.error(data.message || "Failed to update order.");
      }
    } catch (err) {
      console.error("Order fulfill error:", err);
      toast.error("Error communicating with server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">
              Order Fulfillment & Delivery
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs font-bold text-gray-600">
                {order.orderId}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">
                Customer: {order.customer?.name} ({order.customer?.email})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Payment Verification Banner */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <span className="text-gray-400 block mb-0.5">Method</span>
            <span className="font-bold uppercase text-gray-900">{order.payment?.method}</span>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5">Sender Mobile</span>
            <span className="font-mono font-bold text-gray-900">{order.payment?.senderNumber}</span>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5">TrxID</span>
            <span className="font-mono font-bold text-emerald-700">{order.payment?.trxId}</span>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5">Total Amount</span>
            <span className="font-mono font-extrabold text-gray-950">৳{order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Customer Note if present */}
        {order.customerNote && (
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
            <strong>Customer Request / Note:</strong> {order.customerNote}
          </div>
        )}

        {/* Fulfillment Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-2">
              Order Status
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { value: "completed", label: "Completed (Approve)", icon: FiCheckCircle, color: "text-emerald-700 border-emerald-300 bg-emerald-50" },
                { value: "pending", label: "Pending Verification", icon: FiClock, color: "text-amber-700 border-amber-300 bg-amber-50" },
                { value: "cancelled", label: "Cancelled", icon: FiAlertCircle, color: "text-red-700 border-red-300 bg-red-50" },
              ].map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setOrderStatus(st.value)}
                  className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                    orderStatus === st.value
                      ? st.color
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <st.icon className="h-3.5 w-3.5" />
                  <span>{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-2">
              Digital Delivery Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType("license_key")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                  deliveryType === "license_key"
                    ? "border-(--primary) bg-emerald-50/50 text-emerald-800"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <FiKey className="h-4 w-4" />
                <span>License Key Activation</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType("account_credentials")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                  deliveryType === "account_credentials"
                    ? "border-(--primary) bg-emerald-50/50 text-emerald-800"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <FiMail className="h-4 w-4" />
                <span>Account Credentials (Email/Password)</span>
              </button>
            </div>
          </div>

          {/* Fields according to deliveryType */}
          {deliveryType === "license_key" ? (
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">
                License Key / Activation Code
              </label>
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="e.g. CANVA-PRO-9812-7891-AUTH"
                className="w-full font-mono font-bold text-xs rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                This key will be instantly readable and copyable by the customer in their dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1.5">
                  Account Email / Username
                </label>
                <input
                  type="text"
                  value={accountEmail}
                  onChange={(e) => setAccountEmail(e.target.value)}
                  placeholder="e.g. premium@softlicensehub.com"
                  className="w-full text-xs rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1.5">
                  Account Password
                </label>
                <input
                  type="text"
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder="e.g. Pass@9876#"
                  className="w-full text-xs rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* Admin Note / Instructions */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5">
              Admin Note / Customer Instructions (Visible to Customer)
            </label>
            <textarea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="e.g. Login directly at canva.com using the credentials above. Do not change the email address. 1 Year warranty included."
              className="w-full text-xs rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none resize-none leading-relaxed"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              The customer can see and read this note inside their dashboard order details popup.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-xs font-bold text-white shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <LuLoader className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4" />
                  <span>Save & Deliver</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
