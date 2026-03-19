"use client"

import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { server } from "@/config"
import { Package, Download, Database, Warehouse, AlertTriangle, Box, Layers, TrendingUp } from "lucide-react"
import * as XLSX from "xlsx"
import { cn } from "@/lib/utils"
import { ReportDateFilters, type DateRange } from "@/components/report-date-filters"
import { startOfMonth, endOfDay } from "date-fns"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    ComposedChart,
    Line,
} from "recharts"

export default function ProductReportPage() {
    const [data, setData] = useState<any>({ products: [], stocks: [], warehouses: [] })
    const [loading, setLoading] = useState(true)
    const [isMounted, setIsMounted] = useState(false)
    const [dateRange, setDateRange] = useState<DateRange>({
        from: startOfMonth(new Date()),
        to: endOfDay(new Date()),
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("accessToken")
                const params = new URLSearchParams()
                if (dateRange.from) params.append("startDate", dateRange.from.toISOString())
                if (dateRange.to) params.append("endDate", dateRange.to.toISOString())

                const { data } = await axios.get(`${server}/reports/products?${params.toString()}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setData(data)
            } catch (error) {
                console.error("Error fetching product reports:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [dateRange])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const stockLevelsData = useMemo(() => {
        return data.products.slice(0, 8).map((p: any) => {
            const prodStocks = data.stocks.filter((s: any) => s.product === p._id);
            const total = prodStocks.reduce((a: number, b: any) => a + (b.quantity || 0), 0);
            return {
                name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
                stock: total,
                critical: p.criticalStockAmount || 0
            }
        })
    }, [data])

    const brandData = useMemo(() => {
        const counts: any = {}
        data.products.forEach((p: any) => {
            const brand = p.brand || "Belirsiz"
            counts[brand] = (counts[brand] || 0) + 1
        })
        return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }, [data])

    const warehouseDistribution = useMemo(() => {
        return data.warehouses.map((w: any) => {
            const wStocks = data.stocks.filter((s: any) => s.warehouse?.toString() === w._id.toString())
            return {
                name: w.name,
                value: wStocks.reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0)
            }
        })
    }, [data])

    const stats = useMemo(() => {
        const totalStock = data.stocks.reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0)
        const criticalStocks = data.products.filter((p: any) => {
            const total = data.stocks
                .filter((s: any) => s.product === p._id)
                .reduce((a: number, b: any) => a + (b.quantity || 0), 0)
            return total <= (p.criticalStockAmount || 0)
        }).length

        return {
            totalProducts: data.products.length,
            totalStock,
            criticalStocks,
            warehouseCount: data.warehouses.length
        }
    }, [data])

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    if (!isMounted) return null;

    return (
        <div className="flex flex-col gap-6 py-4 font-sans relative">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-[100] flex items-center justify-center rounded-[3rem]">
                    <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                        <div className="size-4 bg-blue-500 rounded-full animate-bounce" />
                        <span className="text-xs font-normal text-slate-800">Stok Verileri Güncelleniyor...</span>
                    </div>
                </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Database className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-800 ">Stok & Envanter Analizi</h1>
                        <p className="text-[11px] text-slate-400 font-normal mt-0.5">Stok akışı ve depo bazlı dökümler</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <ReportDateFilters onRangeChange={(range) => setDateRange(range)} initialRange={dateRange} />
                    <div className="bg-white px-3 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
                        <Warehouse className="size-3.5 text-slate-300" />
                        <span className="text-[10px] font-semibold text-slate-800 ">{stats.warehouseCount} Aktif Depo</span>
                    </div>
                </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-blue-600 p-6 rounded-[2.25rem] text-white flex flex-col justify-between relative overflow-hidden group shadow-lg shadow-blue-500/10">
                    <div className="absolute top-0 right-0 p-4 opacity-5 scale-150 rotate-12">
                        <Box className="size-20" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-normal text-blue-200">Toplam Ürün</p>
                        <h3 className="text-3xl font-semibold mt-1">{stats.totalProducts}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2.25rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-normal text-slate-400 mb-2">Toplam Stok</p>
                        <h3 className="text-3xl font-semibold text-slate-800">{stats.totalStock.toLocaleString()}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-normal text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
                        <TrendingUp className="size-3" />
                        %8.4+
                    </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-[2.25rem] border border-orange-100 flex flex-col justify-between relative">
                    <div className="size-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm mb-3">
                        <AlertTriangle className="size-4.5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-normal text-orange-600">Kritik Stok</p>
                        <h3 className="text-3xl font-semibold text-orange-600 mt-0.5">{stats.criticalStocks}</h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stock Levels Bar Chart */}
                <div className="bg-white p-6 rounded-[2.25rem] border border-slate-100 shadow-sm">
                    <h3 className="text-md font-semibold text-slate-800  mb-6">Ürün Bazlı Stok Durumları</h3>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart layout="vertical" data={stockLevelsData}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f8fafc" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} width={80} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="stock" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={16} />
                                <Line type="monotone" dataKey="critical" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Warehouse Distribution */}
                    <div className="bg-white p-6 rounded-[2.25rem] border border-slate-100 shadow-sm flex-1">
                        <h3 className="text-md font-semibold text-slate-800  mb-4">Depo Dağılımı</h3>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={warehouseDistribution}
                                        innerRadius={45}
                                        outerRadius={65}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {warehouseDistribution.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: 9, fontWeight: 700 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Brand Mix */}
                    <div className="bg-white p-6 rounded-[2.25rem] border border-slate-100 shadow-sm flex-1">
                        <h3 className="text-md font-semibold text-slate-800  mb-4">Marka Dağılımı</h3>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={brandData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
