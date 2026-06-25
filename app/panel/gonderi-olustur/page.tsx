"use client";

import React, { useState } from "react";
import { Step1AliciBilgileri } from "@/components/panel/gonderi-olustur/step-1-alici-bilgileri";
import { Step2GondericiAdresi } from "@/components/panel/gonderi-olustur/step-2-gonderici-adresi";
import { Step3PaketTipi } from "@/components/panel/gonderi-olustur/step-3-paket-tipi";
import { Step4GonderiIcerigi } from "@/components/panel/gonderi-olustur/step-4-gonderi-icerigi";
import { ClipboardList, MapPin, Package, FileText } from "lucide-react";

export default function GonderiOlusturPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [recipientType, setRecipientType] = useState<"Bireysel" | "Kurumsal">("Bireysel");

  // Step 1: Alıcı Bilgileri
  const [address, setAddress] = useState({
    country: "", city: "", zipCode: "", address1: "", address2: "", address3: "",
  });
  const [recipientInfo, setRecipientInfo] = useState({
    fullName: "", idNumber: "", email: "", countryCode: "+90", phone: "",
  });

  // Step 2: Gönderici Adresi & IOSS
  const [iossType, setIossType] = useState<"Kayıtlı IOSS" | "Yeni IOSS">("Yeni IOSS");

  // Step 3: Paket Tipi
  const [packageType, setPackageType] = useState<"Koli" | "Zarf" | "Doküman">("Koli");
  
  return (
    <div className="w-full">
      <div className="mb-24">
        <div className="flex w-full relative">
          {/* Connecting Line background */}
          <div className="absolute top-5 left-[12.5%] right-[12.5%] h-1 bg-slate-200 z-0"></div>
          {/* Connecting Line active */}
          <div 
            className="absolute top-5 left-[12.5%] h-1 bg-[#FA8B00] z-0 transition-all duration-500" 
            style={{ width: `${(currentStep - 1) * 33.33}%` }}
          ></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center relative z-10 w-1/4">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer bg-white
                ${currentStep >= 1 ? "border-[#FA8B00] text-[#FA8B00]" : "border-slate-300 text-slate-400"}
                ${currentStep === 1 ? "shadow-[0_0_0_4px_rgba(250,139,0,0.1)]" : ""}
                ${currentStep > 1 ? "bg-[#FA8B00] text-white" : ""}
              `}
              onClick={() => setCurrentStep(1)}
            >
              <ClipboardList className="w-4 h-4" />
            </div>
            <div className="mt-3 flex flex-col items-center text-center px-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">ADIM 1</span>
              <span className="text-xs font-semibold text-slate-800 mb-1">Alıcı Bilgileri</span>
              {currentStep > 1 ? (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">Tamamlandı</span>
              ) : currentStep === 1 ? (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">Aktif</span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">Bekliyor</span>
              )}
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center relative z-10 w-1/4">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer bg-white
                ${currentStep >= 2 ? "border-[#FA8B00] text-[#FA8B00]" : "border-slate-300 text-slate-400"}
                ${currentStep === 2 ? "shadow-[0_0_0_4px_rgba(250,139,0,0.1)]" : ""}
                ${currentStep > 2 ? "bg-[#FA8B00] text-white" : ""}
              `}
              onClick={() => currentStep > 2 && setCurrentStep(2)}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <div className="mt-3 flex flex-col items-center text-center px-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">ADIM 2</span>
              <span className="text-xs font-semibold text-slate-800 mb-1">Gönderici Adresi</span>
              {currentStep > 2 ? (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">Tamamlandı</span>
              ) : currentStep === 2 ? (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">Aktif</span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">Bekliyor</span>
              )}
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center relative z-10 w-1/4">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer bg-white
                ${currentStep >= 3 ? "border-[#FA8B00] text-[#FA8B00]" : "border-slate-300 text-slate-400"}
                ${currentStep === 3 ? "shadow-[0_0_0_4px_rgba(250,139,0,0.1)]" : ""}
                ${currentStep > 3 ? "bg-[#FA8B00] text-white" : ""}
              `}
              onClick={() => currentStep > 3 && setCurrentStep(3)}
            >
              <Package className="w-4 h-4" />
            </div>
            <div className="mt-3 flex flex-col items-center text-center px-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">ADIM 3</span>
              <span className="text-xs font-semibold text-slate-800 mb-1">Paket Tipi</span>
              {currentStep > 3 ? (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">Tamamlandı</span>
              ) : currentStep === 3 ? (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">Aktif</span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">Bekliyor</span>
              )}
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center relative z-10 w-1/4">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all bg-white
                ${currentStep >= 4 ? "border-[#FA8B00] text-[#FA8B00]" : "border-slate-300 text-slate-400"}
                ${currentStep === 4 ? "shadow-[0_0_0_4px_rgba(250,139,0,0.1)]" : ""}
              `}
            >
              <FileText className="w-4 h-4" />
            </div>
            <div className="mt-3 flex flex-col items-center text-center px-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">ADIM 4</span>
              <span className="text-xs font-semibold text-slate-800 mb-1">Gönderi İçeriği</span>
              {currentStep === 4 ? (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">Aktif</span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">Bekliyor</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        {currentStep === 1 && (
          <Step1AliciBilgileri 
            recipientType={recipientType}
            setRecipientType={setRecipientType}
            address={address}
            setAddress={setAddress}
            recipientInfo={recipientInfo}
            setRecipientInfo={setRecipientInfo}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2GondericiAdresi 
            iossType={iossType}
            setIossType={setIossType}
            onNext={() => setCurrentStep(3)}
            onPrev={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3PaketTipi 
            packageType={packageType}
            setPackageType={setPackageType}
            onNext={() => setCurrentStep(4)}
            onPrev={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4GonderiIcerigi 
            onPrev={() => setCurrentStep(3)}
          />
        )}
      </div>
    </div>
  );
}
