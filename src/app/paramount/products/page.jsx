"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiPackage,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiRefreshCw,
  FiStar,
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiTag,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import ProductModal from "./ProductModal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all products
  const fetchProducts = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load products list.");
      }

      setProducts(Array.isArray(data.data) ? data.data : []);
      if (isManual) {
        toast.success("Product catalog refreshed!");
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      setError(err.message || "Failed to load products.");
      if (isManual) {
        toast.error(err.message || "Refresh failed.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch with clean async cancellation flag
  useEffect(() => {
    let ignore = false;

    fetch(`${API_BASE_URL}/admin/products`, {
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
            setProducts(data.data);
            setError(null);
          } else {
            setError(data?.message || "Failed to load products list.");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Fetch products error:", err);
          setError("Failed to connect to backend server.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Category list derived from products
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Open Add Product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Open Edit Product
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const targetId = deleteTarget._id || deleteTarget.id;

      const res = await fetch(
        `${API_BASE_URL}/admin/products/${targetId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product.");
      }

      toast.success(`"${deleteTarget.title}" deleted successfully!`);
      setProducts((prev) =>
        prev.filter((p) => (p._id || p.id) !== targetId)
      );
      setDeleteTarget(null);
    } catch (err) {
      const msg =
        err.message === "Failed to fetch"
          ? "Network error: Unable to connect to backend server."
          : err.message || "Could not delete product.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
              Products Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {products.length} Products
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Create, edit, price, and maintain digital licenses and software keys
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchProducts(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 border border-gray-200 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            title="Refresh product list"
          >
            <FiRefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, slug, or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary)"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills / Dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <FiTag className="h-3.5 w-3.5 text-gray-400 shrink-0 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)/30 focus:border-(--primary)"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="flex items-center justify-between rounded-2xl bg-rose-50 p-4 border border-rose-200 text-xs text-rose-700">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchProducts(true)}
            className="font-bold underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Table / Product List */}
      {loading ? (
        <div className="p-16 rounded-2xl border border-gray-200/80 bg-white flex items-center justify-center">
          <Loading />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-gray-300 bg-white space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400">
            <FiPackage className="h-8 w-8" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">
            {searchTerm || selectedCategory !== "All"
              ? "No products match your search or filter."
              : "No digital products found."}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== "All"
              ? "Try adjusting your search terms or clearing category filters."
              : "Start by adding your first software license or subscription package to the catalog."}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-xs font-bold text-white transition-all cursor-pointer"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add First Product</span>
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Product</th>
                  <th className="py-3.5 px-4">Category & Badge</th>
                  <th className="py-3.5 px-4">Pricing Plans</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredProducts.map((product) => {
                  const lowestPrice = product.variants?.[0]?.price;
                  const highestPrice =
                    product.variants?.[product.variants.length - 1]?.price;
                  const plansCount = product.variants?.length || 0;

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Product Thumbnail & Details */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-300">
                                <FiPackage className="h-6 w-6" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <p className="font-bold text-gray-900 truncate text-xs sm:text-sm">
                              {product.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-gray-400 font-mono truncate">
                                /{product.slug}
                              </span>
                              <Link
                                href={`/products/${product.slug}`}
                                target="_blank"
                                className="text-gray-400 hover:text-(--primary) transition-colors"
                                title="View live page"
                              >
                                <FiExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Badge */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700">
                            {product.category || "General"}
                          </span>
                          {product.badge && (
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Pricing Plans */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-gray-900">
                            ৳ {lowestPrice ?? 0}
                            {highestPrice && highestPrice !== lowestPrice && (
                              <span className="font-normal text-gray-500">
                                {" "}
                                - ৳ {highestPrice}
                              </span>
                            )}
                          </p>
                          <span className="text-[10px] text-gray-500 block">
                            {plansCount} {plansCount === 1 ? "variant" : "variants"}
                          </span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <FiStar className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                          <span className="font-bold text-gray-900">
                            {product.rating ?? 5.0}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            ({product.reviewsCount ?? 0})
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                            title="View in store"
                          >
                            <FiExternalLink className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(product)}
                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(product)}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={() => fetchProducts(false)}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
                <FiAlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  Delete Digital Product?
                </h3>
                <p className="text-xs text-gray-500">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80">
              <p className="text-xs font-bold text-gray-900">
                {deleteTarget.title}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Slug: /{deleteTarget.slug}
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to delete this product from the database catalog?
              Existing customer orders will retain their historic logs, but this product
              will no longer be purchasable on the live store.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <FiTrash2 className="h-3.5 w-3.5" />
                    <span>Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
