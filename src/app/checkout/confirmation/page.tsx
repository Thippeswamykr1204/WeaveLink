"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  Calendar,
  Truck,
  CreditCard,
  Download,
  MapPin,
  ChevronRight,
  Search,
  ClipboardList,
  MessageCircle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getProduct, categoryPhoto } from "@/lib/mockData";
import { formatINR, cn } from "@/lib/utils";
import { FabricSwatch } from "@/components/FabricSwatch";

const trackingSteps = [
  { label: "Order Placed", desc: "Your order has been placed." },
  { label: "Confirmed", desc: "We've confirmed your order with the supplier." },
  { label: "Processing", desc: "Your order is being prepared." },
  { label: "Shipped", desc: "Will be updated soon." },
  { label: "Delivered", desc: "Estimated by delivery date." },
];

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { orders, user, addresses, hydrated } = useAppStore();
  const order = orders[0];
  const address = addresses[0];

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return <div className="mx-auto max-w-lg px-5 py-24 text-center text-sm text-muted">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <div className="mb-4 text-lg font-semibold">No recent order found</div>
        <Link href="/marketplace" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  const completedSteps = 3; // Order Placed, Confirmed, Processing

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="flex flex-col items-start gap-6 rounded-2xl border border-line bg-emerald-700/5 p-6 sm:flex-row sm:items-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-700/12 text-emerald-700"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 16 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-white"
              >
                <Check size={26} />
              </motion.div>
            </motion.div>
            <div>
              <span className="mb-1 inline-block rounded-full bg-emerald-700/12 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-800">
                Order Placed Successfully
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl">Thank you, {user?.name.split(" ")[0] || "there"}! 🎉</h1>
              <p className="mt-1 text-sm text-muted">
                We&apos;ve received your order and our team is already working on it. You will receive an email confirmation shortly.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/orders" className="flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white">
                  View Order Details <ChevronRight size={15} />
                </Link>
                <Link href="/marketplace" className="rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Order Details</h2>
              <span className="text-xs text-muted">Order ID: {order.id}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Calendar, label: "Order Date", value: order.date },
                { icon: Truck, label: "Estimated Delivery", value: order.deliveryDate },
                { icon: CreditCard, label: "Payment Method", value: order.paymentMethod },
                { icon: Download, label: "Total Amount", value: formatINR(order.amount), highlight: true },
              ].map((d) => (
                <div key={d.label} className="flex items-start gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
                    <d.icon size={16} />
                  </div>
                  <div>
                    <div className="text-xs text-muted">{d.label}</div>
                    <div className={cn("text-sm font-semibold", d.highlight && "text-emerald-700")}>{d.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line p-5">
              <h2 className="font-semibold">Ordered Items ({order.items.length})</h2>
              <button className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold">
                <Download size={13} /> Download Invoice
              </button>
            </div>
            <div className="divide-y divide-line">
              {order.items.map((li) => {
                const p = getProduct(li.productId);
                if (!p) return null;
                return (
                  <div key={li.productId} className="flex items-center gap-3 p-4">
                    <FabricSwatch
                      image={categoryPhoto(p.category)}
                      tint={p.colors[0]}
                      className="h-14 w-14 shrink-0 rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted">{p.gsm} GSM · {p.weave} · {p.finish}</div>
                    </div>
                    <div className="text-sm text-muted">{li.quantity} meter</div>
                    <div className="w-24 text-right text-sm font-semibold">{formatINR(li.pricePerMeter * li.quantity)}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between border-t border-line p-4">
              <span className="text-sm font-medium">Total {order.items.length} items</span>
              <span className="font-semibold">{formatINR(order.amount)}</span>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-4 font-semibold">Order Tracking</div>
            <div className="space-y-0">
              {trackingSteps.map((s, i) => {
                const done = i < completedSteps;
                const isLast = i === trackingSteps.length - 1;
                return (
                  <div key={s.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                          done ? "bg-emerald-700 text-white" : "bg-cream-2 text-muted"
                        )}
                      >
                        {done ? <Check size={12} /> : <span className="text-[0.6rem]">{i + 1}</span>}
                      </div>
                      {!isLast && <div className={cn("w-px flex-1", done ? "bg-emerald-700" : "bg-line")} style={{ minHeight: 28 }} />}
                    </div>
                    <div className="pb-5">
                      <div className={cn("text-sm font-medium", !done && "text-muted")}>{s.label}</div>
                      <div className="text-xs text-muted">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">Shipping Address</div>
              <button className="text-xs font-medium text-terracotta-dark">View</button>
            </div>
            <div className="flex items-start gap-2.5 text-sm">
              <MapPin size={16} className="mt-0.5 shrink-0 text-terracotta-dark" />
              <div>
                <div className="font-medium">{address?.name || user?.company}</div>
                <div className="text-muted">
                  {address ? `${address.street}, ${address.city}, ${address.state} - ${address.pincode}` : order.location}
                </div>
                <div className="text-muted">Contact: {address?.name} ({address?.phone})</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 font-semibold">What&apos;s Next?</div>
            <div className="space-y-1">
              <Link href="/orders" className="flex items-center justify-between rounded-xl px-2.5 py-2.5 hover:bg-cream">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-2">
                    <Search size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Track Your Order</div>
                    <div className="text-xs text-muted">Real-time updates on your order status</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted" />
              </Link>
              <Link href="/orders" className="flex items-center justify-between rounded-xl px-2.5 py-2.5 hover:bg-cream">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-2">
                    <ClipboardList size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Manage Orders</div>
                    <div className="text-xs text-muted">View all your orders and history</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted" />
              </Link>
              <button className="flex w-full items-center justify-between rounded-xl px-2.5 py-2.5 text-left hover:bg-cream">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-2">
                    <MessageCircle size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Need Help?</div>
                    <div className="text-xs text-muted">Chat with our support team</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}