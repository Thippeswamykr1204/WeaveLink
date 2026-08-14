"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  orders as seedOrders,
  Order,
  OrderStatus,
  Address,
  defaultAddresses,
  InventoryProduct,
  supplierProductsSeed,
} from "./mockData";

export type UserRole = "buyer" | "supplier";

export interface AuthUser {
  name: string;
  company: string;
  role: UserRole;
  onboarded: boolean;
  email: string;
  phone: string;
  designation: string;
  department: string;
  companyType: string;
  businessType: string;
  gstin: string;
  yearEstablished: string;
  employeeRange: string;
  memberSince: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

interface AppState {
  user: AuthUser | null;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  addresses: Address[];
  onboardingAnswers: Record<string, unknown>;
  hydrated: boolean;
  products: InventoryProduct[];
  compareList: string[];

  login: (user: Partial<AuthUser> & { name: string; company: string; role: UserRole }) => void;
  logout: () => void;
  completeOnboarding: () => void;
  updateProfile: (fields: Partial<AuthUser>) => void;
  setOnboardingAnswers: (fields: Record<string, unknown>) => void;
  setHydrated: (v: boolean) => void;

  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  cartCount: () => number;

  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  addAddress: (address: Address) => void;
  updateAddress: (id: string, fields: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  addProduct: (product: InventoryProduct) => void;
  updateProduct: (id: string, fields: Partial<InventoryProduct>) => void;
  deleteProduct: (id: string) => void;

  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  // DB is source of truth for products/orders; localStorage (via `persist`)
  // is now just a cache. Called on app mount after fetching /api/products
  // and /api/orders.
  hydrateFromServer: (data: { products?: InventoryProduct[]; orders?: Order[] }) => void;
}

const MAX_COMPARE = 3;

// Fire-and-forget helper for mirroring local state changes to the DB-backed
// API routes. Hackathon scope: no optimistic-rollback — if the request
// fails we just log it and let local state (and the next server refetch)
// resolve the discrepancy.
function syncToServer(url: string, init?: RequestInit) {
  if (typeof window === "undefined") return;
  fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  }).catch((err) => {
    console.error(`Sync failed: ${init?.method || "GET"} ${url}`, err);
  });
}

const defaultUserFields = {
  email: "hello@arjunclothing.com",
  phone: "98765 43210",
  designation: "Procurement Manager",
  department: "Sourcing",
  companyType: "Private Limited",
  businessType: "Manufacturer, Exporter",
  gstin: "24ABCDE1234F1Z5",
  yearEstablished: "2018",
  employeeRange: "51 – 100",
  memberSince: "15 Feb 2024",
};

