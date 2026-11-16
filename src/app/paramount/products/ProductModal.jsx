"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FiX,
  FiUploadCloud,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiLink,
  FiAlertCircle,
  FiStar,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { uploadImageToImgBB } from "@/utils/uploadImage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const PRESET_CATEGORIES = [
  "Marketing & Sales",
  "AI & Design",
  "VPN & Security",
  "Software & Tools",
  "Streaming & Entertainment",
  "Developer Tools",
  "Other",
];

const PRESET_BADGES = [
  "Instant Dispatch",
  "Hot Deal",
  "Best Seller",
  "Top Rated",
  "Verified License",
  "Special Offer",
];

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getInitialFormData(product) {
  if (product) {
    return {
      title: product.title || "",
      slug: product.slug || "",
      category: product.category || "Marketing & Sales",
      badge: product.badge || "",
      discount: product.discount || "",
      rating: product.rating ?? 5.0,
      reviewsCount: product.reviewsCount ?? 0,
      image: product.image || "",
      shortDescription: product.shortDescription || "",
      longDescription: product.longDescription || "",
      features: Array.isArray(product.features) ? [...product.features] : [],
      variants:
        Array.isArray(product.variants) && product.variants.length > 0
          ? product.variants.map((v) => ({ ...v }))
          : [
              {
                id: "plan-1",
                name: "Standard License",
                duration: "1 Month",
                price: 499,
                originalPrice: 799,
              },
            ],
    };
  }
  return {
    title: "",
    slug: "",
    category: "Marketing & Sales",
    badge: "Instant Dispatch",
    discount: "Save 30%",
    rating: 5.0,
    reviewsCount: 30,
    image: "",
    shortDescription: "",
    longDescription: "",
    features: [
      "Instant delivery via WhatsApp & Email",
      "100% genuine and verified license",
      "Full validity guarantee with 24/7 support",
    ],
    variants: [
      {
        id: `plan-${Date.now()}`,
        name: "1 Month License",
        duration: "1 Month",
        price: 499,
        originalPrice: 799,
      },
    ],
  };
}

