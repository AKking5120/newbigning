"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "MEN",
    slug: "men",
    sub: "SHOP NOW",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  },
  {
    name: "WOMEN",
    slug: "women",
    sub: "SHOP NOW",
    image:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80",
  },
  {
    name: "ACCESSORIES",
    slug: "accessories",
    sub: "SHOP NOW",
    image:
      "https://images.unsplash.com/photo-1553545985-1e0d8781d5db?w=600&q=80",
  },
  {
    name: "COLLECTIONS",
    slug: "collections",
    sub: "SHOP NOW",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-16 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-1">
              DISCOVER
            </p>
            <h2 className="text-3xl font-black tracking-tight uppercase text-white">
              SHOP BY CATEGORY
            </h2>
          </div>
          <Link
            href="/store"
            className="text-xs font-bold tracking-widest text-red-500 hover:text-red-400 flex items-center gap-1 uppercase"
          >
            EXPLORE ALL <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                href={`/store?category=${cat.slug}`}
                className="group relative block overflow-hidden aspect-[3/4]"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 brightness-75"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 flex items-end justify-between w-full">
                  <div>
                    <p className="text-white font-black text-lg tracking-widest uppercase">
                      {cat.name}
                    </p>
                    <p className="text-zinc-400 text-xs tracking-wider">{cat.sub}</p>
                  </div>
                  <div className="w-8 h-8 bg-red-600 flex items-center justify-center rounded-full flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
