"use client"

import { useState, useEffect } from "react"

export default function CanliPrankPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-[#D1D5DB] p-8 font-['Comic_Sans_MS',cursive] text-[#1E3A8A]">
      
      {/* "Serious" Legacy Header */}
      <div className="text-left border-[4px] border-b-[8px] border-r-[8px] border-black p-6 bg-[#3B82F6] shadow-none">
        <h1 className="text-4xl font-black uppercase tracking-tight text-white">
           GON-TRAC GLOBAL LOGISTICS - TERMINAL v1.07
        </h1>
        <div className="mt-4 bg-[#1E3A8A] text-[#10B981] p-2 font-mono text-sm border-2 border-white">
           SYSTEM CONNECTIVITY: ACTIVE // DATA SYNC: 98.4% // LAST UPDATE: 2026-03-20 00:09:36
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* "Official" Shipment Log */}
        <div className="w-full lg:w-[350px] bg-[#9CA3AF] border-4 border-black p-4 space-y-3">
           <h2 className="text-2xl font-bold border-b-4 border-black pb-2 text-black uppercase">Active Air Freight Log</h2>
           {[
             { id: "GTX-90122", to: "JFK/NEW YORK", p: 45, d: "In Flight" },
             { id: "GTX-88211", to: "LHR/LONDON", p: 12, d: "Departure" },
             { id: "GTX-77334", to: "RUH/RIYADH", p: 88, d: "Final Approach" },
             { id: "GTX-11200", to: "SYD/SYDNEY", p: 30, d: "In Transit" },
             { id: "GTX-44567", to: "DXB/DUBAI", p: 65, d: "In Flight" },
           ].map((s) => (
             <div key={s.id} className="bg-white p-3 border-2 border-black flex flex-col gap-1 shadow-none transition-none">
                <span className="text-lg font-black text-red-600">UNIT: {s.id}</span>
                <p className="text-xs font-bold uppercase">Destination: {s.to}</p>
                <p className="text-[10px] text-gray-400">STATUS CODE: {s.d}</p>
                <div className="h-4 w-full bg-gray-200 mt-1 border-2 border-black">
                   <div className="h-full bg-blue-600" style={{ width: `${s.p}%` }} />
                </div>
             </div>
           ))}
        </div>

        {/* THE "WORKING" MAP */}
        <div className="flex-1 bg-white border-4 border-black relative min-h-[600px] overflow-hidden">
           <div className="absolute top-0 left-0 p-3 z-10 bg-black text-lime-400 font-mono text-[10px]">
              REMOTE GEOGRAPHIC ENGINE INITIALIZED...
              CLIENT_ID: G-9921_LEGACY
           </div>

           <div 
              className="w-full h-full bg-no-repeat bg-cover bg-center grayscale brightness-75"
              style={{ 
                backgroundImage: `url('https://lh4.googleusercontent.com/proxy/sI-pLpPCh88YltJ-kk6d0oE1_eeJFEo8Px1aTjutakGXpDeJJqfh7RaGnWCWeGov7T9tDKuVDaIOff8TpATNDP5Zs2FB88MtEUJ3t3YK-ssU3k8QvI-oOA')`,
                cursor: 'wait'
              }}
           >
              {/* "OFFICIAL" TRACKING OVERLAYS */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                 <path d="M100,100 Q400,200 800,400" stroke="rgba(0,0,255,0.4)" strokeWidth="4" fill="none" strokeDasharray="10 10" />
                 <path d="M50,400 L400,50 L850,300" stroke="rgba(255,0,0,0.4)" strokeWidth="4" fill="none" />
                 <circle cx="200" cy="150" r="10" fill="red" />
                 <text x="215" y="155" fill="black" className="text-sm font-bold bg-white">UNIT_POS_LOCK</text>
              </svg>

              <div className="absolute bottom-6 right-6 flex gap-2">
                 <div className="size-4 bg-red-600 rounded-full animate-ping" />
                 <div className="size-4 bg-green-600 rounded-full" />
                 <div className="size-4 bg-yellow-600 rounded-full" />
              </div>
           </div>

           {/* More "Official" Controls */}
           <div className="absolute bottom-4 left-4 flex gap-2">
              <button className="bg-gray-200 border-2 border-black text-[10px] px-4 py-1 font-bold">RE-CENTER MAP</button>
              <button className="bg-gray-200 border-2 border-black text-[10px] px-4 py-1 font-bold">PRINT LOG</button>
           </div>
        </div>

      </div>

      <div className="p-4 bg-gray-400 text-black font-bold text-center border-t-4 border-black">
         <p className="text-[10px] uppercase">Property of GON-TRAC Global Logistics. Unauthorized access is prohibited by federal law 105.1-C.</p>
      </div>

      <style jsx global>{`
        body {
          background-color: #ff00ff !important;
          cursor: url('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.iconarchive.com%2Fshow%2Fflatwoken-icons-by-alecive%2FApps-Cursor-icon.html&psig=AOvVaw0O-O6B7C-A8R1A8R1A8R1&ust=1710928000000000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCID9p9v0-oQDFQAAAAAdAAAAABAE'), auto;
        }
      `}</style>
    </div>
  )
}
