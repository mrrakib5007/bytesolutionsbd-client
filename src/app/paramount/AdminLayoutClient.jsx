"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import RoleGuard from "@/components/Auth/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Shared/Logo";
import {
  FiGrid,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiSettings,
  FiHome,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiShield,
  FiChevronDown,
} from "react-icons/fi";

const adminNavItems = [
  { name: "Dashboard", href: "/paramount", icon: FiGrid },
  { name: "Products", href: "/paramount/products", icon: FiPackage },
  { name: "Orders", href: "/paramount/orders", icon: FiShoppingBag },
  { name: "Customers", href: "/paramount/users", icon: FiUsers },
  { name: "Settings", href: "/paramount/settings", icon: FiSettings },
];

export default function AdminLayoutClient({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const DEFAULT_IMAGE = "https://i.ibb.co.com/ycfgs7BG/profile.jpg";

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-slate-50/70 text-gray-900">
        {/* Mobile Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Fixed Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-200/80">
            <Logo
              href="/paramount"
              size="sm"
              textClassName="text-sm font-bold text-gray-900"
              subtitle={
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 uppercase tracking-widest mt-0.5">
                  <FiShield className="h-2.5 w-2.5 text-emerald-600" /> Paramount Console
                </span>
              }
            />

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-700 p-1 rounded-lg cursor-pointer"
              aria-label="Close sidebar"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/paramount"
                  ? pathname === "/paramount"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-(--primary) text-white shadow-xs shadow-(--primary)/25"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Right Area: Fixed Header + Scrollable Content */}
        <div className="lg:pl-64 flex flex-col min-h-screen min-w-0">
          {/* Fixed Top Header */}
          <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white border-b border-gray-200/80 px-4 sm:px-6 flex items-center justify-between z-30 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-800 p-1.5 rounded-lg border border-gray-200 cursor-pointer"
                aria-label="Open sidebar"
              >
                <FiMenu className="h-5 w-5" />
              </button>

              <div>
                <h1 className="text-sm sm:text-base font-bold text-gray-900">
                  Admin Panel
                </h1>
                <p className="text-[11px] text-gray-500 hidden sm:block">
                  Manage products, orders & license activations
                </p>
              </div>
            </div>

            {/* Admin Header Actions & Profile Dropdown */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <FiBell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-(--primary)" />
              </button>

              {/* Profile Icon Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                  aria-label="Admin profile menu"
                >
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-200 shadow-2xs">
                    <Image
                      src={user?.image || DEFAULT_IMAGE}
                      alt={user?.name || "Admin"}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-900 truncate max-w-32">
                      {user?.name || "Admin"}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      {user?.role || "Admin"}
                    </span>
                  </div>
                  <FiChevronDown
                    className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 hidden sm:block ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Popup */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-200/50 z-50">
                    <div className="border-b border-gray-100 px-3 py-2.5">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {user?.email || ""}
                      </p>
                      <span className="mt-1.5 inline-block px-2 py-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 rounded-md uppercase">
                        {user?.role || ""} Account
                      </span>
                    </div>

                    <div className="py-1 border-b border-gray-100 space-y-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <FiGrid className="h-4 w-4 text-gray-400" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <FiHome className="h-4 w-4 text-gray-400" />
                        <span>Main Page</span>
                      </Link>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <FiLogOut className="h-4 w-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Scrollable Page Content */}
          <main className="mt-16 flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
