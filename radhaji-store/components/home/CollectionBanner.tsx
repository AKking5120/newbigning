"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const tabs = ["ALL", "MEN", "WOMEN", "ACCESSORIES"];

export function CollectionBanner() {
  return (
    <section
      className="relative py-24 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/85" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-red-500 text-xs font-bold tracking-[0.5em] uppercase mb-3"
        >
          THE COLLECTION
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-6xl font-black uppercase leading-tight"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          <span className="text-white">GEAR UP FOR </span>
          <span className="text-red-500">GREATNESS</span>
        </motion.h2>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mt-8 flex-wrap"
        >
          {tabs.map((tab, i) => (
            <Link
              key={tab}
              href={tab === "ALL" ? "/store" : `/store?category=${tab.toLowerCase()}`}
              className={`px-6 py-2 text-xs font-black tracking-widest uppercase transition-colors ${
                i === 0
                  ? "bg-red-600 text-white"
                  : "border border-zinc-600 text-zinc-300 hover:border-white hover:text-white"
              }`}
            >
              {tab}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
