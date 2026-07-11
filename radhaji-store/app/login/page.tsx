"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { sendOTP, verifyOTP } from "@/lib/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await sendOTP(email);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("OTP sent to your email!");
    setStep("otp");
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    const { error } = await verifyOTP(email, otp);
    setLoading(false);
    if (error) {
      toast.error("Invalid or expired OTP. Try again.");
      return;
    }
    toast.success("Login successful!");
    router.push("/profile");
    router.refresh();
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
              <div className="font-black text-white text-2xl tracking-[0.2em] leading-none">RADHAJI</div>
              <div className="text-[9px] text-zinc-500 tracking-[0.3em]">PREMIUM ACTIVEWEAR</div>
            </div>
          </Link>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-8">
          {step === "email" ? (
            <>
              <h1 className="text-xl font-black tracking-widest uppercase text-white mb-1">
                Login / Register
              </h1>
              <p className="text-zinc-500 text-sm mb-8">
                Enter your email — we'll send a one-time password.
              </p>

              <form onSubmit={handleSendOTP} className="space-y-4">
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
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm tracking-widest uppercase py-3.5 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>SEND OTP <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-2 mt-6 text-zinc-600 text-xs justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                No password needed — secure OTP login
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep("email"); setOtp(""); }}
                className="text-xs text-zinc-500 hover:text-white tracking-widest uppercase flex items-center gap-1 mb-6 transition-colors"
              >
                ← Change Email
              </button>

              <h1 className="text-xl font-black tracking-widest uppercase text-white mb-1">
                Enter OTP
              </h1>
              <p className="text-zinc-500 text-sm mb-2">
                We sent a 6-digit code to
              </p>
              <p className="text-red-400 font-bold text-sm mb-8">{email}</p>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">
                    6-Digit OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    autoFocus
                    placeholder="123456"
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-2xl font-black tracking-[0.5em] text-center px-4 py-4 focus:outline-none focus:border-red-500 placeholder:text-zinc-700 placeholder:tracking-normal"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm tracking-widest uppercase py-3.5 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>VERIFY & LOGIN <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full text-zinc-500 hover:text-white text-xs tracking-widest uppercase py-2 transition-colors"
                >
                  Resend OTP
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
