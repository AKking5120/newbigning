"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  {
    label: "MEN",
    href: "/store?category=men",
    children: [
      { label: "Performance Gear", href: "/store?category=men&sub=performance" },
      { label: "Lifestyle Gear", href: "/store?category=men&sub=lifestyle" },
      { label: "Compression", href: "/store?category=men&sub=compression" },
    ],
  },
  {
    label: "WOMEN",
    href: "/store?category=women",
    children: [
      { label: "Sports Bras", href: "/store?category=women&sub=sports-bras" },
      { label: "Leggings", href: "/store?category=women&sub=leggings" },
      { label: "Tops", href: "/store?category=women&sub=tops" },
    ],
  },
  { label: "ACCESSORIES", href: "/store?category=accessories" },
  { label: "COLLECTIONS", href: "/store?category=collections" },
  { label: "NEW ARRIVALS", href: "/store?newArrival=true", highlight: true },
  { label: "BEST SELLERS", href: "/store?bestseller=true" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menOpen, setMenOpen] = useState(false);
  const [womensOpen, setWomensOpen] = useState(false);
  const { getTotalItems, openCart } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-40 bg-black border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-red-600 flex items-center justify-center font-black text-white text-sm">
              X
            </div>
            <div>
              <div className="font-black text-white text-xl tracking-[0.2em] leading-none">
                RADHAJI
              </div>
              <div className="text-[9px] text-zinc-500 tracking-[0.3em] leading-none font-medium">
                PREMIUM ACTIVEWEAR
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => {
                    if (link.label === "MEN") setMenOpen(true);
                    if (link.label === "WOMEN") setWomensOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (link.label === "MEN") setMenOpen(false);
                    if (link.label === "WOMEN") setWomensOpen(false);
                  }}
                >
                  <button className="flex items-center gap-1 text-xs font-bold tracking-widest text-zinc-300 hover:text-white transition-colors">
                    {link.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {(link.label === "MEN" ? menOpen : womensOpen) && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 shadow-2xl py-2"
                      >
                        {link.label === "MEN" && (
                          <>
                            {/* Performance Gear group */}
                            <div className="px-4 pt-2 pb-1">
                              <p className="text-[10px] font-black tracking-[0.3em] text-red-500 uppercase mb-1">
                                PERFORMANCE GEAR
                              </p>
                              {[
                                { label: "Raglan T", href: "/store?category=men&sub=raglan-t" },
                                { label: "Lightweight Short", href: "/store?category=men&sub=lightweight-short" },
                                { label: "Performance Short", href: "/store?category=men&sub=performance-short" },
                                { label: "Oversize Tee", href: "/store?category=men&sub=oversize-tee" },
                                { label: "Muscle Tank", href: "/store?category=men&sub=muscle-tank" },
                                { label: "¼ Zip L/S", href: "/store?category=men&sub=quarter-zip" },
                              ].map((item) => (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  className="block py-1.5 text-xs font-semibold tracking-wider text-zinc-400 hover:text-white transition-colors"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>

                            <div className="mx-4 my-2 border-t border-zinc-800" />

                            {/* Lifestyle Gear group */}
                            <div className="px-4 pb-2">
                              <p className="text-[10px] font-black tracking-[0.3em] text-red-500 uppercase mb-1">
                                LIFESTYLE GEAR
                              </p>
                              {[
                                { label: "Tech Hoodie", href: "/store?category=men&sub=tech-hoodie" },
                                { label: "Performance Pant", href: "/store?category=men&sub=performance-pant" },
                                { label: "Performance Jacket", href: "/store?category=men&sub=performance-jacket" },
                              ].map((item) => (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  className="block py-1.5 text-xs font-semibold tracking-wider text-zinc-400 hover:text-white transition-colors"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>

                            <div className="mx-4 my-2 border-t border-zinc-800" />

                            {/* Compression group */}
                            <div className="px-4 pb-2">
                              <p className="text-[10px] font-black tracking-[0.3em] text-red-500 uppercase mb-1">
                                COMPRESSION
                              </p>
                              {[
                                { label: "Compression Tee", href: "/store?category=men&sub=compression-tee" },
                                { label: "Compression Shorts", href: "/store?category=men&sub=compression-shorts" },
                                { label: "Compression Tights", href: "/store?category=men&sub=compression-tights" },
                                { label: "Compression Tops", href: "/store?category=men&sub=compression-tops" },
                              ].map((item) => (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  className="block py-1.5 text-xs font-semibold tracking-wider text-zinc-400 hover:text-white transition-colors"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>

                            <div className="mx-4 pt-1 border-t border-zinc-800">
                              <Link
                                href="/store?category=men"
                                className="flex items-center justify-between px-0 py-2 text-xs font-black tracking-widest text-red-500 hover:text-red-400 uppercase"
                              >
                                VIEW ALL MEN →
                              </Link>
                            </div>
                          </>
                        )}

                        {link.label === "WOMEN" &&
                          link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-4 py-2 text-xs font-semibold tracking-widest text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-bold tracking-widest transition-colors ${
                    link.highlight
                      ? "text-red-500 hover:text-red-400"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex text-zinc-400 hover:text-white transition-colors p-1">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden sm:flex text-zinc-400 hover:text-white transition-colors p-1">
              <User className="w-5 h-5" />
            </button>
            <button className="hidden sm:flex text-zinc-400 hover:text-white transition-colors p-1 relative">
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={openCart}
              className="relative text-zinc-400 hover:text-white transition-colors p-1"
              aria-label={`Open cart, ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <button
              className="lg:hidden text-zinc-400 hover:text-white transition-colors p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden bg-zinc-900 border-t border-zinc-800"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {/* Men */}
              <div>
                <Link
                  href="/store?category=men"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-sm font-bold tracking-widest border-b border-zinc-800 text-zinc-300"
                >
                  MEN
                </Link>
                <div className="pl-4 border-b border-zinc-800">
                  <p className="text-[10px] font-black tracking-widest text-red-500 uppercase pt-2 pb-1">Performance Gear</p>
                  {["Raglan T", "Lightweight Short", "Performance Short", "Oversize Tee", "Muscle Tank", "¼ Zip L/S"].map((item) => (
                    <Link
                      key={item}
                      href={`/store?category=men&sub=${item.toLowerCase().replace(/\s+/g, "-").replace(/[¼/]/g, "")}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-1.5 text-xs text-zinc-400 tracking-wider"
                    >
                      {item}
                    </Link>
                  ))}
                  <p className="text-[10px] font-black tracking-widest text-red-500 uppercase pt-3 pb-1">Lifestyle Gear</p>
                  {["Tech Hoodie", "Performance Pant", "Performance Jacket"].map((item) => (
                    <Link
                      key={item}
                      href={`/store?category=men&sub=${item.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-1.5 text-xs text-zinc-400 tracking-wider"
                    >
                      {item}
                    </Link>
                  ))}
                  <p className="text-[10px] font-black tracking-widest text-red-500 uppercase pt-3 pb-1">Compression</p>
                  {["Compression Tee", "Compression Shorts", "Compression Tights", "Compression Tops"].map((item) => (
                    <Link
                      key={item}
                      href={`/store?category=men&sub=${item.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-1.5 text-xs text-zinc-400 tracking-wider pb-2"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Rest of nav */}
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 text-sm font-bold tracking-widest border-b border-zinc-800 ${
                    link.highlight ? "text-red-500" : "text-zinc-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
