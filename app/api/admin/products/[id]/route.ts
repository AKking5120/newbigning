import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { prisma } = await import("@/lib/prisma");
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { prisma } = await import("@/lib/prisma");

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.comparePrice !== undefined && { comparePrice: body.comparePrice }),
        ...(body.stock !== undefined && { stock: body.stock }),
        ...(body.images && { images: body.images }),
        ...(body.categoryId && { categoryId: body.categoryId }),
        ...(body.sizes && { sizes: body.sizes }),
        ...(body.colors && { colors: body.colors }),
        ...(body.tags && { tags: body.tags }),
        ...(body.isBestseller !== undefined && { isBestseller: body.isBestseller }),
        ...(body.isNewArrival !== undefined && { isNewArrival: body.isNewArrival }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
      },
    });
    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { prisma } = await import("@/lib/prisma");
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
