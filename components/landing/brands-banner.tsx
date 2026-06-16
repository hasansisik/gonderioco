"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export function BrandsBanner() {
  return (
    <section className="relative bg-[#FA8B00] flex min-h-[400px] flex-col justify-center py-20 lg:py-28 overflow-hidden">
      {/* Smooth Transition from Previous Section (Top) */}
      <div className="absolute top-0 left-0 h-[40%] w-full bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
      
      {/* Smooth Transition to Next Section (Bottom) */}
      <div className="absolute bottom-0 left-0 h-[40%] w-full bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      
      <div className="container relative z-10 mx-auto max-w-[1280px] px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[650px] xl:max-w-[700px] scale-105 md:scale-110 aspect-[16/9]">
              <Image 
                src="/brands.png" 
                alt="Gönderio Pazaryeri Entegrasyonları" 
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left pt-8 lg:pt-0 pl-0 lg:pl-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-white mb-5 leading-tight tracking-tight max-w-xl whitespace-nowrap md:whitespace-normal">
              E-ihracat operasyonlarını nasıl<br/>
              <span className="font-extrabold italic">yönetebilirsin?</span>
            </h2>
            <p className="text-white/90 text-sm md:text-[15px] mb-8 max-w-[400px] leading-relaxed">
              İlgilendiğin tüm pazaryerlerine ve altyapılara dair entegrasyonları tek bir noktada, Gönderio'nun kolay kullanım panelinde bulabilirsin.
            </p>
            <Link
              href="/kayitol"
              className="inline-flex items-center gap-4 rounded-full bg-[#1A1A1A] py-2 pl-6 pr-2 text-[15px] font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Hemen Teklif Al
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FA8B00] text-white">
                <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
