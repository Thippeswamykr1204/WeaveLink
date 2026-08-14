"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState, useRef, useEffect } from "react";
import { Sparkles, X, Mic, ArrowRight, Maximize2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useAiChat } from "@/lib/useAiChat";
import { useSpeechToText } from "@/lib/useSpeechToText";
import { getProduct } from "@/lib/mockData";
import { formatINR, cn } from "@/lib/utils";

// Matches /marketplace/[productId] but not the listing page itself or the
// /marketplace/compare route, so the assistant knows which product (if any)
// the person is currently looking at.
function useViewingProduct(pathname: string) {
  return useMemo(() => {
    const match = pathname.match(/^\/marketplace\/([^/]+)$/);
    const id = match && match[1] !== "compare" ? match[1] : undefined;
    return id ? getProduct(id) : undefined;
  }, [pathname]);
}

export function AiWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const viewingProduct = useViewingProduct(pathname);
  const { messages, isTyping, sendMessage } = useAiChat(
    [
      { id: "greet", role: "ai", text: "Hi there! I'm your AI fabric assistant. I can help you find, compare, and discover the best fabrics for your business.\n\nWhat are you looking for today?" },
    ],
    { productId: viewingProduct?.id }
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isListening, isSupported, toggle } = useSpeechToText((text) => {
    sendMessage(text);
    setInput("");
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  if (pathname === "/ai-assistant") return null;

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="mb-3 flex h-[540px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-terracotta-dark px-4 py-3.5 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold">WeaveLink AI</div>
                  <div className="flex items-center gap-1 text-[0.68rem] text-white/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/ai-assistant"
                  className="rounded-lg p-1.5 hover:bg-white/15"
                  aria-label="Expand"
                >
                  <Maximize2 size={15} />
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-white/15"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {viewingProduct && (
              <div className="flex items-center gap-1.5 border-b border-line bg-terracotta/8 px-4 py-2 text-[0.7rem] font-medium text-terracotta-dark">
                <Sparkles size={11} /> Chatting about: {viewingProduct.name}
              </div>
            )}

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[80%] whitespace-pre-line rounded-2xl rounded-tr-sm bg-terracotta-dark px-3.5 py-2.5 text-[0.85rem] text-white"
                        : "max-w-[85%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-cream px-3.5 py-2.5 text-[0.85rem] text-ink"
                    }
                  >
                    {m.text}
                    {m.products && (
                      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                        {m.products.slice(0, 3).map((pid) => {
                          const p = getProduct(pid);
                          if (!p) return null;
                          return (
                            <Link
                              key={pid}
                              href={`/marketplace/${pid}`}
                              className="overflow-hidden rounded-lg border border-line bg-white"
                            >
                              <div
                                className="h-12 w-full"
                                style={{ backgroundImage: p.image, backgroundSize: "cover" }}
                              />
                              <div className="p-1.5">
                                <div className="truncate text-[0.62rem] font-medium">{p.name}</div>
                                <div className="text-[0.6rem] text-muted">{formatINR(p.pricePerMeter)}/m</div>
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
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40"
                        style={{ animationDelay: `${i * 0.12}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-line p-3">
              <div className="flex items-center gap-2 rounded-xl border border-line bg-cream px-3 py-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything about fabrics..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
                />
                <button
                  onClick={toggle}
                  disabled={!isSupported}
                  className={cn(
                    "text-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-40",
                    isListening && "animate-pulse text-terracotta-dark"
                  )}
                  aria-label={isListening ? "Stop voice input" : "Voice search"}
                  title={isSupported ? undefined : "Voice input isn't supported in this browser"}
                >
                  <Mic size={16} />
                </button>
                <button
                  onClick={handleSend}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-terracotta-dark text-white"
                  aria-label="Send"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
              <div className="mt-1.5 text-center text-[0.65rem] text-muted">
                AI can make mistakes. Please verify important info.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-dark text-white shadow-lg"
        aria-label="Toggle AI Assistant"
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </motion.button>
    </div>
  );
}
