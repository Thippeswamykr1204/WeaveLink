"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Download,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Copy,
  MapPin,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  IndianRupee,
  MoreHorizontal,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getProduct, OrderStatus } from "@/lib/mockData";
import { formatINR, cn } from "@/lib/utils";
import { AccountLayout } from "@/components/AccountLayout";

export default function OrdersPage() {
  const router = useRouter();
  const { user, hydrated } = useAppStore();

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return <div className="mx-auto max-w-lg px-5 py-24 text-center text-sm text-muted">Loading...</div>;
  }

  if (user.role === "supplier") {
    return <SupplierOrders />;
  }
  return <BuyerOrders />;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Buyer order history (unchanged behavior, extracted as its own component) */
/* ────────────────────────────────────────────────────────────────────── */

const buyerTabOrder: (OrderStatus | "All")[] = [
  "All",
  "Confirmed",
  "Processing",
  "In Transit",
  "Delivered",
  "Cancelled",
  "Returned",
];

const statusStyles: Record<OrderStatus, { dot: string; text: string }> = {
  Pending: { dot: "bg-amber-500", text: "text-amber-700 bg-amber-50" },
  Confirmed: { dot: "bg-indigo-500", text: "text-indigo-700 bg-indigo-50" },
  Accepted: { dot: "bg-sky-500", text: "text-sky-700 bg-sky-50" },
  Preparing: { dot: "bg-terracotta", text: "text-terracotta-dark bg-terracotta/10" },
  Processing: { dot: "bg-amber-500", text: "text-amber-700 bg-amber-50" },
  "In Transit": { dot: "bg-sky-500", text: "text-sky-700 bg-sky-50" },
  "Ready for Dispatch": { dot: "bg-terracotta", text: "text-terracotta-dark bg-terracotta/10" },
  Delivered: { dot: "bg-emerald-600", text: "text-emerald-700 bg-emerald-50" },
  Completed: { dot: "bg-emerald-600", text: "text-emerald-700 bg-emerald-50" },
  Cancelled: { dot: "bg-red-500", text: "text-red-700 bg-red-50" },
  Returned: { dot: "bg-red-500", text: "text-red-700 bg-red-50" },
};

const PAGE_SIZE = 10;

