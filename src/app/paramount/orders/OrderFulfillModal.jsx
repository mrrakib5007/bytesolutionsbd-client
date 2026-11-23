"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  FiX,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiKey,
  FiMail,
  FiLock,
  FiMessageSquare,
  FiSave,
  FiLayers,
} from "react-icons/fi";
import { LuLoader, LuShoppingBag } from "react-icons/lu";

export default function OrderFulfillModal({
  isOpen,
  onClose,
  order,
  onOrderUpdated,
}) {
  const [orderStatus, setOrderStatus] = useState(
    order?.orderStatus || "completed"
  );
  const [adminNote, setAdminNote] = useState(order?.delivery?.adminNote || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize item-level delivery state supporting multi-product & multi-quantity
  const [itemsDelivery, setItemsDelivery] = useState(() => {
    return (order?.items || []).map((item) => {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const existingType =
        item.deliveryType ||
        (order?.delivery?.deliveryType === "account_credentials"
          ? "account_credentials"
          : "license_key");

      const existingDeliveries = Array.isArray(item.deliveries)
        ? item.deliveries
        : [];

      // Build units array for quantity 1..qty
      const units = Array.from({ length: qty }, (_, idx) => {
        const found = existingDeliveries[idx];
        return {
          unit: idx + 1,
          licenseKey:
            found?.licenseKey ||
            (idx === 0 && existingType === "license_key"
              ? order?.delivery?.licenseKey || ""
              : ""),
          accountEmail:
            found?.accountEmail ||
            (idx === 0 && existingType === "account_credentials"
              ? order?.delivery?.accountEmail || ""
              : ""),
          accountPassword:
            found?.accountPassword ||
            (idx === 0 && existingType === "account_credentials"
              ? order?.delivery?.accountPassword || ""
              : ""),
          note: found?.note || "",
        };
      });

      return {
        productId: item.productId,
        variantId: item.variantId,
        title: item.title,
        image: item.image,
        duration: item.duration,
        quantity: qty,
        deliveryType: existingType,
        units,
      };
    });
  });

  if (!isOpen || !order) return null;

  const handleDeliveryTypeChange = (itemIdx, newType) => {
    setItemsDelivery((prev) => {
      const next = [...prev];
      next[itemIdx] = {
        ...next[itemIdx],
        deliveryType: newType,
      };
      return next;
    });
  };

  const handleUnitFieldChange = (itemIdx, unitIdx, field, value) => {
    setItemsDelivery((prev) => {
      const next = [...prev];
      const updatedUnits = [...next[itemIdx].units];
      updatedUnits[unitIdx] = {
        ...updatedUnits[unitIdx],
        [field]: value,
      };
      next[itemIdx] = {
        ...next[itemIdx],
        units: updatedUnits,
      };
      return next;
    });
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        orderStatus,
        adminNote,
        items: itemsDelivery.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          deliveryType: item.deliveryType,
          deliveries: item.units.map((u) => ({
            unit: u.unit,
            licenseKey: item.deliveryType === "license_key" ? u.licenseKey : "",
            accountEmail:
              item.deliveryType === "account_credentials" ? u.accountEmail : "",
            accountPassword:
              item.deliveryType === "account_credentials"
                ? u.accountPassword
                : "",
            note: u.note,
          })),
        })),
      };

      const res = await fetch(`${API_BASE_URL}/admin/orders/${order._id}/deliver`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Order status & digital delivery updated!");
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
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto slim-scrollbar rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">
              Order Fulfillment & Delivery
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                {order.orderId}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-600">
                Customer: <strong className="text-gray-900">{order.customer?.name}</strong> ({order.customer?.email})
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
            <span className="text-gray-400 block mb-0.5 font-medium">Payment Method</span>
            <span className="font-bold uppercase text-gray-900">
              {order.payment?.method}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5 font-medium">Sender Mobile</span>
            <span className="font-mono font-bold text-gray-900">
              {order.payment?.senderNumber}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5 font-medium">Transaction ID</span>
            <span className="font-mono font-bold text-emerald-700">
              {order.payment?.trxId}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5 font-medium">Total Paid</span>
            <span className="font-mono font-extrabold text-gray-950 text-sm">
              ৳ {order.totalAmount?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Customer Note if present */}
        {order.customerNote && (
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
            <strong>Customer Note:</strong> {order.customerNote}
          </div>
        )}

        {/* Fulfillment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-2">
              Order Status
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  value: "completed",
                  label: "Completed (Approve)",
                  icon: FiCheckCircle,
                  color: "text-emerald-700 border-emerald-300 bg-emerald-50",
                },
                {
                  value: "pending",
                  label: "Pending Verification",
                  icon: FiClock,
                  color: "text-amber-700 border-amber-300 bg-amber-50",
                },
                {
                  value: "cancelled",
                  label: "Cancelled",
                  icon: FiAlertCircle,
                  color: "text-red-700 border-red-300 bg-red-50",
                },
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

          {/* Multi-Item / Multi-Quantity Digital Delivery Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <FiLayers className="h-4 w-4 text-(--primary)" />
                Digital Items to Deliver ({itemsDelivery.length} Products)
              </label>
              <span className="text-[11px] text-gray-400">
                Provide separate keys/credentials for each product & quantity
              </span>
            </div>

            <div className="space-y-4">
              {itemsDelivery.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs space-y-4"
                >
                  {/* Product Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-10 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300">
                            <LuShoppingBag className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                            {item.duration}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Type Selector for this product */}
                    <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleDeliveryTypeChange(itemIdx, "license_key")
                        }
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          item.deliveryType === "license_key"
                            ? "bg-white text-emerald-700 shadow-xs"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        <FiKey className="h-3 w-3" />
                        <span>License Key</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeliveryTypeChange(itemIdx, "account_credentials")
                        }
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          item.deliveryType === "account_credentials"
                            ? "bg-white text-emerald-700 shadow-xs"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        <FiMail className="h-3 w-3" />
                        <span>Account Access</span>
                      </button>
                    </div>
                  </div>

                  {/* Units Input Fields */}
                  <div className="space-y-3 pt-1">
                    {item.units.map((unit, unitIdx) => (
                      <div
                        key={unitIdx}
                        className={`rounded-xl p-3 border transition-colors ${
                          item.units.length > 1
                            ? "bg-gray-50/70 border-gray-200"
                            : "bg-transparent border-transparent p-0"
                        }`}
                      >
                        {item.units.length > 1 && (
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                              Unit #{unit.unit} of {item.quantity}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {item.title}
                            </span>
                          </div>
                        )}

                        {item.deliveryType === "license_key" ? (
                          <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">
                              {item.units.length > 1
                                ? `License Key for Unit #${unit.unit}`
                                : "License Key / Activation Code"}
                            </label>
                            <input
                              type="text"
                              value={unit.licenseKey}
                              onChange={(e) =>
                                handleUnitFieldChange(
                                  itemIdx,
                                  unitIdx,
                                  "licenseKey",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. CANVA-PRO-9812-7891-AUTH"
                              className="w-full font-mono font-bold text-xs rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none"
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-gray-800 mb-1">
                                {item.units.length > 1
                                  ? `Unit #${unit.unit} Email / Username`
                                  : "Account Email / Username"}
                              </label>
                              <input
                                type="text"
                                value={unit.accountEmail}
                                onChange={(e) =>
                                  handleUnitFieldChange(
                                    itemIdx,
                                    unitIdx,
                                    "accountEmail",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g. premium@bytesolutionsbd.com"
                                className="w-full text-xs rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-800 mb-1">
                                {item.units.length > 1
                                  ? `Unit #${unit.unit} Password`
                                  : "Account Password"}
                              </label>
                              <input
                                type="text"
                                value={unit.accountPassword}
                                onChange={(e) =>
                                  handleUnitFieldChange(
                                    itemIdx,
                                    unitIdx,
                                    "accountPassword",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g. Pass@9876#"
                                className="w-full text-xs font-mono rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Note / Instructions */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
              <FiMessageSquare className="h-3.5 w-3.5 text-gray-400" />
              General Note / Usage Instructions (Visible to Customer)
            </label>
            <textarea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="e.g. 1 Year warranty included. Login using the credentials above and contact support if you face any issues."
              className="w-full text-xs rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none resize-none leading-relaxed"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              The customer can see and read this note inside their dashboard order details popup once completed.
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
