import Link from "next/link"
import { ArrowUpRight, Calculator } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FA8B00] pt-16 pb-32 lg:pt-24 lg:pb-40 text-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-3xl lg:col-span-7 xl:col-span-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[54px] leading-[1.1] mb-6">
              Yurt Dışı Gönderilerinizi <span className="italic font-extrabold">Gönderio</span> ile Kolaylaştırın!
            </h1>
            
            <p className="mb-6 text-lg text-white/90 leading-relaxed">
              130'dan fazla ülkeye anında kargo teklifi alın, teklifleri karşılaştırın,
              gönderin, depolama ve fulfillment operasyonlarınızı yönetin.
            </p>
            
            <p className="mb-10 text-lg text-white/90 leading-relaxed">
              Dilerseniz Amerika gönderileriniz için gümrük vergisini de hemen hesaplayın!
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/kayitol"
                className="flex items-center gap-4 rounded-full bg-[#1A1A1A] py-2 pl-6 pr-2 text-[15px] font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Hemen Teklif Al
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FA8B00] text-white">
                  <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
                </div>
              </Link>
              <Link
                href="#gumruk-hesapla"
                className="flex items-center gap-4 rounded-full bg-[#1A1A1A] py-2 pl-6 pr-2 text-[15px] font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                ABD Gümrük Vergini Hesapla
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FA8B00] text-white">
                  <Calculator className="h-5 w-5" strokeWidth={2.5} />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Content / Image Area */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end lg:col-span-5 xl:col-span-4">
            <div className="relative w-full aspect-square max-w-[500px]">
              {/* Image Container */}
              <div className="relative h-full w-full rounded-[2rem] bg-white p-2 overflow-hidden shadow-2xl border border-white/20">
                {/* Fallback image if specific asset is missing */}
                <img 
                  src="/auth.png" 
                  alt="Gönderio Lojistik" 
                  className="h-full w-full rounded-[1.5rem] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Transition to Next Section */}
      <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
    </section>
  )
}