function BuyerOrders() {
  const router = useRouter();
  const { orders } = useAppStore();
  const [activeTab, setActiveTab] = useState<OrderStatus | "All">("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: orders.length };
    for (const o of orders) c[o.status] = (c[o.status] || 0) + 1;
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (activeTab !== "All" && o.status !== activeTab) return false;
      if (query) {
        const q = query.toLowerCase();
        const matchesProduct = o.items.some((i) => i.productId.includes(q));
        if (!o.id.toLowerCase().includes(q) && !o.supplier.toLowerCase().includes(q) && !matchesProduct) {
          return false;
        }
      }
      return true;
    });
  }, [orders, activeTab, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);


  return (
    <AccountLayout>
      <div className="mb-1 flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <h1 className="mb-1 font-serif text-2xl sm:text-3xl">Orders</h1>
          <p className="mb-5 text-sm text-muted">Track and manage all your orders in one place.</p>

          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {buyerTabOrder.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTab(t);
                  setPage(1);
                }}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium",
                  activeTab === t ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/75"
                )}
              >
                {t === "All" ? "All Orders" : t}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[0.68rem] font-semibold",
                    activeTab === t ? "bg-white/20" : "bg-cream-2"
                  )}
                >
                  {counts[t] || 0}
                </span>
              </button>
            ))}
          </div>

          <div className="mb-5 flex flex-col gap-2.5 sm:flex-row">
            <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-2.5">
              <Search size={16} className="text-muted" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by order ID, supplier, product..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
              <SlidersHorizontal size={15} /> Filter
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
              <Calendar size={15} /> May 22 – May 28, 2024
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
              <Download size={15} /> Export
            </button>
          </div>

          {pageItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white py-16 text-center">
              <div className="mb-1 font-medium">No orders found</div>
              <p className="text-sm text-muted">Try a different filter or search term.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[840px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      <th className="px-4 py-3">Order Details</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Supplier</th>
                      <th className="px-4 py-3">Items</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Delivery</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((o) => (
                      <tr
                        key={o.id}
                        onClick={() => router.push(`/orders/${o.id}`)}
                        className="cursor-pointer border-b border-line last:border-0 hover:bg-cream/40"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 font-medium">
                            #{o.id} <Copy size={12} className="text-muted" />
                          </div>
                          <div className="text-xs text-muted">
                            {o.items.length} item{o.items.length > 1 ? "s" : ""}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-ink/80">{o.date}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            {o.supplier}
                            {o.supplierVerified && <CheckCircle2 size={13} className="text-emerald-600" />}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted">
                            <MapPin size={11} /> {o.location}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-ink/80">{o.items.length}</td>
                        <td className="whitespace-nowrap px-4 py-3.5 font-medium">
                          {formatINR(o.amount)}
                          <Link
                            href={`/orders/${o.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="block text-xs font-normal text-terracotta-dark hover:underline"
                          >
                            View Details
                          </Link>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[o.status].text)}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", statusStyles[o.status].dot)} />
                            {o.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-ink/80">
                          {o.deliveryDate}
                          <div className="text-xs text-muted">{o.status}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <Link
                            href={`/orders/${o.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg p-1.5 hover:bg-cream-2"
                            aria-label="More actions"
                          >
                            <MoreHorizontal size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-3.5 sm:flex-row">
                <span className="text-xs text-muted">
                  Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} orders
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-line p-1.5 disabled:opacity-40"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }).slice(0, 4).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={cn(
                        "h-7 w-7 rounded-lg text-xs font-medium",
                        page === i + 1 ? "bg-ink text-white" : "border border-line"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-lg border border-line p-1.5 disabled:opacity-40"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Supplier order management                                              */
/* ────────────────────────────────────────────────────────────────────── */

// Orders in the shared mock store carry buyer-facing status names (e.g. "Delivered",
// "In Transit"). Suppliers manage orders using the fulfillment vocabulary shown in
// the order detail page, so we normalize into that set here — mirrors statusStepIndex
// in [orderId]/page.tsx.
type SupplierStatus = "Pending" | "Accepted" | "Preparing" | "Ready for Dispatch" | "Completed" | "Cancelled";

const supplierTabOrder: (SupplierStatus | "All")[] = [
  "All",
  "Pending",
  "Accepted",
  "Preparing",
  "Ready for Dispatch",
  "Completed",
  "Cancelled",
];

function toSupplierStatus(status: OrderStatus): SupplierStatus {
  switch (status) {
    case "Pending":
      return "Pending";
    case "Confirmed":
    case "Accepted":
      return "Accepted";
    case "Processing":
    case "Preparing":
      return "Preparing";
    case "In Transit":
    case "Ready for Dispatch":
      return "Ready for Dispatch";
    case "Delivered":
    case "Completed":
      return "Completed";
    default:
      return "Cancelled"; // Cancelled / Returned
  }
}

const supplierStatusBadge: Record<SupplierStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Accepted: "bg-sky-100 text-sky-800",
  Preparing: "bg-terracotta/15 text-terracotta-dark",
  "Ready for Dispatch": "bg-indigo-100 text-indigo-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-700",
};

const SUP_PAGE_SIZE = 10;

function SupplierOrders() {
  const router = useRouter();
  const { orders } = useAppStore();
  const [activeTab, setActiveTab] = useState<SupplierStatus | "All">("All");
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState<"Products" | "Buyers">("Products");
  const [page, setPage] = useState(1);

  const normalized = useMemo(
    () => orders.map((o) => ({ order: o, status: toSupplierStatus(o.status) })),
    [orders]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: normalized.length };
    for (const n of normalized) c[n.status] = (c[n.status] || 0) + 1;
    return c;
  }, [normalized]);

  const filtered = useMemo(() => {
    return normalized.filter(({ order: o, status }) => {
      if (activeTab !== "All" && status !== activeTab) return false;
      if (query) {
        const q = query.toLowerCase();
        if (searchBy === "Buyers") {
          if (!(o.buyerCompany || "").toLowerCase().includes(q) && !o.id.toLowerCase().includes(q)) {
            return false;
          }
        } else {
          const matchesProduct = o.items.some((i) => {
            const p = getProduct(i.productId);
            return i.productId.toLowerCase().includes(q) || (p?.name || "").toLowerCase().includes(q);
          });
          if (!matchesProduct && !o.id.toLowerCase().includes(q)) return false;
        }
      }
      return true;
    });
  }, [normalized, activeTab, query, searchBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / SUP_PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * SUP_PAGE_SIZE, page * SUP_PAGE_SIZE);

  const totalOrderValue = orders.reduce((s, o) => s + o.amount, 0);
  const pendingOrders = normalized.filter((n) => n.status === "Pending").length;
  const readyToDispatch = normalized.filter((n) => n.status === "Ready for Dispatch").length;
  const completedOrders = normalized.filter((n) => n.status === "Completed").length;

  const statCards = [
    { icon: Package, label: "Total Orders", value: String(orders.length) },
    { icon: IndianRupee, label: "Total Order Value", value: formatINR(totalOrderValue) },
    { icon: Clock, label: "Pending Orders", value: String(pendingOrders) },
    { icon: Truck, label: "Ready to Dispatch", value: String(readyToDispatch) },
    { icon: CheckCircle2, label: "Completed Orders", value: String(completedOrders) },
  ];

  const goToOrder = (id: string) => router.push(`/orders/${id}`);

  return (
    <AccountLayout>
      <h1 className="mb-1 font-serif text-2xl sm:text-3xl">Order Management</h1>
      <p className="mb-5 text-sm text-muted">Review, update, and fulfill orders placed by your buyers.</p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
              <s.icon size={16} />
            </div>
            <div className="text-lg font-semibold sm:text-xl">{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {supplierTabOrder.map((t) => (
          <button
            key={t}
            onClick={() => {
              setActiveTab(t);
              setPage(1);
            }}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium",
              activeTab === t ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/75"
            )}
          >
            {t === "All" ? "All" : t}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[0.68rem] font-semibold",
                activeTab === t ? "bg-white/20" : "bg-cream-2"
              )}
            >
              {counts[t] || 0}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-2.5 sm:flex-row">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-2.5">
          <Search size={16} className="text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={`Search by order ID or ${searchBy.toLowerCase()}...`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
        <div className="relative">
          <select
            value={searchBy}
            onChange={(e) => {
              setSearchBy(e.target.value as "Products" | "Buyers");
              setPage(1);
            }}
            className="h-full appearance-none rounded-xl border border-line bg-white px-4 py-2.5 pr-9 text-sm font-medium outline-none"
          >
            <option value="Products">Products</option>
            <option value="Buyers">Buyers</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
          <Calendar size={15} /> May 22 – May 28, 2024
        </button>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      {pageItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white py-16 text-center">
          <div className="mb-1 font-medium">No orders found</div>
          <p className="text-sm text-muted">Try a different filter or search term.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Buyer</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Order Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(({ order: o, status }) => {
                  const firstProduct = getProduct(o.items[0]?.productId);
                  const qty = o.items.reduce((s, i) => s + i.quantity, 0);
                  const isActive = status !== "Completed" && status !== "Cancelled";
                  return (
                    <tr
                      key={o.id}
                      onClick={() => goToOrder(o.id)}
                      className="cursor-pointer border-b border-line last:border-0 hover:bg-cream/40"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 font-medium">
                          #{o.id} <Copy size={12} className="text-muted" />
                        </div>
                      </td>
                      <td className="px-4 py-3.5">{o.buyerCompany || "—"}</td>
                      <td className="px-4 py-3.5">
                        {firstProduct?.name || o.items[0]?.productId || "—"}
                        {o.items.length > 1 && (
                          <div className="text-xs text-muted">+{o.items.length - 1} more</div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-ink/80">{qty} Mtrs</td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-medium">{formatINR(o.amount)}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold", supplierStatusBadge[status])}>
                          {status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-ink/80">{o.date}</td>
                      <td className="px-4 py-3.5">
                        {isActive ? (
                          <Link
                            href={`/orders/${o.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium hover:bg-cream-2"
                          >
                            Update Status <ChevronDown size={12} />
                          </Link>
                        ) : (
                          <Link
                            href={`/orders/${o.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:bg-ink/85"
                          >
                            View Details
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-3.5 sm:flex-row">
            <span className="text-xs text-muted">
              Showing {(page - 1) * SUP_PAGE_SIZE + 1} to {Math.min(page * SUP_PAGE_SIZE, filtered.length)} of {filtered.length} orders
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-line p-1.5 disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }).slice(0, 4).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "h-7 w-7 rounded-lg text-xs font-medium",
                    page === i + 1 ? "bg-ink text-white" : "border border-line"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-line p-1.5 disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}