"use client"

import { cn } from "@/lib/utils"
import { Search, Plus, ArrowRight, Trash2, SquarePen, Eye, FileText, CheckCircle2, Clock, XCircle, User, Download, ArrowUpDown, Star, CheckCheck, HelpCircle, Send, History } from "lucide-react"
import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllOffers, deleteOffer, updateOffer, approveOfferCustomer, rejectOfferCustomer, requestRevisionOffer, completeOffer, rateOffer, addOfferQuestion, markOfferQuestionsRead, approveOfferManager, rejectOfferManager } from "@/redux/actions/offerActions"
import { getAllStaff } from "@/redux/actions/staffActions"
import { useRouter } from "next/navigation"
import { SelectModal } from "@/components/ui/select-modal"
import { StatCard } from "@/components/stat-card"
import { PermissionGuard } from "@/components/permission-guard"
import { usePermissions } from "@/hooks/usePermissions"
import { toast } from "sonner"
import { RotateCcw, X } from "lucide-react"
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
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { QuestionChatModal } from "@/components/question-chat-modal"
import { OfferHistoryModal } from "@/components/offer-history-modal"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function TekliflerimPage() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { offers, loading } = useAppSelector((state) => state.offer)
    const { staffList } = useAppSelector((state) => state.staff)
    const { hasPermission, isCustomer, isProvider, isAdmin, isApprover, user } = usePermissions()
    const canCreateOffer = hasPermission("Teklif Oluştur") && !isCustomer
    const canDeleteOffer = hasPermission("Teklif Sil") && !isCustomer
    const canViewOffers = isCustomer || hasPermission("Teklif Görüntüle")

    const [search, setSearch] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [selectedPersonnel, setSelectedPersonnel] = useState("all")

    // Dialog States
    const [actionDialog, setActionDialog] = useState<{
        type: 'approve' | 'reject' | 'revision' | 'delete' | 'complete' | 'managerApprove' | 'managerReject' | null,
        id: string | null,
        name?: string
    }>({ type: null, id: null })
    const [rejectionReason, setRejectionReason] = useState("")
    const [otherReason, setOtherReason] = useState("")
    const [revisionNote, setRevisionNote] = useState("")
    const [showRatingDialog, setShowRatingDialog] = useState(false)
    const [rating, setRating] = useState(0)
    const [completedOfferCompany, setCompletedOfferCompany] = useState<{ name: string, logo?: string, initials?: string } | null>(null)
    const [isRevisionPreviewOpen, setIsRevisionPreviewOpen] = useState(false)
    const [isRejectionPreviewOpen, setIsRejectionPreviewOpen] = useState(false)
    const [previewRevisionNote, setPreviewRevisionNote] = useState("")
    const [previewRejectionNote, setPreviewRejectionNote] = useState("")
    const [ratingOfferId, setRatingOfferId] = useState<string | null>(null)

    // Question/Chat States
    const [questionOfferId, setQuestionOfferId] = useState<string | null>(null)
    const [questionText, setQuestionText] = useState("")
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)

    const questionOffer = useMemo(() => {
        if (!questionOfferId || !offers) return null
        return (offers as any[]).find(o => o._id === questionOfferId)
    }, [offers, questionOfferId])

    // History Timeline States
    const [historyOffer, setHistoryOffer] = useState<any>(null)
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

    const REJECTION_REASONS = [
        "Fiyatın bütçemizin üzerinde olması",
        "Teslimat süresinin çok uzun olması",
        "Teknik özelliklerin ihtiyacımızı karşılamaması",
        "Başka bir tedarikçiden daha uygun teklif alınması",
        "Projenin/İhtiyacın iptal edilmiş olması",
        "Diğer"
    ]

    useEffect(() => {
        dispatch(getAllOffers())
        dispatch(getAllStaff())
    }, [dispatch])

    const filteredQuotes = useMemo(() => {
        if (!offers) return []
        return (offers as any[]).filter(o => {
            const searchLower = search.toLowerCase()
            const matchesSearch = (
                (o.title?.toLowerCase() || "").includes(searchLower) ||
                (o.konu?.toLowerCase() || "").includes(searchLower) ||
                (o.musteri?.company?.toLowerCase() || "").includes(searchLower)
            )
            const matchesStatus = selectedStatus === "all" ||
                o.status === selectedStatus ||
                (selectedStatus === 'Müşteri Onayı Bekleniyor' && o.status === 'Müşteri onay bekliyor')

            const offerPersonelId = typeof o.personel === 'object' ? o.personel?._id : o.personel
            const matchesPersonnel = selectedPersonnel === "all" || offerPersonelId === selectedPersonnel

            return matchesSearch && matchesStatus && matchesPersonnel
        })
    }, [offers, search, selectedStatus, selectedPersonnel])

    const stats = useMemo(() => {
        const total = (offers || []).length
        const approved = (offers || []).filter((o: any) => ['Yönetici Onayladı', 'Müşteri Onayladı', 'Faturalandı', 'Sevkiyat Halinde', 'Tamamlandı'].includes(o.status)).length
        const pending = (offers || []).filter((o: any) => ['Müşteri Onayı Bekleniyor', 'Müşteri onay bekliyor', 'Taslak'].includes(o.status) || !o.status).length
        const rejected = (offers || []).filter((o: any) => ['Müşteri Reddetti', 'İptal Edildi'].includes(o.status)).length

        return [
            { label: "Toplam Teklif", value: total.toString(), icon: FileText, color: "text-blue-500", bgColor: "bg-blue-50", trend: "Genel" },
            { label: "Onaylanan", value: approved.toString(), icon: CheckCircle2, color: "text-emerald-500", bgColor: "bg-emerald-50", trend: "Başarılı" },
            { label: "Bekleyen", value: pending.toString(), icon: Clock, color: "text-orange-500", bgColor: "bg-orange-50", trend: "İşlemde" },
            { label: "Reddedilen", value: rejected.toString(), icon: XCircle, color: "text-rose-500", bgColor: "bg-rose-50", trend: "Kaybedilen" },
        ]
    }, [offers])

    const handleStatusChange = async (id: string, newStatus: string) => {
        const offer = (offers as any[]).find(o => o._id === id);
        if (offer) {
            await dispatch(updateOffer({ id, offerData: { ...offer, status: newStatus } }));
        }
    };

    const handleActionConfirm = async () => {
        const { type, id } = actionDialog
        if (!id || !type) return

        try {
            if (type === 'approve') {
                await dispatch(approveOfferCustomer(id)).unwrap()
                toast.success("Teklif onaylandı.")
            } else if (type === 'managerApprove') {
                await dispatch(approveOfferManager(id)).unwrap()
                toast.success("Teklif yönetici tarafından onaylandı.")
            } else if (type === 'reject') {
                const finalReason = rejectionReason === "Diğer" ? otherReason : rejectionReason
                await dispatch(rejectOfferCustomer({ id, notes: finalReason })).unwrap()
                toast.success("Teklif reddedildi.")
            } else if (type === 'managerReject') {
                const finalReason = rejectionReason === "Diğer" ? otherReason : rejectionReason
                await dispatch(rejectOfferManager({ id, notes: finalReason })).unwrap()
                toast.success("Teklif yönetici tarafından reddedildi.")
            } else if (type === 'revision') {
                await dispatch(requestRevisionOffer({ id, notes: revisionNote })).unwrap()
                toast.success("Revizyon talebi iletildi.")
            } else if (type === 'delete') {
                await dispatch(deleteOffer(id)).unwrap()
                toast.success("Teklif silindi.")
            } else if (type === 'complete') {
                const response = await dispatch(completeOffer(id)).unwrap()
                toast.success("Teklif başarıyla tamamlandı!")
                // Use company info from backend response
                if (response.companyInfo) {
                    setCompletedOfferCompany({
                        name: response.companyInfo.name || 'Sadece Teklif',
                        logo: response.companyInfo.logo || undefined,
                        initials: response.companyInfo.initials || 'ST'
                    })
                } else {
                    setCompletedOfferCompany({
                        name: 'Sadece Teklif',
                        initials: 'ST'
                    })
                }
                setRating(0)
                setRatingOfferId(id)
                setShowRatingDialog(true)
            }
            setActionDialog({ type: null, id: null })
            setRejectionReason("")
            setOtherReason("")
            setRevisionNote("")
        } catch (err: any) {
            toast.error(err || "İşlem başarısız.")
        }
    }

    const handleOpenQuestions = async (offer: any) => {
        setQuestionOfferId(offer._id)
        setIsQuestionModalOpen(true)
        const hasUnread = isCustomer ? offer.hasUnreadQuestionForCustomer : offer.hasUnreadQuestionForProvider
        if (hasUnread) {
            await dispatch(markOfferQuestionsRead(offer._id))
        }
    }

    const handleSendQuestion = async () => {
        if (!questionText.trim() || !questionOfferId) return
        try {
            await dispatch(addOfferQuestion({ id: questionOfferId, text: questionText })).unwrap()
            setQuestionText("")
        } catch (err) {
            toast.error("Mesaj gönderilemedi.")
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
                {/* Filters Area */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="flex flex-col md:flex-row items-center gap-3 flex-1 w-full lg:w-auto">
                        <div className="relative w-full md:max-w-[200px]">
                            <input
                                type="text"
                                placeholder="Teklif Ara.."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-100 h-11 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/10 placeholder:text-slate-400 bg-white"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                <Search className="size-3" />
                            </div>
                        </div>

                        <div className="w-full md:w-40">
                            <SelectModal
                                label=""
                                placeholder="Durum Süz"
                                value={selectedStatus}
                                onChange={(val: string) => setSelectedStatus(val)}
                                options={[
                                    { label: "Tüm Durumlar", id: "all" },
                                    { label: "Taslak", id: "Taslak" },
                                    { label: "Yönetici Onayı Bekliyor", id: "Yönetici Onayı Bekliyor" },
                                    { label: "Yönetici Onayladı", id: "Yönetici Onayladı" },
                                    { label: "Faturalandı", id: "Faturalandı" },
                                    { label: "Müşteri Onayı Bekleniyor", id: "Müşteri Onayı Bekleniyor" },
                                    { label: "Müşteri Onayladı", id: "Müşteri Onayladı" },
                                    { label: "Müşteri Reddetti", id: "Müşteri Reddetti" },
                                    { label: "Revizyon Talep edildi", id: "Revizyon Talep edildi" },
                                    { label: "Sevkiyat Halinde", id: "Sevkiyat Halinde" },
                                    { label: "Tamamlandı", id: "Tamamlandı" },
                                    { label: "İptal Edildi", id: "İptal Edildi" },
                                ]}
                            />
                        </div>

                        <div className="w-full md:w-48">
                            <SelectModal
                                label=""
                                placeholder="Personel Süz"
                                value={selectedPersonnel}
                                onChange={(val: string) => setSelectedPersonnel(val)}
                                options={[
                                    { label: "Tüm Personeller", id: "all" },
                                    ...(staffList?.map(s => ({ label: `${s.name} ${s.surname}`, id: s._id })) || [])
                                ]}
                            />
                        </div>
                    </div>

                    {canCreateOffer && (
                        <Link href="/panel/teklifler/tekliflerim/yeni" className="w-full lg:w-auto">
                            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F67E06] px-5 py-2.5 text-[12px] font-normal text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all">
                                <Plus className="size-3" strokeWidth={4} />
                                <span>Yeni Teklif</span>
                            </button>
                        </Link>
                    )}
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
                                    <th className="px-6 pb-2 whitespace-nowrap">Teklif No</th>
                                    <th className="px-4 pb-2 whitespace-nowrap">Hazırlayan</th>
                                    <th className="px-4 pb-2 whitespace-nowrap">Firma / Müşteri</th>
                                    <th className="px-4 pb-2 whitespace-nowrap">Konu</th>
                                    <th className="px-4 pb-2 whitespace-nowrap">Toplam</th>
                                    <th className="px-4 pb-2 whitespace-nowrap">Oluşturma Tarihi</th>
                                    <th className="px-4 pb-2 whitespace-nowrap">Durum</th>
                                    <th className="px-4 pb-2 text-right pr-8 whitespace-nowrap">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="text-[12px]">
                                {filteredQuotes.map((o: any) => {
                                    const total = (o.urunler || []).reduce((sum: number, item: any) => sum + (Number(item.toplamTutar) || 0), 0);
                                    const createdDate = o.createdAt ? new Date(o.createdAt).toLocaleDateString('tr-TR') : '-';

                                    const musteriName = typeof o.musteri === 'object' ? (o.musteri?.company || o.musteri?.person || o.musteri?.name || "Bilinmeyen") : (o.musteri || o.alici || "Bilinmeyen");
                                    const musteriAvatar = typeof o.musteri === 'object'
                                        ? (o.musteri?.picture || o.musteri?.logo || o.musteri?.userAccount?.profile?.picture || null)
                                        : null;
                                    const personelAvatar = o.personel?.profile?.picture || o.personel?.picture || null;

                                    return (
                                        <tr key={o._id} className="group bg-white hover:bg-slate-50 transition-all duration-200">
                                            <td className="px-6 py-4 font-normal text-slate-800 rounded-l-2xl border-y border-l border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:border-orange-100 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-orange-600 font-semibold">{o.offerNumber || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar
                                                        name={o.personel?.name}
                                                        surname={o.personel?.surname}
                                                        picture={o.personel?.profile?.picture || o.personel?.picture}
                                                        size="md"
                                                    />
                                                    <span className="text-[12px] font-medium text-slate-700">{o.personel?.name} {o.personel?.surname}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar
                                                        name={musteriName?.split(' ')[0]}
                                                        surname={musteriName?.split(' ').slice(1).join(' ')}
                                                        picture={musteriAvatar || (typeof o.musteri === 'object' ? o.musteri?.userAccount?.profile?.picture : null)}
                                                        size="md"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-[12px] font-medium text-slate-700 truncate max-w-[200px]" title={musteriName}>
                                                            {musteriName}
                                                        </span>
                                                        {typeof o.musteri === 'object' && o.musteri?.person && o.musteri?.company && (
                                                            <span className="text-[10px] text-slate-400 truncate max-w-[200px]" title={o.musteri?.person}>
                                                                {o.musteri.person}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-slate-600 font-normal border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">{o.konu || o.title || "-"}</td>
                                            <td className="px-4 py-4 text-slate-600 font-normal border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">
                                                {total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {o.paraBirimi || 'TL'}
                                            </td>
                                            <td className="px-4 py-4 text-slate-600 font-normal border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">{createdDate}</td>
                                            <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-normal border shadow-sm",
                                                        (o.status?.toLowerCase().includes('onay') && !o.status?.toLowerCase().includes('bekliy')) || ['Faturalandı', 'Sevkiyat Halinde', 'Tamamlandı'].includes(o.status) ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                            o.status?.toLowerCase().includes('red') || o.status?.toLowerCase().includes('iptal') ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                                o.status === 'Taslak' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                                    o.status?.toLowerCase().includes('bekliy') ? "bg-slate-50 text-slate-500 border-slate-200" :
                                                                        "bg-slate-100 text-slate-500 border-slate-200"
                                                    )}>
                                                        {o.status?.toLowerCase() === 'müşteri onay bekliyor' ? 'Müşteri Onayı Bekleniyor' : (o.status || "Taslak")}
                                                    </div>
                                                    {o.satisfactionRating && (
                                                        <div className="flex items-center gap-0.5">
                                                            <Star className="size-3 fill-orange-500 text-orange-500" />
                                                            <span className="text-[10px] font-semibold text-orange-600">{o.satisfactionRating}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right rounded-r-2xl border-y border-r border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] pr-8 group-hover:border-orange-100">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={`/panel/teklifler/tekliflerim/${o._id}`}>
                                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Görüntüle">
                                                            <Eye className="size-3.5" />
                                                        </button>
                                                    </Link>

                                                    <button
                                                        onClick={() => handleOpenQuestions(o)}
                                                        className="p-2 relative text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                                                        title="Soru Sor / Mesajlar"
                                                    >
                                                        <HelpCircle className="size-3.5" />
                                                        {((isCustomer && o.hasUnreadQuestionForCustomer) || (!isCustomer && o.hasUnreadQuestionForProvider)) && (
                                                            <span className="absolute top-1 right-1 size-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                                                        )}
                                                    </button>

                                                    {o.status === 'Revizyon Talep edildi' && (
                                                        <button
                                                            onClick={() => {
                                                                setPreviewRevisionNote(o.revisionNote || "Not belirtilmemiş.")
                                                                setIsRevisionPreviewOpen(true)
                                                            }}
                                                            className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                                            title="Revizyonu Gör"
                                                        >
                                                            <RotateCcw className="size-3.5" />
                                                        </button>
                                                    )}

                                                    {(o.status === 'Reddedildi' || o.status === 'Müşteri Reddetti') && (
                                                        <button
                                                            onClick={() => {
                                                                setPreviewRejectionNote(o.rejectionNote || "Neden belirtilmemiş.")
                                                                setIsRejectionPreviewOpen(true)
                                                            }}
                                                            className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                            title="Red Gerekçesini Gör"
                                                        >
                                                            <XCircle className="size-3.5" />
                                                        </button>
                                                    )}

                                                    {isCustomer && o.status === 'Sevkiyat Halinde' && (
                                                        <button
                                                            onClick={() => setActionDialog({ type: 'complete', id: o._id })}
                                                            className="group relative flex items-center justify-center size-9 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all duration-300 border border-emerald-100 shadow-sm"
                                                        >
                                                            <CheckCheck className="size-5" strokeWidth={2.5} />
                                                            <div className="absolute bottom-full mb-2 right-0 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-normal rounded-lg opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none whitespace-nowrap shadow-xl z-20">
                                                                Teslim Aldım / Tamamla
                                                                <div className="absolute top-full right-3 border-[4px] border-transparent border-t-slate-900" />
                                                            </div>
                                                        </button>
                                                    )}
                                                    {((isProvider || isAdmin) || (o.yoneticiler?.includes(`${user?.name} ${user?.surname}`))) && o.status === 'Yönetici Onayı Bekliyor' && (
                                                        <>
                                                            <button
                                                                onClick={() => setActionDialog({ type: 'managerApprove', id: o._id })}
                                                                className="p-2 hover:bg-emerald-50 text-emerald-500 rounded-xl transition-all"
                                                                title="Onayla (Yönetici)"
                                                            >
                                                                <CheckCircle2 className="size-4.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => setActionDialog({ type: 'revision', id: o._id })}
                                                                className="p-2 hover:bg-orange-50 text-orange-500 rounded-xl transition-all"
                                                                title="Revizyon İste"
                                                            >
                                                                <RotateCcw className="size-4.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => setActionDialog({ type: 'managerReject', id: o._id })}
                                                                className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl transition-all"
                                                                title="Reddet (Yönetici)"
                                                            >
                                                                <XCircle className="size-4.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {isCustomer && (o.status === 'Müşteri Onayı Bekleniyor' || o.status === 'Müşteri onay bekliyor') && (
                                                        <>
                                                            <button
                                                                onClick={() => setActionDialog({ type: 'approve', id: o._id })}
                                                                className="p-2 hover:bg-emerald-50 text-emerald-500 rounded-xl transition-all"
                                                                title="Onayla"
                                                            >
                                                                <CheckCircle2 className="size-4.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => setActionDialog({ type: 'revision', id: o._id })}
                                                                className="p-2 hover:bg-orange-50 text-orange-500 rounded-xl transition-all"
                                                                title="Revizyon İste"
                                                            >
                                                                <RotateCcw className="size-4.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => setActionDialog({ type: 'reject', id: o._id })}
                                                                className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl transition-all"
                                                                title="Reddet"
                                                            >
                                                                <XCircle className="size-4.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setHistoryOffer(o)
                                                            setIsHistoryModalOpen(true)
                                                        }}
                                                        className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-all"
                                                        title="Teklif Hareketleri"
                                                    >
                                                        <History className="size-4.5" />
                                                    </button>
                                                    {canCreateOffer && (
                                                        <Link
                                                            href={`/panel/teklifler/tekliflerim/${o._id}`}
                                                            className="p-2 hover:bg-slate-100 text-slate-400 rounded-xl transition-all"
                                                            title="Düzenle"
                                                        >
                                                            <SquarePen className="size-4.5" />
                                                        </Link>
                                                    )}
                                                    {canDeleteOffer && (
                                                        <button
                                                            onClick={() => setActionDialog({ type: 'delete', id: o._id, name: o.title || o.konu })}
                                                            className="p-2 hover:bg-rose-50 text-rose-400 rounded-xl transition-all"
                                                            title="Sil"
                                                        >
                                                            <Trash2 className="size-4.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredQuotes.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={7} className=" text-center text-slate-400 font-medium bg-white rounded-2xlmt-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="size-8 text-slate-200" />
                                                <span>Teklif bulunamadı.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Actions Dialogs */}
            <AlertDialog open={!!actionDialog.type} onOpenChange={(open) => !open && setActionDialog({ type: null, id: null })}>
                <AlertDialogContent className={cn(actionDialog.type === 'reject' || actionDialog.type === 'revision' ? "sm:max-w-[420px]" : "")}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {(actionDialog.type === 'approve' || actionDialog.type === 'managerApprove') && "Teklifi Onayla"}
                            {(actionDialog.type === 'reject' || actionDialog.type === 'managerReject') && "Teklifi Reddet"}
                            {actionDialog.type === 'revision' && "Revizyon Talebi"}
                            {actionDialog.type === 'delete' && "Teklifi Sil"}
                            {actionDialog.type === 'complete' && "İşi Tamamla"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {(actionDialog.type === 'approve' || actionDialog.type === 'managerApprove') && "Bu teklifi onaylamak istediğinizden emin misiniz? Bu işlem geri alınamaz."}
                            {actionDialog.type === 'delete' && `${actionDialog.name} teklifini silmek istediğinizden emin misiniz?`}
                            {(actionDialog.type === 'reject' || actionDialog.type === 'managerReject') && "Teklifi reddetme nedeninizi lütfen belirtiniz."}
                            {actionDialog.type === 'revision' && "Lütfen revizyon talebinizi detaylandırın."}
                            {actionDialog.type === 'complete' && "Ürünü/Hizmeti eksiksiz teslim aldığınızı ve süreci tamamladığınızı onaylıyor musunuz?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {(actionDialog.type === 'reject' || actionDialog.type === 'managerReject') && (
                        <div className="flex flex-col gap-2 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <Label className="text-[11px] font-normal text-slate-400 pl-1 mb-1">Bir neden seçiniz</Label>
                            <div className="grid gap-2">
                                {REJECTION_REASONS.map((reason) => (
                                    <button
                                        key={reason}
                                        onClick={() => setRejectionReason(reason)}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all group",
                                            rejectionReason === reason
                                                ? "bg-rose-50 border-rose-200 text-rose-700 shadow-sm"
                                                : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200"
                                        )}
                                    >
                                        <span className={cn(
                                            "text-xs font-semibold",
                                            rejectionReason === reason ? "opacity-100" : "opacity-80"
                                        )}>{reason}</span>
                                        {rejectionReason === reason && (
                                            <div className="size-5 rounded-full bg-rose-500 flex items-center justify-center animate-in zoom-in-50 duration-200">
                                                <CheckCircle2 className="size-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {rejectionReason === "Diğer" && (
                                <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Label className="text-[11px] font-normal text-slate-400 pl-1">Lütfen Detayı Belirtin</Label>
                                    <Input
                                        placeholder="Reddetme nedeninizi buraya yazınız..."
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                        className="h-14 rounded-2xl bg-white border-slate-200 focus:ring-rose-500/10 text-xs font-medium"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {actionDialog.type === 'revision' && (
                        <div className="py-4">
                            <textarea
                                placeholder="Revizyon talebinizi buraya yazınız..."
                                value={revisionNote}
                                onChange={(e) => setRevisionNote(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/5 min-h-[120px] resize-none"
                            />
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setRejectionReason("")
                            setOtherReason("")
                            setRevisionNote("")
                        }}>Vazgeç</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleActionConfirm}
                            className={cn(
                                (actionDialog.type === 'approve' || actionDialog.type === 'managerApprove') && "bg-emerald-500 hover:bg-emerald-600",
                                (actionDialog.type === 'reject' || actionDialog.type === 'managerReject' || actionDialog.type === 'delete') && "bg-rose-500 hover:bg-rose-600",
                                actionDialog.type === 'complete' && "bg-emerald-600 hover:bg-emerald-700",
                                actionDialog.type === 'revision' && "bg-orange-500 hover:bg-orange-600"
                            )}
                            disabled={
                                ((actionDialog.type === 'reject' || actionDialog.type === 'managerReject') && (!rejectionReason || (rejectionReason === "Diğer" && !otherReason))) ||
                                (actionDialog.type === 'revision' && !revisionNote)
                            }
                        >
                            {(actionDialog.type === 'approve' || actionDialog.type === 'managerApprove') && "Onayla"}
                            {(actionDialog.type === 'reject' || actionDialog.type === 'managerReject') && "Reddet"}
                            {actionDialog.type === 'revision' && "Gönder"}
                            {actionDialog.type === 'delete' && "Sil"}
                            {actionDialog.type === 'complete' && "Onayla ve Tamamla"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Revision Preview Dialog */}
            <AlertDialog open={isRevisionPreviewOpen} onOpenChange={setIsRevisionPreviewOpen}>
                <AlertDialogContent className="sm:max-w-[500px] font-['Poppins']">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                <RotateCcw className="size-5" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg font-semibold text-slate-800 ">Revizyon Talebi Detayı</AlertDialogTitle>
                                <p className="text-[11px] text-slate-400 font-normal">Müşteri tarafından iletilen notlar</p>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <div className="py-6">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
                                <RotateCcw className="size-24" />
                            </div>
                            <p className="text-sm font-medium text-slate-700 leading-relaxed relative z-10 whitespace-pre-wrap">
                                {previewRevisionNote}
                            </p>
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-slate-900 hover:bg-slate-800 rounded-xl px-8 py-2.5 text-[12px] font-normal">
                            Anladım
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Rejection Preview Dialog */}
            <AlertDialog open={isRejectionPreviewOpen} onOpenChange={setIsRejectionPreviewOpen}>
                <AlertDialogContent className="sm:max-w-[500px] font-['Poppins']">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                                <XCircle className="size-5" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg font-semibold text-slate-800 ">Red Gerekçesi</AlertDialogTitle>
                                <p className="text-[11px] text-slate-400 font-normal">Müşteri tarafından belirtilen neden</p>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <div className="py-6">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
                                <XCircle className="size-24" />
                            </div>
                            <p className="text-sm font-medium text-rose-700 leading-relaxed relative z-10 whitespace-pre-wrap">
                                {previewRejectionNote}
                            </p>
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-rose-500 hover:bg-rose-600 rounded-xl px-8 py-2.5 text-[12px] font-normal">
                            Kapat
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Rating Dialog */}
            <AlertDialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
                <AlertDialogContent className="sm:max-w-[440px] text-center p-8 border-none shadow-2xl font-['Poppins']">
                    <div className="flex flex-col items-center gap-6">
                        <div className="size-20 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {completedOfferCompany?.logo ? (
                                <img src={completedOfferCompany.logo} alt="Logo" className="w-full h-full object-cover relative z-10" />
                            ) : (
                                <div className="text-orange-500 font-semibold text-xl relative z-10">
                                    {completedOfferCompany?.initials || 'ST'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <AlertDialogTitle className="text-2xl font-semibold text-slate-800 ">İş Tamamlandı!</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm font-medium text-slate-500 leading-relaxed px-4">
                                <span className="text-orange-600 font-normal">{completedOfferCompany?.name}</span> ile yaptığınız bu iş birliği için deneyiminizi puanlayın.
                            </AlertDialogDescription>
                        </div>

                        <div className="flex items-center gap-2 py-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="p-1 hover:scale-110 active:scale-95 transition-all outline-none"
                                >
                                    <Star
                                        className={cn(
                                            "size-8 transition-colors",
                                            star <= rating ? "fill-orange-400 text-orange-400" : "text-slate-200 fill-slate-50"
                                        )}
                                        strokeWidth={star <= rating ? 2 : 1.5}
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="w-full flex flex-col gap-3 pt-2">
                            <button
                                onClick={async () => {
                                    if (rating === 0) {
                                        toast.error("Lütfen bir puan veriniz.")
                                        return
                                    }
                                    if (!ratingOfferId) {
                                        toast.error("Teklif bilgisi bulunamadı.")
                                        return
                                    }
                                    try {
                                        await dispatch(rateOffer({
                                            id: ratingOfferId,
                                            satisfactionRating: rating
                                        })).unwrap()
                                        toast.success("Değerlendirmeniz için teşekkürler!")
                                        setShowRatingDialog(false)
                                        setRating(0)
                                    } catch (err) {
                                        toast.error("Puan kaydedilemedi.")
                                    }
                                }}
                                className="w-full bg-slate-900 text-white rounded-2xl py-4 text-xs font-normal shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Değerlendirmeyi Gönder
                            </button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            <QuestionChatModal
                isOpen={isQuestionModalOpen}
                onClose={() => setIsQuestionModalOpen(false)}
                offer={questionOffer}
                questionText={questionText}
                setQuestionText={setQuestionText}
                handleSendQuestion={handleSendQuestion}
                isCustomer={isCustomer}
            />

            <OfferHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                offer={historyOffer}
                isCustomer={isCustomer}
            />
        </div>
    )
}
