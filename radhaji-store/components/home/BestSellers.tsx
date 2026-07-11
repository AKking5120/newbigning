"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export function BestSellers() {
  const { data: products = [], isLoading } = useProducts({ bestseller: true, limit: 4 });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-1">
              MOST LOVED
            </p>
            <h2 className="text-3xl font-black tracking-tight uppercase text-black">
              BEST SELLERS
            </h2>
          </div>
          <Link
            href="/store?bestseller=true"
            className="text-xs font-bold tracking-widest text-red-600 hover:text-red-700 flex items-center gap-1 uppercase"
          >
            VIEW ALL <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-zinc-200" />
                <div className="h-4 bg-zinc-200 mt-3 w-3/4" />
                <div className="h-4 bg-zinc-200 mt-2 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              // Use dark variant on white bg by overriding
              <div key={product.id} className="[&_.text-white]:text-black [&_.text-zinc-500]:text-zinc-600 [&_.text-zinc-600]:text-zinc-400 [&_.bg-zinc-900]:bg-zinc-100">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
