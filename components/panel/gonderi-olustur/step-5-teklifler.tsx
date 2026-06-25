"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function Step5Teklifler({ onPrev, onComplete }: any) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Taşıyıcı Teklifleri</h3>
        <div className="flex items-center gap-6">
          <button 
            onClick={onPrev}
            className="text-[#0A2540] hover:text-orange-600 font-semibold text-sm transition-colors"
          >
            Geri
          </button>
          <Button 
            className="bg-[#FA8B00] hover:bg-orange-500 text-white rounded-lg px-8 py-2.5 font-semibold transition-colors shadow-lg shadow-orange-500/20"
            onClick={onComplete}
          >
            Siparişi Tamamla
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <p className="text-xl font-medium text-slate-700">En iyi teklifler aranıyor...</p>
        <p className="text-sm mt-3 text-slate-400 max-w-md text-center">Girdiğiniz kargo ölçüleri ve içerik bilgilerine göre global taşıyıcıların anlık fiyatları hesaplanıyor. Lütfen bekleyin.</p>
      </div>
    </div>
  );
}
