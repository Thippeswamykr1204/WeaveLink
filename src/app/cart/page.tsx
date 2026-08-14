"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  Heart,
  ArrowRight,
  Sparkles,
  Package,
  FileText,
  ShieldCheck,
  Truck,
  ShoppingCart,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getProduct, products, categoryPhoto } from "@/lib/mockData";
import { formatINR } from "@/lib/utils";
import { FabricSwatch } from "@/components/FabricSwatch";
import { ProductCard } from "@/components/ProductCard";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateCartQuantity, removeFromCart, isWishlisted, toggleWishlist, user, hydrated } = useAppStore();

  const items = cart.map((c) => ({ ...c, product: getProduct(c.productId) })).filter((c) => c.product);
  const [selected, setSelected] = useState<string[]>(items.map((i) => i.productId));

  const recommended = useMemo(
    () => products.filter((p) => !cart.some((c) => c.productId === p.id)).slice(0, 5),
    [cart]
  );

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  // Cart is buyer-only functionality — suppliers don't browse/purchase.
  useEffect(() => {
    if (hydrated && user && user.role !== "buyer") {
      router.replace("/dashboard");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return <div className="mx-auto max-w-lg px-5 py-24 text-center text-sm text-muted">Loading...</div>;
  }

  if (user.role !== "buyer") {
    return <div className="mx-auto max-w-lg px-5 py-24 text-center text-sm text-muted">Redirecting to dashboard...</div>;
  }

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const selectAll = () =>
    setSelected(selected.length === items.length ? [] : items.map((i) => i.productId));

  const selectedItems = items.filter((i) => selected.includes(i.productId));
  const subtotal = selectedItems.reduce((sum, i) => sum + i.product!.pricePerMeter * i.quantity, 0);
  const bulkDiscount = Math.round(subtotal * 0.065);
  const total = subtotal - bulkDiscount;

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <ShoppingCart size={40} className="mx-auto mb-4 text-muted" />
        <div className="mb-2 text-lg font-semibold">Your cart is empty</div>
        <p className="mb-5 text-sm text-muted">Browse the marketplace to find fabrics for your business.</p>
        <Link href="/marketplace" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl">Your Shopping Cart</h1>
          <p className="mt-1 text-sm text-muted">Review your selected fabrics and proceed to checkout.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {[
            { icon: ShieldCheck, title: "Secure Checkout", desc: "Your data is protected" },
            { icon: Package, title: "Verified Suppliers", desc: "2,000+ trusted partners" },
            { icon: Sparkles, title: "Easy Returns", desc: "Hassle-free returns" },
          ].map((t) => (
            <div key={t.title} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2">
              <t.icon size={16} className="text-terracotta-dark" />
              <div>
                <div className="text-xs font-semibold">{t.title}</div>
                <div className="text-[0.65rem] text-muted">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
              <label className="flex items-center gap-2.5 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={selected.length === items.length}
                  onChange={selectAll}
                  className="h-4 w-4 rounded accent-[#1C1712]"
                />
                Select All ({items.length} items)
              </label>
              <button
                onClick={() => items.forEach((i) => removeFromCart(i.productId))}
                className="flex items-center gap-1.5 text-xs font-medium text-red-500"
              >
                <Trash2 size={13} /> Clear Cart
              </button>
            </div>

            <div className="divide-y divide-line">
              <AnimatePresence initial={false}>
                {items.map(({ product, quantity }) => (
                  <motion.div
                    key={product!.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: "hidden" }}
                    transition={{ duration: 0.22 }}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
                  >
                  <input
                    type="checkbox"
                    checked={selected.includes(product!.id)}
                    onChange={() => toggleSelect(product!.id)}
                    className="mt-1 h-4 w-4 shrink-0 rounded accent-[#1C1712] sm:mt-0"
                  />
                  <FabricSwatch
                    image={categoryPhoto(product!.category)}
                    tint={product!.colors[0]}
                    className="h-20 w-20 shrink-0 rounded-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex flex-wrap items-center gap-2">
                      <Link href={`/marketplace/${product!.id}`} className="font-medium hover:text-terracotta-dark">
                        {product!.name}
                      </Link>
                      {product!.badge && (
                        <span className="rounded-full bg-cream-2 px-2 py-0.5 text-[0.62rem] font-semibold">{product!.badge}</span>
                      )}
                    </div>
                    <div className="mb-1.5 flex items-center gap-1 text-xs text-muted">
                      {product!.supplier} <ShieldCheck size={12} className="text-emerald-600" />
                      <span>· {product!.weave} · {product!.finish}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink/70">
                      <span className="h-3 w-3 rounded-full border border-black/10" style={{ background: product!.colors[0] }} />
                      Color: {product!.category}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <div className="text-sm text-muted">{formatINR(product!.pricePerMeter)} / meter</div>
                    <div className="flex items-center gap-2 rounded-lg border border-line px-2 py-1">
                      <button
                        onClick={() => updateCartQuantity(product!.id, Math.max(product!.moq, quantity - 10))}
                        className="p-1"
                        aria-label="Decrease"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-sm font-medium">{quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(product!.id, quantity + 10)}
                        className="p-1"
                        aria-label="Increase"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="text-xs text-muted">{quantity} meter</div>
                  </div>
                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    <button
                      onClick={() => removeFromCart(product!.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:text-red-500"
                      aria-label="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product!.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line"
                      aria-label="Toggle wishlist"
                    >
                      <Heart size={14} className={isWishlisted(product!.id) ? "fill-terracotta-dark text-terracotta-dark" : ""} />
                    </button>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-line p-4 sm:grid-cols-4">
              {[
                { icon: Sparkles, title: "Talk to our AI Assistant", desc: "Need help choosing?", link: "/ai-assistant", cta: "Chat with AI Assistant" },
                { icon: Package, title: "Bulk Order Benefits", desc: "Save up to 15% on bulk orders" },
                { icon: FileText, title: "Custom Requirements", desc: "Can't find what you need?", cta: "Request Custom Fabric" },
                { icon: ShieldCheck, title: "Secure Packaging", desc: "Premium packaging for safe delivery" },
              ].map((t) => (
                <div key={t.title} className="text-xs">
                  <div className="mb-1 font-semibold">{t.title}</div>
                  <div className="text-muted">{t.desc}</div>
                  {t.cta && (
                    <Link href={t.link || "#"} className="mt-0.5 inline-flex items-center gap-1 font-medium text-terracotta-dark">
                      {t.cta} <ArrowRight size={11} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl">You May Also Like</h2>
                <p className="text-xs text-muted">Frequently bought together</p>
              </div>
              <Link href="/marketplace" className="text-sm font-medium text-terracotta-dark">View all</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {recommended.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-4 font-semibold">Order Summary</div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal ({selectedItems.length} items)</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Bulk Discount</span><span className="text-emerald-700">− {formatINR(bulkDiscount)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Shipping (Est.)</span><span className="font-medium text-emerald-700">FREE</span></div>
            </div>
            <div className="my-3 h-px bg-line" />
            <div className="mb-1 flex justify-between font-semibold">
              <span>Estimated Total</span>
              <span>{formatINR(total)}</span>
            </div>
            <div className="mb-4 text-xs text-muted">Prices are exclusive of GST</div>

            {bulkDiscount > 0 && (
              <div className="mb-4 rounded-xl bg-emerald-700/8 p-3 text-xs text-emerald-800">
                <div className="font-semibold">You&apos;re Saving {formatINR(bulkDiscount)}</div>
                <div>{((bulkDiscount / (subtotal || 1)) * 100).toFixed(1)}% off on bulk items</div>
              </div>
            )}

            <Link
              href="/checkout"
              className="mb-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-semibold text-white transition hover:bg-ink/85"
            >
              Proceed to Checkout <ArrowRight size={15} />
            </Link>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-semibold text-ink">
              <FileText size={15} /> Request a Quote
            </button>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-cream p-3 text-xs">
              <Truck size={16} className="mt-0.5 shrink-0 text-terracotta-dark" />
              <div className="flex-1">
                <div className="font-semibold">Shipping Estimate</div>
                <div className="text-muted">Delivery by 28 May – 31 May</div>
                <div className="text-muted">To: Surat, Gujarat, India</div>
              </div>
              <button className="shrink-0 text-terracotta-dark">Change</button>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 text-xs font-medium text-muted">We Accept</div>
              <div className="flex flex-wrap gap-1.5">
                {["VISA", "Mastercard", "RuPay", "UPI", "Net Banking"].map((m) => (
                  <span key={m} className="rounded-md border border-line px-2 py-1 text-[0.6rem] font-semibold text-ink/70">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-ink p-5 text-white">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <ShieldCheck size={17} /> Safe &amp; Secure Shopping
            </div>
            <ul className="space-y-1.5 text-xs text-white/75">
              {["SSL Encrypted Transactions", "Verified Suppliers Only", "Buyer Protection Guarantee", "Secure Payment Options"].map((f) => (
                <li key={f} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}