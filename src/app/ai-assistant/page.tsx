"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles, Plus, Search, SlidersHorizontal, Scale3d, Leaf, BookOpen,
  Clock, Bookmark, Eye, Mic, Send, ChevronRight,
} from "lucide-react";
import { useAiChat } from "@/lib/useAiChat";
import { useAppStore } from "@/lib/store";
import { products, suggestedPrompts, popularSearchTags, aiStats, getProduct, categoryPhoto } from "@/lib/mockData";
import { formatINR } from "@/lib/utils";
import { FabricSwatch } from "@/components/FabricSwatch";

const discoverItems = [
  { icon: Search, label: "Fabric Search", prompt: "Help me search for a fabric. What are you looking for — material, color, weight, or use case?" },
  { icon: Sparkles, label: "Recommendations", prompt: "Recommend some fabrics for me based on what's popular and well-rated right now." },
  { icon: Scale3d, label: "Compare Fabrics", prompt: "Compare fabrics for me — show a side-by-side comparison of a few popular options with their price, material, and key differences." },
  { icon: Leaf, label: "Sustainability Advisor", prompt: "I want the most sustainable, eco-friendly fabric options available. What would you recommend?" },
  { icon: BookOpen, label: "Fabric Knowledge", prompt: "Teach me something useful about fabrics — types, care, or how to choose the right one." },
];

const activityItems = [
  { icon: Clock, label: "Recent Chats" },
  { icon: Bookmark, label: "Saved Searches" },
  { icon: Eye, label: "Viewed Fabrics" },
];

