"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Info,
  Plus,
  Download,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Ruler,
  AlertTriangle,
  XCircle,
  Wallet,
  Pencil,
  Trash2,
  MoreHorizontal,
  Bell,
  ClipboardList,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { inventoryCategories, categoryPhoto } from "@/lib/mockData";
import { formatINR, cn } from "@/lib/utils";
import { AccountLayout } from "@/components/AccountLayout";
import { FabricSwatch } from "@/components/FabricSwatch";

const statusStyles: Record<string, string> = {
  Available: "bg-emerald-100 text-emerald-800",
  "Low Stock": "bg-amber-100 text-amber-800",
  "Out of Stock": "bg-red-100 text-red-700",
};

const statusDot: Record<string, string> = {
  Available: "bg-emerald-600",
  "Low Stock": "bg-amber-500",
  "Out of Stock": "bg-red-500",
};

const PAGE_SIZE = 10;

export default function InventoryPage() {
  const { products, deleteProduct } = useAppStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [stockStatus, setStockStatus] = useState("Stock Status");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState("Latest Added");
  const [page, setPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (query) {
        const q = query.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q) && !p.id.includes(q)) return false;
      }
      if (category !== "All Categories" && p.category !== category) return false;
      if (stockStatus !== "Stock Status" && p.status !== stockStatus) return false;
      if (status !== "All Status" && p.status !== status) return false;
      return true;
    });
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.pricePerMeter - b.pricePerMeter);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.pricePerMeter - a.pricePerMeter);
    if (sort === "Stock: Low to High") list = [...list].sort((a, b) => a.stock - b.stock);
    if (sort === "Latest Added") list = [...list].sort((a, b) => b.addedTimestamp - a.addedTimestamp);
    return list;
  }, [products, query, category, stockStatus, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalProducts = products.length;
  const availableStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStockCount = products.filter((p) => p.status === "Low Stock").length;
  const outOfStockCount = products.filter((p) => p.status === "Out of Stock").length;
  const totalValue = products.reduce((s, p) => s + p.pricePerMeter * p.stock, 0);

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleSelectAll = () =>
    setSelected(selected.length === pageItems.length ? [] : pageItems.map((p) => p.id));

  const confirmDelete = (id: string) => {
    deleteProduct(id);
    setConfirmDeleteId(null);
    setSelected((s) => s.filter((x) => x !== id));
  };

  return (
    <AccountLayout requireRole="supplier">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl">Inventory Management</h1>
            <Info size={16} className="text-muted" />
          </div>
          <p className="mt-1 text-sm text-muted">Manage your product catalog and track stock availability.</p>
        </div>
        <div className="flex gap-2.5">
          <Link
            href="/products/new"
            className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/85"
          >
            <Plus size={16} /> Add New Product
          </Link>
          <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { icon: Boxes, label: "Total Products", value: totalProducts.toLocaleString(), sub: "All products in catalog", tint: "bg-indigo-100 text-indigo-700" },
          { icon: Ruler, label: "Available Stock", value: `${availableStock.toLocaleString()} Mtrs`, sub: "Across all products", tint: "bg-emerald-100 text-emerald-700" },
          { icon: AlertTriangle, label: "Low Stock", value: lowStockCount, sub: "Products running low", tint: "bg-amber-100 text-amber-700" },
          { icon: XCircle, label: "Out of Stock", value: outOfStockCount, sub: "Products out of stock", tint: "bg-red-100 text-red-700" },
          { icon: Wallet, label: "Total Value", value: formatINR(totalValue), sub: "Inventory value", tint: "bg-sky-100 text-sky-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-4">
            <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-full", s.tint)}>
              <s.icon size={18} />
            </div>
            <div className="text-lg font-semibold sm:text-xl">{s.value}</div>
            <div className="text-sm font-medium">{s.label}</div>
            <div className="text-xs text-muted">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-2.5 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-2.5">
          <Search size={16} className="text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by product name, SKU, or ID..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm"
        >
          <option>All Categories</option>
          {inventoryCategories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={stockStatus}
          onChange={(e) => {
            setStockStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm"
        >
          <option>Stock Status</option>
          <option>Available</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm"
        >
          <option>All Status</option>
          <option>Available</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
          <SlidersHorizontal size={15} /> Filters
        </button>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none rounded-xl border border-line bg-white py-2.5 pl-3.5 pr-9 text-sm"
          >
            <option>Latest Added</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Stock: Low to High</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </div>

      {pageItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white py-16 text-center">
          <div className="mb-1 font-medium">No products found</div>
          <p className="mb-4 text-sm text-muted">Try a different search or filter, or add a new product.</p>
          <Link href="/products/new" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            Add New Product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.length === pageItems.length && pageItems.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded accent-[#1C1712]"
                    />
                  </th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price (per Mtr)</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Added On</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0 hover:bg-cream/40">
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selected.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="h-4 w-4 rounded accent-[#1C1712]"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <FabricSwatch
                          image={categoryPhoto(p.category)}
                          tint={p.colors[0]}
                          className="h-12 w-12 shrink-0 rounded-lg"
                        />
                        <div className="min-w-0">
                          <div className="truncate font-medium">{p.name}</div>
                          <div className="text-xs text-muted">SKU: {p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-ink/80">{p.category}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-medium">{formatINR(p.pricePerMeter)}</td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className={p.stock === 0 ? "font-medium text-red-600" : p.status === "Low Stock" ? "font-medium text-amber-700" : "font-medium text-emerald-700"}>
                        {p.stock}
                      </span>{" "}
                      Mtrs
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[p.status])}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[p.status])} />
                        {p.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-ink/80">
                      {p.addedOn.split(",")[0]}
                      <div className="text-xs text-muted">{p.addedOn.split(",")[1]}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/products/${p.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink/70 hover:border-ink"
                          aria-label="Edit product"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setConfirmDeleteId(p.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-red-500 hover:border-red-400"
                          aria-label="Delete product"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink/70" aria-label="More">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-3.5 sm:flex-row">
            <span className="text-xs text-muted">
              Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-line p-1.5 disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "h-7 w-7 rounded-lg text-xs font-medium",
                    page === i + 1 ? "bg-ink text-white" : "border border-line"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-line p-1.5 disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 rounded-2xl border border-line bg-white p-6 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { icon: Bell, title: "Smart Inventory Alerts", desc: "Get notified for low stock" },
          { icon: ClipboardList, title: "Bulk Updates", desc: "Update prices & stock in bulk" },
          { icon: BarChart3, title: "Inventory Analytics", desc: "Track movement & trends" },
          { icon: RefreshCw, title: "Auto Reorder", desc: "Never run out of stock" },
          { icon: Download, title: "Export Reports", desc: "Download inventory reports" },
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

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <div className="mb-2 font-semibold">Delete this product?</div>
            <p className="mb-5 text-sm text-muted">
              This will permanently remove it from your catalog. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 rounded-xl border border-line py-2.5 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(confirmDeleteId)}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}