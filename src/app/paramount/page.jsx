"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiUsers,
  FiUserCheck,
  FiPackage,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { LuShoppingBag } from "react-icons/lu";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ControlPanelDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Initial fetch with clean async cancellation flag
  useEffect(() => {
    let ignore = false;

    fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore) {
          if (data?.success && data.data) {
            setStats(data.data);
            setError(null);
          } else {
            setError(data?.message || "Failed to load real database stats.");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Dashboard stats error:", err);
          setError("Failed to connect to database server.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Manual refresh handler
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to refresh metrics.");
      }

      setStats(data.data);
      setError(null);
      toast.success("Metrics updated from database!");
    } catch (err) {
      toast.error(err.message || "Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  };

  const statCards = [
    {
      title: "Total User",
      value: stats?.totalUsers ?? 0,
      icon: FiUsers,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Today Registered Users",
      value: stats?.todayUsers ?? 0,
      icon: FiUserCheck,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      title: "Total Product",
      value: stats?.totalProducts ?? 0,
      icon: FiPackage,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Total Order",
      value: stats?.totalOrders ?? 0,
      icon: LuShoppingBag,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Pending Order",
      value: stats?.pendingOrders ?? 0,
      icon: FiClock,
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      title: "Today Revenue",
      value: `৳ ${Number(stats?.todayRevenue ?? 0).toLocaleString()}`,
      icon: FiTrendingUp,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Total Revenue",
      value: `৳ ${Number(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: "bg-(--primary)/10 text-(--primary) border-(--primary)/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
            Overview
          </h2>
          <p className="text-xs text-gray-500">
            Live database statistics and real-time business performance
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 border border-gray-200 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            title="Fetch latest data from database"
          >
            <FiRefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>{refreshing ? "Refreshing..." : "Refresh Stats"}</span>
          </button>

          <Link
            href="/paramount/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-xs font-semibold text-white shadow-xs transition-all cursor-pointer"
          >
            <FiPackage className="h-3.5 w-3.5" />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between rounded-2xl bg-rose-50 p-4 border border-rose-200 text-xs text-rose-700">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="font-bold underline cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Real Data Stats Grid (7 Clean Cards in White Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl border border-gray-200/80 bg-white shadow-xs animate-pulse"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-9 w-9 bg-gray-100 rounded-xl" />
                </div>
                <div className="h-8 w-24 bg-gray-300 rounded" />
              </div>
            ))
          : statCards.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-2xl border border-gray-200/80 bg-white shadow-xs hover:border-gray-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">
                      {item.title}
                    </span>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${item.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-2xl font-black text-gray-900 tracking-tight">
                      {item.value}
                    </span>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
