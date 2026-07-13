import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const { prisma } = await import("@/lib/prisma");

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (e) {
    console.error(e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prisma } = await import("@/lib/prisma");

    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      + "-" + Date.now().toString(36);

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description ?? "",
        price: body.price,
        comparePrice: body.comparePrice ?? null,
        images: body.images ?? [],
        categoryId: body.categoryId,
        sizes: body.sizes ?? [],
        colors: body.colors ?? [],
        stock: body.stock ?? 0,
        isBestseller: body.isBestseller ?? false,
        isNewArrival: body.isNewArrival ?? false,
        isFeatured: body.isFeatured ?? false,
        tags: body.tags ?? [],
      },
    });
    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
