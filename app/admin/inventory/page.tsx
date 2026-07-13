"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, RefreshCw, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface Product {
  id: string; name: string; slug: string; price: number;
  stock: number; images: string[]; category: { name: string } | null;
  sizes: string[]; isBestseller: boolean;
}

type Filter = "all" | "low" | "out" | "ok";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<{ id: string; stock: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/products");
    const data = await r.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  async function updateStock(id: string, stock: number) {
    setSaving(true);
    const r = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    if (r.ok) {
      toast.success("Stock updated");
      setEditing(null);
      fetchProducts();
    } else toast.error("Failed to update stock");
    setSaving(false);
  }

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "out" ? p.stock === 0 :
      filter === "low" ? p.stock > 0 && p.stock <= 10 :
      filter === "ok"  ? p.stock > 10 : true;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: products.length,
    out: products.filter(p => p.stock === 0).length,
    low: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    ok:  products.filter(p => p.stock > 10).length,
  };

  function getStockStatus(stock: number) {
    if (stock === 0)  return { label: "Out of Stock", bg: "bg-crimson/10",    text: "text-crimson",    icon: AlertTriangle };
    if (stock <= 10)  return { label: "Low Stock",    bg: "bg-sand/10",       text: "text-sand",       icon: AlertTriangle };
    return              { label: "In Stock",      bg: "bg-emerald-500/10", text: "text-emerald-400", icon: CheckCircle  };
  }

  return (
    <div className="space-y-5">
      {/* Stock summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: "all" as Filter, label: "All Products",  bg: "bg-blue-50",  ic: "text-blue-600"   },
          { key: "ok"  as Filter, label: "In Stock",      bg: "bg-green-50", ic: "text-green-600"  },
          { key: "low" as Filter, label: "Low Stock",     bg: "bg-amber-50", ic: "text-amber-600"  },
          { key: "out" as Filter, label: "Out of Stock",  bg: "bg-red-50",   ic: "text-red-600"    },
        ].map(card => (
          <button key={card.key} onClick={() => setFilter(card.key)}
            className={`bg-white rounded-xl border shadow-sm p-5 text-left transition-all ${
              filter === card.key ? "border-red-400 ring-2 ring-red-100" : "border-gray-100 hover:border-gray-200"
            }`}>
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
              <Package className={`w-5 h-5 ${card.ic}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{counts[card.key]}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{card.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
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
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{filtered.length} Products</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Product", "Category", "Price", "Sizes", "Stock", "Status", "Action"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(product => {
                  const status = getStockStatus(product.stock);
                  const isEditing = editing?.id === product.id;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.images?.[0] ? (
                              <Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400 m-auto mt-2.5" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 max-w-[160px] truncate">{product.name}</p>
                            {product.isBestseller && (
                              <span className="text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">BESTSELLER</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{product.category?.name ?? "—"}</td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-900">{formatPrice(product.price)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.slice(0, 4).map(s => (
                            <span key={s} className="text-[10px] font-semibold border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                          {product.sizes.length > 4 && <span className="text-[10px] text-gray-400">+{product.sizes.length - 4}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <input type="number" value={editing.stock}
                            onChange={e => setEditing({ id: product.id, stock: parseInt(e.target.value) || 0 })}
                            className="w-20 border border-red-400 rounded-lg px-2 py-1 text-sm font-bold text-gray-900 focus:outline-none"
                            autoFocus min={0} />
                        ) : (
                          <span className="text-sm font-bold text-gray-900">{product.stock}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                          <status.icon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button onClick={() => updateStock(product.id, editing.stock)}
                              disabled={saving}
                              className="text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                              Save
                            </button>
                            <button onClick={() => setEditing(null)}
                              className="text-xs font-semibold border border-gray-200 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg transition-colors">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setEditing({ id: product.id, stock: product.stock })}
                            className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                            Update Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
