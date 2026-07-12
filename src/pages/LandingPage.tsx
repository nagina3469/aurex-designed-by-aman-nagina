import IntroHero from '../components/IntroHero';
import Marquee from '../components/Marquee';
import FeatureShowcase from '../components/FeatureShowcase';
import ProductShowcase from '../components/ProductShowcase';
import AdventureSection from '../components/AdventureSection';
import ClosingCta from '../components/ClosingCta';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <>
      <IntroHero />
      <Marquee />
      <FeatureShowcase />
      <ProductShowcase />
      <AdventureSection />
      <ClosingCta />
      <Footer />
    </>
  );
}
