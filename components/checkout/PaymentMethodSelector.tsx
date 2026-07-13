"use client";

import { useCheckoutStore, PaymentMethod } from "@/store/checkout";
import { CheckCircle2, Smartphone, CreditCard, Building2, Wallet, DollarSign, Truck } from "lucide-react";

interface PaymentMethodSelectorProps {
  onComplete?: () => void;
}

interface PaymentOption {
  method: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    method: "upi",
    name: "UPI",
    description: "Google Pay, PhonePe, Paytm",
    icon: <Smartphone className="w-6 h-6 text-purple-500" />,
    badge: "Popular",
  },
  {
    method: "card",
    name: "Credit/Debit Card",
    description: "Visa, Mastercard, American Express",
    icon: <CreditCard className="w-6 h-6 text-blue-500" />,
  },
  {
    method: "netbanking",
    name: "Net Banking",
    description: "All major banks supported",
    icon: <Building2 className="w-6 h-6 text-green-500" />,
  },
  {
    method: "wallet",
    name: "Digital Wallet",
    description: "Amazon Pay, Airtel Money",
    icon: <Wallet className="w-6 h-6 text-yellow-500" />,
  },
  {
    method: "emi",
    name: "EMI",
    description: "No-cost EMI available",
    icon: <DollarSign className="w-6 h-6 text-pink-500" />,
  },
  {
    method: "cod",
    name: "Cash on Delivery",
    description: "Pay when product arrives",
    icon: <Truck className="w-6 h-6 text-orange-500" />,
  },
];

/**
 * Payment Method Selector Component
 * UPI, Card, NetBanking, Wallet, EMI, COD options
 */
export function PaymentMethodSelector({ onComplete }: PaymentMethodSelectorProps) {
  const { paymentMethod, setPaymentMethod } = useCheckoutStore();

  const handleSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    onComplete?.();
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      <h3 className="font-black text-white tracking-widest uppercase mb-6">
        Payment Method
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PAYMENT_OPTIONS.map((option) => (
          <button
            key={option.method}
            onClick={() => handleSelect(option.method)}
            className={`p-4 rounded-lg border-2 transition-all text-left group ${
              paymentMethod === option.method
                ? "border-red-600 bg-red-600/10"
                : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">{option.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-white text-sm">{option.name}</h4>
                  {option.badge && (
                    <span className="text-xs bg-red-600/50 text-red-200 px-1.5 py-0.5 rounded">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-zinc-400 text-xs">{option.description}</p>
              </div>
              {paymentMethod === option.method && (
                <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Security Info */}
      <div className="mt-6 p-4 bg-green-900/20 border border-green-900/50 rounded text-green-400 text-sm">
        <p className="font-semibold mb-1">🔒 Secure Payment</p>
        <p className="text-xs">
          All payments are encrypted and processed securely. Your payment information is
          protected with industry-leading security standards.
        </p>
      </div>

      {/* Method-Specific Info */}
      {paymentMethod === "cod" && (
        <div className="mt-4 p-4 bg-orange-900/20 border border-orange-900/50 rounded text-orange-400 text-sm">
          <p className="text-xs">
            ⚠️ A confirmation call will be made before delivery. An additional convenience
            charge of ₹0 will be applied for COD orders.
          </p>
        </div>
      )}

      {paymentMethod === "emi" && (
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-900/50 rounded text-blue-400 text-sm">
          <p className="text-xs">
            ℹ️ EMI available for purchases above ₹5,000. Choose your preferred tenure
            (3, 6, or 12 months) at checkout.
          </p>
        </div>
      )}
    </div>
  );
}
