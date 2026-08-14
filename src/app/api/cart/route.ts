import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// Cart rows are scoped by userId — falls back to "guest" since the store's
// cart isn't otherwise keyed per-user. Pass ?userId= (or body.userId) with
// the logged-in user's email when available.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "guest";
  const rows = db.prepare("SELECT productId, quantity FROM cart_items WHERE userId = ?").all(userId);
  return NextResponse.json(rows);
}

// POST — add an item (increments quantity if it already exists).
export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = body.userId || "guest";
  const { productId, quantity = 1 } = body;

  try {
    const existing = db
      .prepare("SELECT * FROM cart_items WHERE userId = ? AND productId = ?")
      .get(userId, productId) as any;

    if (existing) {
      db.prepare("UPDATE cart_items SET quantity = ? WHERE userId = ? AND productId = ?").run(
        existing.quantity + quantity,
        userId,
        productId
      );
    } else {
      db.prepare("INSERT INTO cart_items (userId, productId, quantity) VALUES (?, ?, ?)").run(
        userId,
        productId,
        quantity
      );
    }
  } catch (err) {
    console.error("POST /api/cart failed:", err);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

// PATCH — set an item's quantity to an exact value.
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const userId = body.userId || "guest";
  const { productId, quantity } = body;

  try {
    db.prepare(
      `INSERT INTO cart_items (userId, productId, quantity) VALUES (@userId, @productId, @quantity)
       ON CONFLICT(userId, productId) DO UPDATE SET quantity = @quantity`
    ).run({ userId, productId, quantity });
  } catch (err) {
    console.error("PATCH /api/cart failed:", err);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// DELETE — remove an item. Pass productId (and optionally userId) as query params.
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "guest";
  const productId = searchParams.get("productId");

  try {
    db.prepare("DELETE FROM cart_items WHERE userId = ? AND productId = ?").run(userId, productId);
  } catch (err) {
    console.error("DELETE /api/cart failed:", err);
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
