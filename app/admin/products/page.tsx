"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, RefreshCw, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface Product {
  id: string; name: string; slug: string; price: number; comparePrice: number | null;
  stock: number; images: string[]; category: { name: string } | null;
  isBestseller: boolean; isNewArrival: boolean; isFeatured: boolean; createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    const r = await fetch(`/api/admin/products?${p}`);
    const data = await r.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    setDeleting(id);
    const r = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (r.ok) { toast.success("Product deleted"); fetchProducts(); }
    else toast.error("Failed to delete");
    setDeleting(null);
  }

  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 placeholder:text-gray-400" />
          </div>
          <button onClick={fetchProducts} className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:text-gray-900 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link href="/admin/products/new"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse bg-white rounded-xl h-64 border border-gray-100" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No products found</p>
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 mt-4 bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors">
            <Plus className="w-4 h-4" /> Add First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="280px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-gray-300" /></div>
                )}
                {/* Top badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isBestseller && <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">BESTSELLER</span>}
                  {product.isNewArrival && <span className="bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded">NEW</span>}
                  {product.isFeatured && <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">FEATURED</span>}
                </div>
                {/* Stock */}
                <div className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  product.stock > 10 ? "bg-green-100 text-green-700" :
                  product.stock > 0  ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{product.category?.name ?? "—"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-bold text-red-600">{formatPrice(product.price)}</span>
                  {product.comparePrice && (
                    <span className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                  )}
                </div>
                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <Link href={`/admin/products/${product.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 text-xs font-semibold py-2 rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button onClick={() => handleDelete(product.id, product.name)}
                    disabled={deleting === product.id}
                    className="flex items-center justify-center border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
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
