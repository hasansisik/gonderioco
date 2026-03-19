"use client"

import { cn } from "@/lib/utils"
import { Search, Layers, AlertCircle, CheckCircle2, AlertTriangle, ArrowUpDown, Package, ShieldAlert, BadgeInfo } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllProducts } from "@/redux/actions/productActions"
import { StatCard } from "@/components/stat-card"

export default function StockManagementPage() {
    const dispatch = useAppDispatch()
    const { products, loading } = useAppSelector((state) => state.product)
    const [search, setSearch] = useState("")

    useEffect(() => {
        dispatch(getAllProducts())
    }, [dispatch])

    const filteredProducts = useMemo(() => {
        if (!products) return []
        return products.filter(p =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.stockCode?.toLowerCase().includes(search.toLowerCase())
        )
    }, [products, search])

    const stats = useMemo(() => {
        const totalProducts = (products || []).length
        const totalStock = (products || []).reduce((acc: number, curr: any) => acc + (Number(curr.stockAmount) || 0), 0)
        const lowStock = (products || []).filter((p: any) => (Number(p.stockAmount) || 0) < (Number(p.criticalStockAmount) || 10)).length
        const criticalItems = (products || []).filter((p: any) => (Number(p.stockAmount) || 0) <= 0).length

        return [
            { label: "Toplam Çeşit", value: totalProducts.toString(), icon: Package, color: "text-blue-500", bgColor: "bg-blue-50", trend: "Ürün" },
            { label: "Toplam Stok", value: totalStock.toLocaleString('tr-TR'), icon: Layers, color: "text-emerald-500", bgColor: "bg-emerald-50", trend: "Adet" },
            { label: "Kritik Seviye", value: lowStock.toString(), icon: ShieldAlert, color: "text-orange-500", bgColor: "bg-orange-50", trend: "Uyarı" },
            { label: "Stokta Yok", value: criticalItems.toString(), icon: BadgeInfo, color: "text-rose-500", bgColor: "bg-rose-50", trend: "Biten" },
        ]
    }, [products])

    const getStatusInfo = (stock: number, critical: number) => {
        if (stock <= 0) {
            return {
                label: "Tükendi",
                color: "text-rose-500 bg-rose-50 border-rose-100",
                icon: <AlertCircle className="size-3" />
            }
        }
        if (stock < critical) {
            return {
                label: "Kritik Altı",
                color: "text-rose-500 bg-rose-50 border-rose-100",
                icon: <AlertCircle className="size-3" />
            }
        }
        if (stock <= critical + 10) {
            return {
                label: "Sınırda",
                color: "text-amber-500 bg-amber-50 border-amber-100",
                icon: <AlertTriangle className="size-3" />
            }
        }
        return {
            label: "Yeterli",
            color: "text-emerald-500 bg-emerald-50 border-emerald-100",
            icon: <CheckCircle2 className="size-3" />
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <StatCard key={s.label} {...s} />
                ))}
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="relative flex-1 max-w-sm">
                        <input
                            type="text"
                            placeholder="Stok Ara (Ad, Kod).."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-100 py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 placeholder:text-slate-400 bg-slate-50/50"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                            <Search className="size-3" />
                        </div>
                    </div>
                    <div className="text-[12px] font-normal text-slate-400 px-4">Stok Durumu Listesi</div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-[11px] font-normal text-slate-400">
                                    <th className="px-6 pb-2">
                                        <div className="flex items-center gap-1.5">
                                            Ürün Bilgisi <ArrowUpDown className="size-2.5" />
                                        </div>
                                    </th>
                                    <th className="px-4 pb-2">Stok Kodu</th>
                                    <th className="px-4 pb-2 text-center">Mevcut Stok</th>
                                    <th className="px-4 pb-2 text-center">Kritik Seviye</th>
                                    <th className="px-4 pb-2 text-center pr-8">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="text-[12px]">
                                {filteredProducts.map((p: any) => {
                                    const stockAmount = Number(p.stockAmount) || 0;
                                    const criticalLevel = Number(p.criticalStockAmount) || 0;
                                    const status = getStatusInfo(stockAmount, criticalLevel);

                                    return (
                                        <tr key={p._id} className="group bg-white hover:bg-slate-50 transition-all duration-200">
                                            <td className="px-6 py-4 font-normal text-slate-800 rounded-l-2xl border-y border-l border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:border-orange-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-orange-50 group-hover:text-orange-500 group-hover:border-orange-100 transition-all">
                                                        <Layers className="size-5" />
                                                    </div>
                                                    <span>{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-slate-500 font-medium border-y border-slate-100 group-hover:border-orange-100">{p.stockCode || "-"}</td>
                                            <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100 text-center">
                                                <span className="font-normal text-slate-700">{stockAmount} {p.unit}</span>
                                            </td>
                                            <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100 text-center">
                                                <span className="text-slate-400 font-normal italic">{criticalLevel} {p.unit}</span>
                                            </td>
                                            <td className="px-4 py-4 text-right rounded-r-2xl border-y border-r border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] pr-8 group-hover:border-orange-100">
                                                <div className="flex justify-center">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-normal border transition-all shadow-sm",
                                                        status.color
                                                    )}>
                                                        {status.icon}
                                                        {status.label}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {filteredProducts.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <Layers className="size-8 text-slate-200" />
                                                <span>Ürün bulunamadı.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}
