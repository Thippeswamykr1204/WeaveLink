"use client";

import Link from "next/link";
import { ChevronRight, X, Plus, Share2, Sparkles, TrendingDown, Crown, Shirt, GitCompare } from "lucide-react";
import { getProduct, Product, categoryPhoto } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";
import { formatINR, cn } from "@/lib/utils";
import { FabricSwatch } from "@/components/FabricSwatch";

// ── Pure rule-based "AI Insights" logic ─────────────────────────────────────
// Kept as a standalone function (no API call) so the derivation is easy to audit.

interface ComparisonInsight {
  key: "bestValue" | "premiumChoice" | "mostVersatile";
  title: string;
  icon: typeof TrendingDown;
  product: Product;
  reason: string;
}

function computeComparisonInsights(items: Product[]): ComparisonInsight[] {
  if (items.length === 0) return [];

  const bestValue = [...items].sort((a, b) => a.pricePerMeter - b.pricePerMeter)[0];

  const premiumChoice = [...items].sort((a, b) => {
    if (b.supplierRating !== a.supplierRating) return b.supplierRating - a.supplierRating;
    return b.pricePerMeter - a.pricePerMeter;
  })[0];

  const mostVersatile = [...items].sort((a, b) => b.colors.length - a.colors.length)[0];

  return [
    {
      key: "bestValue",
      title: "Best Value",
      icon: TrendingDown,
      product: bestValue,
      reason: `${bestValue.name} offers the lowest price at ${formatINR(bestValue.pricePerMeter)}/meter among the compared fabrics.`,
    },
    {
      key: "premiumChoice",
      title: "Premium Choice",
      icon: Crown,
      product: premiumChoice,
      reason: `${premiumChoice.name} leads with a ${premiumChoice.supplierRating}★ supplier rating, best suited for premium segments.`,
    },
    {
      key: "mostVersatile",
      title: "Most Versatile",
      icon: Shirt,
      product: mostVersatile,
      reason: `${mostVersatile.name} comes in ${mostVersatile.colors.length} color options, giving it the widest range of use cases.`,
    },
  ];
}

