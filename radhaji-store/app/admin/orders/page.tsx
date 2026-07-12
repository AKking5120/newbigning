"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, RefreshCw, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  state: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
}

const ALL_STATUSES = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-green-500/20 text-green-400 border-green-500/30",
  PROCESSING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SHIPPED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DELIVERED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  REFUNDED: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (search) params.set("search", search);
    const r = await fetch(`/api/admin/orders?${params}`);
    const data = await r.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdating(orderId);
    const r = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (r.ok) {
      toast.success("Order status updated");
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((o) => o ? { ...o, status: newStatus } : null);
      }
    } else {
      toast.error("Failed to update status");
    }
    setUpdating(null);
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">Orders</h1>
          <p className="text-zinc-500 text-sm mt-1">{orders.length} orders</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 border border-zinc-700 text-zinc-400 hover:text-white px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer..."
            className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:border-red-500 placeholder:text-zinc-600"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-zinc-600" />
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-[10px] font-black tracking-widest uppercase transition-colors ${
                statusFilter === s ? "bg-red-600 text-white" : "border border-zinc-700 text-zinc-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-red-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-zinc-600 text-sm">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950">
                  {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black tracking-widest uppercase text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-red-500 font-black text-xs tracking-wider">{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-xs font-semibold">{order.customerName}</p>
                      <p className="text-zinc-500 text-[10px]">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">{order.items?.length ?? 0} items</td>
                    <td className="px-4 py-3 text-white text-xs font-bold">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase border rounded ${
                        order.paymentStatus === "PAID" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={`text-[10px] font-bold tracking-widest uppercase border rounded px-2 py-1 bg-transparent cursor-pointer focus:outline-none ${statusColors[order.status] ?? "border-zinc-700 text-zinc-400"}`}
                      >
                        {ALL_STATUSES.slice(1).map((s) => (
                          <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 text-zinc-400 hover:text-white text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Order Details</p>
                <p className="text-red-500 font-black text-lg tracking-wider">{selectedOrder.orderNumber}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-zinc-500 hover:text-white text-xl">×</button>
            </div>

            {/* Customer Info */}
            <div className="bg-zinc-950 border border-zinc-800 p-4 mb-4">
              <p className="text-[10px] text-zinc-500 tracking-widest uppercase mb-2">Customer</p>
              <p className="text-white font-bold text-sm">{selectedOrder.customerName}</p>
              <p className="text-zinc-400 text-xs">{selectedOrder.customerEmail}</p>
              <p className="text-zinc-400 text-xs">{selectedOrder.customerPhone}</p>
              <p className="text-zinc-400 text-xs mt-1">{selectedOrder.city}, {selectedOrder.state}</p>
            </div>

            {/* Items */}
            <div className="bg-zinc-950 border border-zinc-800 p-4 mb-4">
              <p className="text-[10px] text-zinc-500 tracking-widest uppercase mb-3">Items</p>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-zinc-300">{item.name} × {item.quantity}</span>
                    <span className="text-white font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total + Status */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Total</p>
                <p className="text-red-500 font-black text-xl">{formatPrice(selectedOrder.total)}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 tracking-widest uppercase mb-1">Update Status</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 text-white text-xs font-bold tracking-widest uppercase px-3 py-2 focus:outline-none focus:border-red-500"
                >
                  {ALL_STATUSES.slice(1).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
