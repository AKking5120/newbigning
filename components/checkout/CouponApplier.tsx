"use client";

import { useState } from "react";
import { useCheckoutStore } from "@/store/checkout";
import { formatPrice } from "@/lib/utils";
import { Percent, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * Coupon Code Applier Component
 * Apply discount codes, display savings
 */
export function CouponApplier() {
  const { subtotal, discount, couponCode, setDiscount } = useCheckoutStore();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock coupon database
  const VALID_COUPONS: Record<string, { discount: number; type: "fixed" | "percent" }> = {
    "SAVE10": { discount: 10, type: "percent" },
    "SAVE20": { discount: 20, type: "percent" },
    "FLAT500": { discount: 500, type: "fixed" },
    "FLAT1000": { discount: 1000, type: "fixed" },
    "WELCOME": { discount: 15, type: "percent" },
    "FRIEND50": { discount: 50, type: "fixed" },
  };

  const applyCoupon = async () => {
    if (!code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const coupon = VALID_COUPONS[code.toUpperCase()];

      if (!coupon) {
        toast.error("Invalid or expired coupon code");
        return;
      }

      const discountAmount =
        coupon.type === "percent"
          ? Math.round((subtotal * coupon.discount) / 100)
          : coupon.discount;

      if (discountAmount > subtotal) {
        toast.error("Coupon discount exceeds order amount");
        return;
      }

      setDiscount(discountAmount, code.toUpperCase());
      toast.success(`Coupon applied! You save ${formatPrice(discountAmount)}`);
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    toast.success("Coupon removed");
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      <h3 className="font-black text-white tracking-widest uppercase mb-4">
        Promo Code
      </h3>

      {couponCode ? (
        <div className="bg-green-900/20 border border-green-900/50 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-green-400 font-bold text-sm">{couponCode} Applied ✓</p>
            <p className="text-green-400/70 text-xs mt-1">
              Save {formatPrice(discount)} on this order
            </p>
          </div>
          <button
            onClick={removeCoupon}
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && applyCoupon()}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors text-sm"
            />
            <Button
              onClick={applyCoupon}
              disabled={isLoading || !code.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold"
            >
              {isLoading ? "Checking..." : "Apply"}
            </Button>
          </div>

          {/* Available coupons hint */}
          <div className="bg-zinc-800 rounded p-3">
            <p className="text-xs font-semibold text-zinc-300 mb-2">💡 Available Coupons:</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(VALID_COUPONS).slice(0, 4).map(([code, coupon]) => (
                <button
                  key={code}
                  onClick={() => setCode(code)}
                  className="text-left p-2 bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
                >
                  <p className="text-white text-xs font-bold">{code}</p>
                  <p className="text-zinc-300 text-[10px]">
                    {coupon.type === "percent"
                      ? `${coupon.discount}% off`
                      : `₹${coupon.discount} off`}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
