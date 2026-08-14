"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  MoreHorizontal,
  Grid3x3,
  List,
  FileText,
  Share2,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getProduct, categories, alsoLikeProducts, categoryPhoto } from "@/lib/mockData";
import { formatINR, cn } from "@/lib/utils";
import { AccountLayout } from "@/components/AccountLayout";
import { FabricSwatch } from "@/components/FabricSwatch";

function stockBadge(stock: number) {
  if (stock <= 0) return { label: "Out of Stock", cls: "bg-red-100 text-red-700" };
  if (stock < 2000) return { label: `Low Stock`, cls: "bg-amber-100 text-amber-800" };
  return { label: "In Stock", cls: "bg-emerald-100 text-emerald-800" };
}

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useAppStore();
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("Recently Added");
  const [view, setView] = useState<"grid" | "list">("grid");

  const items = useMemo(() => {
    let list = wishlist.map((id) => getProduct(id)).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];
    if (categoryFilter !== "All Categories") list = list.filter((p) => p.category === categoryFilter);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.pricePerMeter - b.pricePerMeter);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.pricePerMeter - a.pricePerMeter);
    return list;
  }, [wishlist, categoryFilter, inStockOnly, sort]);

  const inStock = items.filter((p) => p.stock >= 2000).length;
  const lowStock = items.filter((p) => p.stock > 0 && p.stock < 2000).length;
  const outOfStock = items.filter((p) => p.stock <= 0).length;
  const totalValue = items.reduce((sum, p) => sum + p.pricePerMeter * p.moq, 0);

  const suppliers = Array.from(new Set(items.map((p) => p.supplier)));

  return (
    <AccountLayout requireRole="buyer">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Heart size={22} className="fill-terracotta-dark text-terracotta-dark" />
            <h1 className="font-serif text-2xl sm:text-3xl">My Wishlist</h1>
          </div>
          <p className="mb-5 text-sm text-muted">You have {wishlist.length} items in your wishlist</p>

          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm"
            >
              <option>All Categories</option>
              {categories.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
            <select className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm">
              <option>All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm">
              <option>All Colors</option>
            </select>
            <label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded accent-[#1C1712]"
              />
              In Stock Only
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm"
            >
              <option>Recently Added</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
            <div className="ml-auto flex rounded-xl border border-line bg-white p-1">
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

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white py-16 text-center">
              <div className="mb-1 font-medium">Your wishlist is empty</div>
              <p className="mb-4 text-sm text-muted">Browse the marketplace and tap the heart icon to save fabrics.</p>
              <Link href="/marketplace" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
                Explore Marketplace
              </Link>
            </div>
          ) : (
            <div className={cn("grid gap-5", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1")}>
              {items.map((p) => {
                const badge = stockBadge(p.stock);
                return (
                  <div key={p.id} className="overflow-hidden rounded-2xl border border-line bg-white">
                    <div className="relative">
                      <Link href={`/marketplace/${p.id}`}>
                        <FabricSwatch image={categoryPhoto(p.category)} tint={p.colors[0]} className="aspect-square w-full" />
                      </Link>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm"
                        aria-label="Remove from wishlist"
                      >
                        <Heart size={16} className="fill-terracotta-dark text-terracotta-dark" />
                      </button>
                    </div>
                    <div className="p-3.5">
                      <Link href={`/marketplace/${p.id}`} className="mb-0.5 block truncate text-sm font-semibold hover:text-terracotta-dark">
                        {p.name}
                      </Link>
                      <div className="mb-1.5 text-xs text-muted">
                        {p.gsm} GSM · {p.weave}
                      </div>
                      <div className="mb-1.5 flex items-center gap-1.5 text-xs">
                        <span className="h-3 w-3 rounded-full border border-black/10" style={{ background: p.colors[0] }} />
                        {p.category}
                      </div>
                      <div className="mb-1.5 flex items-center gap-1 text-xs text-muted">
                        {p.supplier}
                      </div>
                      <div className="mb-2 text-sm font-semibold">
                        {formatINR(p.pricePerMeter * p.moq)}{" "}
                        <span className="text-xs font-normal text-muted">/ {p.moq} meter</span>
                      </div>
                      <span className={cn("mb-3 inline-block rounded-full px-2 py-0.5 text-[0.65rem] font-medium", badge.cls)}>
                        {badge.label}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(p.id, p.moq)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line"
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={15} />
                        </button>
                        <button className="flex-1 rounded-lg bg-cream-2 py-2 text-xs font-semibold text-ink">
                          Add to Quote
                        </button>
                        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line" aria-label="More">
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-full shrink-0 space-y-4 lg:w-72">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 font-semibold">Wishlist Summary</div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted">Total Items</span><span className="font-medium">{wishlist.length}</span></div>
              <div className="flex justify-between"><span className="text-muted">In Stock</span><span className="font-medium text-emerald-700">{inStock}</span></div>
              <div className="flex justify-between"><span className="text-muted">Low Stock</span><span className="font-medium text-amber-700">{lowStock}</span></div>
              <div className="flex justify-between"><span className="text-muted">Out of Stock</span><span className="font-medium text-red-600">{outOfStock}</span></div>
            </div>
            <div className="my-3 h-px bg-line" />
            <div className="mb-4 flex justify-between font-semibold">
              <span>Total Value (Est.)</span>
              <span>{formatINR(totalValue)}</span>
            </div>
            <button className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-2.5 text-sm font-semibold text-white">
              <FileText size={15} /> Add All to Quote
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm font-medium">
              <Share2 size={15} /> Share Wishlist
            </button>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">You May Also Like</div>
              <Link href="/marketplace" className="text-xs font-medium text-terracotta-dark">View All</Link>
            </div>
            <div className="space-y-3">
              {alsoLikeProducts.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <FabricSwatch gradient={p.image} className="h-12 w-12 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">{p.name}</div>
                    <div className="text-[0.65rem] text-muted">{p.spec}</div>
                    <div className="text-xs font-semibold">{formatINR(p.price)} <span className="font-normal text-muted">/ {p.unit}</span></div>
                  </div>
                  <button className="text-muted hover:text-terracotta-dark" aria-label="Add to wishlist">
                    <Heart size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}