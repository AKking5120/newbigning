"use client";

import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    text: '"The quality is unmatched. The AeroFlex Jacket has become my go-to for every outdoor adventure."',
    name: "Arjun M.",
    city: "Mumbai",
    rating: 5,
  },
  {
    text: '"Finally, activewear that performs as well as it looks. Worth every rupee."',
    name: "Priya S.",
    city: "Delhi",
    rating: 5,
  },
  {
    text: '"The ThermoShield technology is incredible. Stays warm without the bulk."',
    name: "Karan D.",
    city: "Bangalore",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-1">
              TESTIMONIALS
            </p>
            <h2 className="text-3xl font-black tracking-tight uppercase text-black">
              WHAT OUR CUSTOMERS SAY
            </h2>
          </div>
          <Link
            href="/store"
            className="text-xs font-bold tracking-widest text-red-600 hover:text-red-700 flex items-center gap-1 uppercase"
          >
            VIEW ALL <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="border border-zinc-200 p-6"
            >
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 text-zinc-300" />
                ))}
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed italic">
                {t.text}
              </p>
              <div className="mt-4">
                <p className="text-xs font-black text-black uppercase tracking-wider">
                  — {t.name}
                </p>
                <p className="text-xs text-zinc-500">{t.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
