"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  FiDownload,
  FiSearch,
  FiRefreshCw,
  FiTrash2,
  FiUsers,
  FiUserCheck,
  FiGlobe,
  FiCopy,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiMonitor,
  FiSmartphone,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
  FiInfo,
  FiX,
  FiEye,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";
import ConfirmModal from "@/components/Shared/ConfirmModal";
import DownloadLogDetailsModal from "./DownloadLogDetailsModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Format timestamp into human-readable date & time
 */
function formatDateTime(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return String(dateStr);
  }
}

/**
 * Format relative time (e.g. 5m ago, 2h ago, 1d ago)
 */
function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  try {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return "";
  }
}

/**
 * Parse raw User-Agent into clean Browser & OS string
 */
function parseUserAgent(ua) {
  if (!ua || ua === "unknown") return { browser: "Unknown", os: "Unknown Device", isMobile: false };
  const str = ua.toLowerCase();

  let os = "Desktop";
  let isMobile = false;
  if (str.includes("windows")) os = "Windows";
  else if (str.includes("macintosh") || str.includes("mac os")) os = "macOS";
  else if (str.includes("android")) {
    os = "Android";
    isMobile = true;
  } else if (str.includes("iphone") || str.includes("ipad") || str.includes("ios")) {
    os = "iOS";
    isMobile = true;
  } else if (str.includes("linux")) os = "Linux";

  let browser = "Browser";
  if (str.includes("edg/")) browser = "Edge";
  else if (str.includes("chrome") && !str.includes("edg/")) browser = "Chrome";
  else if (str.includes("firefox")) browser = "Firefox";
  else if (str.includes("safari") && !str.includes("chrome")) browser = "Safari";
  else if (str.includes("opera") || str.includes("opr/")) browser = "Opera";

  return { browser, os, isMobile };
}

