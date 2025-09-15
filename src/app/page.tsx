import Navigation from '@/components/sections/navigation';
import HeroSection from '@/components/sections/hero';
import PropertyCarousel from '@/components/sections/property-carousel';
import ProductExplanation from '@/components/sections/product-explanation';
import Features from '@/components/sections/features';
import { ComparisonSection } from '@/components/sections/comparison';
import Footer from '@/components/sections/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <PropertyCarousel />
        <ProductExplanation />
        <Features />
        <ComparisonSection />
      </main>
      <Footer />
    </div>
  );
}
