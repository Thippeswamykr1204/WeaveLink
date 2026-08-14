"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Mic, ArrowRight, Minus, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { useAiChat } from "@/lib/useAiChat";
import { useSpeechToText } from "@/lib/useSpeechToText";
import { getProduct } from "@/lib/mockData";
import { formatINR, cn } from "@/lib/utils";

const quickActions = [
  "Find cotton fabrics for summer collection",
  "Show me sustainable fabrics under ₹200",
  "Compare poplin vs oxford fabrics",
  "Recommend fabrics for formal shirts",
];

/** productId: optionally ground the assistant in a specific product, e.g.
 * when this panel is embedded on a product detail page. */
export function AiPanel({ productId }: { productId?: string } = {}) {
  const { user } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);
  const [input, setInput] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "Cotton poplin white",
    "Linen blend fabric",
    "Denim fabric suppliers",
    "Silk satin red",
  ]);
  const { messages, isTyping, sendMessage } = useAiChat(undefined, { productId });
  const scrollRef = useRef<HTMLDivElement>(null);
  const name = user?.name ? user.name.split(" ")[0] : "there";

  const ask = (text: string) => {
    sendMessage(text);
    setRecentSearches((r) => [text, ...r].slice(0, 4));
  };
  const { isListening, isSupported, toggle } = useSpeechToText((text) => ask(text));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-white py-4 text-sm font-medium text-terracotta-dark"
      >
        <Sparkles size={16} /> Open AI Assistant
      </button>
    );
  }

  return (
    <div className="flex max-h-[calc(100vh-110px)] flex-col rounded-2xl border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line p-4">
        <div className="flex items-center gap-2 font-semibold">
          <Sparkles size={17} className="text-terracotta-dark" /> AI Assistant
        </div>
        <div className="flex items-center gap-1 text-muted">
          <Link href="/ai-assistant" className="rounded-lg p-1.5 hover:bg-cream" aria-label="Expand">
            <Maximize2 size={15} />
          </Link>
          <button onClick={() => setCollapsed(true)} className="rounded-lg p-1.5 hover:bg-cream" aria-label="Collapse">
            <Minus size={15} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <>
            <div className="text-sm">
              Hi {name}! 👋<br /> How can I help you today?
            </div>
            <div className="space-y-2">
              {quickActions.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="flex w-full items-center justify-between rounded-xl border border-line px-3.5 py-2.5 text-left text-sm text-ink/80 hover:border-terracotta-dark hover:text-terracotta-dark"
                >
                  {q} <ArrowRight size={14} className="shrink-0" />
                </button>
              ))}
            </div>
          </>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] whitespace-pre-line rounded-2xl rounded-tr-sm bg-terracotta-dark px-3.5 py-2.5 text-[0.85rem] text-white"
                    : "max-w-[90%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-cream px-3.5 py-2.5 text-[0.85rem]"
                }
              >
                {m.text}
                {m.products && (
                  <div className="mt-2 space-y-1.5">
                    {m.products.slice(0, 3).map((pid) => {
                      const p = getProduct(pid);
                      if (!p) return null;
                      return (
                        <Link
                          key={pid}
                          href={`/marketplace/${pid}`}
                          className="flex items-center gap-2 rounded-lg border border-line bg-white p-1.5"
                        >
                          <div
                            className="h-9 w-9 shrink-0 rounded-md"
                            style={{ backgroundImage: p.image, backgroundSize: "cover" }}
                          />
                          <div className="min-w-0">
                            <div className="truncate text-xs font-medium">{p.name}</div>
                            <div className="text-[0.65rem] text-muted">{formatINR(p.pricePerMeter)}/m</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
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

      <div className="border-t border-line p-3.5">
        <button
          onClick={toggle}
          disabled={!isSupported}
          className={cn(
            "mb-3 flex w-full items-center gap-2.5 rounded-xl border border-terracotta/30 bg-terracotta/8 px-3.5 py-2.5 text-sm font-medium text-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50",
            isListening && "animate-pulse"
          )}
        >
          <Mic size={15} />
          {isListening ? "Listening..." : isSupported ? "Tap to speak" : "Voice input not supported"}
        </button>

        {recentSearches.length > 0 && (
          <div className="mb-3">
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted">
              Recent Searches
              <button onClick={() => setRecentSearches([])} className="font-medium text-terracotta-dark normal-case">Clear</button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => ask(s)}
                  className="block w-full truncate rounded-lg px-2 py-1 text-left text-xs text-ink/70 hover:bg-cream"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-line bg-cream px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                ask(input);
                setInput("");
              }
            }}
            placeholder="Ask anything about fabrics..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
          <button
            onClick={() => {
              if (input.trim()) {
                ask(input);
                setInput("");
              }
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-terracotta-dark text-white"
            aria-label="Send"
          >
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="mt-1.5 text-center text-[0.62rem] text-muted">AI can make mistakes. Please verify important info.</div>
      </div>
    </div>
  );
}
