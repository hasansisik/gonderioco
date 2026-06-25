"use client";

import React from "react";
import { PremiumInput } from "@/components/ui/premium-form-elements";
import { Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Step2GondericiAdresi({
  iossType,
  setIossType,
  onNext,
  onPrev
}: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Gönderici ve fatura adresi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Gönderici adresi</label>
          <div className="border border-slate-200 border-dashed rounded-xl p-8 flex items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/50 transition-colors">
            <span className="flex items-center gap-2 text-[#0A2540] font-semibold text-sm">
              <Plus className="w-4 h-4" /> Adres ekle
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Fatura adresi</label>
          <div className="border border-slate-200 border-dashed rounded-xl p-8 flex items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/50 transition-colors">
            <span className="flex items-center gap-2 text-[#0A2540] font-semibold text-sm">
              <Plus className="w-4 h-4" /> Adres ekle
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold text-slate-800">IOSS vergi kimlik numarası (isteğe bağlı)</h4>
          <a href="#" className="text-sm text-[#0A2540] font-semibold flex items-center gap-1 hover:text-orange-600 transition-colors">
            IOSS numarası nedir <Info className="w-4 h-4" />
          </a>
        </div>
        
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-sm text-slate-600">
          <Info className="w-5 h-5 shrink-0 text-slate-500" />
          <p>Yük değeri 150€ altında gönderilerde bazı taşıyıcıların tekliflerini görmek için IOSS numarası girilmesi zorunludur. Alıcı adına vergiler tahsil edildiyse IOSS numaranızı buraya ekleyebilirsiniz.</p>
        </div>

        <div className="flex items-center gap-6 mt-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              name="iossType" 
              checked={iossType === "Kayıtlı IOSS"}
              onChange={() => setIossType("Kayıtlı IOSS")}
              className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-500 group-hover:text-slate-900">Kayıtlı IOSS'lerimden seç</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              name="iossType" 
              checked={iossType === "Yeni IOSS"}
              onChange={() => setIossType("Yeni IOSS")}
              className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900">Yeni IOSS gir</span>
          </label>
        </div>

        {iossType === "Yeni IOSS" && (
          <div className="max-w-xs mt-4">
            <PremiumInput 
              label="IOSS no giriniz" 
              placeholder="Ör: IM1234567890"
            />
          </div>
        )}
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
