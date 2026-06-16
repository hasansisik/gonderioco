import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FA8B00] pt-16 pb-32 lg:pt-24 lg:pb-40 text-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[54px] leading-[1.1] mb-6">
              Yurt Dışı ve Yurt İçi Gönderilerinizi Gönderio ile Kolaylaştırın!
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
                className="rounded-lg bg-white px-8 py-4 text-[15px] font-bold text-[#FA8B00] hover:bg-slate-50 transition-colors"
              >
                Hemen Teklif Al
              </Link>
              <Link
                href="#gumruk-hesapla"
                className="rounded-lg border-2 border-white/30 bg-transparent px-8 py-4 text-[15px] font-bold text-white hover:bg-white/10 transition-colors"
              >
                ABD Gümrük Vergini Hesapla
              </Link>
            </div>
          </div>

          {/* Right Content / Image Area */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end">
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
    </section>
  )
}
