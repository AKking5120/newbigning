"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, ShoppingCart, Zap, Shield, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useProduct } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cart";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug);
  const { addItem } = useCartStore();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-obsidian-light border-t-crimson rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center gap-4">
        <p className="text-pearl/60 text-sm uppercase tracking-widest">
          Product not found
        </p>
        <Link
          href="/store"
          className="bg-crimson text-pearl text-xs font-bold tracking-widest uppercase px-8 py-3"
        >
          Back to Store
        </Link>
      </div>
    );
  }

  const discount = product.comparePrice
    ? getDiscountPercent(product.price, product.comparePrice)
    : 0;

  function handleAddToCart() {
    if (product!.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addItem({
      id: `${product!.id}-${selectedSize}-${selectedColor}`,
      productId: product!.id,
      name: product!.name,
      image: product!.images[0],
      price: product!.price,
      comparePrice: product!.comparePrice,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      slug: product!.slug,
    });
    toast.success(`${product!.name} added to cart!`);
  }

  function handleBuyNow() {
    if (product!.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    handleAddToCart();
    window.location.href = "/checkout";
  }

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-pearl/60 hover:text-pearl uppercase transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> BACK TO STORE
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-pearl/50 mb-8">
          <Link href="/" className="hover:text-pearl transition-colors uppercase">HOME</Link>
          <span>/</span>
          <Link href={`/store?category=${product.category?.slug}`} className="hover:text-pearl transition-colors uppercase">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-pearl/60">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-obsidian-light overflow-hidden">
              {product.isBestseller && (
                <div className="absolute top-4 left-4 z-10 bg-crimson text-pearl text-[10px] font-black tracking-widest px-2 py-1 uppercase">
                  BESTSELLER
                </div>
              )}
              <Image
                src={product.images[activeImage] ?? product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 bg-obsidian-light overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      activeImage === i ? "border-sand" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {product.category && (
              <p className="text-crimson text-xs font-bold tracking-[0.3em] uppercase mb-2">
                {product.category.name} COLLECTION
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl font-black text-pearl tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.avgRating && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(product.avgRating!)
                          ? "text-crimson fill-crimson"
                          : "text-obsidian-light"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-pearl/60">
                  {product.avgRating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-black text-pearl">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-pearl/50 line-through text-lg">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <span className="bg-crimson text-pearl text-xs font-black px-2 py-0.5 tracking-widest">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-pearl/50 mt-1">Inclusive of all taxes</p>

            {/* Description */}
            <p className="text-pearl/70 text-sm leading-relaxed mt-4">
              {product.description}
            </p>

            {/* Color picker */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold tracking-widest uppercase text-pearl/60 mb-3">
                  COLOR:{" "}
                  <span className="text-pearl">
                    {selectedColor || product.colors[0].name}
                  </span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        (selectedColor || product.colors[0].name) === color.name
                          ? "border-sand scale-110"
                          : "border-obsidian-light hover:border-pearl/50"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Select ${color.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size picker */}
            {product.sizes.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold tracking-widest uppercase text-pearl/60">
                    SIZE:{" "}
                    <span className="text-pearl">{selectedSize}</span>
                  </p>
                  <button className="text-xs text-pearl/50 hover:text-pearl underline transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[52px] h-11 px-3 text-sm font-bold tracking-wide border transition-all ${
                        selectedSize === size
                          ? "bg-crimson border-crimson text-pearl"
                          : "border-obsidian-light text-pearl/70 hover:border-pearl/50 hover:text-pearl"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex items-center border border-obsidian-light">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-pearl/60 hover:text-pearl hover:bg-obsidian-light transition-colors text-xl font-bold"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-bold text-pearl">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-pearl/60 hover:text-pearl hover:bg-obsidian-light transition-colors text-xl font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-mid text-pearl font-black text-sm tracking-widest uppercase h-11 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                ADD TO CART
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-2 border border-pearl text-pearl hover:bg-pearl hover:text-obsidian font-black text-sm tracking-widest uppercase h-11 mt-3 transition-all"
            >
              <Zap className="w-4 h-4" />
              BUY IT NOW
            </button>

            {/* Trust */}
            <div className="flex items-center gap-2 mt-5 text-pearl/60 text-xs">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Secure 256-bit SSL encrypted checkout</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5 border-t border-obsidian-light pt-5">
              {[
                { icon: "🚚", text: "Free shipping over ₹2,000" },
                { icon: "🔄", text: "Easy 30-day returns" },
                { icon: "✅", text: "Authentic & verified" },
              ].map((item) => (
                <div key={item.text} className="text-center">
                  <p className="text-lg mb-1">{item.icon}</p>
                  <p className="text-[10px] text-pearl/60 leading-tight">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
