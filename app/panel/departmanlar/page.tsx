"use client"

import { Search, Plus, Trash2, X, ArrowRight, ChevronDown, Check, SquarePen, Building2, ShieldCheck, UserCog, ArrowUpDown, RotateCcw } from "lucide-react"
import React, { useState, useEffect, useMemo, useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllDepartments, createDepartment, deleteDepartment, updateDepartment } from "@/redux/actions/departmentActions"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/stat-card"
import { PermissionGuard } from "@/components/permission-guard"
import { usePermissions } from "@/hooks/usePermissions"
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

const AVAILABLE_PERMISSIONS = [
    "Full Dashboard", "Limited Dashboard", "Basic Dashboard",
    "Ürün Görüntüle", "Ürün Ekle", "Ürün Sil",
    "Müşteri Görüntüle", "Müşteri Ekle", "Müşteri Sil",
    "Teklif Görüntüle", "Teklif Oluştur", "Teklif Sil", "Teklifi Faturalandır",
    "Şartlar ve Koşullar",
    "Stok Yönetimi Görüntüle", "Stok Yönetimi Ekle", "Stok Yönetimi Sil",
    "Depo Görüntüle", "Depo Ekle", "Depo Sil",
    "Rapor Görüntüle",
    "Mesajlar", "Konuşmayı Sil", "Mesaj Sil", "Mesaj Düzenle", "Katılımcı Yönetimi",
    "Departman Yönetimi",
    "Personel Yönetimi",
    "Ayarlar: Firma Bilgileri",
    "Ayarlar: Banka Hesapları",
    "Ayarlar: Sistem Ayarları"
];

