"use client"

import { cn } from "@/lib/utils"
import { Search, Plus, Trash2, SquarePen, Package, Inbox, AlertTriangle, TrendingUp, ArrowUpDown } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllProducts, deleteProduct } from "@/redux/actions/productActions"
import { useRouter } from "next/navigation"
import { StatCard } from "@/components/stat-card"
import { usePermissions } from "@/hooks/usePermissions"
import { PermissionGuard } from "@/components/permission-guard"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ProductsPage() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { products, loading } = useAppSelector((state) => state.product)
    const { hasPermission } = usePermissions()

    const canAddProduct = hasPermission("Ürün Ekle")
    const canDeleteProduct = hasPermission("Ürün Sil")

    const [search, setSearch] = useState("")
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, id: string | null, name: string | null }>({
        open: false,
        id: null,
        name: null
    })

    useEffect(() => {
        dispatch(getAllProducts())
    }, [dispatch])

    const filteredProducts = useMemo(() => {
        if (!products) return []
        return products.filter(p =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.stockCode?.toLowerCase().includes(search.toLowerCase()) ||
            p.brand?.toLowerCase().includes(search.toLowerCase())
        )
    }, [products, search])

    const stats = useMemo(() => {
        const total = (products || []).length
        const totalStock = (products || []).reduce((acc: number, curr: any) => acc + (Number(curr.stockAmount) || 0), 0)
        const lowStock = (products || []).filter((p: any) => (Number(p.stockAmount) || 0) < 10 && (Number(p.stockAmount) || 0) > 0).length
        const outOfStock = (products || []).filter((p: any) => (Number(p.stockAmount) || 0) <= 0).length

        return [
            { label: "Toplam Ürün", value: total.toString(), icon: Package, color: "text-blue-500", bgColor: "bg-blue-50", trend: "Çeşit" },
            { label: "Toplam Stok", value: totalStock.toLocaleString('tr-TR'), icon: Inbox, color: "text-emerald-500", bgColor: "bg-emerald-50", trend: "Adet" },
            { label: "Kritik Stok", value: lowStock.toString(), icon: AlertTriangle, color: "text-orange-500", bgColor: "bg-orange-50", trend: "< 10" },
            { label: "Stokta Yok", value: outOfStock.toString(), icon: TrendingUp, color: "text-rose-500", bgColor: "bg-rose-50", trend: "Biten" },
        ]
    }, [products])

    const handleDelete = async () => {
        if (deleteDialog.id) {
            const res = await dispatch(deleteProduct(deleteDialog.id))
            if (deleteProduct.fulfilled.match(res)) {
                toast.success("Ürün başarıyla silindi")
            } else {
                toast.error("Ürün silinirken bir hata oluştu")
            }
            setDeleteDialog({ open: false, id: null, name: null })
        }
    }

    return (
        <PermissionGuard permission="Ürün Görüntüle">
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s) => (
                        <StatCard key={s.label} {...s} />
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                        <div className="relative w-full md:max-w-sm">
                            <input
                                type="text"
                                placeholder="Ürün Ara.."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-100 py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 placeholder:text-slate-400 bg-slate-50/50"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                <Search className="size-3" />
                            </div>
                        </div>

                        {canAddProduct && (
                            <button
                                onClick={() => router.push('/panel/urunler/yeni')}
                                className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#F67E06] px-5 py-2.5 text-[12px] font-normal text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <Plus className="size-3" strokeWidth={4} />
                                <span>Yeni Ürün</span>
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            </div>
                        ) : (
                            <table className="w-full text-left border-separate border-spacing-y-2">
                                <thead className="bg-slate-50/50">
                                    <tr className="text-[11px] font-normal text-slate-400">
                                        <th className="px-4 py-4 first:rounded-l-2xl">Depo</th>
                                        <th className="px-4 py-4">Stok</th>
                                        <th className="px-4 py-4">Ürün Adı</th>
                                        <th className="px-4 py-4">Açıklama</th>
                                        <th className="px-4 py-4 text-right">Alış</th>
                                        <th className="px-4 py-4 text-right">Satış</th>
                                        <th className="px-4 py-4 text-center">KDV</th>
                                        <th className="px-4 py-4 text-right">Kar</th>
                                        <th className="px-4 py-4 text-center">Birim</th>
                                        <th className="px-4 py-4">Marka</th>
                                        <th className="px-4 py-4">Stok Kodu</th>
                                        <th className="px-4 py-4 text-right pr-6 last:rounded-r-2xl">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px] font-medium">
                                    {filteredProducts.map((p) => (
                                        <tr key={p._id} className="group bg-white hover:bg-slate-50/50 transition-all duration-200">
                                            <td className="px-4 py-4 text-slate-500 font-normal border-y border-l border-slate-100 first:rounded-l-2xl">
                                                <div className="flex items-center gap-2">
                                                    <div className="size-6 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                                                        <Inbox className="size-3" />
                                                    </div>
                                                    {typeof p.warehouse === 'object' ? p.warehouse?.name : (p.warehouse || "-")}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-y border-slate-100">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-lg font-semibold text-[10px]",
                                                    (Number(p.stockAmount) || 0) <= 0 ? "bg-rose-50 text-rose-500" :
                                                        (Number(p.stockAmount) || 0) < 10 ? "bg-orange-50 text-orange-500" : "bg-emerald-50 text-emerald-500"
                                                )}>
                                                    {p.stockAmount || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 font-semibold text-slate-800 border-y border-slate-100 max-w-[200px] truncate">
                                                {p.name}
                                            </td>
                                            <td className="px-4 py-4 text-slate-400 border-y border-slate-100 max-w-[150px] truncate">
                                                {p.description || "-"}
                                            </td>
                                            <td className="px-4 py-4 text-right font-normal text-slate-600 border-y border-slate-100">
                                                {p.purchasePrice ? `${Number(p.purchasePrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${p.currency || 'TL'}` : "-"}
                                            </td>
                                            <td className="px-4 py-4 text-right font-semibold text-slate-900 border-y border-slate-100">
                                                {p.priceVatExcl ? `${Number(p.priceVatExcl).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${p.currency || 'TL'}` : "-"}
                                            </td>
                                            <td className="px-4 py-4 text-center border-y border-slate-100">
                                                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[9px] font-semibold">%{p.vatRate || 0}</span>
                                            </td>
                                            <td className="px-4 py-4 text-right border-y border-slate-100">
                                                <span className={cn(
                                                    "font-semibold text-[10px]",
                                                    Number(p.profit) >= 0 ? "text-emerald-500" : "text-rose-500"
                                                )}>
                                                    {Number(p.profit) >= 0 ? "+" : ""}{Number(p.profit || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center border-y border-slate-100">
                                                <span className="text-slate-400 font-normal text-[11px]">{p.unit || "-"}</span>
                                            </td>
                                            <td className="px-4 py-4 text-slate-600 border-y border-slate-100">
                                                {p.brand || "-"}
                                            </td>
                                            <td className="px-4 py-4 text-slate-400 font-mono text-[10px] border-y border-slate-100">
                                                {p.stockCode || "-"}
                                            </td>
                                            <td className="px-4 py-4 text-right rounded-r-2xl border-y border-r border-slate-100 pr-6">
                                                <div className="flex items-center justify-end gap-1">
                                                    {canAddProduct && (
                                                        <Link href={`/panel/urunler/${p._id}`}>
                                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                                <SquarePen className="size-3.5" />
                                                            </button>
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            if (canDeleteProduct) {
                                                                setDeleteDialog({ open: true, id: p._id, name: p.name })
                                                            } else {
                                                                toast.error("Ürün silme yetkiniz bulunmamaktadır.")
                                                            }
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={12} className="py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Package className="size-8 text-slate-200" />
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

            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, id: null, name: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ürünü Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="font-normal text-slate-900">{deleteDialog.name}</span> ürününü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-rose-500 hover:bg-rose-600">
                            Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PermissionGuard>
    )
}
