"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  FiX,
  FiUploadCloud,
  FiUser,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { LuLoader } from "react-icons/lu";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { uploadImageToImgBB } from "@/utils/uploadImage";
import { COUNTRY_CONFIGS } from "@/utils/countryConfig";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const DEFAULT_IMAGE = "https://i.ibb.co.com/ycfgs7BG/profile.jpg";

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  // Initialize form state from user on mount
  const [formData, setFormData] = useState(() => ({
    name: user?.name || "",
    countryCode: user?.countryCode || "+880",
    whatsapp: user?.whatsapp || "",
    imageUrl: user?.image || DEFAULT_IMAGE,
  }));
  const [imagePreview, setImagePreview] = useState(
    () => user?.image || DEFAULT_IMAGE
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const currentCountryConfig =
    COUNTRY_CONFIGS[formData.countryCode] || COUNTRY_CONFIGS["+880"];

  // Handle image upload to ImgBB
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show immediate local preview
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setError("");

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImageToImgBB(file);
      setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      setImagePreview(uploadedUrl);
      toast.success("Photo uploaded to ImgBB!");
    } catch (err) {
      setError(err.message || "Failed to upload image. Please try again.");
      toast.error(err.message || "Image upload failed");
      // Revert preview to previous image
      setImagePreview(formData.imageUrl || DEFAULT_IMAGE);
    } finally {
      setIsUploading(false);
    }
  };

  const handleWhatsappChange = (e) => {
    const numeric = e.target.value.replace(/\D/g, "");
    if (numeric.length <= currentCountryConfig.maxDigits) {
      setFormData((prev) => ({ ...prev, whatsapp: numeric }));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.whatsapp.trim()) {
      setError("Please enter your WhatsApp number.");
      return;
    }

    if (formData.whatsapp.length < currentCountryConfig.minDigits) {
      setError(
        `WhatsApp number must be at least ${currentCountryConfig.minDigits} digits.`
      );
      return;
    }

    try {
      setIsSaving(true);

      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name.trim(),
          image: formData.imageUrl || DEFAULT_IMAGE,
          whatsapp: formData.whatsapp.trim(),
          countryCode: formData.countryCode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile.");
      }

      await refreshUser();
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
      toast.error(err.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-gray-100 z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Edit Your Profile
            </h3>
            <p className="text-xs text-gray-500">
              Update your photo, name and WhatsApp contact
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 border border-rose-200">
            <FiAlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Photo Upload Section */}
          <div className="flex flex-col items-center text-center">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-(--primary) shadow-md mb-2">
              <Image
                src={imagePreview || DEFAULT_IMAGE}
                alt="Profile Preview"
                fill
                sizes="80px"
                className="object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                  <LuLoader className="h-5 w-5 animate-spin" />
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-(--primary) hover:underline cursor-pointer disabled:opacity-50"
            >
              <FiUploadCloud className="h-3.5 w-3.5" />
              <span>
                {isUploading ? "Uploading to ImgBB..." : "Change Photo"}
              </span>
            </button>
            <span className="text-[10px] text-gray-400 mt-0.5">
              PNG, JPG, or WEBP (Max 5MB)
            </span>
          </div>

          {/* Full Name Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiUser className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-3 pl-9 text-xs text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/15"
              />
            </div>
          </div>

          {/* WhatsApp Field with Country Code */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              WhatsApp Number
            </label>
            <div className="flex gap-2">
              <select
                value={formData.countryCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    countryCode: e.target.value,
                    whatsapp: "",
                  }))
                }
                className="w-32 rounded-xl border border-gray-200 bg-white py-2.5 px-2.5 text-xs font-semibold text-gray-800 outline-none transition-all focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/15 cursor-pointer"
              >
                {Object.entries(COUNTRY_CONFIGS).map(([code, config]) => (
                  <option key={code} value={code}>
                    {config.code} ({config.label})
                  </option>
                ))}
              </select>

              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                  <FaWhatsapp className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={handleWhatsappChange}
                  placeholder={currentCountryConfig.placeholder}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-3 pl-9 text-xs font-mono text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/15"
                />
              </div>
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              Format: {currentCountryConfig.code}{" "}
              {currentCountryConfig.example} (
              {currentCountryConfig.minDigits} digits)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving || isUploading}
              className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-(--primary) py-2.5 text-xs font-bold text-white shadow-xs hover:bg-(--primary-hover) transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <LuLoader className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiCheck className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
