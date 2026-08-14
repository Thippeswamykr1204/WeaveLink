"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, MapPin, ShieldCheck, Star, Clock, Package } from "lucide-react";
import { getSupplier, supplierProducts, formatResponseTime } from "@/lib/mockData";
import { ProductCard } from "@/components/ProductCard";

function initials(name: string) {
  const words = name.replace(/Pvt\.?|Ltd\.?|Co\./gi, "").trim().split(/\s+/).filter(Boolean);
  return (words[0]?.[0] || "") + (words[1]?.[0] || "");
}

export default function SupplierProfilePage() {
  const params = useParams<{ supplierId: string }>();
  const supplier = getSupplier(params.supplierId);

  if (!supplier) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <div className="mb-2 text-lg font-semibold">Supplier not found</div>
        <p className="mb-5 text-sm text-muted">This supplier profile may have been removed.</p>
        <Link href="/suppliers" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
          Back to Suppliers
        </Link>
      </div>
    );
  }

  const products = supplierProducts(supplier.name);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-6 sm:px-8">
      <div className="mb-5 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/suppliers" className="hover:text-ink">Suppliers</Link>
        <ChevronRight size={14} />
        <span className="text-ink">{supplier.name}</span>
      </div>

      <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 sm:flex-row sm:items-start">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-terracotta/20 text-xl font-semibold text-terracotta-dark">
          {initials(supplier.name)}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-2xl leading-snug">{supplier.name}</h1>
            {supplier.verified && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-700/10 px-2.5 py-1 text-[0.68rem] font-semibold text-emerald-700">
                <ShieldCheck size={12} /> Verified
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-4 text-sm text-ink/70">
            <span className="flex items-center gap-1">
              <Star size={14} className="fill-terracotta-dark text-terracotta-dark" /> {supplier.rating} ({supplier.reviewCount} reviews)
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {supplier.city}, {supplier.state}, {supplier.country}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> Responds in {formatResponseTime(supplier.responseHours)}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{supplier.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {supplier.categories.map((c) => (
              <span key={c} className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink/75">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-3 sm:w-72">
          <div className="rounded-xl border border-line p-4 text-center">
            <div className="text-lg font-semibold">{supplier.businessType}</div>
            <div className="text-xs text-muted">Business Type</div>
          </div>
          <div className="rounded-xl border border-line p-3 text-center">
            <div className="text-lg font-semibold">{supplier.moq} m</div>
            <div className="text-xs text-muted">Min. Order</div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Package size={16} className="text-terracotta-dark" />
        <h2 className="font-serif text-xl">Products from {supplier.name}</h2>
      </div>
      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white py-16 text-center text-sm text-muted">
          No listed products from this supplier yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}