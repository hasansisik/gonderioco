"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllTemplates, deleteTemplate } from "@/redux/actions/templateActions"
import { Plus, Search, FileText, Trash2, ArrowRight, SquarePen, Layout, Calendar, Clock, ArrowUpDown } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { cn } from "@/lib/utils"
import { PermissionGuard } from "@/components/permission-guard"
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
import { toast } from "sonner"

export default function TemplatePage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { templates, loading } = useAppSelector((state) => state.template)
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, id: string | null, name: string | null }>({
        open: false,
        id: null,
        name: null
    })

    useEffect(() => {
        dispatch(getAllTemplates())
    }, [dispatch])

    const filteredTemplates = useMemo(() => {
        if (!templates) return []
        return templates.filter((template) =>
            template.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [templates, searchTerm])

    const stats = useMemo(() => {
        const total = (templates || []).length
        const lastMonth = (templates || []).filter(t => {
            const date = new Date(t.createdAt)
            const now = new Date()
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        }).length

        return [
            { label: "Toplam Şablon", value: total.toString(), icon: Layout, color: "text-blue-500", bgColor: "bg-blue-50", trend: "Birim" },
            { label: "Bu Ay Eklenen", value: lastMonth.toString(), icon: Plus, color: "text-emerald-500", bgColor: "bg-emerald-50", trend: "Yeni" },
            { label: "Aktif Kullanım", value: total.toString(), icon: FileText, color: "text-orange-500", bgColor: "bg-orange-50", trend: "Hazır" },
            { label: "Sistem Durumu", value: "Stabil", icon: Clock, color: "text-rose-500", bgColor: "bg-rose-50", trend: "Güncel" },
        ]
    }, [templates])

    const handleDelete = async () => {
        if (deleteDialog.id) {
            const res = await dispatch(deleteTemplate(deleteDialog.id))
            if (deleteTemplate.fulfilled.match(res)) {
                toast.success("Şablon başarıyla silindi")
            } else {
                toast.error("Şablon silinirken bir hata oluştu")
            }
            setDeleteDialog({ open: false, id: null, name: null })
        }
    }

    return (
        <PermissionGuard permission="Teklif Görüntüle">
            <div className="flex flex-col gap-6 relative font-semibold">
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
                                placeholder="Şablon Ara.."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-slate-100 py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 placeholder:text-slate-400 bg-slate-50/50"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                <Search className="size-3" />
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/panel/teklifler/teklif-sablonu/yeni")}
                            className="flex items-center gap-2 rounded-xl bg-[#F67E06] px-5 py-2.5 text-[12px] font-normal text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <Plus className="size-3" strokeWidth={4} />
                            <span>Yeni Şablon Oluştur</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        {loading && templates.length === 0 ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            </div>
                        ) : (
                            <table className="w-full text-left border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-[11px] font-normal text-slate-400">
                                        <th className="px-6 pb-2">
                                            <div className="flex items-center gap-1.5">
                                                Şablon Bilgisi <ArrowUpDown className="size-2.5" />
                                            </div>
                                        </th>
                                        <th className="px-4 pb-2">Oluşturulma Tarihi</th>
                                        <th className="px-4 pb-2 text-right pr-12">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[12px]">
                                    {filteredTemplates.map((template) => (
                                        <tr key={template._id} className="group bg-white hover:bg-slate-50 transition-all duration-200">
                                            <td className="px-6 py-4 font-normal text-slate-800 rounded-l-2xl border-y border-l border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:border-orange-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-orange-50 group-hover:text-orange-500 group-hover:border-orange-100 transition-all">
                                                        <Layout className="size-5" />
                                                    </div>
                                                    <span>{template.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar className="size-3.5" />
                                                    <span className="font-medium">
                                                        {new Date(template.createdAt).toLocaleDateString('tr-TR', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right rounded-r-2xl border-y border-r border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] pr-8 group-hover:border-orange-100">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => router.push(`/panel/teklifler/teklif-sablonu/${template._id}`)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    >
                                                        <SquarePen className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteDialog({ open: true, id: template._id, name: template.name })}
                                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTemplates.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={3} className="py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Layout className="size-8 text-slate-200" />
                                                    <span>Şablon bulunamadı.</span>
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
                        <AlertDialogTitle>Şablonu Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="font-normal text-slate-900">{deleteDialog.name}</span> şablonunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
