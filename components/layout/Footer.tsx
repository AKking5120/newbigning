"use client";

import Link from "next/link";
import { Camera, Play, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-600 flex items-center justify-center font-black text-white text-sm">
                X
              </div>
              <div>
                <div className="font-black text-white text-xl tracking-[0.2em] leading-none">RADHAJI</div>
                <div className="text-[9px] text-zinc-500 tracking-[0.3em] leading-none">PREMIUM ACTIVEWEAR</div>
              </div>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Advanced fabrics. Bold design. Unmatched performance. For those who rise above.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors" aria-label="Instagram">
                <Camera className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors" aria-label="YouTube">
                <Play className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors" aria-label="Twitter">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-bold tracking-widest text-white mb-4">SHOP</h3>
            <ul className="space-y-3">
              {["Men", "Women", "Accessories", "Collections", "New Arrivals", "Best Sellers", "Sale"].map((item) => (
                <li key={item}>
                  <Link href={`/store?category=${item.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-zinc-500 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs font-bold tracking-widest text-white mb-4">HELP</h3>
            <ul className="space-y-3">
              {["Size Guide", "Shipping & Delivery", "Returns & Exchanges", "Track Your Order", "FAQs", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold tracking-widest text-white mb-4">STAY UPDATED</h3>
            <p className="text-sm text-zinc-500 mb-4">
              Get early access to new drops, exclusive offers, and training tips.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 focus:outline-none focus:border-red-500 placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-widest px-4 py-2 transition-colors"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-zinc-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} RADHAJI. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Refund Policy"].map((item) => (
              <Link key={item} href="#" className="text-xs text-zinc-600 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
