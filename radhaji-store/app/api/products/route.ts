import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";
    const bestseller = searchParams.get("bestseller") === "true";
    const newArrival = searchParams.get("newArrival") === "true";
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

    // Try Prisma first, fall back to mock
    let products;
    try {
      const { prisma } = await import("@/lib/prisma");
      const where: Record<string, unknown> = {};
      if (category) where.category = { slug: category };
      if (featured) where.isFeatured = true;
      if (bestseller) where.isBestseller = true;
      if (newArrival) where.isNewArrival = true;

      products = await prisma.product.findMany({
        where,
        include: { category: true, reviews: true },
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      // Calculate avg rating
      products = products.map((p) => ({
        ...p,
        avgRating:
          p.reviews.length > 0
            ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
            : null,
        reviewCount: p.reviews.length,
      }));
    } catch {
      // Use mock data if DB not set up
      products = mockProducts.filter((p) => {
        if (category && p.category?.slug !== category) return false;
        if (featured && !p.isFeatured) return false;
        if (bestseller && !p.isBestseller) return false;
        if (newArrival && !p.isNewArrival) return false;
        return true;
      });
      if (limit) products = products.slice(0, limit);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS GET]", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
