"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Building2,
  FileBadge2,
  ShieldCheck,
  Landmark,
  Boxes,
  SlidersHorizontal,
  ClipboardCheck,
  Lightbulb,
  Sparkles,
  Headphones,
  ArrowRight,
  ArrowLeft,
  Mail,
  User,
  Phone,
  Check,
  Upload,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "select" | "tags" | "toggle" | "textarea" | "file";
  placeholder?: string;
  options?: string[];
  icon?: React.ElementType;
}

interface StepDef {
  key: string;
  sidebarLabel: string;
  sidebarDesc: string;
  icon: React.ElementType;
  headline: string;
  subtext: string;
  why?: string;
  fields: FieldDef[];
}

const steps: StepDef[] = [
  {
    key: "welcome",
    sidebarLabel: "Welcome",
    sidebarDesc: "Let's get you started",
    icon: Home,
    headline: "Welcome to WeaveLink! 👋",
    subtext: "We'll guide you through a quick setup to help you start selling your fabrics to verified buyers.",
    why: "This helps us personalize your experience and keep your account secure.",
    fields: [
      { key: "email", label: "Business Email", type: "text", placeholder: "hello@yourcompany.com", icon: Mail },
      { key: "fullName", label: "Full Name", type: "text", placeholder: "Your full name", icon: User },
      { key: "mobile", label: "Mobile Number", type: "text", placeholder: "98765 43210", icon: Phone },
    ],
  },
  {
    key: "business",
    sidebarLabel: "Business Information",
    sidebarDesc: "Tell us about your business",
    icon: Building2,
    headline: "Tell us about your business",
    subtext: "This helps buyers understand who they're sourcing from.",
    why: "Verified business details build trust with buyers browsing the marketplace.",
    fields: [
      { key: "businessName", label: "Business Name", placeholder: "e.g. Arjun Textiles", type: "text" },
      { key: "businessType", label: "Business Type", type: "select", options: ["Manufacturer", "Mill", "Wholesaler", "Trading House"] },
      { key: "gst", label: "GST Number", placeholder: "24AABCA1234D1Z5", type: "text" },
      { key: "yearEstablished", label: "Year Established", placeholder: "e.g. 2018", type: "text" },
      { key: "companySize", label: "Company Size", type: "select", options: ["1–10 employees", "11–50 employees", "51–200 employees", "200+ employees"] },
      { key: "address", label: "Business Address", placeholder: "Street, City, State", type: "text" },
    ],
  },
  {
    key: "company",
    sidebarLabel: "Company Details",
    sidebarDesc: "Add your company profile",
    icon: FileBadge2,
    headline: "Add your company profile",
    subtext: "A complete profile helps buyers find and trust your business faster.",
    fields: [
      { key: "categories", label: "Business Categories", type: "tags", options: ["Cotton Fabrics", "Linen Fabrics", "Silk Fabrics", "Denim Fabrics", "Blended Fabrics"] },
      { key: "fabricTypes", label: "Fabric Types You Offer", type: "tags", options: ["Poplin", "Sateen", "Twill", "Canvas", "Satin"] },
      { key: "description", label: "Business Description", placeholder: "Tell buyers what makes your business unique...", type: "textarea" },
    ],
  },
  {
    key: "documents",
    sidebarLabel: "Documents & Verification",
    sidebarDesc: "Upload & verify documents",
    icon: ShieldCheck,
    headline: "Upload & verify documents",
    subtext: "We use these to verify your business and keep the marketplace trustworthy.",
    why: "Verified suppliers get a trust badge and rank higher in buyer search results.",
    fields: [
      { key: "gstCert", label: "GST Certificate", type: "file" },
      { key: "regProof", label: "Business Registration Proof", type: "file" },
      { key: "panCard", label: "PAN Card", type: "file" },
    ],
  },
  {
    key: "banking",
    sidebarLabel: "Banking Details",
    sidebarDesc: "Add your bank information",
    icon: Landmark,
    headline: "Add your bank information",
    subtext: "This is where we'll send your payouts once orders are completed.",
    why: "Your banking details are encrypted and only used for secure payouts.",
    fields: [
      { key: "accountHolder", label: "Account Holder Name", placeholder: "As per bank records", type: "text" },
      { key: "accountNumber", label: "Account Number", placeholder: "•••• •••• 4242", type: "text" },
      { key: "ifsc", label: "IFSC Code", placeholder: "e.g. HDFC0001234", type: "text" },
      { key: "bankName", label: "Bank Name", placeholder: "e.g. HDFC Bank", type: "text" },
    ],
  },
  {
    key: "capabilities",
    sidebarLabel: "Products & Capabilities",
    sidebarDesc: "What do you supply?",
    icon: Boxes,
    headline: "What do you supply?",
    subtext: "Tell us about your product range and production capacity.",
    fields: [
      { key: "productCategories", label: "Product Categories", type: "tags", options: ["Cotton", "Linen", "Silk", "Denim", "Wool", "Polyester"] },
      { key: "moq", label: "Typical MOQ", type: "select", options: ["Under 50m", "50–200m", "200–500m", "500m+"] },
      { key: "capacity", label: "Monthly Production Capacity", placeholder: "e.g. 50,000 meters", type: "text" },
    ],
  },
  {
    key: "preferences",
    sidebarLabel: "Preferences",
    sidebarDesc: "Set your preferences",
    icon: SlidersHorizontal,
    headline: "Set your preferences",
    subtext: "Fine-tune how you want to work with buyers on WeaveLink.",
    fields: [
      { key: "operatingHours", label: "Operating Hours", type: "select", options: ["Mon–Fri, 9–6", "Mon–Sat, 9–7", "24/7 Production", "Custom"] },
      { key: "buyerTypes", label: "Preferred Buyer Types", type: "tags", options: ["Retailers", "Manufacturers", "Wholesalers", "Fashion Brands", "Exporters"] },
      { key: "orderNotifications", label: "Notify me about new orders instantly", type: "toggle" },
    ],
  },
  {
    key: "review",
    sidebarLabel: "Review & Submit",
    sidebarDesc: "Almost there!",
    icon: ClipboardCheck,
    headline: "Review & submit",
    subtext: "Take a moment to confirm everything looks right before you go live.",
    fields: [],
  },
];

