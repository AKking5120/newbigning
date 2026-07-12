import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  comparePrice?: number | null;
  slug: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const exists = get().items.some(i => i.productId === product.id);
        if (!exists) {
          set({
            items: [...get().items, {
              id: product.id,
              productId: product.id,
              name: product.name,
              image: product.images[0],
              price: product.price,
              comparePrice: product.comparePrice,
              slug: product.slug,
            }],
          });
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter(i => i.productId !== productId) }),

      toggleItem: (product) => {
        const exists = get().items.some(i => i.productId === product.id);
        if (exists) get().removeItem(product.id);
        else get().addItem(product);
      },

      isWishlisted: (productId) => get().items.some(i => i.productId === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "radhaji-wishlist" }
  )
);
