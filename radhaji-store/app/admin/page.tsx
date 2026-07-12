"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, Package, Users, IndianRupee,
  TrendingUp, Clock, CheckCircle, XCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  CONFIRMED: "bg-green-500/20 text-green-400",
  PROCESSING: "bg-blue-500/20 text-blue-400",
  SHIPPED: "bg-purple-500/20 text-purple-400",
  DELIVERED: "bg-green-600/20 text-green-500",
  CANCELLED: "bg-red-500/20 text-red-400",
  REFUNDED: "bg-zinc-500/20 text-zinc-400",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Revenue", value: stats ? formatPrice(stats.totalRevenue) : "₹0", icon: IndianRupee, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Total Products", value: stats?.totalProducts ?? 0, icon: Package, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-orange-400", bg: "bg-orange-400/10" },
  ];

  const orderStats = [
    { label: "Pending", value: stats?.pendingOrders ?? 0, icon: Clock, color: "text-yellow-400" },
    { label: "Confirmed", value: stats?.confirmedOrders ?? 0, icon: CheckCircle, color: "text-green-400" },
    { label: "Cancelled", value: stats?.cancelledOrders ?? 0, icon: XCircle, color: "text-red-400" },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-widest uppercase">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Welcome back, Admin</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-zinc-800 h-28 rounded" />
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 p-5"
              >
                <div className={`w-10 h-10 ${card.bg} flex items-center justify-center mb-3`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="text-2xl font-black text-white">{card.value}</p>
                <p className="text-xs text-zinc-500 tracking-widest uppercase mt-1">{card.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Order Status Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {orderStats.map((s) => (
              <div key={s.label} className="bg-zinc-900 border border-zinc-800 p-4 flex items-center gap-4">
                <s.icon className={`w-5 h-5 ${s.color} flex-shrink-0`} />
                <div>
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="text-xs text-zinc-500 tracking-widest uppercase">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-zinc-900 border border-zinc-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-sm font-black tracking-widest uppercase text-white">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-red-500 hover:text-red-400 font-bold tracking-widest uppercase">
                View All →
              </Link>
            </div>
            {!stats?.recentOrders?.length ? (
              <div className="p-8 text-center text-zinc-600 text-sm">No orders yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {["Order ID", "Customer", "Total", "Status", "Date"].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-[10px] font-black tracking-widest uppercase text-zinc-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4 font-black text-red-500 text-xs tracking-wider">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 text-white text-xs">{order.customerName}</td>
                        <td className="px-6 py-4 text-white text-xs font-bold">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase rounded ${statusColors[order.status] ?? "bg-zinc-700 text-zinc-300"}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-500 text-xs">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Add Product", href: "/admin/products/new", color: "bg-red-600 hover:bg-red-700" },
              { label: "View Orders", href: "/admin/orders", color: "bg-zinc-800 hover:bg-zinc-700" },
              { label: "Manage Users", href: "/admin/users", color: "bg-zinc-800 hover:bg-zinc-700" },
              { label: "View Store", href: "/", color: "bg-zinc-800 hover:bg-zinc-700" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`${action.color} text-white text-xs font-black tracking-widest uppercase px-4 py-3 text-center transition-colors`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
