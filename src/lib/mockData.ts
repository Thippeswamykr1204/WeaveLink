export type Badge = "Best Seller" | "Eco Friendly" | "Premium" | "New Arrival";

export interface Product {
  id: string;
  name: string;
  category: string;
  fabricType: string;
  supplier: string;
  supplierRating: number;
  supplierReviews: number;
  pricePerMeter: number;
  bulkPrice: number;
  bulkMinQty: number;
  moq: number;
  stock: number;
  colors: string[];
  badge?: Badge;
  image: string;
  material: string;
  gsm: number;
  width: string;
  weave: string;
  finish: string;
  origin: string;
  description: string;
  features: string[];
}

const swatch = (hue: string) =>
  `linear-gradient(135deg, ${hue})`;

/** Real fabric photography used across the app, mapped by category (matches "Cotton" or "Cotton Fabrics" alike). */
const categoryPhoto = (category: string): string => {
  const rules: [string, string][] = [
    ["Cotton", "/images/category-natural-weave.png"],
    ["Linen", "/images/category-natural-weave.png"],
    ["Rayon", "/images/category-natural-weave.png"],
    ["Denim", "/images/category-drape.png"],
    ["Polyester", "/images/category-drape.png"],
    ["Suiting", "/images/category-drape.png"],
    ["Silk", "/images/category-silk-sheen.png"],
    ["Wool", "/images/category-soft-fold.png"],
  ];
  const match = rules.find(([keyword]) => category.toLowerCase().includes(keyword.toLowerCase()));
  return match ? match[1] : "/images/category-natural-weave.png";
};

/** Detail-page gallery photo used for thumbnail slots 2-5 (close-up texture shot). */
export const galleryDetailPhoto = "/images/fabric-detail-texture.png";

/** All available fabric photos, used to build a varied 5-image gallery per product. */
const allFabricPhotos = [
  "/images/category-natural-weave.png",
  "/images/category-drape.png",
  "/images/category-silk-sheen.png",
  "/images/category-soft-fold.png",
  "/images/fabric-detail-texture.png",
];

/** Returns 5 distinct photos for the product detail gallery: category shot first, then the rest. */
export const productGalleryPhotos = (category: string): string[] => {
  const main = categoryPhoto(category);
  return [main, ...allFabricPhotos.filter((p) => p !== main)];
};
export { categoryPhoto };

