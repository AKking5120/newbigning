"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, Clock, CheckCircle, XCircle,
  Truck, Download, RefreshCw, Eye, FileText,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { name: string; quantity: number; price: number; size?: string; image: string }[];
}

type TabStatus = "ALL" | "ON_HOLD" | "READY_TO_SHIP" | "SHIPPED" | "CANCELLED";

const STATUS_MAP: Record<TabStatus, string[]> = {
  ALL: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
  ON_HOLD: ["PENDING"],
  READY_TO_SHIP: ["CONFIRMED", "PROCESSING"],
  SHIPPED: ["SHIPPED", "DELIVERED"],
  CANCELLED: ["CANCELLED", "REFUNDED"],
};

const tabs: { key: TabStatus; label: string; icon: React.ElementType; color: string }[] = [
  { key: "ALL",           label: "All Orders",     icon: ShoppingBag,  color: "text-gray-600"   },
  { key: "ON_HOLD",       label: "On Hold",         icon: Clock,        color: "text-amber-600"  },
  { key: "READY_TO_SHIP", label: "Ready to Ship",   icon: CheckCircle,  color: "text-blue-600"   },
  { key: "SHIPPED",       label: "Shipped",         icon: Truck,        color: "text-green-600"  },
  { key: "CANCELLED",     label: "Cancelled",       icon: XCircle,      color: "text-red-600"    },
];

const statusBadge: Record<string, string> = {
  PENDING:    "bg-amber-50 text-amber-700",
  CONFIRMED:  "bg-blue-50 text-blue-700",
  PROCESSING: "bg-purple-50 text-purple-700",
  SHIPPED:    "bg-green-50 text-green-700",
  DELIVERED:  "bg-emerald-50 text-emerald-700",
  CANCELLED:  "bg-red-50 text-red-700",
  REFUNDED:   "bg-gray-100 text-gray-600",
};

function generateBillHTML(order: Order): string {
  const itemsHTML = order.items.map(i =>
    `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${i.name}${i.size ? ` (${i.size})` : ""}</td>
     <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
     <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${(i.price * i.quantity).toLocaleString("en-IN")}</td></tr>`
  ).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${order.orderNumber}</title>
  <style>body{font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#111;}
  h1{color:#ef4444;letter-spacing:3px;}table{width:100%;border-collapse:collapse;}
  th{background:#f5f5f5;padding:8px;text-align:left;font-size:12px;text-transform:uppercase;}
  .total{font-size:18px;font-weight:bold;color:#ef4444;}</style></head>
  <body><h1>WALKUS</h1><p style="color:#888;font-size:12px;">PREMIUM ACTIVEWEAR</p><hr/>
  <h2>INVOICE</h2><p><strong>Order ID:</strong> ${order.orderNumber}</p>
  <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
  <p><strong>Customer:</strong> ${order.customerName}</p>
  <p><strong>Email:</strong> ${order.customerEmail}</p>
  <p><strong>Phone:</strong> ${order.customerPhone}</p>
  <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
  <hr/><table><thead><tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Amount</th></tr></thead>
  <tbody>${itemsHTML}</tbody></table><hr/>
  <p>Subtotal: ₹${order.subtotal.toLocaleString("en-IN")}</p>
  <p>Shipping: ${order.shippingCost === 0 ? "FREE" : `₹${order.shippingCost}`}</p>
  <p class="total">TOTAL: ₹${order.total.toLocaleString("en-IN")}</p>
  <p style="color:#888;font-size:11px;margin-top:30px;">Thank you for shopping with WALKUS!</p>
  </body></html>`;
}

function downloadBill(order: Order) {
  const html = generateBillHTML(order);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice-${order.orderNumber}.html`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Invoice downloaded for ${order.orderNumber}`);
}

export default function AdminHomePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabStatus>("ALL");
  const [selected, setSelected] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/orders");
      const data = await r.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  }, []);

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
    } else toast.error("Failed");
    setUpdating(null);
  }

  const filtered = orders.filter(o => STATUS_MAP[activeTab].includes(o.status));

  // Counts for tab badges
  const counts: Record<TabStatus, number> = {
    ALL:           orders.length,
    ON_HOLD:       orders.filter(o => STATUS_MAP.ON_HOLD.includes(o.status)).length,
    READY_TO_SHIP: orders.filter(o => STATUS_MAP.READY_TO_SHIP.includes(o.status)).length,
    SHIPPED:       orders.filter(o => STATUS_MAP.SHIPPED.includes(o.status)).length,
    CANCELLED:     orders.filter(o => STATUS_MAP.CANCELLED.includes(o.status)).length,
  };

  const totalRevenue = orders
    .filter(o => !["CANCELLED", "REFUNDED"].includes(o.status))
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders",   value: orders.length,                                                    icon: ShoppingBag, bg: "bg-blue-50",   ic: "text-blue-600"   },
          { label: "Pending",        value: counts.ON_HOLD,                                                   icon: Clock,       bg: "bg-amber-50",  ic: "text-amber-600"  },
          { label: "Ready to Ship",  value: counts.READY_TO_SHIP,                                             icon: CheckCircle, bg: "bg-purple-50", ic: "text-purple-600" },
          { label: "Total Revenue",  value: formatPrice(totalRevenue),                                        icon: FileText,    bg: "bg-green-50",  ic: "text-green-600"  },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.ic}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Orders section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center justify-between px-5 pt-4 border-b border-gray-100">
          <div className="flex gap-1 overflow-x-auto pb-0">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                  activeTab === tab.key
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                <tab.icon className={`w-4 h-4 ${tab.color}`} />
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ml-1 ${
                  activeTab === tab.key ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                }`}>
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>
          <button onClick={fetchOrders} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg ml-2 flex-shrink-0">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-10 text-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No orders in this category</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-xs font-bold text-red-600">{order.orderNumber}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerPhone}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{order.items?.length ?? 0} items</td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-900">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4">
                      <select value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${statusBadge[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED","REFUNDED"].map(s => (
                          <option key={s} value={s} className="bg-white text-gray-900">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(order)}
                          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors">
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button onClick={() => downloadBill(order)}
                          className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors">
                          <Download className="w-3.5 h-3.5" /> Bill
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400">Order Details</p>
                <p className="text-lg font-black text-red-600">{selected.orderNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => downloadBill(selected)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download Bill
                </button>
                <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 text-lg">×</button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer</p>
                <p className="font-bold text-gray-900">{selected.customerName}</p>
                <p className="text-sm text-gray-500">{selected.customerEmail} · {selected.customerPhone}</p>
                <p className="text-sm text-gray-500 mt-1">{selected.address}, {selected.city}, {selected.state} - {selected.pincode}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}{item.size ? ` (${item.size})` : ""}</p>
                        <p className="text-xs text-gray-400">× {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-2xl font-black text-red-600">{formatPrice(selected.total)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Update Status</p>
                  <select value={selected.status}
                    onChange={e => updateStatus(selected.id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:border-red-400 bg-white">
                    {["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED","REFUNDED"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
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
