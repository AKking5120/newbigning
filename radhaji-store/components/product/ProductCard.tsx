"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const discount =
    product.comparePrice
      ? getDiscountPercent(product.price, product.comparePrice)
      : 0;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id: `${product.id}-${product.sizes[0] ?? ""}-default`,
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      comparePrice: product.comparePrice,
      quantity: 1,
      size: product.sizes[0],
      slug: product.slug,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-zinc-900 aspect-[3/4]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isBestseller && (
              <span className="bg-red-600 text-white text-[10px] font-black tracking-widest px-2 py-0.5 uppercase">
                BESTSELLER
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black tracking-widest px-2 py-0.5">
                -{discount}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-white text-black text-[10px] font-black tracking-widest px-2 py-0.5 uppercase">
                NEW
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 w-8 h-8 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4 text-white" />
          </button>

          {/* Quick add */}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-0 left-0 right-0 bg-red-600 hover:bg-red-700 text-white text-xs font-black tracking-widest uppercase py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            QUICK ADD
          </button>
        </div>

        {/* Info */}
        <div className="pt-3">
          <h3 className="text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.avgRating && (
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(product.avgRating!)
                      ? "text-red-500 fill-red-500"
                      : "text-zinc-700"
                  }`}
                />
              ))}
              <span className="text-xs text-zinc-500 ml-1">
                {product.avgRating} ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-red-500 font-black text-sm">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-zinc-600 text-xs line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
