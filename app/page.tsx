import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BestSellers } from "@/components/home/BestSellers";
import { Testimonials } from "@/components/home/Testimonials";
import { CollectionBanner } from "@/components/home/CollectionBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoryGrid />
      <BestSellers />
      <Testimonials />
      <CollectionBanner />
      <FeaturedProducts />
    </>
  );
}
