"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Category { id: string; name: string; }

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const DEFAULT_COLORS = [{ name: "Black", hex: "#1a1a1a" }];

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", comparePrice: "",
    categoryId: "", stock: "0",
    sizes: ["S", "M", "L", "XL"],
    images: [""],
    tags: "",
    isBestseller: false, isNewArrival: false, isFeatured: false,
    colors: DEFAULT_COLORS,
  });

  useEffect(() => {
    fetch("/api/admin/categories").then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function toggleSize(size: string) {
    set("sizes", form.sizes.includes(size)
      ? form.sizes.filter(s => s !== size)
      : [...form.sizes, size]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast.error("Name, price and category are required"); return;
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
    } catch { toast.error("Failed to create product"); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-3xl space-y-5">
      {/* Back */}
      <div className="flex items-center gap-2">
        <Link href="/admin/products" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <p className="text-sm text-gray-500">Back to Products</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Basic Information</h2>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 placeholder:text-gray-400"
              placeholder="e.g. AeroFlex Performance Hoodie" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 resize-none placeholder:text-gray-400"
              placeholder="Describe the product..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Selling Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => set("price", e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
                placeholder="3499" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">MRP / Compare Price (₹)</label>
              <input type="number" value={form.comparePrice} onChange={e => set("comparePrice", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
                placeholder="4399" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label>
              <select value={form.categoryId} onChange={e => set("categoryId", e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-red-400 bg-white">
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Stock Quantity</label>
              <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
                placeholder="50" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tags (comma separated)</label>
            <input value={form.tags} onChange={e => set("tags", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
              placeholder="hoodie, men, performance" />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Product Images</h2>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input value={img} onChange={e => {
                const imgs = [...form.images]; imgs[i] = e.target.value; set("images", imgs);
              }} className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
                placeholder="https://images.unsplash.com/..." />
              {form.images.length > 1 && (
                <button type="button" onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => set("images", [...form.images, ""])}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium">
            <Plus className="w-4 h-4" /> Add Another Image
          </button>
        </div>

        {/* Sizes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3 mb-4">Available Sizes</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map(size => (
              <button key={size} type="button" onClick={() => toggleSize(size)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  form.sizes.includes(size)
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Flags */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3 mb-4">Labels & Visibility</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "isBestseller", label: "Bestseller", desc: "Show bestseller badge" },
              { key: "isNewArrival", label: "New Arrival", desc: "Show new badge" },
              { key: "isFeatured",   label: "Featured",   desc: "Show on homepage" },
            ].map(({ key, label, desc }) => (
              <label key={key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                form[key as keyof typeof form] ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}>
                <input type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={e => set(key as keyof typeof form, e.target.checked as never)}
                  className="mt-0.5 accent-red-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Create Product
          </button>
          <Link href="/admin/products" className="border border-gray-200 text-gray-600 hover:text-gray-900 font-medium text-sm px-6 py-3 rounded-lg transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
