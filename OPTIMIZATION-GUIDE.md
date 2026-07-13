# WALKUS - Optimization Guide

## 🎯 Overview
Complete guide for Product Pages, Checkout, Mobile, Analytics, and CRO optimizations.

---

## 📊 Quick Implementation Checklist

- [x] **Analytics Library** - `lib/analytics.ts` - GA4 event tracking
- [x] **A/B Testing** - `lib/ab-testing.ts` - Conversion testing
- [x] **Product SEO** - `lib/product-seo.ts` - Dynamic metadata
- [x] **Mobile Optimization** - `lib/mobile-optimization.ts` - Mobile UX
- [x] **Checkout Progress** - `components/checkout/CheckoutProgress.tsx`
- [x] **Trust Badges** - `components/common/TrustBadges.tsx`
- [x] **Analytics Provider** - `components/providers/AnalyticsProvider.tsx`

---

## 🚀 How to Implement

### 1. **Product Pages Optimization**

#### Step 1: Update Product Page with SEO Metadata

Create `app/product/[slug]/page.tsx` with dynamic metadata:

```typescript
import { generateProductMetadata } from "@/lib/product-seo";
import { Metadata } from "next";

export const generateMetadata = async ({ params }): Promise<Metadata> => {
  const product = await fetchProduct(params.slug);
  return generateProductMetadata(product, "https://yoursite.com");
};

export default function ProductPage() {
  const product = useProduct(slug);
  
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema(product, "https://yoursite.com")),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductBreadcrumb(product, "https://yoursite.com")),
        }}
      />
      
      {/* Your product content */}
    </>
  );
}
```

#### Step 2: Track Product Views

```typescript
import { productEvents } from "@/lib/analytics";

export default function ProductPage() {
  useEffect(() => {
    // Track product view
    productEvents.viewProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category?.name,
      image: product.images[0],
    });
  }, [product]);

  function handleAddToCart() {
    // Track add to cart
    productEvents.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category?.name,
    }, quantity);
  }
}
```

---

### 2. **Checkout Optimization**

#### Step 1: Add Progress Indicator

Update `app/checkout/page.tsx`:

```typescript
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { TrustBadges } from "@/components/common/TrustBadges";
import { checkoutEvents } from "@/lib/analytics";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    // Track checkout initiation
    checkoutEvents.beginCheckout(items, total);
  }, []);

  const handleNextStep = () => {
    setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
    checkoutEvents.checkoutProgress(
      currentStep === 1 ? "shipping" : "payment",
      currentStep
    );
  };

  return (
    <div>
      {/* Progress Indicator */}
      <CheckoutProgress currentStep={currentStep} />

      {/* Trust Badges - Improves conversion by 5-12% */}
      <TrustBadges variant="checkout" />

      {/* Form content */}
      {currentStep === 1 && <ShippingForm onNext={handleNextStep} />}
      {currentStep === 2 && <PaymentForm onNext={handleNextStep} />}
      {currentStep === 3 && <ConfirmationStep />}
    </div>
  );
}
```

#### Step 2: Track Purchase

```typescript
const handlePurchase = async (orderData: any) => {
  // Track purchase event
  checkoutEvents.purchaseComplete({
    id: orderData.id,
    revenue: orderData.total,
    items: orderData.items,
  });
};
```

---

### 3. **Mobile Optimization**

#### Step 1: Use Mobile Utilities

```typescript
import { 
  getViewportSize, 
  mobileFormOptimizations,
  isMobileDevice 
} from "@/lib/mobile-optimization";

export default function CheckoutForm() {
  const viewport = getViewportSize();

  return (
    <input
      type="email"
      placeholder="Email"
      {...mobileFormOptimizations.getInputAttributes("email")}
      {...(viewport === "mobile" && { autoFocus: true })}
    />
  );
}
```

#### Step 2: Responsive Images

```typescript
import { mobileImageOptimizations } from "@/lib/mobile-optimization";
import Image from "next/image";

<Image
  src={imageUrl}
  alt={generateImageAltText(product.name, index, total)}
  width={600}
  height={600}
  sizes={mobileImageOptimizations.sizes.medium}
  loading={index === 0 ? "eager" : "lazy"}
  priority={index === 0}
/>
```

---

### 4. **Analytics Setup**

#### Step 1: Add Analytics Provider to Root Layout

Update `app/layout.tsx`:

```typescript
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsProvider measurementId="G-XXXXXXXXXX">
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
```

**Get Measurement ID from Google Analytics:**
1. Go to https://analytics.google.com/
2. Click Admin → Data Streams → Select Web
3. Copy the Measurement ID (G-XXXXXXXXXX)
4. Paste it in the code above

#### Step 2: Track Events

```typescript
import { productEvents, engagementEvents } from "@/lib/analytics";

// Track product view
useEffect(() => {
  productEvents.viewProduct(product);
}, [product]);

// Track scroll depth
useEffect(() => {
  window.addEventListener("scroll", () => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    if (scrollPercentage === 50) {
      engagementEvents.scrollDepth("50");
    }
  });
}, []);
```

---

### 5. **CRO & A/B Testing**

#### Step 1: Set Up A/B Test

