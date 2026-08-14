"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getProduct, Order, OrderLineItem, categoryPhoto } from "@/lib/mockData";
import { formatINR, cn } from "@/lib/utils";
import { FabricSwatch } from "@/components/FabricSwatch";

const steps = ["Cart Review", "Shipping Information", "Order Review", "Checkout", "Order Confirmation"];

function generateOrderId(): string {
  return `WL-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, addresses, placeOrder, user, hydrated } = useAppStore();
  const [step, setStep] = useState(1); // 0-indexed into `steps`
  const [address, setAddress] = useState({
    name: addresses[0]?.name || "",
    street: addresses[0]?.street || "",
    city: addresses[0]?.city || "",
    state: addresses[0]?.state || "",
    pincode: addresses[0]?.pincode || "",
    phone: addresses[0]?.phone || "",
  });

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  // Checkout is buyer-only functionality — suppliers don't browse/purchase.
  useEffect(() => {
    if (hydrated && user && user.role !== "buyer") {
      router.replace("/dashboard");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return <div className="mx-auto max-w-lg px-5 py-24 text-center text-sm text-muted">Loading...</div>;
  }

  if (user.role !== "buyer") {
    return <div className="mx-auto max-w-lg px-5 py-24 text-center text-sm text-muted">Redirecting to dashboard...</div>;
  }

  const items = cart.map((c) => ({ ...c, product: getProduct(c.productId) })).filter((c) => c.product);
  const subtotal = items.reduce((s, i) => s + i.product!.pricePerMeter * i.quantity, 0);
  const bulkDiscount = Math.round(subtotal * 0.065);
  const total = subtotal - bulkDiscount;

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <div className="mb-4 text-lg font-semibold">Nothing to check out</div>
        <Link href="/marketplace" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  const canContinueShipping = address.name && address.street && address.city && address.pincode && address.phone;

  const handlePlaceOrder = () => {
    const lineItems: OrderLineItem[] = items.map((i) => ({
      productId: i.product!.id,
      quantity: i.quantity,
      pricePerMeter: i.product!.pricePerMeter,
    }));
    const now = new Date();
    const order: Order = {
      id: generateOrderId(),
      date: now.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      timestamp: now.getTime(),
      supplier: items[0].product!.supplier,
      supplierVerified: true,
      location: `${address.city}, ${address.state}`,
      items: lineItems,
      amount: total,
      status: "Confirmed",
      deliveryDate: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      paymentMethod: "Visa •••• 4242",
    };
    placeOrder(order);
    router.push("/checkout/confirmation");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr_320px]">
        {/* Step rail */}
        <div>
          <h1 className="mb-1 font-serif text-2xl">Checkout</h1>
          <p className="mb-5 text-sm text-muted">Step {step + 1} of {steps.length}</p>
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-cream-2">
            <div className="h-full bg-terracotta-dark transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
          <div className="hidden space-y-1 lg:block">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2.5 py-1.5">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.68rem] font-semibold",
                    i < step ? "bg-emerald-700 text-white" : i === step ? "bg-ink text-white" : "bg-cream-2 text-muted"
                  )}
                >
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={cn("text-sm", i === step ? "font-semibold" : "text-muted")}>{s}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 hidden rounded-xl border border-line bg-white p-4 lg:block">
            <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={16} className="text-terracotta-dark" /> Secure Checkout
            </div>
            <p className="mb-3 text-xs text-muted">Your data and payments are protected with bank-level security.</p>
            <div className="flex gap-2">
              <span className="rounded-md border border-line px-2 py-1 text-[0.62rem] font-semibold">SSL Secured</span>
              <span className="rounded-md border border-line px-2 py-1 text-[0.62rem] font-semibold">PCI DSS</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div>
          {step === 1 && (
            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="mb-4 font-semibold">Shipping Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input placeholder="Full name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink" />
                <input placeholder="Phone number" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink" />
                <input placeholder="Street address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="sm:col-span-2 rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink" />
                <input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink" />
                <input placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink" />
                <input placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink" />
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setStep(0)} className="rounded-xl border border-line px-5 py-3 text-sm font-medium">Back to Cart</button>
                <button
                  disabled={!canContinueShipping}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
                >
                  Continue to Order Review <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-line bg-white p-6">
                <h2 className="mb-3 font-semibold">Order Review</h2>
                <div className="mb-4 divide-y divide-line">
                  {items.map((i) => (
                    <div key={i.product!.id} className="flex items-center gap-3 py-3">
                      <FabricSwatch
                        image={categoryPhoto(i.product!.category)}
                        tint={i.product!.colors[0]}
                        className="h-12 w-12 shrink-0 rounded-lg"
                      />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{i.product!.name}</div>
                        <div className="text-xs text-muted">{i.product!.gsm} GSM · {i.product!.weave}</div>
                      </div>
                      <div className="text-sm text-muted">{i.quantity} meter</div>
                      <div className="w-24 text-right text-sm font-medium">{formatINR(i.product!.pricePerMeter * i.quantity)}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-cream p-4 text-sm">
                  <div className="font-medium">{address.name}</div>
                  <div className="text-muted">{address.street}, {address.city}, {address.state} {address.pincode}</div>
                  <div className="text-muted">{address.phone}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="rounded-xl border border-line px-5 py-3 text-sm font-medium">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 rounded-xl bg-ink py-3 text-sm font-semibold text-white">
                  Continue to Checkout
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 rounded-xl bg-emerald-700/8 px-4 py-3 text-sm text-emerald-800">
                <Check size={16} /> Great choice! You&apos;re saving {formatINR(bulkDiscount)} on this order.
              </div>

              <div className="rounded-2xl border border-line bg-white p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold">Shipping Information</h2>
                  <button onClick={() => setStep(1)} className="rounded-lg bg-cream-2 px-3 py-1.5 text-xs font-semibold">Edit</button>
                </div>
                <div className="rounded-xl bg-cream p-4 text-sm">
                  <div className="mb-1 flex items-center gap-1.5 font-medium">Shipping Address</div>
                  <div className="text-muted">{address.name}</div>
                  <div className="text-muted">{address.street}, {address.city}, {address.state} {address.pincode}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted">
                    <div>Phone: {address.phone}</div>
                    <div>Email: {user?.email}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold">Order Review</h2>
                  <button onClick={() => setStep(2)} className="rounded-lg bg-cream-2 px-3 py-1.5 text-xs font-semibold">Edit</button>
                </div>
                <div className="divide-y divide-line text-sm">
                  {items.map((i) => (
                    <div key={i.product!.id} className="flex items-center gap-3 py-2.5">
                      <FabricSwatch
                        image={categoryPhoto(i.product!.category)}
                        tint={i.product!.colors[0]}
                        className="h-10 w-10 shrink-0 rounded-lg"
                      />
                      <div className="flex-1">{i.product!.name}</div>
                      <div className="text-muted">{i.quantity} meter</div>
                      <div className="w-24 text-right font-medium">{formatINR(i.product!.pricePerMeter * i.quantity)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted">Total {items.length} items</div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary / Payment sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 font-semibold">Order Summary</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal ({items.length} items)</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Bulk Discount</span><span className="text-emerald-700">− {formatINR(bulkDiscount)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Shipping (Estimated)</span><span className="font-medium text-emerald-700">FREE</span></div>
            </div>
            <div className="my-3 h-px bg-line" />
            <div className="mb-1 flex justify-between font-semibold"><span>Estimated Total</span><span>{formatINR(total)}</span></div>
            <div className="mb-3 text-xs text-muted">Prices are inclusive of GST</div>
            <div className="rounded-xl bg-emerald-700/8 p-3 text-xs text-emerald-800">
              <div className="font-semibold">You&apos;re Saving {formatINR(bulkDiscount)}</div>
              <div>{((bulkDiscount / (subtotal || 1)) * 100).toFixed(1)}% off on bulk items</div>
            </div>
          </div>

          {step === 3 && (
            <>
              <div className="rounded-2xl border border-line bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="font-semibold">Payment Method</div>
                  <button className="rounded-lg bg-cream-2 px-3 py-1.5 text-xs font-semibold">Edit</button>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-line p-3">
                  <div className="flex h-8 w-11 shrink-0 items-center justify-center rounded-md bg-ink text-[0.6rem] font-bold text-white">VISA</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      •••• •••• •••• 4242
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6rem] font-semibold text-emerald-800">Default</span>
                    </div>
                    <div className="text-xs text-muted">Expires 12/28 · {user?.name}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3.5 text-sm font-semibold text-white transition hover:bg-ink/85"
              >
                <Lock size={15} /> Place Order Securely
              </button>
              <p className="text-center text-xs text-muted">
                By placing this order, you agree to our{" "}
                <span className="font-medium text-terracotta-dark">Terms &amp; Conditions</span> and{" "}
                <span className="font-medium text-terracotta-dark">Privacy Policy</span>.
              </p>

              <div className="flex items-start gap-2.5 rounded-xl bg-emerald-700/8 p-3 text-xs text-emerald-800">
                <Check size={15} className="mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold">You&apos;re all set!</div>
                  Once you place the order, you&apos;ll receive an email confirmation with all the details.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}