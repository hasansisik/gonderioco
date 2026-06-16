"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft, Clock, Activity, ChevronRight, Package, MapPin, Scale, Truck } from "lucide-react"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Calculator() {
  const [isCalculated, setIsCalculated] = useState(false)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCalculated(true)
  }

  const getLogo = (carrier: string) => {
    const map: Record<string, string> = {
      'FedEx': '/brand/fedex.png',
      'UPS': '/brand/ups.png',
      'DHL': '/brand/dhl.png',
      'PTT Global': '/brand/ptt.png',
    }
    return <Image src={map[carrier]} alt={carrier} width={160} height={56} className="object-contain h-12 lg:h-14 w-auto mix-blend-multiply" />
  }

  return (
    <section id="gumruk-hesapla" className="bg-white py-16 lg:py-24">
      <div className="container mx-auto max-w-[1280px] px-4">
        
        {/* Title Section */}
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-slate-900 mb-4 tracking-tight leading-tight">
            <span className="font-light">Gönderi fiyatlarını </span>
            <span className="font-extrabold italic">tek ekranda </span>
            <span className="font-light">karşılaştırın.</span>
          </h2>
          <p className="text-slate-500 font-light text-sm md:text-[15px] max-w-2xl mx-auto leading-relaxed">
            Dünyanın önde gelen kargo firmalarının anlık fiyatlarını hesaplayın ve operasyonunuza en uygun seçeneği saniyeler içinde bulun.
          </p>
        </div>

        {/* Main Wrapper */}
        <div className="w-full rounded-[2rem] overflow-hidden bg-white">
          
          {/* TOP DYNAMIC SECTION */}
          <div className="flex flex-col lg:flex-row w-full lg:min-h-[500px]">
             
             {/* WHITE TITLE (Collapses on Desktop, Hides on Mobile) */}
             <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isCalculated ? 'lg:w-0 opacity-0 hidden lg:block' : 'w-full lg:w-1/2 opacity-100'}`}>
                <div className="w-full lg:w-[640px] h-full flex flex-col justify-center items-center p-8 lg:p-12">
                  <div className="mx-auto max-w-sm text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-[#FA8B00] text-[#FA8B00]">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Gönderinizin Fiyatını Öğrenin</h2>
                    <p className="text-sm text-slate-500">Gönderinizin detaylarını girin, farklı taşıyıcıların tekliflerini anında karşılaştırın ve en uygun fiyatı bulun.</p>
                  </div>
                </div>
             </div>

             {/* RIGHT SECTION (Expands) */}
             <div className={`transition-all duration-700 ease-in-out bg-white overflow-hidden flex flex-col lg:flex-row ${isCalculated ? 'w-full' : 'w-full lg:w-1/2'}`}>
                
                {/* FORM */}
                <div className="w-full lg:w-[640px] shrink-0 p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
                  <form onSubmit={handleCalculate} className="space-y-8 max-w-md mx-auto w-full">
                     
                     <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-[14px] font-semibold text-slate-700 mb-2 block">Nereden</label>
                            <Select defaultValue="tr">
                              <SelectTrigger className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:ring-[#FA8B00]/30 outline-none">
                                <SelectValue placeholder="Ülke seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tr">Türkiye</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>
                         <div>
                            <label className="text-[14px] font-semibold text-slate-700 mb-2 block">Nereye</label>
                            <Select defaultValue="us">
                              <SelectTrigger className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:ring-[#FA8B00]/30 outline-none">
                                <SelectValue placeholder="Ülke seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="us">Amerika (ABD)</SelectItem>
                                <SelectItem value="de">Almanya</SelectItem>
                                <SelectItem value="gb">İngiltere</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>
                       </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[15px] font-semibold text-slate-700 mb-2 block">Koli Ölçüleri</label>
                        <div className="grid grid-cols-4 gap-3">
                           <div>
                             <label className="text-[12px] font-semibold text-slate-500 block mb-2">Ağırlık</label>
                             <div className="relative flex items-center">
                               <input type="number" required placeholder="0" className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FA8B00]/30" />
                               <span className="absolute right-3 text-[11px] font-medium text-slate-400">kg</span>
                             </div>
                           </div>
                           <div>
                             <label className="text-[12px] font-semibold text-slate-500 block mb-2">En</label>
                             <input type="number" required placeholder="0" className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FA8B00]/30" />
                           </div>
                           <div>
                             <label className="text-[12px] font-semibold text-slate-500 block mb-2">Boy</label>
                             <input type="number" required placeholder="0" className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FA8B00]/30" />
                           </div>
                           <div>
                             <label className="text-[12px] font-semibold text-slate-500 block mb-2">Yükseklik</label>
                             <input type="number" required placeholder="0" className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FA8B00]/30" />
                           </div>
                        </div>
                     </div>

                     <div className="pt-6">
                        <button type="submit" className="group w-full flex items-center justify-between rounded-full bg-[#FA8B00] py-1.5 pl-6 pr-1.5 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-[#E67E00]">
                          {isCalculated ? "Fiyatları Güncelle" : "Hesapla"}
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#FA8B00] transition-transform group-hover:rotate-12">
                            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                          </div>
                        </button>
                        
                        {!isCalculated && (
                          <button type="reset" className="text-slate-400 text-[12px] w-full text-center mt-5 hover:text-slate-700 transition-colors font-medium">
                            Formu Temizle
                          </button>
                        )}
                     </div>
                  </form>
                </div>

                {/* SUMMARY */}
                <div className={`w-full lg:w-[640px] shrink-0 p-8 lg:p-12 xl:p-16 flex flex-col justify-center transition-all duration-700 delay-200 ${isCalculated ? 'max-h-[1000px] opacity-100' : 'max-h-0 lg:max-h-none opacity-0 overflow-hidden lg:overflow-visible'}`}>
                   <div className="text-slate-900 space-y-8 max-w-md mx-auto w-full">
                     <div className="flex items-start justify-between">
                       <div>
                         <h3 className="text-3xl font-bold mb-2">Gönderi Özeti</h3>
                         <p className="text-slate-500 text-sm font-medium">Fiyatlandırmaya esas olan gönderi bilgileriniz.</p>
                       </div>
                       <button onClick={() => setIsCalculated(false)} className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors text-xs font-medium bg-slate-200/50 hover:bg-slate-200 px-3 py-1.5 rounded-full">
                         <ArrowLeft className="w-3.5 h-3.5" /> Geri
                       </button>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-y-8 gap-x-4 pt-4">
                       <div>
                         <div className="text-slate-500 text-[13px] font-semibold mb-1">Rota</div>
                         <div className="text-xl font-bold flex items-center gap-2">
                           TR <ArrowRight className="w-5 h-5 text-slate-300" /> ABD
                         </div>
                       </div>
                       
                       <div>
                         <div className="text-slate-500 text-[13px] font-semibold mb-1">Toplam Ağırlık</div>
                         <div className="text-xl font-bold">1 kg</div>
                       </div>

                       <div>
                         <div className="text-slate-500 text-[13px] font-semibold mb-1">Hacimsel Ağırlık (Desi)</div>
                         <div className="text-xl font-bold text-[#FA8B00]">0.2 Desi</div>
                       </div>
                       
                       <div>
                         <div className="text-slate-500 text-[13px] font-semibold mb-1">Koli Ölçüleri</div>
                         <div className="text-xl font-bold">10x10x10 cm</div>
                       </div>
                     </div>
                   </div>
                </div>
             </div>
          </div>

          {/* BOTTOM RESULTS SECTION */}
          <div 
             className="grid transition-all duration-700 ease-in-out bg-white" 
             style={{ gridTemplateRows: isCalculated ? '1fr' : '0fr' }}
          >
             <div className="overflow-hidden">
                <div className="p-8 lg:p-12 xl:p-16 border-t border-slate-200">
                   
                   <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
                     <h3 className="text-xl font-bold text-slate-900">Size Özel Teklifler</h3>
                     <div className="text-slate-900 text-[13px] font-medium">
                       Anlık Fiyatlar
                     </div>
                   </div>

                   <div className="space-y-4 max-w-5xl mx-auto">
                     {[
                       { carrier: 'FedEx', service: 'Priority Express', days: '3-5 İş Günü', price: '$ 84.70', isPopular: true },
                       { carrier: 'UPS', service: 'Worldwide Saver', days: '4-7 İş Günü', price: '$ 92.15', isPopular: false },
                       { carrier: 'DHL', service: 'Express Worldwide', days: '2-4 İş Günü', price: '$ 108.40', isPopular: false },
                       { carrier: 'PTT Global', service: 'Standart Ekonomi', days: '8-14 İş Günü', price: '$ 76.20', isPopular: false },
                     ].map((offer, i) => (
                       <div key={i} className={`relative flex flex-col md:flex-row md:items-center justify-between p-4 lg:p-5 rounded-2xl bg-white transition-all cursor-pointer group hover:shadow-md ${offer.isPopular ? 'border border-[#FA8B00] shadow-sm' : 'border border-slate-200 hover:border-blue-500'}`}>
                         
                         {offer.isPopular && (
                           <div className="absolute -top-2.5 right-8 bg-[#FA8B00] text-white text-[10px] font-medium px-4 py-0.5 rounded-full shadow-sm">
                             En Popüler
                           </div>
                         )}

                         <div className="flex items-center w-full justify-between gap-6">
                           
                           <div className="w-36 flex justify-center shrink-0">
                             {getLogo(offer.carrier)}
                           </div>
                           
                           <div className="w-32 shrink-0">
                             <div className="font-bold text-slate-900 text-sm mb-1">{offer.carrier}</div>
                             <div className="text-[11px] font-medium text-slate-500">{offer.service}</div>
                           </div>
                           
                           <div className="w-28 shrink-0 hidden md:block">
                             <div className="text-[10px] text-slate-400 mb-1">Teslimat</div>
                             <div className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
                               <Clock className="w-3 h-3 text-[#FA8B00]" /> {offer.days}
                             </div>
                           </div>

                           <div className="w-32 shrink-0 hidden md:block">
                             <div className="text-[10px] text-slate-400 mb-1">Servis</div>
                             <div className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
                               <Truck className="w-3 h-3 text-[#FA8B00]" /> Kapıdan Kapıya
                             </div>
                           </div>

                           <div className="flex flex-col items-end shrink-0 pl-6 border-l border-slate-100">
                             <div className="text-[10px] text-slate-400 mb-1">Toplam Tahmini Fiyat</div>
                             <div className="flex items-center gap-4">
                               <div className="font-black text-xl text-slate-900">{offer.price}</div>
                               <button className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 ${offer.isPopular ? 'bg-[#FA8B00]' : 'bg-blue-600'}`}>
                                 <ChevronRight className="w-3.5 h-3.5" strokeWidth={3} />
                               </button>
                             </div>
                           </div>
                           
                         </div>
                       </div>
                     ))}
                   </div>
                   
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  )
}
