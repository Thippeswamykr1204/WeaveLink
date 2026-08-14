"use client";

import { useState, useCallback } from "react";
import { ChatMessage } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";

let idCounter = 0;
const nextId = () => `msg-${Date.now()}-${idCounter++}`;

const FALLBACK_TEXT =
  "Sorry, I'm having trouble reaching the AI assistant right now. Please try again in a moment.";

// Calls the server-side /api/ai-chat route (HF_API_KEY), grounded in the real
// product catalog. Falls back to a graceful message on any failure.
async function getAiResponse(
  history: ChatMessage[],
  userText: string,
  user: { name?: string; role?: "buyer" | "supplier" } | null,
  productId?: string
): Promise<ChatMessage> {
  try {
    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history.map((m) => ({ role: m.role, text: m.text })),
        userMessage: userText,
        user: user ? { name: user.name, role: user.role } : null,
        productId: productId ?? null,
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error("[useAiChat] /api/ai-chat error", res.status, errBody);
      return { id: nextId(), role: "ai", text: FALLBACK_TEXT };
    }

    const data: { text: string; products: string[] } = await res.json();
    return { id: nextId(), role: "ai", text: data.text, products: data.products?.length ? data.products : undefined };
  } catch (err) {
    console.error("[useAiChat] Failed to reach /api/ai-chat", err);
    return { id: nextId(), role: "ai", text: FALLBACK_TEXT };
  }
}

export interface AiChatContext {
  /** id of the product currently being viewed, if any — grounds Q&A like
   * "tell me about this fabric" without the model having to guess/search. */
  productId?: string;
}

export function useAiChat(initial: ChatMessage[] = [], context: AiChatContext = {}) {
  const { user } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      const userMsg: ChatMessage = { id: nextId(), role: "user", text };
      const history = messages;
      setMessages((m) => [...m, userMsg]);
      setIsTyping(true);
      try {
        const reply = await getAiResponse(
          history,
          text,
          user ? { name: user.name, role: user.role } : null,
          context.productId
        );
        setMessages((m) => [...m, reply]);
      } finally {
        setIsTyping(false);
      }
    },
    [messages, user, context.productId]
  );

  const reset = useCallback(() => setMessages(initial), [initial]);

  return { messages, isTyping, sendMessage, reset };
}
