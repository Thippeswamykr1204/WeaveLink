import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { seedIfEmpty } from "@/lib/seed";
import { rowToProduct } from "@/lib/dbSerializers";

// GET /api/products?q=&category=&fabricType=&source=
// Filters mirror the current marketplace filter UI (search text, category,
// fabric type). `source` narrows to "inventory" (supplier-added rows, the
// default — matches what the dashboard/store actually reads) or
// "marketplace" (the static public catalog, seeded for parity).
export async function GET(req: NextRequest) {
  seedIfEmpty();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase();
  const category = searchParams.get("category");
  const fabricType = searchParams.get("fabricType");
  const source = searchParams.get("source") || "inventory";

  let sql = "SELECT * FROM products WHERE source = @source";
  const params: Record<string, unknown> = { source };

  if (category) {
    sql += " AND category = @category";
    params.category = category;
  }
  if (fabricType) {
    sql += " AND fabricType = @fabricType";
    params.fabricType = fabricType;
  }
  sql += " ORDER BY addedTimestamp DESC";

  const rows = db.prepare(sql).all(params) as any[];
  let results = rows.map(rowToProduct);

  if (q) {
    results = results.filter((p) =>
      `${p.name} ${p.category} ${p.supplier ?? ""}`.toLowerCase().includes(q)
    );
  }

  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  seedIfEmpty();
  const body = await req.json();

  const stock = Number(body.stock) || 0;
  const status = body.status || (stock <= 0 ? "Out of Stock" : stock < 100 ? "Low Stock" : "Available");

  const row = {
    id: body.id,
    sku: body.sku ?? null,
    name: body.name,
    category: body.category ?? null,
    fabricType: body.fabricType ?? null,
    material: body.material ?? null,
    gsm: body.gsm ?? null,
    width: body.width ?? null,
    weave: body.weave ?? null,
    finish: body.finish ?? null,
    origin: body.origin ?? null,
    pricePerMeter: body.pricePerMeter ?? null,
    moq: body.moq ?? null,
    stock,
    colors: JSON.stringify(body.colors ?? []),
    description: body.description ?? null,
    image: body.image ?? null,
    bulkTiers: JSON.stringify(body.bulkTiers ?? []),
    status,
    addedOn: body.addedOn ?? null,
    addedTimestamp: body.addedTimestamp ?? Date.now(),
    source: body.source ?? "inventory",
    extra: null,
  };

  try {
    db.prepare(
      `INSERT INTO products
        (id, sku, name, category, fabricType, material, gsm, width, weave, finish, origin,
         pricePerMeter, moq, stock, colors, description, image, bulkTiers, status, addedOn,
         addedTimestamp, source, extra)
       VALUES
        (@id, @sku, @name, @category, @fabricType, @material, @gsm, @width, @weave, @finish, @origin,
         @pricePerMeter, @moq, @stock, @colors, @description, @image, @bulkTiers, @status, @addedOn,
         @addedTimestamp, @source, @extra)`
    ).run(row);
  } catch (err) {
    console.error("POST /api/products failed:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }

  return NextResponse.json(rowToProduct(row), { status: 201 });
}
