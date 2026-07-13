"use client";

import { useCheckoutStore } from "@/store/checkout";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Percent, TrendingDown } from "lucide-react";

/**
 * Cart Summary Component
 * Displays price breakdown: subtotal, tax, shipping, discount, total
 */
export function CartSummary() {
  const { subtotal, discount, couponCode, tax, shippingCharge, total } =
    useCheckoutStore();
  const { items } = useCartStore();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const discountPercent = subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0;

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      {/* Header */}
      <h2 className="text-lg font-black text-white tracking-widest uppercase mb-6">
        Order Summary
      </h2>

      {/* Items Count */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
        <span className="text-zinc-400 text-sm">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span className="text-white font-semibold">{formatPrice(subtotal)}</span>
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex items-center justify-between mb-3 text-green-500">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Discount {couponCode && `(${couponCode})`}
            </span>
            {discountPercent > 0 && (
              <span className="text-xs bg-green-900/50 px-2 py-0.5 rounded">
                {discountPercent}% off
              </span>
            )}
          </div>
          <span className="font-bold">-{formatPrice(discount)}</span>
        </div>
      )}

      {/* Tax */}
      <div className="flex items-center justify-between mb-3 text-zinc-400 text-sm">
        <span>Tax (GST)</span>
        <span>+{formatPrice(tax)}</span>
      </div>

      {/* Shipping */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800 text-zinc-400 text-sm">
        <span>Shipping Charge</span>
        <span className={shippingCharge === 0 ? "text-green-500 font-semibold" : ""}>
          {shippingCharge === 0 ? "FREE" : `+${formatPrice(shippingCharge)}`}
        </span>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-white font-black tracking-widest uppercase">Total</span>
        <span className="text-2xl font-black text-red-600">{formatPrice(total)}</span>
      </div>

      {/* Savings Info */}
      {discount > 0 && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-900/50 rounded text-green-400 text-xs font-semibold text-center">
          💰 You save {formatPrice(discount)} on this order!
        </div>
      )}

      {/* Free Shipping Info */}
      {shippingCharge === 0 && (
        <div className="mt-2 p-3 bg-blue-900/20 border border-blue-900/50 rounded text-blue-400 text-xs font-semibold text-center">
          🚚 Free Shipping on this order!
        </div>
      )}
    </div>
  );
}
