"use client"

import { useState } from "react"
import { Plus, Info, ChevronDown, Package, MapPin, Calculator, ArrowUpRight, CheckCircle2, Clock, TrendingUp, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HizliFiyatPage() {
  const [nereden, setNereden] = useState("Türkiye")
  const [nereye, setNereye] = useState("")
  const [agirlik, setAgirlik] = useState("")
  const [en, setEn] = useState("")
  const [boy, setBoy] = useState("")
  const [yukseklik, setYukseklik] = useState("")

  const [showOffers, setShowOffers] = useState(false)

  const handleCalculate = () => {
    if (nereden && nereye && agirlik) {
      setShowOffers(true)
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-16 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Refined Header */}
      <div className="flex flex-col gap-1 relative">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Hızlı Fiyat Hesaplama
        </h1>
        <p className="text-sm text-slate-400 font-medium tracking-tight">
          gonderio.co ile saniyeler içinde kargo teklifi alın
        </p>
      </div>

      {/* Calculator Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 lg:p-10 relative overflow-hidden group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
          
          {/* Main Form Fields */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* Rota Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="size-4 text-orange-500" />
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Nereden</span>
                </div>
                <div className="relative">
                  <select 
                    value={nereden}
                    onChange={(e) => setNereden(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent hover:border-slate-100 focus:border-blue-500 focus:bg-white rounded-xl p-4 text-sm font-semibold text-slate-700 transition-all appearance-none outline-none"
                  >
                    <option value="Türkiye">Türkiye</option>
                    <option value="Almanya">Almanya</option>
                    <option value="ABD">ABD</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowUpRight className="size-4 text-orange-500" />
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Nereye</span>
                </div>
                <div className="relative">
                  <select 
                    value={nereye}
                    onChange={(e) => setNereye(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent hover:border-slate-100 focus:border-blue-500 focus:bg-white rounded-xl p-4 text-sm font-semibold text-slate-700 transition-all appearance-none outline-none"
                  >
                    <option value="">Hedef Ülke Seçiniz</option>
                    <option value="Afganistan">Afganistan</option>
                    <option value="Almanya">Almanya</option>
                    <option value="ABD">ABD</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Cargo Details */}
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-2 mb-1">
                  <Package className="size-4 text-orange-500" />
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Kargo Detayları</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input 
                    type="number"
                    placeholder="Ağırlık (Kg)"
                    value={agirlik}
                    onChange={(e) => setAgirlik(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent hover:border-slate-100 focus:border-blue-500 focus:bg-white rounded-xl p-4 text-sm font-semibold text-slate-700 transition-all outline-none"
                  />
                  <input type="number" placeholder="En" value={en} onChange={(e) => setEn(e.target.value)} className="w-full bg-slate-50 border-2 border-transparent hover:border-slate-100 focus:border-blue-500 focus:bg-white rounded-xl p-4 text-sm font-semibold text-slate-700 transition-all outline-none" />
                  <input type="number" placeholder="Boy" value={boy} onChange={(e) => setBoy(e.target.value)} className="w-full bg-slate-50 border-2 border-transparent hover:border-slate-100 focus:border-blue-500 focus:bg-white rounded-xl p-4 text-sm font-semibold text-slate-700 transition-all outline-none" />
                  <input type="number" placeholder="Yükseklik" value={yukseklik} onChange={(e) => setYukseklik(e.target.value)} className="w-full bg-slate-50 border-2 border-transparent hover:border-slate-100 focus:border-blue-500 focus:bg-white rounded-xl p-4 text-sm font-semibold text-slate-700 transition-all outline-none" />
                </div>
                
                <button className="flex items-center gap-2 text-xs font-bold text-orange-500 hover:text-orange-600 transition-all group w-fit pl-1 mt-1">
                   <Plus className="size-4" />
                   <span>Yeni Paket Ekle</span>
                </button>
            </div>
          </div>

          {/* Action Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-100/50">
               <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center text-xs font-medium opacity-90">
                    <span>Brüt Ağırlık</span>
                    <span className="font-bold">{agirlik || "0.00"} Kg</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium opacity-90">
                    <span>Hacimsel Ağırlık</span>
                    <span className="font-bold">0.00 Desi</span>
                  </div>
                  <div className="pt-4 border-t border-white/20 flex justify-between items-end">
                    <span className="text-xs font-bold opacity-80 mb-1">Hesaplanan</span>
                    <div className="flex items-baseline gap-1">
                       <span className="text-3xl font-bold">{agirlik || "0.00"}</span>
                       <span className="text-sm font-medium opacity-80">Kg</span>
                    </div>
                  </div>
               </div>
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
            >
              <Calculator className="size-4" />
              Hesapla
            </button>
            <p className="text-[10px] text-slate-400 font-medium text-center italic px-4 leading-relaxed">
              * Fiyatlar anlık kuralara göre değişiklik gösterebilir.
            </p>
          </div>

        </div>
      </div>

      {/* Offers Section */}
      {showOffers && (
        <div className="flex flex-col gap-6 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-xl font-bold text-slate-800">Size Özel Teklifler</h2>
             <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                Anlık Fiyatlar
             </span>
          </div>

          <div className="flex flex-col gap-4">
             <OfferCard 
               carrier="Fedex" 
               type="Priority Express" 
               duration="3-5 İş Günü" 
               price="84.70" 
               isBest={true}
               theme="orange"
               logo="/brand/fedex.png"
             />
             <OfferCard 
               carrier="UPS" 
               type="Worldwide Saver" 
               duration="4-7 İş Günü" 
               price="92.15" 
               theme="slate"
               logo="/brand/ups.png"
             />
             <OfferCard 
               carrier="DHL" 
               type="Express Worldwide" 
               duration="2-4 İş Günü" 
               price="108.40" 
               theme="slate"
               logo="/brand/dhl.png"
             />
             <OfferCard 
               carrier="PTT Global" 
               type="Standart Ekonomi" 
               duration="8-14 İş Günü" 
               price="76.20" 
               theme="slate"
               logo="/brand/ptt.png"
             />
          </div>
        </div>
      )}
    </div>
  )
}

function OfferCard({ carrier, type, duration, price, isBest, theme, logo }: any) {
  return (
    <div className={cn(
      "group relative flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg",
      isBest ? "border-orange-200 bg-orange-50/20" : "border-slate-100 bg-white"
    )}>
      {isBest && (
        <div className="absolute top-0 right-8 bg-orange-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-b-xl shadow-md">
          En Popüler
        </div>
      )}

      {/* Carrier Branding */}
      <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0 text-left">
        <div className={cn(
          "size-16 rounded-xl flex items-center justify-center bg-white overflow-hidden transition-colors",
        )}>
           <img src={logo} alt={carrier} className="w-full h-full object-contain p-0" />
        </div>
        <div className="flex flex-col text-left">
          <h4 className="text-base font-bold text-slate-800">{carrier}</h4>
          <span className="text-[11px] font-semibold text-slate-400">{type}</span>
        </div>
      </div>

      {/* Info Middle */}
      <div className="flex gap-8 w-full md:w-auto justify-center md:justify-start mb-4 md:mb-0">
         <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-300 uppercase">Teslimat</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
               <Clock className="size-3.5 text-slate-400" />
               {duration}
            </div>
         </div>
         <div className="flex flex-col gap-0.5 border-l border-slate-100 pl-8">
            <span className="text-[10px] font-bold text-slate-300 uppercase">Servis</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
               <TrendingUp className="size-3.5 text-slate-400" />
               Kapıdan Kapıya
            </div>
         </div>
      </div>

      {/* Price & Action */}
      <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
         <div className="flex flex-col items-end flex-1 md:flex-none">
            <span className="text-[10px] font-bold text-slate-400 mb-0.5 text-right">Toplam Tahmini Fiyat</span>
            <div className="flex items-baseline gap-1">
               <span className="text-xs font-bold text-slate-400">$</span>
               <span className="text-xl font-bold text-slate-800 tracking-tight">{price}</span>
            </div>
         </div>
         <button className={cn(
           "flex items-center justify-center size-12 rounded-xl transition-all active:scale-95 shadow-sm",
           isBest ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-blue-600 text-white hover:bg-blue-700"
         )}>
           <ChevronRight className="size-5" />
         </button>
      </div>
    </div>
  )
}
