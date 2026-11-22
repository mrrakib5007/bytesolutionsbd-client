"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FiX,
  FiUploadCloud,
  FiCreditCard,
  FiFileText,
  FiHash,
  FiPhone,
  FiAlertCircle,
  FiCheck,
  FiTrash2,
  FiLink,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";
import toast from "react-hot-toast";
import { uploadImageToImgBB } from "@/utils/uploadImage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

const PRESET_METHODS = [
  {
    name: "bKash",
    type: "personal",
    typeLabel: "Personal (Send Money)",
    color: "#E2136E",
    logo: "https://i.ibb.co/sJtwp7H2/1ad05e96321b.png",
  },
  {
    name: "Nagad",
    type: "personal",
    typeLabel: "Personal (Send Money)",
    color: "#F7931E",
    logo: "https://i.ibb.co/hFZ3d52f/bc0a4b8d9c53.png",
  },
  {
    name: "Rocket",
    type: "personal",
    typeLabel: "Personal (Send Money)",
    color: "#8C3494",
    logo: "",
  },
  {
    name: "Upay",
    type: "personal",
    typeLabel: "Personal (Send Money)",
    color: "#005696",
    logo: "",
  },
  {
    name: "Bank Transfer",
    type: "merchant",
    typeLabel: "Bank Account",
    color: "#059669",
    logo: "",
  },
];

const PRESET_TYPES = [
  { value: "personal", label: "Personal (Send Money)" },
  { value: "agent", label: "Agent (Cash Out)" },
  { value: "merchant", label: "Merchant (Payment)" },
  { value: "other", label: "Custom / Other" },
];

