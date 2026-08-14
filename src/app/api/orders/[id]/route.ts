import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { rowToOrder } from "@/lib/dbSerializers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as any;
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const items = db.prepare("SELECT * FROM order_items WHERE orderId = ?").all(id) as any[];
  return NextResponse.json(rowToOrder(row, items));
}

// PATCH — status update. Mirrors store.updateOrderStatus: when `status` is
// provided, appends a server-side activity log entry (in addition to
// whatever the client already logged locally).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as any;
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const merged = { ...existing, ...body };

  if (body.status && body.status !== existing.status) {
    const log = existing.activityLog ? JSON.parse(existing.activityLog) : [];
    log.unshift({
      id: `act-${Date.now()}`,
      text: `Status updated to ${body.status}`,
      time: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    merged.activityLog = JSON.stringify(log);
  } else if (merged.activityLog && typeof merged.activityLog !== "string") {
    merged.activityLog = JSON.stringify(merged.activityLog);
  }

  if (typeof merged.supplierVerified === "boolean") merged.supplierVerified = merged.supplierVerified ? 1 : 0;
  if (typeof merged.buyerVerified === "boolean") merged.buyerVerified = merged.buyerVerified ? 1 : 0;

  try {
    db.prepare(
      `UPDATE orders SET
        date=@date, timestamp=@timestamp, supplier=@supplier, supplierVerified=@supplierVerified,
        location=@location, amount=@amount, status=@status, deliveryDate=@deliveryDate,
        paymentMethod=@paymentMethod, buyerCompany=@buyerCompany, buyerEmail=@buyerEmail,
        buyerPhone=@buyerPhone, buyerVerified=@buyerVerified, shippingAddress=@shippingAddress,
        billingAddress=@billingAddress, gstin=@gstin, orderNotes=@orderNotes,
        paymentStatus=@paymentStatus, activityLog=@activityLog
       WHERE id=@id`
    ).run(merged);
  } catch (err) {
    console.error(`PATCH /api/orders/${id} failed:`, err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }

  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as any;
  const items = db.prepare("SELECT * FROM order_items WHERE orderId = ?").all(id) as any[];
  return NextResponse.json(rowToOrder(row, items));
}
