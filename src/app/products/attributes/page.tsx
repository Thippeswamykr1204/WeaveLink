"use client";

import { motion } from "framer-motion";
import { Tags, Boxes } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { InventoryProduct } from "@/lib/mockData";
import { AccountLayout } from "@/components/AccountLayout";

// Dedupe a product field into { value, count } tags, sorted by frequency.
function tagCounts(products: InventoryProduct[], field: keyof InventoryProduct) {
  const counts = new Map<string, number>();
  for (const p of products) {
    const value = String(p[field]);
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

function AttributeGroup({ title, tags, delay }: { title: string; tags: { value: string; count: number }[]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className="rounded-2xl border border-line bg-white p-5"
    >
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-xs text-muted">{tags.length} values</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t.value}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-medium text-ink/80"
          >
            {t.value}
            <span className="rounded-full bg-white px-1.5 py-0.5 text-[0.65rem] font-semibold text-terracotta-dark">
              {t.count}
            </span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function AttributesPage() {
  const { products } = useAppStore();

  const groups = [
    { title: "Material", tags: tagCounts(products, "material") },
    { title: "Fabric Type", tags: tagCounts(products, "fabricType") },
    { title: "Weave", tags: tagCounts(products, "weave") },
    { title: "Finish", tags: tagCounts(products, "finish") },
  ];

  return (
    <AccountLayout requireRole="supplier">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta-dark">
          <Tags size={20} />
        </div>
        <div>
          <h1 className="font-serif text-2xl">Attributes</h1>
          <p className="text-sm text-muted">Material, fabric type, weave, and finish values in use across your catalog</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <Boxes size={26} className="mb-3 text-muted" />
          <div className="mb-1 text-sm font-medium">No products yet</div>
          <p className="max-w-sm text-sm text-muted">Add products to see their attributes summarized here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {groups.map((g, i) => (
            <AttributeGroup key={g.title} title={g.title} tags={g.tags} delay={i * 0.05} />
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
