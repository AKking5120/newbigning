"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, Package, Users, IndianRupee,
  Clock, CheckCircle, XCircle, ArrowUpRight, TrendingUp,
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

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING:    { bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-500"  },
  CONFIRMED:  { bg: "bg-green-50",   text: "text-green-700",  dot: "bg-green-500"  },
  PROCESSING: { bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-500"   },
  SHIPPED:    { bg: "bg-purple-50",  text: "text-purple-700", dot: "bg-purple-500" },
  DELIVERED:  { bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-500"},
  CANCELLED:  { bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-500"    },
  REFUNDED:   { bg: "bg-gray-100",   text: "text-gray-600",   dot: "bg-gray-400"   },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Revenue", value: stats ? formatPrice(stats.totalRevenue) : "₹0", icon: IndianRupee, iconBg: "bg-green-100", iconColor: "text-green-600", trend: "+12.5%" },
    { label: "Total Orders",  value: stats?.totalOrders ?? 0,  icon: ShoppingBag, iconBg: "bg-blue-100",  iconColor: "text-blue-600",  trend: "+8.2%"  },
    { label: "Products",      value: stats?.totalProducts ?? 0, icon: Package,     iconBg: "bg-purple-100",iconColor: "text-purple-600",trend: "+3.1%"  },
    { label: "Customers",     value: stats?.totalUsers ?? 0,    icon: Users,       iconBg: "bg-orange-100",iconColor: "text-orange-600",trend: "+5.7%"  },
  ];

  const orderStats = [
    { label: "Pending",   value: stats?.pendingOrders ?? 0,   icon: Clock,         color: "text-amber-500",  bg: "bg-amber-50",  border: "border-amber-200"  },
    { label: "Confirmed", value: stats?.confirmedOrders ?? 0, icon: CheckCircle,   color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200"  },
    { label: "Cancelled", value: stats?.cancelledOrders ?? 0, icon: XCircle,       color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200"    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl h-28 border border-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" /> {card.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Order Status */}
      <div className="grid grid-cols-3 gap-4">
        {orderStats.map((s) => (
          <div key={s.label} className={`bg-white rounded-xl border ${s.border} shadow-sm p-4 flex items-center gap-4`}>
            <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label} Orders</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Recent Orders</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {!stats?.recentOrders?.length ? (
            <div className="p-10 text-center text-gray-400 text-sm">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50">
                    {["Order ID", "Customer", "Total", "Status", "Date"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 text-xs font-bold text-red-600">{order.orderNumber}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-900 font-medium">{order.customerName}</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{formatPrice(order.total)}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Add New Product", href: "/admin/products/new", primary: true, icon: Package },
              { label: "Manage Orders",   href: "/admin/orders",        primary: false, icon: ShoppingBag },
              { label: "View Customers",  href: "/admin/users",         primary: false, icon: Users },
              { label: "Add Category",    href: "/admin/categories",    primary: false, icon: Package },
              { label: "View Live Store", href: "/",                    primary: false, icon: ArrowUpRight },
            ].map(action => (
              <Link
                key={action.label}
                href={action.href}
                target={action.href === "/" ? "_blank" : undefined}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  action.primary
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <action.icon className="w-4 h-4 flex-shrink-0" />
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
