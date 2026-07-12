"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, RefreshCw, Edit } from "lucide-react";
import { toast } from "sonner";

interface Category { id: string; name: string; slug: string; imageUrl: string | null; _count: { products: number }; }

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
    } else {
      toast.error("Failed to create category");
    }
    setSaving(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    const r = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (r.ok) { toast.success("Deleted"); fetchCategories(); }
    else toast.error("Cannot delete category with products");
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white tracking-widest uppercase">Categories</h1>
        <div className="flex gap-3">
          <button onClick={fetchCategories} className="border border-zinc-700 text-zinc-400 hover:text-white p-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black tracking-widest uppercase px-5 py-2.5 transition-colors">
            <Plus className="w-4 h-4" /> ADD
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-zinc-900 border border-zinc-800 p-5 mb-6 space-y-3">
          <h2 className="text-xs font-black tracking-widest uppercase text-zinc-400">New Category</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1">Name *</label>
              <input value={form.name} onChange={e => {
                setForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }));
              }} required className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-red-500" placeholder="Men" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1">Slug *</label>
              <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                required className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-red-500" placeholder="men" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1">Image URL</label>
            <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-red-500" placeholder="https://..." />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-black tracking-widest uppercase px-6 py-2.5 transition-colors disabled:opacity-50">
              CREATE
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold tracking-widest uppercase px-6 py-2.5 transition-colors">
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="bg-zinc-900 border border-zinc-800">
        {loading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-zinc-700 border-t-red-600 rounded-full animate-spin mx-auto" /></div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 text-sm">No categories yet</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-white font-bold text-sm">{cat.name}</p>
                  <p className="text-zinc-500 text-xs">/{cat.slug} · {cat._count.products} products</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-zinc-500 hover:text-white p-1.5 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(cat.id, cat.name)}
                    className="text-red-500 hover:text-red-400 p-1.5 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
