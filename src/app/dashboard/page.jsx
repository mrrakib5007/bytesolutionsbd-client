"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RoleGuard from "@/components/Auth/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import EditProfileModal from "@/components/Dashboard/EditProfileModal";
import UserOrderDetailsModal from "@/components/Dashboard/UserOrderDetailsModal";
import Loading from "@/components/Loading";
import {
  FiUser,
  FiShoppingBag,
  FiLogOut,
  FiMail,
  FiShield,
  FiPackage,
  FiClock,
  FiEdit2,
  FiCheckCircle,
  FiEye,
  FiAlertCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { LuLoader } from "react-icons/lu";

function UserDashboardContent() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "orders" ? "orders" : "profile";

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Orders list state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const DEFAULT_IMAGE = "https://i.ibb.co.com/ycfgs7BG/profile.jpg";

  // Format full WhatsApp with country code
  const fullWhatsapp = user?.whatsapp
    ? `${user.countryCode || "+880"} ${user.whatsapp}`
    : "Not provided";

  const isAdmin = user?.role === "admin";

  // Manual refresh callback
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadInitialOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/my-orders", {
          credentials: "include",
        });
        const data = await res.json();
        if (active && res.ok && data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        if (active) setLoadingOrders(false);
      }
    };

    loadInitialOrders();
    return () => {
      active = false;
    };
  }, []);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  return (
    <RoleGuard allowedRoles={["user", "admin"]}>
      <div className="min-h-screen bg-slate-50/50 pb-20 pt-8 sm:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main Layout: Slim Left Sidebar + Right Content */}
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
            {/* Left Sidebar */}
            <aside className="w-full lg:w-64 xl:w-72 shrink-0 space-y-4">
              <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-xs">
                {/* Profile Avatar & Details */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-(--primary) shadow-sm">
                    <Image
                      src={user?.image || DEFAULT_IMAGE}
                      alt={user?.name || "Profile"}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <h3 className="mt-3.5 text-base font-bold text-gray-900 truncate max-w-full">
                    {user?.name || "Customer Account"}
                  </h3>
                  <p className="text-xs text-gray-500 truncate max-w-full">
                    {user?.email}
                  </p>

                  {/* Badge (User or Admin) */}
                  <div className="mt-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-2xs ${
                        isAdmin
                          ? "bg-slate-900 text-emerald-400"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      }`}
                    >
                      {isAdmin ? (
                        <FiShield className="h-3 w-3" />
                      ) : (
                        <FiCheckCircle className="h-3 w-3" />
                      )}
                      {isAdmin ? "Administrator" : "Verified Customer"}
                    </span>
                  </div>
                </div>

                {/* Left Navigation: My Profile, My Orders, Sign Out */}
                <nav className="mt-6 border-t border-gray-100 pt-4 space-y-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "profile"
                        ? "bg-(--primary) text-white font-bold shadow-xs"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <FiUser className="h-4 w-4" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "orders"
                        ? "bg-(--primary) text-white font-bold shadow-xs"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FiShoppingBag className="h-4 w-4" />
                      <span>My Orders</span>
                    </div>
                    {orders.length > 0 && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          activeTab === "orders"
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {orders.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Right Content Area */}
            <main className="flex-1 min-w-0 w-full">
              {/* Tab 1: My Profile */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  {/* Profile Details Card */}
                  <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-900">
                          Profile Details
                        </h2>
                        <p className="text-xs text-gray-500">
                          Manage your personal credentials, contact info, and security details
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
                      >
                        <FiEdit2 className="h-3.5 w-3.5" />
                        <span>Edit Profile</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-xs font-medium text-gray-500 block mb-1">
                          Full Name
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {user?.name || "Not provided"}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1.5">
                          <FiMail className="h-3.5 w-3.5 text-gray-400" />
                          Email Address
                        </span>
                        <span className="text-sm font-bold text-gray-900 truncate block">
                          {user?.email || "Not provided"}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1.5">
                          <FaWhatsapp className="h-3.5 w-3.5 text-emerald-600" />
                          WhatsApp (Full Number)
                        </span>
                        <span className="text-sm font-bold font-mono text-gray-900">
                          {fullWhatsapp}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1.5">
                          <FiClock className="h-3.5 w-3.5 text-gray-400" />
                          Account Status
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
                          <FiCheckCircle className="h-4 w-4" />
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: My Orders */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        My Orders
                      </h2>
                      <p className="text-xs text-gray-500">
                        Overview of all placed purchases, payment status, and delivered license keys
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={fetchOrders}
                      className="text-xs font-bold text-(--primary) hover:underline cursor-pointer"
                    >
                      Refresh
                    </button>
                  </div>

                  {loadingOrders ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                      <LuLoader className="h-6 w-6 animate-spin mx-auto text-(--primary)" />
                      <p className="mt-2 text-xs text-gray-500">Loading your orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center space-y-3 shadow-xs">
                      <div className="inline-flex p-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400">
                        <FiShoppingBag className="h-8 w-8" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">
                        No Orders Placed Yet
                      </h3>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        You have not purchased any licenses or software subscriptions yet. Explore our genuine tools and creative assets at the best price.
                      </p>
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-xs font-bold text-white transition-all cursor-pointer"
                      >
                        <FiPackage className="h-4 w-4" />
                        <span>Browse Products</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                          <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                            <tr>
                              <th className="px-5 py-3">Order ID</th>
                              <th className="px-5 py-3">Items</th>
                              <th className="px-5 py-3">Payment</th>
                              <th className="px-5 py-3">Total Amount</th>
                              <th className="px-5 py-3">Status</th>
                              <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => {
                              const isCompleted = order.orderStatus === "completed";
                              const isPending = order.orderStatus === "pending";
                              const isCancelled = order.orderStatus === "cancelled";

                              return (
                                <tr key={order._id || order.orderId} className="hover:bg-gray-50/50">
                                  <td className="px-5 py-3.5">
                                    <div className="font-mono font-bold text-gray-900">
                                      {order.orderId}
                                    </div>
                                    <div className="text-[10px] text-gray-400">
                                      {order.createdAt
                                        ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })
                                        : "N/A"}
                                    </div>
                                  </td>
                                  <td className="px-5 py-3.5 font-semibold text-gray-900">
                                    {order.items?.map((it, idx) => (
                                      <div key={idx} className="truncate max-w-xs">
                                        {it.title} ({it.duration})
                                      </div>
                                    ))}
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <span className="font-bold uppercase text-gray-800">
                                      {order.payment?.method}
                                    </span>
                                    <div className="font-mono text-[10px] text-gray-400 truncate max-w-[120px]">
                                      {order.payment?.trxId}
                                    </div>
                                  </td>
                                  <td className="px-5 py-3.5 font-bold font-mono text-gray-900">
                                    ৳ {order.totalAmount?.toFixed(2)}
                                  </td>
                                  <td className="px-5 py-3.5">
                                    {isCompleted && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                                        <FiCheckCircle className="h-3 w-3" />
                                        Completed
                                      </span>
                                    )}
                                    {isPending && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                                        <FiClock className="h-3 w-3" />
                                        Pending
                                      </span>
                                    )}
                                    {isCancelled && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
                                        <FiAlertCircle className="h-3 w-3" />
                                        Cancelled
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-5 py-3.5 text-right">
                                    <button
                                      type="button"
                                      onClick={() => openOrderDetails(order)}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-bold text-gray-800 transition-colors shadow-2xs cursor-pointer"
                                    >
                                      <FiEye className="h-3 w-3 text-(--primary)" />
                                      <span>{isCompleted ? "View Key" : "Details"}</span>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* User Order Details & Key Modal */}
      {isOrderModalOpen && selectedOrder && (
        <UserOrderDetailsModal
          isOpen={isOrderModalOpen}
          order={selectedOrder}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </RoleGuard>
  );
}

export default function UserDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loading text="Loading dashboard..." />
        </div>
      }
    >
      <UserDashboardContent />
    </Suspense>
  );
}
