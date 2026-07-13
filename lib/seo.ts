import { Metadata } from "next";

/**
 * Generate metadata for product pages
 * Usage: export const metadata = generateProductMetadata(product)
 */
export function generateProductMetadata(product: {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  slug: string;
  category?: { name: string };
  avgRating?: number;
  reviewCount?: number;
}): Metadata {
  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const title = `${product.name} - Premium Activewear | WALKUS`;
  const description = `${product.description.substring(0, 150)}... Shop premium ${product.category?.name || "activewear"} at WALKUS. ₹${product.price}${discountPercent > 0 ? ` (${discountPercent}% off)` : ""}. Free shipping on orders over ₹2000.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category?.name || "activewear",
      "gym wear",
      "sports clothing",
      "fitness apparel",
      "premium activewear",
    ],
    openGraph: {
      title,
      description,
      type: "product",
      url: `https://walkus.com/product/${product.slug}`,
      images: [
        {
          url: product.images[0],
          width: 600,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.images[0]],
    },
  };
}

/**
 * Generate JSON-LD Product schema
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  slug: string;
  category?: { name: string };
  avgRating?: number;
  reviewCount?: number;
  stock?: number;
}) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "WALKUS",
    },
    offers: {
      "@type": "Offer",
      url: `https://walkus.com/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price.toString(),
      priceCurrencyUSD: (product.price / 83).toFixed(2), // Approximate conversion
      availability: product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.avgRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.avgRating.toString(),
        reviewCount: (product.reviewCount || 0).toString(),
      },
    }),
  };
}

/**
 * Generate JSON-LD BreadcrumbList schema
 */
export function generateBreadcrumbSchema(breadcrumbs: { label: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: (index + 1).toString(),
      name: crumb.label,
      item: crumb.url,
    })),
  };
}

/**
 * Generate JSON-LD FAQPage schema
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Core Web Vitals optimization tips
 * LCP (Largest Contentful Paint): < 2.5s
 * FID (First Input Delay): < 100ms
 * CLS (Cumulative Layout Shift): < 0.1
 *
 * Recommendations:
 * 1. Use next/image for image optimization
 * 2. Implement lazy loading for images
 * 3. Code splitting with dynamic imports
 * 4. Remove unused CSS
 * 5. Minimize JavaScript bundles
 * 6. Enable compression (gzip)
 */
