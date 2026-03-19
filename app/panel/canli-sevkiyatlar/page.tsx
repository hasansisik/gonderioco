"use client"

import { useState, useEffect } from "react"
import { 
  Globe, 
  Search, 
  MapPin, 
  Navigation, 
  Truck, 
  Clock, 
  Box,
  LayoutGrid,
  Info,
  Maximize2,
  Activity,
  Plane
} from "lucide-react"
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker, 
  Line,
  ZoomableGroup 
} from "react-simple-maps"
import { cn } from "@/lib/utils"

// Standard TopoJSON World Map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface Shipment {
  id: string;
  from: string;
  fromCoords: [number, number];
  to: string;
  toCoords: [number, number];
  status: string;
  progress: number;
  carrier: string;
  time: string;
}

const activeShipments: Shipment[] = [
  { id: "S-1293", from: "İstanbul, TR", fromCoords: [28.9784, 41.0082], to: "New York, US", toCoords: [-74.0060, 40.7128], status: "Havadadır", progress: 65, carrier: "Fedex", time: "2 Gün" },
  { id: "S-8821", from: "İstanbul, TR", fromCoords: [28.9784, 41.0082], to: "London, UK", toCoords: [-0.1278, 51.5074], status: "Yoldadır", progress: 30, carrier: "DHL", time: "1 Gün" },
  { id: "S-4420", from: "İstanbul, TR", fromCoords: [28.9784, 41.0082], to: "Riyadh, SA", toCoords: [46.6753, 24.7136], status: "Gümrükte", progress: 85, carrier: "UPS", time: "5 Saat" },
  { id: "S-5512", from: "İstanbul, TR", fromCoords: [28.9784, 41.0082], to: "Sydney, AU", toCoords: [151.2093, -33.8688], status: "Çıkışta", progress: 12, carrier: "PTT", time: "5 Gün" },
]

