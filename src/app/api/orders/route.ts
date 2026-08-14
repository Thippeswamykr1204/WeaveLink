import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { rowToOrder } from "@/lib/dbSerializers";

// GET /api/orders?buyerEmail=&supplier=  — optional filters by role/user.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const buyerEmail = searchParams.get("buyerEmail");
  const supplier = searchParams.get("supplier");

  let sql = "SELECT * FROM orders WHERE 1=1";
  const params: Record<string, unknown> = {};
  if (buyerEmail) {
    sql += " AND buyerEmail = @buyerEmail";
    params.buyerEmail = buyerEmail;
  }
  if (supplier) {
    sql += " AND supplier = @supplier";
    params.supplier = supplier;
  }
  sql += " ORDER BY timestamp DESC";

  const orderRows = db.prepare(sql).all(params) as any[];
  const itemStmt = db.prepare("SELECT * FROM order_items WHERE orderId = ?");
  const results = orderRows.map((row) => rowToOrder(row, itemStmt.all(row.id) as any[]));

  return NextResponse.json(results);
}

// POST /api/orders — create an order (typically from the cart at checkout).
export async function POST(req: NextRequest) {
  const body = await req.json();

  const orderRow = {
    id: body.id,
    date: body.date ?? null,
    timestamp: body.timestamp ?? Date.now(),
    supplier: body.supplier ?? null,
    supplierVerified: body.supplierVerified ? 1 : 0,
    location: body.location ?? null,
    amount: body.amount ?? 0,
    status: body.status ?? "Pending",
    deliveryDate: body.deliveryDate ?? null,
    paymentMethod: body.paymentMethod ?? null,
    buyerCompany: body.buyerCompany ?? null,
    buyerEmail: body.buyerEmail ?? null,
    buyerPhone: body.buyerPhone ?? null,
    buyerVerified: body.buyerVerified === undefined ? null : body.buyerVerified ? 1 : 0,
    shippingAddress: body.shippingAddress ?? null,
    billingAddress: body.billingAddress ?? null,
    gstin: body.gstin ?? null,
    orderNotes: body.orderNotes ?? null,
    paymentStatus: body.paymentStatus ?? null,
    activityLog: JSON.stringify(body.activityLog ?? []),
  };

  const items = Array.isArray(body.items) ? body.items : [];

  try {
    const insertOrder = db.prepare(
      `INSERT INTO orders
        (id, date, timestamp, supplier, supplierVerified, location, amount, status, deliveryDate,
         paymentMethod, buyerCompany, buyerEmail, buyerPhone, buyerVerified, shippingAddress,
         billingAddress, gstin, orderNotes, paymentStatus, activityLog)
       VALUES
        (@id, @date, @timestamp, @supplier, @supplierVerified, @location, @amount, @status, @deliveryDate,
         @paymentMethod, @buyerCompany, @buyerEmail, @buyerPhone, @buyerVerified, @shippingAddress,
         @billingAddress, @gstin, @orderNotes, @paymentStatus, @activityLog)`
    );
    const insertItem = db.prepare(
      `INSERT INTO order_items (orderId, productId, quantity, pricePerMeter) VALUES (?, ?, ?, ?)`
    );

    const run = db.transaction(() => {
      insertOrder.run(orderRow);
      for (const item of items) {
        insertItem.run(orderRow.id, item.productId, item.quantity, item.pricePerMeter);
      }
      // Also clear this buyer's server-side cart, mirroring placeOrder()
      // clearing the local cart on checkout.
      if (body.buyerEmail) {
        db.prepare("DELETE FROM cart_items WHERE userId = ?").run(body.buyerEmail);
      } else {
        db.prepare("DELETE FROM cart_items WHERE userId = ?").run("guest");
      }
    });
    run();
  } catch (err) {
    console.error("POST /api/orders failed:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderRow.id) as any;
  const orderItems = db.prepare("SELECT * FROM order_items WHERE orderId = ?").all(orderRow.id) as any[];
  return NextResponse.json(rowToOrder(row, orderItems), { status: 201 });
}
