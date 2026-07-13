"use client";

import { useCheckoutStore, SHIPPING_OPTIONS_ARRAY } from "@/store/checkout";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Truck, Zap } from "lucide-react";

interface ShippingMethodSelectorProps {
  onComplete?: () => void;
}

/**
 * Shipping Method Selection Component
 * Standard/Express options with prices and delivery times
 */
export function ShippingMethodSelector({ onComplete }: ShippingMethodSelectorProps) {
  const { shippingMethod, setShippingMethod } = useCheckoutStore();

  const handleSelect = (method: "standard" | "express") => {
    setShippingMethod(method);
    onComplete?.();
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      <h3 className="font-black text-white tracking-widest uppercase mb-6">
        Shipping Method
      </h3>

      <div className="space-y-3">
        {SHIPPING_OPTIONS_ARRAY.map((option) => (
          <button
            key={option.method}
            onClick={() => handleSelect(option.method)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              shippingMethod === option.method
                ? "border-red-600 bg-red-600/10"
                : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {option.method === "standard" ? (
                    <Truck className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Zap className="w-5 h-5 text-orange-500" />
                  )}
                  <h4 className="font-bold text-white">{option.name}</h4>
                </div>
                <p className="text-zinc-400 text-sm mb-2">{option.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs bg-zinc-700 px-2 py-1 rounded text-zinc-200">
                    📅 {option.estimatedDays}-{option.estimatedDays + 2} days
                  </span>
                  <span className="text-xs bg-zinc-700 px-2 py-1 rounded text-zinc-200">
                    {option.price === 0 ? "🎁 FREE" : `₹${option.price}`}
                  </span>
                </div>
              </div>
              {shippingMethod === option.method && (
                <CheckCircle2 className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-900/50 rounded text-blue-400 text-sm">
        <p className="font-semibold mb-1">ℹ️ Shipping Information</p>
        <ul className="text-xs space-y-1">
          <li>• Standard delivery is completely free</li>
          <li>• Express delivery available for next-day delivery</li>
          <li>• Delivery times exclude weekends and holidays</li>
        </ul>
      </div>
    </div>
  );
}
