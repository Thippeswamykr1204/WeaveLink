"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Trash2,
  Plus,
  X,
  Eye,
  Lightbulb,
  TrendingUp,
  ShieldCheck,
  Settings2,
  Award,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { InventoryProduct, BulkPricingTier } from "@/lib/mockData";
import { formatINR, cn } from "@/lib/utils";
import { FabricSwatch } from "@/components/FabricSwatch";

const categories = ["Cotton Fabrics", "Linen Fabrics", "Silk Fabrics", "Denim Fabrics", "Polyester Fabrics", "Rayon Fabrics", "Suiting Fabrics"];
const fabricTypes = ["Woven", "Knit", "Denim", "Jacquard", "Canvas"];
const weaves = ["Plain Weave", "Twill", "Satin Weave", "Canvas", "Jacquard", "Voile", "Dobby Weave", "Slub Weave", "Chiffon"];
const finishes = ["Mercerized", "Pre-Shrunk", "Soft Wash", "Enzyme Washed", "Raw", "Sheer", "Stain Resistant", "Water Resistant", "Natural", "Pressed"];
const countries = ["India", "China", "Italy", "Japan", "Bangladesh"];

const swatchGradients = [
  "linear-gradient(135deg, #e9d8bd, #c9a577)",
  "linear-gradient(135deg, #8b9a6d, #5f6e46)",
  "linear-gradient(135deg, #e8b6c2, #c46e83)",
  "linear-gradient(135deg, #3c5c82, #21334a)",
  "linear-gradient(135deg, #b9b0a0, #8a8478)",
];

interface FormState {
  name: string;
  category: string;
  fabricType: string;
  material: string;
  gsm: string;
  width: string;
  weave: string;
  finish: string;
  origin: string;
  pricePerMeter: string;
  moq: string;
  stock: string;
  colors: string[];
  available: boolean;
  description: string;
  bulkTiers: BulkPricingTier[];
}

const emptyForm: FormState = {
  name: "",
  category: "",
  fabricType: "",
  material: "",
  gsm: "",
  width: "",
  weave: "",
  finish: "",
  origin: "",
  pricePerMeter: "",
  moq: "",
  stock: "",
  colors: [],
  available: true,
  description: "",
  bulkTiers: [],
};

function productToForm(p: InventoryProduct): FormState {
  return {
    name: p.name,
    category: p.category,
    fabricType: p.fabricType,
    material: p.material,
    gsm: String(p.gsm),
    width: p.width,
    weave: p.weave,
    finish: p.finish,
    origin: p.origin,
    pricePerMeter: String(p.pricePerMeter),
    moq: String(p.moq),
    stock: String(p.stock),
    colors: p.colors,
    available: p.status !== "Out of Stock",
    description: p.description,
    bulkTiers: p.bulkTiers,
  };
}