const quickTips: Record<string, string[]> = {
  welcome: ["What documents do I need to upload?", "How long does verification take?", "Can I save and continue later?"],
  business: ["What business types are supported?", "Is GST mandatory?", "Can I edit this later?"],
  company: ["How many categories can I add?", "What makes a good description?"],
  documents: ["What documents do I need to upload?", "How long does verification take?", "Is my data secure?"],
  banking: ["Is my banking data encrypted?", "When do payouts happen?"],
  capabilities: ["What if my MOQ varies by product?", "Can I update capacity later?"],
  preferences: ["Can I change these settings later?", "What buyer types convert best?"],
  review: ["What happens after I submit?", "Can I edit after submitting?"],
};

const aiCanned: Record<string, string> = {
  "what documents do i need to upload?":
    "You'll need:\n• GST Certificate\n• Business Registration Proof\n• PAN Card\n• Bank Details\n\nDon't worry, I'll guide you at the right step!",
  "how long does verification take?": "Verification usually takes 24–48 hours once you've submitted all documents. You can keep selling in preview mode meanwhile.",
  "can i save and continue later?": "Yes — your progress is saved automatically as you go. You can close this and pick up right where you left off.",
  "is gst mandatory?": "Yes, a valid GSTIN is required to list products and receive payouts on WeaveLink.",
  "is my data secure?": "Absolutely — all documents and banking details are encrypted in transit and at rest.",
  "when do payouts happen?": "Payouts are processed within 3–5 business days after an order is marked Completed.",
};

function aiReply(question: string) {
  const key = question.trim().toLowerCase();
  return (
    aiCanned[key] ||
    "Good question! I'll make sure the right guidance shows up as you reach that step. Feel free to continue filling in the form."
  );
}

