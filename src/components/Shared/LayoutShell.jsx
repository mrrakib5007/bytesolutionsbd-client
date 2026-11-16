"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";

/**
 * LayoutShell conditionally renders Navbar and Footer:
 * - Hidden on all /paramount, /control-panel and /admin routes
 * - Visible on all public pages and /dashboard
 */
export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname?.startsWith("/paramount") ||
    pathname?.startsWith("/control-panel") ||
    pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
