import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Calculator } from "@/components/landing/calculator"
import { ShowcaseFeatures } from "@/components/landing/showcase-features"
import { TrustedBy } from "@/components/landing/trusted-by"
import { BrandsBanner } from "@/components/landing/brands-banner"
import { UGC } from "@/components/landing/ugc"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      <Hero />
      <TrustedBy />
      <Calculator />
      <ShowcaseFeatures />
      <BrandsBanner />
      <Features />
      <UGC />
      <FAQ />
      <Footer />
    </main>
  )
}
