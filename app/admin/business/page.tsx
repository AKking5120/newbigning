"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { TrendingUp, ShoppingBag, IndianRupee, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Range = "today" | "yesterday" | "last_week" | "30_days" | "last_year" | "overall";

const RANGES: { key: Range; label: string }[] = [
  { key: "today",      label: "Today"      },
  { key: "yesterday",  label: "Yesterday"  },
  { key: "last_week",  label: "Last Week"  },
  { key: "30_days",    label: "30 Days"    },
  { key: "last_year",  label: "Last Year"  },
  { key: "overall",    label: "Overall"    },
];

interface ChartPoint { date: string; revenue: number; orders: number; }
interface ProductRow {
  id: string; name: string; slug: string; image: string;
  views: number; clicks: number; orders: number;
  totalSales: number; returnRate: number;
}
interface BusinessData {
  totalRevenue: number; totalOrders: number; avgOrderValue: number;
  revenueGrowth: number; ordersGrowth: number;
  chartData: ChartPoint[];
  productTable: ProductRow[];
}

function StatCard({ label, value, icon: Icon, growth, prefix = "" }: {
  label: string; value: string | number; icon: React.ElementType;
  growth?: number; prefix?: string;
}) {
  const isPositive = (growth ?? 0) >= 0;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-red-600" />
        </div>
        {growth !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(growth).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{prefix}{value}</p>
      <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name === "revenue" ? formatPrice(p.value) : `${p.value} orders`}
        </p>
      ))}
    </div>
  );
};

export default function BusinessDashboardPage() {
  const [range, setRange] = useState<Range>("30_days");
  const [data, setData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/business?range=${range}`);
      const d = await r.json();
      setData(d);
    } catch { setData(null); }
    finally { setLoading(false); }
  }, [range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6">
      {/* Header + Range selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Business Overview</h2>
          <p className="text-sm text-gray-500">Track your store performance</p>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1 flex-wrap shadow-sm">
          {RANGES.map(r => (
            <button key={r.key} onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                range === r.key ? "bg-red-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse bg-white rounded-xl h-28 border border-gray-100" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Total Revenue"     value={formatPrice(data?.totalRevenue ?? 0)}                    icon={IndianRupee}  growth={data?.revenueGrowth} />
          <StatCard label="Total Orders"      value={data?.totalOrders ?? 0}                                  icon={ShoppingBag}  growth={data?.ordersGrowth}  />
          <StatCard label="Avg Order Value"   value={formatPrice(data?.avgOrderValue ?? 0)}                   icon={TrendingUp}                                 />
        </div>
      )}

      {/* Revenue + Orders Chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-4">Revenue & Orders</h3>
        {loading ? (
          <div className="h-64 animate-pulse bg-gray-50 rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data?.chartData ?? []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="rev" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area yAxisId="rev" type="monotone" dataKey="revenue" name="revenue" stroke="#ef4444" strokeWidth={2} fill="url(#revGrad)" dot={false} />
              <Area yAxisId="ord" type="monotone" dataKey="orders"  name="orders"  stroke="#3b82f6" strokeWidth={2} fill="url(#ordGrad)"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-4">Daily Orders Breakdown</h3>
        {loading ? (
          <div className="h-48 animate-pulse bg-gray-50 rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.chartData ?? []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="orders" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Product Performance Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Product Performance</h3>
          <p className="text-xs text-gray-500 mt-0.5">Views, clicks, orders and return rates per product</p>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto" /></div>
        ) : !data?.productTable?.length ? (
          <div className="p-10 text-center text-gray-400 text-sm">No product data available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Product", "Views", "Clicks", "Orders", "Total Sales", "Return Rate"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.productTable.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900 max-w-[200px] truncate">{row.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Eye className="w-3.5 h-3.5 text-gray-400" /> {row.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{row.clicks.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        {row.orders} orders
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-900">{formatPrice(row.totalSales)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        row.returnRate <= 5  ? "bg-green-50 text-green-700" :
                        row.returnRate <= 15 ? "bg-amber-50 text-amber-700" :
                        "bg-red-50 text-red-700"
                      }`}>
                        {row.returnRate <= 5
                          ? <ArrowDownRight className="w-3 h-3" />
                          : <ArrowUpRight className="w-3 h-3" />}
                        {row.returnRate.toFixed(1)}%
                        {row.returnRate <= 5 ? " Low" : row.returnRate <= 15 ? " Mid" : " High"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
