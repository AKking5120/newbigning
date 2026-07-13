import { Resend } from "resend";
import type { Order } from "@/types";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(order: Order) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #333;">${item.name} ${item.size ? `(${item.size})` : ""}</td>
        <td style="padding:8px;border-bottom:1px solid #333;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #333;text-align:right;">₹${item.price.toLocaleString("en-IN")}</td>
      </tr>
    `
    )
    .join("");

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "orders@radhaji.com",
    to: order.customerEmail,
    subject: `Order Confirmed — ${order.orderNumber} | RADHAJI`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"/></head>
        <body style="background:#0a0a0a;color:#fff;font-family:Arial,sans-serif;margin:0;padding:0;">
          <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
            <div style="text-align:center;margin-bottom:32px;">
              <span style="font-size:28px;font-weight:900;letter-spacing:4px;">RADHAJI</span>
              <p style="color:#888;font-size:12px;letter-spacing:2px;margin:4px 0 0;">PREMIUM ACTIVEWEAR</p>
            </div>
            <div style="background:#111;border:1px solid #222;border-radius:8px;padding:32px;">
              <div style="text-align:center;margin-bottom:24px;">
                <div style="background:#ef4444;width:56px;height:56px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:24px;">✓</div>
                <h1 style="font-size:22px;font-weight:900;letter-spacing:2px;margin:16px 0 8px;">ORDER CONFIRMED!</h1>
                <p style="color:#888;margin:0;">Thank you for choosing RADHAJI. Your gear is on the way.</p>
              </div>
              <div style="background:#0a0a0a;border:1px solid #222;border-radius:6px;padding:16px;text-align:center;margin-bottom:24px;">
                <p style="color:#888;font-size:11px;letter-spacing:2px;margin:0 0 4px;">ORDER ID</p>
                <p style="color:#ef4444;font-size:18px;font-weight:700;letter-spacing:3px;margin:0;">${order.orderNumber}</p>
              </div>
              <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                <thead>
                  <tr style="border-bottom:1px solid #333;">
                    <th style="padding:8px;text-align:left;color:#888;font-size:12px;font-weight:500;">ITEM</th>
                    <th style="padding:8px;text-align:center;color:#888;font-size:12px;font-weight:500;">QTY</th>
                    <th style="padding:8px;text-align:right;color:#888;font-size:12px;font-weight:500;">PRICE</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>
              <div style="border-top:1px solid #333;padding-top:16px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                  <span style="color:#888;">Subtotal</span>
                  <span>₹${order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                  <span style="color:#888;">Shipping</span>
                  <span style="color:#22c55e;">${order.shippingCost === 0 ? "FREE" : `₹${order.shippingCost}`}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;margin-top:8px;padding-top:8px;border-top:1px solid #333;">
                  <span>TOTAL</span>
                  <span style="color:#ef4444;">₹${order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div style="margin-top:24px;padding-top:24px;border-top:1px solid #222;">
                <p style="color:#888;font-size:12px;margin:4px 0;">📦 Estimated delivery: 3-5 business days</p>
                <p style="color:#888;font-size:12px;margin:4px 0;">🚚 Free shipping applied</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
