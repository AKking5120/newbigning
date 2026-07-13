"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const categories = [
  { label: "All", value: "" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Accessories", value: "accessories" },
  { label: "Collections", value: "collections" },
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Sellers", value: "bestseller" },
  { label: "New Arrivals", value: "new" },
];

export function StoreContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") ?? "";
  const urlSub = searchParams.get("sub") ?? "";
  const urlBestseller = searchParams.get("bestseller") === "true";
  const urlNewArrival = searchParams.get("newArrival") === "true";

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [sort, setSort] = useState("featured");

  const { data: products = [], isLoading } = useProducts({
    category: activeCategory || undefined,
    sub: urlSub || undefined,
    bestseller: urlBestseller || undefined,
    newArrival: urlNewArrival || undefined,
  });

  const sorted = [...products].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "bestseller") return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    if (sort === "new") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    return 0;
  });

  const title = urlBestseller
    ? "BEST SELLERS"
    : urlNewArrival
    ? "NEW ARRIVALS"
    : urlSub
    ? urlSub.toUpperCase().replace(/-/g, " ")
    : activeCategory
    ? activeCategory.toUpperCase()
    : "ALL PRODUCTS";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Store Header */}
      <div className="bg-zinc-950 border-b border-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
            <span>HOME</span>
            <span>/</span>
            <span className="text-white">{title}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">
            {title}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">{sorted.length} products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters bar */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors ${
                  activeCategory === cat.value
                    ? "bg-red-600 text-white"
                    : "border border-zinc-700 text-zinc-400 hover:border-zinc-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-white text-xs font-bold tracking-widest uppercase px-4 py-2 focus:outline-none focus:border-red-500"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-zinc-800" />
                <div className="h-4 bg-zinc-800 mt-3 w-3/4 rounded" />
                <div className="h-4 bg-zinc-800 mt-2 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-500 text-sm tracking-wider uppercase">
              No products found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
