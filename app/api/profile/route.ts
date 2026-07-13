import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, fullName, phone, address, city, state, pincode } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: "userId and email required" }, { status: 400 });
    }

    const { prisma } = await import("@/lib/prisma");
    const profile = await prisma.userProfile.upsert({
      where: { id: userId },
      update: { fullName, phone, address, city, state, pincode },
      create: { id: userId, email, fullName, phone, address, city, state, pincode },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE POST]", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
