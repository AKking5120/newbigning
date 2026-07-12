import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const { prisma } = await import("@/lib/prisma");

    // Increment view count
    await prisma.product.updateMany({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, reviews: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
        : null;

    return NextResponse.json({
      ...product,
      avgRating,
      reviewCount: product.reviews.length,
    });
  } catch (error) {
    console.error("[PRODUCT GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
