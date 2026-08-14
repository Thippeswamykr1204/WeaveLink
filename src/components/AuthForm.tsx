"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Building2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "./Header";
import { useAppStore, UserRole } from "@/lib/store";
import { cn } from "@/lib/utils";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const randomLetter = () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

type Mode = "login" | "register";

interface Errors {
  [key: string]: string;
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const login = useAppStore((s) => s.login);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [remember, setRemember] = useState(true);
  const [avatarLetters, setAvatarLetters] = useState(["S", "K", "M"]);
  useEffect(() => {
    setAvatarLetters([randomLetter(), randomLetter(), randomLetter()]);
  }, []);

  const validate = () => {
    const e: Errors = {};
    if (mode === "register" && !company.trim()) e.company = "Business name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    login({
      name: name || email.split("@")[0],
      company: company || "Arjun Clothing Co.",
      role,
      onboarded: false,
    });
    if (mode === "register") {
      // Additive persistence only — does not replace or affect login()/session.
      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || email.split("@")[0],
          company: company || "Arjun Clothing Co.",
          role,
          email,
          onboarded: false,
        }),
      }).catch((err) => console.error("Failed to persist user record:", err));
    }
    router.push("/onboarding");
  };

  return (
    <div className="grid h-screen overflow-hidden lg:grid-cols-[55%_45%]">
      {/* Left branding panel */}
      <div className="relative hidden overflow-hidden bg-cream-2 lg:block">
        <div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{
            backgroundImage: "url('/images/fabric-stack.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 flex h-full flex-col justify-between py-12 pl-12 pr-8">
          <div>
            <Logo />
            <div className="mt-8 max-w-md">
              <h1 className="font-serif text-4xl leading-[1.12]">
                Connecting textiles.
                <br />
                <span className="text-terracotta-dark">Growing businesses.</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                WeaveLink is the trusted marketplace where buyers discover premium fabrics and suppliers grow their business globally.
              </p>
              <div className="mt-8 space-y-5">
                {[
                  { icon: Building2, title: "Premium Fabrics", desc: "10,000+ quality fabrics across all categories." },
                  { icon: Users, title: "Verified Suppliers", desc: "Connect with 2,000+ trusted textile suppliers." },
                  { icon: Lock, title: "Secure & Reliable", desc: "Safe transactions and reliable business." },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-terracotta-dark">
                      <f.icon size={17} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{f.title}</div>
                      <div className="text-xs text-ink/60">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
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
              <div className="text-xs font-semibold">Trusted by 2,500+ businesses worldwide</div>
              <div className="text-xs text-ink/60">★★★★★ 4.8/5</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex h-screen flex-col items-center justify-center overflow-y-auto bg-white px-5 py-6 sm:px-10 scrollbar-hide">
        <div className="mb-4 flex w-full max-w-md items-center justify-between lg:hidden">
          <Logo />
        </div>
        <div className="mb-2 flex w-full max-w-md justify-end text-sm text-muted">English</div>

        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md overflow-y-auto rounded-3xl border border-line p-6 shadow-sm scrollbar-hide"
          style={{ maxHeight: "min(72vh, 640px)" }}
        >
          <div className="mb-6 flex rounded-full bg-cream p-1">
            <Link
              href="/login"
              className={cn(
                "flex-1 rounded-full py-2 text-center text-sm font-semibold transition",
                mode === "login" ? "bg-ink text-white" : "text-ink/60"
              )}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={cn(
                "flex-1 rounded-full py-2 text-center text-sm font-semibold transition",
                mode === "register" ? "bg-ink text-white" : "text-ink/60"
              )}
            >
              Register
            </Link>
          </div>

          <div className="mb-6 text-center">
            <h2 className="font-serif text-2xl">
              {mode === "login" ? "Welcome back 👋" : "Create your account"}
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              {mode === "login"
                ? "Login to continue your textile sourcing journey"
                : "Join WeaveLink and start sourcing fabrics today"}
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            {["Google", "Microsoft"].map((provider) => (
              <div key={provider} className="group relative">
                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm font-medium text-ink/40"
                >
                  {provider}
                </button>
                <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-[0.7rem] text-white opacity-0 transition group-hover:opacity-100">
                  Coming soon
                </div>
              </div>
            ))}
          </div>
          <div className="mb-5 flex items-center gap-3 text-xs text-muted">
            <div className="h-px flex-1 bg-line" /> or continue with email <div className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === "register" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["buyer", "supplier"] as UserRole[]).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        className={cn(
                          "rounded-xl border py-2.5 text-sm font-medium capitalize transition",
                          role === r
                            ? "border-ink bg-ink text-white"
                            : "border-line text-ink/70 hover:border-ink/40"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Full name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Business name</label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Arjun Clothing Co."
                    className={cn(
                      "w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-ink",
                      errors.company ? "border-red-400" : "border-line"
                    )}
                  />
                  {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
                </div>
              </>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={cn(
                    "w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-ink",
                    errors.email ? "border-red-400" : "border-line"
                  )}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                {mode === "login" && (
                  <Link href="/login" className="text-xs font-medium text-terracotta-dark">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={cn(
                    "w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm outline-none focus:border-ink",
                    errors.password ? "border-red-400" : "border-line"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {mode === "login" && (
              <label className="flex items-center gap-2 text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#1C1712]"
                />
                Remember me
              </label>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-semibold text-white transition hover:bg-ink/85"
            >
              {mode === "login" ? "Login to your account" : "Create account"} <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            {mode === "login" ? (
              <>Don&apos;t have an account? <Link href="/register" className="font-medium text-terracotta-dark">Register now</Link></>
            ) : (
              <>Already have an account? <Link href="/login" className="font-medium text-terracotta-dark">Login</Link></>
            )}
          </p>
        </motion.div>

        <div className="mt-3 flex w-full max-w-md items-center gap-3 rounded-2xl bg-cream px-4 py-3 text-xs text-ink/70">
          <Lock size={15} className="shrink-0 text-terracotta-dark" />
          <div>
            <span className="font-medium text-ink">Your data is protected with enterprise-grade security.</span>{" "}
            We never share your information with anyone.
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}