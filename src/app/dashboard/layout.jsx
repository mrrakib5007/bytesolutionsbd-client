"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RoleGuard from "@/components/Auth/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import {
  FiUser,
  FiLogOut,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import { LuShoppingBag } from "react-icons/lu";

const DEFAULT_IMAGE = "https://i.ibb.co.com/ycfgs7BG/profile.jpg";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserDashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [ordersCount, setOrdersCount] = useState(null);

  const isAdmin = user?.role === "admin";

  // Optionally fetch order count for sidebar badge
  useEffect(() => {
    let ignore = false;

    fetch(`${API_BASE_URL}/orders/my-orders`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data?.success && Array.isArray(data.data)) {
          setOrdersCount(data.data.length);
        }
      })
      .catch(() => {
        // Silently ignore badge fetch error
      });

    return () => {
      ignore = true;
    };
  }, []);

  const isProfileActive =
    pathname === "/dashboard" || pathname === "/dashboard/profile";
  const isOrdersActive = pathname === "/dashboard/orders";

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

                  {/* Role Badge (User or Admin) */}
                  <div className="mt-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-2xs bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {isAdmin ? (
                        <FiShield className="h-3 w-3" />
                      ) : (
                        <FiCheckCircle className="h-3 w-3" />
                      )}
                      {isAdmin ? "Admin" : "User"}
                    </span>
                  </div>
                </div>

                {/* Left Navigation: My Profile, My Orders, Sign Out */}
                <nav className="mt-6 border-t border-gray-100 pt-4 space-y-1">
                  <Link
                    href="/dashboard"
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isProfileActive
                        ? "bg-(--primary) text-white font-bold shadow-xs"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <FiUser className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/dashboard/orders"
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isOrdersActive
                        ? "bg-(--primary) text-white font-bold shadow-xs"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <LuShoppingBag className="h-4 w-4" />
                      <span>My Orders</span>
                    </div>
                    {typeof ordersCount === "number" && ordersCount > 0 && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOrdersActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ordersCount}
                      </span>
                    )}
                  </Link>

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
            <main className="flex-1 min-w-0 w-full">{children}</main>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
