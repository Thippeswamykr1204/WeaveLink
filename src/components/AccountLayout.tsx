"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AccountSidebar } from "./AccountSidebar";
import { useAppStore, UserRole } from "@/lib/store";

interface AccountLayoutProps {
  children: React.ReactNode;
  /** If set, only this role may view the page. Other authenticated roles are redirected. */
  requireRole?: UserRole;
}

export function AccountLayout({ children, requireRole }: AccountLayoutProps) {
  const router = useRouter();
  const { user, hydrated } = useAppStore();

  // Wait for the persisted store to rehydrate before deciding anything —
  // otherwise a logged-in user briefly reads as logged-out on refresh.
  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  // Role mismatch: buyer on a supplier-only page or vice versa. Redirect
  // automatically instead of just showing a link — same idea as the
  // no-user redirect above, just gated on role instead of on auth.
  useEffect(() => {
    if (hydrated && user && requireRole && user.role !== requireRole) {
      router.replace(user.role === "supplier" ? "/dashboard" : "/marketplace");
    }
  }, [hydrated, user, requireRole, router]);

  if (!hydrated) {
    return <div className="mx-auto max-w-[1600px] px-5 py-24 text-center text-sm text-muted">Loading...</div>;
  }

  if (!user) {
    return <div className="mx-auto max-w-[1600px] px-5 py-24 text-center text-sm text-muted">Redirecting to login...</div>;
  }

  if (requireRole && user.role !== requireRole) {
    return (
      <div className="mx-auto max-w-[1600px] px-5 py-24 text-center text-sm text-muted">
        Redirecting to {user.role === "supplier" ? "dashboard" : "marketplace"}...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:sticky lg:top-[72px] lg:flex lg:max-h-[calc(100vh-88px)] lg:flex-col lg:self-start">
          <AccountSidebar />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}