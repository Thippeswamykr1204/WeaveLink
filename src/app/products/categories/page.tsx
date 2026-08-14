"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ListTree, Boxes, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { categoryPhoto } from "@/lib/mockData";
import { AccountLayout } from "@/components/AccountLayout";
import { FabricSwatch } from "@/components/FabricSwatch";

export default function CategoriesPage() {
  const { products } = useAppStore();

  // Real, deduped categories from the live product catalog — count and total
  // stock per category, computed straight from store data (no mock stubs).
  const categories = Array.from(new Set(products.map((p) => p.category)))
    .map((category) => {
      const items = products.filter((p) => p.category === category);
      return {
        name: category,
        count: items.length,
        totalStock: items.reduce((sum, p) => sum + p.stock, 0),
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <AccountLayout requireRole="supplier">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta-dark">
          <ListTree size={20} />
        </div>
        <div>
          <h1 className="font-serif text-2xl">Categories</h1>
          <p className="text-sm text-muted">{categories.length} categories across your catalog</p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <Boxes size={26} className="mb-3 text-muted" />
          <div className="mb-1 text-sm font-medium">No products yet</div>
          <p className="max-w-sm text-sm text-muted">Add products to see them organized into categories here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Link
                href="/products/inventory"
                className="group flex items-center gap-3.5 rounded-2xl border border-line bg-white p-4 transition hover:border-terracotta-dark hover:shadow-sm"
              >
                <FabricSwatch image={categoryPhoto(c.name)} className="h-14 w-14 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-muted">
                    {c.count} {c.count === 1 ? "product" : "products"} · {c.totalStock.toLocaleString()} m in stock
                  </div>
                </div>
                <ArrowRight size={15} className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-terracotta-dark" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
