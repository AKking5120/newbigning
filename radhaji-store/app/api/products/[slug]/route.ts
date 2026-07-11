import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    let product;
    try {
      const { prisma } = await import("@/lib/prisma");
      product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true, reviews: true },
      });
      if (product) {
        const avgRating =
          product.reviews.length > 0
            ? product.reviews.reduce((s, r) => s + r.rating, 0) /
              product.reviews.length
            : null;
        product = { ...product, avgRating, reviewCount: product.reviews.length };
      }
    } catch {
      product = mockProducts.find((p) => p.slug === slug) ?? null;
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT GET]", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
