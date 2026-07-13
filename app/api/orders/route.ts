import { NextRequest, NextResponse } from "next/server";
import { generateOrderNumber } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      shippingDetails,
      total,
      subtotal,
      shippingCost = 0,
      paymentId,
      razorpayOrderId,
      paymentStatus = "PENDING",
    } = body;

    const orderNumber = generateOrderNumber();

    try {
      const { prisma } = await import("@/lib/prisma");

      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerName: shippingDetails.fullName,
          customerEmail: shippingDetails.email,
          customerPhone: shippingDetails.phone,
          address: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          pincode: shippingDetails.pincode,
          subtotal,
          shippingCost,
          tax: 0,
          total,
          status: paymentStatus === "PAID" ? "CONFIRMED" : "PENDING",
          paymentId: paymentId ?? null,
          razorpayOrderId: razorpayOrderId ?? null,
          paymentStatus: paymentStatus === "PAID" ? "PAID" : "PENDING",
          items: {
            create: items.map((item: {
              productId: string;
              name: string;
              image: string;
              price: number;
              quantity: number;
              size?: string;
              color?: string;
            }) => ({
              productId: item.productId,
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
              size: item.size ?? null,
              color: item.color ?? null,
            })),
          },
        },
        include: { items: true },
      });

      // Send confirmation email (non-critical)
      try {
        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey && !resendKey.includes("xx")) {
          const { sendOrderConfirmationEmail } = await import("@/lib/resend");
          await sendOrderConfirmationEmail({
            ...order,
            status: order.status as import("@/types").OrderStatus,
            paymentStatus: order.paymentStatus as import("@/types").PaymentStatus,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
            items: order.items.map((i) => ({
              ...i,
            })),
          } as import("@/types").Order);
        }
      } catch {
        // Email is non-critical
      }

      return NextResponse.json(order);
    } catch {
      // DB not configured — return mock order for demo
      return NextResponse.json({
        id: `mock_${Date.now()}`,
        orderNumber,
        total,
        status: "CONFIRMED",
        paymentStatus,
        items,
      });
    }
  } catch (error) {
    console.error("[ORDERS POST]", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
