"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Printer,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Copy,
  Download,
  Check,
  Circle,
  Truck,
  CreditCard,
  FileText,
  ShoppingBag,
  Package,
  ArrowLeft,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getProduct, OrderStatus, categoryPhoto } from "@/lib/mockData";
import { formatINR, cn } from "@/lib/utils";
import { FabricSwatch } from "@/components/FabricSwatch";
import { AccountLayout } from "@/components/AccountLayout";

const supplierStatusOptions: OrderStatus[] = ["Pending", "Accepted", "Preparing", "Ready for Dispatch", "Completed", "Cancelled"];

const stepperSteps: { label: OrderStatus; desc: string }[] = [
  { label: "Pending", desc: "Order has been placed by the buyer" },
  { label: "Accepted", desc: "Confirm the order to start processing" },
  { label: "Preparing", desc: "You are preparing the order" },
  { label: "Ready for Dispatch", desc: "Order is ready to be shipped" },
  { label: "Completed", desc: "Order has been delivered to buyer" },
];

function statusStepIndex(status: OrderStatus): number {
  switch (status) {
    case "Pending":
      return 0;
    case "Confirmed":
    case "Accepted":
      return 1;
    case "Processing":
    case "Preparing":
      return 2;
    case "In Transit":
    case "Ready for Dispatch":
      return 3;
    case "Delivered":
    case "Completed":
      return 4;
    default:
      return -1; // Cancelled / Returned
  }
}

const statusBadgeStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-indigo-100 text-indigo-800",
  Accepted: "bg-sky-100 text-sky-800",
  Preparing: "bg-terracotta/15 text-terracotta-dark",
  Processing: "bg-amber-100 text-amber-800",
  "In Transit": "bg-sky-100 text-sky-800",
  "Ready for Dispatch": "bg-terracotta/15 text-terracotta-dark",
  Delivered: "bg-emerald-100 text-emerald-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-700",
  Returned: "bg-red-100 text-red-700",
};

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const { user, orders } = useAppStore();
  const order = orders.find((o) => o.id === params.orderId);

  if (!order) {
    return (
      <AccountLayout>
        <div className="rounded-2xl border border-dashed border-line bg-white py-20 text-center">
          <div className="mb-2 text-lg font-semibold">Order not found</div>
          <p className="mb-5 text-sm text-muted">This order may have been removed or the ID is incorrect.</p>
          <Link href="/orders" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            Back to Orders
          </Link>
        </div>
      </AccountLayout>
    );
  }

  if (user?.role === "supplier") {
    return <SupplierOrderDetails order={order} />;
  }
  return <BuyerOrderDetails order={order} />;
}

