"use client";

import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/types";

async function fetchProducts(params?: {
  category?: string;
  sub?: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  limit?: number;
}): Promise<Product[]> {
  const searchParams = new URLSearchParams();
  if (params?.category)   searchParams.set("category",   params.category);
  if (params?.sub)        searchParams.set("sub",        params.sub);
  if (params?.featured)   searchParams.set("featured",   "true");
  if (params?.bestseller) searchParams.set("bestseller", "true");
  if (params?.newArrival) searchParams.set("newArrival", "true");
  if (params?.limit)      searchParams.set("limit",      String(params.limit));

  const res = await fetch(`/api/products?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`/api/products/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export function useProducts(params?: {
  category?: string;
  sub?: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn:  () => fetchProducts(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn:  () => fetchProductBySlug(slug),
    enabled:  !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
