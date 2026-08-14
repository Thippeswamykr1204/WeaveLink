"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  Heart,
  FileText,
  Users,
  ChevronDown,
  RefreshCw,
  Sparkles,
  Bookmark,
  TrendingUp,
  Percent,
  Zap,
  ClipboardList,
  MessageCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppStore } from "@/lib/store";
import {
  getProduct,
  spendByCategory,
  spendingOverTime,
  topSuppliers,
  recentActivity,
  ActivityItem,
  restockRecommendations,
  RestockPriority,
  categoryPhoto,
  InventoryProduct,
} from "@/lib/mockData";
import { formatINR, cn } from "@/lib/utils";
import { AccountLayout } from "@/components/AccountLayout";
import { FabricSwatch } from "@/components/FabricSwatch";

const statusColor: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-indigo-100 text-indigo-800",
  Accepted: "bg-sky-100 text-sky-800",
  Processing: "bg-amber-100 text-amber-800",
  "In Transit": "bg-sky-100 text-sky-800",
  Preparing: "bg-terracotta/15 text-terracotta-dark",
  "Ready for Dispatch": "bg-indigo-100 text-indigo-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-700",
  Returned: "bg-red-100 text-red-700",
};

const activityIcon: Record<ActivityItem["icon"], React.ElementType> = {
  order: ShoppingBag,
  shipment: Package,
  quote: FileText,
  wishlist: Heart,
};

const priorityColor: Record<RestockPriority, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-emerald-100 text-emerald-800",
};

const restockFilterPills = ["All Recommendations", "High Priority", "Fast Moving", "Seasonal"] as const;
type RestockFilterPill = (typeof restockFilterPills)[number];

export default function DashboardPage() {
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
    return <SupplierDashboard />;
  }
  return <BuyerDashboard />;
}

