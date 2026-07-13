"use client";

import { useState } from "react";
import { useCouponStore, type Coupon, type CouponType } from "@/store/coupon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";

/**
 * Admin Coupon Management Page
 */
export default function CouponsPage() {
  const {
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    activateCoupon,
    deactivateCoupon,
  } = useCouponStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: "",
    type: "percentage",
    value: 10,
    description: "",
    maxUses: 100,
    minOrderAmount: 500,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  });

  const handleAddCoupon = () => {
    if (
      !formData.code ||
      !formData.description ||
      formData.value === undefined
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingId) {
      updateCoupon(editingId, formData);
      toast.success("Coupon updated successfully");
      setEditingId(null);
    } else {
      addCoupon({
        code: formData.code!,
        type: formData.type as CouponType,
        value: formData.value!,
        description: formData.description!,
        maxUses: formData.maxUses || 100,
        minOrderAmount: formData.minOrderAmount || 0,
        expiryDate: formData.expiryDate || new Date().toISOString(),
        status: formData.status as any,
        maxDiscount: formData.maxDiscount,
      });
      toast.success("Coupon created successfully");
    }

    setFormData({
      code: "",
      type: "percentage",
      value: 10,
      description: "",
      maxUses: 100,
      minOrderAmount: 500,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    });
    setShowForm(false);
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData(coupon);
    setEditingId(coupon.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteCoupon(id);
    toast.success("Coupon deleted");
  };

  const handleToggleStatus = (coupon: Coupon) => {
    if (coupon.status === "active") {
      deactivateCoupon(coupon.id);
      toast.success("Coupon deactivated");
    } else {
      activateCoupon(coupon.id);
      toast.success("Coupon activated");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`"${code}" copied to clipboard`);
  };

  return (
    <main className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-widest uppercase">
              Coupon Management
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Total: {coupons.length} coupons
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingId(null);
              setFormData({
                code: "",
                type: "percentage",
                value: 10,
                description: "",
                maxUses: 100,
                minOrderAmount: 500,
                expiryDate: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toISOString(),
                status: "active",
              });
              setShowForm(!showForm);
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Coupon
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? "Edit Coupon" : "Create New Coupon"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="SAVE10"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase">
                  Type *
                </label>
                <select
                  value={formData.type || "percentage"}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as CouponType })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded focus:outline-none focus:border-red-600"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="buy-one-get-one">Buy One Get One</option>
                </select>
              </div>

              {/* Value */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase">
                  Value *
                </label>
                <input
                  type="number"
                  value={formData.value || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, value: parseFloat(e.target.value) })
                  }
                  placeholder="10"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Max Uses */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase">
                  Max Uses *
                </label>
                <input
                  type="number"
                  value={formData.maxUses || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, maxUses: parseInt(e.target.value) })
                  }
                  placeholder="100"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Min Order Amount */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase">
                  Min Order Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.minOrderAmount || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minOrderAmount: parseFloat(e.target.value),
                    })
                  }
                  placeholder="500"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Max Discount */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase">
                  Max Discount (₹) - For Percentage
                </label>
                <input
                  type="number"
                  value={formData.maxDiscount || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDiscount: parseFloat(e.target.value),
                    })
                  }
                  placeholder="500"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase">
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="10% off on any order"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase">
                  Expiry Date
                </label>
                <input
                  type="datetime-local"
                  value={
                    formData.expiryDate
                      ? new Date(formData.expiryDate).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expiryDate: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase">
                  Status
                </label>
                <select
                  value={formData.status || "active"}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded focus:outline-none focus:border-red-600"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddCoupon}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                {editingId ? "Update Coupon" : "Create Coupon"}
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="text-zinc-300 hover:text-white border-zinc-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Coupons Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-800/50">
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-400 uppercase">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-400 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-400 uppercase">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-400 uppercase">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{coupon.code}</span>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400 capitalize">
                      {coupon.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-bold">
                      {coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : `₹${coupon.value}`}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-white">{coupon.usedCount}</span>
                        <span className="text-zinc-500">/</span>
                        <span className="text-zinc-400">{coupon.maxUses}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          coupon.status === "active"
                            ? "bg-green-600 text-white"
                            : coupon.status === "inactive"
                            ? "bg-zinc-600 text-white"
                            : "bg-red-600 text-white"
                        }
                      >
                        {coupon.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(coupon)}
                          className="text-blue-500 hover:text-blue-400"
                          title={
                            coupon.status === "active" ? "Deactivate" : "Activate"
                          }
                        >
                          {coupon.status === "active" ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-orange-500 hover:text-orange-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {coupons.length === 0 && (
            <div className="text-center py-8 text-zinc-400">
              No coupons yet. Create one to get started!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
