"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SupplierOnboarding } from "@/components/SupplierOnboarding";

interface Step {
  key: string;
  question: string;
  options: string[];
  multi?: boolean;
}

const buyerSteps: Step[] = [
  { key: "businessType", question: "What type of business do you run?", options: ["Retailer", "Manufacturer", "Wholesaler", "Fashion Brand"] },
  { key: "industry", question: "Which industry are you sourcing for?", options: ["Apparel", "Home Textiles", "Upholstery", "Accessories"] },
  { key: "categories", question: "Which fabric categories interest you most?", options: ["Cotton", "Linen", "Silk", "Denim", "Wool", "Polyester"], multi: true },
  { key: "quantity", question: "What's your typical order quantity?", options: ["Under 100m", "100–500m", "500–2000m", "2000m+"] },
  { key: "budget", question: "What's your usual budget range per meter?", options: ["Under ₹150", "₹150–350", "₹350–600", "₹600+"] },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAppStore();

  if (user?.role === "supplier") {
    return <SupplierOnboarding />;
  }

  return <BuyerOnboarding router={router} completeOnboarding={completeOnboarding} />;
}

function BuyerOnboarding({
  router,
  completeOnboarding,
}: {
  router: ReturnType<typeof useRouter>;
  completeOnboarding: () => void;
}) {
  const steps = buyerSteps;
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [textInput, setTextInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [stepIndex]);

  const step = steps[stepIndex];
  const done = stepIndex >= steps.length;

  const selectOption = (opt: string) => {
    setAnswers((a) => {
      const current = a[step.key] || [];
      if (step.multi) {
        const next = current.includes(opt) ? current.filter((c) => c !== opt) : [...current, opt];
        return { ...a, [step.key]: next };
      }
      return { ...a, [step.key]: [opt] };
    });
    if (!step.multi) {
      setTimeout(() => setStepIndex((i) => i + 1), 250);
    }
  };

  const submitText = () => {
    if (!textInput.trim()) return;
    setAnswers((a) => ({ ...a, [step.key]: [textInput.trim()] }));
    setTextInput("");
    setStepIndex((i) => i + 1);
  };

  const finish = () => {
    completeOnboarding();
    router.push("/marketplace");
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-2xl flex-col px-5 py-10 sm:px-8">
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/12 px-3 py-1.5 text-xs font-semibold text-terracotta-dark">
          <Sparkles size={13} /> AI-Guided Onboarding
        </span>
        <h1 className="mt-3 font-serif text-3xl">
          Let&apos;s personalize your marketplace
        </h1>
        <p className="mt-1.5 text-sm text-muted">A few quick questions — answer by tapping, or type your own.</p>
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-cream-2">
        <motion.div
          className="h-full bg-terracotta-dark"
          animate={{ width: `${Math.min((stepIndex / steps.length) * 100, 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-line bg-white p-5">
        {steps.slice(0, stepIndex + 1).map((s, idx) => (
          <div key={s.key} className="space-y-2.5">
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-cream px-4 py-2.5 text-sm">{s.question}</div>
            </div>
            {answers[s.key] && (
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-terracotta-dark px-4 py-2.5 text-sm text-white">
                  {answers[s.key].join(", ")}
                </div>
              </div>
            )}
            {idx === stepIndex && !done && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {s.options.length > 0 ? (
                    <>
                      {s.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => selectOption(opt)}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition",
                            (answers[s.key] || []).includes(opt)
                              ? "border-ink bg-ink text-white"
                              : "border-line text-ink/75 hover:border-ink/50"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                      {s.multi && (
                        <button
                          onClick={() => setStepIndex((i) => i + 1)}
                          disabled={!(answers[s.key] || []).length}
                          className="rounded-full bg-terracotta-dark px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                        >
                          Continue
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex w-full gap-2">
                      <input
                        autoFocus
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitText()}
                        placeholder="Type your answer..."
                        className="flex-1 rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                      />
                      <button
                        onClick={submitText}
                        className="rounded-xl bg-ink px-4 text-white"
                        aria-label="Submit"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        ))}

        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 text-center">
            <div className="mb-3 text-2xl">🎉</div>
            <div className="mb-1 font-semibold">You&apos;re all set!</div>
            <p className="mb-4 text-sm text-muted">
              We&apos;ve personalized your marketplace based on your answers.
            </p>
            <button
              onClick={finish}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
            >
              Explore Marketplace
            </button>
          </motion.div>
        )}
      </div>

      <button
        onClick={finish}
        className="mt-4 self-center text-xs text-muted underline underline-offset-2"
      >
        Skip for now
      </button>
    </div>
  );
}