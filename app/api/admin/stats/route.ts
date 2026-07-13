import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");

    const [totalOrders, totalProducts, totalUsers, orders, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.userProfile.count(),
      prisma.order.groupBy({ by: ["status"], _count: true, _sum: { total: true } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: { id: true, orderNumber: true, customerName: true, total: true, status: true, createdAt: true },
      }),
    ]);

    const totalRevenue = orders
      .filter(o => o.status !== "CANCELLED" && o.status !== "REFUNDED")
      .reduce((sum, o) => sum + (o._sum.total ?? 0), 0);

    const pendingOrders = orders.find(o => o.status === "PENDING")?._count ?? 0;
    const confirmedOrders = orders.find(o => o.status === "CONFIRMED")?._count ?? 0;
    const cancelledOrders = orders.find(o => o.status === "CANCELLED")?._count ?? 0;

    return NextResponse.json({
      totalRevenue, totalOrders, totalProducts, totalUsers,
      pendingOrders, confirmedOrders, cancelledOrders,
      recentOrders,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0,
      pendingOrders: 0, confirmedOrders: 0, cancelledOrders: 0, recentOrders: [],
    });
  }
}
