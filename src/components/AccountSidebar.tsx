"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  FileText,
  Users,
  Heart,
  BarChart3,
  Settings,
  Sparkles,
  ChevronRight,
  Boxes,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

function useBuyerNavItems(): NavItem[] {
  return [
    { label: "Overview", href: "/dashboard", icon: Home },
    { label: "Orders", href: "/orders", icon: Package },
    { label: "Quotes", href: "/dashboard/quotes", icon: FileText },
    { label: "Suppliers", href: "/dashboard/suppliers", icon: Users },

    // Keep only one
    { label: "Favorites", href: "/wishlist", icon: Heart },

    { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },

    // Profile contains Personal Info, Company Info, Address Book, Security, Preferences
    { label: "Settings", href: "/profile", icon: Settings },
  ];
}

function useSupplierNavItems(): NavItem[] {
  return [
    { label: "Overview", href: "/dashboard", icon: Home },
    { label: "Products", href: "/products/inventory", icon: Boxes },
    { label: "Quotes", href: "/dashboard/quotes", icon: FileText, badge: 12 },
    { label: "Buyers", href: "/dashboard/buyers", icon: Users },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Profile", href: "/profile", icon: UserCircle },
  ];
}

export function AccountSidebar() {
  const pathname = usePathname();
  const { user } = useAppStore();
  const isSupplier = user?.role === "supplier";
  const buyerItems = useBuyerNavItems();
  const supplierItems = useSupplierNavItems();
  const navItems = isSupplier ? supplierItems : buyerItems;

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (base === "/dashboard") return pathname === "/dashboard";
    if (base === "/profile") return pathname === "/profile";
    return pathname === base || pathname.startsWith(base + "/");
  };

  return (
    <aside className="flex w-full shrink-0 flex-col lg:w-60 lg:min-h-0 lg:flex-1">
      <div className="lg:shrink-0">
        <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-line bg-white p-2 scrollbar-none lg:flex-col lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition lg:w-full",
                  active
                    ? "bg-terracotta/12 text-terracotta-dark lg:bg-ink lg:text-white"
                    : "text-ink/75 hover:bg-cream-2"
                )}
              >
                <item.icon size={17} className="shrink-0" />
                <span className="flex-1 whitespace-nowrap">{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold",
                      active ? "bg-white/25 lg:bg-white/20" : "bg-cream-2"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <div className="mt-6 hidden rounded-2xl border border-emerald-800/15 bg-emerald-800/5 p-4 lg:block">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800/10 text-emerald-800">
            <Sparkles size={17} />
          </div>
          <div className="mb-1 text-sm font-semibold text-emerald-900">
            {isSupplier ? "AI Business Assistant" : "AI Assistant"}
          </div>
          <p className="mb-3 text-xs leading-relaxed text-emerald-900/70">
            {isSupplier
              ? "Get insights, grow sales, and manage your business smarter."
              : "Find fabrics, compare & get recommendations instantly."}
          </p>
          <Link
            href="/ai-assistant"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-800 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-900"
          >
            {isSupplier ? "Ask AI Assistant" : "Chat with AI"} <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
}