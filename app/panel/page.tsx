"use client"

import axios from "axios"
import { server } from "@/config"
import { cn } from "@/lib/utils"
import { Coins, Users, Package, FileText, Plus, Calendar, ArrowRight, UserCircle2, TrendingUp, TrendingDown, Target, Clock, Star, MapPin, MessageSquare, Ticket } from "lucide-react"
import { useEffect, useMemo, useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllOffers } from "@/redux/actions/offerActions"
import { getAllCustomers } from "@/redux/actions/customerActions"
import { getAllProducts } from "@/redux/actions/productActions"
import { loadUser } from "@/redux/actions/userActions"
import { getMyCommission } from "@/redux/actions/commissionActions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { StatCard } from "@/components/stat-card"
import { usePermissions } from "@/hooks/usePermissions"
import { QuickAction } from "@/components/quick-action"
import { ReportDateFilters, type DateRange } from "@/components/report-date-filters"
import { startOfMonth, endOfDay } from "date-fns"
import { UserAvatar } from "@/components/ui/user-avatar"

export default function Page() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { offers } = useAppSelector((state) => state.offer)
  const { customers } = useAppSelector((state) => state.customer)
  const { products } = useAppSelector((state) => state.product)
  const { user } = useAppSelector((state) => state.user)
  const { myCommission } = useAppSelector((state) => state.commission)

  const [overallEfficiency, setOverallEfficiency] = useState(0)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  })

  useEffect(() => {
    dispatch(loadUser())
    dispatch(getAllCustomers())
    dispatch(getAllProducts())
    dispatch(getMyCommission())

    // Fetch offers and overall efficiency directly
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const params = new URLSearchParams()
        if (dateRange.from) params.append("startDate", dateRange.from.toISOString())
        if (dateRange.to) params.append("endDate", dateRange.to.toISOString())

        const { data } = await axios.get(`${server}/reports/offers?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        // We still sync with redux if needed, but we use data.overallEfficiency here
        setOverallEfficiency(data.overallEfficiency || 0)
        // Redux action might not support overallEfficiency yet, so we use local state for the stat card
      } catch (error) {
        console.error("Dashboard fetch error:", error)
      }
    }
    fetchOffers()
    dispatch(getAllOffers()) // Keep redux in sync for other components
  }, [dispatch, dateRange])

  const filteredOffers = useMemo(() => {
    if (!offers) return []
    return offers.filter((offer: any) => {
      if (!dateRange.from || !dateRange.to) return true
      const offerDate = new Date(offer.createdAt || offer.tarih || new Date())
      return offerDate >= dateRange.from && offerDate <= dateRange.to
    })
  }, [offers, dateRange])

  const stats = useMemo(() => {
    const totalOffers = filteredOffers.length
    const totalCustomers = customers?.length || 0
    const totalProducts = products?.length || 0

    const successStatuses = ['Onaylandı', 'Yönetici Onayladı', 'Müşteri Onayladı', 'Faturalandı', 'Tamamlandı', 'Sevkiyat Halinde', 'Teslim Edildi']
    const approvedOffers = filteredOffers.filter(o => successStatuses.includes(o.status) || o.status?.includes('Onay') || o.status?.includes('Teslim'))
    const rejectedOffers = filteredOffers.filter(o => o.status === 'Reddedildi' || o.status?.includes('Red'))
    const pendingOffers = filteredOffers.filter(o => o.status === 'Gönderildi' || o.status === 'Bekliyor' || o.status === 'Müşteriye Gönderildi' || !o.status)

    const approvedCount = approvedOffers.length
    const rejectedCount = rejectedOffers.length
    const pendingCount = pendingOffers.length

    const totalValue = filteredOffers.reduce((acc: number, curr: any) => acc + (parseFloat(String(curr.urunler?.[0]?.toplamTutar).replace(/[^0-9.-]+/g, "")) || 0), 0)
    const pendingValue = pendingOffers.reduce((acc: number, curr: any) => acc + (parseFloat(String(curr.urunler?.[0]?.toplamTutar).replace(/[^0-9.-]+/g, "")) || 0), 0)
    const rejectedValue = rejectedOffers.reduce((acc: number, curr: any) => acc + (parseFloat(String(curr.urunler?.[0]?.toplamTutar).replace(/[^0-9.-]+/g, "")) || 0), 0)

    const pendingPercentage = totalValue > 0 ? ((pendingValue / totalValue) * 100).toFixed(1) : "0.0"
    const rejectedPercentage = totalValue > 0 ? ((rejectedValue / totalValue) * 100).toFixed(1) : "0.0"

    const efficiencyRate = overallEfficiency

    return {
      totalOffers,
      pendingCount,
      rejectedCount,
      approvedCount,
      pendingPercentage,
      rejectedPercentage,
      efficiencyRate,
      totalCustomers,
      totalProducts,
    }
  }, [filteredOffers, customers, products])

  const recentOffers = useMemo(() => {
    if (!filteredOffers) return []
    return [...filteredOffers]
      .sort((a: any, b: any) => new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime())
      .slice(0, 6)
  }, [filteredOffers])

  const topCustomers = useMemo(() => {
    if (!customers) return []
    return [...customers].slice(0, 4)
  }, [customers])

  const summaries = [
    {
      label: "Oluşturulan Teklifler",
      value: stats.totalOffers.toString(),
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      trend: "Tümü"
    },
    {
      label: "Onay Bekleyenler",
      value: stats.pendingCount.toString(),
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      trend: `%${stats.pendingPercentage} Tutar Payı`
    },
    {
      label: "Reddedilen Teklifler",
      value: stats.rejectedCount.toString(),
      icon: TrendingDown,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      trend: `%${stats.rejectedPercentage} Tutar Payı`
    },
    {
      label: "Verimlilik Oranı",
      value: `%${stats.efficiencyRate}`,
      icon: Target,
      color: stats.efficiencyRate >= 70 ? "text-emerald-500" : stats.efficiencyRate >= 40 ? "text-amber-500" : "text-rose-500",
      bgColor: stats.efficiencyRate >= 70 ? "bg-emerald-50" : stats.efficiencyRate >= 40 ? "bg-amber-50" : "bg-rose-50",
      trend: "Kazanma Oranı"
    },
  ]

  const { hasPermission, isAdmin } = usePermissions()

  const dashboardLevel = useMemo(() => {
    if (isAdmin || hasPermission("Full Dashboard")) return "full"
    if (hasPermission("Limited Dashboard")) return "limited"
    if (hasPermission("Basic Dashboard")) return "basic"
    return "none"
  }, [isAdmin, hasPermission])

  // Stats Grid items
  const displaySummaries = useMemo(() => {
    let baseSummaries: any[] = []
    if (dashboardLevel === "full") baseSummaries = summaries
    else if (dashboardLevel === "limited") baseSummaries = summaries.slice(1, 3)

    if (myCommission?.show) {
      baseSummaries = [
        ...baseSummaries,
        {
          label: "Bekleyen Primim",
          value: `₺ ${myCommission.commissionDebt.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          icon: Coins,
          color: "text-orange-500",
          bgColor: "bg-orange-50",
          trend: `${myCommission.offerCount} Teklif`
        }
      ]
    }
    return baseSummaries
  }, [dashboardLevel, summaries, myCommission])

  if (dashboardLevel === "none" && user?.userType !== 'customer') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-10 mt-6">
        <UserCircle2 className="size-16 text-slate-200" />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800">Hoş Geldiniz, {user?.name}</h2>
          <p className="text-sm text-slate-400 mt-1">Panel kullanım yetkiniz kısıtlıdır. Lütfen yöneticinizle iletişime geçin.</p>
        </div>
      </div>
    )
  }

  // Customer Dashbord View
  if (user?.userType === 'customer') {
    return (
      <div className="flex flex-col gap-6 py-2 font-sans pb-10">
        {/* Welcome Section */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="shadow-2xl shadow-orange-500/20 overflow-hidden rounded-2xl">
              <UserAvatar
                name={user?.name}
                surname={user?.surname}
                picture={user?.picture || user?.profile?.picture}
                size="xl"
                className="size-14 !rounded-2xl"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800  flex items-center gap-3">
                Hoş Geldiniz, {user?.name} 👋
              </h1>
              <p className="text-[11px] text-slate-400 font-normal mt-0.5">Size özel teklifler ve mesajlarınız</p>
            </div>
          </div>


        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/panel/mesajlar" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="size-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="size-6" />
              </div>
              <ArrowRight className="size-5 text-slate-200 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">Mesajlar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Firma yetkilileriyle iletişime geçin ve sorularınızı iletin.</p>
          </Link>

          <Link href="/panel/teklifler/tekliflerim" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="size-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="size-6" />
              </div>
              <ArrowRight className="size-5 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">Tekliflerim</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Size iletilen tüm teklifleri görüntüleyin ve onaylayın.</p>
          </Link>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
              <Ticket className="size-20" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-base font-semibold mb-1">Aktif Teklif Sayısı</h3>
                <p className="text-[11px] text-slate-400 font-normal">Toplam {offers.length} Teklif</p>
              </div>
              <div className="text-3xl font-semibold mt-4">{offers.filter((o: any) => o.status === 'Gönderildi' || o.status === 'Bekliyor').length}</div>
            </div>
          </div>
        </div>

        {/* Recent Offers for Customer */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-semibold text-slate-800 ">Son Gelen Teklifler</h3>
            <Link href="/panel/teklifler/tekliflerim" className="group flex items-center gap-2 text-[11px] font-normal text-orange-500 hover:text-orange-600 transition-all">
              Tüm Teklifleri Gör
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-normal text-slate-300">
                    <th className="px-6 py-4 border-b border-slate-50">Teklif Başlığı</th>
                    <th className="px-4 py-4 border-b border-slate-50 text-center">Durum</th>
                    <th className="px-6 py-4 border-b border-slate-50 text-right">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                          <FileText className="size-8 opacity-20" />
                          <span className="text-xs font-normal font-sans">Henüz teklifiniz bulunmuyor</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    offers.slice(0, 5).map((offer: any) => (
                      <tr
                        key={offer._id}
                        onClick={() => router.push(`/panel/teklifler/tekliflerim/${offer._id}`)}
                        className="group cursor-pointer hover:bg-slate-50/50 transition-all"
                      >
                        <td className="px-6 py-4 border-b border-slate-50">
                          <div className="flex flex-col">
                            <span className="text-[14px] font-semibold text-slate-800  group-hover:text-orange-600 transition-colors">
                              {offer.title || offer.konu || "İsimsiz Teklif"}
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal mt-0.5">
                              {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString('tr-TR') : '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 border-b border-slate-50 text-center">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-normal border shadow-sm",
                            offer.status?.includes('Onay') || offer.status?.includes('Faturalandı') ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                              offer.status?.includes('Red') ? "bg-rose-50 text-rose-600 border-rose-100" :
                                "bg-slate-100 text-slate-500 border-slate-200"
                          )}>
                            <div className={cn("size-1.5 rounded-full",
                              offer.status?.includes('Onay') || offer.status?.includes('Faturalandı') ? "bg-emerald-500" :
                                offer.status?.includes('Red') ? "bg-rose-500" : "bg-slate-400"
                            )} />
                            {offer.status || "Bekliyor"}
                          </div>
                          {offer.satisfactionRating && (
                            <div className="flex items-center gap-1 mt-1 bg-orange-50 px-2 py-1 rounded-lg w-fit border border-orange-100 mx-auto">
                              <Star className="size-3 fill-orange-500 text-orange-500" />
                              <span className="text-[9px] font-semibold text-orange-700">{offer.satisfactionRating}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 border-b border-slate-50 text-right font-semibold text-slate-800">
                          {offer.urunler?.[0]?.toplamTutar
                            ? `${offer.paraBirimi === 'TRY' ? '₺' : offer.paraBirimi} ${parseFloat(offer.urunler[0].toplamTutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                            : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 py-2 font-sans overflow-visible pb-10">
      {/* Simple Welcome Section */}
      <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="shadow-2xl shadow-orange-500/20 overflow-hidden rounded-2xl">
            <UserAvatar
              name={user?.name}
              surname={user?.surname}
              picture={user?.picture || user?.profile?.picture}
              size="xl"
              className="size-14 !rounded-2xl"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800  flex items-center gap-3">
              Merhaba, {user?.name || "Kullanıcı"} 👋
            </h1>
            <p className="text-[11px] text-slate-400 font-normal mt-0.5">İşletmenizin bugünkü özeti ve aktiviteleri</p>
          </div>
        </div>

        {dashboardLevel !== "none" && user?.userType !== 'customer' && (
          <div className="flex items-center gap-3">
            <ReportDateFilters onRangeChange={(range: DateRange) => setDateRange(range)} />
          </div>
        )}
      </div>

      {/* Graphical Stats Grid */}
      {dashboardLevel === "full" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Oluşturulan Teklifler */}
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <div className="size-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <FileText className="size-5" />
              </div>
              <div className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-normal rounded-lg border border-slate-100">
                Tümü
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[11px] font-normal text-slate-400">Oluşturulan Teklifler</p>
              <h3 className="text-3xl font-semibold text-slate-800  mt-1">{stats.totalOffers}</h3>
            </div>
            <div className="h-10 w-full flex items-end gap-1.5 mt-1 relative z-10">
              {/* Abstract Bar Chart */}
              {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-blue-50 rounded-t-md transition-all duration-300 group-hover:bg-blue-400" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Onay Bekleyenler */}
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between gap-4 relative group">
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Clock className="size-5" />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-normal text-slate-400">Müşteri Onayı Bekleyenler</p>
              <h3 className="text-3xl font-semibold text-slate-800  mt-1">{stats.pendingCount}</h3>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between text-[11px] font-normal">
                <span className="text-slate-400">Tutar Payı</span>
                <span className="text-amber-500">%{(stats.pendingPercentage)}</span>
              </div>
              <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${stats.pendingPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Reddedilen */}
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between gap-4 relative group">
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <TrendingDown className="size-5" />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-normal text-slate-400">Reddedilen Teklifler</p>
              <h3 className="text-3xl font-semibold text-slate-800  mt-1">{stats.rejectedCount}</h3>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between text-[11px] font-normal">
                <span className="text-slate-400">Tutar Payı</span>
                <span className="text-rose-500">%{(stats.rejectedPercentage)}</span>
              </div>
              <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full transition-all duration-1000" style={{ width: `${stats.rejectedPercentage}%` }} />
              </div>
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
              <div className={cn("px-2.5 py-1 text-white text-[10px] font-normal rounded-lg border border-white/10 border-solid",
                stats.efficiencyRate >= 70 ? "bg-emerald-500/20 text-emerald-400" : stats.efficiencyRate >= 40 ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400"
              )}>
                Genel Kazanç
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[11px] font-normal text-slate-400">Verimlilik Oranı</p>
              <h3 className="text-3xl font-semibold text-white  mt-1">%{stats.efficiencyRate}</h3>
            </div>
            <div className="flex flex-col gap-2 mt-2 relative z-10">
              <p className="text-[10px] text-slate-400 font-normal text-right mb-1.5">{stats.approvedCount} Onay / {stats.totalOffers} Toplam</p>
              <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 rounded-full relative">
                {/* Visual marker/pointer acting as a slider on the gradient */}
                <div
                  className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] border-2 border-slate-900 transition-all duration-1000 -translate-y-1/2 -ml-1.5"
                  style={{ left: `${stats.efficiencyRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : displaySummaries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {displaySummaries.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      )}

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Offers Section - Only for Full Dashboard */}
        {dashboardLevel === "full" && (
          <div className="xl:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                  <FileText className="size-4" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 ">Son Hazırlanan Teklifler</h3>
              </div>
              <Link href="/panel/teklifler/tekliflerim" className="group flex items-center gap-2 text-[11px] font-normal text-orange-500 hover:text-orange-600 transition-all">
                Tümünü listele
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="text-[11px] font-normal text-slate-300">
                      <th className="px-6 py-4 border-b border-slate-50">Teklif / Müşteri Bilgisi</th>
                      <th className="px-4 py-4 border-b border-slate-50">Durum</th>
                      <th className="px-6 py-4 border-b border-slate-50 text-right">Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOffers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-20 text-center">
                          <div className="flex flex-col items-center gap-2 text-slate-300">
                            <FileText className="size-8 opacity-20" />
                            <span className="text-xs font-normal font-sans">Henüz teklif bulunmuyor</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      recentOffers.map((offer: any) => (
                        <tr
                          key={offer._id}
                          onClick={() => router.push(`/panel/teklifler/tekliflerim/${offer._id}`)}
                          className="group cursor-pointer hover:bg-slate-50/50 transition-all"
                        >
                          <td className="px-6 py-3 border-b border-slate-50">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-semibold text-[10px] border border-slate-100 group-hover:bg-orange-50 group-hover:text-orange-500 group-hover:border-orange-100 transition-all">
                                {offer.musteri?.company?.substring(0, 2).toUpperCase() || "MÜ"}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[13px] font-semibold text-slate-800 truncate  group-hover:text-orange-600 transition-colors">
                                  {offer.title || offer.konu || "İsimsiz Teklif"}
                                </span>
                                <span className="text-[12px] text-slate-400 font-normal mt-0.5">
                                  {offer.musteri?.company || "Bilinmeyen Müşteri"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-b border-slate-50">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-normal border shadow-sm",
                                offer.status?.includes('Onay') || offer.status?.includes('Faturalandı') ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                  offer.status?.includes('Red') ? "bg-rose-50 text-rose-600 border-rose-100" :
                                    "bg-slate-100 text-slate-500 border-slate-200"
                              )}>
                                <div className={cn("size-1.5 rounded-full",
                                  offer.status?.includes('Onay') || offer.status?.includes('Faturalandı') ? "bg-emerald-500" :
                                    offer.status?.includes('Red') ? "bg-rose-500" : "bg-slate-400"
                                )} />
                                {offer.status || "Taslak"}
                              </div>
                              {offer.satisfactionRating && (
                                <div className="flex items-center gap-0.5">
                                  <Star className="size-3 fill-orange-500 text-orange-500" />
                                  <span className="text-[9px] font-semibold text-orange-600">{offer.satisfactionRating}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-3 border-b border-slate-50 text-right">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-semibold text-slate-800">
                                {offer.urunler?.[0]?.toplamTutar
                                  ? `${offer.paraBirimi === 'TRY' ? '₺' : offer.paraBirimi} ${parseFloat(offer.urunler[0].toplamTutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                                  : '-'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal mt-0.5">
                                {offer.tarih ? new Date(offer.tarih).toLocaleDateString('tr-TR') : "-"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions & Top Products Section */}
        <div className="flex flex-col gap-6">
          {/* Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
              <div className="size-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                <Plus className="size-4" strokeWidth={3} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 ">Hızlı İşlemler</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-3">
              <QuickAction
                href="/panel/teklifler/tekliflerim/yeni"
                icon={Plus}
                label="Yeni Teklif Oluştur"
                bgColor="bg-orange-50"
                textColor="text-orange-500"
                hoverBg="hover:bg-white"
              />
              <QuickAction
                href="/panel/musteriler/yeni"
                icon={Users}
                label="Müşteri Kaydı Ekle"
                bgColor="bg-blue-50"
                textColor="text-blue-500"
                hoverBg="hover:bg-white"
              />
            </div>
          </div>

          {/* Simple Revenue Card Placeholder */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="size-32 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-6 border border-white/5">
                <TrendingUp className="size-3 text-emerald-400" />
                <span className="text-[11px] font-normal text-emerald-400">+12% Büyüme</span>
              </div>
              <h4 className="text-[12px] font-normal text-slate-400 mb-2">Aylık Tahmini Gelir</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold">₺ 845.000</span>
                <span className="text-slate-500 text-sm font-medium">/ 1.2M Hedef</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full mt-6 overflow-hidden">
                <div className="w-[70%] h-full bg-orange-500 rounded-full shadow-[0_0_15px_rgba(246,126,6,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Customers & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <div className="size-8 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg">
              <Star className="size-4" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 ">Öne Çıkan Müşteriler</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topCustomers.map((customer: any, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-semibold text-xs border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  {customer.company?.substring(0, 2).toUpperCase() || "MÜ"}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-slate-800 text-[13px] truncate ">{customer.company}</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-normal mt-0.5">
                    <MapPin className="size-3" />
                    {customer.office || "Merkez"}
                  </div>
                </div>
              </div>
            ))}
            {topCustomers.length === 0 && (
              <div className="col-span-2 py-10 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-[11px] font-normal text-slate-300">Henüz müşteri kaydı bulunmuyor</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-orange-50/30 rounded-3xl border border-orange-100/50 p-6 flex flex-col justify-between group">
          <div>
            <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-sm border border-orange-100 mb-6 group-hover:rotate-12 transition-transform">
              <Plus className="size-6" strokeWidth={3} />
            </div>
            <h4 className="text-xl font-semibold text-slate-800  mb-2">Daha fazla iş üretin</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Müşterilerinize profesyonel teklifler sunarak onay oranlarınızı artırın. Sistemdeki otomatik şablonları kullanarak zaman kazanın.
            </p>
          </div>
          <button
            onClick={() => router.push('/panel/teklifler/tekliflerim/yeni')}
            className="mt-8 flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl text-xs font-normal hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            Yeni Teklif Oluştur
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
