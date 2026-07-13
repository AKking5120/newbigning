"use client";

import { useWishlistStore } from "@/store/wishlist";
import { Heart, Trash2, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import { useState } from "react";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Wishlist Drawer Component
 * Shows user's saved products
 */
export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [isAnimating, setIsAnimating] = useState(false);

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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-obsidian border-l border-obsidian-light z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-obsidian-light">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-crimson fill-crimson" />
            <h2 className="text-lg font-black text-pearl tracking-widest uppercase">
              Wishlist
            </h2>
            {items.length > 0 && (
              <span className="text-xs bg-crimson text-pearl px-2 py-1 rounded-full font-bold">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-obsidian-light rounded transition-colors"
          >
            <X className="w-5 h-5 text-pearl/60" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto h-[calc(100%-140px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
              <Heart className="w-12 h-12 text-pearl/20 mb-3" />
              <p className="text-pearl/60 text-sm font-semibold">
                Your wishlist is empty
              </p>
              <p className="text-pearl/40 text-xs mt-1">
                Save items to view them later
              </p>
              <Link
                href="/store"
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-crimson text-pearl text-xs font-bold tracking-widest uppercase rounded hover:bg-crimson-mid transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-obsidian-light">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="p-4 flex gap-3 hover:bg-obsidian-light transition-colors"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={onClose}
                    className="flex-shrink-0 w-16 h-20 relative"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={onClose}
                      className="text-sm font-semibold text-pearl hover:text-crimson transition-colors truncate block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-crimson font-black text-sm mt-1">
                      {formatPrice(item.price)}
                    </p>
                    {item.comparePrice && (
                      <p className="text-pearl/50 text-xs line-through">
                        {formatPrice(item.comparePrice)}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 flex items-center justify-center gap-1 bg-obsidian-light hover:bg-crimson text-pearl text-xs font-bold py-1.5 rounded transition-colors"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Cart</span>
                      </button>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="px-2 py-1.5 hover:bg-crimson/20 text-pearl/60 hover:text-crimson rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-obsidian-light p-4 space-y-2">
            <button
              onClick={() => {
                clearWishlist();
                toast.success("Wishlist cleared");
              }}
              className="w-full text-pearl/60 hover:text-pearl text-xs font-bold tracking-widest uppercase py-2 transition-colors"
            >
              Clear All
            </button>
            <Link
              href="/store"
              onClick={onClose}
              className="block w-full bg-crimson hover:bg-crimson-mid text-pearl text-xs font-black tracking-widest uppercase py-3 rounded text-center transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
