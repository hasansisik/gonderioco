"use client"

import { cn } from "@/lib/utils"
import { Search, Plus, Trash2, SquarePen, Users, UserCheck, UserMinus, Download, ArrowUpDown, FolderPlus } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllCustomers, deleteCustomer, updateCustomer } from "@/redux/actions/customerActions"
import { getPendingCustomerRequests } from "@/redux/actions/companyActions"
import { getFolders, getConversations } from "@/redux/actions/messageActions"
import { useRouter } from "next/navigation"
import * as XLSX from 'xlsx'
import { StatCard } from "@/components/stat-card"
import { PermissionGuard } from "@/components/permission-guard"
import { usePermissions } from "@/hooks/usePermissions"
import { toast } from "sonner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { CustomerFolderList } from "@/components/customers/CustomerFolderList"
import { CustomerFolderModal } from "@/components/customers/CustomerFolderModal"
import { CustomerRequestsList } from "@/components/customers/CustomerRequestsList"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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

export default function CustomersPage() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { customers, loading } = useAppSelector((state) => state.customer)
    const { customerFolders } = useAppSelector((state) => state.message)
    const { user } = useAppSelector((state) => state.user)
    const { hasPermission } = usePermissions()
    const canAddCustomer = hasPermission("Müşteri Ekle")
    const canDeleteCustomer = hasPermission("Müşteri Sil")
    const canManageCustomers = hasPermission("Müşteri Düzenle")

    // Klasör özelliği artık tüm kullanıcılar için aktif
    const canUseFolders = true;
    const [search, setSearch] = useState("")
    const [showInactive, setShowInactive] = useState(true)
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
    const [folderModalOpen, setFolderModalOpen] = useState(false)
    const [editingFolder, setEditingFolder] = useState<any>(null)
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, id: string | null, name: string | null }>({
        open: false,
        id: null,
        name: null
    })
    const [pendingRequests, setPendingRequests] = useState<any[]>([])
    const [requestsLoading, setRequestsLoading] = useState(false)

    const fetchRequests = async () => {
        setRequestsLoading(true)
        const result = await dispatch(getPendingCustomerRequests())
        if (getPendingCustomerRequests.fulfilled.match(result)) {
            setPendingRequests(result.payload)
        }
        setRequestsLoading(false)
    }

    useEffect(() => {
        dispatch(getAllCustomers())
        dispatch(getFolders("customer"))
        fetchRequests()
    }, [dispatch])

    const filteredCustomers = useMemo(() => {
        if (!customers) return []
        let filtered = customers.filter(c =>
            (c.company?.toLowerCase().includes(search.toLowerCase()) ||
                c.person?.toLowerCase().includes(search.toLowerCase())) &&
            (showInactive || c.status === 'Aktif')
        )

        if (selectedFolderId) {
            const folder = customerFolders.find(f => f._id === selectedFolderId)
            if (folder) {
                filtered = filtered.filter(c => folder.items.includes(c._id))
            }
        }

        return filtered
    }, [customers, search, showInactive, selectedFolderId, customerFolders])

    const activeCount = useMemo(() => (customers || []).filter(c => c.status === 'Aktif').length, [customers])
    const inactiveCount = useMemo(() => (customers || []).filter(c => c.status === 'Pasif').length, [customers])

    const summaries = [
        {
            label: "Toplam Müşteri",
            value: (customers || []).length.toString(),
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            trend: "Genel"
        },
        {
            label: "Aktif Müşteri",
            value: activeCount.toString(),
            icon: UserCheck,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50",
            trend: "Aktif"
        },
        {
            label: "Pasif Müşteri",
            value: inactiveCount.toString(),
            icon: UserMinus,
            color: "text-rose-500",
            bgColor: "bg-rose-50",
            trend: "Pasif"
        }
    ]

    const handleDelete = async () => {
        if (deleteDialog.id) {
            const res = await dispatch(deleteCustomer(deleteDialog.id))
            if (deleteCustomer.fulfilled.match(res)) {
                toast.success("Müşteri başarıyla silindi")
                // Refresh folders and conversations to update counts
                dispatch(getFolders("customer"))
                dispatch(getConversations())
            } else {
                toast.error("Müşteri silinirken bir hata oluştu")
            }
            setDeleteDialog({ open: false, id: null, name: null })
        }
    }

    const handleExportExcel = () => {
        if (!customers || customers.length === 0) return;

        const dataToExport = customers.map(c => ({
            "Firma Adı": c.company || "-",
            "Telefon": c.phone || "-",
            "E-Posta": c.email || "-",
            "Web Sitesi": c.website || "-",
            "Vergi Numarası": c.taxNumber || "-",
            "Vergi Dairesi": c.taxOffice || "-",
            "Şehir": c.city || "-",
            "İlçe": c.district || "-",
            "Ülke": c.country || "-",
            "Adres": c.address || "-",
            "Durum": c.status || "-",
            "Kayıt Tarihi": c.createdAt ? new Date(c.createdAt).toLocaleString('tr-TR') : "-"
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Müşteriler");
        XLSX.writeFile(workbook, `Musteri_Listesi_${new Date().toLocaleDateString('tr-TR')}.xlsx`);
    };

    return (
        <PermissionGuard permission="Müşteri Görüntüle">
            <div className="flex flex-col gap-6">
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
                                    placeholder="Müşteri Ara (Firma, Yetkili).."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-slate-100 py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 placeholder:text-slate-400 bg-slate-50/50"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                    <Search className="size-3" />
                                </div>
                            </div>

                            <button
                                onClick={handleExportExcel}
                                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-[11px] font-normal text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <Download className="size-3 text-emerald-500" strokeWidth={3} />
                                <span>Excel'e Aktar</span>
                            </button>

                            <button
                                onClick={() => setShowInactive(!showInactive)}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[11px] font-normal transition-all shadow-sm",
                                    showInactive ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                                )}
                            >
                                {showInactive ? <UserCheck className="size-3" /> : <UserMinus className="size-3" />}
                                <span>{showInactive ? "Pasifleri Gizle" : "Pasifleri Göster"}</span>
                            </button>

                            {canUseFolders && (
                                <button
                                    onClick={() => {
                                        setEditingFolder(null);
                                        setFolderModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-[11px] font-normal text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                                    title="Klasör Ekle"
                                >
                                    <FolderPlus className="size-3.5 text-blue-500" strokeWidth={3} />
                                    <span>Grup oluştur</span>
                                </button>
                            )}
                        </div>

                        {pendingRequests.length > 0 && (
                            <div className="flex items-center gap-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="relative flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/50 px-4 py-2.5 text-[12px] font-normal text-orange-600 hover:bg-orange-50 transition-all shadow-sm">
                                            <Users className="size-3.5" />
                                            <span>Bekleyen Başvurular</span>
                                            <span className="absolute -top-1.5 -right-1.5 size-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-[10px] font-semibold border-2 border-white animate-bounce-subtle">
                                                {pendingRequests.length}
                                            </span>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[350px] p-5 rounded-[2rem] border-slate-100 shadow-2xl" align="end">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                                                <h4 className="text-[12px] font-normal text-slate-400">Yeni Başvurular</h4>
                                                <span className="bg-orange-100 text-orange-600 text-[10px] font-semibold px-2 py-0.5 rounded-lg">{pendingRequests.length}</span>
                                            </div>
                                            <CustomerRequestsList
                                                requests={pendingRequests}
                                                onUpdate={() => {
                                                    fetchRequests();
                                                    dispatch(getAllCustomers());
                                                }}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}

                        {canAddCustomer && (
                            <div className="flex items-center gap-3">
                                <Link href="/panel/musteriler/yeni">
                                    <button className="flex items-center gap-2 rounded-xl bg-[#F67E06] px-5 py-2.5 text-[12px] font-normal text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all">
                                        <Plus className="size-3" strokeWidth={4} />
                                        <span>Yeni Müşteri</span>
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {canUseFolders && (
                        <CustomerFolderList
                            folders={customerFolders}
                            activeFolderId={selectedFolderId}
                            onSelectFolder={setSelectedFolderId}
                            onEditFolder={(folder) => {
                                setEditingFolder(folder);
                                setFolderModalOpen(true);
                            }}
                        />
                    )}

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
                                                Müşteri Bilgisi <ArrowUpDown className="size-2.5" />
                                            </div>
                                        </th>
                                        <th className="px-4 pb-2">İletişim</th>
                                        <th className="px-4 pb-2">Konum</th>
                                        <th className="px-4 pb-2 text-center">Durum</th>
                                        <th className="px-4 pb-2 text-right pr-8">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[12px]">
                                    {filteredCustomers.map((c) => (
                                        <tr key={c._id} className="group bg-white hover:bg-slate-50 transition-all duration-200">
                                            <td className="px-6 py-4 font-normal text-slate-800 rounded-l-2xl border-y border-l border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:border-orange-100">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar
                                                        name={c.person ? c.person.split(' ')[0] : (c.company || '').split(' ')[0]}
                                                        surname={c.person ? c.person.split(' ').slice(1).join(' ') : (c.company || '').split(' ').slice(1).join(' ')}
                                                        picture={c.picture || c.logo || c.userAccount?.profile?.picture}
                                                        size="md"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-[13px]">{c.company || c.person}</span>
                                                        {c.company && c.person && (
                                                            <span className="text-[11px] text-orange-600 font-normal">{c.person}</span>
                                                        )}
                                                        <span className="text-[10px] text-slate-400 font-medium font-sans mt-0.5">{c.taxNumber || "Vergi No Yok"}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-slate-700 font-normal">{c.phone}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">{c.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-slate-500 font-medium border-y border-slate-100 group-hover:border-orange-100 italic">
                                                {c.city ? `${c.city}, ${c.country}` : "-"}
                                            </td>
                                            <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => {
                                                            if (canManageCustomers) {
                                                                const newStatus = c.status === 'Aktif' ? 'Pasif' : 'Aktif';
                                                                dispatch(updateCustomer({
                                                                    id: c._id,
                                                                    customerData: { status: newStatus }
                                                                }));
                                                            } else {
                                                                toast.error("Müşteri durumunu değiştirme yetkiniz yok.");
                                                            }
                                                        }}
                                                        className={cn(
                                                            "relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 focus:outline-none shadow-sm",
                                                            c.status === 'Aktif' ? "bg-emerald-500 shadow-emerald-500/20" : "bg-slate-200 shadow-slate-200/20"
                                                        )}
                                                    >
                                                        <span
                                                            className={cn(
                                                                "inline-block size-4 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                                                c.status === 'Aktif' ? "translate-x-[18px]" : "translate-x-[2px]"
                                                            )}
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right rounded-r-2xl border-y border-r border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] pr-8 group-hover:border-orange-100">
                                                <div className="flex items-center justify-end gap-1">
                                                    {canManageCustomers && (
                                                        <Link href={`/panel/musteriler/${c._id}`}>
                                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                                <SquarePen className="size-3.5" />
                                                            </button>
                                                        </Link>
                                                    )}
                                                    {canDeleteCustomer && (
                                                        <button
                                                            onClick={() => setDeleteDialog({ open: true, id: c._id, name: c.company })}
                                                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCustomers.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Users className="size-8 text-slate-200" />
                                                    <span>Müşteri bulunamadı.</span>
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
                        <AlertDialogTitle>Müşteriyi Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="font-normal text-slate-900">{deleteDialog.name}</span> firmasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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

            {canUseFolders && (
                <CustomerFolderModal
                    isOpen={folderModalOpen}
                    onClose={() => {
                        setFolderModalOpen(false);
                        setEditingFolder(null);
                    }}
                    editingFolder={editingFolder}
                />
            )}
        </PermissionGuard>
    )
}
