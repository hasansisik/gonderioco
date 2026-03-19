"use client"

import { useAppSelector } from "@/redux/hook"
import { UserAvatar } from "@/components/ui/user-avatar"
import { cn } from "@/lib/utils"
import { 
  TrendingUp, 
  Package, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  MoreHorizontal,
  ChevronRight
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'

const trendData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1100 },
];

const statusData = [
  { name: 'Teslim Edildi', value: 65, color: '#10b981' },
  { name: 'Yolda', value: 25, color: '#f59e0b' },
  { name: 'Bekliyor', value: 10, color: '#6366f1' },
];

export default function Page() {
  const { user } = useAppSelector((state: any) => state.user)

  return (
    <div className="flex flex-col gap-8 pb-10 font-sans animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative shadow-2xl overflow-hidden rounded-2xl bg-white border-2 border-orange-50/50">
              <UserAvatar
                name={user?.name}
                surname={user?.surname}
                picture={user?.picture || user?.profile?.picture}
                size="xl"
                className="size-14 !rounded-2xl"
              />
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
              Merhaba, {user?.name || "Kullanıcı"} 👋
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5 tracking-tight">İşletmenizin bugünkü özeti ve kargo aktiviteleri burada.</p>
          </div>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-orange-100 active:scale-95 group text-sm">
           <Package className="size-4.5 group-hover:-translate-y-0.5 transition-transform" />
           <span>Gönderi Oluştur</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Toplam Kargo" 
          value="1,284" 
          change="+12.5%" 
          icon={<Package className="size-5 text-orange-500" />} 
          color="orange"
        />
        <StatCard 
          title="Yoldaki Kargolar" 
          value="42" 
          change="Sürece Uygun" 
          icon={<Clock className="size-5 text-blue-500" />} 
          color="blue"
        />
        <StatCard 
          title="Teslim Edilenler" 
          value="1,192" 
          change="+24 Bugün" 
          icon={<CheckCircle2 className="size-5 text-emerald-500" />} 
          color="emerald"
        />
        <StatCard 
          title="Hizmet Verimliliği" 
          value="98.2%" 
          change="Piyasa Üstü" 
          icon={<TrendingUp className="size-5 text-indigo-500" />} 
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-base font-bold text-slate-800">Gönderim Trendi</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Son 7 ayın kargo performans özeti</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 text-orange-600 text-[10px] font-bold border border-orange-100/50">
                <ArrowUpRight className="size-3" />
                24% Artış
              </span>
            </div>
          </div>
          
          <div className="h-[250px] w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB923C" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#FB923C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 'semibold'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#FB923C" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small Data Cards */}
        <div className="flex flex-col gap-8">
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex-1">
             <h3 className="text-base font-bold text-slate-800 mb-6">Kargo Durum Payı</h3>
             <div className="space-y-6">
                {statusData.map((item) => (
                  <div key={item.name} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-slate-400">{item.name}</span>
                      <span className="text-slate-800 font-bold">{item.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                      />
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-8 pt-8 border-t border-slate-50">
               <button className="w-full py-3 text-[11px] font-bold text-slate-400 bg-slate-50/50 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2 group tracking-tight">
                 Tüm Raporları Gör
                 <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
               </button>
             </div>
           </div>

           <div className="bg-slate-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 size-32 bg-orange-500/20 rounded-full blur-3xl transition-all duration-1000 shadow-orange-500/10" />
              <div className="relative z-10">
                <h4 className="text-orange-400 text-[10px] font-bold tracking-wider mb-2">Kurumsal Paket</h4>
                <p className="text-lg font-bold mb-4 leading-tight tracking-tight">Gönderim Limitini<br/>Artırmak İster misiniz?</p>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center justify-center tracking-tight">
                  Şimdi Yükselt
                </button>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-base font-bold text-slate-800">Son Gönderiler</h3>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <MoreHorizontal className="size-4" />
          </button>
        </div>
        
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] font-semibold text-slate-400 tracking-wider border-b border-slate-50">
                <th className="pb-4 pt-2 px-1">Takip No</th>
                <th className="pb-4 pt-2 px-1">Alıcı</th>
                <th className="pb-4 pt-2 px-1">Hedef</th>
                <th className="pb-4 pt-2 px-1">Durum</th>
                <th className="pb-4 pt-2 px-1 text-right">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <ShipmentRow id="#GN-9283" name="Ahmet Yılmaz" destination="Ankara, TR" status="Teslim Edildi" date="19 Mart" />
              <ShipmentRow id="#GN-9282" name="Caner Erkin" destination="İstanbul, TR" status="Yolda" date="19 Mart" />
              <ShipmentRow id="#GN-9281" name="Ayşe Demir" destination="İzmir, TR" status="Bekliyor" date="18 Mart" />
              <ShipmentRow id="#GN-9280" name="Mehmet Ak" destination="Antalya, TR" status="Teslim Edildi" date="18 Mart" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon, color }: any) {
  const colorMap: any = {
    orange: "bg-orange-50 text-orange-600 border-orange-100/50",
    blue: "bg-blue-50 text-blue-600 border-blue-100/50",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 group hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={cn("p-3 rounded-xl flex items-center justify-center border", colorMap[color])}>
          {icon}
        </div>
        <div className="flex flex-col items-end gap-0.5">
           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider opacity-60">Piyasa</span>
           <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500", change.includes('+') ? 'text-emerald-500 bg-emerald-50' : '')}>
             {change}
           </span>
        </div>
      </div>
      <div>
        <h4 className="text-2xl font-bold text-slate-800 tracking-tight group-hover:translate-x-1 transition-transform">{value}</h4>
        <p className="text-[10px] font-semibold text-slate-400 mt-0.5 tracking-tight">{title}</p>
      </div>
    </div>
  )
}

function ShipmentRow({ id, name, destination, status, date }: any) {
  const statusStyles: any = {
    'Teslim Edildi': 'text-emerald-600 bg-emerald-50 border-emerald-100/50',
    'Yolda': 'text-amber-600 bg-amber-50 border-amber-100/50',
    'Bekliyor': 'text-slate-400 bg-slate-50 border-slate-200/50',
  }

  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="py-4 px-1 font-bold text-xs text-slate-800">{id}</td>
      <td className="py-4 px-1">
        <div className="flex items-center gap-3">
          <div className="size-7 rounded-full bg-slate-100" />
          <span className="text-xs font-semibold text-slate-700">{name}</span>
        </div>
      </td>
      <td className="py-4 px-1 text-[11px] text-slate-500 font-medium">{destination}</td>
      <td className="py-4 px-1">
        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-md border shadow-sm", statusStyles[status])}>
          {status}
        </span>
      </td>
      <td className="py-4 px-1 text-right text-[11px] text-slate-400 font-bold">{date}</td>
    </tr>
  )
}
