/**
 * Payment Processing Utilities
 * Handles mock payment gateway and Razorpay integration
 */

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
  timestamp: string;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  method: "upi" | "card" | "netbanking" | "wallet" | "emi" | "cod";
}

/**
 * Mock Payment Gateway
 * Simulates payment processing for demo purposes
 */
export async function processPaymentMock(
  details: PaymentDetails
): Promise<PaymentResponse> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // 95% success rate for demo
      const isSuccess = Math.random() < 0.95;

      if (isSuccess) {
        resolve({
          success: true,
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          message: "Payment processed successfully",
          timestamp: new Date().toISOString(),
        });
      } else {
        resolve({
          success: false,
          transactionId: "",
          message: "Payment failed. Please try again.",
          timestamp: new Date().toISOString(),
        });
      }
    }, 2000);
  });
}

/**
 * Razorpay Payment Gateway Setup
 * For production use, integrate actual Razorpay API
 */
export interface RazorpayOptions {
  key_id: string;
  amount: number;
  currency: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  description: string;
}

export async function createRazorpayOrder(amount: number): Promise<{ id: string; amount: number }> {
  try {
    // In production, call your backend API to create order
    const response = await fetch("/api/payment/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) throw new Error("Failed to create order");

    const data = await response.json();
    return {
      id: data.id,
      amount: data.amount,
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
}

export async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/payment/razorpay/verify-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, paymentId, signature }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.verified;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

/**
 * Payment Method Specific Handlers
 */

export async function processUPI(details: PaymentDetails): Promise<PaymentResponse> {
  // For UPI, use mock gateway or integrate UPI API
  return processPaymentMock(details);
}

export async function processCard(details: PaymentDetails): Promise<PaymentResponse> {
  // For card payments, integrate with Razorpay or Stripe
  return processPaymentMock(details);
}

export async function processNetBanking(details: PaymentDetails): Promise<PaymentResponse> {
  // For net banking, use bank API integration
  return processPaymentMock(details);
}

export async function processWallet(details: PaymentDetails): Promise<PaymentResponse> {
  // For wallet, integrate with wallet provider API
  return processPaymentMock(details);
}

export async function processEMI(details: PaymentDetails): Promise<PaymentResponse> {
  // For EMI, integrate with partner NBFC/bank
  return processPaymentMock(details);
}

export async function processCOD(details: PaymentDetails): Promise<PaymentResponse> {
  // COD doesn't require payment processing
  return {
    success: true,
    transactionId: `COD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    message: "Cash on Delivery order created",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Main payment processor
 */
export async function processPayment(details: PaymentDetails): Promise<PaymentResponse> {
  switch (details.method) {
    case "upi":
      return processUPI(details);
    case "card":
      return processCard(details);
    case "netbanking":
      return processNetBanking(details);
    case "wallet":
      return processWallet(details);
    case "emi":
      return processEMI(details);
    case "cod":
      return processCOD(details);
    default:
      throw new Error("Invalid payment method");
  }
}

/**
 * Calculate payment charges and fees
 */
export function calculatePaymentCharges(
  amount: number,
  method: PaymentDetails["method"]
): { chargeAmount: number; totalAmount: number; chargePercent: number } {
  const charges: Record<string, number> = {
    upi: 0.5,
    card: 2.5,
    netbanking: 0.5,
    wallet: 0,
    emi: 0,
    cod: 0, // COD charges handled separately
  };

  const chargePercent = charges[method] || 0;
  const chargeAmount = Math.round((amount * chargePercent) / 100);
  const totalAmount = amount + chargeAmount;

  return { chargeAmount, totalAmount, chargePercent };
}

/**
 * Refund processing
 */
export interface RefundDetails {
  transactionId: string;
  orderId: string;
  amount: number;
  reason: string;
}

export async function processRefund(details: RefundDetails): Promise<PaymentResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `REFUND-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: `Refund of ₹${details.amount} initiated for order ${details.orderId}`,
        timestamp: new Date().toISOString(),
      });
    }, 1500);
  });
}
