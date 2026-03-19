"use client"

import { cn } from "@/lib/utils"
import { Search, Plus, Trash2, SquarePen, Users, UserCheck, UserMinus, User } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllStaff, deleteStaff, updateStaff } from "@/redux/actions/staffActions"
import { getFolders, getConversations } from "@/redux/actions/messageActions"
import { useRouter } from "next/navigation"
import { StatCard } from "@/components/stat-card"
import { PermissionGuard } from "@/components/permission-guard"
import { usePermissions } from "@/hooks/usePermissions"
import { UserAvatar } from "@/components/ui/user-avatar"
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

export default function PersonnelPage() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { staffList, loading } = useAppSelector((state) => state.staff)
    const { hasPermission } = usePermissions()
    const canManageStaff = hasPermission("Personel Yönetimi")

    const [search, setSearch] = useState("")
    const [showInactive, setShowInactive] = useState(true)
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, id: string | null, name: string | null }>({
        open: false,
        id: null,
        name: null
    })

    const STAFF_LIMIT = 100;
    const currentStaffCount = staffList?.length || 0;

    const formatPhoneNumber = (value: string) => {
        if (!value) return "-";
        const numbers = value.replace(/\D/g, '');
        if (numbers.length < 10) return value;
        const truncated = numbers.length > 10 ? numbers.substring(numbers.length - 11) : numbers;
        if (truncated.length === 10) {
            return `0 (${truncated.slice(0, 3)}) ${truncated.slice(3, 6)} ${truncated.slice(6, 8)} ${truncated.slice(8, 10)}`;
        }
        return `${truncated[0]} (${truncated.slice(1, 4)}) ${truncated.slice(4, 7)} ${truncated.slice(7, 9)} ${truncated.slice(9, 11)}`;
    };

    useEffect(() => {
        dispatch(getAllStaff())
    }, [dispatch])

    const filteredStaff = useMemo(() => {
        if (!staffList) return []
        return staffList.filter(s =>
            (s.name?.toLowerCase().includes(search.toLowerCase()) ||
                s.surname?.toLowerCase().includes(search.toLowerCase()) ||
                s.email?.toLowerCase().includes(search.toLowerCase())) &&
            (showInactive || s.status === 'Aktif')
        )
    }, [staffList, search, showInactive])

    const activeCount = useMemo(() => (staffList || []).filter(s => s.status === 'Aktif').length, [staffList])
    const inactiveCount = useMemo(() => (staffList || []).filter(s => s.status === 'Pasif').length, [staffList])

    const summaries = [
        {
            label: "Toplam Personel",
            value: currentStaffCount.toString(),
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            trend: `${activeCount}/${STAFF_LIMIT}`
        },
        {
            label: "Aktif Personel",
            value: activeCount.toString(),
            icon: UserCheck,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50",
            trend: "Aktif"
        },
        {
            label: "Pasif Personel",
            value: inactiveCount.toString(),
            icon: UserMinus,
            color: "text-rose-500",
            bgColor: "bg-rose-50",
            trend: "Ayrılan"
        }
    ]

    const handleDelete = async () => {
        if (deleteDialog.id) {
            const res = await dispatch(deleteStaff(deleteDialog.id))
            if (deleteStaff.fulfilled.match(res)) {
                toast.success("Personel başarıyla silindi")
                // Refresh folders and conversations
                dispatch(getFolders("message"))
                dispatch(getConversations())
            } else {
                toast.error("Personel silinirken bir hata oluştu")
            }
            setDeleteDialog({ open: false, id: null, name: null })
        }
    }

    const handleStatusUpdate = async (staff: any) => {
        const currentStatus = staff.status === 'Aktif' ? 'Aktif' : 'Pasif';
        const newStatus = currentStatus === 'Aktif' ? 'Pasif' : 'Aktif';
        try {
            await dispatch(updateStaff({
                id: staff._id,
                staffData: {
                    ...staff,
                    status: newStatus,
                    department: staff.department?._id || staff.department,
                    phoneNumber: staff.profile?.phoneNumber || staff.phoneNumber
                }
            })).unwrap();
        } catch (err) {
            console.error("Status update failed:", err);
        }
    }

    return (
        <PermissionGuard permission="Personel Yönetimi">
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {summaries.map((s) => (
                        <StatCard key={s.label} {...s} />
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                        <div className="relative w-full md:max-w-sm">
                            <input
                                type="text"
                                placeholder="Personel Ara.."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-100 py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 placeholder:text-slate-400 bg-slate-50/50"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                <Search className="size-3" />
                            </div>
                        </div>

                        {canManageStaff && (
                            <button
                                onClick={() => router.push('/panel/personel/yeni')}
                                className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#F67E06] px-5 py-2.5 text-[12px] font-normal text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <Plus className="size-3" strokeWidth={4} />
                                <span>Yeni Personel</span>
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={!showInactive}
                                        onChange={() => setShowInactive(!showInactive)}
                                    />
                                    <div className={cn(
                                        "h-5 w-5 rounded-md border transition-all",
                                        !showInactive ? "border-orange-500 bg-orange-500" : "border-slate-300 bg-white"
                                    )}>
                                        {!showInactive && <div className="absolute inset-1 rounded-full border border-white bg-white" />}
                                    </div>
                                </div>
                                <span className="text-[11px] font-normal text-slate-500 group-hover:text-slate-700">Aktif Olmayanları Gizle</span>
                            </label>

                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[11px] font-normal text-emerald-700">Limit: {activeCount}/{STAFF_LIMIT}</span>
                            </div>
                        </div>
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
                                        <th className="px-6 pb-2 whitespace-nowrap">Personel Bilgisi</th>
                                        <th className="px-4 pb-2 whitespace-nowrap">İletişim</th>
                                        <th className="px-4 pb-2 whitespace-nowrap">Departman / Rol</th>
                                        <th className="px-4 pb-2 text-right pr-8 whitespace-nowrap">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[12px]">
                                    {filteredStaff.map((s) => (
                                        <tr
                                            key={s._id}
                                            className="group bg-white hover:bg-slate-50 transition-all duration-200"
                                        >
                                            <td className="px-6 py-4 font-normal text-slate-800 rounded-l-2xl border-y border-l border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:border-orange-100 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar
                                                        name={s.name}
                                                        surname={s.surname}
                                                        picture={s.profile?.picture}
                                                        size="md"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span>{s.name} {s.surname}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium font-sans mt-0.5 ">{s.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-slate-600 font-normal border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span>{formatPhoneNumber(s.profile?.phoneNumber || s.phoneNumber)}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium font-sans mt-0.5">Telefon</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">
                                                <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-[11px] font-normal border border-slate-100 group-hover:border-orange-100 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all">
                                                    {s.department?.name || '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right rounded-r-2xl border-y border-r border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] pr-8 group-hover:border-orange-100">
                                                <div className="flex items-center justify-end gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <label className="relative inline-flex items-center cursor-pointer group/switch p-1">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={s.status === 'Aktif'}
                                                                onChange={() => handleStatusUpdate(s)}
                                                            />
                                                            <div className="w-8 h-4 bg-slate-100 rounded-full peer peer-focus:outline-none peer-checked:bg-emerald-500/10 transition-all duration-300 relative border border-slate-200 peer-checked:border-emerald-500/30">
                                                                <div className={cn(
                                                                    "absolute top-[2px] left-[2px] w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm",
                                                                    s.status === 'Aktif'
                                                                        ? "translate-x-3.5 bg-emerald-500 shadow-emerald-500/20"
                                                                        : "translate-x-0 bg-slate-300"
                                                                )}></div>
                                                            </div>
                                                        </label>
                                                        <span className={cn(
                                                            "text-[10px] font-normal w-8 text-left",
                                                            s.status === "Aktif" ? "text-emerald-500" : "text-slate-400"
                                                        )}>
                                                            {s.status === "Aktif" ? "Aktif" : "Pasif"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => router.push(`/panel/personel/${s._id}`)}
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        >
                                                            <SquarePen className="size-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteDialog({ open: true, id: s._id, name: `${s.name} ${s.surname}` })}
                                                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStaff.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Users className="size-8 text-slate-200" />
                                                    <span>Personel bulunamadı.</span>
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
                        <AlertDialogTitle>Personeli Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="font-normal text-slate-900">{deleteDialog.name}</span> isimli personeli silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
