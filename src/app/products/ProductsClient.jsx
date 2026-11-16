"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  FiSearch,
  FiSliders,
  FiX,
  FiPackage,
  FiZap,
  FiShield,
  FiHeadphones,
  FiRefreshCw,
} from "react-icons/fi";
import ProductCard from "@/components/Cards/Productcard";

export default function ProductsClient({ initialProducts = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Read category parameter from URL (e.g. ?category=Marketing+Tools or ?category=marketing-tools)
  const categoryParam = searchParams.get("category");

  // Collect unique categories present in the products
  const productCategories = useMemo(() => {
    const set = new Set();
    initialProducts.forEach((p) => {
      if (p.category) set.add(p.category.trim());
    });
    return Array.from(set);
  }, [initialProducts]);

  // Determine active category by matching URL param against available categories
  const selectedCategory = useMemo(() => {
    if (!categoryParam || categoryParam.trim() === "" || categoryParam.toLowerCase() === "all") {
      return "All";
    }

    const paramLower = categoryParam.trim().toLowerCase();
    const paramSlug = paramLower.replace(/[-_]/g, " ").replace(/\s+/g, " ");

    // 1. Direct exact or case-insensitive match
    const directMatch = productCategories.find(
      (c) => c.toLowerCase() === paramLower
    );
    if (directMatch) return directMatch;

    // 2. Slug / hyphenated match (e.g. "marketing-tools" -> "Marketing Tools")
    const slugMatch = productCategories.find((c) => {
      const cSlug = c.toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ");
      return cSlug === paramSlug;
    });
    if (slugMatch) return slugMatch;

    // 3. Fallback: Return raw param as-is if visiting a category not yet in DB
    return categoryParam.trim();
  }, [categoryParam, productCategories]);

  // All category pills to display
  const categories = useMemo(() => {
    const list = ["All", ...productCategories];
    if (
      selectedCategory !== "All" &&
      !list.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())
    ) {
      list.push(selectedCategory);
    }
    return list;
  }, [productCategories, selectedCategory]);

  // Update URL search parameters when category changes
  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!cat || cat.toLowerCase() === "all") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Category filter
    if (selectedCategory !== "All") {
      const sel = selectedCategory.toLowerCase().replace(/[-_]/g, " ").trim();
      list = list.filter((p) => {
        if (!p.category) return false;
        const cat = p.category.toLowerCase().replace(/[-_]/g, " ").trim();
        return cat === sel;
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const descMatch = p.shortDescription?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const featureMatch = p.features?.some((f) =>
          f?.toLowerCase().includes(q)
        );
        return titleMatch || descMatch || catMatch || featureMatch;
      });
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        list.sort((a, b) => {
          const priceA = a.variants?.[0]?.price ?? 0;
          const priceB = b.variants?.[0]?.price ?? 0;
          return priceA - priceB;
        });
        break;
      case "price-high":
        list.sort((a, b) => {
          const priceA = a.variants?.[0]?.price ?? 0;
          const priceB = b.variants?.[0]?.price ?? 0;
          return priceB - priceA;
        });
        break;
      case "rating":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        break;
      default:
        break;
    }

    return list;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedCategory !== "All" || sortBy !== "default";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortBy("default");
    handleCategoryChange("All");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7">
        {/* Header Row: Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3">
          <div>
            <nav className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Link href="/" className="transition-colors hover:text-(--primary)">
                Home
              </Link>
              <span className="text-gray-300">»</span>
              <span className="font-semibold text-(--primary)">All Products</span>
            </nav>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
              Explore Our <span className="gradient-text">Software & Tools</span>
            </h1>
          </div>

          {/* Compact Search Bar */}
          <div className="relative w-full md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiSearch className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search software or tools..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pr-8 pl-9 text-xs text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                aria-label="Clear search"
              >
                <FiX className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Controls Bar: Category Pills + Sort/Count */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-y border-gray-200/80 py-2.5 mb-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-(--primary) text-white shadow-xs shadow-(--primary)/25"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown & Count */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <span className="text-xs font-medium text-gray-500">
              Showing <strong className="font-bold text-gray-900">{filteredProducts.length}</strong> items
            </span>

            <div className="relative flex items-center">
              <FiSliders className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white py-1.5 pr-3 pl-8 text-xs font-semibold text-gray-700 outline-none hover:bg-gray-50 focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/15 cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4 -mt-2">
            <span className="text-xs text-gray-400">Active filters:</span>
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 rounded-md bg-(--primary)/10 px-2 py-0.5 text-xs font-semibold text-(--primary)">
                Category: {selectedCategory}
                <button
                  type="button"
                  onClick={() => handleCategoryChange("All")}
                  className="hover:opacity-75 cursor-pointer"
                  title="Remove category filter"
                >
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                &ldquo;{searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="hover:opacity-75 cursor-pointer"
                  title="Clear search"
                >
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-600 hover:underline ml-1 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Product Grid or Empty State */}
        <div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.slug}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                <FiPackage className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-900">
                No matching products found
              </h3>
              <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                {selectedCategory !== "All"
                  ? `No products currently available in "${selectedCategory}".`
                  : "Try searching for different keywords or reset filters to see all available software."}
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center justify-center rounded-lg bg-(--primary) px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-(--primary-hover) cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features / Guarantee Banner */}
        <div className="mt-14 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiZap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Instant Delivery</h4>
                <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed">
                  Receive your license keys & access immediately via email.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiShield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">100% Genuine</h4>
                <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed">
                  Every product is authenticated and verified for reliability.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FiHeadphones className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Dedicated Support</h4>
                <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed">
                  Reach out via WhatsApp or email whenever you need assistance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FiRefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Guaranteed Validity</h4>
                <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed">
                  Full warranty and replacement guarantee on all active licenses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
