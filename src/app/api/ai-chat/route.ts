import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/mockData";

// Server-only. HF_API_KEY must never be exposed to the client — this file
// only ever runs on the server (Next.js route handler), and the key is read
// from process.env, never returned in any response body.
//
// Uses Hugging Face's OpenAI-compatible router (chat completions) so we can
// swap the underlying open-source model via one env var / string change,
// with no change to prompt-building or response-parsing logic below.
const HF_API_KEY = process.env.HF_API_KEY;
const HF_ROUTER_URL = "https://router.huggingface.co/v1/chat/completions";
// Open-source instruct model. Swap freely — e.g. "Qwen/Qwen2.5-7B-Instruct"
// or "mistralai/Mistral-7B-Instruct-v0.3" — no other code changes needed.
const MODEL = process.env.HF_MODEL || "meta-llama/Llama-3.1-8B-Instruct";

interface IncomingMessage {
  role: "user" | "ai";
  text: string;
}

interface RequestBody {
  messages: IncomingMessage[];
  userMessage: string;
  user: { name?: string; role?: "buyer" | "supplier" } | null;
  /** id of the product the user is currently viewing, if the chat was opened
   * from a product detail page — grounds "this fabric" style questions. */
  productId?: string | null;
}

function stockStatus(stock: number): string {
  if (stock <= 0) return "Out of Stock";
  if (stock < 2000) return "Low Stock";
  return "In Stock";
}

function buildCatalogSummary(): string {
  return products
    .map(
      (p) =>
        `- id:${p.id} | ${p.name} | category:${p.category} | ₹${p.pricePerMeter}/m (bulk ₹${p.bulkPrice} at ${p.bulkMinQty}+) | GSM:${p.gsm} | material:${p.material} | MOQ:${p.moq} | ${stockStatus(p.stock)}`
    )
    .join("\n");
}

function buildViewingContext(productId?: string | null): string {
  if (!productId) return "";
  const p = products.find((prod) => prod.id === productId);
  if (!p) return "";
  return `The user is currently viewing this product: ${p.name} — category: ${p.category}, material: ${p.material}, GSM: ${p.gsm}, weave: ${p.weave}, finish: ${p.finish}, price: ₹${p.pricePerMeter}/m (bulk ₹${p.bulkPrice} at ${p.bulkMinQty}+), MOQ: ${p.moq}, stock: ${stockStatus(p.stock)}, supplier: ${p.supplier}. If the user asks about "this fabric", "this product", or similar without naming it, assume they mean this product and answer using these details — you don't need to search the catalog again for it.\n\n`;
}

function buildSystemPrompt(user: RequestBody["user"], productId?: string | null): string {
  const catalog = buildCatalogSummary();
  const userLine = user?.name
    ? `You are speaking with ${user.name}, who is signed in as a ${user.role ?? "guest"}.`
    : "You are speaking with a signed-out visitor.";
  const viewingContext = buildViewingContext(productId);

  return `You are the WeaveLink AI Assistant, a sourcing assistant for a B2B textile/fabric marketplace.

${userLine}

${viewingContext}Here is the real product catalog you must use. Only recommend products that
appear in this list — never invent products, ids, prices, or specs that
aren't listed here:
${catalog}

Rules:
- Only recommend or reference products from the catalog above.
- Stay strictly on-topic: fabrics, sourcing, pricing, MOQ, suppliers, and the
  WeaveLink marketplace. If asked something unrelated, politely redirect to
  how you can help with sourcing fabrics.
- Keep responses concise — a few sentences, not long essays.
- When you recommend specific products, mention them by name naturally in
  the text.
- After your reply, on a new final line, output EXACTLY one line in this
  machine-readable format (used to render product cards) and nothing else
  after it:
  PRODUCT_IDS: id1,id2,id3
  Only include ids that exist in the catalog above (0-5 ids). If none are
  relevant, output: PRODUCT_IDS:`;
}

function parseProductIds(rawText: string): { text: string; productIds: string[] } {
  const marker = "PRODUCT_IDS:";
  const idx = rawText.lastIndexOf(marker);
  if (idx === -1) {
    return { text: rawText.trim(), productIds: [] };
  }
  const text = rawText.slice(0, idx).trim();
  const idsLine = rawText.slice(idx + marker.length).trim();
  const validIds = new Set(products.map((p) => p.id));
  const productIds = idsLine
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && validIds.has(s));
  return { text, productIds };
}

export async function POST(req: NextRequest) {
  if (!HF_API_KEY) {
    console.error("[api/ai-chat] Missing HF_API_KEY env var");
    return NextResponse.json(
      { error: "AI assistant is not configured on the server." },
      { status: 500 }
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const userMessage = (body.userMessage ?? "").trim();
  if (!userMessage) {
    return NextResponse.json({ error: "userMessage is required." }, { status: 400 });
  }

  try {
    const history = (body.messages ?? []).slice(-10).map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: m.text,
    }));

    const hfResponse = await fetch(HF_ROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt(body.user ?? null, body.productId ?? null) },
          ...history,
          { role: "user", content: userMessage },
        ],
        max_tokens: 400,
        temperature: 0.6,
      }),
    });

    if (!hfResponse.ok) {
      const errBody = await hfResponse.text().catch(() => "");
      console.error(`[api/ai-chat] HF router request failed (${hfResponse.status})`, errBody);
      return NextResponse.json(
        { error: "Failed to reach the AI assistant." },
        { status: 502 }
      );
    }

    const data = await hfResponse.json();
    const rawText: string = data?.choices?.[0]?.message?.content ?? "";

    if (!rawText) {
      console.error("[api/ai-chat] Empty response from HF router", JSON.stringify(data));
      return NextResponse.json(
        { error: "AI assistant returned an empty response." },
        { status: 502 }
      );
    }

    const { text, productIds } = parseProductIds(rawText);

    return NextResponse.json({ text, products: productIds });
  } catch (err) {
    console.error("[api/ai-chat] HF request failed", err);
    return NextResponse.json(
      { error: "Failed to reach the AI assistant." },
      { status: 502 }
    );
  }
}