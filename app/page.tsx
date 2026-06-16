import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Calculator } from "@/components/landing/calculator"
import { TrustedBy } from "@/components/landing/trusted-by"
import { BrandsBanner } from "@/components/landing/brands-banner"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      <Hero />
      <TrustedBy />
      <Calculator />
      <BrandsBanner />
      <Features />
      <FAQ />
      <Footer />
    </main>
  )
}
