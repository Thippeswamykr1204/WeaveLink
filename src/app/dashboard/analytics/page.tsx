"use client";

import { useMemo, useState } from "react";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { useAppStore } from "@/lib/store";
import { getProduct, supplierProductsSeed } from "@/lib/mockData";
import { formatINR, cn } from "@/lib/utils";
import { AccountLayout } from "@/components/AccountLayout";

const statusColors: Record<string, string> = {
  Pending: "#D9A441",
  Confirmed: "#7A5FBF",
  Accepted: "#2E6BB8",
  Preparing: "#C8703D",
  Processing: "#D9A441",
  "In Transit": "#2E6BB8",
  "Ready for Dispatch": "#7A5FBF",
  Delivered: "#0F7A4A",
  Completed: "#0F7A4A",
  Cancelled: "#C0392B",
  Returned: "#C0392B",
};

const RANGE_OPTIONS = [
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "All Time", days: 0 },
] as const;

function dayLabel(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

// Deterministic pseudo-margin per product (no real cost data in the mock
// dataset) — stable across renders, varies 18%–42% by product id hash.
function marginPct(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return 18 + (hash % 25);
}

type SortKey = "name" | "category" | "qty" | "revenue" | "margin";
type SortDir = "asc" | "desc";

export default function AnalyticsPage() {
  const { orders } = useAppStore();
  const [range, setRange] = useState<(typeof RANGE_OPTIONS)[number]>(RANGE_OPTIONS[1]);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "revenue", dir: "desc" });

  const filteredOrders = useMemo(() => {
    if (range.days === 0) return orders;
    const latest = Math.max(...orders.map((o) => o.timestamp));
    const anchoredCutoff = latest - range.days * 24 * 60 * 60 * 1000;
    return orders.filter((o) => o.timestamp >= anchoredCutoff);
  }, [orders, range]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const activeProducts = supplierProductsSeed.filter((p) => p.status !== "Out of Stock").length;
  const lowStockCount = supplierProductsSeed.filter((p) => p.status === "Low Stock" || p.status === "Out of Stock").length;

  const prevRevenue = useMemo(() => {
    if (range.days === 0) return null;
    const latest = Math.max(...orders.map((o) => o.timestamp));
    const currentStart = latest - range.days * 24 * 60 * 60 * 1000;
    const prevStart = currentStart - range.days * 24 * 60 * 60 * 1000;
    const prevOrders = orders.filter((o) => o.timestamp >= prevStart && o.timestamp < currentStart);
    return prevOrders.reduce((sum, o) => sum + o.amount, 0);
  }, [orders, range]);

  const revenueChangePct =
    prevRevenue !== null && prevRevenue > 0
      ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)
      : null;

  const revenueOverTime = useMemo(() => {
    const byDay = new Map<string, { day: string; value: number; timestamp: number }>();
    [...filteredOrders]
      .sort((a, b) => a.timestamp - b.timestamp)
      .forEach((o) => {
        const key = dayLabel(o.timestamp);
        const existing = byDay.get(key);
        if (existing) existing.value += o.amount;
        else byDay.set(key, { day: key, value: o.amount, timestamp: o.timestamp });
      });
    return Array.from(byDay.values());
  }, [filteredOrders]);

  const ordersByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, color: statusColors[name] || "#8A7F6E" }))
      .filter((d) => d.value > 0);
  }, [filteredOrders]);

  // ── Full product sales table (qty, revenue, margin) ───────────────────────
  const productRows = useMemo(() => {
    const map = new Map<string, { id: string; name: string; category: string; revenue: number; qty: number }>();
    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        const product = getProduct(item.productId);
        const name = product?.name || item.productId;
        const category = product?.category || "Other";
        const revenue = item.pricePerMeter * item.quantity;
        const existing = map.get(item.productId);
        if (existing) {
          existing.revenue += revenue;
          existing.qty += item.quantity;
        } else {
          map.set(item.productId, { id: item.productId, name, category, revenue, qty: item.quantity });
        }
      });
    });
    const rows = Array.from(map.values()).map((r) => {
      const pct = marginPct(r.id);
      return { ...r, marginPct: pct, marginValue: Math.round((r.revenue * pct) / 100) };
    });
    rows.sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      const key = sort.key === "margin" ? "marginValue" : sort.key;
      const av = a[key as keyof typeof a];
      const bv = b[key as keyof typeof b];
      if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
      return ((av as number) - (bv as number)) * dir;
    });
    return rows;
  }, [filteredOrders, sort]);

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  }

  const revenueByCategory = useMemo(() => {
    const map = new Map<string, number>();
    productRows.forEach((r) => {
      map.set(r.category, (map.get(r.category) || 0) + r.revenue);
    });
    return Array.from(map.entries())
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [productRows]);

  const stockBreakdown = useMemo(() => {
    const counts: Record<string, number> = { Available: 0, "Low Stock": 0, "Out of Stock": 0 };
    supplierProductsSeed.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return [
      { name: "Available", value: counts["Available"], color: "#0F7A4A" },
      { name: "Low Stock", value: counts["Low Stock"], color: "#D9A441" },
      { name: "Out of Stock", value: counts["Out of Stock"], color: "#C0392B" },
    ].filter((d) => d.value > 0);
  }, []);

  const stats = [
    { icon: IndianRupee, label: "Total Revenue", value: formatINR(totalRevenue), change: revenueChangePct },
    { icon: ShoppingBag, label: "Total Orders", value: totalOrders, change: null },
    { icon: TrendingUp, label: "Avg. Order Value", value: formatINR(avgOrderValue), change: null },
    { icon: Package, label: "Active Products", value: activeProducts, change: null },
    { icon: AlertTriangle, label: "Low Stock Alerts", value: lowStockCount, change: null },
  ];

  function SortHeader({ label, sortKey, className }: { label: string; sortKey: SortKey; className?: string }) {
    const active = sort.key === sortKey;
    return (
      <th className={cn("cursor-pointer select-none px-3 py-2.5 text-left font-medium text-muted", className)} onClick={() => toggleSort(sortKey)}>
        <span className="flex items-center gap-1">
          {label}
          {active ? (
            sort.dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
          ) : (
            <ChevronsUpDown size={12} className="opacity-40" />
          )}
        </span>
      </th>
    );
  }

  return (
    <AccountLayout requireRole="supplier">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-muted">Sales trends, buyer demand, and product performance.</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setRangeOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium"
          >
            {range.label} <ChevronDown size={14} />
          </button>
          {rangeOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-xl border border-line bg-white p-1.5 shadow-lg">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setRange(opt);
                    setRangeOpen(false);
                  }}
                  className={cn(
                    "block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-cream",
                    opt.label === range.label ? "font-semibold text-terracotta-dark" : "text-ink/80"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
              <s.icon size={18} />
            </div>
            <div className="text-lg font-semibold sm:text-xl">{s.value}</div>
            <div className="mb-1 text-xs text-muted">{s.label}</div>
            {s.change !== null && (
              <div className={cn("text-[0.68rem] font-medium", s.change >= 0 ? "text-emerald-700" : "text-red-500")}>
                {s.change >= 0 ? "↑" : "↓"} {Math.abs(s.change)}% vs previous period
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-1 flex items-center justify-between">
            <div className="font-semibold">Revenue Over Time</div>
          </div>
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{formatINR(totalRevenue)}</span>
            {revenueChangePct !== null && (
              <span className={cn("text-xs font-medium", revenueChangePct >= 0 ? "text-emerald-700" : "text-red-500")}>
                {revenueChangePct >= 0 ? "↑" : "↓"} {Math.abs(revenueChangePct)}%
              </span>
            )}
          </div>
          <div className="h-56">
            {revenueOverTime.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted">No orders in this period.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueOverTime}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C8703D" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#C8703D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8A7F6E" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: 12, border: "1px solid #E7DDCC", fontSize: 12 }} />
                  <Area type="monotone" dataKey="value" stroke="#A85A2E" strokeWidth={2} fill="url(#revenueFill)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 font-semibold">Orders by Status</div>
          {ordersByStatus.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted">No orders in this period.</div>
          ) : (
            <>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ordersByStatus} dataKey="value" nameKey="name" innerRadius={40} outerRadius={65} paddingAngle={2}>
                      {ordersByStatus.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7DDCC", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 space-y-1.5">
                {ordersByStatus.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-ink/75">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </span>
                    <span className="font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Full sortable product sales table */}
      <div className="mb-6 rounded-2xl border border-line bg-white p-5">
        <div className="mb-4 font-semibold">Product Performance</div>
        {productRows.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted">No product sales in this period.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-line text-xs">
                  <SortHeader label="Product" sortKey="name" />
                  <SortHeader label="Category" sortKey="category" />
                  <SortHeader label="Qty Sold (m)" sortKey="qty" className="text-right" />
                  <SortHeader label="Revenue" sortKey="revenue" className="text-right" />
                  <SortHeader label="Margin" sortKey="margin" className="text-right" />
                </tr>
              </thead>
              <tbody>
                {productRows.map((r) => (
                  <tr key={r.id} className="border-b border-line/60 last:border-0">
                    <td className="px-3 py-2.5 font-medium">{r.name}</td>
                    <td className="px-3 py-2.5 text-ink/70">{r.category}</td>
                    <td className="px-3 py-2.5 text-right text-ink/70">{r.qty.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right font-medium">{formatINR(r.revenue)}</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="text-ink/70">{r.marginPct}%</span>{" "}
                      <span className="text-emerald-700">({formatINR(r.marginValue)})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-[0.65rem] text-muted">
          Margin is estimated per product (no cost data in the source system) — connect your cost sheet for exact figures.
        </p>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 font-semibold">Revenue by Category</div>
          {revenueByCategory.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted">No product sales in this period.</div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByCategory} margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7DDCC" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#8A7F6E" }} axisLine={false} tickLine={false} />
                  <YAxis type="number" tick={{ fontSize: 10, fill: "#8A7F6E" }} axisLine={false} tickLine={false} hide />
                  <Tooltip
                    cursor={false}
                    formatter={(v) => formatINR(Number(v))}
                    contentStyle={{ borderRadius: 12, border: "1px solid #E7DDCC", fontSize: 12 }}
                  />
                  <Bar dataKey="revenue" fill="#C8703D" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 font-semibold">Inventory Stock Status</div>
          <div className="grid gap-3 sm:grid-cols-3">
            {stockBreakdown.map((d) => (
              <div key={d.name} className="flex items-center gap-3 rounded-xl border border-line p-3.5">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                <div>
                  <div className="text-lg font-semibold">{d.value}</div>
                  <div className="text-xs text-muted">{d.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}