import db from "./db";
import { supplierProductsSeed, products as marketplaceProducts } from "./mockData";

// Runs once per server process (guarded by module-level flag + a row-count
// check, so it's also safe if the module happens to get re-evaluated).
let hasSeeded = false;

export function seedIfEmpty() {
  if (hasSeeded) return;
  hasSeeded = true;

  const { count } = db.prepare("SELECT COUNT(*) as count FROM products").get() as {
    count: number;
  };
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO products
      (id, sku, name, category, fabricType, material, gsm, width, weave, finish, origin,
       pricePerMeter, moq, stock, colors, description, image, bulkTiers, status, addedOn,
       addedTimestamp, source, extra)
    VALUES
      (@id, @sku, @name, @category, @fabricType, @material, @gsm, @width, @weave, @finish, @origin,
       @pricePerMeter, @moq, @stock, @colors, @description, @image, @bulkTiers, @status, @addedOn,
       @addedTimestamp, @source, @extra)
  `);

  const insertAll = db.transaction(() => {
    // Supplier inventory rows — the shape read/written by the store's
    // addProduct/updateProduct/deleteProduct actions.
    for (const p of supplierProductsSeed) {
      insert.run({
        ...p,
        colors: JSON.stringify(p.colors),
        bulkTiers: JSON.stringify(p.bulkTiers),
        source: "inventory",
        extra: null,
      });
    }

    // Public marketplace catalog — seeded for parity with mockData.ts per
    // the seed spec. Not currently wired into any store action (the
    // marketplace pages still read the static import), kept here so the
    // DB has the full dataset available if/when that's connected up.
    for (const p of marketplaceProducts) {
      insert.run({
        id: p.id,
        sku: null,
        name: p.name,
        category: p.category,
        fabricType: p.fabricType,
        material: p.material,
        gsm: p.gsm,
        width: p.width,
        weave: p.weave,
        finish: p.finish,
        origin: p.origin,
        pricePerMeter: p.pricePerMeter,
        moq: p.moq,
        stock: p.stock,
        colors: JSON.stringify(p.colors),
        description: p.description,
        image: p.image,
        bulkTiers: JSON.stringify([]),
        status: p.stock > 0 ? "Available" : "Out of Stock",
        addedOn: null,
        addedTimestamp: null,
        source: "marketplace",
        extra: JSON.stringify({
          supplier: p.supplier,
          supplierRating: p.supplierRating,
          supplierReviews: p.supplierReviews,
          bulkPrice: p.bulkPrice,
          bulkMinQty: p.bulkMinQty,
          badge: p.badge ?? null,
          features: p.features,
        }),
      });
    }
  });

  insertAll();
}
