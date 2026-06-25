"use client";

import React from "react";
import { PremiumInput, PremiumSelect } from "@/components/ui/premium-form-elements";
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
    <div className="space-y-8 pb-10">
      {/* Top Header & Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Modern Tabs for Recipient Type */}
          <div className="flex bg-[#FAF7F5] p-1 rounded-xl">
            <button
              onClick={() => setRecipientType("Bireysel")}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                recipientType === "Bireysel" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Bireysel
            </button>
            <button
              onClick={() => setRecipientType("Kurumsal")}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                recipientType === "Kurumsal" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Kurumsal
            </button>
          </div>
          <button className="text-[#0A2540] hover:text-orange-600 font-semibold text-[13px] transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            Kayıtlı Adreslerim
          </button>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-[#0A2540] hover:text-orange-600 font-semibold text-sm transition-colors">
            Adresi Kaydet
          </button>
          <Button 
            className="bg-[#FA8B00] hover:bg-orange-500 text-white rounded-lg px-8 py-2.5 font-semibold transition-colors"
            onClick={onNext}
          >
            Devam
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        
        {/* Left Column: Identity & Contact */}
        <div className="space-y-10">
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-lg font-semibold text-slate-800">Alıcı Bilgileri</h3>
            </div>
            
            {recipientType === "Bireysel" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PremiumInput 
                  label="Ad soyad" 
                  placeholder="Ör: John Doe"
                  value={recipientInfo.fullName}
                  onChange={(e: any) => setRecipientInfo({...recipientInfo, fullName: e.target.value})}
                />
                <PremiumInput 
                  label="Kimlik no (isteğe bağlı)" 
                  placeholder="Kimlik no"
                  value={recipientInfo.idNumber}
                  onChange={(e: any) => setRecipientInfo({...recipientInfo, idNumber: e.target.value})}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <PremiumInput 
                  label="Şirket ünvanı" 
                  placeholder="Ör: Gönderio A.Ş."
                  value={recipientInfo.fullName}
                  onChange={(e: any) => setRecipientInfo({...recipientInfo, fullName: e.target.value})}
                />
                <PremiumInput 
                  label="Vergi no (isteğe bağlı)" 
                  placeholder="Vergi numaranız"
                  value={recipientInfo.idNumber}
                  onChange={(e: any) => setRecipientInfo({...recipientInfo, idNumber: e.target.value})}
                />
              </div>
            )}
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">İletişim Bilgileri</h3>
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

        {/* Right Column: Address */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-lg font-semibold text-slate-800">Teslimat Adresi</h3>
          </div>
          
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
            label="Açık Adres" 
            placeholder="Sokak, mahalle, bina no vb."
            value={address.address1}
            onChange={(e: any) => setAddress({...address, address1: e.target.value})}
          />
        </div>

      </div>

      {/* The floating bar has been moved to page.tsx */}
    </div>
  );
}
