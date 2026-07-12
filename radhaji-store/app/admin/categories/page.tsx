"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, RefreshCw, Tag, X } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string; name: string; slug: string;
  imageUrl: string | null; _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/categories");
    const data = await r.json();
    setCategories(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug) { toast.error("Name and slug required"); return; }
    setSaving(true);
    const r = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (r.ok) {
      toast.success("Category created!");
      setForm({ name: "", slug: "", imageUrl: "" });
      setShowForm(false);
      fetchCategories();
    } else toast.error("Failed to create category");
    setSaving(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? Products in this category will be unlinked.`)) return;
    const r = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (r.ok) { toast.success("Category deleted"); fetchCategories(); }
    else toast.error("Cannot delete — category has products");
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div />
        <div className="flex gap-2">
          <button onClick={fetchCategories} className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:text-gray-900 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">New Category</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
                <input value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                  required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
                  placeholder="e.g. Men" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Slug *</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
                  placeholder="e.g. men" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Image URL</label>
              <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
                placeholder="https://..." />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={saving}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                {saving ? "Creating..." : "Create Category"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="border border-gray-200 text-gray-600 hover:text-gray-900 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{categories.length} Categories</h2>
        </div>
        {loading ? (
          <div className="p-10 text-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto" /></div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No categories yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
                    <p className="text-xs text-gray-400">/{cat.slug} · {cat._count.products} products</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cat._count.products > 0 ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-500"}`}>
                    {cat._count.products} products
                  </span>
                  <button onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
