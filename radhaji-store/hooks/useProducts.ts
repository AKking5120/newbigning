"use client";

import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/types";
import {
  mockProducts,
  performanceGearProducts,
  lifestyleGearProducts,
  compressionProducts,
} from "@/lib/mock-data";

// Merge all products
const allProducts = [
  ...mockProducts,
  ...performanceGearProducts,
  ...lifestyleGearProducts,
  ...compressionProducts,
];

async function fetchProducts(params?: {
  category?: string;
  sub?: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  limit?: number;
}): Promise<Product[]> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.sub) searchParams.set("sub", params.sub);
  if (params?.featured) searchParams.set("featured", "true");
  if (params?.bestseller) searchParams.set("bestseller", "true");
  if (params?.newArrival) searchParams.set("newArrival", "true");
  if (params?.limit) searchParams.set("limit", String(params.limit));

  try {
    const res = await fetch(`/api/products?${searchParams.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  } catch {
    // Fallback to mock data during development
    let data = [...allProducts];

    if (params?.category) {
      data = data.filter((p) => p.category?.slug === params.category);
    }
    if (params?.sub) {
      data = data.filter((p) =>
        p.tags.some((t) => t === params.sub || t.includes(params.sub!))
      );
    }
    if (params?.featured) data = data.filter((p) => p.isFeatured);
    if (params?.bestseller) data = data.filter((p) => p.isBestseller);
    if (params?.newArrival) data = data.filter((p) => p.isNewArrival);
    if (params?.limit) data = data.slice(0, params.limit);
    return data;
  }
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`/api/products/${slug}`);
    if (!res.ok) throw new Error("Not found");
    return res.json();
  } catch {
    return allProducts.find((p) => p.slug === slug) ?? null;
  }
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
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
