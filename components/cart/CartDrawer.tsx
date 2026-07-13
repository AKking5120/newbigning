"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } =
    useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render cart contents until after hydration
  if (!mounted) return null;
  const total = getTotalPrice();
  const FREE_SHIPPING_THRESHOLD = 2000;
  const remaining = FREE_SHIPPING_THRESHOLD - total;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-zinc-950 border-l border-zinc-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-white" />
                <span className="font-black text-white tracking-widest text-sm uppercase">
                  Your Cart
                </span>
                {items.length > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-zinc-400 hover:text-white transition-colors p-1"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {total < FREE_SHIPPING_THRESHOLD && items.length > 0 && (
              <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800">
                <p className="text-xs text-zinc-400 mb-2">
                  Add{" "}
                  <span className="text-white font-semibold">
                    {formatPrice(remaining)}
                  </span>{" "}
                  more for <span className="text-green-400 font-semibold">FREE shipping</span>
                </p>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all duration-500"
                    style={{
                      width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
                  <ShoppingBag className="w-16 h-16 text-zinc-700" />
                  <p className="text-zinc-400 font-semibold tracking-wider text-sm uppercase">
                    Your cart is empty
                  </p>
                  <p className="text-zinc-600 text-sm">
                    Add some gear to get started
                  </p>
                  <Link
                    href="/store"
                    onClick={closeCart}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-widest uppercase px-8 py-3 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-5">
                      <div className="relative w-20 h-24 flex-shrink-0 bg-zinc-900 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white leading-tight truncate">
                          {item.name}
                        </p>
                        {(item.size || item.color) && (
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {[item.size, item.color].filter(Boolean).join(" / ")}
                          </p>
                        )}
                        <p className="text-red-500 font-bold mt-1 text-sm">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-zinc-700">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-zinc-500 hover:text-red-500 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Subtotal</span>
                  <span className="text-white font-bold text-lg">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  {total >= FREE_SHIPPING_THRESHOLD
                    ? "🎉 Free shipping applied!"
                    : "Shipping calculated at checkout"}
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-widest text-sm uppercase py-4 transition-colors"
                >
                  Checkout — {formatPrice(total)}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 font-bold tracking-widest text-xs uppercase py-3 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
