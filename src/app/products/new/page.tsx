"use client";

import { Eye } from "lucide-react";
import { AccountLayout } from "@/components/AccountLayout";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <AccountLayout requireRole="supplier">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl">Add New Product</h1>
          <p className="mt-1 text-sm text-muted">Fill in the product details to list your fabric on WeaveLink</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
          <Eye size={15} /> Preview Product
        </button>
      </div>
      <ProductForm mode="create" />
    </AccountLayout>
  );
}