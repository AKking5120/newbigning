import { NextRequest, NextResponse } from "next/server";

function getDateRange(range: string): {
  from: Date; to: Date; points: number; format: string;
} {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case "today":
      return { from: today, to: new Date(today.getTime() + 86400000), points: 24, format: "hour" };
    case "yesterday": {
      const y = new Date(today.getTime() - 86400000);
      return { from: y, to: today, points: 24, format: "hour" };
    }
    case "last_week": {
      const w = new Date(today.getTime() - 7 * 86400000);
      return { from: w, to: now, points: 7, format: "day" };
    }
    case "30_days": {
      const d = new Date(today.getTime() - 30 * 86400000);
      return { from: d, to: now, points: 30, format: "day" };
    }
    case "last_year": {
      const yr = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      return { from: yr, to: now, points: 12, format: "month" };
    }
    default:
      return { from: new Date("2020-01-01"), to: now, points: 12, format: "month" };
  }
}

function formatLabel(date: Date, format: string): string {
  if (format === "hour") return `${date.getHours()}:00`;
  if (format === "day")  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
}

export async function GET(req: NextRequest) {
  const range = new URL(req.url).searchParams.get("range") ?? "30_days";
  const { from, to, points, format } = getDateRange(range);
  const { prisma } = await import("@/lib/prisma");

  // All non-cancelled orders in period
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: from, lte: to },
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
    include: { items: true },
    orderBy: { createdAt: "asc" },
  });

  // Build chart points from real data
  const interval = (to.getTime() - from.getTime()) / points;
  const chartData = Array.from({ length: points }, (_, i) => {
    const start = new Date(from.getTime() + i * interval);
    const end   = new Date(from.getTime() + (i + 1) * interval);
    const slice = orders.filter(o => {
      const t = new Date(o.createdAt).getTime();
      return t >= start.getTime() && t < end.getTime();
    });
    return {
      date:    formatLabel(start, format),
      revenue: slice.reduce((s, o) => s + o.total, 0),
      orders:  slice.length,
    };
  });

  const totalRevenue   = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders    = orders.length;
  const avgOrderValue  = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Growth vs previous period
  const periodMs  = to.getTime() - from.getTime();
  const prevFrom  = new Date(from.getTime() - periodMs);
  const prevOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: prevFrom, lte: from },
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
  });
  const prevRevenue     = prevOrders.reduce((s, o) => s + o.total, 0);
  const prevCount       = prevOrders.length;
  const revenueGrowth   = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
  const ordersGrowth    = prevCount   > 0 ? ((totalOrders  - prevCount)   / prevCount)   * 100 : 0;

  // Product performance — real data from DB
  const products = await prisma.product.findMany({
    include: {
      orderItems: {
        where: {
          order: {
            createdAt: { gte: from, lte: to },
            status: { notIn: ["CANCELLED", "REFUNDED"] },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Total cancelled qty per product in period (for return rate)
  const cancelledItems = await prisma.orderItem.findMany({
    where: {
      order: {
        createdAt: { gte: from, lte: to },
        status: { in: ["CANCELLED", "REFUNDED"] },
      },
    },
    select: { productId: true, quantity: true },
  });

  const cancelledByProduct: Record<string, number> = {};
  for (const ci of cancelledItems) {
    cancelledByProduct[ci.productId] = (cancelledByProduct[ci.productId] ?? 0) + ci.quantity;
  }

  const productTable = products
    .map(p => {
      const orderedQty  = p.orderItems.reduce((s, i) => s + i.quantity, 0);
      const cancelledQty = cancelledByProduct[p.id] ?? 0;
      const totalQty     = orderedQty + cancelledQty;
      const returnRate   = totalQty > 0 ? (cancelledQty / totalQty) * 100 : 0;
      const totalSales   = p.orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

      return {
        id:         p.id,
        name:       p.name,
        slug:       p.slug,
        image:      p.images?.[0] ?? "",
        views:      p.views,
        clicks:     p.clicks,
        orders:     p.orderItems.length,
        totalSales,
        returnRate,
      };
    })
    .sort((a, b) => b.orders - a.orders);

  return NextResponse.json({
    totalRevenue, totalOrders, avgOrderValue,
    revenueGrowth, ordersGrowth,
    chartData, productTable,
  });
}
