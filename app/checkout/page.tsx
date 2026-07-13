"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronLeft,
  Lock,
  ShieldCheck,
  CreditCard,
  Tag,
  X,
  CheckCircle2,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useCouponStore } from "@/store/coupon";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().min(2, "Full name required"),
  email: z.string().email("Valid email required"),
  phone: z
    .string()
    .min(10, "Valid phone required")
    .max(10, "Must be 10 digits")
    .regex(/^\d+$/, "Numbers only"),
  pincode: z
    .string()
    .length(6, "Must be 6 digits")
    .regex(/^\d+$/, "Numbers only"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
});

type FormData = z.infer<typeof schema>;

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { validateCoupon, applyCoupon, removeCoupon, appliedCoupon, getActiveCoupons, incrementUsedCount, getCouponByCode } = useCouponStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const subtotal = getTotalPrice();
  const discount = appliedCoupon?.discount ?? 0;
  const shipping = subtotal - discount >= 2000 ? 0 : 199;
  const gst = Math.round(((subtotal - discount) * 18) / 100);
  const total = subtotal - discount + gst + shipping;
  const activeCoupons = getActiveCoupons();

  // Apply coupon handler
  async function handleApplyCoupon() {
    if (!couponInput.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate delay
    const result = validateCoupon(couponInput.trim(), subtotal);
    if (result.valid) {
      applyCoupon(couponInput.trim(), subtotal);
      toast.success(result.message);
      setCouponInput("");
    } else {
      toast.error(result.message);
    }
    setCouponLoading(false);
  }

  // Remove coupon handler
  function handleRemoveCoupon() {
    removeCoupon();
    toast.success("Coupon removed");
  }

  async function onSubmit(data: FormData) {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKeyId || razorpayKeyId.startsWith("rzp_test_xxx")) {
        // Demo mode
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            shippingDetails: data,
            total,
            subtotal,
            discount,
            gst,
            couponCode: appliedCoupon?.code,
            shippingCost: shipping,
            paymentStatus: "DEMO",
          }),
        });

        const order = await orderRes.json();

        // Increment coupon usage if applied
        if (appliedCoupon?.code) {
          const coupon = getCouponByCode(appliedCoupon.code);
          if (coupon) incrementUsedCount(coupon.id);
        }

        clearCart();
        removeCoupon();
        router.push(`/order-confirmation?orderNumber=${order.orderNumber}&demo=true`);
        return;
      }

      // Razorpay flow
      const rpRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const rpOrder = await rpRes.json();

      await loadRazorpay();
      const options = {
        key: razorpayKeyId,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: "WALKUS",
        description: "Premium Activewear",
        order_id: rpOrder.id,
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.phone,
        },
        theme: { color: "#ef4444" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const orderRes = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items,
              shippingDetails: data,
              total,
              subtotal,
              discount,
              gst,
              couponCode: appliedCoupon?.code,
              shippingCost: shipping,
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              paymentStatus: "PAID",
            }),
          });
          const order = await orderRes.json();

          if (appliedCoupon?.code) {
            const coupon = getCouponByCode(appliedCoupon.code);
            if (coupon) incrementUsedCount(coupon.id);
          }

          clearCart();
          removeCoupon();
          router.push(`/order-confirmation?orderNumber=${order.orderNumber}`);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function loadRazorpay(): Promise<void> {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-400 text-sm uppercase tracking-widest">
          Your cart is empty
        </p>
        <Link
          href="/store"
          className="bg-red-600 text-white text-xs font-bold tracking-widest uppercase px-8 py-3"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/store"
            className="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 hover:text-white uppercase transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> BACK
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm tracking-widest uppercase">
              SECURE CHECKOUT
            </span>
            <Lock className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ─── Left: Form ─── */}
          <div className="lg:col-span-3 space-y-8">

            {/* Step 1 — Shipping */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 bg-red-600 flex items-center justify-center text-white text-sm font-black">
                  1
                </div>
                <h2 className="text-lg font-black tracking-widest uppercase text-white">
                  SHIPPING DETAILS
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                    FULL NAME
                  </label>
                  <input
                    {...register("fullName")}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-4 py-3 focus:outline-none focus:border-red-500"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                    EMAIL
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-4 py-3 focus:outline-none focus:border-red-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                    PHONE
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-4 py-3 focus:outline-none focus:border-red-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                    PIN CODE
                  </label>
                  <input
                    {...register("pincode")}
                    type="text"
                    maxLength={6}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-4 py-3 focus:outline-none focus:border-red-500"
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                    ADDRESS
                  </label>
                  <input
                    {...register("address")}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-4 py-3 focus:outline-none focus:border-red-500"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                    CITY
                  </label>
                  <input
                    {...register("city")}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-4 py-3 focus:outline-none focus:border-red-500"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                    STATE
                  </label>
                  <input
                    {...register("state")}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-4 py-3 focus:outline-none focus:border-red-500"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2 — Coupon */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 bg-red-600 flex items-center justify-center text-white text-sm font-black">
                  2
                </div>
                <h2 className="text-lg font-black tracking-widest uppercase text-white">
                  PROMO CODE
                </h2>
              </div>

              {appliedCoupon ? (
                /* Applied state */
                <div className="flex items-center justify-between bg-green-900/20 border border-green-700/50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 font-bold text-sm tracking-widest">
                        {appliedCoupon.code} Applied
                      </p>
                      <p className="text-green-400/70 text-xs mt-0.5">
                        You save {formatPrice(appliedCoupon.discount)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-zinc-400 hover:text-white transition-colors"
                    aria-label="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Input state */
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        placeholder="ENTER COUPON CODE"
                        className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm pl-9 pr-4 py-3 focus:outline-none focus:border-red-500 placeholder:text-zinc-600 tracking-widest"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-xs font-black tracking-widest uppercase px-5 transition-colors"
                    >
                      {couponLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "APPLY"
                      )}
                    </button>
                  </div>

                  {/* Available coupons */}
                  {activeCoupons.length > 0 && (
                    <div className="bg-zinc-900 border border-zinc-800 p-3">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">
                        Available Coupons
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeCoupons.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => setCouponInput(c.code)}
                            className="group flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-red-600 px-3 py-1.5 transition-all"
                          >
                            <span className="text-white text-xs font-black tracking-widest">
                              {c.code}
                            </span>
                            <span className="text-zinc-400 text-[10px]">
                              {c.type === "percentage" ? `${c.value}% off` : `₹${c.value} off`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 3 — Payment */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 bg-red-600 flex items-center justify-center text-white text-sm font-black">
                  3
                </div>
                <h2 className="text-lg font-black tracking-widest uppercase text-white">
                  PAYMENT METHOD
                </h2>
              </div>

              <div className="border border-red-600/40 bg-zinc-900/60 p-5 flex items-center gap-4">
                <div className="w-8 h-8 bg-red-600/20 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">
                    Razorpay Secure Checkout
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    UPI, Cards, Netbanking, Wallets — all supported
                  </p>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-sm tracking-widest uppercase py-4 transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  PLACE ORDER — {formatPrice(total)}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-zinc-600 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              Secure 256-bit SSL encrypted checkout
            </div>
          </div>

          {/* ─── Right: Order Summary ─── */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-950 border border-zinc-800 p-6 sticky top-24">
              <h3 className="text-sm font-black tracking-widest uppercase text-white mb-5">
                ORDER SUMMARY
              </h3>

              {/* Items */}
              <div className="space-y-4 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-16 bg-zinc-900 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {[item.quantity > 1 ? `Qty: ${item.quantity}` : "", item.size]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <p className="text-red-500 font-black text-xs mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-zinc-800 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {/* Discount row — only shown if coupon applied */}
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {appliedCoupon?.code}
                    </span>
                    <span className="font-bold">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>GST (18%)</span>
                  <span className="text-white font-semibold">+{formatPrice(gst)}</span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-400 font-bold" : "text-white font-semibold"}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-zinc-700 pt-3 mt-1">
                  <span className="font-black text-white tracking-widest uppercase">TOTAL</span>
                  <span className="font-black text-red-500 text-xl">{formatPrice(total)}</span>
                </div>

                {discount > 0 && (
                  <p className="text-center text-green-400 text-xs font-semibold pt-1">
                    🎉 You save {formatPrice(discount)} on this order!
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