export function SupplierOnboarding() {
  const router = useRouter();
  const { user, completeOnboarding, setOnboardingAnswers } = useAppStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({
    email: user ? "" : "",
  });
  const [chat, setChat] = useState<{ id: string; role: "user" | "ai"; text: string }[]>([
    {
      id: "greet",
      role: "ai",
      text: `Hi ${user?.name?.split(" ")[0] || "there"}! 👋\nI'll help you complete your supplier setup quickly and easily. You can ask me anything along the way.`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat]);

  const step = steps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  const setField = (key: string, value: unknown) => setAnswers((a) => ({ ...a, [key]: value }));

  const toggleTag = (key: string, value: string) => {
    setAnswers((a) => {
      const current = (a[key] as string[]) || [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...a, [key]: next };
    });
  };

  const goNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setOnboardingAnswers(answers);
      completeOnboarding();
      router.push("/dashboard");
    }
  };
  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  const askAi = (text: string) => {
    setChat((c) => [...c, { id: `u-${Date.now()}`, role: "user", text }]);
    setTimeout(() => {
      setChat((c) => [...c, { id: `a-${Date.now()}`, role: "ai", text: aiReply(text) }]);
    }, 500);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    askAi(chatInput);
    setChatInput("");
  };

  return (
    <div className="relative">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/fabric-hero.png')" }}
      />
      <div className="fixed inset-0 -z-10 bg-cream/30" />

      <div className="relative mx-auto max-w-[1600px] px-5 py-6 sm:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr_360px]">
        {/* Left: step list */}
        <div className="hidden lg:block">
          <div className="mb-1 font-serif text-xl text-ink drop-shadow-sm">Supplier Onboarding</div>
          <p className="mb-5 text-sm text-ink/70 drop-shadow-sm">Complete these steps to start selling on WeaveLink</p>

          <div className="space-y-1">
            {steps.map((s, i) => {
              const active = i === stepIndex;
              const done = i < stepIndex;
              return (
                <button
                  key={s.key}
                  onClick={() => setStepIndex(i)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition",
                    active ? "bg-terracotta/12" : "hover:bg-cream-2"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      done
                        ? "bg-emerald-700 text-white"
                        : active
                        ? "bg-terracotta-dark text-white"
                        : "bg-cream-2 text-muted"
                    )}
                  >
                    {done ? <Check size={14} /> : i === 0 ? <s.icon size={15} /> : i + 1}
                  </div>
                  <div className="min-w-0">
                    <div className={cn("text-sm font-medium text-ink drop-shadow-sm", active && "text-terracotta-dark")}>{s.sidebarLabel}</div>
                    <div className="text-xs text-ink/65 drop-shadow-sm">{s.sidebarDesc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-line bg-white p-4">
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
              <span>Onboarding Progress</span>
              <span className="text-muted">Step {stepIndex + 1} of {steps.length}</span>
            </div>
            <div className="mb-1.5 h-1.5 w-full overflow-hidden rounded-full bg-cream-2">
              <motion.div
                className="h-full bg-terracotta-dark"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="text-xs font-medium text-terracotta-dark">{progress}%</div>
          </div>

          <div className="mt-4 rounded-xl border border-line bg-white p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-cream-2">
              <Headphones size={15} />
            </div>
            <div className="mb-0.5 text-sm font-medium">Need help?</div>
            <p className="mb-3 text-xs text-muted">Our onboarding assistant is here to help you anytime.</p>
            <button
              onClick={() => document.getElementById("onboarding-ai-input")?.focus()}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-xs font-semibold"
            >
              Chat with AI Assistant <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Center: step content */}
        <div>
          <div className="mb-4 lg:hidden">
            <span className="text-xs font-semibold text-terracotta-dark">Step {stepIndex + 1} of {steps.length}</span>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-cream-2">
              <div className="h-full bg-terracotta-dark transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <span className="mb-3 inline-block rounded-full bg-terracotta/12 px-3 py-1 text-xs font-semibold text-terracotta-dark">
                Step {stepIndex + 1} of {steps.length}
              </span>
              <h1 className="mb-1.5 font-serif text-2xl text-ink drop-shadow-sm sm:text-[1.7rem]">{step.headline}</h1>
              <p className="mb-6 max-w-xl text-sm text-ink/70 drop-shadow-sm">{step.subtext}</p>

              {step.key !== "review" ? (
                <div className="rounded-2xl border border-line bg-white p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {step.fields.map((f) => (
                      <div key={f.key} className={cn(f.type === "textarea" || f.type === "tags" ? "sm:col-span-2" : "")}>
                        <label className="mb-1.5 block text-sm font-medium">
                          {f.label} {f.type !== "toggle" && <span className="text-terracotta-dark">*</span>}
                        </label>

                        {f.type === "text" && (
                          <div className="relative">
                            {f.icon && <f.icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />}
                            <input
                              value={(answers[f.key] as string) || ""}
                              onChange={(e) => setField(f.key, e.target.value)}
                              placeholder={f.placeholder}
                              className={cn(
                                "w-full rounded-xl border border-line py-2.5 text-sm outline-none focus:border-ink",
                                f.icon ? "pl-10 pr-3.5" : "px-3.5"
                              )}
                            />
                          </div>
                        )}

                        {f.type === "select" && (
                          <select
                            value={(answers[f.key] as string) || ""}
                            onChange={(e) => setField(f.key, e.target.value)}
                            className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                          >
                            <option value="">Select {f.label.toLowerCase()}</option>
                            {f.options?.map((o) => (
                              <option key={o}>{o}</option>
                            ))}
                          </select>
                        )}

                        {f.type === "textarea" && (
                          <div className="relative">
                            <textarea
                              value={(answers[f.key] as string) || ""}
                              onChange={(e) => setField(f.key, e.target.value.slice(0, 500))}
                              placeholder={f.placeholder}
                              rows={4}
                              className="w-full resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                            />
                            <div className="absolute bottom-2.5 right-3 text-[0.65rem] text-muted">
                              {((answers[f.key] as string) || "").length} / 500
                            </div>
                          </div>
                        )}

                        {f.type === "tags" && (
                          <div className="flex flex-wrap gap-2">
                            {f.options?.map((o) => {
                              const selected = ((answers[f.key] as string[]) || []).includes(o);
                              return (
                                <button
                                  key={o}
                                  type="button"
                                  onClick={() => toggleTag(f.key, o)}
                                  className={cn(
                                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                                    selected ? "border-ink bg-ink text-white" : "border-line text-ink/70 hover:border-ink/40"
                                  )}
                                >
                                  {o}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {f.type === "file" && (
                          <button
                            type="button"
                            onClick={() => setField(f.key, true)}
                            className={cn(
                              "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-4 text-sm font-medium transition",
                              answers[f.key]
                                ? "border-emerald-600 bg-emerald-700/8 text-emerald-800"
                                : "border-line text-ink/70 hover:border-ink/40"
                            )}
                          >
                            {answers[f.key] ? (
                              <>
                                <Check size={15} /> Uploaded
                              </>
                            ) : (
                              <>
                                <Upload size={15} /> Upload file
                              </>
                            )}
                          </button>
                        )}

                        {f.type === "toggle" && (
                          <button
                            type="button"
                            onClick={() => setField(f.key, !answers[f.key])}
                            className={cn(
                              "h-6 w-11 rounded-full transition",
                              answers[f.key] ? "bg-emerald-600" : "bg-cream-2"
                            )}
                          >
                            <span
                              className={cn(
                                "block h-5 w-5 translate-x-0.5 rounded-full bg-white transition",
                                Boolean(answers[f.key]) && "translate-x-[22px]"
                              )}
                            />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {step.why && (
                    <div className="mt-5 flex items-start gap-3 rounded-xl bg-cream p-4">
                      <Lightbulb size={18} className="mt-0.5 shrink-0 text-terracotta-dark" />
                      <div>
                        <div className="text-sm font-semibold">Why do we need this?</div>
                        <p className="text-xs text-muted">{step.why}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-line bg-white p-6">
                  <div className="mb-4 flex items-center gap-2 text-emerald-700">
                    <ClipboardCheck size={18} />
                    <span className="text-sm font-semibold">Everything looks ready to submit</span>
                  </div>
                  <div className="divide-y divide-line text-sm">
                    {steps.slice(0, -1).map((s) => (
                      <div key={s.key} className="flex items-center justify-between py-2.5">
                        <span className="text-muted">{s.sidebarLabel}</span>
                        <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                          <Check size={14} /> Complete
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-muted">
                    Submitting will send your documents for verification (usually 24–48 hours) and take you to your
                    supplier dashboard right away — you can start listing products immediately.
                  </p>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={goBack}
                  disabled={stepIndex === 0}
                  className="flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-medium disabled:opacity-40"
                >
                  <ArrowLeft size={15} /> Back
                </button>
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white"
                >
                  {step.key === "review" ? "Submit & Go to Dashboard" : "Continue"} <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: AI onboarding assistant */}
        <div className="hidden lg:block">
          <div className="flex h-[calc(100vh-140px)] max-h-[760px] flex-col rounded-2xl border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles size={16} className="text-terracotta-dark" /> Onboarding Assistant
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
              </span>
            </div>

            <div ref={chatScrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {chat.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={cn(
                      "max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[0.85rem]",
                      m.role === "user" ? "rounded-tr-sm bg-terracotta-dark text-white" : "rounded-tl-sm bg-cream text-ink"
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2 pt-1">
                {(quickTips[step.key] || []).map((q) => (
                  <button
                    key={q}
                    onClick={() => askAi(q)}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink/75 hover:border-terracotta-dark hover:text-terracotta-dark"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-line p-3.5">
              <div className="flex items-center gap-2 rounded-xl border border-line bg-cream px-3 py-2">
                <input
                  id="onboarding-ai-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
                />
                <button
                  onClick={sendChat}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-terracotta-dark text-white"
                  aria-label="Send"
                >
                  <Send size={13} />
                </button>
              </div>
              <div className="mt-1.5 text-center text-[0.62rem] text-muted">Your data is safe and secure with us.</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}