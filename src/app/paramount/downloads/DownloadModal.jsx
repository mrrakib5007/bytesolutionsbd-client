"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  FiX,
  FiUploadCloud,
  FiCheck,
  FiFileText,
  FiLink,
  FiTag,
  FiLayers,
  FiMonitor,
  FiLock,
} from "react-icons/fi";
import { FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { LuLoader } from "react-icons/lu";
import { uploadImageToImgBB } from "@/utils/uploadImage";

const PLATFORM_OPTIONS = [
  "Windows",
  "macOS",
  "Android",
  "Linux",
  "All Platforms",
];

const CATEGORY_OPTIONS = [
  "Marketing & Sales",
  "Utilities & Tools",
  "Design & Media",
  "Productivity & Office",
  "Antivirus & Security",
  "Developer Utilities",
  "Other",
];

const DEFAULT_IMAGE = "https://i.ibb.co.com/Gv1GBtWZ/WA-Sender-Marketing-Tool-Offer.png";

function getInitialFormData(editingItem) {
  if (editingItem) {
    return {
      title: editingItem.title || "",
      slug: editingItem.slug || "",
      version: editingItem.version || "v1.0.0",
      fileSize: editingItem.fileSize || "15 MB",
      platform: editingItem.platform || "Windows",
      category: editingItem.category || "Marketing & Sales",
      image: editingItem.image || "",
      downloadUrl: editingItem.downloadUrl || "",
      externalUrl: editingItem.externalUrl || "",
      shortDescription: editingItem.shortDescription || "",
      description: editingItem.description || "",
      tags: Array.isArray(editingItem.tags)
        ? editingItem.tags.join(", ")
        : editingItem.tags || "",
      isFeatured: Boolean(editingItem.isFeatured),
      isActive: editingItem.isActive !== false,
      rating: typeof editingItem.rating === "number" ? editingItem.rating : 5,
      totalDownloads:
        typeof editingItem.totalDownloads === "number"
          ? editingItem.totalDownloads
          : 0,
      order: typeof editingItem.order === "number" ? editingItem.order : 0,
    };
  }
  return {
    title: "",
    slug: "",
    version: "v1.0.0",
    fileSize: "20 MB",
    platform: "Windows",
    category: "Marketing & Sales",
    image: "",
    downloadUrl: "",
    externalUrl: "",
    shortDescription: "",
    description: "",
    tags: "",
    isFeatured: false,
    isActive: true,
    rating: 5,
    totalDownloads: 0,
    order: 0,
  };
}

export default function DownloadModal({
  isOpen,
  onClose,
  onSaved,
  editingItem = null,
}) {
  const [prevItem, setPrevItem] = useState(editingItem);
  const [formData, setFormData] = useState(() => getInitialFormData(editingItem));
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});

  if (editingItem !== prevItem) {
    setPrevItem(editingItem);
    setFormData(getInitialFormData(editingItem));
    setErrors({});
  }

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "rating") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, rating: "" }));
      } else {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          const clamped = Math.min(5, Math.max(0, num));
          setFormData((prev) => ({ ...prev, rating: clamped }));
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadImageToImgBB(file);
      setFormData((prev) => ({ ...prev, image: url }));
      toast.success("Software icon uploaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Software title is required.";
    }
    if (!formData.downloadUrl.trim()) {
      newErrors.downloadUrl = "Download URL is required.";
    } else if (
      !formData.downloadUrl.startsWith("http://") &&
      !formData.downloadUrl.startsWith("https://")
    ) {
      newErrors.downloadUrl = "Must be a valid URL starting with http:// or https://";
    }

    const r = Number(formData.rating);
    if (formData.rating === "" || isNaN(r) || r < 0 || r > 5) {
      newErrors.rating = "Rating must be between 0 and 5.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      const url = editingItem
        ? `${API_BASE_URL}/admin/downloads/${editingItem._id}`
        : `${API_BASE_URL}/admin/downloads`;

      const method = editingItem ? "PUT" : "POST";

      // Prepare payload (strictly omit totalDownloads so it cannot be tampered with)
      const payload = {
        ...formData,
        rating: Number(formData.rating) || 0,
        order: Number(formData.order) || 0,
      };
      delete payload.totalDownloads;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save software download.");
      }

      toast.success(
        editingItem
          ? "Software download updated successfully!"
          : "Software download created successfully!"
      );
      onSaved(data.data);
      onClose();
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {editingItem ? "Edit Software Download" : "Add New Software Download"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure software package, version, OS compatibility, and download URL.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl transition-all cursor-pointer"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Title & Version */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Software Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. WhatsApp Marketing Sender Pro"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-gray-50/50 focus:bg-white outline-none transition-all ${
                  errors.title
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-gray-200 focus:border-(--primary)"
                }`}
              />
              {errors.title && (
                <p className="text-[11px] font-semibold text-rose-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Version <span className="text-gray-400 font-normal">(e.g. v4.8)</span>
              </label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                placeholder="v1.0.0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all"
              />
            </div>
          </div>

          {/* Platform, Category & File Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-gray-700">
                <FiMonitor className="h-3 w-3 text-gray-400" /> Platform / OS
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all cursor-pointer font-medium"
              >
                {PLATFORM_OPTIONS.map((plat) => (
                  <option key={plat} value={plat}>
                    {plat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-gray-700">
                <FiLayers className="h-3 w-3 text-gray-400" /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all cursor-pointer font-medium"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                File Size <span className="text-gray-400 font-normal">(MB / GB)</span>
              </label>
              <input
                type="text"
                name="fileSize"
                value={formData.fileSize}
                onChange={handleChange}
                placeholder="e.g. 45.2 MB"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all font-mono"
              />
            </div>
          </div>

          {/* Download URL & External Documentation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-gray-700">
                <FiLink className="h-3 w-3 text-(--primary)" /> Download Link (Direct / Drive){" "}
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                name="downloadUrl"
                value={formData.downloadUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/... or direct link"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-gray-50/50 focus:bg-white outline-none transition-all font-mono ${
                  errors.downloadUrl
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-gray-200 focus:border-(--primary)"
                }`}
              />
              {errors.downloadUrl && (
                <p className="text-[11px] font-semibold text-rose-500">{errors.downloadUrl}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Official Site / Documentation <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                name="externalUrl"
                value={formData.externalUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all font-mono"
              />
            </div>
          </div>

          {/* Image / Icon Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">
              Software Icon / Logo
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Preview Avatar */}
              <div className="relative h-14 w-14 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                <Image
                  src={formData.image || DEFAULT_IMAGE}
                  alt="Icon Preview"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              {/* Upload or URL */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Enter icon image URL or upload..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all font-mono"
                  />

                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors cursor-pointer shrink-0">
                    {uploadingImage ? (
                      <LuLoader className="h-3.5 w-3.5 animate-spin text-(--primary)" />
                    ) : (
                      <FiUploadCloud className="h-3.5 w-3.5 text-gray-500" />
                    )}
                    <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Short Description <span className="text-gray-400 font-normal">(Card display)</span>
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="e.g. Automated bulk WhatsApp messaging and contact extractor."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all"
            />
          </div>

          {/* Full Description & Instructions */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-bold text-gray-700">
              <FiFileText className="h-3 w-3 text-gray-400" /> Installation Guide & Details
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Provide installation steps, system requirements, or feature details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all"
            />
          </div>

          {/* Tags & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-gray-700">
                <FiTag className="h-3 w-3 text-gray-400" /> Tags{" "}
                <span className="text-gray-400 font-normal">(Comma-separated)</span>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="whatsapp, marketing, automation, tool"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min={0}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all font-mono"
              />
            </div>
          </div>

          {/* Rating & Total Downloads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rating Number Input + Live Dynamic Star Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700">
                  Rating (0.0 - 5.0)
                </label>
                <span className="text-[11px] font-mono font-bold text-(--primary)">
                  {(Number(formData.rating) || 0).toFixed(1)} / 5.0
                </span>
              </div>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min={0}
                max={5}
                step={0.1}
                placeholder="5.0"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-gray-50/50 focus:bg-white outline-none transition-all font-mono font-bold ${
                  errors.rating
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-(--primary)"
                }`}
              />

              {/* Dynamic Live Star Rating Preview */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const currentRating = Number(formData.rating) || 0;
                    if (currentRating >= star) {
                      return (
                        <FaStar
                          key={star}
                          className="h-3.5 w-3.5 text-amber-400 fill-amber-400"
                        />
                      );
                    } else if (currentRating >= star - 0.5) {
                      return (
                        <FaStarHalfStroke
                          key={star}
                          className="h-3.5 w-3.5 text-amber-400 fill-amber-400"
                        />
                      );
                    } else {
                      return (
                        <FaStar
                          key={star}
                          className="h-3.5 w-3.5 text-gray-200 fill-gray-200"
                        />
                      );
                    }
                  })}
                </div>
                <span className="text-[11px] font-medium text-gray-500">
                  Live Star Preview
                </span>
              </div>
              {errors.rating && (
                <p className="text-[11px] text-red-500">{errors.rating}</p>
              )}
            </div>

            {/* Total Downloads: System Tracked & Non-Editable by Admin */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700">
                  Total Downloads Count
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200/80">
                  <FiLock className="h-2.5 w-2.5 text-gray-400" />
                  System Tracked
                </span>
              </div>
              <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100/90 text-xs font-mono font-bold text-gray-700 flex items-center justify-between cursor-not-allowed select-none">
                <span>
                  {Number(formData.totalDownloads || 0).toLocaleString()} Downloads
                </span>
                <span className="text-[10px] font-semibold text-gray-400">
                  Read-only
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                Increments automatically on every user download. Not manually editable.
              </p>
            </div>
          </div>

          {/* Toggles: Featured & Active */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded text-(--primary) focus:ring-(--primary) h-4 w-4"
              />
              <span className="text-xs font-bold text-gray-700">Active & Visible in Downloads</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
              />
              <span className="text-xs font-bold text-gray-700">Featured Download Badge</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <LuLoader className="h-4 w-4 animate-spin" />
              ) : (
                <FiCheck className="h-4 w-4" />
              )}
              <span>{saving ? "Saving..." : editingItem ? "Update Software" : "Add Software"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
