import { Suspense } from "react";
import { OrderConfirmationContent } from "./OrderConfirmationContent";

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-zinc-700 border-t-red-600 rounded-full animate-spin" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
