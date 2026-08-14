"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Heart,
  ShoppingCart,
  ChevronDown,
  Globe,
  Menu,
  X,
  Search,
  Scale3d,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface HeaderNavItem {
  label: string;
  href: string;
  badge?: string | number;
}

const baseNavItems: HeaderNavItem[] = [
  { label: "Marketplace", href: "/marketplace" },
  // { label: "Categories", href: "/marketplace" },
  { label: "Suppliers", href: "/suppliers" },
  { label: "AI Assistant", href: "/ai-assistant", badge: "New" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
        <path
          d="M20 4 L30 14 L20 24 L10 14 Z M20 16 L30 26 L20 36 L10 26 Z"
          stroke="#C8703D"
          strokeWidth="2.4"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <div className="leading-tight">
        <div className="font-serif text-[1.35rem] leading-none">WeaveLink</div>
        <div className="text-[0.58rem] tracking-[0.16em] text-muted font-medium mt-0.5">
          B2B TEXTILE MARKETPLACE
        </div>
      </div>
    </Link>
  );
}

function HeaderSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search${value ? `?q=${encodeURIComponent(value)}` : ""}`);
      }}
      className="hidden flex-1 items-center gap-2.5 rounded-xl border border-line bg-cream px-3.5 py-2 md:flex lg:max-w-md"
    >
      <Search size={16} className="shrink-0 text-muted" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
      />
      <kbd className="hidden shrink-0 rounded-md border border-line bg-white px-1.5 py-0.5 text-[0.65rem] font-medium text-muted lg:block">
        ⌘K
      </kbd>
    </form>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, cart, wishlist, orders, compareList } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isLight = pathname === "/login" || pathname === "/register";
  const isSupplier = user?.role === "supplier";
  const navItems = baseNavItems
    .filter((item) => !(item.label === "Marketplace" && isSupplier))
    .map((item) =>
      item.label === "Suppliers" && isSupplier
        ? { ...item, label: "Buyers", href: "/dashboard/buyers" }
        : item
    );
  // Orders lives in the top nav (not the sidebar) for suppliers only —
  // positioned between the search bar and "Buyers".
  if (isSupplier) {
    navItems.unshift({ label: "Orders", href: "/orders", badge: orders.length });
  }
  // Dashboard lives in the top nav for buyers — suppliers already reach it
  // via "Overview" in the sidebar, so this is buyer-only (and only once logged in).
  if (user && !isSupplier) {
    navItems.unshift({ label: "Dashboard", href: "/dashboard" });
  }
  const searchPlaceholder = isSupplier
    ? "Search fabrics, buyers, orders..."
    : "Search fabrics, categories, suppliers...";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-line backdrop-blur-md",
        isLight ? "bg-white/90" : "bg-cream/90"
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-5 py-3.5 sm:px-8">
        <Logo />

        {user && <HeaderSearch placeholder={searchPlaceholder} />}

        <nav className="ml-2 hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex items-center gap-1.5 whitespace-nowrap text-[0.92rem] font-medium text-ink/80 transition hover:text-ink",
                pathname === item.href && "text-ink"
              )}
            >
              {item.label}
              {item.badge && (
                <span className="rounded-full bg-terracotta/15 px-1.5 py-0.5 text-[0.62rem] font-semibold text-terracotta-dark">
                  {item.badge}
                </span>
              )}
              {pathname === item.href && (
                <span className="absolute -bottom-[15px] left-0 right-0 h-[2px] bg-terracotta-dark" />
              )}
            </Link>
          ))}
          {!user && (
            <div className="group relative">
              <button className="flex items-center gap-1 text-[0.92rem] font-medium text-ink/80 hover:text-ink">
                Resources <ChevronDown size={14} />
              </button>
              <div className="invisible absolute left-0 top-full mt-2 w-44 rounded-xl border border-line bg-white p-1.5 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                {["Blog", "Guides", "Help Center"].map((r) => (
                  <button
                    key={r}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink/80 hover:bg-cream"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
          {/* <button className="hidden items-center gap-1 text-sm font-medium text-ink/80 hover:text-ink sm:flex">
            <Globe size={16} /> EN
          </button> */}

          {user ? (
            <>
              {!isSupplier && (
                <Link
                  href="/marketplace/compare"
                  className="relative hidden p-1.5 text-ink/80 hover:text-ink sm:block"
                  aria-label="Compare"
                >
                  <Scale3d size={20} />
                  {compareList.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta-dark text-[0.6rem] font-semibold text-white">
                      {compareList.length}
                    </span>
                  )}
                </Link>
              )}
              {!isSupplier && (
                <Link
                  href="/wishlist"
                  className="relative hidden p-1.5 text-ink/80 hover:text-ink sm:block"
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                  {wishlist.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta-dark text-[0.6rem] font-semibold text-white">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              )}
              {!isSupplier && (
                <Link
                  href="/cart"
                  className="relative hidden p-1.5 text-ink/80 hover:text-ink sm:block"
                  aria-label="Cart"
                >
                  <ShoppingCart size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta-dark text-[0.6rem] font-semibold text-white">
                      {cart.length}
                    </span>
                  )}
                </Link>
              )}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-cream-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta/20 text-xs font-semibold text-terracotta-dark">
                    {user.company
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="hidden text-left leading-tight sm:block">
                    <div className="text-[0.82rem] font-medium">{user.company}</div>
                    <div className="text-[0.7rem] capitalize text-muted">{user.role}</div>
                  </div>
                  <ChevronDown size={14} className="hidden sm:block" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-line bg-white p-1.5 shadow-lg">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-cream"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-cream"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-cream"
                    >
                      Profile Settings
                    </Link>
                    {!isSupplier && (
                      <Link
                        href="/cart"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-cream"
                      >
                        Cart
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        router.push("/");
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink/80 hover:bg-cream"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-ink/80 hover:text-ink"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-ink/85"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            className="p-1.5 text-ink lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {user && (
        <div className="border-t border-line px-5 py-2.5 md:hidden">
          <HeaderSearch placeholder={searchPlaceholder} />
        </div>
      )}

      {mobileOpen && (
        <div className="border-t border-line bg-cream px-5 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm font-medium text-ink/85"
              >
                {item.label}
                {item.badge && (
                  <span className="rounded-full bg-terracotta/15 px-1.5 py-0.5 text-[0.62rem] font-semibold text-terracotta-dark">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            {user && (
              <>
                {!isSupplier && (
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink/85"
                  >
                    Wishlist ({wishlist.length})
                  </Link>
                )}
                {!isSupplier && (
                  <Link
                    href="/cart"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink/85"
                  >
                    Cart ({cart.length})
                  </Link>
                )}
                {isSupplier && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink/85"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}