export const products: Product[] = [
  {
    id: "premium-cotton-poplin",
    name: "Premium Cotton Poplin Fabric",
    category: "Cotton",
    fabricType: "Woven",
    supplier: "Shiv Textiles",
    supplierRating: 4.8,
    supplierReviews: 124,
    pricePerMeter: 120,
    bulkPrice: 108,
    bulkMinQty: 500,
    moq: 50,
    stock: 5600,
    colors: ["#EDE1CB", "#C8A97A", "#7A5B3E", "#3E4A3D", "#2E5C8A", "#0F2A4A", "#D98A9A", "#B9B9B9", "#111111"],
    badge: "Best Seller",
    image: swatch("#e9d8bd, #c9a577"),
    material: "100% Cotton",
    gsm: 120,
    width: "58/60 inches",
    weave: "Plain Poplin",
    finish: "Mercerized",
    origin: "India",
    description:
      "Our Premium Cotton Poplin Fabric is woven with high-quality cotton yarns to deliver a smooth, soft, and durable fabric. Ideal for making shirts, dresses, uniforms, and a wide range of fashion and apparel products. It offers excellent color retention, comfort, and breathability, making it perfect for everyday wear.",
    features: ["Breathable", "Soft Finish", "Durable", "Shrink Resistant"],
  },
  {
    id: "linen-blend-fabric",
    name: "Linen Blend Fabric",
    category: "Linen",
    fabricType: "Woven",
    supplier: "Naman Exports",
    supplierRating: 4.7,
    supplierReviews: 98,
    pricePerMeter: 180,
    bulkPrice: 162,
    bulkMinQty: 300,
    moq: 100,
    stock: 3100,
    colors: ["#8E9B7A", "#3C4A6B", "#111111", "#C9A97A", "#E8DFCB", "#7A5B3E"],
    badge: "Eco Friendly",
    image: swatch("#8b9a6d, #5f6e46"),
    material: "55% Linen / 45% Cotton",
    gsm: 165,
    width: "56 inches",
    weave: "Plain Weave",
    finish: "Stone Washed",
    origin: "India",
    description:
      "A breathable linen-cotton blend with a relaxed drape, suited to warm-weather apparel and home textiles. Naturally textured with a soft, lived-in hand feel that softens further with each wash.",
    features: ["Breathable", "Natural Texture", "Lightweight", "Eco Friendly"],
  },
  {
    id: "silk-satin-fabric",
    name: "Silk Satin Fabric",
    category: "Silk",
    fabricType: "Woven",
    supplier: "Royal Silks",
    supplierRating: 4.9,
    supplierReviews: 156,
    pricePerMeter: 450,
    bulkPrice: 405,
    bulkMinQty: 100,
    moq: 25,
    stock: 1800,
    colors: ["#D98A9A", "#8A1F2B", "#E8C9D0", "#111111", "#C9A97A", "#E8DFCB"],
    badge: "Premium",
    image: swatch("#e8b6c2, #c46e83"),
    material: "100% Mulberry Silk",
    gsm: 90,
    width: "44 inches",
    weave: "Satin Weave",
    finish: "Lustrous",
    origin: "China",
    description:
      "A luxurious mulberry silk satin with a high-shine face and fluid drape, favored for eveningwear, linings, and premium accessories. Exceptionally smooth to the touch with rich, saturated color depth.",
    features: ["Lustrous Sheen", "Fluid Drape", "Premium Feel", "Colorfast"],
  },
  {
    id: "denim-cotton-stretch",
    name: "Denim Cotton Stretch",
    category: "Denim",
    fabricType: "Denim",
    supplier: "Jeans Co. Fabric",
    supplierRating: 4.6,
    supplierReviews: 87,
    pricePerMeter: 220,
    bulkPrice: 198,
    bulkMinQty: 400,
    moq: 50,
    stock: 4200,
    colors: ["#2E4A6B", "#1B2A3C", "#111111", "#5A6B7A", "#8A97A5"],
    badge: "New Arrival",
    image: swatch("#3c5c82, #21334a"),
    material: "98% Cotton / 2% Elastane",
    gsm: 320,
    width: "60 inches",
    weave: "3x1 Twill",
    finish: "Enzyme Washed",
    origin: "India",
    description:
      "A comfort-stretch denim with reliable recovery, engineered for modern fits across jeans, jackets, and workwear. Deep indigo saturation with a soft-brushed backside.",
    features: ["4-Way Stretch", "Durable", "Fade Resistant", "Soft Hand"],
  },
  {
    id: "cotton-linen-blend",
    name: "Cotton Linen Blend",
    category: "Cotton",
    fabricType: "Woven",
    supplier: "Naman Exports",
    supplierRating: 4.7,
    supplierReviews: 98,
    pricePerMeter: 150,
    bulkPrice: 135,
    bulkMinQty: 300,
    moq: 75,
    stock: 2600,
    colors: ["#E8D8C0", "#C9A97A", "#7A5B3E"],
    image: swatch("#e6d5bb, #cdb187"),
    material: "70% Cotton / 30% Linen",
    gsm: 145,
    width: "58 inches",
    weave: "Plain Weave",
    finish: "Soft Wash",
    origin: "India",
    description:
      "A balanced cotton-linen blend combining linen's texture with cotton's softness — a versatile base for shirting and light outerwear.",
    features: ["Breathable", "Soft Finish", "Textured"],
  },
  {
    id: "soft-cotton-voile",
    name: "Soft Cotton Voile",
    category: "Cotton",
    fabricType: "Woven",
    supplier: "Royal Silks",
    supplierRating: 4.6,
    supplierReviews: 67,
    pricePerMeter: 110,
    bulkPrice: 99,
    bulkMinQty: 400,
    moq: 100,
    stock: 3800,
    colors: ["#F0E5D5", "#D98A9A", "#8AA5C9"],
    image: swatch("#f1c7d3, #dba0b3"),
    material: "100% Cotton",
    gsm: 60,
    width: "44 inches",
    weave: "Voile",
    finish: "Soft Wash",
    origin: "India",
    description:
      "A featherlight, semi-sheer cotton voile ideal for layered summer garments and delicate linings.",
    features: ["Lightweight", "Sheer", "Breathable"],
  },
  {
    id: "organic-cotton-twill",
    name: "Organic Cotton Twill",
    category: "Cotton",
    fabricType: "Woven",
    supplier: "GreenWeave Fabrics",
    supplierRating: 4.8,
    supplierReviews: 112,
    pricePerMeter: 135,
    bulkPrice: 121,
    bulkMinQty: 350,
    moq: 60,
    stock: 2900,
    colors: ["#5F6E46", "#8E9B7A", "#3C3226", "#111111"],
    badge: "Eco Friendly",
    image: swatch("#7c8f5c, #52603a"),
    material: "100% GOTS Organic Cotton",
    gsm: 240,
    width: "58 inches",
    weave: "2x1 Twill",
    finish: "Natural",
    origin: "India",
    description:
      "GOTS-certified organic cotton twill with a durable diagonal weave, suited for workwear, bags, and structured apparel.",
    features: ["Certified Organic", "Durable", "Structured"],
  },
  {
    id: "polyester-canvas",
    name: "Poly Canvas Heavy",
    category: "Polyester",
    fabricType: "Canvas",
    supplier: "Bombay Weaves",
    supplierRating: 4.5,
    supplierReviews: 54,
    pricePerMeter: 95,
    bulkPrice: 85,
    bulkMinQty: 500,
    moq: 100,
    stock: 6100,
    colors: ["#3C3226", "#5A6B7A", "#111111", "#8A97A5"],
    image: swatch("#7c8291, #545a68"),
    material: "100% Polyester",
    gsm: 340,
    width: "60 inches",
    weave: "Canvas",
    finish: "Water Resistant",
    origin: "China",
    description:
      "A heavyweight polyester canvas with a durable water-resistant finish, built for bags, upholstery, and outdoor gear.",
    features: ["Water Resistant", "Heavy Duty", "Durable"],
  },
  {
    id: "wool-blend-suiting",
    name: "Wool Blend Suiting",
    category: "Wool",
    fabricType: "Woven",
    supplier: "Raymond Mills",
    supplierRating: 4.9,
    supplierReviews: 201,
    pricePerMeter: 620,
    bulkPrice: 558,
    bulkMinQty: 100,
    moq: 20,
    stock: 900,
    colors: ["#3C3226", "#5A6B7A", "#111111", "#8A97A5", "#7A5B3E"],
    badge: "Premium",
    image: swatch("#6d7180, #454956"),
    material: "70% Wool / 30% Polyester",
    gsm: 280,
    width: "58 inches",
    weave: "Twill",
    finish: "Pressed",
    origin: "Italy",
    description:
      "A refined wool-blend suiting fabric with a structured drape and subtle sheen, tailored for formalwear.",
    features: ["Wrinkle Resistant", "Structured", "Premium Feel"],
  },
  {
    id: "silk-chiffon",
    name: "Silk Chiffon",
    category: "Silk",
    fabricType: "Woven",
    supplier: "Royal Silks",
    supplierRating: 4.8,
    supplierReviews: 88,
    pricePerMeter: 380,
    bulkPrice: 342,
    bulkMinQty: 150,
    moq: 30,
    stock: 1200,
    colors: ["#E8C9D0", "#D98A9A", "#F0E5D5"],
    image: swatch("#f4d9df, #e0aebb"),
    material: "100% Silk",
    gsm: 30,
    width: "44 inches",
    weave: "Chiffon",
    finish: "Sheer",
    origin: "China",
    description:
      "An airy, sheer silk chiffon with a delicate drape, favored for eveningwear overlays and scarves.",
    features: ["Sheer", "Lightweight", "Fluid Drape"],
  },
  {
    id: "jacquard-upholstery",
    name: "Jacquard Upholstery",
    category: "Polyester",
    fabricType: "Jacquard",
    supplier: "Welspun Home",
    supplierRating: 4.6,
    supplierReviews: 73,
    pricePerMeter: 310,
    bulkPrice: 279,
    bulkMinQty: 200,
    moq: 40,
    stock: 1650,
    colors: ["#7A5B3E", "#3C3226", "#8E9B7A", "#5A6B7A"],
    image: swatch("#a5895f, #7a6543"),
    material: "Polyester Jacquard",
    gsm: 420,
    width: "54 inches",
    weave: "Jacquard",
    finish: "Stain Resistant",
    origin: "India",
    description:
      "A richly patterned jacquard weave designed for durable upholstery and soft furnishings.",
    features: ["Stain Resistant", "Textured Pattern", "Heavy Duty"],
  },
  {
    id: "denim-selvedge",
    name: "Selvedge Denim",
    category: "Denim",
    fabricType: "Denim",
    supplier: "Jeans Co. Fabric",
    supplierRating: 4.9,
    supplierReviews: 140,
    pricePerMeter: 340,
    bulkPrice: 306,
    bulkMinQty: 250,
    moq: 40,
    stock: 1100,
    colors: ["#1B2A3C", "#111111", "#2E4A6B"],
    badge: "Premium",
    image: swatch("#25384f, #111c28"),
    material: "100% Cotton",
    gsm: 380,
    width: "31 inches",
    weave: "Selvedge Twill",
    finish: "Raw",
    origin: "Japan",
    description:
      "Loom-woven selvedge denim with deep indigo dye penetration, prized for premium raw-denim garments.",
    features: ["Loom Woven", "Deep Indigo", "Premium Feel"],
  },
];

export const categories = [
  { name: "Cotton", count: 2345, swatch: "#D9C8A5" },
  { name: "Linen", count: 1234, swatch: "#C9B98F" },
  { name: "Silk", count: 675, swatch: "#E0A8B4" },
  { name: "Polyester", count: 1987, swatch: "#9AA08A" },
  { name: "Denim", count: 342, swatch: "#33547A" },
  { name: "Wool", count: 512, swatch: "#B9B0A0" },
];

export const fabricTypes = ["Woven", "Knit", "Denim", "Jacquard", "Canvas"];

export const colorSwatches = [
  "#FFFFFF", "#EDE1CB", "#C8A97A", "#7A5B3E", "#8A1F2B", "#D98A9A",
  "#8A5FBF", "#2E5C8A", "#5FA3A0", "#8A97A5", "#3C3226", "#111111",
];

export const trustBrands = ["Raymond", "Arvind", "Myntra", "Bombay Dyeing", "Welspun", "Siyaram's", "Donear"];

export const stats = [
  { label: "Premium Fabrics", value: "10,000+" },
  { label: "Verified Suppliers", value: "2,000+" },
  { label: "Countries Covered", value: "50+" },
  { label: "Secure & Reliable", value: "100%" },
];