function ProductForm({ product, onClose, onSuccess }) {
  const isEditing = Boolean(product);
  const [formData, setFormData] = useState(() => getInitialFormData(product));
  const [autoSlug, setAutoSlug] = useState(!product);
  const [newFeature, setNewFeature] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Title change with auto-slug
  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: titleVal,
      slug: autoSlug ? generateSlug(titleVal) : prev.slug,
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
      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
      toast.success("Image uploaded to ImgBB successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to upload image.");
      setFormError(err.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // Features list handlers
  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature("");
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Variants handlers
  const handleAddVariant = () => {
    const newVariant = {
      id: `plan-${Date.now()}`,
      name: "1 Year License",
      duration: "1 Year",
      price: 1200,
      originalPrice: 1999,
    };
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  const handleUpdateVariant = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = {
        ...updated[index],
        [field]:
          field === "price" || field === "originalPrice"
            ? value === ""
              ? ""
              : Number(value)
            : value,
      };
      return { ...prev, variants: updated };
    });
  };

  const handleRemoveVariant = (index) => {
    if (formData.variants.length <= 1) {
      toast.error("Product must have at least one pricing variant.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Product title is required.");
      return;
    }

    if (!formData.image.trim()) {
      setFormError("Please upload or provide a product image URL.");
      return;
    }

    if (!formData.variants || formData.variants.length === 0) {
      setFormError("Please add at least one pricing variant.");
      return;
    }

    // Validate prices
    for (const v of formData.variants) {
      if (!v.duration || !v.duration.trim()) {
        setFormError("Each plan must have a duration (e.g., '1 Month').");
        return;
      }
      if (typeof v.price !== "number" || isNaN(v.price) || v.price < 0) {
        setFormError("Each plan must have a valid price.");
        return;
      }
    }

    try {
      setSubmitting(true);
      const productId = product?._id || product?.id;

      if (isEditing && !productId) {
        setFormError("Product ID is missing. Please close modal and try again.");
        return;
      }

      const url = isEditing
        ? `${API_BASE_URL}/admin/products/${productId}`
        : `${API_BASE_URL}/admin/products`;

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
        throw new Error(data.message || "Failed to save product.");
      }

      toast.success(
        isEditing
          ? "Product updated successfully!"
          : "New product created successfully!"
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Save product error:", err);
      const errorMsg =
        err.message === "Failed to fetch"
          ? "Network error: Unable to connect to backend server. Please check connection."
          : err.message || "Failed to save product.";
      setFormError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-3xl my-8 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {isEditing ? "Edit Product" : "Add New Digital Product"}
          </h3>
          <p className="text-xs text-gray-500">
            {isEditing
              ? "Update pricing, license details, and catalog availability"
              : "Create a new license offering for your store catalog"}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable Form Body */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        {formError && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            <FiAlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-1.5">
            1. Basic Information
          </h4>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. WA Sender Marketing Suite"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  SEO Slug (URL Path)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAutoSlug(true);
                    setFormData((p) => ({ ...p, slug: generateSlug(p.title) }));
                  }}
                  className="text-[10px] text-(--primary) hover:underline font-semibold cursor-pointer"
                >
                  Auto-generate
                </button>
              </div>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData((p) => ({ ...p, slug: generateSlug(e.target.value) }));
                }}
                placeholder="wa-sender-marketing-suite"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary)"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Store link: /products/{formData.slug || "slug"}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Category
              </label>
              <div className="space-y-1.5">
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary)"
                >
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Badge Tag
              </label>
              <input
                type="text"
                list="badge-options"
                value={formData.badge}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, badge: e.target.value }))
                }
                placeholder="e.g. Instant Dispatch"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary)"
              />
              <datalist id="badge-options">
                {PRESET_BADGES.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Discount Text
              </label>
              <input
                type="text"
                value={formData.discount}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, discount: e.target.value }))
                }
                placeholder="e.g. Save 30%"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary)"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-1.5">
                <FiStar className="h-3 w-3 text-amber-500 fill-amber-400" />
                Rating & Reviews
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      rating: Number(e.target.value),
                    }))
                  }
                  className="w-20 px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 text-center"
                  placeholder="5.0"
                />
                <input
                  type="number"
                  min="0"
                  value={formData.reviewsCount}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      reviewsCount: Number(e.target.value),
                    }))
                  }
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 text-center"
                  placeholder="Reviews (e.g. 120)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Product Image & Upload */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-1.5">
            2. Product Image
          </h4>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Preview Thumbnail */}
            <div className="relative h-28 w-36 shrink-0 rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt="Product preview"
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              ) : (
                <div className="text-center p-2 text-gray-400">
                  <FiUploadCloud className="h-6 w-6 mx-auto mb-1 text-gray-300" />
                  <span className="text-[10px]">No image</span>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-2.5 w-full">
              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition-colors cursor-pointer border border-gray-200">
                  <FiUploadCloud className="h-4 w-4 text-(--primary)" />
                  <span>
                    {uploadingImage ? "Uploading to ImgBB..." : "Upload from Device (ImgBB)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                <span className="block text-[11px] text-gray-500 mt-1">
                  Uploads directly to your ImgBB hosting. <strong className="text-gray-700">Recommended: 950 × 700 px (approx. 4:3 ratio)</strong> for perfect fit without cropping.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <FiLink className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, image: e.target.value }))
                    }
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary)"
                  />
                </div>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, image: "" }))}
                    className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Clear image"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Descriptions */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-1.5">
            3. Descriptions & Details
          </h4>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Short Description (Cards, WhatsApp & SEO)
            </label>
            <textarea
              rows={2}
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  shortDescription: e.target.value,
                }))
              }
              placeholder="Brief summary of the digital license, instant dispatch warranty, and key offering."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary)"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Long Description (Product Details Page)
            </label>
            <textarea
              rows={4}
              value={formData.longDescription}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  longDescription: e.target.value,
                }))
              }
              placeholder="Comprehensive overview, activation steps, system requirements, and policy terms."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary)"
            />
          </div>

          {/* Bullet Point Features */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Key Features (Bullet Points)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="e.g. 100% Genuine License Key with instant delivery"
                className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary)"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition-colors cursor-pointer shrink-0"
              >
                <FiPlus className="h-3.5 w-3.5 inline mr-1" /> Add
              </button>
            </div>

            <div className="space-y-1.5">
              {formData.features.map((feat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200/80 text-xs text-gray-800"
                >
                  <span className="flex items-center gap-2">
                    <FiCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    {feat}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-gray-400 hover:text-rose-600 p-0.5 cursor-pointer"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Pricing Variants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              4. License Plans & Pricing Variants
            </h4>
            <button
              type="button"
              onClick={handleAddVariant}
              className="inline-flex items-center gap-1 text-xs font-bold text-(--primary) hover:underline cursor-pointer"
            >
              <FiPlus className="h-3.5 w-3.5" /> Add Another Plan
            </button>
          </div>

          <div className="space-y-3">
            {formData.variants.map((variant, index) => (
              <div
                key={variant.id || index}
                className="p-3.5 rounded-2xl border border-gray-200/90 bg-gray-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">
                    Plan #{index + 1}
                  </span>
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="text-xs text-rose-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <FiTrash2 className="h-3 w-3" /> Remove Plan
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Duration / Label
                    </label>
                    <input
                      type="text"
                      value={variant.duration || ""}
                      onChange={(e) =>
                        handleUpdateVariant(index, "duration", e.target.value)
                      }
                      placeholder="e.g. 1 Month / 1 Year"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-(--primary)"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Selling Price (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={variant.price === "" ? "" : variant.price}
                      onChange={(e) =>
                        handleUpdateVariant(index, "price", e.target.value)
                      }
                      placeholder="499"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-(--primary)"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Regular Price (৳) [Optional]
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={variant.originalPrice === "" ? "" : variant.originalPrice || ""}
                      onChange={(e) =>
                        handleUpdateVariant(index, "originalPrice", e.target.value)
                      }
                      placeholder="799"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-(--primary)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="shrink-0 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="px-6 py-2.5 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-xs font-bold text-white shadow-xs transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Saving Product...</span>
              </>
            ) : (
              <span>{isEditing ? "Update Product" : "Publish Product"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProductModal({
  isOpen,
  onClose,
  product = null,
  onSuccess,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <ProductForm
        key={product?._id || "new-product"}
        product={product}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </div>
  );
}
