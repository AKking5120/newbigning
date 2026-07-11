"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Package, Truck, Mail } from "lucide-react";

export function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") ?? "RJXXXXXXXX";
  const isDemo = searchParams.get("demo") === "true";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 text-center"
      >
        {/* Check icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
          className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </motion.div>

        <h1 className="text-2xl font-black tracking-widest uppercase text-white mb-2">
          ORDER CONFIRMED!
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          Thank you for choosing RADHAJI. Your gear is on the way.
        </p>

        {/* Demo notice */}
        {isDemo && (
          <div className="border border-zinc-700 bg-zinc-900/60 text-zinc-400 text-xs px-4 py-2 mb-6 leading-relaxed">
            DEMO MODE — Add Razorpay keys in .env to enable real payments
          </div>
        )}

        {/* Order ID */}
        <div className="bg-[#0a0a0a] border border-zinc-800 py-4 px-6 mb-6">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500 mb-1">
            ORDER ID
          </p>
          <p className="text-red-500 font-black text-xl tracking-[0.2em]">
            {orderNumber}
          </p>
        </div>

        {/* Details */}
        <div className="text-left space-y-3 mb-8">
          {[
            { icon: Package, text: "Estimated delivery: 3-5 business days" },
            { icon: Truck, text: "Free shipping applied" },
            { icon: Mail, text: "Confirmation sent to your email" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <Icon className="w-3 h-3 text-red-500" />
              </div>
              {text}
            </div>
          ))}
        </div>

        <Link
          href="/store"
          className="block w-full bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-widest uppercase py-4 transition-colors"
        >
          CONTINUE SHOPPING
        </Link>
      </motion.div>
    </div>
  );
}
