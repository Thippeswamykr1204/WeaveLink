"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Scale3d, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Product, categoryPhoto } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";
import { cn, formatINR } from "@/lib/utils";
import { FabricSwatch } from "./FabricSwatch";

const badgeStyles: Record<string, string> = {
  "Best Seller": "bg-ink text-white",
  "Eco Friendly": "bg-emerald-700 text-white",
  Premium: "bg-terracotta-dark text-white",
  "New Arrival": "bg-sky-800 text-white",
};

export function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist, addToCart, hydrated, compareList, addToCompare } = useAppStore();
  const wishlisted = hydrated && isWishlisted(product.id);
  const compared = hydrated && compareList.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="group overflow-hidden rounded-2xl border border-line bg-white transition hover:shadow-[0_10px_30px_-12px_rgba(28,23,18,0.18)]"
    >
      <Link href={`/marketplace/${product.id}`} className="block">
        <div className="relative aspect-[4/3.1] w-full overflow-hidden">
          <FabricSwatch
            image={categoryPhoto(product.category)}
            tint={product.colors[0]}
            className="h-full w-full transition duration-500 group-hover:scale-105"
          />
          {product.badge && (
            <span
              className={cn(
                "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide",
                badgeStyles[product.badge]
              )}
            >
              {product.badge}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-105"
            aria-label="Toggle wishlist"
          >
            <Heart
              size={16}
              className={wishlisted ? "fill-terracotta-dark text-terracotta-dark" : "text-ink/70"}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCompare(product.id);
            }}
            className={cn(
              "absolute right-12 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition hover:scale-105",
              compared ? "bg-terracotta-dark text-white" : "bg-white/90 text-ink/70"
            )}
            aria-label={compared ? "Added to compare" : "Add to compare"}
          >
            {compared ? <Check size={16} /> : <Scale3d size={16} />}
          </button>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/marketplace/${product.id}`}>
          <h3 className="mb-1 text-[0.98rem] font-semibold leading-snug hover:text-terracotta-dark">
            {product.name}
          </h3>
        </Link>
        <div className="mb-2 flex items-center gap-1.5 text-[0.8rem] text-muted">
          <span>{product.supplier}</span>
          <span className="flex items-center gap-0.5 text-ink/70">
            ★ {product.supplierRating}
            <span className="text-muted">({product.supplierReviews})</span>
          </span>
        </div>
        <div className="mb-2 flex items-baseline gap-1.5">
          <span className="text-lg font-semibold">{formatINR(product.pricePerMeter)}</span>
          <span className="text-xs text-muted">/ meter</span>
        </div>
        <div className="mb-3 text-xs text-muted">MOQ {product.moq} meter</div>
        <div className="mb-3 flex items-center gap-1.5">
          {product.colors.slice(0, 4).map((c, i) => (
            <span
              key={i}
              className="h-4 w-4 rounded-full border border-black/10"
              style={{ background: c }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-xs text-muted">+{product.colors.length - 4}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/marketplace/${product.id}`}
            className="flex-1 rounded-lg bg-ink py-2 text-center text-sm font-medium text-white transition hover:bg-ink/85"
          >
            View Details
          </Link>
          <button
            onClick={() => addToCart(product.id)}
            className="flex w-10 items-center justify-center rounded-lg border border-line text-ink/80 transition hover:border-ink hover:text-ink"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}