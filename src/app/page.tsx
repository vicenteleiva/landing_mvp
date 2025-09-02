import Navigation from '@/components/sections/navigation';
import HeroSection from '@/components/sections/hero';
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
        <ProductExplanation />
        <Features />
        <ComparisonSection />
      </main>
      <Footer />
    </div>
  );
}