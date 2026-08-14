import Link from "next/link";
import { Logo } from "./Header";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream-2/60">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Connecting buyers and suppliers across the global textile trade — sourced smarter, powered by AI.
            </p>
          </div>
          {[
            {
              title: "Marketplace",
              links: [
                { label: "Browse Fabrics", href: "/marketplace" },
                { label: "Categories", href: "/marketplace" },
                { label: "Suppliers", href: "/suppliers" },
                { label: "AI Assistant", href: "/ai-assistant" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "Help Center", href: "/help-center" },
                { label: "Guides", href: "/guides" },
                { label: "API Docs", href: "/api-docs" },
                { label: "Terms of Service", href: "/legal/terms" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="mb-3 text-sm font-semibold">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <div>© 2026 WeaveLink. All rights reserved.</div>
          <div className="flex gap-5">
            <Link href="/legal/privacy" className="hover:text-ink">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-ink">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
