"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Sparkles, Heart, Scale3d, Check, Minus, Plus, ShieldCheck, FileText, Box, Boxes, Layers } from "lucide-react";
import { getProduct, similarProducts, productGalleryPhotos } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";
import { formatINR, cn } from "@/lib/utils";
import { FabricSwatch } from "@/components/FabricSwatch";
import { ProductCard } from "@/components/ProductCard";

const tabs = ["Overview", "Specifications", "Reviews", "Supplier Info", "Shipping & Returns"];

export default function ProductDetailsPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const product = getProduct(params.productId);
  const { addToCart, isWishlisted, toggleWishlist, compareList, addToCompare } = useAppStore();

  const [activeImage, setActiveImage] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [qty, setQty] = useState(product?.moq || 50);
  const [tab, setTab] = useState("Overview");

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <div className="mb-2 text-lg font-semibold">Product not found</div>
        <p className="mb-5 text-sm text-muted">This fabric may have been removed or is no longer available.</p>
        <Link href="/marketplace" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const similar = similarProducts(product.id, 4);
  // 5 distinct photos: category-representative shot first, then the other 4 for variety.
  const thumbs = productGalleryPhotos(product.category);
  const activeTint = product.colors[activeColor];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          onClick={() => router.push("/marketplace")}
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink/70 hover:text-ink"
        >
          <ArrowLeft size={15} /> Back to Marketplace
        </button>
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5">
          <Search size={16} className="text-muted" />
          <input placeholder="Search fabrics, categories, suppliers..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
        </div>
        <button className="flex shrink-0 items-center gap-2 rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-2.5 text-sm font-semibold text-terracotta-dark">
          <Sparkles size={15} /> Try AI Search
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[90px_1fr_380px]">
        {/* Thumbnails */}
        <div className="order-2 flex gap-2.5 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
          {thumbs.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2",
                activeImage === i ? "border-terracotta-dark" : "border-line"
              )}
            >
              <FabricSwatch image={img} tint={activeTint} className="h-full w-full" swirl={i === 0} />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="relative order-1 overflow-hidden rounded-3xl lg:order-2">
          <FabricSwatch image={thumbs[activeImage]} tint={activeTint} className="aspect-square w-full sm:aspect-[5/4]" />
          <div className="absolute left-4 top-4 flex gap-2">
            {product.badge && (
              <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold uppercase text-white">
                {product.badge}
              </span>
            )}
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-700">Eco Friendly</span>
          </div>
          <div className="absolute right-4 top-4 flex gap-2">
            <button
              onClick={() => addToCompare(product.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm",
                compareList.includes(product.id) ? "bg-terracotta-dark text-white" : "bg-white/90"
              )}
            >
              {compareList.includes(product.id) ? <Check size={14} /> : <Scale3d size={14} />}
              {compareList.includes(product.id) ? "Added" : "Add to Compare"}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm"
            >
              <Heart size={15} className={isWishlisted(product.id) ? "fill-terracotta-dark text-terracotta-dark" : ""} />
            </button>
          </div>
          <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium">
            <Box size={14} /> View in 3D
          </span>
        </div>

        {/* Info column */}
        <div className="order-3">
          <div className="mb-2 flex flex-wrap gap-2">
            {product.badge && (
              <span className="rounded-full bg-ink px-2.5 py-1 text-[0.68rem] font-semibold uppercase text-white">{product.badge}</span>
            )}
            <span className="rounded-full bg-emerald-700/10 px-2.5 py-1 text-[0.68rem] font-semibold text-emerald-700">Eco Friendly</span>
          </div>
          <h1 className="mb-3 font-serif text-2xl leading-snug">{product.name}</h1>
          <div className="mb-4 flex items-center gap-2 text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-terracotta/20 text-[0.6rem] font-semibold text-terracotta-dark">
              {product.supplier[0]}
            </span>
            <span className="font-medium">{product.supplier}</span>
            <span className="flex items-center gap-1 text-ink/70">★ {product.supplierRating} ({product.supplierReviews} reviews)</span>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-muted">{product.description}</p>

          <div className="mb-5 divide-y divide-line rounded-xl border border-line">
            {[
              { icon: Layers, label: "Category", value: product.category },
              { icon: Boxes, label: "Fabric Type", value: product.fabricType },
              { icon: FileText, label: "Material", value: product.material },
              { icon: FileText, label: "GSM", value: `${product.gsm} GSM` },
              { icon: FileText, label: "Width", value: product.width },
              { icon: FileText, label: "Weave", value: product.weave },
              { icon: FileText, label: "Finish", value: product.finish },
              { icon: FileText, label: "Country of Origin", value: product.origin },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <row.icon size={14} /> {row.label}
                </span>
                <span className="font-medium">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <div className="mb-2 text-sm font-semibold">Available Colors</div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setActiveColor(i)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2",
                    activeColor === i ? "border-terracotta-dark" : "border-white ring-1 ring-line"
                  )}
                  style={{ background: c }}
                  aria-label={`Color option ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature chips */}
      <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-4">
        {product.features.map((f) => (
          <div key={f} className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta-dark">
              <ShieldCheck size={16} />
            </div>
            <div>
              <div className="text-sm font-semibold">{f}</div>
              <div className="text-xs text-muted">Verified attribute</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          {/* Tabs */}
          <div className="mb-5 flex gap-6 overflow-x-auto border-b border-line scrollbar-none">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "shrink-0 whitespace-nowrap border-b-2 py-3 text-sm font-medium",
                  tab === t ? "border-terracotta-dark text-ink" : "border-transparent text-muted"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Overview" && (
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-serif text-lg">Product Description</h3>
                <p className="text-sm leading-relaxed text-muted">{product.description}</p>
              </div>
              <div>
                <h3 className="mb-2 font-serif text-lg">Specifications</h3>
                <div className="divide-y divide-line text-sm">
                  {[
                    ["Material", product.material],
                    ["GSM", `${product.gsm} GSM`],
                    ["Width", product.width],
                    ["Weave", product.weave],
                    ["Finish", product.finish],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2">
                      <span className="text-muted">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === "Specifications" && (
            <div className="divide-y divide-line text-sm">
              {[
                ["Category", product.category],
                ["Fabric Type", product.fabricType],
                ["Material", product.material],
                ["GSM", `${product.gsm} GSM`],
                ["Width", product.width],
                ["Weave", product.weave],
                ["Finish", product.finish],
                ["Country of Origin", product.origin],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5">
                  <span className="text-muted">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "Reviews" && (
            <div className="space-y-4">
              {[1, 2, 3].map((r) => (
                <div key={r} className="rounded-xl border border-line p-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">Verified Buyer</span>
                    <span className="text-ink/70">★★★★★</span>
                  </div>
                  <p className="text-sm text-muted">
                    Consistent quality across bulk orders and dependable shipping timelines.
                  </p>
                </div>
              ))}
            </div>
          )}
          {tab === "Supplier Info" && (
            <div className="rounded-xl border border-line p-5 text-sm">
              <div className="mb-1 font-semibold">{product.supplier}</div>
              <p className="text-muted">
                Verified supplier on WeaveLink with a {product.supplierRating}★ rating across {product.supplierReviews} reviews. Specializes in {product.category.toLowerCase()} fabrics manufactured in {product.origin}.
              </p>
            </div>
          )}
          {tab === "Shipping & Returns" && (
            <div className="space-y-3 text-sm text-muted">
              <p>Standard shipping to 50+ countries, typically 7–14 business days for bulk orders.</p>
              <p>Returns accepted for defective or misrepresented fabric within 7 days of delivery.</p>
            </div>
          )}

          <div className="mt-12">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-xl">Similar Fabrics</h3>
              <Link href="/marketplace" className="text-sm font-medium text-terracotta-dark">View all</Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>

        {/* Right purchase panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold">Supplier</div>
              <Link href="/marketplace" className="text-xs font-medium text-terracotta-dark">View Profile</Link>
            </div>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta/20 text-xs font-semibold text-terracotta-dark">
                {product.supplier[0]}
              </span>
              <div>
                <div className="text-sm font-medium">{product.supplier}</div>
                <div className="text-xs text-muted">★ {product.supplierRating} ({product.supplierReviews})</div>
              </div>
            </div>

            <div className="mb-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold">{formatINR(product.pricePerMeter)}</span>
                <span className="text-xs text-muted">/ meter</span>
              </div>
              <span className="rounded-full bg-emerald-700/10 px-2.5 py-1 text-[0.68rem] font-semibold text-emerald-700">
                15% OFF bulk orders
              </span>
            </div>

            <div className="mb-4 divide-y divide-line rounded-xl border border-line text-sm">
              <div className="flex justify-between px-3.5 py-2.5">
                <span className="text-muted">MOQ</span>
                <span className="font-medium">{product.moq} meter</span>
              </div>
              <div className="flex justify-between px-3.5 py-2.5">
                <span className="text-muted">Bulk Price</span>
                <span className="font-medium">{formatINR(product.bulkPrice)} / meter ({product.bulkMinQty}+ meter)</span>
              </div>
              <div className="flex justify-between px-3.5 py-2.5">
                <span className="text-muted">Stock Available</span>
                <span className="font-medium">{product.stock.toLocaleString()} meter</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-1.5 text-sm font-medium">Select Quantity</div>
              <div className="flex items-center justify-between rounded-xl border border-line px-3 py-2">
                <button
                  onClick={() => setQty((q) => Math.max(product.moq, q - 10))}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-line"
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className="text-sm font-medium">{qty} meter</span>
                <button
                  onClick={() => setQty((q) => q + 10)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-line"
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            <button
              onClick={() => addToCart(product.id, qty)}
              className="mb-2.5 w-full rounded-xl bg-ink py-3 text-sm font-semibold text-white transition hover:bg-ink/85"
            >
              Add to Cart
            </button>
            <button className="w-full rounded-xl border border-line py-3 text-sm font-semibold text-ink transition hover:border-ink">
              Request a Quote
            </button>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-cream p-3 text-xs text-ink/70">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-terracotta-dark" />
              <div>
                <span className="font-medium text-ink">Secure & Trusted.</span> Your transactions are safe with us.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}