function BuyerDashboard() {
  const { user, wishlist, orders } = useAppStore();

  const totalSpend = orders.reduce((sum, o) => sum + o.amount, 0);
  const orderStatusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const orderStatusData = [
    { name: "Delivered", value: orderStatusCounts["Delivered"] || 0, color: "#0F7A4A" },
    { name: "In Transit", value: orderStatusCounts["In Transit"] || 0, color: "#2E6BB8" },
    { name: "Processing", value: orderStatusCounts["Processing"] || 0, color: "#D9A441" },
    { name: "Confirmed", value: orderStatusCounts["Confirmed"] || 0, color: "#7A5FBF" },
  ].filter((d) => d.value > 0);

  const stats = [
    { icon: Package, label: "Total Spend", value: formatINR(totalSpend), change: "+12.5%", up: true },
    { icon: ShoppingBag, label: "Total Orders", value: orders.length, change: "+20%", up: true },
    { icon: FileText, label: "Active Quotes", value: 5, change: "-16.7%", up: false },
    { icon: Heart, label: "Saved Items", value: wishlist.length, change: "+8.9%", up: true },
    { icon: Users, label: "Preferred Suppliers", value: 18, change: "+5.6%", up: true },
  ];

  return (
    <AccountLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl">Good morning, {user!.name.split(" ")[0]}! 👋</h1>
          <p className="mt-1 text-sm text-muted">Here&apos;s what&apos;s happening with your sourcing today.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
          May 22 – May 28, 2024 <ChevronDown size={14} />
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
              <s.icon size={18} />
            </div>
            <div className="text-lg font-semibold sm:text-xl">{s.value}</div>
            <div className="mb-1 text-xs text-muted">{s.label}</div>
            <div className={cn("text-[0.68rem] font-medium", s.up ? "text-emerald-700" : "text-red-500")}>
              {s.up ? "↑" : "↓"} {s.change.replace("-", "").replace("+", "")} vs last 7 days
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-1 flex items-center justify-between">
            <div className="font-semibold">Spending Overview</div>
            <button className="flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-medium">
              This Week <ChevronDown size={12} />
            </button>
          </div>
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{formatINR(totalSpend)}</span>
            <span className="text-xs font-medium text-emerald-700">↑ 12.5%</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingOverTime}>
                <defs>
                  <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C8703D" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#C8703D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8A7F6E" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  formatter={(v) => formatINR(Number(v))}
                  contentStyle={{ borderRadius: 12, border: "1px solid #E7DDCC", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="value" stroke="#A85A2E" strokeWidth={2} fill="url(#spendFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold">Spend by Category</div>
            <button className="flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-medium">
              This Week <ChevronDown size={12} />
            </button>
          </div>
          <div className="relative mx-auto mb-4 h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={spendByCategory} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={2}>
                  {spendByCategory.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xs text-muted">Total</div>
              <div className="text-sm font-semibold">{formatINR(totalSpend)}</div>
            </div>
          </div>
          <div className="space-y-1.5">
            {spendByCategory.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="font-medium">
                  {formatINR(c.value)} <span className="text-muted">({((c.value / totalSpend) * 100).toFixed(1)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold">Order Status</div>
            <button className="flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-medium">
              This Week <ChevronDown size={12} />
            </button>
          </div>
          <div className="relative mx-auto mb-4 h-36 w-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderStatusData} dataKey="value" innerRadius={40} outerRadius={64} paddingAngle={2}>
                  {orderStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xl font-semibold">{orders.length}</div>
              <div className="text-[0.65rem] text-muted">Total Orders</div>
            </div>
          </div>
          <div className="space-y-1.5">
            {orderStatusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-medium">{s.value} ({((s.value / orders.length) * 100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
          <Link href="/orders" className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-line py-2.5 text-xs font-semibold">
            View All Orders →
          </Link>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold">Top Suppliers</div>
            <button className="flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-medium">
              This Week <ChevronDown size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {topSuppliers.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-2 text-xs font-semibold">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatINR(s.spend)}</div>
                  <div className={cn("text-[0.65rem] font-medium", s.change >= 0 ? "text-emerald-700" : "text-red-500")}>
                    {s.change >= 0 ? "↑" : "↓"} {Math.abs(s.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/suppliers" className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-line py-2.5 text-xs font-semibold">
            View All Suppliers →
          </Link>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold">Recent Activity</div>
            <button className="flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-medium">
              All Activities <ChevronDown size={12} />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((a) => {
              const Icon = activityIcon[a.icon];
              return (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-muted">{a.detail}</div>
                  </div>
                  <div className="shrink-0 text-[0.65rem] text-muted">{a.time}</div>
                </div>
              );
            })}
          </div>
          <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-line py-2.5 text-xs font-semibold">
            View All Activity →
          </button>
        </div>
      </div>
    </AccountLayout>
  );
}

const mockInventory = [
  { product: "premium-cotton-poplin", stock: 5600, active: true },
  { product: "linen-blend-fabric", stock: 3100, active: true },
  { product: "silk-satin-fabric", stock: 0, active: false },
];

// Simple circular gauge, drawn as an SVG arc — no chart library needed.
function InventoryHealthGauge({ score }: { score: number }) {
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#0F7A4A" : score >= 50 ? "#D9A441" : "#C0392B";

  return (
    <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle
          stroke="#EDE4D3"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset, transition: "stroke-dashoffset 0.5s" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold">{score}</div>
        <div className="text-[0.65rem] text-muted">/ 100</div>
      </div>
    </div>
  );
}

// Live low/out-of-stock alerts — pulled straight from the store's `products`
// array, whose `status` field is kept in sync by computeProductStatus()
// every time stock changes (see store.ts), so this always matches reality.
function InventoryAlertsWidget({ alerts }: { alerts: InventoryProduct[] }) {
  const outOfStock = alerts.filter((p) => p.status === "Out of Stock").length;
  const lowStock = alerts.filter((p) => p.status === "Low Stock").length;
  const visible = alerts.slice(0, 5);

  return (
    <div className="mb-8 rounded-2xl border border-line bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              alerts.length > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
            )}
          >
            <AlertTriangle size={16} />
          </div>
          <div>
            <div className="text-sm font-semibold">Inventory Alerts</div>
            <div className="text-xs text-muted">
              {alerts.length > 0
                ? `${outOfStock} out of stock · ${lowStock} running low`
                : "All products are well stocked"}
            </div>
          </div>
        </div>
        {alerts.length > 0 && (
          <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
            {alerts.length}
          </span>
        )}
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2.5">
          {visible.map((p) => (
            <Link
              key={p.id}
              href="/products/inventory"
              className="flex items-center justify-between rounded-xl border border-line px-3.5 py-2.5 transition hover:border-ink/30"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{p.name}</div>
                <div className="text-xs text-muted">
                  {p.stock.toLocaleString()} meter in stock · SKU {p.sku}
                </div>
              </div>
              <span
                className={cn(
                  "ml-3 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                  p.status === "Out of Stock" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"
                )}
              >
                {p.status}
              </span>
            </Link>
          ))}
        </div>
      )}

      {alerts.length > 5 && (
        <Link
          href="/products/inventory"
          className="mt-3 block text-center text-xs font-semibold text-terracotta-dark"
        >
          View all {alerts.length} alerts →
        </Link>
      )}
    </div>
  );
}

function AiRestockPanel() {
  const [activeFilter, setActiveFilter] = useState<RestockFilterPill>("All Recommendations");
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [refreshedJustNow, setRefreshedJustNow] = useState(true);

  const filtered = useMemo(() => {
    return restockRecommendations.filter((r) => {
      if (activeFilter === "All Recommendations") return true;
      if (activeFilter === "High Priority") return r.priority === "High";
      if (activeFilter === "Fast Moving") return r.tag === "Fast Moving";
      if (activeFilter === "Seasonal") return r.tag === "Seasonal";
      return true;
    });
  }, [activeFilter]);

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  };

  // Insights + gauge are computed from the real restockRecommendations / mockInventory arrays, not hardcoded.
  const highPriorityCount = restockRecommendations.filter((r) => r.priority === "High").length;
  const fastMovingCount = restockRecommendations.filter((r) => r.tag === "Fast Moving").length;
  const totalProfitPotential = restockRecommendations.reduce((sum, r) => sum + r.profitImpact, 0);
  const activeInventoryRatio = mockInventory.filter((i) => i.active).length / mockInventory.length;
  const healthScore = Math.round(activeInventoryRatio * 60 + (1 - highPriorityCount / restockRecommendations.length) * 40);

  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-[2fr_0.9fr]">
      {/* Restock table panel */}
      <div className="rounded-2xl border border-line bg-white p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles size={16} className="text-terracotta-dark" /> AI Restock Recommendations
            </div>
            <p className="mt-1 text-xs text-muted">Rule-based suggestions from your sales velocity and market trends.</p>
          </div>
          <button
            onClick={() => setRefreshedJustNow(true)}
            className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-1.5 text-xs font-medium text-ink/75 hover:border-ink"
          >
            <RefreshCw size={12} /> {refreshedJustNow ? "Updated just now" : "Refresh"}
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {restockFilterPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveFilter(pill)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium",
                activeFilter === pill ? "border-ink bg-ink text-white" : "border-line text-ink/70 hover:border-ink/40"
              )}
            >
              {pill}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-muted">
                <th className="py-2 pr-3 font-medium">Product</th>
                <th className="py-2 pr-3 font-medium">Why Restock?</th>
                <th className="py-2 pr-3 font-medium">Suggested Qty</th>
                <th className="py-2 pr-3 font-medium">Est. Profit Impact</th>
                <th className="py-2 pr-3 font-medium">Priority</th>
                <th className="py-2 pr-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const p = getProduct(r.productId);
                if (!p) return null;
                return (
                  <tr key={r.id} className="border-b border-line/60 last:border-0">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2.5">
                        <FabricSwatch
                          image={categoryPhoto(p.category)}
                          tint={p.colors[0]}
                          className="h-9 w-9 shrink-0 rounded-lg"
                        />
                        <span className="max-w-[140px] truncate text-sm font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="max-w-[220px] py-3 pr-3 text-xs text-muted">{r.reason}</td>
                    <td className="py-3 pr-3 text-sm font-medium">{r.suggestedQty.toLocaleString()} m</td>
                    <td className="py-3 pr-3 text-sm font-medium text-emerald-700">{formatINR(r.profitImpact)}</td>
                    <td className="py-3 pr-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-[0.68rem] font-medium", priorityColor[r.priority])}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-1.5">
                        <button className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:bg-ink/85">
                          Restock Now
                        </button>
                        <button
                          onClick={() => toggleBookmark(r.id)}
                          aria-label="Bookmark recommendation"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-ink/70 hover:border-ink"
                        >
                          <Bookmark size={14} className={bookmarked.includes(r.id) ? "fill-terracotta-dark text-terracotta-dark" : ""} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-muted">
                    No recommendations match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-terracotta/8 p-3.5 text-xs text-ink/75">
          <Sparkles size={14} className="mt-0.5 shrink-0 text-terracotta-dark" />
          AI analyzes your sales, market trends, and buyer reorder patterns to flag products worth restocking before you run out or miss seasonal demand.
        </div>
      </div>

      {/* Right column: insights, health gauge, quick actions */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-3 text-sm font-semibold">Restock Insights</div>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                <AlertTriangle size={14} />
              </div>
              <div>
                <div className="text-xs font-semibold">{highPriorityCount} high-priority items</div>
                <div className="text-[0.68rem] text-muted">Need attention before they run out.</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <TrendingUp size={14} />
              </div>
              <div>
                <div className="text-xs font-semibold">{formatINR(totalProfitPotential)} profit potential</div>
                <div className="text-[0.68rem] text-muted">Across all current recommendations.</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                <Zap size={14} />
              </div>
              <div>
                <div className="text-xs font-semibold">{fastMovingCount} fast-moving products</div>
                <div className="text-[0.68rem] text-muted">Selling faster than usual this month.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 text-center">
          <div className="mb-3 text-sm font-semibold">Inventory Health Score</div>
          <InventoryHealthGauge score={healthScore} />
          <p className="mt-3 text-[0.68rem] text-muted">
            Based on active product ratio and open high-priority recommendations.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-3 text-sm font-semibold">Quick Actions</div>
          <div className="space-y-2">
            <Link href="/products/inventory" className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 text-xs font-medium hover:border-ink">
              <ClipboardList size={14} className="text-terracotta-dark" /> Update Stock Levels
            </Link>
            <Link href="/dashboard/reports" className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 text-xs font-medium hover:border-ink">
              <Percent size={14} className="text-terracotta-dark" /> View Sales Reports
            </Link>
            <Link href="/ai-assistant" className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 text-xs font-medium hover:border-ink">
              <MessageCircle size={14} className="text-terracotta-dark" /> Ask AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupplierDashboard() {
  const router = useRouter();
  const { user, orders, products: storeProducts } = useAppStore();
  // Most recent orders from the shared store, newest first — real IDs so rows link
  // through to a working /orders/[orderId] detail page.
  const recentOrders = [...orders].sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;
  // Live stock alerts, derived from the real store (status is computed by
  // computeProductStatus in store.ts whenever stock changes) — not mock data.
  const stockAlerts = [
    ...storeProducts.filter((p) => p.status === "Out of Stock"),
    ...storeProducts.filter((p) => p.status === "Low Stock"),
  ];

  return (
    <AccountLayout requireRole="supplier">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl">{user!.company}</h1>
          <p className="text-sm text-muted capitalize">{user!.role} · {user!.name}</p>
        </div>
        <Link href="/products/new" className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          Add New Product
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { icon: Package, label: "Total Products", value: mockInventory.length },
          { icon: CheckCircle2, label: "Active Products", value: mockInventory.filter((i) => i.active).length },
          { icon: Clock, label: "Pending Orders", value: pendingOrdersCount },
          { icon: ShoppingBag, label: "Recent Orders", value: recentOrders.length },
          { icon: AlertTriangle, label: "Inventory Alerts", value: stockAlerts.length },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-4">
            <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
              <s.icon size={16} />
            </div>
            <div className="text-xl font-semibold">{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <AiRestockPanel />

      <InventoryAlertsWidget alerts={stockAlerts} />

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-serif text-xl">Inventory</h2>
          <div className="space-y-3">
            {mockInventory.map((i) => {
              const p = getProduct(i.product);
              if (!p) return null;
              return (
                <div key={p.id} className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-3.5">
                  <FabricSwatch
                    image={categoryPhoto(p.category)}
                    tint={p.colors[0]}
                    className="h-14 w-14 shrink-0 rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted">{i.stock.toLocaleString()} meter in stock</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${i.active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
                    {i.active ? "Available" : "Out of Stock"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl">Recent Orders</h2>
            <Link href="/orders" className="text-xs font-semibold text-terracotta-dark">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((o) => {
              const p = getProduct(o.items[0]?.productId);
              const qty = o.items.reduce((sum, i) => sum + i.quantity, 0);
              return (
                <button
                  key={o.id}
                  onClick={() => router.push(`/orders/${o.id}`)}
                  className="block w-full rounded-2xl border border-line bg-white p-3.5 text-left transition hover:border-ink/30"
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium">{o.buyerCompany || "—"}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span>
                  </div>
                  <div className="text-xs text-muted">{p?.name || o.items[0]?.productId} · {qty}m · #{o.id}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}