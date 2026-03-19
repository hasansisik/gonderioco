"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import {
    getCommissionData,
    getPaymentHistory,
    updateStaffCommission,
    payCommission,
    updateCommissionSettings
} from "@/redux/actions/commissionActions"
import { StatCard } from "@/components/stat-card"
import {
    Coins,
    Users,
    History,
    CreditCard,
    Search,
    Calendar,
    User,
    Save,
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
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

export default function CommissionPage() {
    const dispatch = useAppDispatch()
    const { staff, history, loading, message, error } = useAppSelector((state) => state.commission)
    const { settings } = useAppSelector((state) => state.settings)

    const [activeTab, setActiveTab] = useState<"current" | "history">("current")
    const [search, setSearch] = useState("")
    const [payDialog, setPayDialog] = useState<{ open: boolean, id: string | null, name: string | null, amount: number }>({
        open: false,
        id: null,
        name: null,
        amount: 0
    })
    const [optimisticShowToStaff, setOptimisticShowToStaff] = useState<boolean | null>(null)

    useEffect(() => {
        dispatch(getCommissionData())
        dispatch(getPaymentHistory())
    }, [dispatch])

    useEffect(() => {
        if (message) {
            toast.success(message)
            // dispatch(clearMessage()) // Should clear here
        }
        if (error) {
            toast.error(error)
            // dispatch(clearError())
        }
    }, [message, error])

    const [localStates, setLocalStates] = useState<Record<string, { rate: string, includeKDV: boolean, isChanged: boolean }>>({})

    useEffect(() => {
        if (staff.length > 0) {
            const initialStates: Record<string, any> = {}
            staff.forEach(s => {
                initialStates[s._id] = {
                    rate: (s.commissionRate || 0).toString(),
                    includeKDV: s.commissionIncludeKDV || false,
                    isChanged: false
                }
            })
            setLocalStates(initialStates)
        }
    }, [staff])

    const handleToggleShowToStaff = async (checked: boolean) => {
        setOptimisticShowToStaff(checked)
        const result = await dispatch(updateCommissionSettings({ showCommissionToStaff: checked }))
        if (!updateCommissionSettings.fulfilled.match(result)) {
            setOptimisticShowToStaff(!checked)
            toast.error("Ayar güncellenirken bir hata oluştu.")
        }
    }

    const handleLocalRateChange = (id: string, value: string) => {
        // Allow only numbers and dot/comma
        const sanitized = value.replace(/[^0-9.,]/g, "").replace(",", ".")
        setLocalStates(prev => ({
            ...prev,
            [id]: { ...prev[id], rate: sanitized, isChanged: true }
        }))
    }

    const handleLocalKDVToggle = (id: string, includeKDV: boolean) => {
        setLocalStates(prev => ({
            ...prev,
            [id]: { ...prev[id], includeKDV, isChanged: true }
        }))
    }

    const handleSaveRow = async (id: string) => {
        const state = localStates[id]
        if (state) {
            await dispatch(updateStaffCommission({
                id,
                commissionRate: parseFloat(state.rate) || 0,
                commissionIncludeKDV: state.includeKDV
            }))
            setLocalStates(prev => ({
                ...prev,
                [id]: { ...prev[id], isChanged: false }
            }))
        }
    }

    const handlePay = async () => {
        if (payDialog.id) {
            await dispatch(payCommission({ id: payDialog.id }))
            setPayDialog({ open: false, id: null, name: null, amount: 0 })
            dispatch(getCommissionData()) // Refresh
        }
    }

    const filteredStaff = staff.filter(s =>
        `${s.name} ${s.surname}`.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    )

    const totalDebt = staff.reduce((acc, s) => acc + (s.commissionDebt || 0), 0)
    const totalSales = staff.reduce((acc, s) => acc + (s.totalSalesInclVAT || 0), 0)

    const summaries = [
        {
            label: "Toplam Ödenecek Prim",
            value: totalDebt.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }),
            icon: Coins,
            color: "text-orange-500",
            bgColor: "bg-orange-50",
            trend: "Borç"
        },
        {
            label: "Toplam Satış (KDV Dahil)",
            value: totalSales.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }),
            icon: CreditCard,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50",
            trend: "Tümü"
        },
        {
            label: "Personel Sayısı",
            value: staff.length.toString(),
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            trend: "Aktif"
        }
    ]

    return (
        <div className="flex flex-col gap-6">
            {/* Header section with summaries and global toggle */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <p className="text-slate-400 text-sm font-medium">Personel primlerini yönetin ve ödemeleri takip edin.</p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-slate-400">Personele prim göster</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={optimisticShowToStaff !== null ? optimisticShowToStaff : (settings?.enabledModules?.showCommissionToStaff || false)}
                            onChange={(e) => handleToggleShowToStaff(e.target.checked)}
                        />
                        <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summaries.map((s) => (
                    <StatCard key={s.label} {...s} />
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="flex items-center border-b border-slate-50">
                    <button
                        onClick={() => setActiveTab("current")}
                        className={cn(
                            "flex items-center gap-2 px-8 py-5 text-sm font-medium transition-all relative",
                            activeTab === "current" ? "text-orange-500 bg-orange-50/30" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <Users className="size-4" />
                        <span>Güncel Primler</span>
                        {activeTab === "current" && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={cn(
                            "flex items-center gap-2 px-8 py-5 text-sm font-medium transition-all relative",
                            activeTab === "history" ? "text-orange-500 bg-orange-50/30" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <History className="size-4" />
                        <span>Ödeme Geçmişi</span>
                        {activeTab === "history" && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full" />}
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === "current" ? (
                        <div className="flex flex-col gap-6">
                            <div className="relative max-w-md">
                                <input
                                    type="text"
                                    placeholder="Personel Ara.."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-slate-100 py-3 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 placeholder:text-slate-300 bg-slate-50/50"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                    <Search className="size-4" />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-separate border-spacing-y-3">
                                    <thead>
                                        <tr className="text-[11px] font-medium text-slate-300">
                                            <th className="px-6 pb-2">Personel</th>
                                            <th className="px-4 pb-2">Prim Oranı (%)</th>
                                            <th className="px-4 pb-2">KDV Durumu</th>
                                            <th className="px-4 pb-2">Toplam Satış</th>
                                            <th className="px-4 pb-2 text-orange-500">Prim Borcu</th>
                                            <th className="px-4 pb-2 text-right pr-6">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[12px]">
                                        {filteredStaff.map((s) => (
                                            <tr key={s._id} className="group bg-white hover:bg-slate-50 transition-all duration-200">
                                                <td className="px-6 py-4 font-medium text-slate-800 rounded-l-2xl border-y border-l border-slate-100 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <UserAvatar
                                                            name={s.name}
                                                            surname={s.surname}
                                                            picture={s.profile?.picture}
                                                            size="md"
                                                        />
                                                        <div className="flex flex-col">
                                                            <span>{s.name} {s.surname}</span>
                                                            <span className="text-[10px] text-slate-400 font-medium font-sans mt-0.5">{s.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border-y border-slate-100">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={localStates[s._id]?.rate || s.commissionRate || "0"}
                                                            onChange={(e) => handleLocalRateChange(s._id, e.target.value)}
                                                            className="w-16 px-2 py-1.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                                                        />
                                                        <span className="text-slate-400">%</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border-y border-slate-100">
                                                    <div className="flex items-center gap-3 bg-slate-50/50 p-1 rounded-xl border border-slate-100 w-fit">
                                                        <button
                                                            onClick={() => handleLocalKDVToggle(s._id, false)}
                                                            className={cn(
                                                                "px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all",
                                                                !(localStates[s._id]?.includeKDV ?? s.commissionIncludeKDV) ? "bg-white text-orange-500 shadow-sm" : "text-slate-400"
                                                            )}
                                                        >
                                                            KDV Hariç
                                                        </button>
                                                        <button
                                                            onClick={() => handleLocalKDVToggle(s._id, true)}
                                                            className={cn(
                                                                "px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all",
                                                                (localStates[s._id]?.includeKDV ?? s.commissionIncludeKDV) ? "bg-white text-orange-500 shadow-sm" : "text-slate-400"
                                                            )}
                                                        >
                                                            KDV Dahil
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border-y border-slate-100">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-700">
                                                            {(s.commissionIncludeKDV ? s.totalSalesInclVAT : s.totalSalesExclVAT).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400 font-medium">
                                                            {s.offerCount} Onaylı Teklif
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border-y border-slate-100">
                                                    <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl border border-orange-100/50 w-fit font-medium text-[13px]">
                                                        {(s.commissionDebt || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right rounded-r-2xl border-y border-r border-slate-100 pr-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {localStates[s._id]?.isChanged && (
                                                            <button
                                                                onClick={() => handleSaveRow(s._id)}
                                                                className="px-4 py-2 rounded-xl text-[11px] font-medium transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                                                            >
                                                                <Save className="size-3" />
                                                                Kaydet
                                                            </button>
                                                        )}
                                                        <button
                                                            disabled={!(s.commissionDebt > 0)}
                                                            onClick={() => setPayDialog({ open: true, id: s._id, name: `${s.name} ${s.surname}`, amount: s.commissionDebt })}
                                                            className={cn(
                                                                "px-4 py-2 rounded-xl text-[11px] font-medium transition-all",
                                                                s.commissionDebt > 0
                                                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95"
                                                                    : "bg-slate-50 text-slate-300 pointer-events-none"
                                                            )}
                                                        >
                                                            Ödeme Yapıldı
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-separate border-spacing-y-3">
                                    <thead>
                                        <tr className="text-[11px] font-medium text-slate-300">
                                            <th className="px-6 pb-2">Personel</th>
                                            <th className="px-4 pb-2">Ödeme Tarihi</th>
                                            <th className="px-4 pb-2">Tutar</th>
                                            <th className="px-4 pb-2">Not</th>
                                            <th className="px-4 pb-2 text-right pr-6">Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[12px]">
                                        {history.map((h) => (
                                            <tr key={h._id} className="group bg-white hover:bg-slate-50 transition-all duration-200">
                                                <td className="px-6 py-4 font-medium text-slate-800 rounded-l-2xl border-y border-l border-slate-100 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                                            <User className="size-4" />
                                                        </div>
                                                        <span>{h.staff?.name} {h.staff?.surname}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border-y border-slate-100 text-slate-500 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="size-3 text-slate-300" />
                                                        {new Date(h.paidAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border-y border-slate-100">
                                                    <span className="font-medium text-slate-800">
                                                        {h.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 border-y border-slate-100 text-slate-400 font-medium italic">
                                                    {h.notes || '-'}
                                                </td>
                                                <td className="px-4 py-4 text-right rounded-r-2xl border-y border-r border-slate-100 pr-6">
                                                    <div className="flex items-center justify-end gap-2 text-emerald-500 font-medium text-[11px]">
                                                        <CheckCircle2 className="size-3" />
                                                        Ödendi
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {history.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-20 text-center text-slate-300 font-medium">
                                                    Henüz bir ödeme kaydı bulunmuyor.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={payDialog.open} onOpenChange={(open) => !open && setPayDialog({ ...payDialog, open: false })}>
                <AlertDialogContent className="rounded-[2rem]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-medium text-slate-800">Ödemeyi Onayla</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            <span className="font-medium text-slate-900">{payDialog.name}</span> isimli personelin <span className="font-medium text-orange-500">{payDialog.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span> tutarındaki prim borcunun ödendiğini onaylıyor musunuz?
                            <br /><br />
                            Bu işlem borcu sıfırlayacak ve geçmiş ödemelere kaydedecektir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl border-slate-100 text-[12px] font-medium">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handlePay}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[12px] font-medium"
                        >
                            Ödemeyi Onayla
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
