"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Category { id: string; name: string; slug: string; }

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", comparePrice: "",
    categoryId: "", stock: "0", sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [""], tags: "", isBestseller: false, isNewArrival: false, isFeatured: false,
    colors: [{ name: "Black", hex: "#1a1a1a" }],
  });

  useEffect(() => {
    fetch("/api/admin/categories").then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  function set(key: string, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast.error("Name, price and category are required");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
          stock: parseInt(form.stock),
          images: form.images.filter(Boolean),
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
      if (!r.ok) throw new Error("Failed");
      toast.success("Product created!");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-black text-white tracking-widest uppercase">Add Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <h2 className="text-xs font-black tracking-widest uppercase text-zinc-400 mb-4">Basic Info</h2>
          <div>
            <label className="label-admin">Product Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} required
              className="input-admin" placeholder="AeroFlex Performance Hoodie" />
          </div>
          <div>
            <label className="label-admin">Description *</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={3} className="input-admin resize-none" placeholder="Product description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-admin">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                required className="input-admin" placeholder="3499" />
            </div>
            <div>
              <label className="label-admin">Compare Price (₹)</label>
              <input type="number" value={form.comparePrice} onChange={e => set("comparePrice", e.target.value)}
                className="input-admin" placeholder="4399" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-admin">Category *</label>
              <select value={form.categoryId} onChange={e => set("categoryId", e.target.value)}
                required className="input-admin">
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-admin">Stock</label>
              <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)}
                className="input-admin" placeholder="50" />
            </div>
          </div>
          <div>
            <label className="label-admin">Tags (comma separated)</label>
            <input value={form.tags} onChange={e => set("tags", e.target.value)}
              className="input-admin" placeholder="hoodie, men, performance" />
          </div>
        </div>

        {/* Images */}
        <div className="bg-zinc-900 border border-zinc-800 p-6">
          <h2 className="text-xs font-black tracking-widest uppercase text-zinc-400 mb-4">Images (URLs)</h2>
          <div className="space-y-2">
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input value={img} onChange={e => {
                  const imgs = [...form.images];
                  imgs[i] = e.target.value;
                  set("images", imgs);
                }} className="input-admin flex-1" placeholder="https://images.unsplash.com/..." />
                {form.images.length > 1 && (
                  <button type="button" onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                    className="text-red-500 hover:text-red-400 p-2"><X className="w-4 h-4" /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => set("images", [...form.images, ""])}
              className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors mt-1">
              <Plus className="w-3.5 h-3.5" /> Add Image
            </button>
          </div>
        </div>

        {/* Flags */}
        <div className="bg-zinc-900 border border-zinc-800 p-6">
          <h2 className="text-xs font-black tracking-widest uppercase text-zinc-400 mb-4">Flags</h2>
          <div className="flex gap-6">
            {[["isBestseller", "Bestseller"], ["isNewArrival", "New Arrival"], ["isFeatured", "Featured"]].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                  onChange={e => set(key, e.target.checked)}
                  className="w-4 h-4 accent-red-600" />
                <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-xs tracking-widest uppercase px-8 py-3 transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            CREATE PRODUCT
          </button>
          <Link href="/admin/products"
            className="border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold tracking-widest uppercase px-8 py-3 transition-colors">
            CANCEL
          </Link>
        </div>
      </form>

      <style jsx global>{`
        .input-admin { @apply w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 focus:outline-none focus:border-red-500 placeholder:text-zinc-600; }
        .label-admin { @apply block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5; }
      `}</style>
    </div>
  );
}
