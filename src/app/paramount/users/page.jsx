"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import AdminUserViewModal from "./AdminUserViewModal";
import {
  FiUsers,
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
  FiLock,
  FiUnlock,
  FiShield,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const currentAdminId = currentAdmin?.id || currentAdmin?._id;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "active" | "deactive"
  const [roleFilter, setRoleFilter] = useState("all"); // "all" | "user" | "admin"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const DEFAULT_IMAGE = "https://i.ibb.co.com/ycfgs7BG/profile.jpg";

  // Format Bangladesh Dhaka time
  const formatDhakaDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-GB", {
      timeZone: "Asia/Dhaka",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/admin/users?status=${activeFilter}&role=${roleFilter}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url, {
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        toast.error(data.message || "Failed to load users list.");
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error("Network error while loading users.");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, roleFilter, searchQuery]);

  useEffect(() => {
    let active = true;
    const loadUsersOnFilter = async () => {
      try {
        let url = `http://localhost:5000/api/admin/users?status=${activeFilter}&role=${roleFilter}`;
        if (searchQuery.trim()) {
          url += `&search=${encodeURIComponent(searchQuery.trim())}`;
        }
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        if (active && res.ok && data.success && Array.isArray(data.data)) {
          setUsers(data.data);
        }
      } catch (err) {
        console.error("Failed to load users on filter change:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUsersOnFilter();
    return () => {
      active = false;
    };
  }, [activeFilter, roleFilter, searchQuery]);

  // Open full details custom modal
  const handleOpenView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Toggle user active / deactive account
  const handleToggleStatus = async (user) => {
    const isSelf = user._id === currentAdminId;
    const isCurrentlyActive = user.isActive !== false;

    if (isSelf && isCurrentlyActive) {
      toast.error("You cannot deactivate your own admin account.");
      return;
    }

    const newStatus = !isCurrentlyActive;
    const confirmMessage = newStatus
      ? `Are you sure you want to activate ${user.name}'s account?`
      : `Are you sure you want to deactivate ${user.name}'s account? The user will be logged out and cannot sign in.`;

    if (!confirm(confirmMessage)) return;

    setActionLoadingId(user._id);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${user._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isActive: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || `Account ${newStatus ? "activated" : "deactivated"} successfully!`);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isActive: newStatus } : u))
        );
        if (selectedUser && selectedUser._id === user._id) {
          setSelectedUser((prev) => ({ ...prev, isActive: newStatus }));
        }
      } else {
        toast.error(data.message || "Failed to update account status.");
      }
    } catch (err) {
      console.error("Toggle user status error:", err);
      toast.error("Error communicating with server.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStatusToggledFromModal = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
    setSelectedUser(updatedUser);
  };

  // Status counts
  const activeCount = users.filter((u) => u.isActive !== false).length;
  const deactiveCount = users.filter((u) => u.isActive === false).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
            Users Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Monitor customer accounts, review registration history, and toggle account activation status.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors cursor-pointer"
        >
          <FiRefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: "all", label: "All Users" },
            { id: "active", label: "Active", count: activeCount },
            { id: "deactive", label: "Deactivated", count: deactiveCount },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === tab.id
                  ? "bg-(--primary) text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeFilter === tab.id
                      ? "bg-white/20 text-white"
                      : tab.id === "deactive"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Role Filter & Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Role Filter Select */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-xs font-semibold text-gray-700 focus:bg-white focus:border-(--primary) outline-none transition-all cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="user">Customers</option>
            <option value="admin">Administrators</option>
          </select>

          {/* Search Input */}
          <div className="relative min-w-60">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Email, Phone..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Users Container: Responsive Card View (< xl) + Proportional Table View (>= xl) */}
      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-xs">
          <LuLoader className="h-7 w-7 animate-spin mx-auto text-(--primary)" />
          <p className="mt-2 text-xs font-medium text-gray-500">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center space-y-3 shadow-xs">
          <div className="inline-flex p-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400">
            <FiUsers className="h-7 w-7" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">No Users Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            There are currently no user accounts matching your selected status or search filter.
          </p>
        </div>
      ) : (
        <>
          {/* Card View (< xl: Mobile, Tablet & Compact Laptop Displays - ZERO horizontal scroll) */}
          <div className="block xl:hidden space-y-4">
            {users.map((user) => {
              const isActive = user.isActive !== false;
              const isSelf = user._id === currentAdminId;
              const isActionLoading = actionLoadingId === user._id;

              return (
                <div
                  key={user._id}
                  className="rounded-2xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4 hover:border-gray-300 transition-all"
                >
                  {/* Top Bar: User Avatar, Name, Email, Status & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 rounded-full overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                        <Image
                          src={user.image || DEFAULT_IMAGE}
                          alt={user.name || "User Avatar"}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-gray-900 truncate">
                            {user.name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.2 text-[10px] font-bold ${
                              user.role === "admin"
                                ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                                : "bg-blue-50 text-blue-700 border border-blue-200/60"
                            }`}
                          >
                            {user.role === "admin" ? "Admin" : "Customer"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate" title={user.email}>
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-rose-50 text-rose-700 border border-rose-200/60"
                        }`}
                      >
                        {isActive ? (
                          <>
                            <FiCheckCircle className="h-3 w-3 shrink-0" />
                            Active
                          </>
                        ) : (
                          <>
                            <FiAlertCircle className="h-3 w-3 shrink-0" />
                            Deactivated
                          </>
                        )}
                      </span>

                      {/* Action Buttons: View Details + Toggle Status */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenView(user)}
                          className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-(--primary) hover:border-(--primary)/40 hover:bg-gray-50 transition-all cursor-pointer"
                          title="View Full Details"
                        >
                          <FiEye className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={isActionLoading || (isSelf && isActive)}
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                            isActive
                              ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                              : "bg-emerald-600 text-white hover:bg-emerald-700"
                          }`}
                          title={
                            isSelf && isActive
                              ? "You cannot deactivate your own account"
                              : isActive
                              ? "Deactivate Account"
                              : "Activate Account"
                          }
                        >
                          {isActionLoading ? (
                            <LuLoader className="h-3 w-3 animate-spin" />
                          ) : isActive ? (
                            <FiLock className="h-3 w-3" />
                          ) : (
                            <FiUnlock className="h-3 w-3" />
                          )}
                          <span>{isActive ? "Deactivate" : "Activate"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid: WhatsApp, Joined Date, Orders */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        WhatsApp / Phone
                      </span>
                      <p className="font-mono font-bold text-emerald-800 truncate">
                        {user.whatsapp ? `${user.countryCode || "+880"} ${user.whatsapp}` : "Not provided"}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Registration Date
                      </span>
                      <p className="text-gray-600 truncate">
                        {formatDhakaDateTime(user.createdAt)}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Order Statistics
                      </span>
                      <p className="font-mono font-bold text-gray-900">
                        {user.totalOrders || 0} order(s) • ৳ {(user.totalSpent || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= xl: Large wide desktop displays - ZERO horizontal scroll) */}
          <div className="hidden xl:block rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <div className="w-full overflow-hidden">
              <table className="w-full text-left text-xs text-gray-600 border-collapse table-fixed">
                <colgroup>
                  <col className="w-[26%]" /> {/* User Info */}
                  <col className="w-[18%]" /> {/* Phone / WhatsApp */}
                  <col className="w-[18%]" /> {/* Role & Joined */}
                  <col className="w-[14%]" /> {/* Orders & Spend */}
                  <col className="w-[12%]" /> {/* Status */}
                  <col className="w-[12%]" /> {/* Actions */}
                </colgroup>
                <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="w-[26%] px-4 py-3.5 whitespace-nowrap">User Info</th>
                    <th className="w-[18%] px-4 py-3.5 whitespace-nowrap">WhatsApp / Phone</th>
                    <th className="w-[18%] px-4 py-3.5 whitespace-nowrap">Role & Joined</th>
                    <th className="w-[14%] px-4 py-3.5 whitespace-nowrap">Orders & Spend</th>
                    <th className="w-[12%] px-4 py-3.5 text-center whitespace-nowrap">Status</th>
                    <th className="w-[12%] px-4 py-3.5 text-right whitespace-nowrap pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => {
                    const isActive = user.isActive !== false;
                    const isSelf = user._id === currentAdminId;
                    const isActionLoading = actionLoadingId === user._id;

                    return (
                      <tr key={user._id} className="hover:bg-gray-50/60 transition-colors">
                        {/* User Info (Avatar + Name + Email) */}
                        <td className="w-[26%] px-4 py-3.5 align-middle">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                              <Image
                                src={user.image || DEFAULT_IMAGE}
                                alt={user.name || "User Avatar"}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 truncate" title={user.name}>
                                {user.name}
                              </p>
                              <p className="text-[11px] text-gray-500 truncate" title={user.email}>
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* WhatsApp / Phone */}
                        <td className="w-[18%] px-4 py-3.5 whitespace-nowrap align-middle">
                          <div className="font-mono font-bold text-gray-800 text-xs">
                            {user.whatsapp ? `${user.countryCode || "+880"} ${user.whatsapp}` : "Not provided"}
                          </div>
                        </td>

                        {/* Role & Joined Date */}
                        <td className="w-[18%] px-4 py-3.5 whitespace-nowrap align-middle">
                          <div>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.2 text-[10px] font-bold ${
                                user.role === "admin"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                                  : "bg-blue-50 text-blue-700 border border-blue-200/60"
                              }`}
                            >
                              <FiShield className="h-2.5 w-2.5" />
                              {user.role === "admin" ? "Admin" : "Customer"}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-1 whitespace-nowrap">
                            {formatDhakaDateTime(user.createdAt)}
                          </div>
                        </td>

                        {/* Orders & Total Spend */}
                        <td className="w-[14%] px-4 py-3.5 whitespace-nowrap align-middle">
                          <div className="font-mono font-bold text-gray-900 text-xs">
                            {user.totalOrders || 0} order(s)
                          </div>
                          <div className="font-mono text-[11px] text-gray-500 mt-0.5 whitespace-nowrap">
                            ৳ {(user.totalSpent || 0).toFixed(2)}
                          </div>
                        </td>

                        {/* Status (Centered) */}
                        <td className="w-[12%] px-4 py-3.5 text-center whitespace-nowrap align-middle">
                          <div className="flex items-center justify-center">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap ${
                                isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                  : "bg-rose-50 text-rose-700 border border-rose-200/60"
                              }`}
                            >
                              {isActive ? (
                                <>
                                  <FiCheckCircle className="h-3 w-3 shrink-0" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <FiAlertCircle className="h-3 w-3 shrink-0" />
                                  Deactivated
                                </>
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Actions (View Details + Active/Deactive Toggle) */}
                        <td className="w-[12%] px-4 py-3.5 text-right whitespace-nowrap align-middle pr-5">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* Eye icon to view full details custom modal */}
                            <button
                              type="button"
                              onClick={() => handleOpenView(user)}
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-(--primary) hover:border-(--primary)/40 hover:bg-gray-50 transition-all cursor-pointer"
                              title="View Full Details"
                            >
                              <FiEye className="h-3.5 w-3.5" />
                            </button>

                            {/* Active / Deactivate toggle button */}
                            <button
                              type="button"
                              disabled={isActionLoading || (isSelf && isActive)}
                              onClick={() => handleToggleStatus(user)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
                                isActive
                                  ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80"
                                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                              }`}
                              title={
                                isSelf && isActive
                                  ? "You cannot deactivate your own account"
                                  : isActive
                                  ? "Deactivate Account"
                                  : "Activate Account"
                              }
                            >
                              {isActionLoading ? (
                                <LuLoader className="h-3 w-3 animate-spin" />
                              ) : isActive ? (
                                <FiLock className="h-3 w-3" />
                              ) : (
                                <FiUnlock className="h-3 w-3" />
                              )}
                              <span>{isActive ? "Deactivate" : "Activate"}</span>
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

      {/* User Full Details Custom Modal */}
      {isViewModalOpen && selectedUser && (
        <AdminUserViewModal
          isOpen={isViewModalOpen}
          user={selectedUser}
          currentAdminId={currentAdminId}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}
          onStatusToggled={handleStatusToggledFromModal}
        />
      )}
    </div>
  );
}
