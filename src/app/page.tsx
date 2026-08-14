"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, ArrowRight, Filter, Sparkles, ShieldCheck, Scale, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { categories, stats, whyChooseUs, trustBrands } from "@/lib/mockData";
import { FabricSwatch } from "@/components/FabricSwatch";

const icons = [Sparkles, ShieldCheck, Scale, ShoppingBag];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const randomLetter = () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  // Static on server, re-rolled once on the client after mount to avoid
  // an SSR/client hydration mismatch from Math.random().
  const [avatarLetters, setAvatarLetters] = useState(["S", "K", "M"]);
  useEffect(() => {
    setAvatarLetters([randomLetter(), randomLetter(), randomLetter()]);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 pt-10 pb-16 sm:px-8 lg:grid-cols-2 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-terracotta-dark">
              <Sparkles size={13} /> THE FUTURE OF TEXTILE SOURCING
            </span>
            <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.08] sm:text-[3.4rem]">
              Find the perfect fabric.
              <br />
              <span className="text-terracotta-dark">Grow your business.</span>
            </h1>
            <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-muted">
              We connect businesses with trusted textile suppliers across the world. Discover quality fabrics, compare options, and place orders with confidence.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/marketplace"
                className="flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink/85"
              >
                Explore Marketplace <ArrowRight size={16} />
              </Link>
              <Link
                href="/ai-assistant"
                className="flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-ink"
              >
                Talk to AI Assistant <Sparkles size={15} className="text-terracotta-dark" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
          <FabricSwatch
            image="/images/fabric-hero.png"
            className="aspect-[6/5] w-full rounded-3xl shadow-xl"
          />
            <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-lg sm:left-8">
              <div className="flex -space-x-2">
                {avatarLetters.map((letter, i) => (
                  <div
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-terracotta to-ink/60 text-[0.65rem] font-semibold text-white"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-sm font-semibold">★★★★★ 4.8/5</div>
                <div className="text-xs text-muted">Trusted by 2,500+ businesses</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search bar */}
        <div className="mx-auto -mt-4 max-w-[1440px] px-5 sm:px-8">
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/marketplace${query ? `?q=${encodeURIComponent(query)}` : ""}`);
            }}
            className="flex flex-col gap-2.5 rounded-2xl border border-line bg-white p-2.5 shadow-lg sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2.5 px-3 py-2">
              <Search size={18} className="shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fabrics, categories, or suppliers..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
            <select className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink/80 sm:w-40">
              <option>All Categories</option>
              {categories.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
            <select className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink/80 sm:w-36">
              <option>All Fabrics</option>
              <option>Woven</option>
              <option>Knit</option>
              <option>Denim</option>
            </select>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-2.5 text-sm font-semibold text-white"
            >
              <Search size={15} /> Search
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-line bg-cream px-5 py-2.5 text-sm font-medium text-ink/80"
            >
              <Filter size={15} /> Filters
            </button>
          </motion.form>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto mt-12 grid max-w-[1440px] grid-cols-2 gap-6 px-5 sm:px-8 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
                <ShoppingBag size={18} />
              </div>
              <div>
                <div className="text-xl font-semibold sm:text-2xl">{s.value}</div>
                <div className="text-xs text-muted sm:text-sm">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_2fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-dark">
              Why businesses choose WeaveLink
            </span>
            <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-[2.2rem]">
              Everything you need to source smarter
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              AI-powered discovery, trusted suppliers, and a seamless experience — all in one platform.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {whyChooseUs.map((f, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="rounded-2xl border border-line bg-white p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta-dark">
                    <Icon size={18} />
                  </div>
                  <div className="mb-1.5 font-semibold">{f.title}</div>
                  <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-t border-line py-10">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-muted">
            Trusted by industry leaders
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
          >
            {trustBrands.map((b) => (
              <span key={b} className="font-serif text-lg text-ink/70">
                {b}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}