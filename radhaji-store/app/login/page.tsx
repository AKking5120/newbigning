"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, ShieldCheck, CheckCircle } from "lucide-react";
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
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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
              <p className="text-zinc-500 text-sm mb-8">
                Enter your email — we&apos;ll send you a secure login link.
                <br />
                <span className="text-zinc-600 text-xs">New user? Account will be created automatically.</span>
              </p>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-600/10 border border-red-600/30 text-red-400 text-xs rounded">
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
                    <>
                      SEND LOGIN LINK <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-2 mt-6 text-zinc-600 text-xs justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                No password needed — secure magic link login
              </div>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-lg font-black tracking-widest uppercase text-white mb-2">
                Check Your Email!
              </h2>
              <p className="text-zinc-400 text-sm mb-1">
                We sent a login link to:
              </p>
              <p className="text-red-400 font-bold text-sm mb-6">{email}</p>

              <div className="bg-zinc-900 border border-zinc-800 p-4 text-left space-y-2 mb-6">
                <p className="text-xs text-zinc-400 flex items-center gap-2">
                  <span className="text-red-500 font-bold">1.</span>
                  Open the email from RADHAJI
                </p>
                <p className="text-xs text-zinc-400 flex items-center gap-2">
                  <span className="text-red-500 font-bold">2.</span>
                  Click the &quot;Sign in&quot; button
                </p>
                <p className="text-xs text-zinc-400 flex items-center gap-2">
                  <span className="text-red-500 font-bold">3.</span>
                  You&apos;ll be logged in automatically
                </p>
              </div>

              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="w-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-xs font-bold tracking-widest uppercase py-3 transition-colors"
              >
                Use Different Email
              </button>

              <button
                onClick={handleSendLink}
                disabled={loading}
                className="w-full mt-2 text-zinc-600 hover:text-zinc-400 text-xs tracking-widest uppercase py-2 transition-colors"
              >
                {loading ? "Sending..." : "Resend Link"}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