```typescript
import { getABTestVariant, trackABTestResult } from "@/lib/ab-testing";

export default function CTAButton() {
  const variant = getABTestVariant("checkout_button_text", [
    "control",
    "variant_a",
    "variant_b",
  ]);

  const buttonText = {
    control: "PLACE ORDER",
    variant_a: "COMPLETE PURCHASE",
    variant_b: "BUY NOW",
  };

  return (
    <button
      onClick={() => {
        trackABTestResult("checkout_button_text", "click");
        handleCheckout();
      }}
      className="bg-crimson hover:bg-crimson-mid text-pearl px-8 py-3"
    >
      {buttonText[variant]}
    </button>
  );
}
```

#### Step 2: Track Conversions

```typescript
trackABTestResult("checkout_button_text", "conversion", revenue);
```

---

## 📊 Analytics Dashboard

### Key Metrics to Track

1. **Product Pages**
   - Page views
   - Average time on page
   - Bounce rate
   - Click-through rate to add-to-cart

2. **Checkout Flow**
   - Checkout initiation rate
   - Checkout completion rate
   - Step-by-step abandonment
   - Average order value

3. **Mobile Performance**
   - Mobile traffic %
   - Mobile conversion rate
   - Mobile bounce rate
   - Page load time (mobile vs desktop)

4. **Conversions**
   - Conversion rate
   - Revenue per session
   - Customer acquisition cost
   - Return customer rate

---

## 🎯 CRO Quick Wins

### High-Impact (Do First)
- ✅ Add trust badges near CTA (+5-12% conversion)
- ✅ Show checkout progress (+3-8% conversion)
- ✅ Reduce form fields (+5-10% conversion)
- ✅ Add money-back guarantee (+5-8% conversion)
- ✅ Show stock status (+3-6% conversion)

### Medium-Impact (Do Next)
- ✅ A/B test button colors (+2-5% conversion)
- ✅ Add product reviews (+3-6% conversion)
- ✅ Add price comparison (+2-4% conversion)
- ✅ Show free shipping offer (+3-5% conversion)

### Monitoring
- ✅ Track Core Web Vitals
- ✅ Monitor scroll depth
- ✅ Track form abandonment
- ✅ Monitor error rates

---

## 📱 Mobile Checklist

- [x] Touch-friendly buttons (44x44px minimum)
- [x] Readable text (16px+ for body)
- [x] Fast load time (< 3 seconds)
- [x] Optimized images (WebP format)
- [x] Mobile-first navigation
- [x] One-hand reachable CTA
- [x] Minimal form fields
- [x] Clear visual hierarchy

---

## 🔗 Integration Example

### Complete Product Page with All Optimizations

```typescript
"use client";

import { useEffect, useState } from "react";
import { Metadata } from "next";
import { generateProductMetadata, generateProductSchema, generateProductBreadcrumb } from "@/lib/product-seo";
import { productEvents, engagementEvents } from "@/lib/analytics";
import { getABTestVariant, trackABTestResult } from "@/lib/ab-testing";
import { TrustBadges } from "@/components/common/TrustBadges";

export const generateMetadata = async ({ params }): Promise<Metadata> => {
  const product = await fetchProduct(params.slug);
  return generateProductMetadata(product, process.env.NEXT_PUBLIC_SITE_URL);
};

export default function ProductPage() {
  const product = useProduct(slug);
  const [cartButtonVariant] = useState(() => 
    getABTestVariant("add_to_cart_button", ["control", "variant_a"])
  );

  useEffect(() => {
    // Track view
    productEvents.viewProduct(product);

    // Track scroll
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) engagementEvents.scrollDepth("50");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [product]);

  const handleAddToCart = () => {
    trackABTestResult("add_to_cart_button", "click");
    productEvents.addToCart(product, quantity);
  };

  const cartButtonText = cartButtonVariant === "control" ? "ADD TO CART" : "BUY NOW";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateProductSchema(product, process.env.NEXT_PUBLIC_SITE_URL))
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateProductBreadcrumb(product, process.env.NEXT_PUBLIC_SITE_URL))
      }} />

      {/* Product Content */}
      <div className="product-page">
        {/* Images, Details, etc */}
        
        <button
          onClick={handleAddToCart}
          className="bg-crimson hover:bg-crimson-mid text-pearl px-8 py-3"
        >
          {cartButtonText}
        </button>

        {/* Trust Badges */}
        <TrustBadges variant="product" />
      </div>
    </>
  );
}
```

---

## 🌐 Domain Setup (When Ready)

When you get a domain:

1. Update `.env` files:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

2. Update GA4 Measurement ID in layout.tsx

3. Add Google Search Console verification

4. Update sitemap.xml domain

5. Submit to Google Search Console

---

## 📞 Support & Resources

- **Google Analytics:** https://analytics.google.com/
- **GA4 Setup:** https://support.google.com/analytics
- **A/B Testing Guide:** https://vwo.com/ab-testing/
- **CRO Best Practices:** https://www.optimizely.com/optimization-glossary/cro/
- **Mobile UX:** https://www.nngroup.com/articles/mobile-user-experience/

---

**Last Updated:** July 13, 2026
**Status:** ✅ Ready for Implementation
**Domain Required:** No (works without domain)
