"use client"

import { Search, Plus, Home, Trash2, X, ArrowRight, SquarePen, Warehouse, MapPin, Notebook, ArrowUpDown, RotateCcw } from "lucide-react"
import React, { useState, useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllWarehouses, createWarehouse, deleteWarehouse, updateWarehouse } from "@/redux/actions/warehouseActions"
import { cn } from "@/lib/utils"
import { usePermissions } from "@/hooks/usePermissions"
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

export default function WarehousesPage() {
    const dispatch = useAppDispatch()
    const { hasPermission } = usePermissions()
    const canManageWarehouses = hasPermission("Depo Yönetimi")
    const { warehouses, loading } = useAppSelector((state) => state.warehouse)
    const [search, setSearch] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, id: string | null, name: string | null }>({
        open: false,
        id: null,
        name: null
    })
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        address: "",
        city: "",
        district: "",
        zipCode: "",
        note: ""
    })

    useEffect(() => {
        dispatch(getAllWarehouses())
    }, [dispatch])

    const filteredWarehouses = useMemo(() => {
        if (!warehouses) return []
        return warehouses.filter(w =>
            w.name?.toLowerCase().includes(search.toLowerCase()) ||
            w.code?.toLowerCase().includes(search.toLowerCase())
        )
    }, [warehouses, search])


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleEdit = (warehouse: any) => {
        setEditingId(warehouse._id)
        setFormData({
            code: warehouse.code || "",
            name: warehouse.name || "",
            address: warehouse.address || "",
            city: warehouse.city || "",
            district: warehouse.district || "",
            zipCode: warehouse.zipCode || "",
            note: warehouse.note || ""
        })
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
        setFormData({
            code: "",
            name: "",
            address: "",
            city: "",
            district: "",
            zipCode: "",
            note: ""
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)
        try {
            if (editingId) {
                await dispatch(updateWarehouse({ id: editingId, warehouseData: formData }))
                toast.success("Depo başarıyla güncellendi")
            } else {
                await dispatch(createWarehouse(formData))
                toast.success("Depo başarıyla oluşturuldu")
            }
            handleCloseModal()
        } catch (error) {
            toast.error("Bir hata oluştu")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (deleteDialog.id) {
            const res = await dispatch(deleteWarehouse(deleteDialog.id))
            if (deleteWarehouse.fulfilled.match(res)) {
                toast.success("Depo başarıyla silindi")
            } else {
                toast.error("Depo silinirken bir hata oluştu")
            }
            setDeleteDialog({ open: false, id: null, name: null })
        }
    }

    return (
        <div className="flex flex-col gap-6 relative">

            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="relative w-full md:max-w-sm">
                        <input
                            type="text"
                            placeholder="Depo Ara.."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-100 py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 placeholder:text-slate-400 bg-slate-50/50"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                            <Search className="size-3" />
                        </div>
                    </div>

                    {canManageWarehouses && (
                        <button
                            onClick={() => {
                                setEditingId(null);
                                setFormData({ code: "", name: "", address: "", city: "", district: "", zipCode: "", note: "" });
                                setIsModalOpen(true);
                            }}
                            className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#F67E06] px-5 py-2.5 text-[12px] font-normal text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <Plus className="size-3" strokeWidth={4} />
                            <span>Yeni Depo</span>
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {loading && warehouses.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-[11px] font-normal text-slate-400">
                                    <th className="px-6 pb-2 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            Depo Bilgisi <ArrowUpDown className="size-2.5" />
                                        </div>
                                    </th>
                                    <th className="px-4 pb-2 whitespace-nowrap">Konum / Adres</th>
                                    <th className="px-4 pb-2 whitespace-nowrap">Not/Açıklama</th>
                                    <th className="px-4 pb-2 text-right pr-8 whitespace-nowrap">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="text-[12px]">
                                {filteredWarehouses.map((w) => (
                                    <tr key={w._id} className="group bg-white hover:bg-slate-50 transition-all duration-200">
                                        <td className="px-6 py-4 font-normal text-slate-800 rounded-l-2xl border-y border-l border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:border-orange-100 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-orange-50 group-hover:text-orange-500 group-hover:border-orange-100 transition-all">
                                                    <Warehouse className="size-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span>{w.name}</span>
                                                    <span className="text-[11px] text-slate-400 font-normal">KOD: {w.code || "-"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-slate-600 font-normal">{w.city} / {w.district}</span>
                                                <span className="text-slate-400 text-[11px] line-clamp-1">{w.address || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-500 font-medium border-y border-slate-100 group-hover:border-orange-100 italic whitespace-nowrap">{w.note || "-"}</td>
                                        <td className="px-4 py-4 text-right rounded-r-2xl border-y border-r border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] pr-8 group-hover:border-orange-100 whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleEdit(w)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <SquarePen className="size-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteDialog({ open: true, id: w._id, name: w.name })}
                                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredWarehouses.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <Warehouse className="size-8 text-slate-200" />
                                                <span>Depo bulunamadı.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal - Depo Ekle/Düzenle */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">{editingId ? 'Depoyu Düzenle' : 'Yeni Depo Oluştur'}</h2>
                                <p className="text-[11px] text-slate-400 font-normal mt-0.5">Depo Tanımlama Formu</p>
                            </div>
                            <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all">
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-normal text-slate-400 px-1">Depo Kodu</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-sans"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-normal text-slate-400 px-1">Depo Adı</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-sans"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <label className="text-[11px] font-normal text-slate-400 px-1">Adres</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-sans"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-normal text-slate-400 px-1">Şehir</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-sans"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-normal text-slate-400 px-1">İlçe</label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-sans"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <label className="text-[11px] font-normal text-slate-400 px-1">Not/Açıklama</label>
                                    <textarea
                                        name="note"
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all resize-none font-sans"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-10">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-2.5 rounded-xl bg-slate-50 text-slate-400 text-xs font-normal hover:bg-slate-100 transition-all border border-slate-100"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-normal hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting && <RotateCcw className="size-3 animate-spin" />}
                                    {editingId ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, id: null, name: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Depoyu Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="font-normal text-slate-900">{deleteDialog.name}</span> deposunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
        </div>
    )
}
