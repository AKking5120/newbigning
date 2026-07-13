"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export function FeaturedProducts() {
  const { data: products = [], isLoading } = useProducts({ limit: 8 });

  return (
    <section className="py-16 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-zinc-800" />
                <div className="h-4 bg-zinc-800 mt-3 w-3/4" />
                <div className="h-4 bg-zinc-800 mt-2 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
