import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "RADHAJI — Premium Activewear",
  description:
    "Advanced fabrics. Bold design. Unmatched performance. For those who rise above.",
  keywords: ["activewear", "gym wear", "sports clothing", "fitness", "radhaji"],
  openGraph: {
    title: "RADHAJI — Premium Activewear",
    description: "Engineered for every summit. Shop premium activewear.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white antialiased">
        <QueryProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#111",
                border: "1px solid #333",
                color: "#fff",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
