"use client"

import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { server } from "@/config"
import { FileText, Download, TrendingUp, TrendingDown, Target, BarChart3 } from "lucide-react"
import * as XLSX from "xlsx"
import { cn } from "@/lib/utils"
import { ReportDateFilters, type DateRange } from "@/components/report-date-filters"
import { startOfMonth, endOfDay } from "date-fns"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar
} from "recharts"

export default function OfferReportPage() {
    const [offers, setOffers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isMounted, setIsMounted] = useState(false)
    const [dateRange, setDateRange] = useState<DateRange>({
        from: startOfMonth(new Date()),
        to: endOfDay(new Date()),
    })

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("accessToken")
                const params = new URLSearchParams()
                if (dateRange.from) params.append("startDate", dateRange.from.toISOString())
                if (dateRange.to) params.append("endDate", dateRange.to.toISOString())

                const { data } = await axios.get(`${server}/reports/offers?${params.toString()}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setOffers(data.offers)
            } catch (error) {
                console.error("Error fetching offer reports:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOffers()
    }, [dateRange])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const trendData = useMemo(() => {
        // If range is within a single month, show day-by-day
        // Otherwise show month-by-month
        const diffDays = dateRange.from && dateRange.to
            ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
            : 0

        if (diffDays <= 31 && dateRange.from) {
            // Day by day for small ranges
            const days = Array.from({ length: diffDays + 1 }, (_, i) => {
                const d = new Date(dateRange.from!)
                d.setDate(d.getDate() + i)
                return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
            })

            return days.map(day => {
                const dayOffers = offers.filter(o =>
                    new Date(o.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }) === day
                )
                return {
                    name: day,
                    total: dayOffers.reduce((acc, curr) => acc + (parseFloat(curr.urunler?.[0]?.toplamTutar) || 0), 0),
                    count: dayOffers.length
                }
            })
        }

        // Default: Month by month
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            return d.toLocaleString('tr-TR', { month: 'short' })
        }).reverse()

        return last6Months.map(month => {
            const monthOffers = offers.filter(o =>
                new Date(o.createdAt).toLocaleString('tr-TR', { month: 'short' }) === month
            )
            return {
                name: month,
                total: monthOffers.reduce((acc, curr) => acc + (parseFloat(curr.urunler?.[0]?.toplamTutar) || 0), 0),
                count: monthOffers.length
            }
        })
    }, [offers, dateRange])

    const statusData = useMemo(() => {
        const statuses = [
            { name: 'Onaylandı', color: '#10b981' },
            { name: 'Bekliyor', color: '#f59e0b' },
            { name: 'Reddedildi', color: '#ef4444' },
            { name: 'Taslak', color: '#64748b' }
        ];

        return statuses.map(s => ({
            name: s.name,
            value: offers.filter(o => {
                if (s.name === 'Onaylandı') {
                    return o.status?.includes('Onay') || ['Faturalandı', 'Tamamlandı', 'Sevkiyat Halinde', 'Teslim Edildi'].includes(o.status);
                }
                if (s.name === 'Bekliyor') {
                    return o.status === 'Bekliyor' || o.status === 'Gönderildi' || o.status?.includes('Bekliyor') || !o.status;
                }
                return o.status === s.name || (o.status && o.status.includes(s.name));
            }).length,
            color: s.color
        })).filter(s => s.value > 0);
    }, [offers])

    const stats = useMemo(() => {
        const totalAmount = offers.reduce((acc, curr) => acc + (parseFloat(curr.urunler?.[0]?.toplamTutar) || 0), 0)
        const successStatuses = ['Onaylandı', 'Yönetici Onayladı', 'Müşteri Onayladı', 'Faturalandı', 'Tamamlandı', 'Sevkiyat Halinde', 'Teslim Edildi']
        const approved = offers.filter(o => successStatuses.includes(o.status) || o.status?.includes('Onay') || o.status?.includes('Teslim')).length
        const successRate = offers.length ? (approved / offers.length) * 100 : 0

        return {
            total: offers.length,
            amount: totalAmount,
            avg: offers.length ? totalAmount / offers.length : 0,
            successRate
        }
    }, [offers])

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(offers.map(o => ({
            "Teklif No": o._id,
            "Müşteri": o.musteri?.company || o.musteri?.person || "Bilinmiyor",
            "Başlık": o.title || o.konu,
            "Tarih": new Date(o.createdAt).toLocaleDateString("tr-TR"),
            "Tutar": o.urunler?.[0]?.toplamTutar || 0,
            "Durum": o.status
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "TeklifAnalytics");
        XLSX.writeFile(workbook, `Teklif_Analiz_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    if (!isMounted) return null;

    return (
        <div className="flex flex-col gap-6 py-4 font-sans relative">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-[100] flex items-center justify-center rounded-[3rem]">
                    <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                        <div className="size-4 bg-emerald-500 rounded-full animate-bounce" />
                        <span className="text-xs font-normal text-slate-800">Veriler Güncelleniyor...</span>
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <BarChart3 className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-800 ">Teklif Analytics</h1>
                        <p className="text-[11px] text-slate-400 font-normal mt-0.5">Satış performansı ve trend analizi</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <ReportDateFilters onRangeChange={(range) => setDateRange(range)} />
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-normal hover:bg-emerald-600 transition-all"
                    >
                        <Download className="size-3.5" />
                        Dışa Aktar
                    </button>
                </div>
            </div>

            {/* Premium Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden group">
                    <div className="size-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                        <TrendingUp className="size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-normal text-slate-400">Aylık Hacim</p>
                        <h3 className="text-xl font-semibold text-slate-800 mt-0.5">₺ {stats.amount.toLocaleString('tr-TR')}</h3>
                    </div>
                    <div className="absolute top-3 right-3 text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-[9px] font-semibold">+14.2%</div>
                </div>

                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-3">
                    <div className="size-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                        <Target className="size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-normal text-slate-400">Başarı Oranı</p>
                        <h3 className="text-xl font-semibold text-slate-800 mt-0.5">%{stats.successRate.toFixed(1)}</h3>
                    </div>
                    <div className="w-full bg-slate-50 h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${stats.successRate}%` }} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-3">
                    <div className="size-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                        <FileText className="size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-normal text-slate-400">Ort. Teklif Değeri</p>
                        <h3 className="text-xl font-semibold text-slate-800 mt-0.5">₺ {stats.avg.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</h3>
                    </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-[2rem] text-white flex flex-col gap-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                        <BarChart3 className="size-16" />
                    </div>
                    <p className="text-[10px] font-normal text-slate-400">Toplam Teklif</p>
                    <h3 className="text-3xl font-semibold">{stats.total}</h3>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Trend Chart */}
                <div className="lg:col-span-8 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-md font-semibold text-slate-800 ">Performans Trendi</h3>
                            <p className="text-[10px] text-slate-400 font-normal">Ciro akışı detayları</p>
                        </div>
                    </div>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={(v) => `₺${v / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', background: '#fff' }}
                                    itemStyle={{ fontSize: 11, fontWeight: 800 }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Chart */}
                <div className="lg:col-span-4 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-md font-semibold text-slate-800  mb-1">Durum Dağılımı</h3>
                    <p className="text-[10px] text-slate-400 font-normal mb-6">Genel oranlar</p>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}
                                />
                                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 9, fontWeight: 700 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
