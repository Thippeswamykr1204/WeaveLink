"use client";

import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  Search,
  MapPin,
  ShieldCheck,
  Star,
  X,
  Clock3,
  Sparkles,
  FileText,
} from "lucide-react";
import { products, suppliers, fabricTypes, formatResponseTime } from "@/lib/mockData";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;

function initials(name: string) {
  const words = name.replace(/Pvt\.?|Ltd\.?|Co\./gi, "").trim().split(/\s+/).filter(Boolean);
  return (words[0]?.[0] || "") + (words[1]?.[0] || "");
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"products" | "suppliers">("products");
  const [page, setPage] = useState(1);

  // ── Wired filters — these actually narrow the result set below ───────────
  const [selectedFabricTypes, setSelectedFabricTypes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  // ── Visual-only filters — rendered for layout parity with the reference,
  // but intentionally NOT wired into the filtering logic. Flagged here and
  // again next to each control in the JSX below.
  const [gsmMax, setGsmMax] = useState(500);
  const [priceMax, setPriceMax] = useState(1000);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const [recentSearches, setRecentSearches] = useState<string[]>(
    initialQuery ? [initialQuery] : []
  );

  const materialOptions = useMemo(() => Array.from(new Set(products.map((p) => p.material))).sort(), []);
  const locationOptions = useMemo(
    () => Array.from(new Set(suppliers.map((s) => `${s.city}, ${s.state}`))).sort(),
    []
  );

  const toggle = (list: string[], setList: (v: string[]) => void, val: string) => {
    setList(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);
    setPage(1);
  };

  // Products: name/category/material match against query, plus wired Fabric Type + Material filters.
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (query) {
        const haystack = `${p.name} ${p.category} ${p.material}`.toLowerCase();
        if (!haystack.includes(query.toLowerCase())) return false;
      }
      if (selectedFabricTypes.length && !selectedFabricTypes.includes(p.fabricType)) return false;
      if (selectedMaterials.length && !selectedMaterials.includes(p.material)) return false;
      return true;
    });
  }, [query, selectedFabricTypes, selectedMaterials]);

  // Suppliers: name/categories/description match against query, plus wired Fabric Type filter
  // (suppliers don't have a `material` field, so the Material filter only applies to Products).
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      if (query) {
        const haystack = `${s.name} ${s.categories.join(" ")} ${s.description}`.toLowerCase();
        if (!haystack.includes(query.toLowerCase())) return false;
      }
      if (selectedFabricTypes.length && !selectedFabricTypes.some((t) => s.fabricTypes.includes(t))) return false;
      return true;
    });
  }, [query, selectedFabricTypes]);

  const activeResults = activeTab === "products" ? filteredProducts : filteredSuppliers;
  const totalPages = Math.max(1, Math.ceil(activeResults.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pagedSuppliers = filteredSuppliers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeChips: { key: string; label: string; onRemove: () => void }[] = [
    ...selectedFabricTypes.map((t) => ({
      key: `fabric-${t}`,
      label: t,
      onRemove: () => toggle(selectedFabricTypes, setSelectedFabricTypes, t),
    })),
    ...selectedMaterials.map((m) => ({
      key: `material-${m}`,
      label: m,
      onRemove: () => toggle(selectedMaterials, setSelectedMaterials, m),
    })),
  ];

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev].slice(0, 5));
    }
    setPage(1);
  };

  // Search Summary — computed from the real, currently-filtered results (not hardcoded).
  const avgProductPrice = filteredProducts.length
    ? Math.round(filteredProducts.reduce((sum, p) => sum + p.pricePerMeter, 0) / filteredProducts.length)
    : 0;
  const verifiedSupplierCount = filteredSuppliers.filter((s) => s.verified).length;
  const avgSupplierRating = filteredSuppliers.length
    ? (filteredSuppliers.reduce((sum, s) => sum + s.rating, 0) / filteredSuppliers.length).toFixed(1)
    : "—";
  const distinctCategoryCount = new Set(filteredProducts.map((p) => p.category)).size;

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8">
      <div className="mb-3 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <ChevronRight size={14} />
        <span className="text-ink">Search</span>
      </div>

      {/* Search bar — pre-filled from ?q=, resubmitting updates results + recent searches */}
      <form onSubmit={submitSearch} className="mb-5 flex flex-col gap-2.5 rounded-2xl border border-line bg-white p-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl bg-cream px-3.5 py-2.5">
          <Search size={17} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fabrics, suppliers, categories..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
        <button type="submit" className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white">
          Search
        </button>
      </form>

      <h1 className="mb-1 font-serif text-3xl leading-snug">
        Search results for &lsquo;{query || "all fabrics"}&rsquo;
      </h1>
      <p className="mb-6 mt-1 text-sm text-muted">
        {activeResults.length.toLocaleString()} {activeTab === "products" ? "product" : "supplier"} result{activeResults.length === 1 ? "" : "s"} found
      </p>

      {activeChips.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <span key={chip.key} className="flex items-center gap-1.5 rounded-full bg-terracotta/12 px-3 py-1.5 text-xs font-medium text-terracotta-dark">
              {chip.label}
              <button onClick={chip.onRemove} aria-label={`Remove ${chip.label} filter`}>
                <X size={12} />
              </button>
            </span>
          ))}
          <button
            onClick={() => {
              setSelectedFabricTypes([]);
              setSelectedMaterials([]);
              setPage(1);
            }}
            className="text-xs font-medium text-terracotta-dark"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr_300px]">
        {/* Left filter sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6 rounded-2xl border border-line bg-white p-5">
            <div>
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

            <div className="border-t border-line pt-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Material</div>
              <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                {materialOptions.map((m) => (
                  <label key={m} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(m)}
                      onChange={() => toggle(selectedMaterials, setSelectedMaterials, m)}
                      className="h-3.5 w-3.5 rounded accent-[#1C1712]"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            {/* Visual only from here down — not wired into filtering, flagged explicitly. */}
            <div className="border-t border-line pt-5">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                GSM Range <span className="rounded bg-cream px-1.5 py-0.5 text-[0.6rem] font-normal normal-case text-muted">visual only</span>
              </div>
              <input
                type="range"
                min={30}
                max={500}
                step={10}
                value={gsmMax}
                onChange={(e) => setGsmMax(Number(e.target.value))}
                className="w-full accent-[#A85A2E]"
              />
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>30 GSM</span>
                <span>{gsmMax} GSM+</span>
              </div>
            </div>

            <div className="border-t border-line pt-5">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                Price Range <span className="rounded bg-cream px-1.5 py-0.5 text-[0.6rem] font-normal normal-case text-muted">visual only</span>
              </div>
              <input
                type="range"
                min={50}
                max={1000}
                step={25}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#A85A2E]"
              />
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>₹50</span>
                <span>₹{priceMax.toLocaleString()}+</span>
              </div>
            </div>

            <div className="border-t border-line pt-5">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                Supplier Location <span className="rounded bg-cream px-1.5 py-0.5 text-[0.6rem] font-normal normal-case text-muted">visual only</span>
              </div>
              <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                {locationOptions.map((l) => (
                  <label key={l} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(l)}
                      onChange={() => setSelectedLocations((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]))}
                      className="h-3.5 w-3.5 rounded accent-[#1C1712]"
                    />
                    {l}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main results */}
        <div>
          {/* Tabs */}
          <div className="mb-5 flex gap-2 border-b border-line">
            <button
              onClick={() => {
                setActiveTab("products");
                setPage(1);
              }}
              className={cn(
                "px-4 py-2.5 text-sm font-semibold",
                activeTab === "products" ? "border-b-2 border-ink text-ink" : "text-muted"
              )}
            >
              Products ({filteredProducts.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("suppliers");
                setPage(1);
              }}
              className={cn(
                "px-4 py-2.5 text-sm font-semibold",
                activeTab === "suppliers" ? "border-b-2 border-ink text-ink" : "text-muted"
              )}
            >
              Suppliers ({filteredSuppliers.length})
            </button>
          </div>

          {activeResults.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white py-20 text-center">
              <div className="mb-2 text-lg font-medium">No {activeTab} match your search</div>
              <p className="mb-4 text-sm text-muted">Try a different term or clear your filters.</p>
              <button
                onClick={() => {
                  setSelectedFabricTypes([]);
                  setSelectedMaterials([]);
                  setPage(1);
                }}
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
              >
                Clear all filters
              </button>
            </div>
          ) : activeTab === "products" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {pagedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {pagedSuppliers.map((s) => (
                <div key={s.id} className="flex flex-col rounded-2xl border border-line bg-white p-4">
                  <div className="mb-3 flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta/20 text-sm font-semibold text-terracotta-dark">
                      {initials(s.name)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="truncate text-sm font-semibold">{s.name}</div>
                        {s.verified && <ShieldCheck size={13} className="shrink-0 text-emerald-700" />}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-ink/70">
                        <Star size={12} className="fill-terracotta-dark text-terracotta-dark" /> {s.rating} ({s.reviewCount})
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                        <MapPin size={12} /> {s.city}, {s.state}
                      </div>
                    </div>
                  </div>
                  <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted">{s.description}</p>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {s.categories.slice(0, 3).map((c) => (
                      <span key={c} className="rounded-full bg-cream px-2.5 py-1 text-[0.65rem] font-medium text-ink/75">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="mb-3 flex items-center justify-between text-[0.7rem] text-muted">
                    <span>MOQ from {s.moq} m</span>
                    <span>Response {formatResponseTime(s.responseHours)}</span>
                  </div>
                  <Link
                    href={`/suppliers/${s.id}`}
                    className="mt-auto block w-full rounded-xl border border-terracotta-dark py-2 text-center text-sm font-semibold text-terracotta-dark hover:bg-terracotta/10"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          )}

          {activeResults.length > 0 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="text-sm text-muted">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, activeResults.length)} of {activeResults.length} {activeTab}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-line px-2.5 py-1.5 text-sm text-ink/70 disabled:opacity-40"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-sm font-medium",
                      currentPage === i + 1 ? "bg-ink text-white" : "text-ink/70 hover:bg-cream"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-line px-2.5 py-1.5 text-sm text-ink/70 disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            </div>
          )}

          {/* "Did you mean" — static, UI-only, does not run any real spelling logic */}
          {query && activeResults.length === 0 && (
            <div className="mt-6 rounded-2xl border border-line bg-white p-4 text-sm">
              <span className="text-muted">Did you mean:</span>{" "}
              <button className="font-medium text-terracotta-dark">Cotton Poplin</button>,{" "}
              <button className="font-medium text-terracotta-dark">Linen Blend</button>
            </div>
          )}

          {/* "Post Requirement" — static, UI-only, does not submit anything */}
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-white p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
                <FileText size={17} />
              </div>
              <div>
                <div className="text-sm font-semibold">Can&rsquo;t find what you&rsquo;re looking for?</div>
                <div className="text-xs text-muted">Post a sourcing requirement and let suppliers reach out to you. (UI only)</div>
              </div>
            </div>
            <button className="shrink-0 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white">
              Post Requirement
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 text-sm font-semibold">Search Summary</div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Product results</span>
                <span className="font-medium">{filteredProducts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Supplier results</span>
                <span className="font-medium">{filteredSuppliers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Categories covered</span>
                <span className="font-medium">{distinctCategoryCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Avg. product price</span>
                <span className="font-medium">{filteredProducts.length ? `₹${avgProductPrice}/m` : "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Verified suppliers</span>
                <span className="font-medium">{verifiedSupplierCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Avg. supplier rating</span>
                <span className="font-medium">{avgSupplierRating}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
              <Clock3 size={14} className="text-terracotta-dark" /> Recent Searches
            </div>
            {recentSearches.length === 0 ? (
              <p className="text-xs text-muted">Your recent searches will show up here this session.</p>
            ) : (
              <div className="space-y-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      setPage(1);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-ink/75 hover:bg-cream"
                  >
                    <Search size={12} className="text-muted" /> {term}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <Sparkles size={14} className="text-terracotta-dark" /> Try AI Search
            </div>
            <p className="text-xs text-muted">Describe what you need in plain language and let AI find the right match.</p>
            <Link href="/ai-assistant" className="mt-3 block rounded-xl border border-terracotta/40 bg-terracotta/10 py-2 text-center text-xs font-semibold text-terracotta-dark">
              Open AI Assistant
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-muted">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}