export default function AiAssistantPage() {
  const { user } = useAppStore();
  const { messages, isTyping, sendMessage, reset } = useAiChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const name = user?.name ? user.name.split(" ")[0] : "there";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = (text: string) => {
    sendMessage(text);
    setInput("");
  };

  const recommended = products.slice(0, 4);
  const started = messages.length > 0;

  return (
    <div className="mx-auto flex max-w-[1600px] gap-6 px-5 py-6 sm:px-8">
      {/* Left sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 space-y-6">
          <button
            onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta/12 px-4 py-2.5 text-sm font-semibold text-terracotta-dark"
          >
            <Sparkles size={15} /> AI Assistant
          </button>
          <button
            onClick={reset}
            className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-2.5 text-sm font-medium"
          >
            New Chat <Plus size={15} />
          </button>

          <div>
            <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted">Discover</div>
            <div className="space-y-0.5">
              {discoverItems.map((d) => (
                <button
                  key={d.label}
                  onClick={() => send(d.prompt)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-cream-2"
                >
                  <d.icon size={16} className="text-muted" /> {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted">My Activity</div>
            <div className="space-y-0.5">
              {activityItems.map((d) => (
                <button
                  key={d.label}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-cream-2"
                >
                  <d.icon size={16} className="text-muted" /> {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Center */}
      <div className="min-w-0 flex-1">
        {!started ? (
          <>
            <div className="relative mb-6 overflow-hidden rounded-2xl">
              <FabricSwatch
                image="/images/fabric-hero-ai.png"
                swirl={false}
                className="flex min-h-[150px] items-center px-6 py-6 sm:px-8"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(250,244,232,0.97) 0%, rgba(250,244,232,0.88) 34%, rgba(250,244,232,0.3) 62%, rgba(250,244,232,0.05) 82%)",
                  }}
                />
                <div className="relative z-10">
                  <div className="mb-2 text-lg">Hi {name}! 👋</div>
                  <h1 className="font-serif text-3xl leading-tight sm:text-[2.2rem]">
                    How can I help you source the <span className="text-white">perfect fabric</span> today?
                  </h1>
                </div>
              </FabricSwatch>
            </div>

            <div className="mb-8 flex items-center gap-2 rounded-2xl border border-line bg-white p-2.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && input.trim() && send(input)}
                placeholder="Ask anything about fabrics..."
                className="flex-1 bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted"
              />
              <button className="p-2 text-muted hover:text-ink" aria-label="Attach"><SlidersHorizontal size={16} /></button>
              <button className="p-2 text-muted hover:text-ink" aria-label="Voice"><Mic size={16} /></button>
              <button
                onClick={() => input.trim() && send(input)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white"
                aria-label="Send"
              >
                <Send size={15} />
              </button>
            </div>

            <div className="mb-10">
              <div className="mb-3 text-sm font-medium text-ink/70">Try asking something like</div>
              <div className="flex flex-wrap gap-2.5">
                {suggestedPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink/80 hover:border-terracotta-dark hover:text-terracotta-dark"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif text-xl">Recommended for You</h2>
                <Link href="/marketplace" className="text-sm font-medium text-terracotta-dark">View all</Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {recommended.map((p) => (
                  <Link key={p.id} href={`/marketplace/${p.id}`} className="overflow-hidden rounded-2xl border border-line bg-white">
                    <FabricSwatch image={categoryPhoto(p.category)} tint={p.colors[0]} className="aspect-square w-full" />
                    <div className="p-3">
                      <div className="mb-0.5 truncate text-sm font-medium">{p.name}</div>
                      <div className="mb-1.5 text-xs text-muted">{p.supplier}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{formatINR(p.pricePerMeter)} <span className="text-xs font-normal text-muted">/ meter</span></span>
                        {p.badge && <span className="rounded-full bg-cream-2 px-2 py-0.5 text-[0.6rem] font-medium">{p.badge}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <div className="mb-3 text-sm font-medium text-ink/70">Popular Searches</div>
              <div className="flex flex-wrap gap-2">
                {popularSearchTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => send(t)}
                    className="rounded-full bg-cream-2 px-3.5 py-1.5 text-xs font-medium text-ink/75 hover:bg-terracotta/12 hover:text-terracotta-dark"
                  >
                    {t}
                  </button>
                ))}
                <button className="flex items-center gap-1 rounded-full bg-cream-2 px-3.5 py-1.5 text-xs font-medium text-ink/75">
                  More <ChevronRight size={12} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 rounded-2xl border border-line bg-white p-6 sm:grid-cols-4">
              {aiStats.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-semibold sm:text-2xl">{s.value}</div>
                  <div className="text-xs text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-[calc(100vh-140px)] flex-col rounded-2xl border border-line bg-white">
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[70%] whitespace-pre-line rounded-2xl rounded-tr-sm bg-terracotta-dark px-4 py-3 text-sm text-white"
                        : "max-w-[75%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-cream px-4 py-3 text-sm"
                    }
                  >
                    {m.text}
                    {m.products && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {m.products.map((pid) => {
                          const p = getProduct(pid);
                          if (!p) return null;
                          return (
                            <Link key={pid} href={`/marketplace/${pid}`} className="overflow-hidden rounded-xl border border-line bg-white">
                              <FabricSwatch image={categoryPhoto(p.category)} tint={p.colors[0]} className="aspect-square w-full" swirl={false} />
                              <div className="p-2">
                                <div className="truncate text-xs font-medium">{p.name}</div>
                                <div className="text-[0.68rem] text-muted">{formatINR(p.pricePerMeter)}/m</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-cream px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" style={{ animationDelay: `${i * 0.12}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-line p-4">
              <div className="flex items-center gap-2 rounded-2xl border border-line bg-cream p-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && input.trim() && send(input)}
                  placeholder="Ask anything about fabrics..."
                  className="flex-1 bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted"
                />
                <button className="p-2 text-muted"><Mic size={16} /></button>
                <button
                  onClick={() => input.trim() && send(input)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white"
                  aria-label="Send"
                >
                  <Send size={15} />
                </button>
              </div>
              <div className="mt-1.5 text-center text-[0.65rem] text-muted">AI can make mistakes. Please verify important info.</div>
            </div>
          </div>
        )}
      </div>

      {/* Right capabilities / mini widget (desktop, when not chatting) */}
      {!started && (
        <aside className="hidden w-72 shrink-0 xl:block">
          <div className="sticky top-24 rounded-2xl border border-line bg-white p-5">
            <div className="mb-4 font-semibold">AI Assistant Capabilities</div>
            <div className="space-y-4">
              {[
                { icon: Search, title: "Natural Language Search", desc: "Find fabrics using everyday language", prompt: discoverItems[0].prompt },
                { icon: Sparkles, title: "Smart Recommendations", desc: "AI-powered fabric suggestions just for you", prompt: discoverItems[1].prompt },
                { icon: Scale3d, title: "Fabric Comparison", desc: "Compare fabrics side-by-side with key insights", prompt: discoverItems[2].prompt },
                { icon: BookOpen, title: "Fabric Knowledge", desc: "Get answers to all your fabric related questions", prompt: discoverItems[4].prompt },
              ].map((c) => (
                <button
                  key={c.title}
                  onClick={() => send(c.prompt)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta-dark">
                    <c.icon size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{c.title}</div>
                    <div className="text-xs text-muted">{c.desc}</div>
                  </div>
                </button>
              ))}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta-dark">
                  <Mic size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold">Voice Assistance</div>
                  <div className="text-xs text-muted">Speak your needs, we&apos;ll handle the rest</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}