import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(categories);
  } catch (e) {
    console.error(e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, slug, imageUrl } = await req.json();
    if (!name || !slug) return NextResponse.json({ error: "Name and slug required" }, { status: 400 });
    const { prisma } = await import("@/lib/prisma");
    const category = await prisma.category.create({
      data: { name, slug, imageUrl: imageUrl || null },
    });
    return NextResponse.json(category);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
