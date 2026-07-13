"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, ShieldCheck, CheckCircle, MailOpen } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setErrorMsg("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();

      // Determine correct redirect URL
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        toast.error(error.message);
        return;
      }

      setSent(true);
      toast.success("Magic link sent! Check your email.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-red-600 flex items-center justify-center font-black text-white">
              X
            </div>
            <div className="text-left">
              <div className="font-black text-white text-2xl tracking-[0.2em] leading-none">
                RADHAJI
              </div>
              <div className="text-[9px] text-zinc-500 tracking-[0.3em]">
                PREMIUM ACTIVEWEAR
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-8">

          {!sent ? (
            <>
              <h1 className="text-xl font-black tracking-widest uppercase text-white mb-1">
                Login / Register
              </h1>
              <p className="text-zinc-500 text-sm mb-2">
                Enter your email — we&apos;ll send a secure login link.
              </p>
              <p className="text-zinc-600 text-xs mb-8">
                New user? Account will be created automatically.
              </p>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-600/10 border border-red-600/30 text-red-400 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSendLink} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      placeholder="you@example.com"
                      className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-red-500 placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm tracking-widest uppercase py-4 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>SEND LOGIN LINK <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-2 mt-6 text-zinc-600 text-xs justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                No password needed — 1-click magic link login
              </div>
            </>
          ) : (
            /* ── Sent State ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-2"
            >
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <MailOpen className="w-8 h-8 text-red-500" />
              </div>

              <h2 className="text-lg font-black tracking-widest uppercase text-white mb-2">
                Check Your Email!
              </h2>
              <p className="text-zinc-400 text-sm mb-1">Login link sent to:</p>
              <p className="text-red-400 font-black text-sm mb-6 tracking-wide">
                {email}
              </p>

              {/* Steps */}
              <div className="bg-zinc-900 border border-zinc-800 p-5 text-left space-y-3 mb-6">
                {[
                  "Open the email from RADHAJI",
                  'Click the "Sign in" button in the email',
                  "You\'ll be logged in automatically ✓",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-red-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-zinc-400 text-xs leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 justify-center text-zinc-600 text-xs mb-5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                Link expires in 1 hour · Check spam if not received
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSendLink}
                  disabled={loading}
                  className="w-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-xs font-bold tracking-widest uppercase py-3 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Resend Link"}
                </button>
                <button
                  onClick={() => { setSent(false); setEmail(""); setErrorMsg(""); }}
                  className="w-full text-zinc-600 hover:text-zinc-400 text-xs tracking-widest uppercase py-2 transition-colors"
                >
                  Use Different Email
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