export default function CanliSevkiyatlarPage() {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ coordinates: [0, 25] as [number, number], zoom: 1 })

  useEffect(() => {
    setMounted(true)
  }, [])

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  }

  function handleMoveEnd(newPosition: { coordinates: [number, number]; zoom: number }) {
    setPosition(newPosition);
  }

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 pb-10 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             Canlı Global Sevkiyatlar
             <Activity className="size-5 text-orange-500 animate-pulse" />
          </h1>
          <p className="text-sm text-slate-400 font-medium tracking-tight pr-4">Anlık global ağ durumunuz ve aktif hava yolları trafiği.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 border border-slate-100 rounded-2xl">
           <div className="pr-2 pl-2">
             <span className="text-xs font-bold text-orange-500">4 Aktif Hava Yolu</span>
             <p className="text-[10px] text-slate-400 font-medium">Toplam 12 rotada trafik aktif</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative min-h-[750px] px-4">
        
        {/* LEFT SIDE - Shipment Vertical Feed */}
        <div className="w-full lg:w-[320px] flex flex-col gap-4 z-10 max-h-[750px] overflow-y-auto no-scrollbar order-2 lg:order-1">
           {activeShipments.map((s) => (
             <div key={s.id} className="bg-white border border-slate-100 rounded-[1.5rem] p-5 flex flex-col gap-4 group/card hover:bg-orange-50/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                         <Plane className="size-4" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[11px] font-bold text-slate-800 tracking-tight">{s.id}</span>
                         <span className="text-[9px] text-slate-400 font-bold uppercase">{s.carrier}</span>
                      </div>
                   </div>
                   <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100/50">
                      {s.status}
                   </span>
                </div>

                <div className="flex flex-col gap-2">
                   <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 tracking-tight">
                      <span>{s.from}</span>
                      <Navigation className="size-3 text-slate-300 rotate-90" />
                      <span>{s.to}</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${s.progress}%` }} />
                   </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-1">
                   <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100/50">
                      <Clock className="size-3" />
                      {s.time}
                   </span>
                   <button className="text-orange-500 hover:text-orange-600 transition-colors">Takip Et</button>
                </div>
             </div>
           ))}
        </div>

        {/* RIGHT SIDE - Zoomable Map Container */}
        <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 overflow-hidden relative order-1 lg:order-2">
           
           {/* HUD - Top Right */}
           <div className="absolute top-6 right-6 z-20">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 flex flex-col gap-3 min-w-[180px]">
                 <div className="flex items-center gap-2 mb-1">
                    <div className="size-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">SİSTEM STANDBY</span>
                 </div>
                 <div className="grid grid-cols-1 gap-2.5">
                    <HudStat label="Aktif Rotalar" value="12" icon={<Navigation className="size-3 text-orange-400" />} />
                    <HudStat label="Teslimat Başarısı" value="%98.4" icon={<Box className="size-3 text-orange-400" />} />
                 </div>
              </div>
           </div>

           {/* Zoomable World Map Layer */}
           <div className="absolute inset-0 z-0">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 155 }}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              >
                <ZoomableGroup 
                  zoom={position.zoom} 
                  center={position.coordinates} 
                  onMoveEnd={handleMoveEnd}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: any[] }) =>
                      geographies.map((geo: any) => {
                        // ISO codes for active countries: TR(792), US(840), GB(826), SA(682), AU(036)
                        const activeIds = ["792", "840", "826", "682", "036"];
                        const isActive = activeIds.includes(geo.id) || activeIds.includes(geo.properties.iso_n3);
                        
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={isActive ? "#FFD6A5" : "#FFF7ED"}
                            stroke={isActive ? "#FDBA74" : "#FED7AA"}
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: isActive ? "#FDBA74" : "#FFEDD5", outline: "none" },
                              pressed: { fill: "#FDE68A", outline: "none" },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>

                  {/* Arcs and Moving Dashed Paths */}
                  {activeShipments.map((shipment) => (
                     <g key={shipment.id}>
                        {/* Background Dashed Line with Animation */}
                        <Line
                          from={shipment.fromCoords}
                          to={shipment.toCoords}
                          stroke="#F97316"
                          strokeWidth={1.5}
                          strokeDasharray="4 4"
                          className="opacity-30 pointer-events-none"
                        >
                           <animate 
                             attributeName="stroke-dashoffset" 
                             from="100" 
                             to="0" 
                             dur="20s" 
                             repeatCount="indefinite" 
                           />
                        </Line>

                        {/* Moving High-Tech Pulse Line */}
                        <Line
                          from={shipment.fromCoords}
                          to={shipment.toCoords}
                          stroke="#F97316"
                          strokeWidth={2.5}
                          strokeDasharray="1, 10"
                          strokeLinecap="round"
                          className="opacity-60 pointer-events-none"
                        >
                           <animate 
                             attributeName="stroke-dashoffset" 
                             from="100" 
                             to="0" 
                             dur="8s" 
                             repeatCount="indefinite" 
                           />
                        </Line>

                        {/* THE HUB - Istanbul */}
                        <Marker coordinates={[28.9784, 41.0082]}>
                           <circle r="4" fill="#EA580C" />
                           <circle r="12" fill="#EA580C" fillOpacity="0.1">
                              <animate attributeName="r" values="12;24;12" dur="3s" repeatCount="indefinite" />
                           </circle>
                        </Marker>

                        {/* Destination Marker */}
                        <Marker coordinates={shipment.toCoords}>
                           <circle r="3" fill="#EA580C" stroke="#fff" strokeWidth={1} />
                           {/* Pulse for destination */}
                           <circle r="6" fill="#EA580C" fillOpacity="0.15">
                              <animate attributeName="r" values="6;12;6" dur="3s" repeatCount="indefinite" />
                           </circle>
                           <text y="-10" textAnchor="middle" className="fill-orange-800 text-[8px] font-bold tracking-tight">{shipment.to.split(',')[0]}</text>
                        </Marker>
                     </g>
                  ))}
                </ZoomableGroup>
              </ComposableMap>
           </div>

           {/* Zoom Controls Overlay */}
           <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
              <button 
                onClick={handleZoomIn}
                className="size-8 bg-white/90 backdrop-blur-md rounded-lg border border-slate-100 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-50 transition-all"
              >
                +
              </button>
              <button 
                onClick={handleZoomOut}
                className="size-8 bg-white/90 backdrop-blur-md rounded-lg border border-slate-100 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-50 transition-all"
              >
                -
              </button>
           </div>
        </div>

      </div>

    </div>
  )
}

function HudStat({ label, value, icon }: any) {
  return (
    <div className="flex items-center justify-between gap-8 group">
      <div className="flex items-center gap-2">
         {icon}
         <span className="text-[10px] font-semibold text-slate-400">{label}</span>
      </div>
      <span className="text-[11px] font-bold text-slate-700">{value}</span>
    </div>
  )
}
