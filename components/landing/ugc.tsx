import Image from "next/image"
import { Award, Star, ShieldCheck } from "lucide-react"

export function UGC() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Header Area */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl text-slate-900 tracking-tight leading-[1.25] max-w-2xl">
            <span className="font-light">Binlerce e-ihracatçı tarafından </span>
            <span className="font-extrabold italic">seviliyor, </span><br className="hidden lg:block"/>
            <span className="font-light">başarılarla destekleniyor.</span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1 */}
          <div className="group relative rounded-[2rem] overflow-hidden aspect-[9/16] bg-slate-100 cursor-pointer">
            <Image 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
              alt="Testimonial 1"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 flex flex-col justify-end">
              <p className="text-white text-[15px] font-medium leading-snug mb-5 drop-shadow-sm">
                "Gönderio sayesinde yurt dışı operasyonlarımızı tamamen otomatize ettik. İnanılmaz bir zaman tasarrufu."
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-white font-semibold text-[13px] drop-shadow-sm">Ayşe Yılmaz</div>
                  <div className="text-white/70 text-[10px] font-medium">Operasyon Müdürü</div>
                </div>
                <div className="text-white font-bold text-lg tracking-tighter drop-shadow-sm">DIGGS</div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-[2rem] overflow-hidden aspect-[9/16] bg-slate-100 cursor-pointer">
            <Image 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop"
              alt="Testimonial 2"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
            
            {/* Play Button Mock */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300 delay-100">
                 <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-white ml-1"></div>
               </div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 flex flex-col justify-end">
              <p className="text-white text-[15px] font-medium leading-snug mb-5 drop-shadow-sm">
                "Kolay entegrasyonu ile tüm e-ihracat süreçlerimizi tek bir ekrana taşıdık."
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-white font-semibold text-[13px] drop-shadow-sm">Caner Demir</div>
                  <div className="text-white/70 text-[10px] font-medium">Pazarlama Direktörü</div>
                </div>
                <div className="text-white font-bold text-lg tracking-tighter drop-shadow-sm">FINASTRA</div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-[2rem] overflow-hidden aspect-[9/16] bg-slate-100 cursor-pointer">
            <Image 
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop"
              alt="Testimonial 3"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 flex flex-col justify-end">
              <p className="text-white text-[15px] font-medium leading-snug mb-5 drop-shadow-sm">
                "Son iki yılda şirketimiz için yaptığım en iyi yatırım Gönderio'ya geçmek oldu."
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-white font-semibold text-[13px] drop-shadow-sm">Elif Kaya</div>
                  <div className="text-white/70 text-[10px] font-medium">Kurucu Ortak</div>
                </div>
                <div className="text-white font-bold text-lg tracking-tighter lowercase drop-shadow-sm flex items-center gap-1">
                  hawkemedia
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