const MultiSelect = ({ options, selected, onChange, placeholder }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        const newSelected = selected.includes(option)
            ? selected.filter((item: string) => item !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    const toggleAll = () => {
        if (selected.length === options.length) {
            onChange([]);
        } else {
            onChange([...options]);
        }
    };

    const filteredOptions = options.filter((opt: string) =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 font-normal cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all shadow-sm"
            >
                <span className={selected.length === 0 ? "text-slate-400 font-medium" : ""}>
                    {selected.length === 0 ? placeholder : `${selected.length} Yetki Seçildi`}
                </span>
                <ChevronDown className={cn("size-4 text-slate-300 transition-transform", isOpen && "rotate-180")} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[70] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/30 flex flex-col gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Yetki Ara..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white rounded-xl border border-slate-100 py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-orange-200 font-medium"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={toggleAll}
                            className="text-left px-2 py-1 text-[11px] font-normal text-orange-500 hover:text-orange-600 transition-colors w-fit"
                        >
                            {selected.length === options.length ? "Tümünü Kaldır" : "Tümünü Seç"}
                        </button>
                    </div>

                    <div className="max-h-[160px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 no-scrollbar">
                        <div className="grid grid-cols-1 gap-1">
                            {filteredOptions.map((opt: string) => (
                                <div
                                    key={opt}
                                    onClick={() => toggleOption(opt)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border",
                                        selected.includes(opt)
                                            ? "bg-orange-50 border-orange-100 text-orange-600"
                                            : "hover:bg-slate-50 border-transparent text-slate-600"
                                    )}
                                >
                                    <div className={cn(
                                        "size-4 rounded-md border flex items-center justify-center transition-all",
                                        selected.includes(opt)
                                            ? "bg-orange-500 border-orange-500 text-white"
                                            : "border-slate-200 bg-white"
                                    )}>
                                        {selected.includes(opt) && <Check className="size-2.5" strokeWidth={4} />}
                                    </div>
                                    <span className="text-[11px] font-normal">{opt}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};



export default function DepartmentsPage() {
    const dispatch = useAppDispatch()
    const { departments, loading } = useAppSelector((state) => state.department)
    const { hasPermission } = usePermissions()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        permissions: [] as string[],
        isApprover: false
    })
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, id: string | null, name: string | null }>({
        open: false,
        id: null,
        name: null
    })

    const [search, setSearch] = useState("")

    useEffect(() => {
        dispatch(getAllDepartments())
    }, [dispatch])

    const filteredDepartments = useMemo(() => {
        if (!departments) return []
        return departments.filter(d =>
            d.name?.toLowerCase().includes(search.toLowerCase())
        )
    }, [departments, search])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)
        try {
            if (editingId) {
                await dispatch(updateDepartment({ id: editingId, departmentData: formData }))
                toast.success("Departman güncellendi")
            } else {
                await dispatch(createDepartment(formData))
                toast.success("Departman oluşturuldu")
            }
            resetForm()
        } catch (error) {
            toast.error("Bir hata oluştu")
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFormData({ name: "", permissions: [], isApprover: false })
        setEditingId(null)
        setIsModalOpen(false)
    }

    const handleEdit = (d: any) => {
        setEditingId(d._id)
        setFormData({
            name: d.name,
            permissions: d.permissions || [],
            isApprover: d.isApprover || false
        })
        setIsModalOpen(true)
    }

    const handleDelete = async () => {
        if (deleteDialog.id) {
            const res = await dispatch(deleteDepartment(deleteDialog.id))
            if (deleteDepartment.fulfilled.match(res)) {
                toast.success("Departman başarıyla silindi")
            } else {
                toast.error("Departman silinirken bir hata oluştu")
            }
            setDeleteDialog({ open: false, id: null, name: null })
        }
    }

    const summaries = useMemo(() => ([
        {
            label: "Toplam Departman",
            value: (departments || []).length.toString(),
            icon: Building2,
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            trend: "Sistem"
        },
        {
            label: "Yetkili Modül",
            value: `${AVAILABLE_PERMISSIONS.length} / ${AVAILABLE_PERMISSIONS.length}`,
            icon: ShieldCheck,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50",
            trend: "Aktif"
        },
        {
            label: "Yönetici Sayısı",
            value: (departments || []).filter(d => d.isApprover).length.toString(),
            icon: UserCog,
            color: "text-orange-500",
            bgColor: "bg-orange-50",
            trend: "Onaycı"
        }
    ]), [departments])

    return (
        <PermissionGuard permission="Departman Yönetimi">
            <div className="flex flex-col gap-6 font-sans">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {summaries.map((s) => (
                        <StatCard key={s.label} {...s} />
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
                            <div className="relative flex-1 max-w-sm">
                                <input
                                    type="text"
                                    placeholder="Departman Ara.."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-slate-100 py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 placeholder:text-slate-400 bg-slate-50/50"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                    <Search className="size-3" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-[#F67E06] px-5 py-2.5 text-[12px] font-normal text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <Plus className="size-3" strokeWidth={4} />
                            <span>Yeni Departman</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            </div>
                        ) : (
                            <table className="w-full text-left border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-[11px] font-normal text-slate-300">
                                        <th className="px-6 pb-2">
                                            <div className="flex items-center gap-1.5">
                                                Departman Adı <ArrowUpDown className="size-2.5" />
                                            </div>
                                        </th>
                                        <th className="px-4 pb-2">Tanımlı Yetkiler</th>
                                        <th className="px-4 pb-2 text-center">Yönetici Modu</th>
                                        <th className="px-4 pb-2 text-right pr-8">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[12px]">
                                    {filteredDepartments.map((d) => (
                                        <tr key={d._id} className="group bg-white hover:bg-slate-50 transition-all duration-200">
                                            <td className="px-6 py-4 font-normal text-slate-800 rounded-l-2xl border-y border-l border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:border-orange-100">
                                                <div className="flex flex-col">
                                                    <span>{d.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium font-sans mt-0.5  italic">
                                                        {d.permissions?.length || 0} Aktif Yetki Seti
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100">
                                                {d.permissions && d.permissions.length > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[11px] font-normal border border-emerald-100 group-hover:bg-emerald-100 transition-all">
                                                            {d.permissions.length} Modül Aktif
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-medium">/ {AVAILABLE_PERMISSIONS.length} Toplam</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300 font-medium italic">Yetki tanımlanmamış</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100 text-center">
                                                {d.isApprover ? (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 text-[11px] font-normal">
                                                        <ShieldCheck className="size-3" />
                                                        YÖNETİCİ
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] text-slate-300 font-normal">STANDART</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right rounded-r-2xl border-y border-r border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] pr-8 group-hover:border-orange-100">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleEdit(d)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    >
                                                        <SquarePen className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteDialog({ open: true, id: d._id, name: d.name })}
                                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredDepartments.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Building2 className="size-8 text-slate-200" />
                                                    <span>Departman bulunamadı.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                        <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
                            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/50 rounded-t-[2.5rem]">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800">{editingId ? "Departmanı Düzenle" : "Yeni Departman Oluştur"}</h2>
                                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">Rol ve Yetkilendirme Tanımı</p>
                                </div>
                                <button onClick={resetForm} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all">
                                    <X className="size-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="flex flex-col gap-6 font-sans">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-normal text-slate-400 px-1">Departman Adı</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-normal text-slate-400 px-1">Yetki Seti Seçimi</label>
                                        <MultiSelect
                                            options={AVAILABLE_PERMISSIONS}
                                            selected={formData.permissions}
                                            onChange={(newPermissions: string[]) => setFormData(prev => ({ ...prev, permissions: newPermissions }))}
                                            placeholder="Uygulama Yetkilerini Seçin"
                                        />
                                    </div>

                                    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
                                        <label className="flex items-center gap-3 group cursor-pointer">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={formData.isApprover}
                                                    onChange={() => setFormData(prev => ({ ...prev, isApprover: !prev.isApprover }))}
                                                />
                                                <div className={cn(
                                                    "h-5 w-10 rounded-full transition-all duration-300 relative",
                                                    formData.isApprover ? "bg-orange-500" : "bg-slate-200"
                                                )}>
                                                    <div className={cn(
                                                        "absolute top-[3px] left-[3px] size-3.5 bg-white rounded-full shadow-sm transition-all duration-300",
                                                        formData.isApprover ? "translate-x-5" : "translate-x-0"
                                                    )} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-normal text-slate-700">Onay İstenen Yönetici Modu</span>
                                                <span className="text-[10px] text-slate-400 font-medium">Bu departmandaki kullanıcılar teklif aşamalarında son onay merci olabilir.</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 mt-10">
                                    <button
                                        type="button"
                                        onClick={resetForm}
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
                                        {editingId ? "Güncelle" : "Kaydet ve Oluştur"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, id: null, name: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Departmanı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="font-normal text-slate-900">{deleteDialog.name}</span> departmanını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
