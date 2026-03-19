"use client"

import OfferForm from "@/components/offer-form"

import { useEffect, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { cn } from "@/lib/utils"
import { getAllOffers, approveOfferCustomer, rejectOfferCustomer, requestRevisionOffer, updateOffer, approveOfferManager, rejectOfferManager, addOfferQuestion, markOfferQuestionsRead, completeOffer, rateOffer } from "@/redux/actions/offerActions"
import { usePermissions } from "@/hooks/usePermissions"
import { SelectModal } from "@/components/ui/select-modal"
import { CheckCircle2, XCircle, RotateCcw, Eye, Copy, Settings, Truck, Edit, Star, CheckCheck, HelpCircle, Send, X, History } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"
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
import { QuestionChatModal } from "@/components/question-chat-modal"
import { OfferHistoryModal } from "@/components/offer-history-modal"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"


export default function EditOfferPage() {
    const params = useParams()
    const id = params.id as string
    const dispatch = useAppDispatch()
    const { offers, loading } = useAppSelector((state) => state.offer)
    const { isCustomer, isProvider, isAdmin, hasPermission, user } = usePermissions()
    const [offer, setOffer] = useState<any>(null)
    const [revisionNote, setRevisionNote] = useState("")
    const [showRevisionInput, setShowRevisionInput] = useState(false)

    // Dialog States
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
    const [isRevisionPreviewOpen, setIsRevisionPreviewOpen] = useState(false)
    const [isRejectionPreviewOpen, setIsRejectionPreviewOpen] = useState(false)
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
    const [pendingStatus, setPendingStatus] = useState("")
    const [rejectionReason, setRejectionReason] = useState("")
    const [otherReason, setOtherReason] = useState("")
    const [isShippingDialogOpen, setIsShippingDialogOpen] = useState(false)
    const [shippingInfo, setShippingInfo] = useState("")

    // Question/Chat States
    const [questionText, setQuestionText] = useState("")
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

    // Action States (synchronized with list view)
    const [actionDialog, setActionDialog] = useState<{
        type: 'approve' | 'reject' | 'revision' | 'delete' | 'complete' | 'managerApprove' | 'managerReject' | null,
        id: string | null,
        name?: string
    }>({ type: null, id: null })
    const [showRatingDialog, setShowRatingDialog] = useState(false)
    const [rating, setRating] = useState(0)
    const [completedOfferCompany, setCompletedOfferCompany] = useState<{ name: string, logo?: string, initials?: string } | null>(null)
    const [ratingOfferId, setRatingOfferId] = useState<string | null>(null)

    const REJECTION_REASONS = [
        "Fiyatın bütçemizin üzerinde olması",
        "Teslimat süresinin çok uzun olması",
        "Teknik özelliklerin ihtiyacımızı karşılamaması",
        "Başka bir tedarikçiden daha uygun teklif alınması",
        "Projenin/İhtiyacın iptal edilmiş olması",
        "Diğer"
    ]

    const STATUS_OPTIONS = [
        { id: 'Taslak', label: 'Taslak' },
        { id: 'Yönetici Onayı Bekliyor', label: 'Yönetici Onayı Bekliyor' },
        { id: 'Yönetici Onayladı', label: 'Yönetici Onayladı' },
        { id: 'Yönetici Reddetti', label: 'Yönetici Reddetti' },
        { id: 'Faturalandı', label: 'Faturalandı' },
        { id: 'Müşteri Onayı Bekleniyor', label: 'Müşteri Onayı Bekleniyor' },
        { id: 'Müşteri Onayladı', label: 'Müşteri Onayladı' },
        { id: 'Müşteri Reddetti', label: 'Müşteri Reddetti' },
        { id: 'Revizyon Talep edildi', label: 'Revizyon Talep edildi' },
        { id: 'Sevkiyat Halinde', label: 'Sevkiyat Halinde' },
        { id: 'Tamamlandı', label: 'Tamamlandı' },
        { id: 'İptal Edildi', label: 'İptal Edildi' },
    ]

    const handleCopyLink = () => {
        const url = `${window.location.origin}/teklif/onizleme/${id}`
        navigator.clipboard.writeText(url)
        toast.success("Önizleme linki kopyalandı!")
    }

    useEffect(() => {
        if (offers.length === 0) {
            dispatch(getAllOffers())
        }
    }, [dispatch, offers.length])

    useEffect(() => {
        if (offers.length > 0) {
            const found = offers.find((o: any) => o._id === id)
            if (found) {
                setOffer(found)
            }
        }
    }, [offers, id])

    useEffect(() => {
        if (offer?.shippingInfo) {
            setShippingInfo(offer.shippingInfo)
        }
    }, [offer])

    const handleStatusChange = (newStatus: string) => {
        if (newStatus === 'Sevkiyat Halinde') {
            setIsShippingDialogOpen(true);
            return;
        }
        if (newStatus === 'Yönetici Reddetti') {
            setIsRejectDialogOpen(true);
            setPendingStatus(newStatus);
            return;
        }
        setPendingStatus(newStatus)
        setIsStatusDialogOpen(true)
    }

    const confirmStatusChange = async () => {
        try {
            let result: any;
            if (pendingStatus === 'Yönetici Onayladı') {
                result = await dispatch(approveOfferManager(id)).unwrap();
            } else {
                // ONLY send the status field to prevent backend from resetting it to 'Onay Bekliyor'
                result = await dispatch(updateOffer({ id, offerData: { status: pendingStatus } as any })).unwrap()
            }
            setOffer(result)
            setIsStatusDialogOpen(false)
            toast.success("Teklif durumu güncellendi.")
        } catch (err) {
            toast.error("Durum güncellenemedi.")
        }
    }

    const handleShippingUpdate = async () => {
        if (!shippingInfo || !shippingInfo.trim()) {
            toast.error("Lütfen sevkiyat bilgisini eksiksiz giriniz.")
            return
        }
        try {
            const result = await dispatch(updateOffer({
                id,
                offerData: {
                    status: 'Sevkiyat Halinde',
                    shippingInfo: shippingInfo
                } as any
            })).unwrap()
            setOffer(result)
            setIsShippingDialogOpen(false)
            toast.success("Sevkiyat bilgisi kaydedildi.")
        } catch (err) {
            toast.error("Sevkiyat bilgisi güncellenemedi.")
        }
    }

    const handleAction = async (action: 'approve' | 'reject' | 'revision' | 'complete') => {
        try {
            if (action === 'approve') {
                await dispatch(approveOfferCustomer(id)).unwrap()
                setIsApproveDialogOpen(false)
                toast.success("Teklif onaylandı.")
            } else if (action === 'reject') {
                const finalReason = rejectionReason === "Diğer" ? otherReason : rejectionReason
                if (!finalReason) {
                    toast.error("Lütfen bir reddetme sebebi seçiniz/yazınız.")
                    return
                }

                if (pendingStatus === 'Yönetici Reddetti') {
                    const result = await dispatch(rejectOfferManager({ id, notes: finalReason })).unwrap()
                    setOffer(result)
                    setIsRejectDialogOpen(false)
                } else {
                    await dispatch(rejectOfferCustomer({ id, notes: finalReason })).unwrap()
                    setIsRejectDialogOpen(false)
                }

                setRejectionReason("")
                setOtherReason("")
                toast.error("Teklif reddedildi.")
            } else if (action === 'revision') {
                if (!revisionNote) {
                    toast.error("Lütfen revizyon notunu giriniz.")
                    return
                }
                await dispatch(requestRevisionOffer({ id, notes: revisionNote })).unwrap()
                setShowRevisionInput(false)
                setRevisionNote("")
                toast.success("Revizyon talebi iletildi.")
            } else if (action === 'complete') {
                const response = await dispatch(completeOffer(id)).unwrap()
                toast.success("Teklif başarıyla tamamlandı!")
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
                setActionDialog({ type: null, id: null })
            }
        } catch (err: any) {
            toast.error(err || "İşlem başarısız.")
        }
    }

    const handleOpenQuestions = async () => {
        setIsQuestionModalOpen(true)
        const hasUnread = isCustomer ? offer.hasUnreadQuestionForCustomer : offer.hasUnreadQuestionForProvider
        if (hasUnread) {
            await dispatch(markOfferQuestionsRead(offer._id))
        }
    }

    const handleSendQuestion = async () => {
        if (!questionText.trim() || !id) return
        try {
            await dispatch(addOfferQuestion({ id, text: questionText })).unwrap()
            setQuestionText("")
        } catch (err) {
            toast.error("Mesaj gönderilemedi.")
        }
    }

    const isUserInApprovers = useMemo(() => {
        if (!offer?.yoneticiler || !user) return false;
        const fullName = `${user.name} ${user.surname}`;
        return offer.yoneticiler.includes(fullName);
    }, [offer?.yoneticiler, user]);

    const isOfferOwner = useMemo(() => {
        if (!offer?.personel || !user) return false;
        const personelId = typeof offer.personel === 'object' ? offer.personel._id : offer.personel;
        return personelId === user._id;
    }, [offer?.personel, user]);

    const canManageOffers = (isAdmin || isProvider || hasPermission("Teklif Oluştur")) && !isCustomer
    const isReadOnly = isCustomer || !canManageOffers

    if (loading && !offer) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (!offer && !loading) {
        return (
            <div className="text-center py-20 text-slate-500">
                Teklif bulunamadı.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-2">
                <div className="flex items-center gap-3">
                    {((isProvider || isAdmin || isUserInApprovers || (isOfferOwner && offer.status === 'Müşteri Onayladı')) && canManageOffers) ? (
                        <div className="w-[240px]">
                            <SelectModal
                                label="TEKLİF DURUMU"
                                value={offer.status || "Taslak"}
                                onChange={handleStatusChange}
                                options={offer.status === 'Yönetici Onayı Bekliyor'
                                    ? [
                                        { id: 'Yönetici Onayladı', label: 'Yönetici Onayladı' },
                                        { id: 'Yönetici Reddetti', label: 'Yönetici Reddetti' },
                                        { id: 'İptal Edildi', label: 'İptal Edildi' }
                                    ]
                                    : offer.status === 'Müşteri Onayladı'
                                        ? STATUS_OPTIONS.filter(opt => ['Müşteri Onayladı', 'Sevkiyat Halinde', 'İptal Edildi'].includes(opt.id))
                                        : offer.status === 'Sevkiyat Halinde'
                                            ? STATUS_OPTIONS.filter(opt => ['Sevkiyat Halinde', 'Tamamlandı', 'İptal Edildi'].includes(opt.id))
                                            : STATUS_OPTIONS.filter(opt => [offer.status, 'İptal Edildi'].includes(opt.id))
                                }
                                placeholder="Durum Seçin"
                                isStatus={true}
                                icon={Settings}
                                showSearch={false}
                                disabled={offer.status === 'Taslak' || offer.status === 'İptal Edildi' || offer.status === 'Tamamlandı'}
                            />
                        </div>
                    ) : (
                        <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-normal border shadow-sm",
                            (offer.status?.toLowerCase().includes('onay') && !offer.status?.toLowerCase().includes('bekliy')) || ['Faturalandı', 'Sevkiyat Halinde', 'Tamamlandı'].includes(offer.status) ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                offer.status?.toLowerCase().includes('red') || offer.status?.toLowerCase().includes('iptal') ? "bg-rose-50 text-rose-600 border-rose-100" :
                                    offer.status?.toLowerCase().includes('bekliy') ? "bg-slate-50 text-slate-500 border-slate-200" :
                                        "bg-slate-100 text-slate-500 border-slate-200"
                        )}>
                            {offer.status?.toLowerCase() === 'müşteri onay bekliyor' ? 'Müşteri Onayı Bekleniyor' : (offer.status || "Taslak")}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {offer.status === 'Revizyon Talep edildi' && (
                        <button
                            onClick={() => setIsRevisionPreviewOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-orange-50 px-5 py-2.5 text-[12px] font-normal text-orange-600 border border-orange-100 shadow-sm hover:bg-orange-100 transition-all"
                        >
                            <RotateCcw className="size-3.5" />
                            <span>Revizyonu Gör</span>
                        </button>
                    )}

                    {(offer.status === 'Reddedildi' || offer.status === 'Müşteri Reddetti') && (
                        <button
                            onClick={() => setIsRejectionPreviewOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-rose-50 px-5 py-2.5 text-[12px] font-normal text-rose-600 border border-rose-100 shadow-sm hover:bg-rose-100 transition-all"
                        >
                            <XCircle className="size-3.5" />
                            <span>Red Gerekçesini Gör</span>
                        </button>
                    )}

                    {canManageOffers && (
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 rounded-xl bg-orange-50 px-5 py-2.5 text-[12px] font-normal text-orange-600 hover:bg-orange-100 transition-all"
                        >
                            <Copy className="size-3.5" />
                            <span>Linki Kopyala</span>
                        </button>
                    )}

                    <Link href={`/teklif/onizleme/${id}`} target="_blank">
                        <button className="flex items-center gap-2 rounded-xl bg-blue-50 px-5 py-2.5 text-[12px] font-normal text-blue-600 hover:bg-blue-100 transition-all">
                            <Eye className="size-3.5" />
                            <span>Görünüm</span>
                        </button>
                    </Link>

                    <button
                        onClick={() => setIsHistoryModalOpen(true)}
                        className="p-2.5 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-xl transition-all"
                        title="Teklif Hareketleri"
                    >
                        <History className="size-4" />
                    </button>

                    <button
                        onClick={handleOpenQuestions}
                        className="p-2.5 relative bg-orange-50 text-orange-500 hover:bg-orange-100 rounded-xl transition-all"
                        title="Soru Sor / Mesajlar"
                    >
                        <HelpCircle className="size-4" />
                        {((isCustomer && offer.hasUnreadQuestionForCustomer) || (!isCustomer && offer.hasUnreadQuestionForProvider)) && (
                            <span className="absolute top-1.5 right-1.5 size-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                        )}
                    </button>

                    {isCustomer && offer.status === 'Sevkiyat Halinde' && (
                        <button
                            onClick={() => setActionDialog({ type: 'complete', id: offer._id })}
                            className="flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 px-5 py-2.5 text-[12px] font-normal hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                        >
                            <CheckCheck className="size-4" />
                            <span>Teslim Aldım / Tamamla</span>
                        </button>
                    )}

                    {isCustomer && (offer.status === 'Müşteri Onayı Bekleniyor' || offer.status === 'Müşteri onay bekliyor') && (
                        <>
                            <button
                                onClick={() => setIsApproveDialogOpen(true)}
                                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-[12px] font-normal text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <CheckCircle2 className="size-3.5" />
                                <span>Onayla</span>
                            </button>
                            <button
                                onClick={() => setShowRevisionInput(!showRevisionInput)}
                                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-[12px] font-normal text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <RotateCcw className="size-3.5" />
                                <span>Revizyon İste</span>
                            </button>
                            <button
                                onClick={() => setIsRejectDialogOpen(true)}
                                className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-[12px] font-normal text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <XCircle className="size-3.5" />
                                <span>Reddet</span>
                            </button>
                        </>
                    )}
                </div>

                {offer?.shippingInfo && (
                    <div className="mt-4 md:mt-0 animate-in fade-in slide-in-from-top-2">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 relative overflow-hidden flex items-center gap-3 min-w-[200px]">
                            <div className="absolute top-0 right-0 p-3 opacity-5 rotate-12">
                                <Truck className="size-12" />
                            </div>
                            <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                <Truck className="size-5" />
                            </div>
                            <div className="flex-1 min-w-0 pr-8">
                                <h4 className="text-[10px] font-normal text-emerald-600 mb-0.5 uppercase tracking-wider">Sevkiyat Bilgisi</h4>
                                <p className="text-sm font-semibold text-emerald-900 leading-tight truncate">
                                    {offer.shippingInfo}
                                </p>
                            </div>
                            {canManageOffers && (
                                <button
                                    onClick={() => setIsShippingDialogOpen(true)}
                                    className="p-3 rounded-xl bg-white border border-emerald-100 text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm z-10"
                                >
                                    <Edit className="size-4" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {offer?.satisfactionRating && (
                    <div className="mt-4 md:mt-0 animate-in fade-in slide-in-from-top-2">
                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 relative overflow-hidden flex items-center gap-3 min-w-[160px]">
                            <div className="absolute top-0 right-0 p-3 opacity-5 rotate-12">
                                <Star className="size-12 text-orange-500" />
                            </div>
                            <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                <Star className="size-5 fill-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[10px] font-normal text-orange-600 mb-0.5 uppercase tracking-wider">Müşteri Puanı</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-orange-900">{offer.satisfactionRating}</span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={cn("size-3", star <= offer.satisfactionRating
                                                    ? "text-orange-500 fill-orange-500"
                                                    : "text-orange-200"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showRevisionInput && (
                <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-sm font-normal text-slate-800 mb-4">Revizyon Talebi</h3>
                    <textarea
                        value={revisionNote}
                        onChange={(e) => setRevisionNote(e.target.value)}
                        placeholder="Teklifte yapılmasını istediğiniz değişiklikleri buraya yazın..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/10 min-h-[120px]"
                    />
                    <div className="flex justify-end mt-4 gap-3">
                        <button
                            onClick={() => setShowRevisionInput(false)}
                            className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl text-[12px] font-normal hover:bg-slate-200 transition-all"
                        >
                            İptal
                        </button>
                        <button
                            onClick={() => handleAction('revision')}
                            className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-[12px] font-normal shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
                        >
                            Talebi Gönder
                        </button>
                    </div>
                </div>
            )}

            {/* Approve Confirmation Dialog */}
            <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <AlertDialogContent className="font-['Poppins']">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Teklifi Onayla</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu teklifi onaylamak istediğinizden emin misiniz? Bu işlem geri alınamaz ve teklif durumu güncelleştirilecektir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <AlertDialogCancel className="rounded-xl">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleAction('approve')}
                            className="bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                        >
                            Evet, Onayla
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Reason Dialog */}
            <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <AlertDialogContent className="sm:max-w-[440px] text-center p-8 border-none shadow-2xl font-['Poppins']">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Teklifi Reddet</AlertDialogTitle>
                        <AlertDialogDescription>
                            Teklifi reddetme nedeninizi lütfen belirtiniz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
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
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setRejectionReason("")
                            setOtherReason("")
                        }} className="rounded-xl">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleAction('reject')}
                            className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 rounded-xl"
                            disabled={!rejectionReason || (rejectionReason === "Diğer" && !otherReason)}
                        >
                            Teklifi Reddet
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
                                {offer?.revisionNote || "Not belirtilmemiş."}
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
                                {offer?.rejectionNote || "Neden belirtilmemiş."}
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

            {/* Shipping Info Dialog */}
            <AlertDialog open={isShippingDialogOpen} onOpenChange={setIsShippingDialogOpen}>
                <AlertDialogContent className="sm:max-w-[500px] font-['Poppins']">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Truck className="size-5" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg font-semibold text-slate-800 ">Sevkiyat Bilgisi</AlertDialogTitle>
                                <p className="text-[11px] text-slate-400 font-normal">Kargo takip, araç plaka veya sevkiyat detaylarını girin</p>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <div className="py-6">
                        <textarea
                            value={shippingInfo}
                            onChange={(e) => setShippingInfo(e.target.value)}
                            placeholder="Örn: 34 ABC 123 plakalı araç ile yola çıktı. Tahmini varış: 2 saat."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 min-h-[120px] resize-none"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleShippingUpdate}
                            className="bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-normal"
                        >
                            Bilgiyi Kaydet
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <AlertDialogContent className="font-['Poppins']">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Durum Güncelleme</AlertDialogTitle>
                        <AlertDialogDescription>
                            Teklif durumunu <span className="font-normal text-slate-900">"{pendingStatus}"</span> olarak güncellemek istediğinizden emin misiniz?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmStatusChange}
                            className="bg-orange-500 hover:bg-orange-600 rounded-xl text-white font-normal"
                        >
                            Güncelle
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <OfferForm initialData={offer} isEdit={true} readOnly={isReadOnly} />

            <QuestionChatModal
                isOpen={isQuestionModalOpen}
                onClose={() => setIsQuestionModalOpen(false)}
                offer={offer}
                questionText={questionText}
                setQuestionText={setQuestionText}
                handleSendQuestion={handleSendQuestion}
                isCustomer={isCustomer}
            />

            <OfferHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                offer={offer}
                isCustomer={isCustomer}
            />
        </div>
    )
}
