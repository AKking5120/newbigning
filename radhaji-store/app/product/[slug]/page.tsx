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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-zinc-700 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-400 text-sm uppercase tracking-widest">
          Product not found
        </p>
        <Link
          href="/store"
          className="bg-red-600 text-white text-xs font-bold tracking-widest uppercase px-8 py-3"
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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 hover:text-white uppercase transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> BACK TO STORE
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/" className="hover:text-white transition-colors uppercase">HOME</Link>
          <span>/</span>
          <Link href={`/store?category=${product.category?.slug}`} className="hover:text-white transition-colors uppercase">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-zinc-400">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-zinc-900 overflow-hidden">
              {product.isBestseller && (
                <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-black tracking-widest px-2 py-1 uppercase">
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
                    className={`relative w-16 h-16 bg-zinc-900 overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      activeImage === i ? "border-red-600" : "border-transparent"
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
              <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-2">
                {product.category.name} COLLECTION
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
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
                          ? "text-red-500 fill-red-500"
                          : "text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-zinc-400">
                  {product.avgRating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-black text-white">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-zinc-500 line-through text-lg">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 tracking-widest">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Inclusive of all taxes</p>

            {/* Description */}
            <p className="text-zinc-400 text-sm leading-relaxed mt-4">
              {product.description}
            </p>

            {/* Color picker */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-3">
                  COLOR:{" "}
                  <span className="text-white">
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
                          ? "border-red-600 scale-110"
                          : "border-zinc-600 hover:border-zinc-400"
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
                  <p className="text-xs font-bold tracking-widest uppercase text-zinc-400">
                    SIZE:{" "}
                    <span className="text-white">{selectedSize}</span>
                  </p>
                  <button className="text-xs text-zinc-500 hover:text-white underline transition-colors">
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
                          ? "bg-red-600 border-red-600 text-white"
                          : "border-zinc-700 text-zinc-300 hover:border-zinc-400 hover:text-white"
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
              <div className="flex items-center border border-zinc-700">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xl font-bold"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xl font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-widest uppercase h-11 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                ADD TO CART
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-2 border border-white text-white hover:bg-white hover:text-black font-black text-sm tracking-widest uppercase h-11 mt-3 transition-all"
            >
              <Zap className="w-4 h-4" />
              BUY IT NOW
            </button>

            {/* Trust */}
            <div className="flex items-center gap-2 mt-5 text-zinc-500 text-xs">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure 256-bit SSL encrypted checkout</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5 border-t border-zinc-800 pt-5">
              {[
                { icon: "🚚", text: "Free shipping over ₹2,000" },
                { icon: "🔄", text: "Easy 30-day returns" },
                { icon: "✅", text: "Authentic & verified" },
              ].map((item) => (
                <div key={item.text} className="text-center">
                  <p className="text-lg mb-1">{item.icon}</p>
                  <p className="text-[10px] text-zinc-500 leading-tight">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