export const whyChooseUs = [
  { title: "AI-Powered Search", desc: "Find fabrics using natural language, images, or voice. Our AI understands your needs." },
  { title: "Verified Suppliers", desc: "Connect with trusted suppliers and manufacturers with verified business profiles." },
  { title: "Compare & Decide", desc: "Compare fabrics, prices, MOQ, and supplier ratings side by side to make the best choice." },
  { title: "Seamless Ordering", desc: "Add to cart, review, and place orders in a few clicks. Simple, fast, and transparent." },
];

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  products?: string[];
}

export const cannedExchanges: { trigger: string; reply: ChatMessage }[] = [
  {
    trigger: "breathable cotton",
    reply: {
      id: "r1",
      role: "ai",
      text: "Here are some breathable cotton fabrics perfect for summer shirts!",
      products: ["soft-cotton-voile", "cotton-linen-blend", "premium-cotton-poplin"],
    },
  },
  {
    trigger: "linen",
    reply: {
      id: "r2",
      role: "ai",
      text: "Comparing Linen Blend Fabric vs Cotton Linen Blend — the linen blend drapes looser and breathes better, while the cotton-linen blend is softer and more affordable at scale.",
      products: ["linen-blend-fabric", "cotton-linen-blend"],
    },
  },
  {
    trigger: "sustainable",
    reply: {
      id: "r3",
      role: "ai",
      text: "These sustainable picks are under ₹200/meter and carry eco-friendly certifications.",
      products: ["linen-blend-fabric", "organic-cotton-twill"],
    },
  },
  {
    trigger: "formal",
    reply: {
      id: "r4",
      role: "ai",
      text: "For formal office wear, these fabrics offer a structured, polished finish.",
      products: ["wool-blend-suiting", "premium-cotton-poplin"],
    },
  },
];

export const defaultReply: ChatMessage = {
  id: "default",
  role: "ai",
  text: "Here are a few fabrics from our catalog that might match what you're looking for. Want me to narrow it down by price, color, or MOQ?",
  products: ["premium-cotton-poplin", "linen-blend-fabric", "silk-satin-fabric", "denim-cotton-stretch"],
};

export const suggestedPrompts = [
  "Find breathable cotton fabrics for summer shirts",
  "Compare linen vs cotton fabrics",
  "Show sustainable fabrics under ₹200 per meter",
  "Recommend fabrics for formal office wear",
];

export const popularSearchTags = [
  "Cotton poplin", "Linen fabric", "Organic cotton", "Denim fabric", "Silk satin", "Wool blend", "Sustainable fabrics",
];

