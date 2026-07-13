import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
} as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("🌱 Seeding database...");

  // ── Categories ──────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "men" },
      update: {},
      create: {
        name: "Men",
        slug: "men",
        description: "Premium activewear for men",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "women" },
      update: {},
      create: {
        name: "Women",
        slug: "women",
        description: "Premium activewear for women",
        imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        slug: "accessories",
        description: "Training accessories and gear",
        imageUrl: "https://images.unsplash.com/photo-1553545985-1e0d8781d5db?w=600&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "collections" },
      update: {},
      create: {
        name: "Collections",
        slug: "collections",
        description: "Curated performance collections",
        imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
      },
    }),
  ]);

  const [men, women, accessories] = categories;
  console.log(`✅ ${categories.length} categories seeded`);

  // ── Products ─────────────────────────────────────────────────
  const products = [
    // ── MEN — Performance Gear ──────────────────────────────────
    {
      name: "AeroFlex Performance Hoodie",
      slug: "aeroflex-performance-hoodie",
      description: "Advanced 4-way stretch fabric with ThermoShield technology. Engineered for peak performance in any condition.",
      price: 3499, comparePrice: 4399,
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
               "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80"],
      categoryId: men.id,
      sizes: ["XS","S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Charcoal", hex:"#4a4a4a" },{ name:"Red", hex:"#ef4444" },{ name:"White", hex:"#ffffff" }],
      stock: 50, isBestseller: true, isNewArrival: false, isFeatured: true,
      tags: ["aeroflex","hoodie","men","performance"],
    },
    {
      name: "Raglan T",
      slug: "raglan-t",
      description: "4-Way Stretch. Odour Resistant. Ultra-breathable performance tee engineered for intense workouts.",
      price: 1199, comparePrice: 1499,
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
      categoryId: men.id,
      sizes: ["XS","S","M","L","XL","XXL"],
      colors: [{ name:"White", hex:"#ffffff" },{ name:"Black", hex:"#1a1a1a" },{ name:"Grey", hex:"#808080" }],
      stock: 120, isBestseller: true, isNewArrival: false, isFeatured: true,
      tags: ["raglan-t","men","performance","tee"],
    },
    {
      name: "Summit Training Tee",
      slug: "summit-training-tee",
      description: "Ultra-lightweight moisture-wicking tee. Perfect for intense training sessions.",
      price: 1299, comparePrice: 1499,
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
      categoryId: men.id,
      sizes: ["XS","S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"White", hex:"#ffffff" },{ name:"Red", hex:"#ef4444" }],
      stock: 100, isBestseller: true, isNewArrival: false, isFeatured: false,
      tags: ["summit-training-tee","men","performance","tee"],
    },
    {
      name: "Lightweight Short",
      slug: "lightweight-short",
      description: "Ultra-Light. Functional Pocketing. Maximum mobility for training and running.",
      price: 1599, comparePrice: 1999,
      images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80"],
      categoryId: men.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Navy", hex:"#1e3a8a" },{ name:"Grey", hex:"#808080" }],
      stock: 95, isBestseller: false, isNewArrival: true, isFeatured: false,
      tags: ["lightweight-short","men","performance","shorts"],
    },
    {
      name: "Performance Short",
      slug: "performance-short",
      description: "Durable. 4-Way Stretch. Built for high-intensity training and outdoor activities.",
      price: 1899, comparePrice: 2399,
      images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80"],
      categoryId: men.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Grey", hex:"#808080" }],
      stock: 80, isBestseller: true, isNewArrival: false, isFeatured: true,
      tags: ["performance-short","men","performance","shorts"],
    },
    {
      name: "Oversize Tee",
      slug: "oversize-tee",
      description: "Breathable. 4-Way Stretch. Relaxed fit with performance fabric technology.",
      price: 1299, comparePrice: 1599,
      images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"],
      categoryId: men.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Charcoal", hex:"#4a4a4a" },{ name:"White", hex:"#ffffff" }],
      stock: 110, isBestseller: false, isNewArrival: true, isFeatured: false,
      tags: ["oversize-tee","men","performance","tee"],
    },
    {
      name: "Muscle Tank",
      slug: "muscle-tank",
      description: "Natural Fiber. Relaxed Fit. Show off your gains with breathable muscle tank.",
      price: 999, comparePrice: 1299,
      images: ["https://images.unsplash.com/photo-1604480132736-44c188fe4d20?w=800&q=80"],
      categoryId: men.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Grey", hex:"#808080" },{ name:"Olive", hex:"#556b2f" }],
      stock: 75, isBestseller: false, isNewArrival: false, isFeatured: false,
      tags: ["muscle-tank","men","performance","tank"],
    },
    {
      name: "¼ Zip L/S",
      slug: "quarter-zip-ls",
      description: "4-Way Stretch. Breathable. Perfect layering piece for training and outdoor activities.",
      price: 2199, comparePrice: 2699,
      images: ["https://images.unsplash.com/photo-1620799140188-3b2a7ade2e0b?w=800&q=80"],
      categoryId: men.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Grey", hex:"#808080" },{ name:"Navy", hex:"#1e3a8a" }],
      stock: 65, isBestseller: true, isNewArrival: false, isFeatured: true,
      tags: ["quarter-zip","men","performance","long-sleeve"],
    },
    // ── MEN — Lifestyle Gear ────────────────────────────────────
    {
      name: "Tech Hoodie",
      slug: "tech-hoodie",
      description: "4-Way Stretch. Lightweight. Premium tech hoodie for gym-to-street transition.",
      price: 3299, comparePrice: 3999,
      images: ["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80"],
      categoryId: men.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Charcoal", hex:"#4a4a4a" }],
      stock: 55, isBestseller: true, isNewArrival: true, isFeatured: true,
      tags: ["tech-hoodie","men","lifestyle","hoodie"],
    },
    {
      name: "Performance Pant",
      slug: "performance-pant",
      description: "Lightweight. 4-Way Stretch. Versatile performance joggers for training and lifestyle.",
      price: 2899, comparePrice: 3599,
      images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80"],
      categoryId: men.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Charcoal", hex:"#4a4a4a" },{ name:"Navy", hex:"#1e3a8a" }],
      stock: 70, isBestseller: true, isNewArrival: false, isFeatured: true,
      tags: ["performance-pant","men","lifestyle","joggers"],
    },
    {
      name: "ThermoShield Training Jacket",
      slug: "thermoshield-training-jacket",
      description: "ThermoShield insulation keeps you warm during cold-weather training.",
      price: 4999, comparePrice: 6599,
      images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"],
      categoryId: men.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Charcoal", hex:"#4a4a4a" },{ name:"Red", hex:"#ef4444" }],
      stock: 45, isBestseller: true, isNewArrival: true, isFeatured: true,
      tags: ["performance-jacket","men","lifestyle","jacket"],
    },
    // ── MEN — Compression ───────────────────────────────────────
    {
      name: "Apex Compression Joggers",
      slug: "apex-compression-joggers",
      description: "Engineered compression fit for maximum muscle support. Moisture-wicking and quick-dry technology.",
      price: 2799, comparePrice: 3469,
      images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80"],
      categoryId: men.id,
      sizes: ["XS","S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Charcoal", hex:"#4a4a4a" }],
      stock: 75, isBestseller: true, isNewArrival: false, isFeatured: true,
      tags: ["compression-tights","men","compression"],
    },
    {
      name: "Compression Tee",
      slug: "compression-tee",
      description: "Engineered compression fit for maximum muscle support. Moisture-wicking technology.",
      price: 1699, comparePrice: 2099,
      images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"],
      categoryId: men.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"White", hex:"#ffffff" },{ name:"Grey", hex:"#808080" }],
      stock: 90, isBestseller: true, isNewArrival: false, isFeatured: true,
      tags: ["compression-tee","men","compression"],
    },
    {
      name: "Compression Shorts",
      slug: "compression-shorts",
      description: "High-performance compression shorts for training. Reduce muscle fatigue.",
      price: 1899, comparePrice: 2299,
      images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80"],
      categoryId: men.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Navy", hex:"#1e3a8a" }],
      stock: 85, isBestseller: true, isNewArrival: false, isFeatured: true,
      tags: ["compression-shorts","men","compression"],
    },
    // ── WOMEN ───────────────────────────────────────────────────
    {
      name: "FlexForm Sports Bra",
      slug: "flexform-sports-bra",
      description: "Medium-impact support with flexible underwire. Perfect for yoga, pilates, and light training.",
      price: 1799, comparePrice: 2199,
      images: ["https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80"],
      categoryId: women.id,
      sizes: ["XS","S","M","L","XL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"White", hex:"#ffffff" },{ name:"Red", hex:"#ef4444" }],
      stock: 45, isBestseller: false, isNewArrival: true, isFeatured: true,
      tags: ["sports-bra","women","yoga"],
    },
    {
      name: "Sculpt High-Waist Leggings",
      slug: "sculpt-high-waist-leggings",
      description: "Squat-proof, 4-way stretch leggings with a flattering high-waist band and hidden pocket.",
      price: 2499, comparePrice: 2999,
      images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80"],
      categoryId: women.id,
      sizes: ["XS","S","M","L","XL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Charcoal", hex:"#4a4a4a" }],
      stock: 55, isBestseller: false, isNewArrival: true, isFeatured: false,
      tags: ["leggings","women","yoga"],
    },
    // ── ACCESSORIES ─────────────────────────────────────────────
    {
      name: "PowerLift Training Gloves",
      slug: "powerlift-training-gloves",
      description: "Full palm protection with wrist support. Breathable mesh back keeps hands cool.",
      price: 899, comparePrice: 1099,
      images: ["https://images.unsplash.com/photo-1553545985-1e0d8781d5db?w=800&q=80"],
      categoryId: accessories.id,
      sizes: ["S","M","L","XL"],
      colors: [{ name:"Black", hex:"#1a1a1a" },{ name:"Red", hex:"#ef4444" }],
      stock: 80, isBestseller: false, isNewArrival: false, isFeatured: false,
      tags: ["gloves","accessories"],
    },
  ];

  let created = 0;
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        price: p.price,
        comparePrice: p.comparePrice,
        stock: p.stock,
        isBestseller: p.isBestseller,
        isNewArrival: p.isNewArrival,
        isFeatured: p.isFeatured,
      },
      create: {
        name:         p.name,
        slug:         p.slug,
        description:  p.description,
        price:        p.price,
        comparePrice: p.comparePrice,
        images:       p.images,
        categoryId:   p.categoryId,
        sizes:        p.sizes,
        colors:       p.colors,
        stock:        p.stock,
        isBestseller: p.isBestseller,
        isNewArrival: p.isNewArrival,
        isFeatured:   p.isFeatured,
        tags:         p.tags,
      },
    });
    created++;
  }

  console.log(`✅ ${created} products seeded`);
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