function SupplierOrderDetails({ order }: { order: NonNullable<ReturnType<typeof useAppStore.getState>["orders"][number]> }) {
  const { updateOrderStatus } = useAppStore();
  const [pendingStatus, setPendingStatus] = useState<OrderStatus>(order.status);
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");

  const currentStep = statusStepIndex(order.status);
  const cancelled = order.status === "Cancelled" || order.status === "Returned";

  const handleUpdate = () => {
    updateOrderStatus(order.id, pendingStatus);
  };

  const activity =
    order.activityLog && order.activityLog.length > 0
      ? order.activityLog
      : [
          { id: "seed-1", text: `Order placed by ${order.buyerCompany || "buyer"}`, time: order.date },
          ...(order.paymentStatus === "Paid"
            ? [{ id: "seed-2", text: `Payment of ${formatINR(order.amount)} received`, time: order.date }]
            : []),
          { id: "seed-3", text: `Order is ${order.status.toLowerCase()}`, time: order.date },
        ];

  return (
    <AccountLayout>
      <div className="mb-3 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/orders" className="hover:text-ink">Orders</Link>
        <ChevronRight size={13} />
        <span className="text-ink">Order Details</span>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl">Order #{order.id}</h1>
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusBadgeStyles[order.status])}>
              {order.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Placed on {order.date} · Via WeaveLink
          </p>
        </div>
        <div className="flex gap-2.5">
          <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
            <Printer size={15} /> Print Invoice
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
            <MoreHorizontal size={15} /> More Actions
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <FileText size={16} className="text-terracotta-dark" /> Buyer Information
              </div>
              <div className="text-sm font-medium">
                {order.buyerCompany || "—"}
                {order.buyerVerified && (
                  <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[0.62rem] font-semibold text-emerald-800">
                    Verified Buyer
                  </span>
                )}
              </div>
              <div className="mt-2 space-y-1.5 text-xs text-muted">
                {order.buyerEmail && (
                  <div className="flex items-center gap-1.5"><Mail size={12} /> {order.buyerEmail}</div>
                )}
                {order.buyerPhone && (
                  <div className="flex items-center gap-1.5"><Phone size={12} /> {order.buyerPhone}</div>
                )}
                <div className="flex items-center gap-1.5"><MapPin size={12} /> {order.location}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <MapPin size={16} className="text-terracotta-dark" /> Shipping Address
                </div>
                <button className="flex items-center gap-1 text-xs font-medium text-terracotta-dark">
                  <Copy size={12} /> Copy
                </button>
              </div>
              <div className="text-xs text-muted">
                <div className="mb-1 font-medium text-ink">{order.buyerCompany}</div>
                {order.shippingAddress || "No shipping address on file."}
                {order.gstin && <div className="mt-1.5">GSTIN: {order.gstin}</div>}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <ShoppingBag size={16} className="text-terracotta-dark" /> Order Summary
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted">Order Value</span><span>{formatINR(order.amount)}</span></div>
                <div className="flex justify-between"><span className="text-muted">Shipping Charges</span><span>₹0</span></div>
                <div className="flex justify-between"><span className="text-muted">Tax (0%)</span><span>₹0</span></div>
                <div className="my-1.5 h-px bg-line" />
                <div className="flex justify-between font-semibold"><span>Total Amount</span><span>{formatINR(order.amount)}</span></div>
              </div>
              {order.paymentStatus && (
                <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-800">
                  {order.paymentStatus === "Paid" ? "Paid via WeaveLink" : order.paymentStatus}
                </span>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line p-5">
              <h2 className="font-semibold">Order Items</h2>
              <button className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold">
                <Download size={13} /> Download Invoice
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3">Specification</th>
                    <th className="px-5 py-3">Price/Mtr</th>
                    <th className="px-5 py-3">Quantity</th>
                    <th className="px-5 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((li) => {
                    const p = getProduct(li.productId);
                    return (
                      <tr key={li.productId} className="border-b border-line last:border-0">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {p && <FabricSwatch image={categoryPhoto(p.category)} tint={p.colors[0]} className="h-11 w-11 shrink-0 rounded-lg" />}
                            <div>
                              <div className="font-medium">{p?.name || li.productId}</div>
                              {p && <div className="text-xs text-muted">SKU: {p.id}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted">
                          {p ? `Width: ${p.width} · Weave: ${p.weave} · Finish: ${p.finish}` : "—"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5">{formatINR(li.pricePerMeter)}</td>
                        <td className="whitespace-nowrap px-5 py-3.5">{li.quantity} Mtrs</td>
                        <td className="whitespace-nowrap px-5 py-3.5 font-medium">{formatINR(li.pricePerMeter * li.quantity)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-line p-5">
              <span className="text-sm font-medium">
                Total Quantity: {order.items.reduce((s, i) => s + i.quantity, 0)} Mtrs
              </span>
              <span className="font-semibold">Total Amount: {formatINR(order.amount)}</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-5">
              <h2 className="mb-3 font-semibold">Additional Information</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-muted">Payment Method</span><span className="font-medium">{order.paymentMethod}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted">Payment Status</span>
                  <span className={cn("font-medium", order.paymentStatus === "Paid" ? "text-emerald-700" : order.paymentStatus === "Failed" ? "text-red-600" : "text-amber-700")}>
                    {order.paymentStatus || "—"}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-muted">Expected Delivery</span><span className="font-medium">{order.deliveryDate}</span></div>
                {order.orderNotes && (
                  <div>
                    <div className="mb-1 text-muted">Order Notes (Buyer)</div>
                    <div className="rounded-xl bg-cream p-3 text-xs">{order.orderNotes}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <h2 className="mb-3 font-semibold">Timeline</h2>
              <div className="space-y-3">
                {stepperSteps.map((s, i) => {
                  const done = !cancelled && i <= currentStep;
                  return (
                    <div key={s.label} className="flex items-center gap-2.5 text-sm">
                      {done ? (
                        <Check size={16} className="shrink-0 text-emerald-600" />
                      ) : (
                        <Circle size={14} className="shrink-0 text-muted" />
                      )}
                      <span className={done ? "font-medium" : "text-muted"}>
                        {s.label === "Pending" ? "Order Placed" : s.label === "Accepted" ? "Accept Order" : s.label === "Preparing" ? "Preparing Order" : s.label === "Ready for Dispatch" ? "Ready for Dispatch" : "Order Completed"}
                      </span>
                      <span className="ml-auto text-xs text-muted">{done ? order.date : "Pending"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-semibold">Billing Address</h2>
                <button className="flex items-center gap-1 text-xs font-medium text-terracotta-dark">
                  <Copy size={12} /> Copy
                </button>
              </div>
              <div className="text-xs text-muted">
                <div className="mb-1 font-medium text-ink">{order.buyerCompany}</div>
                {order.billingAddress || order.shippingAddress || "No billing address on file."}
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5">
              <h2 className="mb-3 font-semibold">Shipping &amp; Delivery</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">Shipping Method</span><span className="font-medium">Standard Delivery</span></div>
                <div className="flex justify-between"><span className="text-muted">Expected Delivery By</span><span className="font-medium">{order.deliveryDate}</span></div>
                <div className="flex justify-between"><span className="text-muted">Tracking Link</span><span className="font-medium">–</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-1 font-semibold">Order Status</h2>
            <p className="mb-4 text-xs text-muted">Update the status of this order</p>
            <div className="space-y-0">
              {stepperSteps.map((s, i) => {
                const done = !cancelled && i < currentStep;
                const active = !cancelled && i === currentStep;
                const isLast = i === stepperSteps.length - 1;
                return (
                  <div key={s.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          done ? "bg-emerald-600 text-white" : active ? "bg-terracotta-dark text-white" : "bg-cream-2 text-muted"
                        )}
                      >
                        {done ? <Check size={13} /> : i + 1}
                      </div>
                      {!isLast && <div className={cn("w-px flex-1", done ? "bg-emerald-600" : "bg-line")} style={{ minHeight: 32 }} />}
                    </div>
                    <div className="pb-5">
                      <div className={cn("text-sm font-medium", !done && !active && "text-muted")}>{s.label}</div>
                      <div className="text-xs text-muted">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-2 mt-1 text-xs font-medium text-muted">Update Status</div>
            <select
              value={pendingStatus}
              onChange={(e) => setPendingStatus(e.target.value as OrderStatus)}
              className="mb-3 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
            >
              {supplierStatusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={handleUpdate}
              className="w-full rounded-xl bg-ink py-2.5 text-sm font-semibold text-white transition hover:bg-ink/85"
            >
              Update Status
            </button>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-2 font-semibold">Notes</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              placeholder="Add a private note about this order..."
              rows={3}
              className="mb-1 w-full resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
            />
            <div className="mb-2 text-right text-[0.65rem] text-muted">{note.length} / 500</div>
            <button
              onClick={() => setSavedNote(note)}
              className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white"
            >
              Save Note
            </button>
            {savedNote && (
              <div className="mt-3 rounded-xl bg-cream p-3 text-xs text-ink/75">{savedNote}</div>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Activity Log</h2>
              <button className="text-xs font-medium text-terracotta-dark">View All</button>
            </div>
            <div className="space-y-3">
              {activity.map((a) => (
                <div key={a.id} className="flex items-start gap-2.5 text-sm">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
                    <Package size={13} />
                  </div>
                  <div>
                    <div className="text-sm">{a.text}</div>
                    <div className="text-xs text-muted">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}

function BuyerOrderDetails({ order }: { order: NonNullable<ReturnType<typeof useAppStore.getState>["orders"][number]> }) {
  const currentStep = statusStepIndex(order.status);
  const cancelled = order.status === "Cancelled" || order.status === "Returned";

  return (
    <AccountLayout>
      <Link href="/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink/70 hover:text-ink">
        <ArrowLeft size={15} /> Back to Orders
      </Link>

      <div className="mb-6 flex items-center gap-2.5">
        <h1 className="font-serif text-2xl sm:text-3xl">Order #{order.id}</h1>
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusBadgeStyles[order.status])}>
          {order.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="border-b border-line p-5">
            <h2 className="font-semibold">Order Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Price/Mtr</th>
                  <th className="px-5 py-3">Quantity</th>
                  <th className="px-5 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((li) => {
                  const p = getProduct(li.productId);
                  return (
                    <tr key={li.productId} className="border-b border-line last:border-0">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {p && <FabricSwatch image={categoryPhoto(p.category)} tint={p.colors[0]} className="h-11 w-11 shrink-0 rounded-lg" />}
                          <div className="font-medium">{p?.name || li.productId}</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">{formatINR(li.pricePerMeter)}</td>
                      <td className="whitespace-nowrap px-5 py-3.5">{li.quantity} Mtrs</td>
                      <td className="whitespace-nowrap px-5 py-3.5 font-medium">{formatINR(li.pricePerMeter * li.quantity)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-line p-5">
            <span className="text-sm font-medium">Supplier: {order.supplier}</span>
            <span className="font-semibold">{formatINR(order.amount)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-4 font-semibold">Order Status</h2>
            <div className="space-y-0">
              {stepperSteps.map((s, i) => {
                const done = !cancelled && i < currentStep;
                const active = !cancelled && i === currentStep;
                const isLast = i === stepperSteps.length - 1;
                return (
                  <div key={s.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          done ? "bg-emerald-600 text-white" : active ? "bg-terracotta-dark text-white" : "bg-cream-2 text-muted"
                        )}
                      >
                        {done ? <Check size={13} /> : i + 1}
                      </div>
                      {!isLast && <div className={cn("w-px flex-1", done ? "bg-emerald-600" : "bg-line")} style={{ minHeight: 32 }} />}
                    </div>
                    <div className="pb-5">
                      <div className={cn("text-sm font-medium", !done && !active && "text-muted")}>{s.label}</div>
                      <div className="text-xs text-muted">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <Truck size={16} className="text-terracotta-dark" /> Delivery
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Expected Delivery</span><span className="font-medium">{order.deliveryDate}</span></div>
              <div className="flex justify-between"><span className="text-muted">Shipping To</span><span className="font-medium">{order.location}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <CreditCard size={16} className="text-terracotta-dark" /> Payment
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Method</span><span className="font-medium">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-muted">Amount</span><span className="font-medium">{formatINR(order.amount)}</span></div>
            </div>
          </div>

          {order.activityLog && order.activityLog.length > 0 && (
            <div className="rounded-2xl border border-line bg-white p-5">
              <h2 className="mb-3 font-semibold">Order Updates</h2>
              <div className="space-y-3">
                {order.activityLog.map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5 text-sm">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
                      <Package size={13} />
                    </div>
                    <div>
                      <div className="text-sm">{a.text}</div>
                      <div className="text-xs text-muted">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}