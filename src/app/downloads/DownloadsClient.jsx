"use client";

import { useState, useMemo } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import DownloadCard from "@/components/Cards/DownloadCard";

export default function DownloadsClient({ initialDownloads = [] }) {
  const [downloads] = useState(initialDownloads);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    initialDownloads.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return ["all", ...Array.from(set)];
  }, [initialDownloads]);

  // Extract unique platforms
  const platforms = useMemo(() => {
    const set = new Set();
    initialDownloads.forEach((d) => {
      if (d.platform) set.add(d.platform);
    });
    return ["all", ...Array.from(set)];
  }, [initialDownloads]);

  // Filtered software list
  const filteredDownloads = useMemo(() => {
    return downloads.filter((item) => {
      if (item.isActive === false) return false;

      // Category filter
      if (
        selectedCategory !== "all" &&
        item.category?.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Platform filter
      if (
        selectedPlatform !== "all" &&
        item.platform?.toLowerCase() !== selectedPlatform.toLowerCase()
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchDesc = item.shortDescription?.toLowerCase().includes(q);
        const matchVer = item.version?.toLowerCase().includes(q);
        const matchTags = Array.isArray(item.tags)
          ? item.tags.some((t) => t.toLowerCase().includes(q))
          : false;
        return matchTitle || matchDesc || matchVer || matchTags;
      }

      return true;
    });
  }, [downloads, selectedCategory, selectedPlatform, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Clean Compact Header: Big Title & Small Short Description (No badge, no extra bulk padding) */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
          Software Downloads
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Download genuine software setups, WhatsApp marketing automation suites, and utilities directly with high-speed links.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-3.5 bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
        {/* Search Input & Platform Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search software by title or tags (e.g. WhatsApp, driver, activation)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all"
            />
          </div>

          {platforms.length > 1 && (
            <div className="flex items-center gap-1.5 shrink-0">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-xs font-semibold text-gray-700 focus:bg-white focus:border-(--primary) outline-none transition-all cursor-pointer"
              >
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p === "all" ? "All Platforms" : p}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        {categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-(--primary) text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Software Vertical List matching the image layout */}
      {filteredDownloads.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-14 text-center space-y-3 shadow-xs">
          <div className="inline-flex p-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400">
            <FiDownload className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900">No Software Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== "all" || selectedPlatform !== "all"
              ? "No software matches your current search or category filter."
              : "Software catalog is currently being updated. Please check back shortly."}
          </p>
          {(searchQuery || selectedCategory !== "all" || selectedPlatform !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedPlatform("all");
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-3.5">
          {filteredDownloads.map((item) => (
            <DownloadCard key={item._id} software={item} />
          ))}
        </div>
      )}
    </div>
  );
}
