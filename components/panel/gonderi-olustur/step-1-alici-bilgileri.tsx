"use client";

import React from "react";
import { PremiumInput, PremiumSelect } from "@/components/ui/premium-form-elements";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Step1AliciBilgileri({ 
  recipientType, 
  setRecipientType, 
  address, 
  setAddress, 
  recipientInfo, 
  setRecipientInfo,
  onNext 
}: any) {
  return (
    <div className="space-y-6">
      {/* Header Options */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              name="recipientType" 
              checked={recipientType === "Bireysel"}
              onChange={() => setRecipientType("Bireysel")}
              className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Bireysel</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              name="recipientType" 
              checked={recipientType === "Kurumsal"}
              onChange={() => setRecipientType("Kurumsal")}
              className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Kurumsal</span>
          </label>
        </div>
        
        <button className="flex items-center gap-2 text-[#0A2540] hover:text-orange-600 font-semibold text-sm transition-colors">
          <Bookmark className="w-4 h-4 fill-current" />
          Kayıtlı Adreslerim
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* Left Column: Alıcı adresi */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Alıcı adresi</h3>
          
          <PremiumSelect 
            label="Ülke" 
            value={address.country}
            onChange={(e: any) => setAddress({...address, country: e.target.value})}
            options={[
              { id: "US", name: "Amerika Birleşik Devletleri" },
              { id: "DE", name: "Almanya" },
              { id: "GB", name: "Birleşik Krallık" }
            ]}
            placeholder="Ülke seçiniz"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <PremiumInput 
              label="Şehir" 
              placeholder="Ör: New York"
              value={address.city}
              onChange={(e: any) => setAddress({...address, city: e.target.value})}
            />
            <PremiumInput 
              label="Posta kodu" 
              placeholder="Ör: 10001"
              value={address.zipCode}
              onChange={(e: any) => setAddress({...address, zipCode: e.target.value})}
            />
          </div>

          <PremiumInput 
            label="Adres 1" 
            placeholder="Adres satırı 1"
            value={address.address1}
            onChange={(e: any) => setAddress({...address, address1: e.target.value})}
          />
          <PremiumInput 
            label="Adres 2 (isteğe bağlı)" 
            placeholder="Adres satırı 2"
            value={address.address2}
            onChange={(e: any) => setAddress({...address, address2: e.target.value})}
          />
          <PremiumInput 
            label="Adres 3 (isteğe bağlı)" 
            placeholder="Adres satırı 3"
            value={address.address3}
            onChange={(e: any) => setAddress({...address, address3: e.target.value})}
          />
        </div>

        {/* Right Column: Alıcı & İletişim Bilgileri */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Alıcı bilgileri</h3>
            <PremiumInput 
              label="Ad soyad" 
              placeholder="Ör: John Doe"
              value={recipientInfo.fullName}
              onChange={(e: any) => setRecipientInfo({...recipientInfo, fullName: e.target.value})}
            />
            <PremiumInput 
              label="Kimlik no (isteğe bağlı)" 
              placeholder="Kimlik veya vergi no"
              value={recipientInfo.idNumber}
              onChange={(e: any) => setRecipientInfo({...recipientInfo, idNumber: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">İletişim bilgileri</h3>
            <PremiumInput 
              label="E-posta adresi (isteğe bağlı)" 
              type="email"
              placeholder="ornek@email.com"
              value={recipientInfo.email}
              onChange={(e: any) => setRecipientInfo({...recipientInfo, email: e.target.value})}
            />
            <div className="grid grid-cols-[100px_1fr] gap-4">
              <PremiumSelect 
                label="Ülke kodu" 
                value={recipientInfo.countryCode}
                onChange={(e: any) => setRecipientInfo({...recipientInfo, countryCode: e.target.value})}
                options={[
                  { id: "+90", name: "+90" },
                  { id: "+1", name: "+1" },
                  { id: "+44", name: "+44" }
                ]}
                placeholder="Kod"
              />
              <PremiumInput 
                label="Telefon no (isteğe bağlı)" 
                placeholder="5xx xxx xx xx"
                value={recipientInfo.phone}
                onChange={(e: any) => setRecipientInfo({...recipientInfo, phone: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-6 pt-6 border-t border-slate-100 mt-8">
        <button className="flex items-center gap-2 text-[#0A2540] hover:text-orange-600 font-semibold text-sm transition-colors">
          <Bookmark className="w-4 h-4" />
          Adresi Kaydet
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
