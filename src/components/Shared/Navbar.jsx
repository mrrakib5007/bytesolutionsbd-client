"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiUser,
  FiShield,
} from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const DEFAULT_IMAGE = "https://i.ibb.co.com/ycfgs7BG/profile.jpg";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Products", href: "/products" },
    { name: "Special Offers", href: "/special-offers" },
    { name: "Best Sellers", href: "/best-sellers" },
    { name: "Downloads", href: "/downloads" },
  ];

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

  useEffect(() => {
    if (isMobileMenuOpen || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isCartOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-[95%] items-center justify-between px-2 sm:px-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 py-1">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/logo.png"
                  alt="Soft License Hub Logo"
                  width={40}
                  height={40}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-base md:text-lg lg:text-xl font-black tracking-tight text-black [text-shadow:0_0_1px_rgba(0,0,0,0.5)]">
                Soft{" "}
                <span className="gradient-text [text-shadow:0_0_1px_var(--primary)]">
                  License
                </span>{" "}
                Hub
              </span>
            </Link>
          </div>

          <ul className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-black transition-colors hover:text-(--primary)"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full p-2 text-black transition-colors hover:bg-gray-100 cursor-pointer"
              aria-label="Open cart"
            >
              <FiShoppingCart className="h-6 w-6" />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-(--primary) text-[10px] font-bold text-white">
                0
              </span>
            </button>

            {user ? (
              <div className="relative hidden lg:block" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full p-0.5 transition-all hover:ring-2 hover:ring-(--primary)/30 focus:outline-none cursor-pointer"
                  aria-label="User profile menu"
                >
                  <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-200">
                    <Image
                      src={user.image || DEFAULT_IMAGE}
                      alt={user.name || "User"}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl shadow-gray-200/50 z-50">
                    <div className="border-b border-gray-100 px-3 py-2.5">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1 border-b border-gray-100">
                      {user.role === "admin" && (
                        <Link
                          href="/paramount"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/80 transition-colors"
                        >
                          <FiShield className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <FiUser className="h-3.5 w-3.5 text-gray-400" />
                        <span>My Dashboard</span>
                      </Link>
                      
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        setIsProfileOpen(false);
                        await logout();
                        toast.success("Logged out successfully");
                      }}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-800 shadow-2xs transition-all duration-200 hover:border-(--primary) hover:text-(--primary) active:scale-95 lg:inline-flex"
                >
                  <FiLogIn className="h-3.5 w-3.5" />
                  <span>Login</span>
                </Link>

                <Link
                  href="/signup"
                  className="hidden items-center gap-1.5 rounded-lg bg-(--primary) px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-(--primary-hover) active:scale-95 lg:inline-flex"
                >
                  <FiUserPlus className="h-3.5 w-3.5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-lg p-1.5 text-black hover:bg-gray-100 focus:outline-none lg:hidden"
              aria-label="Open navigation menu"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg">
              <Image
                src="/logo.png"
                alt="Soft License Hub Logo"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-lg font-black tracking-tight text-black [text-shadow:0_0_1px_rgba(0,0,0,0.5)]">
              Soft{" "}
              <span className="gradient-text [text-shadow:0_0_1px_var(--primary)]">
                License
              </span>{" "}
              Hub
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-black hover:bg-gray-100"
            aria-label="Close menu"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg py-2 text-base font-semibold text-black transition-colors hover:text-(--primary)"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-gray-100 p-5">
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gray-200">
                  <Image
                    src={user.image || DEFAULT_IMAGE}
                    alt={user.name || "User"}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-200 transition-colors"
                >
                  <FiUser className="h-4 w-4" />
                  <span>My Dashboard</span>
                </Link>

                {user.role === "admin" && (
                  <Link
                    href="/paramount"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    <FiShield className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </div>

              <button
                type="button"
                onClick={async () => {
                  setIsMobileMenuOpen(false);
                  await logout();
                  toast.success("Logged out successfully");
                }}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 text-center text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
              >
                <FiLogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--primary) py-2.5 text-center text-base font-semibold text-white transition-colors hover:bg-(--primary-hover)"
              >
                <FiLogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 text-center text-base font-semibold text-black transition-colors hover:bg-gray-50 hover:text-(--primary)"
              >
                <FiUserPlus className="h-5 w-5" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-[90%] max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="h-5 w-5 text-(--primary)" />
            <h2 className="text-base font-bold text-black">Your Cart</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="rounded-lg p-1.5 text-black hover:bg-gray-100"
            aria-label="Close cart"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <FiShoppingCart className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-black">
            Your cart is currently empty
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Browse our software licenses and add items here.
          </p>
        </div>

        <div className="border-t border-gray-100 p-5">
          <div className="mb-3 flex items-center justify-between text-sm font-semibold text-black">
            <span>Subtotal</span>
            <span>৳0.00</span>
          </div>
          <button
            type="button"
            disabled
            className="w-full rounded-lg bg-gray-200 py-2.5 text-center text-sm font-semibold text-gray-400 cursor-not-allowed"
          >
            Checkout
          </button>
        </div>
      </aside>
    </>
  );
}
