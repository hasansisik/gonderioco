import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Globe, Shield, Zap, TrendingUp } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header theme="light" />
      
      <main className="flex-1 pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 max-w-5xl mb-16 lg:mb-20 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-slate-900 mb-4 tracking-tight leading-tight">
            <span className="font-light">E-ihracatta sınırları </span>
            <span className="font-extrabold italic text-[#FA8B00]">kaldırıyoruz.</span>
          </h1>
          <p className="text-slate-500 font-light text-sm md:text-[15px] max-w-2xl mx-auto leading-relaxed">
            Gönderio, Türkiye'deki girişimcilerin, KOBİ'lerin ve markaların ürünlerini dünyanın dört bir yanına güvenle, hızlı ve en uygun maliyetle ulaştırmalarını sağlayan yeni nesil lojistik teknolojileri şirketidir.
          </p>
        </section>

        {/* Mission / Vision */}
        <section className="bg-white py-24 mb-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Misyonumuz</h2>
                <p className="text-slate-600 leading-relaxed mb-8">
                  E-ticaret lojistiğini herkes için erişilebilir, anlaşılır ve şeffaf hale getirmek. Karmaşık gümrük süreçlerini, taşıma evraklarını ve fiyatlandırma tablolarını tek bir dijital platformda sadeleştirerek, satıcıların sadece ürünlerine ve satışlarına odaklanmalarını sağlamak.
                </p>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Vizyonumuz</h2>
                <p className="text-slate-600 leading-relaxed">
                  Türkiye'yi küresel e-ticaretin en güçlü lojistik merkezlerinden biri yapmak ve global pazaryerlerinde satış yapan her Türk markasının ilk tercih ettiği entegre taşıma partneri olmak.
                </p>
              </div>
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/auth.png" 
                  alt="Gönderio Lojistik Operasyonu" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  )
}
