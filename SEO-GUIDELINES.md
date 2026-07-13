# SEO Guidelines for WALKUS Store

## 🎯 Overview
This document outlines SEO best practices and checklist for the WALKUS premium activewear store.

---

## 📋 SEO Checklist

### ✅ Technical SEO
- [x] Sitemap.xml created (`/public/sitemap.xml`)
- [x] Robots.txt configured (`/public/robots.txt`)
- [x] JSON-LD structured data added
- [x] Open Graph tags implemented
- [x] Twitter Card tags configured
- [x] Mobile responsive design
- [x] Fast page load speed (Core Web Vitals optimized)
- [x] SSL/HTTPS enabled (required for e-commerce)
- [x] XML sitemap submitted to Google Search Console
- [x] Security headers configured (X-Content-Type-Options, X-Frame-Options, etc.)

### 📝 On-Page SEO
- [ ] Meta titles optimized (50-60 characters)
- [ ] Meta descriptions optimized (120-160 characters)
- [ ] H1 tags used correctly (one per page)
- [ ] Heading hierarchy (H1 > H2 > H3)
- [ ] Image alt text added to all images
- [ ] Internal linking strategy implemented
- [ ] URL structure optimized and SEO-friendly
- [ ] Canonical URLs added

### 🔗 Off-Page SEO
- [ ] Google Business Profile optimized
- [ ] Social media profiles created and linked
- [ ] High-quality backlinks obtained
- [ ] Business citations in directories
- [ ] Local SEO optimization (if applicable)

### 📊 Monitoring & Analytics
- [ ] Google Search Console connected
- [ ] Google Analytics 4 (GA4) setup
- [ ] Bing Webmaster Tools connected
- [ ] Core Web Vitals monitoring
- [ ] Ranking keywords tracked
- [ ] Traffic and conversion tracking

---

## 🚀 How to Implement

### 1. **Product Page SEO** (app/product/[slug]/page.tsx)

```typescript
import { generateProductMetadata, generateProductSchema } from "@/lib/seo";

export const generateMetadata = async ({ params }): Promise<Metadata> => {
  const product = await fetchProduct(params.slug);
  return generateProductMetadata(product);
};

export default function ProductPage() {
  const product = useProduct(slug);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema(product)),
        }}
      />
      {/* Your product content */}
    </>
  );
}
```

### 2. **Breadcrumb Navigation** (for better UX & SEO)

```typescript
import { generateBreadcrumbSchema } from "@/lib/seo";

const breadcrumbs = [
  { label: "Home", url: "https://walkus.com" },
  { label: "Store", url: "https://walkus.com/store" },
  { label: "Category", url: "https://walkus.com/store?category=..." },
  { label: "Product", url: "https://walkus.com/product/..." },
];

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
  }}
/>
```

### 3. **Image Optimization**

Always use Next.js `Image` component for optimized loading:

```typescript
import Image from "next/image";

<Image
  src={imageUrl}
  alt="Product name - descriptive alt text"
  width={600}
  height={600}
  priority // for above-the-fold images
  loading="lazy" // for below-the-fold images
/>
```

---

## 🎯 Keywords Strategy

### Primary Keywords
- Premium activewear India
- Gym wear online
- High-performance sports clothing
- Fitness apparel India
- Premium gym clothes

### Long-tail Keywords
- "Best premium activewear for gym"
- "High-quality gym wear online India"
- "Premium fitness clothing for women/men"
- "Performance activewear with free shipping"

### Category-Specific Keywords
- **T-Shirts**: "premium gym t-shirts", "performance t-shirts for fitness"
- **Shorts**: "premium gym shorts", "high-performance athletic shorts"
- **Jackets**: "premium gym jackets", "performance track jackets"

---

## 📊 Core Web Vitals Optimization

### LCP (Largest Contentful Paint) - Target: < 2.5s
- ✅ Optimize hero images (use WebP format)
- ✅ Implement lazy loading for non-critical images
- ✅ Enable image compression (Cloudinary)
- ✅ Minimize JavaScript bundles

### FID (First Input Delay) - Target: < 100ms
- ✅ Code split components with `dynamic()`
- ✅ Remove render-blocking JavaScript
- ✅ Optimize event handlers

### CLS (Cumulative Layout Shift) - Target: < 0.1
- ✅ Reserve space for images/ads
- ✅ Avoid inserting content above existing content
- ✅ Use CSS `aspect-ratio` for media containers

---

## 🔍 Tools & Resources

### Free SEO Tools
- [Google Search Console](https://search.google.com/search-console)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Ahrefs Free SEO Tools](https://ahrefs.com/free-seo-tools)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/)

### Premium Tools (Optional)
- Semrush
- Ahrefs
- Moz Pro
- SE Ranking

---

## 📝 Meta Tags Template

### For Product Pages
```
Title: [Product Name] - Premium [Category] | WALKUS (55 chars max)
Description: [Product Description First 120 chars]. Shop premium [category] at WALKUS. ₹[Price]. Free shipping on orders over ₹2000. (160 chars max)
```

### Example
```
Title: Premium Gym T-Shirt - High-Performance Activewear | WALKUS
Description: Premium gym t-shirt with advanced moisture-wicking fabric and bold design. Shop high-performance activewear at WALKUS. ₹1,499. Free shipping on orders over ₹2000.
```

---

## 📅 Monthly SEO Checklist

- [ ] Review top-performing pages in Google Analytics
- [ ] Check Core Web Vitals in Search Console
- [ ] Update product descriptions and keywords
- [ ] Add fresh internal links to new content
- [ ] Review and fix crawl errors in Search Console
- [ ] Update sitemap if new products added
- [ ] Analyze backlink profile (check for toxic links)
- [ ] Review competitor keywords and content
- [ ] Update social media links in footer

---

## 🎓 Additional Resources

### Learning Resources
- [Google Search Central](https://developers.google.com/search)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Moz SEO Guide](https://moz.com/beginners-guide-to-seo)

### Structured Data
- [Schema.org Documentation](https://schema.org/)
- [Google Structured Data Testing Tool](https://search.google.com/test/rich-results)

---

## 🚨 Common SEO Mistakes to Avoid

❌ **Don't:**
- Duplicate content across pages
- Overload pages with keywords (keyword stuffing)
- Use hidden text or cloaking
- Buy backlinks
- Ignore mobile users
- Create low-quality content
- Forget to optimize images
- Neglect internal linking

✅ **Do:**
- Create unique, quality content
- Use keywords naturally
- Optimize for user intent
- Earn high-quality backlinks
- Mobile-first design
- Focus on user experience
- Optimize all images
- Strategic internal linking

---

## 📞 Need Help?

For SEO issues or questions:
1. Check Google Search Console for errors
2. Run PageSpeed Insights test
3. Test structured data with Google's tool
4. Review this guide again
5. Contact SEO specialist if needed

---

**Last Updated:** July 13, 2026
**Status:** ✅ Active
