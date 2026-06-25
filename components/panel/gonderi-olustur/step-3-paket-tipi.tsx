"use client";

import React from "react";
import { PremiumInput } from "@/components/ui/premium-form-elements";
import { ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Step3PaketTipi({
  packageType,
  setPackageType,
  onNext,
  onPrev
}: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Paket tipi ve boyutları</h3>
      
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-slate-700">Paket tipi</span>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              name="packageType" 
              checked={packageType === "Koli"}
              onChange={() => setPackageType("Koli")}
              className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">Koli</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              name="packageType" 
              checked={packageType === "Zarf"}
              onChange={() => setPackageType("Zarf")}
              className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">Zarf</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              name="packageType" 
              checked={packageType === "Doküman"}
              onChange={() => setPackageType("Doküman")}
              className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">Doküman (sadece evrak)</span>
          </label>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-slate-500">Kayıtlı paketlerinizden seçin veya yeni paket ekleyin:</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-20 bg-slate-200/50 hover:bg-slate-200 rounded-l-xl flex items-center justify-center text-slate-500 transition-colors">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
              {/* Example Package Card */}
              <div className="min-w-[160px] border border-orange-500 rounded-xl p-3 flex flex-col justify-between h-20 cursor-pointer shadow-[0_0_0_1px_rgba(250,139,0,1)] relative">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold text-[#0A2540] uppercase">poncho</span>
                  <Plus className="w-4 h-4 text-[#0A2540]" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-500">Koli</span>
                    <span className="text-[11px] text-slate-500">5x5x5cm</span>
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
        </div>

        <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-800 mb-4">{packageType}</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <PremiumInput label="En" placeholder="cm" type="number" />
            <PremiumInput label="Boy" placeholder="cm" type="number" />
            <PremiumInput label="Yükseklik" placeholder="cm" type="number" />
            <PremiumInput label="Ağırlık" placeholder="kg" type="number" />
            <PremiumInput label="Adet" value="1" type="number" />
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer group w-fit">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500 border-slate-300"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">Bu ölçüleri daha sonra tekrar kullanacağım</span>
            </label>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button className="flex items-center gap-2 text-slate-400 hover:text-orange-600 border border-slate-200 bg-white shadow-sm px-6 py-2.5 rounded-lg text-sm font-semibold transition-all">
            <Plus className="w-4 h-4" /> Yeni Paket ekle
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-8">
        <button 
          onClick={onPrev}
          className="text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors"
        >
          Geri
        </button>
        <Button 
          className="bg-[#FA8B00] hover:bg-orange-500 text-white rounded-lg px-8 py-2 font-semibold h-11 transition-colors"
          onClick={onNext}
        >
          Devam
        </Button>
      </div>
    </div>
  );
}
