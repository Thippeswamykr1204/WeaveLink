"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Grid3x3, List, ChevronDown, ArrowRight, ShieldCheck, Globe2, Lock, Headphones } from "lucide-react";
import { products, categories, fabricTypes, colorSwatches } from "@/lib/mockData";
import { ProductCard } from "@/components/ProductCard";
import { FabricSwatch } from "@/components/FabricSwatch";
import { cn } from "@/lib/utils";

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFabricTypes, setSelectedFabricTypes] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceMax, setPriceMax] = useState(5000);
  const [sort, setSort] = useState("Popular");
  const [view, setView] = useState<"grid" | "list">("grid");

  const toggle = (list: string[], setList: (v: string[]) => void, val: string) => {
    setList(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (query && !`${p.name} ${p.category} ${p.supplier}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (selectedFabricTypes.length && !selectedFabricTypes.includes(p.fabricType)) return false;
      if (p.pricePerMeter > priceMax) return false;
      return true;
    });
    if (sort === "Price: Low to High") result = [...result].sort((a, b) => a.pricePerMeter - b.pricePerMeter);
    if (sort === "Price: High to Low") result = [...result].sort((a, b) => b.pricePerMeter - a.pricePerMeter);
    if (sort === "Top Rated") result = [...result].sort((a, b) => b.supplierRating - a.supplierRating);
    return result;
  }, [query, selectedCategories, selectedFabricTypes, priceMax, sort]);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedFabricTypes([]);
    setSelectedColor(null);
    setPriceMax(5000);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr_320px]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6 rounded-2xl border border-line bg-white p-5">
            <div>
              <div className="mb-3 font-serif text-lg">Browse Fabrics</div>
              <div className="space-y-1">
                <button
                  onClick={clearAll}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm",
                    !selectedCategories.length ? "bg-terracotta/12 font-medium text-terracotta-dark" : "text-ink/75 hover:bg-cream"
                  )}
                >
                  All Fabrics <span className="text-xs text-muted">{products.length.toLocaleString()}</span>
                </button>
                {[
                    { label: "New Arrivals", count: 342 },
                    { label: "Best Sellers", count: 1234 },
                    { label: "Sustainable", count: 568 },
                    { label: "Offers", count: 219 },
                  ].map((l) => (
                    <button key={l.label} className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-ink/75 hover:bg-cream">
                      {l.label} <span className="text-xs text-muted">{l.count}</span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="border-t border-line pt-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold">Filters</span>
                <button onClick={clearAll} className="text-xs font-medium text-terracotta-dark">Clear all</button>
              </div>

              <div className="mb-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Category</div>
                <div className="space-y-2">
                  {categories.map((c) => (
                    <label key={c.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(c.name)}
                          onChange={() => toggle(selectedCategories, setSelectedCategories, c.name)}
                          className="h-3.5 w-3.5 rounded accent-[#1C1712]"
                        />
                        {c.name}
                      </span>
                      <span className="text-xs text-muted">{c.count.toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Fabric Type</div>
                <div className="flex flex-wrap gap-1.5">
                  {fabricTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggle(selectedFabricTypes, setSelectedFabricTypes, t)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium",
                        selectedFabricTypes.includes(t) ? "border-ink bg-ink text-white" : "border-line text-ink/70"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Color</div>
                <div className="flex flex-wrap gap-2">
                  {colorSwatches.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(selectedColor === c ? null : c)}
                      className={cn(
                        "h-6 w-6 rounded-full border-2",
                        selectedColor === c ? "border-terracotta-dark" : "border-white ring-1 ring-line"
                      )}
                      style={{ background: c }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-1">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted">
                  <span>Price Range (per meter)</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#A85A2E]"
                />
                <div className="mt-2 flex justify-between text-xs text-muted">
                  <span>₹50</span>
                  <span>₹{priceMax.toLocaleString()}+</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div>
          <div className="mb-5 flex flex-col gap-2.5 rounded-2xl border border-line bg-white p-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2.5 rounded-xl bg-cream px-3.5 py-2.5">
              <Search size={17} className="text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fabrics, categories, suppliers..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-2.5 text-sm font-semibold text-terracotta-dark">
              <Sparkles size={15} /> Try AI Search
            </button>
          </div>

          <div className="relative mb-6 overflow-hidden rounded-2xl">
            <FabricSwatch
              image="/images/fabric-premium-hero.png"
              className="flex min-h-[220px] items-center px-8 py-8"
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(250,244,232,0.97) 0%, rgba(250,244,232,0.88) 32%, rgba(250,244,232,0.35) 58%, rgba(250,244,232,0.05) 78%)",
                }}
              />
              <div className="relative z-10 max-w-md">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">
                  Premium Quality. Global Reach.
                </span>
                <h2 className="mt-2 font-serif text-3xl leading-tight">
                  Source the finest fabrics
                  <br /> <span className="text-terracotta-dark">for your business</span>
                </h2>
                <p className="mt-2 text-sm text-ink/70">
                  Connect with verified suppliers and discover 10,000+ premium fabrics across the globe.
                </p>
                <button className="mt-4 flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
                  Explore Categories <ArrowRight size={15} />
                </button>
              </div>
            </FabricSwatch>
          </div>

          <div className="mb-6 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => toggle(selectedCategories, setSelectedCategories, c.name)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl border px-4 py-2.5",
                  selectedCategories.includes(c.name) ? "border-ink bg-ink text-white" : "border-line bg-white"
                )}
              >
                <span className="h-6 w-6 rounded-full" style={{ background: c.swatch }} />
                <span className="text-left">
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className={cn("text-[0.65rem]", selectedCategories.includes(c.name) ? "text-white/70" : "text-muted")}>
                    {c.count.toLocaleString()}+
                  </div>
                </span>
              </button>
            ))}
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted">{filtered.length.toLocaleString()} results found</div>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none rounded-xl border border-line bg-white py-2 pl-3.5 pr-9 text-sm"
                >
                  {["Popular", "Price: Low to High", "Price: High to Low", "Top Rated"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              </div>
              <div className="flex rounded-xl border border-line bg-white p-1">
                <button
                  onClick={() => setView("grid")}
                  className={cn("rounded-lg p-1.5", view === "grid" ? "bg-ink text-white" : "text-ink/60")}
                  aria-label="Grid view"
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={cn("rounded-lg p-1.5", view === "list" ? "bg-ink text-white" : "text-ink/60")}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-dashed border-line bg-white py-20 text-center"
            >
              <div className="mb-2 text-lg font-medium">No fabrics match your filters</div>
              <p className="mb-4 text-sm text-muted">Try adjusting your search or clearing filters.</p>
              <button onClick={clearAll} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <div className={cn("grid gap-5", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(i, 6) * 0.03 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* AI Assistant right dock */}
        <MarketplaceAiPanel />
      </div>

      <div className="mt-14 grid gap-6 rounded-2xl border border-line bg-white p-6 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { icon: ShieldCheck, title: "Verified Suppliers", desc: "2,000+ trusted suppliers" },
          { icon: Globe2, title: "Global Shipping", desc: "Delivering to 50+ countries" },
          { icon: Lock, title: "Secure Transactions", desc: "Your business is protected" },
          { icon: ShieldCheck, title: "Quality Assurance", desc: "100% quality guaranteed" },
          { icon: Headphones, title: "24/7 Support", desc: "We're here to help" },
        ].map((t) => (
          <div key={t.title} className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
              <t.icon size={16} />
            </div>
            <div>
              <div className="text-sm font-semibold">{t.title}</div>
              <div className="text-xs text-muted">{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { AiPanel } from "@/components/AiPanel";
function MarketplaceAiPanel() {
  return (
    <div className="hidden xl:block">
      <div className="sticky top-24">
        <AiPanel />
      </div>
    </div>
  );
}

function MarketplaceSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr_320px]">
        <div className="hidden rounded-2xl border border-line bg-white p-5 lg:block">
          <div className="h-5 w-32 animate-pulse rounded bg-cream-2" />
          <div className="mt-5 space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-cream-2" style={{ width: `${70 - i * 4}%` }} />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-5 h-12 animate-pulse rounded-2xl bg-cream-2" />
          <div className="mb-6 h-[220px] animate-pulse rounded-2xl bg-cream-2" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="aspect-[4/3] animate-pulse bg-cream-2" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-cream-2" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-cream-2" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-cream-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden xl:block">
          <div className="h-[420px] animate-pulse rounded-2xl bg-cream-2" />
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<MarketplaceSkeleton />}>
      <MarketplaceContent />
    </Suspense>
  );
}