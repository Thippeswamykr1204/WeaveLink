"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Search,
  MapPin,
  ChevronDown,
  Users,
  ShieldCheck,
  Globe2,
  Star,
  Clock,
  PlayCircle,
  UserPlus,
  Lock,
  Zap,
} from "lucide-react";
import { suppliers, categories, formatResponseTime, supplierProducts, categoryPhoto } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { FabricSwatch } from "@/components/FabricSwatch";

const PAGE_SIZE = 6;

function initials(name: string) {
  const words = name.replace(/Pvt\.?|Ltd\.?|Co\./gi, "").trim().split(/\s+/).filter(Boolean);
  return (words[0]?.[0] || "") + (words[1]?.[0] || "");
}

export default function SuppliersPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [businessType, setBusinessType] = useState("All Types");
  const [category, setCategory] = useState("All Categories");
  const [fabricType, setFabricType] = useState("All Fabric Types");
  const [minRating, setMinRating] = useState("All Ratings");
  const [page, setPage] = useState(1);

  const locations = useMemo(
    () => Array.from(new Set(suppliers.map((s) => `${s.city}, ${s.state}`))).sort(),
    []
  );
  const businessTypes = useMemo(() => Array.from(new Set(suppliers.map((s) => s.businessType))).sort(), []);
  const supplierCategories = useMemo(
    () => Array.from(new Set(suppliers.flatMap((s) => s.categories))).sort(),
    []
  );
  const fabricTypeOptions = useMemo(
    () => Array.from(new Set(suppliers.flatMap((s) => s.fabricTypes))).sort(),
    []
  );

  const filtered = useMemo(() => {
    return suppliers.filter((s) => {
      if (query) {
        const haystack = `${s.name} ${s.businessType} ${s.categories.join(" ")} ${s.description}`.toLowerCase();
        if (!haystack.includes(query.toLowerCase())) return false;
      }
      if (location !== "All Locations" && `${s.city}, ${s.state}` !== location) return false;
      if (businessType !== "All Types" && s.businessType !== businessType) return false;
      if (category !== "All Categories" && !s.categories.includes(category)) return false;
      if (fabricType !== "All Fabric Types" && !s.fabricTypes.includes(fabricType)) return false;
      if (minRating !== "All Ratings" && s.rating < Number(minRating)) return false;
      return true;
    });
  }, [query, location, businessType, category, fabricType, minRating]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  // Stats — computed from the real seeded array, not hardcoded.
  const totalSuppliers = suppliers.length;
  const verifiedCount = suppliers.filter((s) => s.verified).length;
  const countryCount = new Set(suppliers.map((s) => s.country)).size;
  const avgRating = (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1);
  const avgResponseHours = Math.round(
    suppliers.reduce((sum, s) => sum + s.responseHours, 0) / suppliers.length
  );

  const topCategories = useMemo(() => [...categories].sort((a, b) => b.count - a.count).slice(0, 5), []);
  const recentlyJoined = useMemo(
    () => [...suppliers].sort((a, b) => b.joinedTimestamp - a.joinedTimestamp).slice(0, 3),
    []
  );

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8">
      <div className="mb-3 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <ChevronRight size={14} />
        <span className="text-ink">Suppliers</span>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl leading-snug">Suppliers Directory</h1>
          <p className="mt-1 text-sm text-muted">Discover and connect with verified textile suppliers from around the world.</p>
        </div>
        <div className="flex shrink-0 gap-2.5">
          <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink">
            <PlayCircle size={15} /> How It Works
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink/85">
            <UserPlus size={15} /> Invite Supplier
          </button>
        </div>
      </div>

      {/* Search + location */}
      <div className="mb-5 flex flex-col gap-2.5 rounded-2xl border border-line bg-white p-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl bg-cream px-3.5 py-2.5">
          <Search size={17} className="text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            placeholder="Search suppliers by name, business type, product..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
        <div className="relative">
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              resetPage();
            }}
            className="w-full appearance-none rounded-xl border border-line bg-white py-2.5 pl-9 pr-9 text-sm sm:w-56"
          >
            <option>All Locations</option>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { icon: Users, label: "Total Suppliers", value: totalSuppliers.toLocaleString() },
          { icon: ShieldCheck, label: "Verified Suppliers", value: verifiedCount.toLocaleString() },
          { icon: Globe2, label: "Countries", value: countryCount.toLocaleString() },
          { icon: Star, label: "Avg. Rating", value: `${avgRating} / 5` },
          { icon: Clock, label: "Response Time", value: formatResponseTime(avgResponseHours) },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta-dark">
              <s.icon size={17} />
            </div>
            <div>
              <div className="text-lg font-semibold leading-none">{s.value}</div>
              <div className="mt-1 text-xs text-muted">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="mb-6 flex flex-wrap gap-2.5">
        {[
          { value: businessType, setter: setBusinessType, options: ["All Types", ...businessTypes] },
          { value: category, setter: setCategory, options: ["All Categories", ...supplierCategories] },
          { value: fabricType, setter: setFabricType, options: ["All Fabric Types", ...fabricTypeOptions] },
        ].map((f, i) => (
          <div key={i} className="relative">
            <select
              value={f.value}
              onChange={(e) => {
                f.setter(e.target.value);
                resetPage();
              }}
              className="appearance-none rounded-xl border border-line bg-white py-2.5 pl-3.5 pr-9 text-sm"
            >
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
        ))}
        <div className="relative">
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              resetPage();
            }}
            className="appearance-none rounded-xl border border-line bg-white py-2.5 pl-3.5 pr-9 text-sm"
          >
            <option>All Locations</option>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>
        <div className="relative">
          <select
            value={minRating}
            onChange={(e) => {
              setMinRating(e.target.value);
              resetPage();
            }}
            className="appearance-none rounded-xl border border-line bg-white py-2.5 pl-3.5 pr-9 text-sm"
          >
            <option>All Ratings</option>
            {["4.8", "4.5", "4.0"].map((r) => (
              <option key={r} value={r}>{r}+ Rating</option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {paged.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white py-20 text-center">
              <div className="mb-2 text-lg font-medium">No suppliers match your filters</div>
              <p className="mb-4 text-sm text-muted">Try adjusting your search or clearing filters.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setLocation("All Locations");
                  setBusinessType("All Types");
                  setCategory("All Categories");
                  setFabricType("All Fabric Types");
                  setMinRating("All Ratings");
                  resetPage();
                }}
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {paged.map((s) => {
                const swatchProducts = supplierProducts(s.name).slice(0, 3);
                return (
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
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {s.categories.slice(0, 3).map((c) => (
                      <span key={c} className="rounded-full bg-cream px-2.5 py-1 text-[0.65rem] font-medium text-ink/75">
                        {c}
                      </span>
                    ))}
                  </div>
                  {swatchProducts.length > 0 && (
                    <div className="mb-3 flex items-center gap-1.5">
                      {swatchProducts.map((p) => (
                        <FabricSwatch
                          key={p.id}
                          image={categoryPhoto(p.category)}
                          tint={p.colors[0]}
                          className="h-6 w-6 rounded-md ring-1 ring-black/5"
                        />
                      ))}
                      <span className="text-[0.65rem] text-muted">
                        {swatchProducts.length} product{swatchProducts.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  )}
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
                );
              })}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="text-sm text-muted">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} suppliers
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
        </div>

        {/* Right sidebar */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 text-sm font-semibold">Why choose WeaveLink Suppliers?</div>
            <div className="space-y-4">
              {[
                { icon: ShieldCheck, title: "Verified & Trusted", desc: "All suppliers are verified for quality and authenticity." },
                { icon: Globe2, title: "Global Reach", desc: `Connect with suppliers from ${countryCount}+ countries.` },
                { icon: Zap, title: "Quick Response", desc: `Suppliers average response time is under ${Math.ceil(avgResponseHours / 24) * 24} hrs.` },
                { icon: Lock, title: "Secure Transactions", desc: "Trade with confidence through our secure platform." },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700/10 text-emerald-700">
                    <f.icon size={15} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{f.title}</div>
                    <div className="mt-0.5 text-xs text-muted">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Top Categories</span>
              <Link href="/marketplace" className="text-xs font-medium text-terracotta-dark">View all categories</Link>
            </div>
            <div className="space-y-2.5">
              {topCategories.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.swatch }} />
                    {c.name} Fabrics
                  </span>
                  <span className="text-xs text-muted">{c.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Recently Joined Suppliers</span>
              <Link href="/suppliers" className="text-xs font-medium text-terracotta-dark">View all</Link>
            </div>
            <div className="space-y-3">
              {recentlyJoined.map((s) => (
                <Link key={s.id} href={`/suppliers/${s.id}`} className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta/20 text-xs font-semibold text-terracotta-dark">
                    {initials(s.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">{s.name}</div>
                    <div className="text-[0.68rem] text-muted">{s.city}, {s.country}</div>
                  </div>
                  <span className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-terracotta-dark">
                    <Star size={11} className="fill-terracotta-dark" /> {s.rating}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}