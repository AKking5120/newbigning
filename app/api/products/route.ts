import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category  = searchParams.get("category");
    const sub       = searchParams.get("sub");
    const featured  = searchParams.get("featured")  === "true";
    const bestseller= searchParams.get("bestseller") === "true";
    const newArrival= searchParams.get("newArrival") === "true";
    const limit     = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

    const { prisma } = await import("@/lib/prisma");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};
    if (category)   where.category   = { slug: category };
    if (featured)   where.isFeatured  = true;
    if (bestseller) where.isBestseller= true;
    if (newArrival) where.isNewArrival = true;
    if (sub)        where.tags        = { has: sub };

    const products = await prisma.product.findMany({
      where,
      include: { category: true, reviews: true },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const result = products.map((p) => ({
      ...p,
      avgRating:
        p.reviews.length > 0
          ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
          : null,
      reviewCount: p.reviews.length,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[PRODUCTS GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
