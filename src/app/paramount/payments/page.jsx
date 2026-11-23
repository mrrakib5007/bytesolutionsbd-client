"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  FiCreditCard,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";
import PaymentMethodModal from "./PaymentMethodModal";
import ConfirmModal from "@/components/Shared/ConfirmModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPaymentMethodsPage() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedInstructions, setExpandedInstructions] = useState({});

  // Fetch payment methods
  const fetchMethods = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/payment-methods`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = typeof data?.message === "string" ? data.message : "Failed to load payment methods.";
        throw new Error(msg);
      }

      setMethods(Array.isArray(data.data) ? data.data : []);
      setError(null);
    } catch (err) {
      console.error("Fetch payment methods error:", err);
      const errorMsg = typeof err?.message === "string" ? err.message : "Failed to load payment methods.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    let ignore = false;

    fetch(`${API_BASE_URL}/admin/payment-methods`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore) {
          if (data?.success && Array.isArray(data.data)) {
            setMethods(data.data);
            setError(null);
          } else {
            const errorMsg = typeof data?.message === "string" ? data.message : "Failed to load payment methods.";
            setError(errorMsg);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          const errorMsg = typeof err?.message === "string" ? err.message : "Failed to load payment methods.";
          setError(errorMsg);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Copy number helper
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Number copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle active status
  const handleToggleStatus = async (method) => {
    try {
      setTogglingId(method._id);
      const res = await fetch(
        `${API_BASE_URL}/admin/payment-methods/${method._id}/toggle-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to toggle status.");
      }

      setMethods((prev) =>
        prev.map((item) =>
          item._id === method._id
            ? { ...item, isActive: data.data.isActive }
            : item
        )
      );

      toast.success(
        `${method.name} is now ${data.data.isActive ? "active" : "inactive"}!`
      );
    } catch (err) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const res = await fetch(
        `${API_BASE_URL}/admin/payment-methods/${deleteTarget._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete payment method.");
      }

      setMethods((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      toast.success(`${deleteTarget.name} deleted successfully.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete payment method.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-(--primary)/10 text-(--primary)">
              <FiCreditCard className="h-5 w-5" />
            </div>
            <span>Payment Methods</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Add, update, or configure payment gateways.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              setEditingMethod(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--primary) text-xs font-bold text-white shadow-xs hover:bg-(--primary-hover) transition-all cursor-pointer"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add Payment Method</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="rounded-3xl border border-gray-200/80 bg-white p-12 text-center shadow-xs">
          <LuLoader className="h-8 w-8 animate-spin text-(--primary) mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-500">
            Loading payment methods...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-3">
          <FiAlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
          <p className="text-sm font-bold text-rose-800">{String(error || "An error occurred")}</p>
          <button
            type="button"
            onClick={() => fetchMethods(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : methods.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-xs space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-gray-50 text-gray-400">
            <FiCreditCard className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            No Payment Methods Found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Add payment methods (like bKash, Nagad, Rocket, Bank) so your customers can send payments during checkout.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingMethod(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--primary) text-xs font-bold text-white shadow-xs hover:bg-(--primary-hover) transition-all cursor-pointer"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add First Method</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {methods.map((method) => {
            const isExpanded = expandedInstructions[method._id];
            const isToggling = togglingId === method._id;

            return (
              <div
                key={method._id}
                className={`flex flex-col rounded-3xl border transition-all duration-200 bg-white shadow-xs overflow-hidden ${
                  method.isActive !== false
                    ? "border-gray-200/90 hover:shadow-md"
                    : "border-gray-200/50 opacity-75 bg-gray-50/50"
                }`}
              >
                {/* Accent Top Border */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: method.color || "#10B981" }}
                />

                <div className="p-5 flex-1 flex flex-col space-y-4">
                  {/* Top: Logo & Name + Status Toggle */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Logo or Icon */}
                      <div className="relative h-12 w-12 rounded-2xl bg-gray-50 border border-gray-200/80 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                        {method.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={method.logo}
                            alt={method.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <FiCreditCard
                            className="h-6 w-6"
                            style={{ color: method.color || "#10B981" }}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-extrabold text-gray-900 truncate">
                          {method.name}
                        </h3>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700 uppercase tracking-wider">
                          {method.typeLabel || method.type || "Personal"}
                        </span>
                      </div>
                    </div>

                    {/* Active Status Switch */}
                    <div className="flex flex-col items-end shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(method)}
                        disabled={isToggling}
                        className="cursor-pointer"
                        title={
                          method.isActive !== false
                            ? "Click to deactivate"
                            : "Click to activate"
                        }
                      >
                        <div
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                            method.isActive !== false
                              ? "bg-(--primary) justify-end"
                              : "bg-gray-300 justify-start"
                          }`}
                        >
                          <div className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                        </div>
                      </button>
                      <span className="text-[10px] font-semibold text-gray-400 mt-1">
                        {method.isActive !== false ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  {/* Account / Mobile Number Box */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Account / Number
                      </span>
                      <div className="font-mono font-bold text-sm text-gray-900 truncate">
                        {method.number}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(method._id, method.number)}
                      className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                      title="Copy number"
                    >
                      {copiedId === method._id ? (
                        <FiCheck className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <FiCopy className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Instructions snippet / toggle */}
                  {method.instructions ? (
                    <div className="rounded-2xl border border-gray-100 bg-slate-50/70 p-3 text-xs space-y-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedInstructions((prev) => ({
                            ...prev,
                            [method._id]: !prev[method._id],
                          }))
                        }
                        className="w-full flex items-center justify-between text-[11px] font-bold text-gray-700 hover:text-gray-900 cursor-pointer"
                      >
                        <span>How to Pay Instructions</span>
                        {isExpanded ? (
                          <FiChevronUp className="h-3.5 w-3.5 text-gray-400" />
                        ) : (
                          <FiChevronDown className="h-3.5 w-3.5 text-gray-400" />
                        )}
                      </button>

                      {isExpanded ? (
                        <p className="font-mono text-[11px] text-gray-600 whitespace-pre-line leading-relaxed pt-1 border-t border-gray-200/60">
                          {method.instructions}
                        </p>
                      ) : (
                        <p className="font-mono text-[11px] text-gray-500 truncate">
                          {method.instructions.split("\n")[0]}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-gray-400 italic">
                      No instructions set.
                    </div>
                  )}

                  {/* Bottom: Action buttons */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2 mt-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMethod(method);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(method)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-100 bg-rose-50/50 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create & Edit Modal */}
      {isModalOpen && (
        <PaymentMethodModal
          key={editingMethod?._id || "new"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          paymentMethod={editingMethod}
          onSuccess={(saved) => {
            if (editingMethod) {
              setMethods((prev) =>
                prev.map((m) => (m._id === saved._id ? saved : m))
              );
            } else {
              setMethods((prev) => [...prev, saved]);
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title={`Delete ${deleteTarget.name}?`}
          message={`Are you sure you want to permanently delete this payment method (${deleteTarget.name} - ${deleteTarget.number})? Customers will no longer see this option at checkout.`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          variant="danger"
          loading={deleting}
        />
      )}
    </div>
  );
}
