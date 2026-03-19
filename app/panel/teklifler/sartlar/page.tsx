"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllTerms, deleteTerm } from "@/redux/actions/termActions"
import { Plus, Search, FileText, Trash2, ArrowRight, SquarePen, Gavel, Calendar, Clock, ArrowUpDown } from "lucide-react"
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

export default function TermsPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { terms, loading } = useAppSelector((state) => state.term)
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, id: string | null, name: string | null }>({
        open: false,
        id: null,
        name: null
    })

    useEffect(() => {
        dispatch(getAllTerms())
    }, [dispatch])

    const filteredTerms = useMemo(() => {
        if (!terms) return []
        return terms.filter((term) =>
            term.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [terms, searchTerm])


    const handleDelete = async () => {
        if (deleteDialog.id) {
            const res = await dispatch(deleteTerm(deleteDialog.id))
            if (deleteTerm.fulfilled.match(res)) {
                toast.success("Şart başarıyla silindi")
                dispatch(getAllTerms())
            } else {
                toast.error("Şart silinirken bir hata oluştu")
            }
            setDeleteDialog({ open: false, id: null, name: null })
        }
    }

    return (
        <PermissionGuard permission="Şartlar ve Koşullar">
            <div className="flex flex-col gap-6 font-sans">

                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                        <div className="relative flex-1 max-w-sm">
                            <input
                                type="text"
                                placeholder="Şart veya Koşul Ara.."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-slate-100 py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 placeholder:text-slate-400 bg-slate-50/50"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                <Search className="size-3" />
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/panel/teklifler/sartlar/yeni")}
                            className="flex items-center gap-2 rounded-xl bg-[#F67E06] px-5 py-2.5 text-[12px] font-normal text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <Plus className="size-3" strokeWidth={4} />
                            <span>Yeni Şart Ekle</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        {loading && terms.length === 0 ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            </div>
                        ) : (
                            <table className="w-full text-left border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-[11px] font-normal text-slate-400">
                                        <th className="px-6 pb-2">
                                            <div className="flex items-center gap-1.5">
                                                Şart Bilgisi <ArrowUpDown className="size-2.5" />
                                            </div>
                                        </th>
                                        <th className="px-4 pb-2">Oluşturulma Tarihi</th>
                                        <th className="px-4 pb-2 text-right pr-12">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[12px]">
                                    {filteredTerms.map((term) => (
                                        <tr key={term._id} className="group bg-white hover:bg-slate-50 transition-all duration-200">
                                            <td className="px-6 py-4 font-normal text-slate-800 rounded-l-2xl border-y border-l border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:border-orange-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-orange-50 group-hover:text-orange-500 group-hover:border-orange-100 transition-all">
                                                        <Gavel className="size-5" />
                                                    </div>
                                                    <span>{term.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar className="size-3.5" />
                                                    <span className="font-medium">
                                                        {new Date(term.createdAt).toLocaleDateString('tr-TR', {
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
                                                        onClick={() => router.push(`/panel/teklifler/sartlar/${term._id}`)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    >
                                                        <SquarePen className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteDialog({ open: true, id: term._id, name: term.name })}
                                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTerms.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={3} className="py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Gavel className="size-8 text-slate-200" />
                                                    <span>Şart bulunamadı.</span>
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
                        <AlertDialogTitle>Şartı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="font-normal text-slate-900">{deleteDialog.name}</span> şartını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
