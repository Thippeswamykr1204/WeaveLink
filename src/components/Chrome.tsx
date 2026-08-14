"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AiWidget } from "./AiWidget";
import { useAppStore } from "@/lib/store";

export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/login" || pathname === "/register";
  const hydrateFromServer = useAppStore((s) => s.hydrateFromServer);

  // DB is the source of truth for products/orders — localStorage (zustand
  // `persist`) is just a cache shown until this resolves, then overwritten.
  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/orders").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([products, orders]) => hydrateFromServer({ products, orders }))
      .catch((err) => console.error("Failed to hydrate from server:", err));
  }, [hydrateFromServer]);

  return (
    <>
      {!isAuth && <Header />}
      <main className="flex-1">{children}</main>
      {!isAuth && <Footer />}
      {!isAuth && <AiWidget />}
    </>
  );
}