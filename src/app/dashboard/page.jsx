"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RoleGuard from "@/components/Auth/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import EditProfileModal from "@/components/Dashboard/EditProfileModal";
import {
  FiKey,
  FiShoppingBag,
  FiCheckCircle,
  FiCopy,
  FiCheck,
  FiMail,
  FiShield,
  FiPackage,
  FiClock,
  FiEdit2,
  FiUser,
  FiLogOut,
  FiArrowRight,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import toast from "react-hot-toast";

// Demo user order history & license keys
const userOrders = [
  {
    orderId: "SLH-8941",
    productTitle: "Canva Pro Subscription",
    slug: "canva-pro-subscription",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=950&h=700&auto=format&fit=crop&q=80",
    variant: "1 Year",
    price: 99,
    licenseKey: "CANVA-PRO-9982-K7X1-AUTH",
    purchaseDate: "16 Nov 2026",
    status: "Active",
    downloadUrl: "https://canva.com",
  },
  {
    orderId: "SLH-8940",
    productTitle: "WA Sender Marketing Suite",
    slug: "wa-sender-marketing-suite",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=950&h=700&auto=format&fit=crop&q=80",
    variant: "1 Year",
    price: 349,
    licenseKey: "WAS-2026-B819-PLT0-8911",
    purchaseDate: "10 Nov 2026",
    status: "Active",
    downloadUrl: "#",
  },
];

export default function UserDashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("licenses"); // "licenses" | "orders" | "profile"
  const [copiedKey, setCopiedKey] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const DEFAULT_IMAGE = "https://i.ibb.co.com/ycfgs7BG/profile.jpg";

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("License key copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2500);
  };

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
              {isAdmin && (
                <Link
                  href="/paramount"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-emerald-400 shadow-xs hover:bg-slate-800 transition-colors"
                >
                  <FiShield className="h-3.5 w-3.5" />
                  Paramount Console
                </Link>
              )}
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
            {/* Left Sidebar (Reduced Width: w-full lg:w-64 xl:w-72) */}
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

                {/* Navigation Buttons */}
                <nav className="mt-6 border-t border-gray-100 pt-4 space-y-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("licenses")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "licenses"
                        ? "bg-(--primary) text-white shadow-xs"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FiKey className="h-4 w-4" />
                      <span>My Licenses</span>
                    </span>
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                        activeTab === "licenses"
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {userOrders.length}
                    </span>
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
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                        activeTab === "orders"
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {userOrders.length}
                    </span>
                  </button>

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
                    <span>Profile Details</span>
                  </button>

                  {isAdmin && (
                    <Link
                      href="/paramount"
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/90 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <FiShield className="h-4 w-4 text-emerald-600" />
                        <span>Paramount Console</span>
                      </span>
                      <FiArrowRight className="h-3 w-3 text-emerald-600" />
                    </Link>
                  )}

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
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-gray-200/80 bg-white p-4.5 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="text-xs font-semibold">Active Licenses</span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <FiKey className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-gray-900">
                    {userOrders.length}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    100% Guaranteed Active
                  </span>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-white p-4.5 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="text-xs font-semibold">Total Orders</span>
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                      <FiShoppingBag className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-gray-900">
                    {userOrders.length}
                  </div>
                  <span className="text-[11px] text-blue-600 font-medium">
                    Instant Digital Delivery
                  </span>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-white p-4.5 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="text-xs font-semibold">Total Spent</span>
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                      <FiCheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-gray-900">
                    ৳ 448
                  </div>
                  <span className="text-[11px] text-purple-600 font-medium">
                    Saved ~৳ 10,000+
                  </span>
                </div>
              </div>

              {/* Tab 1: Licenses Vault */}
              {activeTab === "licenses" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        My License Vault ({userOrders.length})
                      </h2>
                      <p className="text-xs text-gray-500">
                        Manage your active software activation keys and access credentials
                      </p>
                    </div>
                  </div>

                  {userOrders.map((order) => {
                    const isCopied = copiedKey === order.licenseKey;
                    return (
                      <div
                        key={order.orderId}
                        className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all hover:border-(--primary)/30"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-gray-200">
                              <Image
                                src={order.image}
                                alt={order.productTitle}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/products/${order.slug}`}
                                className="text-sm font-bold text-gray-900 hover:text-(--primary) transition-colors"
                              >
                                {order.productTitle}
                              </Link>
                              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700">
                                  {order.variant}
                                </span>
                                <span>•</span>
                                <span>Purchased: {order.purchaseDate}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                              <FiCheckCircle className="h-3 w-3" />
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* License Key Box */}
                        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                          <div className="flex items-center gap-2">
                            <FiKey className="h-4 w-4 text-(--primary) shrink-0" />
                            <span className="text-xs font-semibold text-gray-600">
                              Activation Key:
                            </span>
                            <code className="rounded bg-white px-2 py-0.5 font-mono text-xs font-bold text-gray-900 border border-gray-200">
                              {order.licenseKey}
                            </code>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopy(order.licenseKey)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-(--primary) px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-(--primary-hover) transition-colors cursor-pointer"
                          >
                            {isCopied ? (
                              <>
                                <FiCheck className="h-3.5 w-3.5" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <FiCopy className="h-3.5 w-3.5" />
                                <span>Copy Key</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Orders History */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Order History ({userOrders.length})
                    </h2>
                    <p className="text-xs text-gray-500">
                      Overview of all completed purchases and invoice details
                    </p>
                  </div>

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
                          {userOrders.map((order) => (
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
                </div>
              )}

              {/* Tab 3: Profile Details */}
              {activeTab === "profile" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        Account & Profile Details
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
                        <span className="text-sm font-bold text-gray-900">
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
                          Active Customer
                        </span>
                      </div>
                    </div>
                  </div>
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
