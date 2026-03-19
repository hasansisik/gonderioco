"use client"

import { useState } from "react"
import { 
  Search, 
  Filter, 
  ChevronDown, 
  MoreHorizontal, 
  Printer, 
  Truck,
  Download,
  Calendar,
  Globe,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

const shipments = [
  {
    id: "R20304246",
    date: "11.12.2025 02:13",
    from: "Türkiye",
    to: "Fransa",
    receiver: "Bedirhan Tunçelli",
    price: "$30.40",
    trackingNo: "NVL000020304246",
    trackingStatus: "İstek Taşıyıcıya İletildi",
    status: "Depoya Ulaşması Bekleniyor",
    statusType: "waiting"
  },
  {
    id: "R20304143",
    date: "11.12.2025 01:09",
    from: "Türkiye",
    to: "Fransa",
    receiver: "Bedirhan Tunçelli",
    price: "$25.70",
    trackingNo: "NVL000020304143",
    trackingStatus: "-",
    status: "İptal Edildi",
    statusType: "cancelled"
  },
  {
    id: "R20142716",
    date: "21.10.2025 23:42",
    from: "Türkiye",
    to: "İsviçre",
    receiver: "Christine Wurzel Suangi",
    price: "$153.52",
    trackingNo: "NVL000020142716",
    trackingStatus: "Zaman Aşımı",
    status: "Depoya Ulaşması Bekleniyor",
    statusType: "waiting"
  },
  {
    id: "R20107311",
    date: "07.10.2025 14:21",
    from: "Türkiye",
    to: "Belçika",
    receiver: "Madeleine Kisamba Dimonekene",
    price: "$25.70",
    trackingNo: "NVL000020107311",
    trackingStatus: "-",
    status: "İptal Edildi",
    statusType: "cancelled"
  },
  {
    id: "R20093410",
    date: "01.10.2025 17:09",
    from: "Türkiye",
    to: "Fransa",
    receiver: "Jeanne Tuete",
    price: "$51.32",
    trackingNo: "NVL000020093410",
    trackingStatus: "-",
    status: "İptal Edildi",
    statusType: "cancelled"
  },
  {
    id: "R20093355",
    date: "01.10.2025 16:48",
    from: "Türkiye",
    to: "Fransa",
    receiver: "Jeanne Tuete",
    price: "$25.70",
    trackingNo: "NVL000020093355",
    trackingStatus: "İstek Taşıyıcıya İletildi",
    status: "Toplama Sürecinde",
    statusType: "progress"
  }
]

const tabs = [
  { id: 'all', label: 'Tümü', count: 20 },
  { id: 'waiting', label: 'Depoya Bekleniyor', count: 5 },
  { id: 'arrived', label: 'Depoya Ulaştı', count: 0 },
  { id: 'payment', label: 'Ödeme Bekliyor', count: 0 },
  { id: 'out', label: 'Çıkış Yapıldı', count: 9 },
  { id: 'cancelled', label: 'İptal Edildi', count: 6 },
]

export default function SevkiyatlarimPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')

  return (
    <div className="flex flex-col gap-8 pb-16 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Sevkiyatlarım <span className="text-sm font-medium text-slate-400 ml-1">(20)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Tüm kargo gönderimlerinizi tek bir panelden yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Download className="size-4" />
             <span>Dışa Aktar</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">
             <Truck className="size-4" />
             <span>Yeni Sevkiyat</span>
          </button>
        </div>
      </div>

      {/* Filter Section Card */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 overflow-hidden">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
            <Filter className="size-3.5" />
            <span>FİLTRELEME</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FilterSelect label="Varış Ülkesi" placeholder="Seçiniz" />
            <FilterSelect label="Gönderi Takibi" placeholder="Tümü" />
            <FilterSelect label="Teslim Şekli" placeholder="Tümü" />
            
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400">Ara</span>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Sevkiyat No, Alıcı..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl p-3 pl-10 text-xs font-semibold text-slate-600 outline-none focus:ring-1 focus:ring-orange-100"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mt-8 pt-6 border-t border-slate-50 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
             {tabs.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={cn(
                   "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                   activeTab === tab.id 
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-100" 
                    : "bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                 )}
               >
                 {tab.label}
                 <span className={cn(
                   "text-[10px] px-1.5 py-0.5 rounded-md",
                   activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                 )}>
                   {tab.count}
                 </span>
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 tracking-wider">
                  <input type="checkbox" className="rounded-md accent-orange-500" />
                </th>
                <th className="py-4 px-2 text-[11px] font-bold text-slate-400 tracking-wider">Sevkiyat No</th>
                <th className="py-4 px-2 text-[11px] font-bold text-slate-400 tracking-wider">Talep Tarihi</th>
                <th className="py-4 px-2 text-[11px] font-bold text-slate-400 tracking-wider">Rotalar</th>
                <th className="py-4 px-2 text-[11px] font-bold text-slate-400 tracking-wider">Alıcı</th>
                <th className="py-4 px-2 text-[11px] font-bold text-slate-400 tracking-wider">Fiyat</th>
                <th className="py-4 px-2 text-[11px] font-bold text-slate-400 tracking-wider">Takip No</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 tracking-wider">Statü</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-400 tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {shipments.map((s) => (
                 <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-5 px-6">
                       <input type="checkbox" className="rounded-md accent-orange-500" />
                    </td>
                    <td className="py-5 px-2">
                       <span className="text-xs font-bold text-slate-800">{s.id}</span>
                    </td>
                    <td className="py-5 px-2">
                       <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-700">{s.date.split(' ')[0]}</span>
                          <span className="text-[10px] font-medium text-slate-400">{s.date.split(' ')[1]}</span>
                       </div>
                    </td>
                    <td className="py-5 px-2">
                       <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-700">{s.from}</span>
                          <ChevronDown className="size-3 text-slate-300 -rotate-90" />
                          <span className="text-[11px] font-bold text-slate-700">{s.to}</span>
                       </div>
                    </td>
                    <td className="py-5 px-2">
                       <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">{s.receiver}</span>
                    </td>
                    <td className="py-5 px-2">
                       <span className="text-xs font-bold text-slate-800">{s.price}</span>
                    </td>
                    <td className="py-5 px-2">
                       <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-bold text-slate-800">{s.trackingNo}</span>
                          <span className="text-[9px] font-medium text-slate-400">{s.trackingStatus}</span>
                       </div>
                    </td>
                    <td className="py-5 px-6">
                       <StatusBadge status={s.status} type={s.statusType} />
                    </td>
                    <td className="py-5 px-4 text-right">
                       <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400">
                          <MoreHorizontal className="size-4" />
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white border-t border-slate-100 p-4 sticky bottom-0 z-20 -mx-8 px-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl">
           <AlertCircle className="size-4 text-orange-400" />
           <span>En az 1 sevkiyat seçiniz</span>
        </div>
        <div className="flex items-center gap-3">
           <button disabled className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl text-xs font-bold whitespace-nowrap opacity-50 cursor-not-allowed transition-all">
              Kurye Çağır
           </button>
           <button disabled className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl text-xs font-bold whitespace-nowrap opacity-50 cursor-not-allowed transition-all">
              <Printer className="size-4" />
              Kargo Etiketini Yazdır
           </button>
        </div>
      </div>

    </div>
  )
}

function FilterSelect({ label, placeholder }: any) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-bold text-slate-400">{label}</span>
      <div className="relative">
        <select className="w-full bg-slate-50 border-none rounded-xl p-3 pr-10 text-xs font-semibold text-slate-600 appearance-none outline-none focus:ring-1 focus:ring-orange-100">
          <option value="">{placeholder}</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
      </div>
    </div>
  )
}

function StatusBadge({ status, type }: any) {
  const styles: any = {
    waiting: "bg-amber-50 text-amber-600 border-amber-100/50",
    cancelled: "bg-slate-50 text-slate-400 border-slate-200",
    progress: "bg-orange-50 text-orange-600 border-orange-100/50",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
  }

  const icons: any = {
    waiting: <Clock className="size-3" />,
    cancelled: <XCircle className="size-3" />,
    progress: <Truck className="size-3" />,
    success: <CheckCircle2 className="size-3" />,
  }

  return (
    <div className={cn(
      "px-3 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-2 w-fit whitespace-nowrap",
      styles[type]
    )}>
      {icons[type]}
      {status}
    </div>
  )
}