export function ProductForm({ mode, product }: { mode: "create" | "edit"; product?: InventoryProduct }) {
  const router = useRouter();
  const { addProduct, updateProduct } = useAppStore();
  const [form, setForm] = useState<FormState>(product ? productToForm(product) : emptyForm);
  const [colorInput, setColorInput] = useState("");
  const [images, setImages] = useState<string[]>(product ? [product.image] : []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addColor = () => {
    const v = colorInput.trim();
    if (!v) return;
    setField("colors", [...form.colors, v]);
    setColorInput("");
  };
  const removeColor = (idx: number) => setField("colors", form.colors.filter((_, i) => i !== idx));

  const addTier = () =>
    setField("bulkTiers", [...form.bulkTiers, { minQty: 0, maxQty: 0, pricePerMeter: 0 }]);
  const updateTier = (idx: number, fields: Partial<BulkPricingTier>) =>
    setField(
      "bulkTiers",
      form.bulkTiers.map((t, i) => (i === idx ? { ...t, ...fields } : t))
    );
  const removeTier = (idx: number) => setField("bulkTiers", form.bulkTiers.filter((_, i) => i !== idx));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files)
      .slice(0, 4 - images.length)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImages((imgs) => [...imgs, reader.result as string].slice(0, 4));
          }
        };
        reader.readAsDataURL(file);
      });
  };

  const mockImage = () => swatchGradients[Math.min(images.length, swatchGradients.length - 1)];

  const isDataUrl = (src: string) => src.startsWith("data:");

  const buildProduct = (): InventoryProduct => {
    const now = new Date();
    const stock = Number(form.stock) || 0;
    return {
      id: product?.id || `inv-${Date.now()}`,
      sku: product?.sku || `WL-NEW-${Math.floor(100 + Math.random() * 900)}`,
      name: form.name,
      category: form.category,
      fabricType: form.fabricType,
      material: form.material,
      gsm: Number(form.gsm) || 0,
      width: form.width,
      weave: form.weave,
      finish: form.finish,
      origin: form.origin,
      pricePerMeter: Number(form.pricePerMeter) || 0,
      moq: Number(form.moq) || 0,
      stock: form.available ? stock : 0,
      colors: form.colors.length ? form.colors : ["#C8A97A"],
      description: form.description,
      image: isDataUrl(images[0] || "") ? product?.image || mockImage() : mockImage(),
      bulkTiers: form.bulkTiers.filter((t) => t.minQty || t.maxQty || t.pricePerMeter),
      status: !form.available ? "Out of Stock" : stock < 100 ? "Low Stock" : "Available",
      addedOn:
        product?.addedOn ||
        now.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      addedTimestamp: product?.addedTimestamp || now.getTime(),
    };
  };

  const handlePublish = () => {
    const built = buildProduct();
    if (mode === "edit" && product) {
      updateProduct(product.id, built);
    } else {
      addProduct(built);
    }
    router.push("/products/inventory");
  };

  const handleSaveDraft = () => {
    // UI-only for now — no backend to persist a separate draft state.
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {/* 1. Basic Information */}
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 font-semibold">1. Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1.5 block text-sm font-medium">Product Name *</label>
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. Premium Cotton Poplin"
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Fabric Type *</label>
              <select
                value={form.fabricType}
                onChange={(e) => setField("fabricType", e.target.value)}
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              >
                <option value="">Select Fabric Type</option>
                {fabricTypes.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Material Composition *</label>
              <input
                value={form.material}
                onChange={(e) => setField("material", e.target.value)}
                placeholder="e.g. 100% Cotton"
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">GSM (Grams per Square Meter) *</label>
              <input
                value={form.gsm}
                onChange={(e) => setField("gsm", e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g. 120"
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Width (Inches) *</label>
              <input
                value={form.width}
                onChange={(e) => setField("width", e.target.value)}
                placeholder="e.g. 58"
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Weave *</label>
              <select
                value={form.weave}
                onChange={(e) => setField("weave", e.target.value)}
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              >
                <option value="">Select Weave</option>
                {weaves.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Finish</label>
              <select
                value={form.finish}
                onChange={(e) => setField("finish", e.target.value)}
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              >
                <option value="">Select Finish</option>
                {finishes.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Country of Origin</label>
              <select
                value={form.origin}
                onChange={(e) => setField("origin", e.target.value)}
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Pricing & Quantity */}
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 font-semibold">2. Pricing &amp; Quantity</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Price per Meter (₹) *</label>
              <input
                value={form.pricePerMeter}
                onChange={(e) => setField("pricePerMeter", e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="e.g. 120.00"
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">MOQ (Meters) *</label>
              <input
                value={form.moq}
                onChange={(e) => setField("moq", e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g. 50"
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Stock Quantity (Meters) *</label>
              <input
                value={form.stock}
                onChange={(e) => setField("stock", e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g. 500"
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2">
              <div className="text-sm font-medium">Bulk Pricing Tiers (Optional)</div>
              <div className="text-xs text-muted">Set different prices for bulk orders</div>
            </div>
            {form.bulkTiers.length > 0 && (
              <div className="mb-2 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      <th className="px-3 py-2">Min Quantity (Meters)</th>
                      <th className="px-3 py-2">Max Quantity (Meters)</th>
                      <th className="px-3 py-2">Price per Meter (₹)</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.bulkTiers.map((t, i) => (
                      <tr key={i} className="border-b border-line last:border-0">
                        <td className="px-3 py-2">
                          <input
                            value={t.minQty || ""}
                            onChange={(e) => updateTier(i, { minQty: Number(e.target.value.replace(/[^0-9]/g, "")) })}
                            className="w-full rounded-lg border border-line px-2.5 py-1.5 text-sm outline-none focus:border-ink"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={t.maxQty || ""}
                            onChange={(e) => updateTier(i, { maxQty: Number(e.target.value.replace(/[^0-9]/g, "")) })}
                            className="w-full rounded-lg border border-line px-2.5 py-1.5 text-sm outline-none focus:border-ink"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={t.pricePerMeter || ""}
                            onChange={(e) => updateTier(i, { pricePerMeter: Number(e.target.value.replace(/[^0-9.]/g, "")) })}
                            className="w-full rounded-lg border border-line px-2.5 py-1.5 text-sm outline-none focus:border-ink"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button onClick={() => removeTier(i)} className="text-red-500" aria-label="Remove tier">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button
              onClick={addTier}
              className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-terracotta-dark"
            >
              <Plus size={13} /> Add Pricing Tier
            </button>
          </div>
        </div>

        {/* 3. Variants & Availability */}
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 font-semibold">3. Variants &amp; Availability</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Color Options *</label>
              <p className="mb-2 text-xs text-muted">Add available colors for this fabric</p>
              <div className="mb-2 flex flex-wrap gap-2">
                {form.colors.map((c, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-medium"
                  >
                    <span className="h-3 w-3 rounded-full border border-black/10" style={{ background: c }} />
                    {c}
                    <button onClick={() => removeColor(i)} aria-label="Remove color">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addColor()}
                  placeholder="e.g. Ivory White or #EDE1CB"
                  className="flex-1 rounded-xl border border-line px-3.5 py-2 text-sm outline-none focus:border-ink"
                />
                <button
                  onClick={addColor}
                  className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-semibold text-terracotta-dark"
                >
                  <Plus size={13} /> Add Color
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Availability Status *</label>
              <p className="mb-2 text-xs text-muted">Mark product as available or out of stock</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setField("available", true)}
                  className={cn(
                    "flex-1 rounded-xl border py-2.5 text-sm font-medium",
                    form.available ? "border-emerald-600 bg-emerald-700/8 text-emerald-800" : "border-line text-ink/70"
                  )}
                >
                  Available
                </button>
                <button
                  onClick={() => setField("available", false)}
                  className={cn(
                    "flex-1 rounded-xl border py-2.5 text-sm font-medium",
                    !form.available ? "border-red-400 bg-red-50 text-red-700" : "border-line text-ink/70"
                  )}
                >
                  Out of Stock
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Description */}
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 font-semibold">4. Description</h2>
          <label className="mb-1.5 block text-sm font-medium">Product Description *</label>
          <div className="relative">
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value.slice(0, 1000))}
              placeholder="Describe your fabric, its uses, features, care instructions, etc."
              rows={5}
              className="w-full resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
            />
            <div className="absolute bottom-2.5 right-3 text-[0.65rem] text-muted">{form.description.length} / 1000</div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push("/products/inventory")}
            className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDraft}
            className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium"
          >
            Save as Draft
          </button>
          <button
            onClick={handlePublish}
            className="ml-auto rounded-xl bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/85"
          >
            {mode === "edit" ? "Save Changes" : "Publish Product"}
          </button>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-1 font-semibold">Product Images</div>
          <p className="mb-3 text-xs text-muted">Upload high quality images of your fabric</p>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-line py-8 text-center"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-cream-2 text-ink/60">
              <Upload size={18} />
            </div>
            <div className="mb-2 text-sm text-muted">Drag &amp; drop images here</div>
            <div className="mb-2 text-xs text-muted">or</div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-line px-3.5 py-1.5 text-xs font-semibold"
            >
              Upload Images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="mt-2 text-[0.65rem] text-muted">JPG, PNG or WEBP. Max size 5MB each</div>
          </div>
          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.map((src, i) => (
                <div key={i} className="relative">
                  {isDataUrl(src) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="Preview" className="h-16 w-full rounded-lg object-cover" />
                  ) : (
                    <FabricSwatch gradient={src} className="h-16 w-full rounded-lg" />
                  )}
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[0.55rem] font-semibold text-emerald-700">
                      Primary
                    </span>
                  )}
                  <button
                    onClick={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))}
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-white"
                    aria-label="Remove image"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-3 font-semibold">Product Summary</div>
          <div className="space-y-2 text-sm">
            {[
              ["Category", form.category],
              ["Fabric Type", form.fabricType],
              ["GSM", form.gsm],
              ["Width", form.width],
              ["Price per Meter", form.pricePerMeter ? formatINR(Number(form.pricePerMeter)) : ""],
              ["Stock", form.stock],
              ["Availability", form.available ? "Available" : "Out of Stock"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted">{k}</span>
                <span className="font-medium">{v || "-"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <Lightbulb size={16} className="text-terracotta-dark" /> Tips for Better Listings
          </div>
          <div className="space-y-2 text-sm">
            {[
              { icon: Eye, text: "Use clear, high-quality images" },
              { icon: ShieldCheck, text: "Provide accurate GSM and width" },
              { icon: Settings2, text: "Add detailed description" },
              { icon: TrendingUp, text: "Set competitive pricing" },
              { icon: Award, text: "Keep stock updated" },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-2 text-ink/75">
                <t.icon size={14} className="text-emerald-600" /> {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}