function computeProductStatus(stock: number): InventoryProduct["status"] {
  if (stock <= 0) return "Out of Stock";
  if (stock < 100) return "Low Stock";
  return "Available";
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [
        { productId: "premium-cotton-poplin", quantity: 100 },
        { productId: "silk-satin-fabric", quantity: 25 },
        { productId: "linen-blend-fabric", quantity: 50 },
        { productId: "denim-cotton-stretch", quantity: 75 },
      ],
      wishlist: [
        "premium-cotton-poplin",
        "linen-blend-fabric",
        "silk-satin-fabric",
        "denim-cotton-stretch",
        "polyester-canvas",
        "soft-cotton-voile",
        "organic-cotton-twill",
        "wool-blend-suiting",
      ],
      orders: seedOrders,
      addresses: defaultAddresses,
      onboardingAnswers: {},
      hydrated: false,
      products: supplierProductsSeed,
      compareList: [],

      login: (user) =>
        set({
          user: {
            ...defaultUserFields,
            onboarded: false,
            ...user,
          },
        }),
      logout: () => set({ user: null }),
      completeOnboarding: () =>
        set((s) => (s.user ? { user: { ...s.user, onboarded: true } } : s)),
      updateProfile: (fields) =>
        set((s) => (s.user ? { user: { ...s.user, ...fields } } : s)),
      setOnboardingAnswers: (fields) =>
        set((s) => ({ onboardingAnswers: { ...s.onboardingAnswers, ...fields } })),
      setHydrated: (v) => set({ hydrated: v }),

      addToCart: (productId, quantity = 1) => {
        set((s) => {
          const existing = s.cart.find((c) => c.productId === productId);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.productId === productId ? { ...c, quantity: c.quantity + quantity } : c
              ),
            };
          }
          return { cart: [...s.cart, { productId, quantity }] };
        });
        syncToServer("/api/cart", {
          method: "POST",
          body: JSON.stringify({ userId: get().user?.email, productId, quantity }),
        });
      },
      updateCartQuantity: (productId, quantity) => {
        set((s) => ({
          cart: s.cart.map((c) => (c.productId === productId ? { ...c, quantity } : c)),
        }));
        syncToServer("/api/cart", {
          method: "PATCH",
          body: JSON.stringify({ userId: get().user?.email, productId, quantity }),
        });
      },
      removeFromCart: (productId) => {
        set((s) => ({ cart: s.cart.filter((c) => c.productId !== productId) }));
        const userId = get().user?.email || "guest";
        syncToServer(
          `/api/cart?userId=${encodeURIComponent(userId)}&productId=${encodeURIComponent(productId)}`,
          { method: "DELETE" }
        );
      },
      cartCount: () => get().cart.length,

      toggleWishlist: (productId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(productId)
            ? s.wishlist.filter((id) => id !== productId)
            : [...s.wishlist, productId],
        })),
      isWishlisted: (productId) => get().wishlist.includes(productId),

      placeOrder: (order) => {
        set((s) => ({ orders: [order, ...s.orders], cart: [] }));
        const buyerEmail = order.buyerEmail || get().user?.email;
        syncToServer("/api/orders", {
          method: "POST",
          body: JSON.stringify({ ...order, buyerEmail }),
        });
      },
      updateOrderStatus: (orderId, status) => {
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  activityLog: [
                    {
                      id: `act-${Date.now()}`,
                      text: `Status updated to ${status}`,
                      time: new Date().toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    },
                    ...(o.activityLog || []),
                  ],
                }
              : o
          ),
        }));
        // Server appends its own activity log entry too (source of truth on
        // next hydration) — see api/orders/[id]/route.ts.
        syncToServer(`/api/orders/${orderId}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
      },

      addAddress: (address) =>
        set((s) => ({
          addresses: address.isDefault
            ? [...s.addresses.map((a) => ({ ...a, isDefault: false })), address]
            : [...s.addresses, address],
        })),
      updateAddress: (id, fields) =>
        set((s) => ({
          addresses: s.addresses.map((a) => (a.id === id ? { ...a, ...fields } : a)),
        })),
      removeAddress: (id) =>
        set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
      setDefaultAddress: (id) =>
        set((s) => ({
          addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),

      addProduct: (product) => {
        const withStatus = { ...product, status: computeProductStatus(product.stock) };
        set((s) => ({ products: [withStatus, ...s.products] }));
        syncToServer("/api/products", {
          method: "POST",
          body: JSON.stringify(withStatus),
        });
      },
      updateProduct: (id, fields) => {
        let updated: InventoryProduct | undefined;
        set((s) => ({
          products: s.products.map((p) => {
            if (p.id !== id) return p;
            const merged = { ...p, ...fields };
            updated = { ...merged, status: computeProductStatus(merged.stock) };
            return updated;
          }),
        }));
        if (updated) {
          syncToServer(`/api/products/${id}`, {
            method: "PATCH",
            body: JSON.stringify(updated),
          });
        }
      },
      deleteProduct: (id) => {
        set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
        syncToServer(`/api/products/${id}`, { method: "DELETE" });
      },

      addToCompare: (productId) =>
        set((s) => {
          if (s.compareList.includes(productId)) return s;
          if (s.compareList.length >= MAX_COMPARE) {
            return { compareList: [...s.compareList.slice(1), productId] };
          }
          return { compareList: [...s.compareList, productId] };
        }),
      removeFromCompare: (productId) =>
        set((s) => ({ compareList: s.compareList.filter((id) => id !== productId) })),
      clearCompare: () => set({ compareList: [] }),

      hydrateFromServer: (data) =>
        set((s) => ({
          products: data.products && data.products.length ? data.products : s.products,
          orders: data.orders && data.orders.length ? data.orders : s.orders,
        })),
    }),
    {
      name: "weavelink-store",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated?.(true);
      },
    }
  )
);