"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const features = [
  { icon: "🌬️", title: "BREATHABLE", sub: "Stay Cool" },
  { icon: "✚", title: "4 WAY STRETCH", sub: "Move Freely" },
  { icon: "⚡", title: "QUICK DRY", sub: "Stay Dry" },
  { icon: "🛡️", title: "ODOR CONTROL", sub: "Stay Fresh" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-red-500 text-xs font-bold tracking-[0.4em] uppercase mb-4 flex items-center gap-2"
          >
            <span className="w-8 h-px bg-red-500 inline-block" />
            PREMIUM PERFORMANCE
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <span className="text-white block">ENGINEERED</span>
            <span className="text-white block">FOR</span>
            <span className="text-red-500 block">EVERY</span>
            <span className="text-red-500 block">SUMMIT</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-zinc-400 text-base max-w-md"
          >
            Advanced fabrics. Bold design. Unmatched performance. For those who
            rise above.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <Link
              href="/store"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-widest uppercase px-8 py-4 transition-colors"
            >
              SHOP COLLECTION
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/store?newArrival=true"
              className="inline-flex items-center gap-2 border border-white text-white hover:bg-white hover:text-black font-black text-sm tracking-widest uppercase px-8 py-4 transition-colors"
            >
              EXPLORE NEW ARRIVALS
            </Link>
          </motion.div>
        </div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4"
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-3 bg-black/50 border border-zinc-800 px-4 py-3 backdrop-blur-sm"
            >
              <span className="text-lg">{f.icon}</span>
              <div>
                <p className="text-white text-xs font-black tracking-widest">
                  {f.title}
                </p>
                <p className="text-zinc-500 text-xs">{f.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 transition-all ${i === 0 ? "w-8 bg-red-600" : "w-4 bg-zinc-600"}`}
          />
        ))}
      </div>
    </section>
  );
}
