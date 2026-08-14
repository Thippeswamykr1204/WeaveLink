import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { rowToProduct } from "@/lib/dbSerializers";

function computeStatus(stock: number) {
  if (stock <= 0) return "Out of Stock";
  if (stock < 100) return "Low Stock";
  return "Available";
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rowToProduct(row));
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const merged = { ...existing, ...body };
  if (merged.colors && typeof merged.colors !== "string") merged.colors = JSON.stringify(merged.colors);
  if (merged.bulkTiers && typeof merged.bulkTiers !== "string")
    merged.bulkTiers = JSON.stringify(merged.bulkTiers);
  if (body.stock !== undefined && body.status === undefined) {
    merged.status = computeStatus(Number(merged.stock));
  }

  try {
    db.prepare(
      `UPDATE products SET
        sku=@sku, name=@name, category=@category, fabricType=@fabricType, material=@material,
        gsm=@gsm, width=@width, weave=@weave, finish=@finish, origin=@origin,
        pricePerMeter=@pricePerMeter, moq=@moq, stock=@stock, colors=@colors, description=@description,
        image=@image, bulkTiers=@bulkTiers, status=@status, addedOn=@addedOn, addedTimestamp=@addedTimestamp
       WHERE id=@id`
    ).run(merged);
  } catch (err) {
    console.error(`PATCH /api/products/${id} failed:`, err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }

  const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  return NextResponse.json(rowToProduct(updated));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
  } catch (err) {
    console.error(`DELETE /api/products/${id} failed:`, err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
