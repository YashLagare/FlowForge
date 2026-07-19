import { HeroSection } from "./hero-section"
import { FeaturesSection } from "./features-section"
import { TestimonialsSection } from "./testimonials-section"
import { FaqSection } from "./faq-section"
import { PricingSection } from "./pricing-section"
import { CtaSection } from "./cta-section"

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FaqSection />
      <PricingSection />
      <CtaSection />
    </>
  )
}
