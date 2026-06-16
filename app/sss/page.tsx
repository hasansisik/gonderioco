import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { FAQ } from "@/components/landing/faq"

export default function SSSPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header theme="light" />
      <main className="flex-1">
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
