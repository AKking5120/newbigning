"use client";

import { useWishlistStore } from "@/store/wishlist";
import { Heart, Trash2, ShoppingCart, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import { useState, useEffect } from "react";

/**
 * Wishlist Page Component
 * Full page view of user's wishlist
 */
export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (item: any) => {
    addItem({
      id: `${item.productId}-default`,
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      comparePrice: item.comparePrice,
      quantity: 1,
      slug: item.slug,
    });
    toast.success(`${item.name} added to cart`);
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
    toast.success("Removed from wishlist");
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-zinc-800 sticky top-16 z-30 bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/store"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Back to Store</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-600 fill-red-600" />
            <div>
              <h1 className="text-3xl font-black text-white tracking-widest uppercase">
                My Wishlist
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="w-16 h-16 text-zinc-700 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md">
              Start saving your favorite items to your wishlist. You can add items from
              product cards or product detail pages.
            </p>
            <Link
              href="/store"
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest uppercase rounded transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="border border-zinc-800 rounded overflow-hidden hover:border-red-600 transition-colors"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative aspect-[3/4] overflow-hidden bg-zinc-900 block group"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <Link
                      href={`/product/${item.slug}`}
                      className="block text-sm font-bold text-white hover:text-red-500 truncate mb-2 transition-colors"
                    >
                      {item.name}
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-red-600 font-black text-lg">
                        {formatPrice(item.price)}
                      </span>
                      {item.comparePrice && (
                        <span className="text-zinc-500 text-xs line-through">
                          {formatPrice(item.comparePrice)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition-colors text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-red-500 font-bold py-2 rounded transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => {
                  clearWishlist();
                  toast.success("Wishlist cleared");
                }}
                className="text-zinc-400 hover:text-white font-bold text-sm tracking-widest uppercase transition-colors"
              >
                Clear Wishlist
              </button>

              <Link
                href="/store"
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest uppercase rounded transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
