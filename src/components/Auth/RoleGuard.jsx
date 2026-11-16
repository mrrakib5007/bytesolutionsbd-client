"use client";

import { useEffect } from "react";
import { useRouter, usePathname, notFound } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";

/**
 * Reusable Role-Based Route Guard Component
 *
 * @param {Array<string>} allowedRoles Roles permitted to access (e.g. ['admin'] or ['user', 'admin'])
 * @param {string} redirectTo Path to redirect if user is unauthenticated (defaults to "/login")
 * @param {React.ReactNode} children Protected content
 *
 * Behavior:
 * - If unauthenticated: Redirects to /login?redirect=<current_path>
 * - If authenticated but role NOT permitted: Immediately invokes notFound() -> renders 404 page
 * - If role permitted: Renders children
 */
export default function RoleGuard({
  allowedRoles = ["admin"],
  redirectTo = "/login",
  children,
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
    }
  }, [loading, user, redirectTo, pathname, router]);

  // Loading state: render loading UI while keeping children attached in tree (hidden) to satisfy Next.js instant navigation validation
  if (loading) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center bg-slate-50/50">
          <Loading text="Loading..." className="py-20" />
        </div>
        <div className="hidden" aria-hidden="true">
          {children}
        </div>
      </>
    );
  }

  // Not logged in -> Show loader while redirecting
  if (!user) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center bg-slate-50/50">
          <Loading text="Redirecting to login..." className="py-20" />
        </div>
        <div className="hidden" aria-hidden="true">
          {children}
        </div>
      </>
    );
  }

  // Check role authorization
  const userRole = (user.role || "user").toLowerCase();
  const isAuthorized = allowedRoles.some(
    (role) => role.toLowerCase() === userRole
  );

  // If logged in but does not have the required role -> Call notFound()
  // This renders not-found.jsx, concealing that the admin page even exists
  if (!isAuthorized) {
    notFound();
  }

  // Permitted -> Render protected page
  return <>{children}</>;
}
