"use client"

import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { server } from "@/config"
import { Users, Download, ArrowLeft, TrendingUp, TrendingDown, MapPin, Building, Target, Clock, CheckCircle2, FileText, ChevronRight, Briefcase } from "lucide-react"
import * as XLSX from "xlsx"
import { cn } from "@/lib/utils"

export default function PersonnelReportPage() {
    const [staffList, setStaffList] = useState<any[]>([])
    const [offers, setOffers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [selectedStaff, setSelectedStaff] = useState<any | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("accessToken")

                const [staffRes, offRes] = await Promise.all([
                    axios.get(`${server}/staff`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${server}/reports/offers`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ])

                setStaffList(staffRes.data.staff || [])
                setOffers(offRes.data.offers || [])
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const staffStats = useMemo(() => {
        return staffList.map(s => {
            const staffOffers = offers.filter(o => {
                const isUser = o.user?._id === s._id || o.user === s._id;
                const isPersonel = o.personel?._id === s._id || o.personel === s._id;
                return isUser || isPersonel;
            });
            const totalOffers = staffOffers.length;

            const pendingOffers = staffOffers.filter(o => o.status === 'Gönderildi' || o.status === 'Bekliyor' || o.status === 'Müşteriye Gönderildi' || !o.status)
            const rejectedOffers = staffOffers.filter(o => o.status === 'Reddedildi' || o.status?.includes('Red'))
            const approvedOffers = staffOffers.filter(o => o.status === 'Onaylandı' || o.status?.includes('Onay') || o.status === 'Yönetici Onayladı')
            const deliveredOffers = staffOffers.filter(o => o.status === 'Faturalandı' || o.status === 'Teslim Edildi' || o.status?.includes('Teslim') || o.status?.includes('Kısmi Fatura') || o.status === 'Tamamlandı' || o.status === 'Sevkiyat Halinde')

            const pendingCount = pendingOffers.length
            const rejectedCount = rejectedOffers.length
            const approvedCount = approvedOffers.length
            const deliveredCount = deliveredOffers.length

            const totalValue = staffOffers.reduce((acc, curr) => acc + (parseFloat(String(curr.urunler?.[0]?.toplamTutar).replace(/[^0-9.-]+/g, "")) || 0), 0)
            const approvedValue = approvedOffers.reduce((acc, curr) => acc + (parseFloat(String(curr.urunler?.[0]?.toplamTutar).replace(/[^0-9.-]+/g, "")) || 0), 0)

            const efficiencyRate = s.efficiencyRate || 0

            return {
                ...s,
                totalOffers,
                pendingCount,
                rejectedCount,
                approvedCount,
                deliveredCount,
                totalValue,
                approvedValue,
                efficiencyRate,
                staffOffers
            }
        }).sort((a, b) => b.totalOffers - a.totalOffers);
    }, [staffList, offers]);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(staffStats.map(s => ({
            "Personel": s.name + " " + s.surname,
            "Departman": s.department?.name || "-",
            "Oluşturulan Teklif": s.totalOffers,
            "Onaylanan": s.approvedCount,
            "Teslim Edilen": s.deliveredCount,
            "Reddedilen": s.rejectedCount,
            "Toplam Tutar": s.totalValue,
            "Verimlilik(%)": s.efficiencyRate
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "PersonelKarnesi");
        XLSX.writeFile(workbook, `Personel_Karnesi_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    if (selectedStaff) {
        const stats = staffStats.find(s => s._id === selectedStaff._id) || selectedStaff;
        return (
            <div className="flex flex-col gap-6 py-4 font-sans relative">
                {/* Header Back */}
                <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedStaff(null)}
                            className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <ArrowLeft className="size-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800  flex items-center gap-2">
                                {stats.name} {stats.surname} <span className="text-slate-400 font-medium">Karnesi</span>
                            </h1>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-normal mt-1">
                                {stats.department?.name && <span className="flex items-center gap-1"><Briefcase className="size-3" /> {stats.department.name}</span>}
                                {stats.email && <span>{stats.email}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Oluşturulan */}
                    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between gap-4 relative">
                        <div className="size-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <FileText className="size-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-normal text-slate-400">Tarih Boyunca Tüm Teklifler</p>
                            <h3 className="text-3xl font-semibold text-slate-800  mt-1">{stats.totalOffers}</h3>
                        </div>
                    </div>

                    {/* Onaylanan */}
                    <div className="bg-white p-5 rounded-[2rem] border border-emerald-100 shadow-sm flex flex-col justify-between gap-4 relative">
                        <div className="size-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <Target className="size-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-normal text-emerald-600">Onaylanan</p>
                            <h3 className="text-3xl font-semibold text-emerald-700  mt-1">{stats.approvedCount}</h3>
                        </div>
                    </div>

                    {/* Teslim / Faturalandırılan */}
                    <div className="bg-white p-5 rounded-[2rem] border border-indigo-100 shadow-sm flex flex-col justify-between gap-4 relative">
                        <div className="size-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-normal text-indigo-600">Teslim Edilen</p>
                            <h3 className="text-3xl font-semibold text-indigo-700  mt-1">{stats.deliveredCount}</h3>
                        </div>
                    </div>

                    {/* Reddedilen */}
                    <div className="bg-white p-5 rounded-[2rem] border border-rose-100 shadow-sm flex flex-col justify-between gap-4 relative">
                        <div className="size-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                            <TrendingDown className="size-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-normal text-rose-600">Reddedilen</p>
                            <h3 className="text-3xl font-semibold text-rose-700  mt-1">{stats.rejectedCount}</h3>
                        </div>
                    </div>

                    {/* Verimlilik Oranı */}
                    <div className="bg-slate-900 p-5 rounded-[2rem] border border-slate-800 shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
                            <Target className="size-24" />
                        </div>
                        <div className="flex items-center justify-between relative z-10">
                            <div className="size-10 rounded-xl bg-white/10 text-white flex items-center justify-center backdrop-blur-sm border border-white/5">
                                <Target className="size-5" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[11px] font-normal text-slate-400">Verimlilik Oranı</p>
                            <h3 className="text-3xl font-semibold text-white  mt-1">%{stats.efficiencyRate}</h3>
                        </div>
                        <div className="flex flex-col gap-2 mt-2 relative z-10">
                            <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 rounded-full relative">
                                <div
                                    className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] border-2 border-slate-900 transition-all duration-1000 -translate-y-1/2 -ml-1.5"
                                    style={{ left: `${stats.efficiencyRate}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Offer details specific to customer */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden mt-4">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-800 ">Personelin Teklif Geçmişi</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[11px] font-normal text-slate-300">
                                    <th className="px-6 py-4 border-b border-slate-50">Teklif Başlığı</th>
                                    <th className="px-4 py-4 border-b border-slate-50">Durum</th>
                                    <th className="px-6 py-4 border-b border-slate-50 text-right">Tutar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.staffOffers.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-10 text-center">
                                            <p className="text-xs font-normal text-slate-300">Bu personele ait teklif bulunmuyor.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    stats.staffOffers.map((offer: any) => (
                                        <tr key={offer._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 border-b border-slate-50">
                                                <div className="flex flex-col text-[13px] font-semibold text-slate-800">
                                                    {offer.title || offer.konu || "İsimsiz Teklif"}
                                                    <span className="text-[10px] text-slate-400 font-normal mt-0.5">{new Date(offer.createdAt).toLocaleDateString('tr-TR')}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-b border-slate-50">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-normal border shadow-sm",
                                                    offer.status?.includes('Onay') ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                        offer.status?.includes('Teslim') || offer.status?.includes('Faturalandı') || offer.status === 'Tamamlandı' || offer.status === 'Sevkiyat Halinde' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                                            offer.status?.includes('Red') ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                                "bg-slate-100 text-slate-500 border-slate-200"
                                                )}>
                                                    <div className={cn("size-1.5 rounded-full",
                                                        offer.status?.includes('Onay') ? "bg-emerald-500" :
                                                            offer.status?.includes('Teslim') || offer.status?.includes('Faturalandı') || offer.status === 'Tamamlandı' || offer.status === 'Sevkiyat Halinde' ? "bg-indigo-500" :
                                                                offer.status?.includes('Red') ? "bg-rose-500" : "bg-slate-400"
                                                    )} />
                                                    {offer.status || "Bekliyor"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-50 text-right font-semibold text-slate-800 text-[13px]">
                                                {offer.urunler?.[0]?.toplamTutar ? `${offer.paraBirimi === 'TRY' ? '₺' : offer.paraBirimi} ${parseFloat(offer.urunler[0].toplamTutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 py-4 font-sans relative">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-[100] flex items-center justify-center rounded-[3rem]">
                    <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                        <div className="size-4 bg-orange-500 rounded-full animate-bounce" />
                        <span className="text-xs font-normal text-slate-800">Karneler Hesaplanıyor...</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Briefcase className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-800 ">Personel Karneleri</h1>
                        <p className="text-[11px] text-slate-400 font-normal mt-0.5">Personel Bazlı Performans Raporları</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-normal hover:bg-slate-800 transition-all shadow-sm"
                    >
                        <Download className="size-3.5" />
                        Dışa Aktar
                    </button>
                </div>
            </div>

            {/* Staff List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {staffStats.length === 0 && !loading && (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-normal text-sm">
                        Sistemde henüz kayıtlı personel bulunamadı.
                    </div>
                )}
                {staffStats.map(s => (
                    <div
                        key={s._id}
                        onClick={() => setSelectedStaff(s)}
                        className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col overflow-hidden"
                    >
                        <div className="p-5 flex items-start justify-between border-b border-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center font-semibold text-sm border border-slate-100 group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-100 transition-colors">
                                    {(s.name || "P").substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-semibold text-slate-800  group-hover:text-orange-600 transition-colors line-clamp-1">{s.name} {s.surname}</h3>
                                    <span className="text-[11px] text-slate-400 font-normal mt-0.5 max-w-[150px] truncate">{s.department?.name || "Belirtilmedi"}</span>
                                </div>
                            </div>
                            <div className="size-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                                <ChevronRight className="size-4" />
                            </div>
                        </div>
                        <div className="p-5 flex items-end justify-between gap-4 bg-slate-50/30">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <div className="flex items-center justify-between text-[11px] font-normal">
                                    <span className="text-slate-500">Kazanma</span>
                                    <span className="text-slate-800">%{s.efficiencyRate}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-normal text-right mb-1.5">{s.approvedCount} Onay / {s.totalOffers} Toplam</p>
                                <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 rounded-full relative">
                                    <div
                                        className="absolute top-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-sm border border-slate-300 transition-all duration-1000 -translate-y-1/2 -ml-1"
                                        style={{ left: `${s.efficiencyRate}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-normal text-slate-400 mb-0.5">Teklif Sayısı</span>
                                <span className="text-xl font-semibold text-slate-800">{s.totalOffers}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