export const aiStats = [
  { label: "Fabrics in database", value: "10,000+" },
  { label: "Verified suppliers", value: "2,000+" },
  { label: "Countries covered", value: "50+" },
  { label: "AI Accuracy", value: "98%" },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

/**
 * Deterministic similarity score between two products, weighted toward the
 * attributes buyers actually shop by: category first, then material and
 * weave (a "match" is worth more than a "close"), and GSM as a proximity
 * score since it's numeric rather than exact-match.
 */
function similarityScore(a: Product, b: Product): number {
  let score = 0;
  if (a.category === b.category) score += 40;
  if (a.material === b.material) score += 22;
  if (a.weave === b.weave) score += 18;
  if (a.fabricType === b.fabricType) score += 8;
  const gsmDiff = Math.abs(a.gsm - b.gsm);
  score += Math.max(0, 12 - gsmDiff / 15); // closer GSM → up to 12 pts, decaying with distance
  return score;
}

export function similarProducts(id: string, count = 4) {
  const current = getProduct(id);
  if (!current) return [];
  return products
    .filter((p) => p.id !== id)
    .map((p) => ({ product: p, score: similarityScore(current, p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.product);
}

// ── Supplier inventory (mutable via store) ─────────────────────────────────

export type ProductStatus = "Available" | "Low Stock" | "Out of Stock";

export interface BulkPricingTier {
  minQty: number;
  maxQty: number;
  pricePerMeter: number;
}

export interface InventoryProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  fabricType: string;
  material: string;
  gsm: number;
  width: string;
  weave: string;
  finish: string;
  origin: string;
  pricePerMeter: number;
  moq: number;
  stock: number;
  colors: string[];
  description: string;
  image: string;
  bulkTiers: BulkPricingTier[];
  status: ProductStatus;
  addedOn: string; // display date
  addedTimestamp: number;
}

function stockStatus(stock: number): ProductStatus {
  if (stock <= 0) return "Out of Stock";
  if (stock < 100) return "Low Stock";
  return "Available";
}

const inventorySeed: Omit<InventoryProduct, "status">[] = [
  { id: "inv-1", sku: "WL-PCP-001", name: "Premium Cotton Poplin", category: "Cotton Fabrics", fabricType: "Woven", material: "100% Cotton", gsm: 120, width: "58/60 inches", weave: "Plain Poplin", finish: "Mercerized", origin: "India", pricePerMeter: 120, moq: 50, stock: 560, colors: ["#EDE1CB", "#C8A97A", "#3E4A3D"], description: "High-quality 100% cotton poplin, smooth and breathable — ideal for shirts and dresses.", image: swatch("#e9d8bd, #c9a577"), bulkTiers: [{ minQty: 50, maxQty: 199, pricePerMeter: 120 }, { minQty: 200, maxQty: 499, pricePerMeter: 115 }, { minQty: 500, maxQty: 9999, pricePerMeter: 108 }], addedOn: "28 May 2024, 10:30 AM", addedTimestamp: new Date("2024-05-28T10:30:00").getTime() },
  { id: "inv-2", sku: "WL-LBF-002", name: "Linen Blend Fabric", category: "Linen Fabrics", fabricType: "Woven", material: "55% Linen / 45% Cotton", gsm: 142, width: "56 inches", weave: "Plain Weave", finish: "Pre-Shrunk", origin: "India", pricePerMeter: 142, moq: 100, stock: 320, colors: ["#8E9B7A", "#3C4A6B", "#7A5B3E"], description: "Breathable linen-cotton blend with a relaxed drape, suited for warm-weather apparel.", image: swatch("#8b9a6d, #5f6e46"), bulkTiers: [{ minQty: 100, maxQty: 299, pricePerMeter: 142 }, { minQty: 300, maxQty: 9999, pricePerMeter: 128 }], addedOn: "27 May 2024, 04:15 PM", addedTimestamp: new Date("2024-05-27T16:15:00").getTime() },
  { id: "inv-3", sku: "WL-SSF-003", name: "Silk Satin Fabric", category: "Silk Fabrics", fabricType: "Woven", material: "100% Mulberry Silk", gsm: 95, width: "44 inches", weave: "Satin Weave", finish: "Lustrous", origin: "China", pricePerMeter: 215, moq: 25, stock: 150, colors: ["#D98A9A", "#8A1F2B", "#E8C9D0"], description: "Luxurious mulberry silk satin with a high-shine face, favored for eveningwear.", image: swatch("#e8b6c2, #c46e83"), bulkTiers: [{ minQty: 25, maxQty: 99, pricePerMeter: 215 }, { minQty: 100, maxQty: 9999, pricePerMeter: 195 }], addedOn: "26 May 2024, 11:20 AM", addedTimestamp: new Date("2024-05-26T11:20:00").getTime() },
  { id: "inv-4", sku: "WL-DCS-004", name: "Denim Cotton Stretch", category: "Denim Fabrics", fabricType: "Denim", material: "98% Cotton / 2% Elastane", gsm: 320, width: "60 inches", weave: "3x1 Twill", finish: "Enzyme Washed", origin: "India", pricePerMeter: 185, moq: 50, stock: 0, colors: ["#2E4A6B", "#1B2A3C", "#111111"], description: "Comfort-stretch denim with reliable recovery, engineered for modern fits.", image: swatch("#3c5c82, #21334a"), bulkTiers: [], addedOn: "24 May 2024, 09:30 AM", addedTimestamp: new Date("2024-05-24T09:30:00").getTime() },
  { id: "inv-5", sku: "WL-RSF-005", name: "Rayon Slub Fabric", category: "Rayon Fabrics", fabricType: "Woven", material: "100% Rayon", gsm: 110, width: "44 inches", weave: "Slub Weave", finish: "Soft Wash", origin: "India", pricePerMeter: 87, moq: 100, stock: 480, colors: ["#3C6B5E", "#8E9B7A", "#E8DFCB"], description: "Soft-draping rayon with a natural slub texture, popular for flowy summer garments.", image: swatch("#3f8f78, #2a5c4c"), bulkTiers: [{ minQty: 100, maxQty: 9999, pricePerMeter: 80 }], addedOn: "23 May 2024, 03:45 PM", addedTimestamp: new Date("2024-05-23T15:45:00").getTime() },
  { id: "inv-6", sku: "WL-PVB-006", name: "Polyester Viscose Blend", category: "Polyester Fabrics", fabricType: "Woven", material: "65% Polyester / 35% Viscose", gsm: 160, width: "58 inches", weave: "Plain Weave", finish: "Soft Wash", origin: "India", pricePerMeter: 95, moq: 100, stock: 220, colors: ["#B9B0A0", "#8A97A5", "#3C3226"], description: "A durable polyester-viscose blend with a soft hand feel, suited for uniforms and workwear.", image: swatch("#b9b0a0, #8a8478"), bulkTiers: [], addedOn: "22 May 2024, 01:10 PM", addedTimestamp: new Date("2024-05-22T13:10:00").getTime() },
  { id: "inv-7", sku: "WL-TSF-007", name: "Twill Suiting Fabric", category: "Suiting Fabrics", fabricType: "Woven", material: "70% Wool / 30% Polyester", gsm: 240, width: "58 inches", weave: "Twill", finish: "Pressed", origin: "Italy", pricePerMeter: 160, moq: 20, stock: 40, colors: ["#3C3226", "#5A6B7A", "#111111"], description: "A refined wool-blend suiting fabric with a structured drape, tailored for formalwear.", image: swatch("#6d7180, #454956"), bulkTiers: [{ minQty: 20, maxQty: 99, pricePerMeter: 160 }, { minQty: 100, maxQty: 9999, pricePerMeter: 144 }], addedOn: "20 May 2024, 11:05 AM", addedTimestamp: new Date("2024-05-20T11:05:00").getTime() },
  { id: "inv-8", sku: "WL-OCT-008", name: "Organic Cotton Twill", category: "Cotton Fabrics", fabricType: "Woven", material: "100% GOTS Organic Cotton", gsm: 240, width: "58 inches", weave: "2x1 Twill", finish: "Natural", origin: "India", pricePerMeter: 135, moq: 60, stock: 290, colors: ["#5F6E46", "#8E9B7A", "#111111"], description: "GOTS-certified organic cotton twill with a durable diagonal weave.", image: swatch("#7c8f5c, #52603a"), bulkTiers: [{ minQty: 60, maxQty: 349, pricePerMeter: 135 }, { minQty: 350, maxQty: 9999, pricePerMeter: 121 }], addedOn: "19 May 2024, 02:00 PM", addedTimestamp: new Date("2024-05-19T14:00:00").getTime() },
  { id: "inv-9", sku: "WL-SCV-009", name: "Soft Cotton Voile", category: "Cotton Fabrics", fabricType: "Woven", material: "100% Cotton", gsm: 60, width: "44 inches", weave: "Voile", finish: "Soft Wash", origin: "India", pricePerMeter: 110, moq: 100, stock: 380, colors: ["#F0E5D5", "#D98A9A", "#8AA5C9"], description: "A featherlight, semi-sheer cotton voile ideal for layered summer garments.", image: swatch("#f1c7d3, #dba0b3"), bulkTiers: [], addedOn: "18 May 2024, 09:15 AM", addedTimestamp: new Date("2024-05-18T09:15:00").getTime() },
  { id: "inv-10", sku: "WL-JUP-010", name: "Jacquard Upholstery", category: "Polyester Fabrics", fabricType: "Jacquard", material: "Polyester Jacquard", gsm: 420, width: "54 inches", weave: "Jacquard", finish: "Stain Resistant", origin: "India", pricePerMeter: 310, moq: 40, stock: 165, colors: ["#7A5B3E", "#3C3226", "#8E9B7A"], description: "A richly patterned jacquard weave designed for durable upholstery and soft furnishings.", image: swatch("#a5895f, #7a6543"), bulkTiers: [{ minQty: 40, maxQty: 199, pricePerMeter: 310 }, { minQty: 200, maxQty: 9999, pricePerMeter: 279 }], addedOn: "17 May 2024, 03:30 PM", addedTimestamp: new Date("2024-05-17T15:30:00").getTime() },
  { id: "inv-11", sku: "WL-SDN-011", name: "Selvedge Denim", category: "Denim Fabrics", fabricType: "Denim", material: "100% Cotton", gsm: 380, width: "31 inches", weave: "Selvedge Twill", finish: "Raw", origin: "Japan", pricePerMeter: 340, moq: 40, stock: 110, colors: ["#1B2A3C", "#111111", "#2E4A6B"], description: "Loom-woven selvedge denim with deep indigo dye penetration.", image: swatch("#25384f, #111c28"), bulkTiers: [], addedOn: "16 May 2024, 10:00 AM", addedTimestamp: new Date("2024-05-16T10:00:00").getTime() },
  { id: "inv-12", sku: "WL-SCH-012", name: "Silk Chiffon", category: "Silk Fabrics", fabricType: "Woven", material: "100% Silk", gsm: 30, width: "44 inches", weave: "Chiffon", finish: "Sheer", origin: "China", pricePerMeter: 380, moq: 30, stock: 120, colors: ["#E8C9D0", "#D98A9A", "#F0E5D5"], description: "An airy, sheer silk chiffon with a delicate drape, favored for eveningwear overlays.", image: swatch("#f4d9df, #e0aebb"), bulkTiers: [{ minQty: 30, maxQty: 149, pricePerMeter: 380 }, { minQty: 150, maxQty: 9999, pricePerMeter: 342 }], addedOn: "15 May 2024, 01:45 PM", addedTimestamp: new Date("2024-05-15T13:45:00").getTime() },
  { id: "inv-13", sku: "WL-WBS-013", name: "Wool Blend Suiting", category: "Suiting Fabrics", fabricType: "Woven", material: "70% Wool / 30% Polyester", gsm: 280, width: "58 inches", weave: "Twill", finish: "Pressed", origin: "Italy", pricePerMeter: 620, moq: 20, stock: 90, colors: ["#3C3226", "#5A6B7A", "#7A5B3E"], description: "A refined wool-blend suiting fabric with a structured drape and subtle sheen.", image: swatch("#6d7180, #454956"), bulkTiers: [], addedOn: "14 May 2024, 04:20 PM", addedTimestamp: new Date("2024-05-14T16:20:00").getTime() },
  { id: "inv-14", sku: "WL-PCB-014", name: "Poly Canvas Heavy", category: "Polyester Fabrics", fabricType: "Canvas", material: "100% Polyester", gsm: 340, width: "60 inches", weave: "Canvas", finish: "Water Resistant", origin: "China", pricePerMeter: 95, moq: 100, stock: 610, colors: ["#3C3226", "#5A6B7A", "#111111"], description: "A heavyweight polyester canvas with a durable water-resistant finish.", image: swatch("#7c8291, #545a68"), bulkTiers: [], addedOn: "13 May 2024, 11:10 AM", addedTimestamp: new Date("2024-05-13T11:10:00").getTime() },
  { id: "inv-15", sku: "WL-CLB-015", name: "Cotton Linen Blend", category: "Cotton Fabrics", fabricType: "Woven", material: "70% Cotton / 30% Linen", gsm: 145, width: "58 inches", weave: "Plain Weave", finish: "Soft Wash", origin: "India", pricePerMeter: 150, moq: 75, stock: 60, colors: ["#E8D8C0", "#C9A97A", "#7A5B3E"], description: "A balanced cotton-linen blend combining linen's texture with cotton's softness.", image: swatch("#e6d5bb, #cdb187"), bulkTiers: [], addedOn: "12 May 2024, 09:50 AM", addedTimestamp: new Date("2024-05-12T09:50:00").getTime() },
  { id: "inv-16", sku: "WL-DTF-016", name: "Dobby Textured Fabric", category: "Cotton Fabrics", fabricType: "Woven", material: "100% Cotton", gsm: 130, width: "58 inches", weave: "Dobby Weave", finish: "Off White", origin: "India", pricePerMeter: 89, moq: 60, stock: 245, colors: ["#F0E5D5", "#C8A97A", "#8E9B7A"], description: "A textured dobby-weave cotton fabric with subtle geometric detailing.", image: swatch("#efe6d3, #d3c39f"), bulkTiers: [], addedOn: "11 May 2024, 02:30 PM", addedTimestamp: new Date("2024-05-11T14:30:00").getTime() },
];

export const supplierProductsSeed: InventoryProduct[] = inventorySeed.map((p) => ({
  ...p,
  status: stockStatus(p.stock),
}));

export const inventoryCategories = Array.from(new Set(supplierProductsSeed.map((p) => p.category)));


// ── Account / Dashboard mock data ──────────────────────────────────────────

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Accepted"
  | "Preparing"
  | "Processing"
  | "In Transit"
  | "Ready for Dispatch"
  | "Delivered"
  | "Completed"
  | "Cancelled"
  | "Returned";

export interface OrderLineItem {
  productId: string;
  quantity: number;
  pricePerMeter: number;
}

export interface OrderActivityEntry {
  id: string;
  text: string;
  time: string;
}

export interface Order {
  id: string;
  date: string; // display date
  timestamp: number; // for sorting
  supplier: string;
  supplierVerified: boolean;
  location: string;
  items: OrderLineItem[];
  amount: number;
  status: OrderStatus;
  deliveryDate: string;
  paymentMethod: string;
  // Buyer-facing detail (populated for orders shown on the supplier's Order Details page)
  buyerCompany?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerVerified?: boolean;
  shippingAddress?: string;
  billingAddress?: string;
  gstin?: string;
  orderNotes?: string;
  paymentStatus?: "Paid" | "Pending" | "Failed";
  activityLog?: OrderActivityEntry[];
}

function orderTotal(items: OrderLineItem[]) {
  return items.reduce((sum, i) => sum + i.pricePerMeter * i.quantity, 0);
}

const wl7821Items: OrderLineItem[] = [
  { productId: "premium-cotton-poplin", quantity: 100, pricePerMeter: 120 },
  { productId: "linen-blend-fabric", quantity: 50, pricePerMeter: 180 },
];

export const orders: Order[] = [
  {
    id: "WL-7821",
    date: "28 May 2024, 10:42 AM",
    timestamp: new Date("2024-05-28T10:42:00").getTime(),
    supplier: "Shiv Textiles",
    supplierVerified: true,
    location: "Surat, Gujarat",
    items: wl7821Items,
    amount: orderTotal(wl7821Items),
    status: "Delivered",
    deliveryDate: "31 May 2024",
    paymentMethod: "Visa •••• 4242",
    buyerCompany: "Shree Fabrics Pvt. Ltd.",
    buyerEmail: "purchase@shreefabrics.com",
    buyerPhone: "+91 98765 43210",
    buyerVerified: true,
    shippingAddress: "Warehouse No. 12, Udhna Industrial Area, Udhna, Surat - 394210, Gujarat, India",
    billingAddress: "Warehouse No. 12, Udhna Industrial Area, Udhna, Surat - 394210, Gujarat, India",
    gstin: "24AABCS1234D1Z5",
    orderNotes: "Please ensure the fabric is packed properly and labels are attached.",
    paymentStatus: "Paid",
  },
  {
    id: "WL-7815",
    date: "27 May 2024, 04:15 PM",
    timestamp: new Date("2024-05-27T16:15:00").getTime(),
    supplier: "Naman Exports",
    supplierVerified: true,
    location: "Surat, Gujarat",
    items: [
      { productId: "cotton-linen-blend", quantity: 200, pricePerMeter: 150 },
      { productId: "soft-cotton-voile", quantity: 100, pricePerMeter: 110 },
      { productId: "linen-blend-fabric", quantity: 100, pricePerMeter: 180 },
    ],
    amount: 85000,
    status: "In Transit",
    deliveryDate: "30 May 2024",
    paymentMethod: "Visa •••• 4242",
    buyerCompany: "Textile Hub Pvt. Ltd.",
    buyerEmail: "orders@textilehub.in",
    buyerPhone: "+91 91234 56780",
    buyerVerified: true,
    shippingAddress: "12 Anna Salai, Mumbai - 400001, Maharashtra, India",
    billingAddress: "12 Anna Salai, Mumbai - 400001, Maharashtra, India",
    gstin: "27AATHT5678E1Z2",
    paymentStatus: "Paid",
  },
  {
    id: "WL-7803",
    date: "26 May 2024, 11:20 AM",
    timestamp: new Date("2024-05-26T11:20:00").getTime(),
    supplier: "Royal Silks",
    supplierVerified: true,
    location: "Mumbai, Maharashtra",
    items: [
      { productId: "silk-satin-fabric", quantity: 200, pricePerMeter: 450 },
      { productId: "silk-chiffon", quantity: 150, pricePerMeter: 380 },
    ],
    amount: 148500,
    status: "Processing",
    deliveryDate: "29 May 2024",
    paymentMethod: "Visa •••• 4242",
    buyerCompany: "Fabindia Exports",
    buyerEmail: "procurement@fabindiaexports.com",
    buyerPhone: "+91 98220 11223",
    buyerVerified: true,
    shippingAddress: "Plot 45, Whitefield Industrial Area, Bengaluru - 560066, Karnataka, India",
    billingAddress: "Plot 45, Whitefield Industrial Area, Bengaluru - 560066, Karnataka, India",
    gstin: "29AAFEX9012F1Z8",
    orderNotes: "Kindly double-check GSM before dispatch.",
    paymentStatus: "Paid",
  },
  {
    id: "WL-7790a",
    date: "24 May 2024, 09:30 AM",
    timestamp: new Date("2024-05-24T09:30:00").getTime(),
    supplier: "GreenWeave Fabrics",
    supplierVerified: true,
    location: "Bangalore, Karnataka",
    items: [{ productId: "organic-cotton-twill", quantity: 240, pricePerMeter: 135 }],
    amount: 32000,
    status: "Confirmed",
    deliveryDate: "28 May 2024",
    paymentMethod: "Visa •••• 4242",
    buyerCompany: "Global Textiles",
  buyerEmail: "hello@globaltextiles.in",
  buyerPhone: "+91 98110 33445",
  buyerVerified: false,
  shippingAddress: "B-14 Okhla Industrial Estate, Delhi - 110020, Delhi, India",
  billingAddress: "B-14 Okhla Industrial Estate, Delhi - 110020, Delhi, India",
  gstin: "07AAGTL3456G1Z4",
  paymentStatus: "Pending",
  },
  {
    id: "WL-7782",
    date: "23 May 2024, 03:45 PM",
    timestamp: new Date("2024-05-23T15:45:00").getTime(),
    supplier: "Cotton House",
    supplierVerified: true,
    location: "Coimbatore, Tamil Nadu",
    items: [{ productId: "soft-cotton-voile", quantity: 400, pricePerMeter: 110 }],
    amount: 45750,
    status: "Delivered",
    deliveryDate: "27 May 2024",
    paymentMethod: "UPI",
    buyerCompany: "S. K. Traders",
    buyerEmail: "sktraders@gmail.com",
    buyerPhone: "+91 90330 44556",
    buyerVerified: true,
    shippingAddress: "22 Park Street, Kolkata - 700016, West Bengal, India",
    billingAddress: "22 Park Street, Kolkata - 700016, West Bengal, India",
    gstin: "19AASKT7890H1Z6",
    paymentStatus: "Paid",
  },
  {
    id: "WL-7771",
    date: "22 May 2024, 01:10 PM",
    timestamp: new Date("2024-05-22T13:10:00").getTime(),
    supplier: "Fabric World",
    supplierVerified: true,
    location: "Surat, Gujarat",
    items: [{ productId: "polyester-canvas", quantity: 1200, pricePerMeter: 95 }],
    amount: 122300,
    status: "Cancelled",
    deliveryDate: "—",
    paymentMethod: "Visa •••• 4242",buyerCompany: "Apex Fabrics",
    buyerEmail: "accounts@apexfabrics.in",
    buyerPhone: "+91 89990 55667",
    buyerVerified: true,
    shippingAddress: "8 Anna Nagar, Chennai - 600040, Tamil Nadu, India",
    billingAddress: "8 Anna Nagar, Chennai - 600040, Tamil Nadu, India",
    gstin: "33AAAPX2345I1Z1",
    orderNotes: "Order cancelled by buyer request.",
    paymentStatus: "Failed",
  },
  {
    id: "WL-7790b",
    date: "20 May 2024, 11:05 AM",
    timestamp: new Date("2024-05-20T11:05:00").getTime(),
    supplier: "Linen Craft",
    supplierVerified: true,
    location: "Ahmedabad, Gujarat",
    items: [
      { productId: "linen-blend-fabric", quantity: 200, pricePerMeter: 180 },
      { productId: "cotton-linen-blend", quantity: 220, pricePerMeter: 150 },
    ],
    amount: 68400,
    status: "In Transit",
    deliveryDate: "24 May 2024",
    paymentMethod: "Net Banking",
    buyerCompany: "Naman Textiles",
    buyerEmail: "naman.textiles@gmail.com",
    buyerPhone: "+91 97440 66778",
    buyerVerified: true,
    shippingAddress: "5 Ring Road, Ahmedabad - 380009, Gujarat, India",
    billingAddress: "5 Ring Road, Ahmedabad - 380009, Gujarat, India",
    gstin: "24AANTX6789J1Z3",
    paymentStatus: "Paid",
  },
  {
    id: "WL-7750",
    date: "18 May 2024, 05:20 PM",
    timestamp: new Date("2024-05-18T17:20:00").getTime(),
    supplier: "Shiv Textiles",
    supplierVerified: true,
    location: "Surat, Gujarat",
    items: [
      { productId: "premium-cotton-poplin", quantity: 500, pricePerMeter: 108 },
      { productId: "denim-cotton-stretch", quantity: 100, pricePerMeter: 220 },
    ],
    amount: 92600,
    status: "Delivered",
    deliveryDate: "22 May 2024",
    paymentMethod: "Visa •••• 4242",
    buyerCompany: "Shree Fabrics Pvt. Ltd.",
    buyerEmail: "purchase@shreefabrics.com",
    buyerPhone: "+91 98765 43210",
    buyerVerified: true,
    shippingAddress: "Warehouse No. 12, Udhna Industrial Area, Udhna, Surat - 394210, Gujarat, India",
    billingAddress: "Warehouse No. 12, Udhna Industrial Area, Udhna, Surat - 394210, Gujarat, India",
    gstin: "24AABCS1234D1Z5",
    paymentStatus: "Paid",
  },
  {
    id: "WL-7742",
    date: "17 May 2024, 09:00 AM",
    timestamp: new Date("2024-05-17T09:00:00").getTime(),
    supplier: "Naman Exports",
    supplierVerified: true,
    location: "Surat, Gujarat",
    items: [{ productId: "cotton-linen-blend", quantity: 200, pricePerMeter: 140 }],
    amount: 28000,
    status: "Processing",
    deliveryDate: "21 May 2024",
    paymentMethod: "UPI",
    buyerCompany: "Textile Hub Pvt. Ltd.",
    buyerEmail: "orders@textilehub.in",
    buyerPhone: "+91 91234 56780",
    buyerVerified: true,
    shippingAddress: "12 Anna Salai, Mumbai - 400001, Maharashtra, India",
    billingAddress: "12 Anna Salai, Mumbai - 400001, Maharashtra, India",
    gstin: "27AATHT5678E1Z2",
    paymentStatus: "Pending",
  },
  {
    id: "WL-7730",
    date: "15 May 2024, 12:30 PM",
    timestamp: new Date("2024-05-15T12:30:00").getTime(),
    supplier: "Foyal Silks",
    supplierVerified: true,
    location: "Mumbai, Maharashtra",
    items: [
      { productId: "silk-satin-fabric", quantity: 150, pricePerMeter: 450 },
      { productId: "silk-chiffon", quantity: 100, pricePerMeter: 380 },
    ],
    amount: 105000,
    status: "Confirmed",
    deliveryDate: "18 May 2024",
    paymentMethod: "Visa •••• 4242",
    buyerCompany: "Fabindia Exports",
    buyerEmail: "procurement@fabindiaexports.com",
    buyerPhone: "+91 98220 11223",
    buyerVerified: true,
    shippingAddress: "Plot 45, Whitefield Industrial Area, Bengaluru - 560066, Karnataka, India",
    billingAddress: "Plot 45, Whitefield Industrial Area, Bengaluru - 560066, Karnataka, India",
    gstin: "29AAFEX9012F1Z8",
    paymentStatus: "Paid",
  },
];

export const spendByCategory = [
  { name: "Cotton Fabrics", value: 245000, color: "#7A5B3E" },
  { name: "Linen Fabrics", value: 158000, color: "#3D6B4A" },
  { name: "Synthetic Fabrics", value: 112000, color: "#5A4A8A" },
  { name: "Blended Fabrics", value: 78500, color: "#D9A441" },
  { name: "Others", value: 54750, color: "#B9B0A0" },
];

export const spendingOverTime = [
  { day: "May 22", value: 38000 },
  { day: "May 23", value: 96000 },
  { day: "May 24", value: 52000 },
  { day: "May 25", value: 118000 },
  { day: "May 26", value: 168000 },
  { day: "May 27", value: 95000 },
  { day: "May 28", value: 172000 },
];

export const topSuppliers = [
  { name: "Shiv Textiles", verified: true, spend: 245000, change: 18.2 },
  { name: "Naman Exports", verified: true, spend: 172500, change: 12.6 },
  { name: "Royal Silks", verified: true, spend: 98750, change: 8.7 },
  { name: "Jeans Co. Fabric", verified: true, spend: 76000, change: -3.4 },
  { name: "GreenWeave Fabrics", verified: true, spend: 56000, change: 6.1 },
];

export interface ActivityItem {
  id: string;
  icon: "order" | "shipment" | "quote" | "wishlist";
  title: string;
  detail: string;
  time: string;
}

export const recentActivity: ActivityItem[] = [
  { id: "a1", icon: "order", title: "Order #WL-7821 confirmed", detail: "Shiv Textiles · ₹1,25,000", time: "2h ago" },
  { id: "a2", icon: "shipment", title: "Order #WL-7815 shipped", detail: "Naman Exports · ₹85,000", time: "5h ago" },
  { id: "a3", icon: "quote", title: "New quote received", detail: "Royal Silks · ₹1,48,500", time: "1d ago" },
  { id: "a4", icon: "wishlist", title: "Item added to favorites", detail: "Linen Blend Fabric", time: "1d ago" },
];

// ── Supplier AI Restock Recommendations (rule-based mock, not a live AI call) ─

export type RestockPriority = "High" | "Medium" | "Low";
export type RestockTag = "Fast Moving" | "Seasonal" | "Standard";

export interface RestockRecommendation {
  id: string;
  productId: string; // references products[].id
  reason: string; // "Why Restock?"
  suggestedQty: number; // in meters
  profitImpact: number; // ₹ estimated
  priority: RestockPriority;
  tag: RestockTag;
}

export const restockRecommendations: RestockRecommendation[] = [
  {
    id: "rr-1",
    productId: "premium-cotton-poplin",
    reason: "Stock is projected to run out in 8 days at the current sell-through rate.",
    suggestedQty: 500,
    profitImpact: 45000,
    priority: "High",
    tag: "Fast Moving",
  },
  {
    id: "rr-2",
    productId: "denim-cotton-stretch",
    reason: "Sell-through rate is up 65% over the last 30 days across repeat buyers.",
    suggestedQty: 400,
    profitImpact: 52000,
    priority: "High",
    tag: "Fast Moving",
  },
  {
    id: "rr-3",
    productId: "wool-blend-suiting",
    reason: "Winter formalwear orders typically peak next month — get ahead of demand.",
    suggestedQty: 120,
    profitImpact: 35000,
    priority: "High",
    tag: "Seasonal",
  },
  {
    id: "rr-4",
    productId: "linen-blend-fabric",
    reason: "Demand for breathable summer fabrics typically rises 40% next season.",
    suggestedQty: 300,
    profitImpact: 28000,
    priority: "Medium",
    tag: "Seasonal",
  },
  {
    id: "rr-5",
    productId: "organic-cotton-twill",
    reason: "Reordered by 12 repeat buyers this month — consistent, dependable demand.",
    suggestedQty: 250,
    profitImpact: 22000,
    priority: "Medium",
    tag: "Fast Moving",
  },
  {
    id: "rr-6",
    productId: "silk-chiffon",
    reason: "Wedding-season bookings are trending up for lightweight silk overlays.",
    suggestedQty: 150,
    profitImpact: 18500,
    priority: "Low",
    tag: "Seasonal",
  },
  {
    id: "rr-7",
    productId: "jacquard-upholstery",
    reason: "Stable demand with a healthy margin — safe, low-risk top-up.",
    suggestedQty: 100,
    profitImpact: 15000,
    priority: "Low",
    tag: "Standard",
  },
];

// ── Wishlist "You may also like" extras ─────────────────────────────────────

export const alsoLikeProducts = [
  { name: "Soft Linen Fabric", spec: "130 GSM · Plain Weave", price: 8500, unit: "50 meter", image: swatch("#e6d5bb, #cdb187") },
  { name: "Chambray Fabric", spec: "150 GSM · Plain Weave", price: 7800, unit: "100 meter", image: swatch("#8fa3c0, #5c6f8f") },
  { name: "Viscose Crepe Fabric", spec: "115 GSM · Crepe Weave", price: 9100, unit: "50 meter", image: swatch("#e8d8c0, #c9a97a") },
];

// ── Addresses (shared shape with checkout) ─────────────────────────────────

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export const defaultAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Head Office",
    name: "Arjun Mehta",
    phone: "+91 98765 43210",
    street: "42, Industrial Area",
    city: "Surat",
    state: "Gujarat",
    pincode: "395003",
    isDefault: true,
  },
];

// ── Suppliers Directory ──────────────────────────────────────────────────────

export interface Supplier {
  id: string;
  name: string;
  businessType: string;
  categories: string[];
  fabricTypes: string[];
  city: string;
  state: string;
  country: string;
  description: string;
  rating: number;
  reviewCount: number;
  moq: number;
  responseHours: number;
  verified: boolean;
  joinedOn: string;
  joinedTimestamp: number;
}

export const suppliers: Supplier[] = [
  { id: "arjun-textiles", name: "Arjun Textiles", businessType: "Manufacturer", categories: ["Cotton", "Linen", "Blended Fabrics"], fabricTypes: ["Woven"], city: "Surat", state: "Gujarat", country: "India", description: "Manufacturer of premium cotton, linen and blended fabrics.", rating: 4.8, reviewCount: 128, moq: 50, responseHours: 12, verified: true, joinedOn: "15 Feb 2024", joinedTimestamp: new Date("2024-02-15").getTime() },
  { id: "shree-fabrics", name: "Shree Fabrics Pvt. Ltd.", businessType: "Manufacturer", categories: ["Knitted", "Dyed", "Cotton"], fabricTypes: ["Knit", "Woven"], city: "Ahmedabad", state: "Gujarat", country: "India", description: "Specialized in knitted and dyed fabrics for fashion and apparel.", rating: 4.7, reviewCount: 98, moq: 100, responseHours: 24, verified: true, joinedOn: "3 Jan 2024", joinedTimestamp: new Date("2024-01-03").getTime() },
  { id: "texmart-exports", name: "Texmart Exports", businessType: "Exporter", categories: ["Silk", "Satin", "Luxury Fabrics"], fabricTypes: ["Woven"], city: "Mumbai", state: "Maharashtra", country: "India", description: "Exporter of silk, satin and luxury fabrics to 25+ countries.", rating: 4.6, reviewCount: 78, moq: 25, responseHours: 18, verified: true, joinedOn: "22 Nov 2023", joinedTimestamp: new Date("2023-11-22").getTime() },
  { id: "global-textiles", name: "Global Textiles", businessType: "Manufacturer", categories: ["Woven", "Polyester", "Uniform Fabrics"], fabricTypes: ["Woven", "Canvas"], city: "Delhi", state: "Delhi", country: "India", description: "Wide range of woven fabrics for uniforms, home textiles & more.", rating: 4.5, reviewCount: 84, moq: 100, responseHours: 24, verified: true, joinedOn: "8 Oct 2023", joinedTimestamp: new Date("2023-10-08").getTime() },
  { id: "fabindia-exports", name: "Fabindia Exports", businessType: "Manufacturer", categories: ["Organic Cotton", "Linen", "Sustainable"], fabricTypes: ["Woven"], city: "Bengaluru", state: "Karnataka", country: "India", description: "Sustainable and organic fabrics for conscious brands.", rating: 4.6, reviewCount: 52, moq: 50, responseHours: 36, verified: true, joinedOn: "19 Sep 2023", joinedTimestamp: new Date("2023-09-19").getTime() },
  { id: "nexus-textiles", name: "Nexus Textiles", businessType: "Manufacturer", categories: ["Activewear", "Polyester", "Performance"], fabricTypes: ["Knit"], city: "Tirupur", state: "Tamil Nadu", country: "India", description: "Performance fabrics and activewear textiles manufacturer.", rating: 4.4, reviewCount: 41, moq: 200, responseHours: 48, verified: true, joinedOn: "4 Aug 2023", joinedTimestamp: new Date("2023-08-04").getTime() },
  { id: "kk-textiles", name: "KK Textiles", businessType: "Manufacturer", categories: ["Cotton", "Denim"], fabricTypes: ["Woven", "Denim"], city: "Surat", state: "Gujarat", country: "India", description: "Cotton and denim fabric manufacturer serving apparel exporters.", rating: 4.6, reviewCount: 63, moq: 100, responseHours: 24, verified: true, joinedOn: "12 Jun 2024", joinedTimestamp: new Date("2024-06-12").getTime() },
  { id: "omkar-fab", name: "Omkar Fab", businessType: "Manufacturer", categories: ["Block Print", "Cotton"], fabricTypes: ["Woven"], city: "Jaipur", state: "Rajasthan", country: "India", description: "Hand block-printed cotton fabrics with traditional Rajasthani motifs.", rating: 4.5, reviewCount: 39, moq: 50, responseHours: 30, verified: true, joinedOn: "5 Jun 2024", joinedTimestamp: new Date("2024-06-05").getTime() },
  { id: "sara-weaves", name: "Sara Weaves", businessType: "Manufacturer", categories: ["Handloom", "Cotton"], fabricTypes: ["Woven"], city: "Coimbatore", state: "Tamil Nadu", country: "India", description: "Handloom cotton fabrics woven by traditional artisan clusters.", rating: 4.7, reviewCount: 55, moq: 60, responseHours: 20, verified: true, joinedOn: "28 May 2024", joinedTimestamp: new Date("2024-05-28").getTime() },
  { id: "shiv-textiles", name: "Shiv Textiles", businessType: "Manufacturer", categories: ["Cotton", "Denim", "Poplin"], fabricTypes: ["Woven", "Denim"], city: "Surat", state: "Gujarat", country: "India", description: "Manufacturer of cotton poplin and denim fabrics for domestic and export markets.", rating: 4.8, reviewCount: 124, moq: 50, responseHours: 12, verified: true, joinedOn: "10 Mar 2023", joinedTimestamp: new Date("2023-03-10").getTime() },
  { id: "naman-exports", name: "Naman Exports", businessType: "Exporter", categories: ["Linen", "Cotton Blend"], fabricTypes: ["Woven"], city: "Surat", state: "Gujarat", country: "India", description: "Exporter of linen and cotton-blend fabrics with in-house dyeing facilities.", rating: 4.7, reviewCount: 98, moq: 100, responseHours: 24, verified: true, joinedOn: "2 Feb 2023", joinedTimestamp: new Date("2023-02-02").getTime() },
  { id: "royal-silks", name: "Royal Silks", businessType: "Manufacturer", categories: ["Silk", "Satin", "Chiffon"], fabricTypes: ["Woven"], city: "Mumbai", state: "Maharashtra", country: "India", description: "Premium silk, satin and chiffon fabrics for eveningwear and bridal segments.", rating: 4.9, reviewCount: 156, moq: 25, responseHours: 16, verified: true, joinedOn: "18 Dec 2022", joinedTimestamp: new Date("2022-12-18").getTime() },
  { id: "jeans-co-fabric", name: "Jeans Co. Fabric", businessType: "Manufacturer", categories: ["Denim"], fabricTypes: ["Denim"], city: "Ahmedabad", state: "Gujarat", country: "India", description: "Dedicated denim mill producing stretch and selvedge denim fabrics.", rating: 4.9, reviewCount: 140, moq: 40, responseHours: 24, verified: true, joinedOn: "30 Jan 2023", joinedTimestamp: new Date("2023-01-30").getTime() },
  { id: "greenweave-fabrics", name: "GreenWeave Fabrics", businessType: "Manufacturer", categories: ["Organic Cotton", "Eco Friendly"], fabricTypes: ["Woven"], city: "Bengaluru", state: "Karnataka", country: "India", description: "GOTS-certified organic cotton fabrics for sustainability-focused brands.", rating: 4.8, reviewCount: 112, moq: 60, responseHours: 30, verified: true, joinedOn: "14 Apr 2023", joinedTimestamp: new Date("2023-04-14").getTime() },
  { id: "bombay-weaves", name: "Bombay Weaves", businessType: "Trading Co.", categories: ["Polyester", "Canvas"], fabricTypes: ["Canvas", "Woven"], city: "Mumbai", state: "Maharashtra", country: "India", description: "Trading house for heavyweight polyester canvas and technical fabrics.", rating: 4.5, reviewCount: 54, moq: 100, responseHours: 24, verified: false, joinedOn: "9 Jul 2023", joinedTimestamp: new Date("2023-07-09").getTime() },
  { id: "raymond-mills", name: "Raymond Mills", businessType: "Manufacturer", categories: ["Wool", "Suiting"], fabricTypes: ["Woven"], city: "Thane", state: "Maharashtra", country: "India", description: "Established wool and wool-blend suiting mill for formalwear brands.", rating: 4.9, reviewCount: 201, moq: 20, responseHours: 48, verified: true, joinedOn: "6 Jun 2022", joinedTimestamp: new Date("2022-06-06").getTime() },
  { id: "welspun-home", name: "Welspun Home", businessType: "Manufacturer", categories: ["Jacquard", "Home Textiles"], fabricTypes: ["Jacquard"], city: "Anjar", state: "Gujarat", country: "India", description: "Jacquard and home-textile weaving specialist for upholstery fabrics.", rating: 4.6, reviewCount: 73, moq: 40, responseHours: 24, verified: true, joinedOn: "21 Sep 2022", joinedTimestamp: new Date("2022-09-21").getTime() },
  { id: "cotton-house", name: "Cotton House", businessType: "Manufacturer", categories: ["Cotton", "Voile"], fabricTypes: ["Woven"], city: "Coimbatore", state: "Tamil Nadu", country: "India", description: "Lightweight cotton voile and shirting fabric manufacturer.", rating: 4.6, reviewCount: 67, moq: 100, responseHours: 24, verified: true, joinedOn: "11 Nov 2022", joinedTimestamp: new Date("2022-11-11").getTime() },
  { id: "fabric-world", name: "Fabric World", businessType: "Trading Co.", categories: ["Polyester", "Multi-Fabric"], fabricTypes: ["Woven", "Canvas"], city: "Surat", state: "Gujarat", country: "India", description: "Multi-category fabric trading house sourcing from mills across India.", rating: 4.4, reviewCount: 45, moq: 100, responseHours: 36, verified: false, joinedOn: "27 Aug 2023", joinedTimestamp: new Date("2023-08-27").getTime() },
  { id: "linen-craft", name: "Linen Craft", businessType: "Manufacturer", categories: ["Linen", "Cotton Linen Blend"], fabricTypes: ["Woven"], city: "Ahmedabad", state: "Gujarat", country: "India", description: "Linen and cotton-linen blend fabric mill for warm-weather apparel.", rating: 4.7, reviewCount: 61, moq: 100, responseHours: 24, verified: true, joinedOn: "3 May 2023", joinedTimestamp: new Date("2023-05-03").getTime() },
];

export function getSupplier(id: string) {
  return suppliers.find((s) => s.id === id);
}

export function formatResponseTime(hours: number) {
  if (hours < 24) return `≤ ${hours} hrs`;
  const days = Math.round(hours / 24);
  return `≤ ${days} day${days > 1 ? "s" : ""}`;
}

export function supplierProducts(supplierName: string) {
  return products.filter((p) => p.supplier === supplierName);
}