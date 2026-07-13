import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "WALKUS — Premium Activewear | Shop High-Performance Gym Wear",
  description:
    "Discover WALKUS premium activewear with advanced fabrics and bold design. High-performance gym wear engineered for those who rise above. Free shipping on orders over ₹2000.",
  keywords: [
    "activewear",
    "gym wear",
    "sports clothing",
    "fitness",
    "premium activewear",
    "performance wear",
    "gym clothes",
    "workout apparel",
    "athletic wear India",
  ],
  metadataBase: new URL("https://walkus.com"),
  canonical: "https://walkus.com",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code
    google: "your-google-verification-code",
  },
  openGraph: {
    title: "WALKUS — Premium Activewear | Shop High-Performance Gym Wear",
    description:
      "Engineered for every summit. Shop premium activewear with advanced fabrics and bold design. Free shipping on orders over ₹2000.",
    type: "website",
    locale: "en_IN",
    url: "https://walkus.com",
    siteName: "WALKUS",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "WALKUS Premium Activewear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WALKUS — Premium Activewear",
    description: "Advanced fabrics. Bold design. Unmatched performance.",
    images: ["/og-image.jpg"],
    creator: "@walkus",
  },
  alternates: {
    canonical: "https://walkus.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD structured data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WALKUS",
    url: "https://walkus.com",
    logo: "https://walkus.com/logo.png",
    description: "Premium activewear with advanced fabrics and bold design",
    sameAs: [
      "https://www.facebook.com/walkus",
      "https://www.instagram.com/walkus",
      "https://www.twitter.com/walkus",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@walkus.com",
      telephone: "+91-XXXXXXXXXX",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressLocality: "India",
    },
  };

  // JSON-LD structured data for E-commerce Business
  const ecommerceSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://walkus.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://walkus.com/store?search={search_term_string}",
      },
      query_input: "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ecommerceSchema) }}
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-obsidian text-pearl antialiased">
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
                background: "var(--obsidian-mid)",
                border: "1px solid var(--obsidian-light)",
                color: "var(--pearl)",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
