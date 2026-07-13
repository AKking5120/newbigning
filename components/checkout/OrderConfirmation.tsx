"use client";

import { useCartStore } from "@/store/cart";
import { useCheckoutStore, ShippingAddress } from "@/store/checkout";
import { formatPrice } from "@/lib/utils";
import {
  CheckCircle2,
  Package,
  MapPin,
  Truck,
  CreditCard,
  Download,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OrderConfirmationProps {
  orderId: string;
  onNewOrder?: () => void;
}

/**
 * Order Confirmation Component
 * Displays order ID, receipt, tracking info, and order summary
 */
export function OrderConfirmation({ orderId, onNewOrder }: OrderConfirmationProps) {
  const { items, clearCart } = useCartStore();
  const {
    subtotal,
    discount,
    couponCode,
    tax,
    shippingCharge,
    total,
    shippingAddress,
    shippingMethod,
    paymentMethod,
  } = useCheckoutStore();

  const handleDownloadInvoice = () => {
    toast.success("Invoice downloaded (demo)");
  };

  const handleShareOrder = () => {
    const text = `I just placed order ${orderId} on Radhaji Store! 🛍️`;
    if (navigator.share) {
      navigator.share({
        title: "Order Confirmation",
        text: text,
      });
    } else {
      toast.success("Share link copied!");
    }
  };

  const handleContinueShopping = () => {
    clearCart();
    onNewOrder?.();
  };

  // Calculate estimated delivery date
  const shippingDays = shippingMethod === "express" ? 1 : 5;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + shippingDays);

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900/20 border border-green-900/50 rounded-full mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-2">
            Order Confirmed!
          </h1>
          <p className="text-zinc-400 text-lg">Thank you for your purchase</p>
        </div>

        {/* Order ID Card */}
        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-900/50 rounded-lg p-8 mb-8 text-center">
          <p className="text-zinc-400 text-sm font-semibold uppercase mb-2">Order ID</p>
          <h2 className="text-3xl font-black text-white tracking-widest mb-4">{orderId}</h2>
          <p className="text-zinc-300 text-sm">
            A confirmation email has been sent to{" "}
            <span className="font-semibold">{shippingAddress?.email}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Delivery Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-blue-500" />
              <h3 className="font-bold text-white uppercase tracking-widest">
                Delivery
              </h3>
            </div>
            <p className="text-zinc-400 text-sm mb-2">Estimated Delivery</p>
            <p className="text-white font-bold text-lg mb-4">
              {deliveryDate.toLocaleDateString("en-IN", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-zinc-400 text-xs">
              {shippingMethod === "express"
                ? "Next-day delivery"
                : "Delivery in 5-7 business days"}
            </p>
          </div>

          {/* Tracking Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-orange-500" />
              <h3 className="font-bold text-white uppercase tracking-widest">
                Tracking
              </h3>
            </div>
            <p className="text-zinc-400 text-sm mb-2">Tracking Number</p>
            <p className="text-white font-mono font-bold text-sm mb-4 break-all">
              RAD-{orderId}-001
            </p>
            <Link
              href="#"
              className="text-red-600 hover:text-red-500 text-xs font-semibold"
            >
              Track Order →
            </Link>
          </div>

          {/* Payment Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-500" />
              <h3 className="font-bold text-white uppercase tracking-widest">
                Payment
              </h3>
            </div>
            <p className="text-zinc-400 text-sm mb-2">Method</p>
            <p className="text-white font-bold mb-2 capitalize">
              {paymentMethod === "cod"
                ? "Cash on Delivery"
                : paymentMethod?.toUpperCase()}
            </p>
            <p className="text-green-500 text-xs font-semibold">✓ Confirmed</p>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-white uppercase tracking-widest">
              Delivery Address
            </h3>
          </div>
          {shippingAddress && (
            <div className="text-zinc-300 space-y-1">
              <p className="font-semibold">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              <p className="text-sm">{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && (
                <p className="text-sm">{shippingAddress.addressLine2}</p>
              )}
              <p className="text-sm">
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postalCode}
              </p>
              <p className="text-sm">{shippingAddress.phone}</p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-white uppercase tracking-widest mb-4">
            Order Items
          </h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 pb-4 border-b border-zinc-800 last:border-b-0"
              >
                <div className="relative w-16 h-16 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm">{item.name}</h4>
                  {item.size && (
                    <p className="text-zinc-400 text-xs">Size: {item.size}</p>
                  )}
                  <p className="text-zinc-400 text-xs">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-zinc-400 text-xs">
                    {formatPrice(item.price)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-white uppercase tracking-widest mb-4">
            Order Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>
                  Discount {couponCode && `(${couponCode})`}
                </span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-400">
              <span>Tax (GST)</span>
              <span>+{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Shipping</span>
              <span>
                {shippingCharge === 0 ? "FREE" : `+${formatPrice(shippingCharge)}`}
              </span>
            </div>
            <div className="border-t border-zinc-700 pt-3 flex justify-between">
              <span className="font-bold text-white uppercase tracking-widest">
                Total Amount
              </span>
              <span className="text-2xl font-black text-red-600">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Button
            onClick={handleDownloadInvoice}
            variant="outline"
            className="flex-1 border-zinc-700 text-zinc-300 hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
          <Button
            onClick={handleShareOrder}
            variant="outline"
            className="flex-1 border-zinc-700 text-zinc-300 hover:text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Order
          </Button>
          <Button
            onClick={handleContinueShopping}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Continue Shopping
          </Button>
        </div>

        {/* Help Section */}
        <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-6 text-center">
          <p className="text-blue-400 font-semibold mb-2">Need Help?</p>
          <p className="text-blue-400/70 text-sm mb-3">
            For any issues or queries regarding your order, contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 text-sm">
            <Link href="/support" className="text-blue-400 hover:text-blue-300 font-semibold">
              Contact Support
            </Link>
            <span className="text-blue-400/50">•</span>
            <Link href="/faq" className="text-blue-400 hover:text-blue-300 font-semibold">
              FAQ
            </Link>
            <span className="text-blue-400/50">•</span>
            <Link href="/returns" className="text-blue-400 hover:text-blue-300 font-semibold">
              Returns & Refunds
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
