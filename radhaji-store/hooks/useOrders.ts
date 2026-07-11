"use client";

import { useMutation } from "@tanstack/react-query";
import type { CreateOrderPayload, Order } from "@/types";

async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create order");
  }
  return res.json();
}

async function createRazorpayOrder(amount: number): Promise<{ id: string; amount: number; currency: string }> {
  const res = await fetch("/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error("Failed to create payment order");
  return res.json();
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  });
}

export function useCreateRazorpayOrder() {
  return useMutation({
    mutationFn: (amount: number) => createRazorpayOrder(amount),
  });
}
