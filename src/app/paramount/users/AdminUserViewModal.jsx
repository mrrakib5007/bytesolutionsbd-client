"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/Shared/ConfirmModal";
import {
  FiX,
  FiShield,
  FiShoppingBag,
  FiCheckCircle,
  FiAlertCircle,
  FiCopy,
  FiCheck,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";

export default function AdminUserViewModal({
  isOpen,
  onClose,
  user,
  currentAdminId,
  onStatusToggled,
}) {
  const [copiedField, setCopiedField] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  // Fetch full user details with order history when modal opens
  const fetchUserDetails = async () => {
    if (!user?._id) return;
    setLoadingOrders(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${user._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success && data.data?.orders) {
        setOrders(data.data.orders);
      }
    } catch (err) {
      console.error("Failed to load user orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Trigger load on open
  useState(() => {
    if (isOpen && user?._id) {
      fetchUserDetails();
    }
  });

  if (!isOpen || !user) return null;

  const isSelf = user._id === currentAdminId;
  const isActive = user.isActive !== false;

  const handleRequestToggle = () => {
    if (isSelf && isActive) {
      toast.error("You cannot deactivate your own admin account.");
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleExecuteToggle = async () => {
    const newStatus = !isActive;
    setTogglingStatus(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${user._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || `Account ${newStatus ? "activated" : "deactivated"}!`);
        if (onStatusToggled) {
          onStatusToggled(data.data);
        }
        setIsConfirmOpen(false);
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
                {user.whatsapp ? `${user.countryCode || "+880"} ${user.whatsapp}` : "Not provided"}
              </span>
              {user.whatsapp && (
                <button
                  type="button"
                  onClick={() => handleCopy(`${user.countryCode || "+880"}${user.whatsapp}`, "Phone")}
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

        {/* Customer Stats & Fast Status Toggle */}
        <div className="p-4 rounded-2xl border border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Total Orders</span>
              <span className="font-extrabold text-base text-gray-900 font-mono">
                {user.totalOrders ?? orders.length ?? 0}
              </span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Total Spent</span>
              <span className="font-extrabold text-base text-gray-950 font-mono">
                ৳ {(user.totalSpent || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* User Order History Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <FiShoppingBag className="h-3.5 w-3.5 text-gray-400" />
            Order History ({orders.length})
          </h3>

          {loadingOrders ? (
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 text-center">
              <LuLoader className="h-5 w-5 animate-spin mx-auto text-(--primary)" />
              <p className="text-xs text-gray-400 mt-1">Loading customer orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 text-center text-xs text-gray-400">
              This user has not placed any orders yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto slim-scrollbar pr-1">
              {orders.map((ord) => {
                const ordCompleted = ord.orderStatus === "completed";
                const ordPending = ord.orderStatus === "pending";

                return (
                  <div
                    key={ord._id}
                    className="p-3 rounded-xl border border-gray-200/80 bg-white flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900">
                          {ord.orderId}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            ordCompleted
                              ? "bg-emerald-50 text-emerald-700"
                              : ordPending
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {formatDhakaDateTime(ord.createdAt)} • {ord.items?.length || 0} item(s)
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-gray-950">
                        ৳ {ord.totalAmount?.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-gray-400 block uppercase font-mono">
                        {ord.payment?.method}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleExecuteToggle}
        loading={togglingStatus}
        variant={isActive ? "danger" : "success"}
        title={isActive ? "Deactivate User Account?" : "Activate User Account?"}
        message={
          isActive
            ? `Are you sure you want to deactivate ${user.name}'s account? They will be logged out and cannot sign in.`
            : `Are you sure you want to activate ${user.name}'s account? The user will be able to sign in and use services.`
        }
        confirmText={isActive ? "Deactivate Account" : "Activate Account"}
      />
    </div>
  );
}
