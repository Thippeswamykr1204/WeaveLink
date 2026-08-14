"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { AccountLayout } from "@/components/AccountLayout";
import { ProductForm } from "@/components/ProductForm";

export default function EditProductPage() {
  const params = useParams<{ productId: string }>();
  const { products } = useAppStore();
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    return (
      <AccountLayout requireRole="supplier">
        <div className="rounded-2xl border border-dashed border-line bg-white py-20 text-center">
          <div className="mb-2 text-lg font-semibold">Product not found</div>
          <p className="mb-5 text-sm text-muted">This product may have been removed from your inventory.</p>
          <Link href="/products/inventory" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            Back to Inventory
          </Link>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout requireRole="supplier">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl">Edit Product</h1>
          <p className="mt-1 text-sm text-muted">Update the details for {product.name}</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
          <Eye size={15} /> Preview Product
        </button>
      </div>
      <ProductForm mode="edit" product={product} />
    </AccountLayout>
  );
}