function getInitialFormData(paymentMethod) {
  if (paymentMethod) {
    return {
      name: paymentMethod.name || "",
      number: paymentMethod.number || "",
      type: paymentMethod.type || "personal",
      typeLabel: paymentMethod.typeLabel || "Personal (Send Money)",
      logo: paymentMethod.logo || "",
      color: paymentMethod.color || "#10B981",
      instructions: paymentMethod.instructions || "",
      isActive: paymentMethod.isActive !== false,
      order: paymentMethod.order || 0,
    };
  }
  return {
    name: "",
    number: "",
    type: "personal",
    typeLabel: "Personal (Send Money)",
    logo: "",
    color: "#10B981",
    instructions: "",
    isActive: true,
    order: 0,
  };
}

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onSuccess,
  paymentMethod = null,
}) {
  const isEditing = Boolean(paymentMethod);

  const [formData, setFormData] = useState(() =>
    getInitialFormData(paymentMethod)
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  // Handle Preset Selection
  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      type: preset.type,
      typeLabel: preset.typeLabel,
      color: preset.color,
      logo: preset.logo || prev.logo,
    }));
  };

  // Type change helper
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    const matchedPreset = PRESET_TYPES.find((t) => t.value === selectedType);
    setFormData((prev) => ({
      ...prev,
      type: selectedType,
      typeLabel: matchedPreset ? matchedPreset.label : prev.typeLabel,
    }));
  };

  // Image file upload via ImgBB
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setFormError("");
      const uploadedUrl = await uploadImageToImgBB(file);
      setFormData((prev) => ({ ...prev, logo: uploadedUrl }));
      toast.success("Logo uploaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to upload logo.");
      setFormError(err.message || "Logo upload failed.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // Auto-generate instructions template
  const handleInsertDefaultInstructions = () => {
    const name = formData.name.trim() || "Payment";
    const number = formData.number.trim() || "[ACCOUNT_NUMBER]";
    const action =
      formData.type === "agent"
        ? "Cash Out"
        : formData.type === "merchant"
        ? "Payment / Make Payment"
        : "Send Money";

    const template = `1. Open your ${name} Mobile App or dial USSD code.\n2. Choose '${action}' option.\n3. Enter our ${formData.typeLabel || name} Number: ${number}.\n4. Enter the exact Total Order Amount.\n5. Enter reference (e.g. your name or order).\n6. Enter your PIN to confirm the transaction.\n7. Copy the Transaction ID (TrxID) and enter it below.`;

    setFormData((prev) => ({ ...prev, instructions: template }));
    toast.success("Default instruction template inserted!");
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError("Payment method name is required.");
      return;
    }

    if (!formData.number.trim()) {
      setFormError("Account / wallet number is required.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const url = isEditing
        ? `${API_BASE_URL}/admin/payment-methods/${paymentMethod._id}`
        : `${API_BASE_URL}/admin/payment-methods`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save payment method.");
      }

      toast.success(
        isEditing
          ? "Payment method updated successfully!"
          : "Payment method created successfully!"
      );
      onSuccess?.(data.data);
      onClose();
    } catch (err) {
      console.error("Save payment method error:", err);
      setFormError(err.message || "Failed to save payment method.");
      toast.error(err.message || "Failed to save payment method.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--primary)/10 text-(--primary)">
              <FiCreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isEditing ? "Edit Payment Method" : "Add New Payment Method"}
              </h2>
              <p className="text-xs text-gray-500">
                Configure payment gateways, instructions, and account details shown to customers.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {formError && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <FiAlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Quick Presets for BD Gateways */}
          {!isEditing && (
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Quick BD Presets:
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_METHODS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Method Name & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">
                Method Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. bKash, Nagad, Rocket, Bank"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">
                Account Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={handleTypeChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-all"
              >
                {PRESET_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Number & Type Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-gray-900 mb-1.5">
                <FiPhone className="h-3.5 w-3.5 text-gray-500" />
                <span>Account / Mobile Number</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.number}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, number: e.target.value }))
                }
                placeholder="e.g. 01834923304"
                className="w-full font-mono rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">
                Type Display Badge
              </label>
              <input
                type="text"
                value={formData.typeLabel}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, typeLabel: e.target.value }))
                }
                placeholder="e.g. Personal (Send Money)"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-all"
              />
            </div>
          </div>

          {/* Logo / Icon Upload & URL */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5">
              Payment Method Logo / Icon
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* File Upload Button */}
              <div className="sm:col-span-4">
                <label className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 text-xs font-semibold text-gray-700 cursor-pointer transition-colors">
                  {uploadingImage ? (
                    <>
                      <LuLoader className="h-4 w-4 animate-spin text-(--primary)" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FiUploadCloud className="h-4 w-4 text-(--primary)" />
                      <span>Upload Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {/* URL Input */}
              <div className="sm:col-span-8 flex items-center gap-2">
                <div className="relative flex-1">
                  <FiLink className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, logo: e.target.value }))
                    }
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3.5 py-2.5 text-xs text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-all"
                  />
                </div>
                {formData.logo && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, logo: "" }))}
                    className="p-2.5 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Remove logo"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Logo Preview */}
            {formData.logo && (
              <div className="mt-2.5 flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <div className="relative h-10 w-16 bg-white rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-[11px] text-gray-500 truncate flex-1">
                  {formData.logo}
                </div>
              </div>
            )}
          </div>

          {/* Color & Sort Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">
                Brand / Accent Color
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="h-10 w-14 rounded-xl border border-gray-200 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="flex-1 font-mono uppercase rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-gray-900 mb-1.5">
                <FiHash className="h-3.5 w-3.5 text-gray-500" />
                <span>Display Order</span>
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-all"
              />
            </div>
          </div>

          {/* How to Pay Instructions */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-gray-900">
                <FiFileText className="h-3.5 w-3.5 text-gray-500" />
                <span>How to Pay Instructions</span>
              </label>
              <button
                type="button"
                onClick={handleInsertDefaultInstructions}
                className="text-[11px] font-bold text-(--primary) hover:underline cursor-pointer"
              >
                + Insert Default Template
              </button>
            </div>
            <textarea
              rows={5}
              value={formData.instructions}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, instructions: e.target.value }))
              }
              placeholder="Step-by-step payment instructions shown to customer on checkout..."
              className="w-full rounded-xl border border-gray-200 bg-white p-3.5 text-xs text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-all font-mono leading-relaxed"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Customers will see these exact instructions when they select this payment option.
            </p>
          </div>

          {/* Active Status Switch */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-900 block">
                Enable for Customer Checkout
              </span>
              <span className="text-[11px] text-gray-500">
                When active, customers can select this payment method during checkout.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--primary)"></div>
            </label>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-slate-50/60 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || uploadingImage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--primary) text-xs font-bold text-white shadow-xs hover:bg-(--primary-hover) transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <LuLoader className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiCheck className="h-4 w-4" />
                <span>{isEditing ? "Save Changes" : "Create Payment Method"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
