"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Eye, Filter } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface Order {
  id: string; orderNumber: string; customerName: string; customerEmail: string;
  customerPhone: string; city: string; state: string; address: string; pincode: string;
  total: number; subtotal: number; shippingCost: number;
  status: string; paymentStatus: string; createdAt: string;
  items: { name: string; quantity: number; price: number; size?: string; image: string }[];
}

const STATUSES = ["ALL","PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED","REFUNDED"];

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING:    { bg: "bg-sand/10",       text: "text-sand",       dot: "bg-sand"        },
  CONFIRMED:  { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500" },
  PROCESSING: { bg: "bg-blue-500/10",   text: "text-blue-400",   dot: "bg-blue-500"    },
  SHIPPED:    { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-500"  },
  DELIVERED:  { bg: "bg-emerald-600/10", text: "text-emerald-300", dot: "bg-emerald-600" },
  CANCELLED:  { bg: "bg-crimson/10",    text: "text-crimson",    dot: "bg-crimson"     },
  REFUNDED:   { bg: "bg-obsidian-light", text: "text-pearl/70",   dot: "bg-pearl/50"    },
};

function StatusBadge({ status }: { status: string }) {
  const c = statusConfig[status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} /> {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (statusFilter !== "ALL") p.set("status", statusFilter);
    if (search) p.set("search", search);
    const r = await fetch(`/api/admin/orders?${p}`);
    const data = await r.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const r = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (r.ok) {
      toast.success("Status updated");
      fetchOrders();
      setSelected(o => o?.id === id ? { ...o, status } : o);
    } else toast.error("Failed to update");
    setUpdating(null);
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search order ID, customer name..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 placeholder:text-gray-400" />
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  statusFilter === s ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {s}
              </button>
            ))}
          </div>

          <button onClick={fetchOrders} className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:text-gray-900 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">{orders.length} Orders</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Action"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-xs font-bold text-red-600">{order.orderNumber}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{order.items?.length ?? 0}</td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-900">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === "PAID" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-red-400 cursor-pointer">
                        {STATUSES.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(order)}
                        className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium">Order Details</p>
                <p className="text-lg font-black text-red-600">{selected.orderNumber}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selected.status} />
                <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 text-lg">×</button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Customer */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Info</p>
                <p className="font-bold text-gray-900">{selected.customerName}</p>
                <p className="text-sm text-gray-500">{selected.customerEmail}</p>
                <p className="text-sm text-gray-500">{selected.customerPhone}</p>
                <p className="text-sm text-gray-500 mt-1">{selected.address}, {selected.city}, {selected.state} - {selected.pincode}</p>
              </div>

              {/* Items */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">× {item.quantity}</p>
                        <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total + Update */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Order Total</p>
                  <p className="text-2xl font-black text-red-600">{formatPrice(selected.total)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Update Status</p>
                  <select value={selected.status}
                    onChange={e => updateStatus(selected.id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:border-red-400 bg-white">
                    {STATUSES.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
