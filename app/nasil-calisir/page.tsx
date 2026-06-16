import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ShoppingCart, Package, Plane, CheckCircle2 } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header theme="light" />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl text-center mb-16 lg:mb-20">
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-slate-900 mb-4 tracking-tight leading-tight">
            <span className="font-light">Sadece </span>
            <span className="font-extrabold italic">4 Adımda </span>
            <span className="font-light">Tüm Dünyaya Satış Yapın</span>
          </h1>
          <p className="text-slate-500 font-light text-sm md:text-[15px] max-w-2xl mx-auto leading-relaxed">
            Gönderio'nun akıllı altyapısı sayesinde yurt dışına kargo göndermek, yurt içine göndermek kadar kolaydır. İşte sürecin nasıl işlediği:
          </p>
        </div>

        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative border-l-2 border-slate-100 pl-8 ml-4 space-y-16">
            
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-[57px] top-1/2 -translate-y-1/2 w-12 h-12 bg-[#FA8B00] text-white rounded-full flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className="bg-white p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-3">1. Mağazanızı Bağlayın</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Amazon, Etsy, Shopify, WooCommerce gibi global pazaryerleri ve e-ticaret altyapılarınızı tek tıkla Gönderio paneline entegre edin. Siparişleriniz anında sistemimize düşer, manuel veri girmeye gerek kalmaz.
                </p>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200">Amazon</span>
                  <span className="px-3 py-1 bg-[#F56400]/10 text-[#F56400] rounded-full text-xs font-bold border border-[#F56400]/20">Etsy</span>
                  <span className="px-3 py-1 bg-[#95BF47]/10 text-[#95BF47] rounded-full text-xs font-bold border border-[#95BF47]/20">Shopify</span>
                  <span className="px-3 py-1 bg-[#96588A]/10 text-[#96588A] rounded-full text-xs font-bold border border-[#96588A]/20">WooCommerce</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-[57px] top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
                <Package className="w-5 h-5" />
              </div>
              <div className="bg-white p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-3">2. Gönderi Oluşturun ve Etiket Basın</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Gelen siparişiniz için sistemdeki en uygun taşıyıcı alternatiflerini ve fiyatları görüntüleyin. Seçiminizi yaptıktan sonra tek tıkla uluslararası kargo barkodunuzu ve proforma faturanızı yazıcıdan çıkarıp paketin üzerine yapıştırın.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-[57px] top-1/2 -translate-y-1/2 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
                <Plane className="w-5 h-5" />
              </div>
              <div className="bg-white p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-3">3. Kargoyu Bize Teslim Edin</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Hazırladığınız paketleri ister İstanbul, İzmir veya Ankara'daki operasyon merkezlerimize kendiniz bırakın, isterseniz anlaşmalı olduğumuz yurt içi kargo firmaları ile ücretsiz olarak bize yollayın. Gümrük beyannameleri (ETGB) sizin adınıza anında açılır.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="absolute -left-[57px] top-1/2 -translate-y-1/2 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="bg-white p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-900 mb-3">4. Takip Edin ve Müşterinizi Bilgilendirin</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Kargonuz uçağa bindiği andan itibaren kapıya teslim edilene kadar her aşamasını panelinizden anlık izleyin. Müşterinize giden takip numarası ile müşteri memnuniyetinizi en üst seviyeye taşıyın.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
