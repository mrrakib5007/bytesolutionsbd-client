"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RoleGuard from "@/components/Auth/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import EditProfileModal from "@/components/Dashboard/EditProfileModal";
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
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

export default function UserDashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "orders"
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Orders list (demo data removed)
  const orders = [];

  const DEFAULT_IMAGE = "https://i.ibb.co.com/ycfgs7BG/profile.jpg";

  // Format full WhatsApp with country code
  const fullWhatsapp = user?.whatsapp
    ? `${user.countryCode || "+880"} ${user.whatsapp}`
    : "Not provided";

  const isAdmin = user?.role === "admin";

  return (
    <RoleGuard allowedRoles={["user", "admin"]}>
      <div className="min-h-screen bg-slate-50/50 pb-20 pt-8 sm:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <nav className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Link href="/" className="hover:text-(--primary) transition-colors">
                  Home
                </Link>
                <span className="text-gray-300">»</span>
                <span className="font-semibold text-(--primary)">My Account</span>
              </nav>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                User Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 rounded-xl bg-(--primary) px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-(--primary-hover) transition-colors"
              >
                <FiPackage className="h-3.5 w-3.5" />
                Browse Store
              </Link>
            </div>
          </div>

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
                      alt={user?.name || "User Profile"}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <h3 className="mt-3 text-base font-bold text-gray-900 truncate max-w-full">
                    {user?.name || "Valued Customer"}
                  </h3>
                  <p className="text-xs text-gray-500 truncate max-w-full">
                    {user?.email}
                  </p>

                  {/* Badge: Admin or Customer */}
                  <div className="mt-2">
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        <FiShield className="h-3 w-3 text-emerald-600" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
                        <FiUser className="h-3 w-3 text-blue-600" />
                        Customer
                      </span>
                    )}
                  </div>
                </div>

                {/* Left Navigation: My Profile, My Orders, Sign Out */}
                <nav className="mt-6 border-t border-gray-100 pt-4 space-y-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "profile"
                        ? "bg-(--primary) text-white shadow-xs"
                        : "text-gray-700 hover:bg-gray-100"
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
                        ? "bg-(--primary) text-white shadow-xs"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FiShoppingBag className="h-4 w-4" />
                      <span>My Orders</span>
                    </span>
                    {orders.length > 0 && (
                      <span
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                          activeTab === "orders"
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {orders.length}
                      </span>
                    )}
                  </button>

                  <div className="pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Right Column: Dynamic Content Area */}
            <main className="flex-1 min-w-0 w-full space-y-6">
              {/* Tab 1: My Profile */}
              {activeTab === "profile" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        Profile Details
                      </h2>
                      <p className="text-xs text-gray-500">
                        Personal identity, registered WhatsApp contact and security
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-xs font-bold text-white shadow-xs transition-all cursor-pointer w-fit"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-6">
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
                        <span className="text-xs font-medium text-gray-500 block mb-1 flex items-center gap-1.5">
                          <FiMail className="h-3.5 w-3.5 text-gray-400" />
                          Email Address
                        </span>
                        <span className="text-sm font-bold text-gray-900 truncate block">
                          {user?.email || "Not provided"}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-xs font-medium text-gray-500 block mb-1 flex items-center gap-1.5">
                          <FaWhatsapp className="h-3.5 w-3.5 text-emerald-600" />
                          WhatsApp (Full Number)
                        </span>
                        <span className="text-sm font-bold font-mono text-gray-900">
                          {fullWhatsapp}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-xs font-medium text-gray-500 block mb-1 flex items-center gap-1.5">
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
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      My Orders
                    </h2>
                    <p className="text-xs text-gray-500">
                      Overview of all completed purchases and digital license keys
                    </p>
                  </div>

                  {orders.length === 0 ? (
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
                              <th className="px-5 py-3">Product</th>
                              <th className="px-5 py-3">Duration</th>
                              <th className="px-5 py-3">Price</th>
                              <th className="px-5 py-3">Status</th>
                              <th className="px-5 py-3">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                              <tr key={order.orderId} className="hover:bg-gray-50/50">
                                <td className="px-5 py-3.5 font-mono font-bold text-gray-900">
                                  {order.orderId}
                                </td>
                                <td className="px-5 py-3.5 font-semibold text-gray-900">
                                  {order.productTitle}
                                </td>
                                <td className="px-5 py-3.5">{order.variant}</td>
                                <td className="px-5 py-3.5 font-bold text-gray-900">
                                  ৳ {order.price}
                                </td>
                                <td className="px-5 py-3.5">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                    <FiCheckCircle className="h-3 w-3" />
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-gray-500">
                                  {order.purchaseDate}
                                </td>
                              </tr>
                            ))}
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
    </RoleGuard>
  );
}