export default function DownloadLogsTab({
  softwareList = [],
  preselectedSoftwareId = "",
}) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState(preselectedSoftwareId);
  const [userTypeFilter, setUserTypeFilter] = useState("all"); // "all" | "registered" | "guest"
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 25,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    totalLogs: 0,
    registeredCount: 0,
    guestCount: 0,
    uniqueIpsCount: 0,
  });

  // Action states
  const [copiedIp, setCopiedIp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Initial load & filter sync using standard ignore pattern
  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "25");

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (selectedSoftware && selectedSoftware !== "all") {
      params.set("downloadId", selectedSoftware);
    }
    if (userTypeFilter !== "all") {
      params.set("userType", userTypeFilter);
    }

    fetch(`${API_BASE_URL}/admin/downloads/logs?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore) {
          if (data?.success && Array.isArray(data.data?.logs)) {
            setLogs(data.data.logs);
            if (data.data?.pagination) {
              setPagination(data.data.pagination);
            }
            if (data.data?.stats) {
              setStats(data.data.stats);
            }
            setError(null);
          } else {
            setError(data?.message || "Failed to load download logs.");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err?.message || "Failed to load download logs.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, searchQuery, selectedSoftware, userTypeFilter]);

  // Manual refresh handler
  const handleRefresh = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "25");

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }
      if (selectedSoftware && selectedSoftware !== "all") {
        params.set("downloadId", selectedSoftware);
      }
      if (userTypeFilter !== "all") {
        params.set("userType", userTypeFilter);
      }

      const res = await fetch(`${API_BASE_URL}/admin/downloads/logs?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to load download logs.");
      }

      setLogs(Array.isArray(data.data?.logs) ? data.data.logs : []);
      if (data.data?.pagination) {
        setPagination(data.data.pagination);
      }
      if (data.data?.stats) {
        setStats(data.data.stats);
      }
      setError(null);
    } catch (err) {
      console.error("Fetch download logs error:", err);
      setError(err?.message || "Failed to load download logs.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedSoftware, userTypeFilter]);

  // Copy IP to clipboard
  const handleCopyIp = (ip) => {
    if (!ip) return;
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    toast.success(`Copied IP: ${ip}`);
    setTimeout(() => {
      setCopiedIp(null);
    }, 2000);
  };

  // Delete single log entry
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE_URL}/admin/downloads/logs/${deleteTarget._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete log entry.");
      }

      toast.success("Download log entry removed.");
      setDeleteTarget(null);
      handleRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to delete log.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Downloads */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Logged Clicks
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <FiDownload className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 font-mono">
              {Number(stats.totalLogs || 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">all-time</span>
          </div>
        </div>

        {/* Registered Users */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Registered Customers
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
              <FiUserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-600 font-mono">
              {Number(stats.registeredCount || 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">with account</span>
          </div>
        </div>

        {/* Guest Users */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Guest Visitors
            </span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-200/60">
              <FiGlobe className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-700 font-mono">
              {Number(stats.guestCount || 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">unauthenticated</span>
          </div>
        </div>

        {/* Unique IPs */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Unique IP Locations
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              <FiUsers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600 font-mono">
              {Number(stats.uniqueIpsCount || 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">distinct IPs</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by IP, email, software name, or browser..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all"
            />
          </div>

          {/* Software Selector */}
          <div className="shrink-0 flex items-center gap-2">
            <select
              value={selectedSoftware}
              onChange={(e) => {
                setSelectedSoftware(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-xs font-semibold text-gray-700 focus:bg-white focus:border-(--primary) outline-none transition-all cursor-pointer max-w-56 truncate"
            >
              <option value="all">All Software Packages</option>
              {softwareList.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title}
                </option>
              ))}
            </select>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer shrink-0"
              title="Refresh Logs"
            >
              <FiRefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-(--primary)" : ""}`} />
            </button>
          </div>
        </div>

        {/* User Type Filter Pills */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100 flex-wrap">
          <span className="text-[11px] font-bold text-gray-400 mr-1">User Filter:</span>
          {[
            { id: "all", label: "All Types" },
            { id: "registered", label: "Registered Users Only" },
            { id: "guest", label: "Guest Visitors Only" },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => {
                setUserTypeFilter(type.id);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                userTypeFilter === type.id
                  ? "bg-(--primary) text-white shadow-2xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {loading && logs.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <LuLoader className="h-8 w-8 animate-spin text-(--primary) mx-auto" />
            <p className="text-xs text-gray-500">Loading software download logs...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-red-50 text-red-500">
              <FiInfo className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-gray-900">{error}</p>
            <button
              type="button"
              onClick={handleRefresh}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-gray-50 text-gray-400 border border-gray-200">
              <FiDownload className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">No Download Activity Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery || selectedSoftware !== "all" || userTypeFilter !== "all"
                ? "No logs match the current search or filters. Try resetting filters."
                : "When users or visitors click download on any software setup, events will be securely recorded here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Software</th>
                  <th className="py-3 px-4">User / Requester</th>
                  <th className="py-3 px-4">Client IP</th>
                  <th className="py-3 px-4">Browser & OS</th>
                  <th className="py-3 px-4">Downloaded At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((item) => {
                  const uaInfo = parseUserAgent(item.userAgent);
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Software Column */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-gray-900 block truncate max-w-56 sm:max-w-72">
                            {item.title}
                          </span>
                          <span className="text-[11px] font-mono text-gray-400 block truncate">
                            /{item.slug}
                          </span>
                        </div>
                      </td>

                      {/* User Column */}
                      <td className="py-3.5 px-4">
                        {item.isRegisteredUser ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold">
                              <FiCheckCircle className="h-2.5 w-2.5 text-emerald-600" />
                              Registered
                            </span>
                            <span className="font-mono text-gray-800 font-semibold block truncate max-w-48 text-[11px]">
                              {item.userEmail || "Logged User"}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-medium">
                            <FiGlobe className="h-2.5 w-2.5 text-gray-400" />
                            Guest Visitor
                          </span>
                        )}
                      </td>

                      {/* Client IP Column */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                          <span className="font-mono text-[11px] font-bold text-gray-700">
                            {item.ip}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyIp(item.ip)}
                            className="text-gray-400 hover:text-(--primary) transition-colors cursor-pointer"
                            title="Copy IP"
                          >
                            {copiedIp === item.ip ? (
                              <FiCheck className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <FiCopy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Browser / OS Column */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(item)}
                          className="text-left group/ua cursor-pointer"
                          title="Click to view full log details"
                        >
                          <div className="flex items-center gap-1.5 font-medium text-gray-800 text-[11px]">
                            {uaInfo.isMobile ? (
                              <FiSmartphone className="h-3 w-3 text-gray-400" />
                            ) : (
                              <FiMonitor className="h-3 w-3 text-gray-400" />
                            )}
                            <span className="group-hover/ua:text-(--primary) transition-colors">
                              {uaInfo.browser} on {uaInfo.os}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 block truncate max-w-44">
                            {item.userAgent?.slice(0, 40)}...
                          </span>
                        </button>
                      </td>

                      {/* Downloaded At Column */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="text-gray-800 font-medium block whitespace-nowrap">
                            {formatDateTime(item.createdAt)}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                            <FiClock className="h-2.5 w-2.5" />
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* Action Column: View details modal button + Delete button */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedLog(item)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-(--primary) hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="View Complete Log Details"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Log"
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
        )}

        {/* Pagination Toolbar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Page <span className="font-bold text-gray-900">{pagination.page}</span> of{" "}
              <span className="font-bold text-gray-900">{pagination.totalPages}</span> (
              {pagination.total} total logs)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1 || loading}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-50 text-xs font-bold text-gray-700 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-50 text-xs font-bold text-gray-700 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <FiChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comprehensive Download Log Details Modal */}
      {selectedLog && (
        <DownloadLogDetailsModal
          log={selectedLog}
          uaInfo={parseUserAgent(selectedLog.userAgent)}
          onClose={() => setSelectedLog(null)}
          onDelete={(log) => setDeleteTarget(log)}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Download Log Entry"
        message={`Are you sure you want to delete the log record for "${deleteTarget?.title}" from IP ${deleteTarget?.ip}? This action cannot be undone.`}
        confirmText="Delete Entry"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