// Each row: a plain-text `value` (used to detect differences) plus a `render` for display.
const specRows: { label: string; value: (p: Product) => string; render: (p: Product) => React.ReactNode }[] = [
  { label: "Fabric Type", value: (p) => p.fabricType, render: (p) => p.fabricType },
  { label: "Composition", value: (p) => p.material, render: (p) => p.material },
  { label: "GSM", value: (p) => `${p.gsm}`, render: (p) => `${p.gsm} GSM` },
  { label: "Width", value: (p) => p.width, render: (p) => p.width },
  { label: "Weave", value: (p) => p.weave, render: (p) => p.weave },
  { label: "Finish", value: (p) => p.finish, render: (p) => p.finish },
  {
    label: "Color Options",
    value: (p) => `${p.colors.length}`,
    render: (p) => (
      <div className="flex items-center gap-1.5">
        {p.colors.slice(0, 5).map((c, i) => (
          <span key={i} className="h-4 w-4 rounded-full border border-black/10" style={{ background: c }} />
        ))}
        {p.colors.length > 5 && <span className="text-xs text-muted">+{p.colors.length - 5}</span>}
      </div>
    ),
  },
  { label: "MOQ", value: (p) => `${p.moq}`, render: (p) => `${p.moq} Meters` },
  { label: "Price/Meter", value: (p) => `${p.pricePerMeter}`, render: (p) => `${formatINR(p.pricePerMeter)} /m` },
  {
    label: "Bulk Pricing",
    value: (p) => `${p.bulkPrice}-${p.bulkMinQty}`,
    render: (p) => (
      <span className="inline-flex rounded-full bg-emerald-700/10 px-2.5 py-1 text-xs font-medium text-emerald-700">
        {formatINR(p.bulkPrice)} ({p.bulkMinQty}m+)
      </span>
    ),
  },
  {
    label: "Stock Availability",
    value: (p) => (p.stock > 0 ? "in-stock" : "out-of-stock"),
    render: (p) => (
      <span className={p.stock > 0 ? "font-medium text-emerald-700" : "font-medium text-red-600"}>
        {p.stock > 0 ? `In Stock (${p.stock.toLocaleString()} m)` : "Out of Stock"}
      </span>
    ),
  },
  { label: "Country of Origin", value: (p) => p.origin, render: (p) => p.origin },
  { label: "Best For", value: (p) => p.features.join(", "), render: (p) => p.features.join(", ") },
  {
    label: "Supplier Rating",
    value: (p) => `${p.supplierRating}`,
    render: (p) => (
      <span className="flex items-center gap-1">
        <span className="text-terracotta-dark">★★★★★</span>
        {p.supplierRating} ({p.supplierReviews})
      </span>
    ),
  },
];

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useAppStore();
  const items = compareList
    .map((id) => getProduct(id))
    .filter((p): p is Product => Boolean(p));

  const insights = computeComparisonInsights(items);
  const emptySlots = Math.max(0, 3 - items.length);
  const colCount = items.length + emptySlots;

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8">
      <div className="mb-3 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/marketplace" className="hover:text-ink">Marketplace</Link>
        <ChevronRight size={14} />
        <span className="text-ink">Compare</span>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl leading-snug">Compare Fabrics</h1>
          <p className="mt-1 text-sm text-muted">Compare up to 3 fabrics side-by-side to find the perfect match for your business.</p>
        </div>
        {items.length > 0 && (
          <div className="flex shrink-0 gap-2.5">
            <button
              onClick={clearCompare}
              className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink"
            >
              Clear All
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink">
              <Share2 size={15} /> Share Comparison
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white py-24 text-center">
          <FabricSwatch
            gradient="linear-gradient(120deg, #f0e2c8, #dcb98c 60%, #b98a5d 100%)"
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full opacity-30"
          >
            <GitCompare size={22} className="relative z-10 text-ink/70" />
          </FabricSwatch>
          <div className="mb-2 text-lg font-medium">No fabrics to compare yet</div>
          <p className="mb-5 text-sm text-muted">Add fabrics from the Marketplace to compare them side-by-side.</p>
          <Link href="/marketplace" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <>
          {/* Flipkart-style comparison grid: one scrollable table, sticky product-header row + sticky spec column */}
          <div className="mb-8 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full border-collapse text-sm" style={{ minWidth: `${180 + colCount * 220}px` }}>
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 w-[180px] bg-white px-4 py-4 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-muted">
                    Comparing {items.length} {items.length === 1 ? "fabric" : "fabrics"}
                  </th>
                  {items.map((p) => (
                    <th key={p.id} className="w-[220px] border-l border-line bg-white p-0 align-top">
                      <div className="relative overflow-hidden p-4">
                        <Link href={`/marketplace/${p.id}`} className="block">
                          <FabricSwatch image={categoryPhoto(p.category)} tint={p.colors[0]} className="h-64 w-full p-3 rounded-xl">
                            <div className="absolute inset-x-0 bottom-0 p-4 text-ink">
                              <div className="mb-0.5 line-clamp-2 text-sm font-semibold leading-snug">{p.name}</div>
                              <div className="mb-2 text-xs text-ink/70">{p.supplier}</div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-base font-semibold">{formatINR(p.pricePerMeter)}</span>
                                <span className="text-xs text-ink/70">/m</span>
                              </div>
                            </div>
                          </FabricSwatch>
                        </Link>
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 hover:bg-white"
                          aria-label={`Remove ${p.name}`}
                        >
                          <X size={14} />
                        </button>
                        <div className="p-3">
                          <Link
                            href={`/marketplace/${p.id}`}
                            className="block rounded-xl border border-terracotta-dark py-2 text-center text-xs font-semibold text-terracotta-dark hover:bg-terracotta/10"
                          >
                            View Product
                          </Link>
                        </div>
                      </div>
                    </th>
                  ))}
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <th key={`empty-${i}`} className="w-[220px] border-l border-line bg-white p-3 align-top">
                      <Link
                        href="/marketplace"
                        className="group flex h-[19.5rem] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line text-center transition hover:border-terracotta-dark"
                      >
                        <FabricSwatch
                          gradient="linear-gradient(120deg, #f0e2c8, #dcb98c 60%, #b98a5d 100%)"
                          className="flex h-10 w-10 items-center justify-center rounded-full opacity-30 transition group-hover:opacity-45"
                        >
                          <Plus size={16} className="relative z-10 text-ink/70" />
                        </FabricSwatch>
                        <div className="text-xs font-semibold">Add Fabric</div>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specRows.map((row, i) => {
                  const values = items.map((p) => row.value(p));
                  const differs = items.length > 1 && new Set(values).size > 1;
                  return (
                    <tr key={row.label} className={cn("border-t border-line", i % 2 === 1 && "bg-cream/40")}>
                      <td className="sticky left-0 z-10 w-[180px] bg-inherit px-4 py-3 align-top font-medium text-terracotta-dark">
                        {row.label}
                      </td>
                      {items.map((p) => (
                        <td
                          key={p.id}
                          className={cn(
                            "w-[220px] border-l border-line px-4 py-3 align-top",
                            differs && "bg-terracotta/5 font-medium"
                          )}
                        >
                          {row.render(p)}
                        </td>
                      ))}
                      {Array.from({ length: emptySlots }).map((_, e) => (
                        <td key={`empty-${e}`} className="w-[220px] border-l border-line px-4 py-3 text-muted">—</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* AI Comparison Insights */}
          {items.length > 1 && (
            <div className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-5">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta/15 text-terracotta-dark">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold">AI Comparison Insights</div>
                  <div className="text-xs text-muted">Our AI has analyzed these fabrics to help you decide better.</div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {insights.map((ins) => (
                  <div key={ins.key} className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-terracotta-dark shadow-sm">
                      <ins.icon size={15} />
                    </div>
                    <div>
                      <div className="mb-0.5 text-sm font-semibold">{ins.title}</div>
                      <p className="text-xs leading-relaxed text-muted">{ins.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}