"use client";

import React from "react";
import { PremiumInput, PremiumSelect } from "@/components/ui/premium-form-elements";
import { ChevronRight, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Step4GonderiIcerigi({ onPrev }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Gönderi tipi ve içeriği</h3>
      
      <div className="space-y-8">
        <div>
          <h4 className="text-md font-semibold text-slate-800 mb-4">Gönderi Türü</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="flex items-center gap-2 text-[11px] font-normal text-slate-500 mb-3 px-1">
                Gönderi Türü <Info className="w-3.5 h-3.5 text-orange-500" fill="currentColor" stroke="white" />
              </label>
              <PremiumSelect 
                options={[{ id: "Satis", name: "Satış" }]}
                value="Satis"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-[11px] font-normal text-slate-500 mb-3 px-1">
                Değerleme Para Birimi
              </label>
              <PremiumSelect 
                options={[{ id: "USD", name: "Dolar($)" }]}
                value="USD"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500" /> Gönderi içeriklerinizin fiyatları, seçtiğiniz para birimine bir önceki iş gününün kapanış kurlarına göre çevrilir.
          </p>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-800 mb-4">Gönderi İçeriği</h4>
          <p className="text-sm text-slate-500 mb-3">Kayıtlı ürünlerinizden seçin veya yeni ürün ekleyin:</p>
          
          <div className="flex items-center gap-2 mb-6">
            <button className="w-8 h-20 bg-slate-200/50 hover:bg-slate-200 rounded-l-xl flex items-center justify-center text-slate-500 transition-colors">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
              {/* Example Item Card 1 */}
              <div className="min-w-[180px] border border-slate-200 rounded-xl p-3 flex flex-col justify-between h-24 cursor-pointer hover:border-orange-500 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold text-[#0A2540] uppercase">PONCHO</span>
                  <Plus className="w-4 h-4 text-[#0A2540]" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-500 truncate max-w-[120px]">COUVERTURE EN ...</span>
                    <span className="text-sm font-semibold text-slate-800">$15</span>
                  </div>
                  <button className="text-red-500 hover:text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              </div>
              {/* Example Item Card 2 */}
              <div className="min-w-[180px] border border-slate-200 rounded-xl p-3 flex flex-col justify-between h-24 cursor-pointer hover:border-orange-500 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold text-[#0A2540] uppercase">TEA</span>
                  <Plus className="w-4 h-4 text-[#0A2540]" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-500 truncate max-w-[120px]">BLACK TEA</span>
                    <span className="text-sm font-semibold text-slate-800">€1</span>
                  </div>
                  <button className="text-red-500 hover:text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <button className="w-8 h-20 bg-slate-200/50 hover:bg-slate-200 rounded-r-xl flex items-center justify-center text-slate-500 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5 space-y-5">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <PremiumInput 
                  label="Ürün İçeriği" 
                  placeholder="Ör: cotton t-shirt"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-[11px] text-slate-500">Gümrük geçişinde problem olmaması için açıklamayı İngilizce yazınız.</p>
                  <p className="text-[11px] text-slate-400">0/105</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-[#0A2540] font-semibold text-sm hover:text-orange-600 transition-colors pb-6 pr-4 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9m-9 9a9 9 0 0 1 9-9"/></svg>
                İngilizce'ye çevir
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <PremiumInput 
                  label="GTIP (HS) Kodu" 
                  placeholder="GTIP (HS) kodu ara..."
                />
              </div>
              <div className="md:col-span-3">
                <PremiumSelect 
                  label="Menşei Ülke" 
                  options={[{ id: "TR", name: "Türkiye" }]}
                  value="TR"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-normal text-slate-500 mb-3 px-1 block">Cins</label>
                <div className="w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 text-[12px] text-slate-500 px-6 flex items-center">
                  USD
                </div>
              </div>
              <div className="md:col-span-2">
                <PremiumInput label="Birim fiyat" type="number" />
              </div>
              <div className="md:col-span-1">
                <PremiumInput label="Adet" value="1" type="number" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer group w-fit">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500 border-slate-300"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900">Tekrar kullanmak için kaydet</span>
              </label>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button className="flex items-center gap-2 text-[#0A2540] hover:text-orange-600 border border-slate-200 bg-white shadow-sm px-6 py-2.5 rounded-lg text-sm font-semibold transition-all">
              <Plus className="w-4 h-4" /> Yeni Ürün Ekle
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <span className="text-lg font-bold text-slate-800">Toplam Yük Değeri $ -.--</span>
        </div>
        
        <div className="flex justify-between items-center pt-2 gap-4">
          <button 
            onClick={onPrev}
            className="text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors shrink-0 px-4"
          >
            Geri
          </button>
          <Button className="w-full bg-[#FA8B00] hover:bg-orange-500 text-white rounded-lg py-6 font-bold text-lg transition-colors shadow-lg shadow-orange-500/20">
            Teklifleri Gör
          </Button>
        </div>
      </div>
    </div>
  );
}
