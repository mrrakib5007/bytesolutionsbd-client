"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  FiDownload,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiExternalLink,
  FiCheckCircle,
  FiAlertCircle,
  FiLock,
  FiUnlock,
  FiMonitor,
  FiActivity,
  FiPackage,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";
import DownloadModal from "./DownloadModal";
import DownloadLogsTab from "./DownloadLogsTab";
import ConfirmModal from "@/components/Shared/ConfirmModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_IMAGE = "https://i.ibb.co.com/Gv1GBtWZ/WA-Sender-Marketing-Tool-Offer.png";

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Top Tabs: "software" | "logs"
  const [activeView, setActiveView] = useState("software");
  const [selectedLogSoftwareId, setSelectedLogSoftwareId] = useState("");
  const [logsTotalCount, setLogsTotalCount] = useState(0);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive"
  const [platformFilter, setPlatformFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Fetch downloads list
  const fetchDownloads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/admin/downloads`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to load downloads.");
      }

      setDownloads(Array.isArray(data.data) ? data.data : []);
      setError(null);
    } catch (err) {
      console.error("Fetch downloads error:", err);
      setError(err?.message || "Failed to load downloads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    fetch(`${API_BASE_URL}/admin/downloads`, {
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
            setDownloads(data.data);
            setError(null);
          } else {
            setError(data?.message || "Failed to load software downloads.");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err?.message || "Failed to load software downloads.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Fetch download logs total count for tab badge
  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/downloads/logs?limit=1`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && typeof data?.data?.pagination?.total === "number") {
          setLogsTotalCount(data.data.pagination.total);
        }
      })
      .catch(() => {});
  }, [activeView]);

  // Filtered downloads
  const filteredDownloads = downloads.filter((item) => {
    // Status filter
    if (statusFilter === "active" && item.isActive === false) return false;
    if (statusFilter === "inactive" && item.isActive !== false) return false;

    // Platform filter
    if (
      platformFilter !== "all" &&
      item.platform?.toLowerCase() !== platformFilter.toLowerCase()
    ) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q);
      const matchVersion = item.version?.toLowerCase().includes(q);
      const matchTags = Array.isArray(item.tags)
        ? item.tags.some((t) => t.toLowerCase().includes(q))
        : false;
      return matchTitle || matchCategory || matchVersion || matchTags;
    }

    return true;
  });

  // Toggle active status
  const handleToggleStatus = async (item) => {
    try {
      setTogglingId(item._id);
      const res = await fetch(
        `${API_BASE_URL}/admin/downloads/${item._id}/toggle-status`,
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

      setDownloads((prev) =>
        prev.map((d) =>
          d._id === item._id ? { ...d, isActive: data.data.isActive } : d
        )
      );

      toast.success(data.message || "Status updated.");
    } catch (err) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  // Open modal for add
  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Callback when item is saved
  const handleItemSaved = (savedItem) => {
    setDownloads((prev) => {
      const idx = prev.findIndex((d) => d._id === savedItem._id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = savedItem;
        return next;
      }
      return [savedItem, ...prev];
    });
  };

  // Delete handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const res = await fetch(
        `${API_BASE_URL}/admin/downloads/${deleteTarget._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete software download.");
      }

      setDownloads((prev) => prev.filter((d) => d._id !== deleteTarget._id));
      toast.success("Software download removed successfully.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete item.");
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = downloads.filter((d) => d.isActive !== false).length;
  const inactiveCount = downloads.filter((d) => d.isActive === false).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            <FiDownload className="h-6 w-6 text-(--primary)" /> Software Downloads
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage software packages, download links, version releases, and setup utilities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (activeView === "software") fetchDownloads();
            }}
            disabled={loading && activeView === "software"}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors cursor-pointer"
          >
            <FiRefreshCw className={`h-3.5 w-3.5 ${loading && activeView === "software" ? "animate-spin text-(--primary)" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {activeView === "software" && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <FiPlus className="h-4 w-4" />
              <span>Add Software</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Navigation Tabs: Software Packages vs Download Activity Logs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => {
            setActiveView("software");
            setSelectedLogSoftwareId("");
          }}
          className={`flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeView === "software"
              ? "border-(--primary) text-(--primary)"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FiPackage className="h-4 w-4" />
          <span>Software Packages</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700 font-semibold">
            {downloads.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView("logs")}
          className={`flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeView === "logs"
              ? "border-(--primary) text-(--primary)"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FiActivity className="h-4 w-4" />
          <span>Download Activity Logs</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold">
            {logsTotalCount > 0 ? logsTotalCount : "Logs"}
          </span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeView === "logs" ? (
        <DownloadLogsTab
          softwareList={downloads}
          preselectedSoftwareId={selectedLogSoftwareId}
        />
      ) : (
        <>
          {/* Filters Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: "all", label: "All Software", count: downloads.length },
            { id: "active", label: "Active", count: activeCount },
            { id: "inactive", label: "Inactive", count: inactiveCount },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-(--primary) text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Platform & Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-xs font-semibold text-gray-700 focus:bg-white focus:border-(--primary) outline-none transition-all cursor-pointer"
          >
            <option value="all">All Platforms</option>
            <option value="windows">Windows</option>
            <option value="macos">macOS</option>
            <option value="android">Android</option>
            <option value="linux">Linux</option>
          </select>

          <div className="relative min-w-60">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search software by title or tags..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-xs">
          <LuLoader className="h-7 w-7 animate-spin mx-auto text-(--primary)" />
          <p className="mt-2 text-xs font-medium text-gray-500">Loading software downloads...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-3">
          <FiAlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
          <h3 className="text-sm font-bold text-rose-900">Failed to Load Downloads</h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={fetchDownloads}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : filteredDownloads.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center space-y-3 shadow-xs">
          <div className="inline-flex p-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400">
            <FiDownload className="h-7 w-7" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">No Software Downloads Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "all" || platformFilter !== "all"
              ? "No software matches your current search or status filter."
              : "You have not added any software download items yet. Click 'Add Software' to create one."}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile & Tablet Card View (< xl) */}
          <div className="block xl:hidden space-y-4">
            {filteredDownloads.map((item) => {
              const isActive = item.isActive !== false;
              const isToggling = togglingId === item._id;

              return (
                <div
                  key={item._id}
                  className="rounded-2xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4 hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                        <Image
                          src={item.image || DEFAULT_IMAGE}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-gray-900 leading-snug">
                            {item.title}
                          </h3>
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            {item.version || "v1.0.0"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.category} • {item.platform}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap shrink-0 ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : "bg-rose-50 text-rose-700 border border-rose-200/60"
                      }`}
                    >
                      {isActive ? (
                        <>
                          <FiCheckCircle className="h-3 w-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <FiAlertCircle className="h-3 w-3" />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>

                  {item.shortDescription && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {item.shortDescription}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">
                        File Size
                      </span>
                      <span className="font-mono font-bold text-gray-800">
                        {item.fileSize || "N/A"}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">
                        Downloads
                      </span>
                      <span className="font-mono font-bold text-gray-800">
                        {item.totalDownloads || 0} times
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    {item.downloadUrl && (
                      <a
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiExternalLink className="h-3.5 w-3.5" />
                        <span>Link</span>
                      </a>
                    )}

                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => handleToggleStatus(item)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                        isActive
                          ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {isToggling ? (
                        <LuLoader className="h-3 w-3 animate-spin" />
                      ) : isActive ? (
                        <FiLock className="h-3 w-3" />
                      ) : (
                        <FiUnlock className="h-3 w-3" />
                      )}
                      <span>{isActive ? "Hide" : "Show"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-(--primary) hover:border-(--primary)/40 hover:bg-gray-50 transition-all cursor-pointer"
                      title="Edit Software"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      title="Delete Software"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= xl - ZERO horizontal scroll) */}
          <div className="hidden xl:block rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <div className="w-full overflow-hidden">
              <table className="w-full text-left text-xs text-gray-600 border-collapse table-fixed">
                <colgroup>
                  <col className="w-[34%]" />
                  <col className="w-[16%]" />
                  <col className="w-[14%]" />
                  <col className="w-[12%]" />
                  <col className="w-[10%]" />
                  <col className="w-[14%]" />
                </colgroup>
                <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="w-[34%] px-3.5 py-3 whitespace-nowrap">Software & Version</th>
                    <th className="w-[16%] px-3.5 py-3 whitespace-nowrap">Platform & Size</th>
                    <th className="w-[14%] px-3.5 py-3 whitespace-nowrap">Category</th>
                    <th className="w-[12%] px-3.5 py-3 text-center whitespace-nowrap">Downloads</th>
                    <th className="w-[10%] px-3.5 py-3 text-center whitespace-nowrap">Status</th>
                    <th className="w-[14%] px-3.5 py-3 text-right whitespace-nowrap pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDownloads.map((item) => {
                    const isActive = item.isActive !== false;
                    const isToggling = togglingId === item._id;

                    return (
                      <tr key={item._id} className="hover:bg-gray-50/60 transition-colors">
                        {/* Software & Version */}
                        <td className="w-[34%] px-3.5 py-3 align-middle">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                              <Image
                                src={item.image || DEFAULT_IMAGE}
                                alt={item.title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="font-bold text-gray-900 truncate leading-snug" title={item.title}>
                                  {item.title}
                                </p>
                                <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                                  {item.version || "v1.0.0"}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 truncate mt-0.5" title={item.shortDescription}>
                                {item.shortDescription || "No short description"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Platform & Size */}
                        <td className="w-[16%] px-3.5 py-3 whitespace-nowrap align-middle">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 font-semibold text-gray-800 text-xs">
                              <FiMonitor className="h-3 w-3 text-gray-400" />
                              <span>{item.platform || "Windows"}</span>
                            </div>
                            <div className="font-mono text-[11px] text-gray-500">
                              {item.fileSize || "N/A"}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="w-[14%] px-3.5 py-3 whitespace-nowrap align-middle">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-medium truncate max-w-28">
                            {item.category || "Utilities"}
                          </span>
                        </td>

                        {/* Total Downloads */}
                        <td className="w-[12%] px-3.5 py-3 text-center whitespace-nowrap align-middle">
                          <span className="font-mono font-bold text-xs text-gray-900">
                            {item.totalDownloads || 0}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="w-[10%] px-3.5 py-3 text-center whitespace-nowrap align-middle">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : "bg-rose-50 text-rose-700 border border-rose-200/60"
                            }`}
                          >
                            {isActive ? (
                              <>
                                <FiCheckCircle className="h-2.5 w-2.5" />
                                Active
                              </>
                            ) : (
                              <>
                                <FiAlertCircle className="h-2.5 w-2.5" />
                                Hidden
                              </>
                            )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="w-[14%] px-3.5 py-3 text-right whitespace-nowrap align-middle pr-5">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* Download link test */}
                            {item.downloadUrl && (
                              <a
                                href={item.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-(--primary) hover:border-(--primary)/40 hover:bg-gray-50 transition-all cursor-pointer"
                                title="Open Download Link"
                              >
                                <FiExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}

                            {/* Status toggle */}
                            <button
                              type="button"
                              disabled={isToggling}
                              onClick={() => handleToggleStatus(item)}
                              className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${
                                isActive
                                  ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                                  : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                              }`}
                              title={isActive ? "Hide Download" : "Make Visible"}
                            >
                              {isToggling ? (
                                <LuLoader className="h-3.5 w-3.5 animate-spin" />
                              ) : isActive ? (
                                <FiLock className="h-3.5 w-3.5" />
                              ) : (
                                <FiUnlock className="h-3.5 w-3.5" />
                              )}
                            </button>

                            {/* View Download Logs */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLogSoftwareId(item._id);
                                setActiveView("logs");
                              }}
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer"
                              title={`View Download Logs (${Number(item.totalDownloads || 0)} downloads)`}
                            >
                              <FiActivity className="h-3.5 w-3.5" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-(--primary) hover:border-(--primary)/40 hover:bg-gray-50 transition-all cursor-pointer"
                              title="Edit Software"
                            >
                              <FiEdit2 className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer"
                              title="Delete Software"
                            >
                              <FiTrash2 className="h-3.5 w-3.5" />
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
        </>
      )}
    </>
  )}

      {/* Add / Edit Software Modal */}
      <DownloadModal
        key={editingItem?._id || "new"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleItemSaved}
        editingItem={editingItem}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Software Download?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
