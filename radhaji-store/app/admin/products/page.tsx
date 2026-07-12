"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  images: string[];
  category: { name: string } | null;
  isBestseller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const r = await fetch(`/api/admin/products?${params}`);
    const data = await r.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    const r = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (r.ok) {
      toast.success("Product deleted");
      fetchProducts();
    } else {
      toast.error("Failed to delete product");
    }
    setDeleting(null);
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">Products</h1>
          <p className="text-zinc-500 text-sm mt-1">{products.length} products</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchProducts} className="border border-zinc-700 text-zinc-400 hover:text-white px-3 py-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black tracking-widest uppercase px-5 py-2.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> ADD PRODUCT
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:border-red-500 placeholder:text-zinc-600"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse bg-zinc-800 h-56 rounded" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-zinc-900 border border-zinc-800 group">
              {/* Image */}
              <div className="relative aspect-square bg-zinc-800 overflow-hidden">
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="300px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">No Image</div>
                )}
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isBestseller && <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 uppercase">Bestseller</span>}
                  {product.isNewArrival && <span className="bg-white text-black text-[9px] font-black px-1.5 py-0.5 uppercase">New</span>}
                  {product.isFeatured && <span className="bg-yellow-500 text-black text-[9px] font-black px-1.5 py-0.5 uppercase">Featured</span>}
                </div>
                {/* Stock badge */}
                <div className={`absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 uppercase ${product.stock > 10 ? "bg-green-600 text-white" : product.stock > 0 ? "bg-yellow-500 text-black" : "bg-red-600 text-white"}`}>
                  {product.stock > 0 ? `${product.stock} left` : "Out"}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-white text-xs font-bold leading-tight line-clamp-1">{product.name}</p>
                <p className="text-zinc-500 text-[10px] mt-0.5">{product.category?.name ?? "Uncategorized"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-red-500 font-black text-sm">{formatPrice(product.price)}</span>
                  {product.comparePrice && (
                    <span className="text-zinc-600 text-xs line-through">{formatPrice(product.comparePrice)}</span>
                  )}
                </div>
                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-xs font-bold tracking-widest uppercase py-2 transition-colors"
                  >
                    <Edit className="w-3 h-3" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deleting === product.id}
                    className="flex items-center justify-center border border-red-600/40 text-red-500 hover:bg-red-600/10 px-3 py-2 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
