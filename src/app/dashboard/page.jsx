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
  const [activeTab, setActiveTab] = useState("licenses");
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

  return (
    <RoleGuard allowedRoles={["user", "admin"]}>
      <div className="min-h-screen bg-slate-50/50 pb-20 pt-8 sm:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Welcome Bar */}
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: User Profile Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs">
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-(--primary) shadow-md">
                    <Image
                      src={user?.image || DEFAULT_IMAGE}
                      alt={user?.name || "User Profile"}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-gray-900">
                    {user?.name || "Valued Customer"}
                  </h3>
                  <p className="text-xs text-gray-500">{user?.email}</p>

                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    <FiShield className="h-3 w-3" />
                    <span>{user?.role ? user.role.toUpperCase() : "USER"}</span>
                  </div>

                  {/* Edit Profile Button */}
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-800 shadow-2xs hover:bg-gray-50 hover:border-(--primary) hover:text-(--primary) transition-all cursor-pointer"
                  >
                    <FiEdit2 className="h-3.5 w-3.5 text-(--primary)" />
                    <span>Edit Profile Details</span>
                  </button>
                </div>

                <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-2">
                      <FiMail className="h-3.5 w-3.5 text-gray-400" />
                      Email Address
                    </span>
                    <span className="font-semibold text-gray-900 truncate max-w-44">
                      {user?.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-2">
                      <FaWhatsapp className="h-3.5 w-3.5 text-emerald-600" />
                      WhatsApp (Full)
                    </span>
                    <span className="font-semibold font-mono text-gray-900">
                      {fullWhatsapp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-2">
                      <FiClock className="h-3.5 w-3.5 text-gray-400" />
                      Account Status
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <FiCheckCircle className="h-3 w-3" />
                      Active
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="w-full rounded-xl border border-rose-200 bg-rose-50/50 py-2.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100 cursor-pointer"
                  >
                    Log Out of Account
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: License Vault & Order History */}
            <div className="lg:col-span-8 space-y-6">
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-4.5 shadow-xs">
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

                <div className="rounded-2xl border border-gray-100 bg-white p-4.5 shadow-xs">
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

                <div className="rounded-2xl border border-gray-100 bg-white p-4.5 shadow-xs">
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

              {/* Tabs Bar */}
              <div className="flex items-center gap-2 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("licenses")}
                  className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === "licenses"
                      ? "border-(--primary) text-(--primary)"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  My Licenses & Keys ({userOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === "orders"
                      ? "border-(--primary) text-(--primary)"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Order History
                </button>
              </div>

              {/* Active Tab Content: Licenses Vault */}
              {activeTab === "licenses" && (
                <div className="space-y-4">
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

              {/* Order History Tab */}
              {activeTab === "orders" && (
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
              )}
            </div>
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
