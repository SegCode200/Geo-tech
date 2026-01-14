


// ================================
// COLanding.tsx
// ================================
import { Navbar } from "../components/layouts/Navbar";
import { Hero } from "../components/Home/Hero";
import { CTA, News } from "../components/Home/StepCard";
import { HowItWorks, TrustBar } from "../components/Home/HowisWorks";
import { Features } from "../components/Home/FeatureCard";
import { Testimonials } from "../components/Home/TestimonialCard";
import { Footer } from "../components/Footer";

export default function COLanding() {
  return (
    <div className="bg-gray-50 text-gray-900">
      <Navbar />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Features />
      <Testimonials />
      <News />
      <CTA />
      <Footer />
    </div>
  );
}
