import Navigation from '@/components/sections/navigation';
import HeroSection from '@/components/sections/hero';
import PropertyCarousel from '@/components/sections/property-carousel';
import ProductExplanation from '@/components/sections/product-explanation';
import QuienesSomos from '@/components/sections/quienes-somos';
import SocialProof from '@/components/sections/social-proof';
import { ComparisonSection } from '@/components/sections/comparison';
import FrequentlyAskedQuestions from '@/components/sections/faq';
import Footer from '@/components/sections/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <PropertyCarousel />
        <ProductExplanation />
        <QuienesSomos />
        <SocialProof />
        <ComparisonSection />
        <FrequentlyAskedQuestions />
      </main>
      <Footer />
    </div>
  );
}
