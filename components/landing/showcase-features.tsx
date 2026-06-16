import Image from "next/image"

export function ShowcaseFeatures() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl text-slate-900 tracking-tight leading-[1.15] mb-6">
            <span className="font-light">Tüm e-ihracat süreciniz </span><br className="hidden md:block"/>
            <span className="font-extrabold italic">tek bir akıllı ekranda.</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Hızlı. Esnek. Paylaşılabilir.
          </p>
        </div>

        {/* Features Grid with cross borders */}
        <div className="relative border-t border-slate-200">
          
          {/* Vertical Divider Line (Desktop only) */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200 hidden md:block"></div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-200">
            {/* Text Side */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b border-slate-200 md:border-b-0">
              <div className="text-[#FA8B00] text-xs font-medium tracking-widest uppercase mb-4">
                ENTEGRASYON
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-snug tracking-tight">
                Amazon, Etsy ve Shopify mağazalarınızı saniyeler içinde bağlayın.
              </h3>
              <p className="text-slate-500 text-[15px] md:text-base leading-relaxed">
                Tüm global pazar yeri mağazalarınızı tek bir ekranda toplayın. Siparişleriniz geldiği anda sisteme düşer, manuel hiçbir veri girişi yapmanıza gerek kalmadan kargo barkodlarınız ve gümrük evraklarınız otomatik olarak oluşturulur.
              </p>
            </div>
            
            {/* Image Side */}
            <div className="p-8 md:p-16 bg-slate-50/50 flex items-center justify-center min-h-[400px]">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 bg-white">
                <Image 
                  src="https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=1000&auto=format&fit=crop" 
                  alt="E-commerce Integration" 
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-200">
            {/* Image Side (Left on desktop, bottom on mobile) */}
            <div className="order-2 md:order-1 p-8 md:p-16 bg-slate-50/50 flex items-center justify-center min-h-[400px]">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 bg-white">
                <Image 
                  src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=1000&auto=format&fit=crop" 
                  alt="Logistics Optimization" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text Side (Right on desktop, top on mobile) */}
            <div className="order-1 md:order-2 p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b border-slate-200 md:border-b-0">
              <div className="text-blue-600 text-xs font-medium tracking-widest uppercase mb-4">
                OPTİMİZASYON
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-snug tracking-tight">
                Express ve Eco kargo fiyatlarını canlı olarak karşılaştırın.
              </h3>
              <p className="text-slate-500 text-[15px] md:text-base leading-relaxed">
                UPS, FedEx, DHL gibi dünya devlerinin anlık fiyatlarını tek ekranda görün. Gönderinizin aciliyetine ve bütçenize en uygun taşıma yöntemini seçerek e-ihracat operasyonlarınızdaki kâr marjınızı anında yükseltin.
              </p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-200">
            {/* Text Side */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b border-slate-200 md:border-b-0">
              <div className="text-purple-600 text-xs font-medium tracking-widest uppercase mb-4">
                OTOMATİK TAKİP
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-snug tracking-tight">
                Müşterilerinize anlık kargo durum güncellemeleri sunun.
              </h3>
              <p className="text-slate-500 text-[15px] md:text-base leading-relaxed">
                Gümrük aşamaları, uçuş durumları ve teslimat adımları otomatik olarak takip edilir. Takip numaraları mağazalarınıza saniyeler içinde iletilerek hem sizin iş yükünüz azalır hem de müşteri memnuniyetiniz en üst seviyeye çıkar.
              </p>
            </div>
            
            {/* Image Side */}
            <div className="p-8 md:p-16 bg-slate-50/50 flex items-center justify-center min-h-[400px]">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 bg-white">
                <Image 
                  src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1000&auto=format&fit=crop" 
                  alt="Mobile Tracking" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
