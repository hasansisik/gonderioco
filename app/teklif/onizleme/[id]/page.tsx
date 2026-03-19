"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { server } from "@/config"
import { CheckCircle2, XCircle, RotateCcw, Printer, Maximize2, Minimize2, ChevronRight, ChevronLeft, Eye, MoreVertical } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function PublicQuotePage() {
    const params = useParams()
    const id = params.id as string
    const [offer, setOffer] = useState<any>(null)
    const [settings, setSettings] = useState<any>(null)
    const [departments, setDepartments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showRevisionInput, setShowRevisionInput] = useState(false)
    const [revisionNote, setRevisionNote] = useState("")
    const [isZoomed, setIsZoomed] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)

    // Dialog States
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")
    const [otherReason, setOtherReason] = useState("")

    const REJECTION_REASONS = [
        "Fiyatın bütçemizin üzerinde olması",
        "Teslimat süresinin çok uzun olması",
        "Teknik özelliklerin ihtiyacımızı karşılamaması",
        "Başka bir tedarikçiden daha uygun teklif alınması",
        "Projenin/İhtiyacın iptal edilmiş olması",
        "Diğer"
    ]

    const fetchData = async () => {
        try {
            const [offerRes, departmentsRes] = await Promise.all([
                axios.get(`${server}/offer/public/${id}`).catch(() => null),
                axios.get(`${server}/department/public`).catch(() => axios.get(`${server}/department`).catch(() => null))
            ])

            if (offerRes?.data?.offer) {
                setOffer(offerRes.data.offer)
                if (offerRes.data.settings) {
                    setSettings(offerRes.data.settings)
                }
            } else {
                setError("Teklif bulunamadı.")
            }

            if (departmentsRes?.data?.departments) {
                setDepartments(departmentsRes.data.departments)
            }

            setLoading(false)
        } catch (err) {
            console.error(err)
            setError("Bir hata oluştu.")
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchData()
        }
    }, [id])

    const handleAction = async (action: 'approve' | 'reject' | 'revision') => {
        try {
            if (action === 'approve') {
                await axios.post(`${server}/offer/public/${id}/approve`)
                toast.success("Teklif başarıyla onaylandı.")
                setIsApproveDialogOpen(false)
            } else if (action === 'reject') {
                const finalReason = rejectionReason === "Diğer" ? otherReason : rejectionReason
                if (!finalReason) {
                    toast.error("Lütfen bir reddetme sebebi seçiniz/yazınız.")
                    return
                }
                await axios.post(`${server}/offer/public/${id}/reject`, { notes: finalReason })
                toast.error("Teklif reddedildi.")
                setIsRejectDialogOpen(false)
                setRejectionReason("")
                setOtherReason("")
            } else if (action === 'revision') {
                if (!revisionNote) {
                    toast.error("Lütfen revizyon notunu giriniz.")
                    return
                }
                await axios.post(`${server}/offer/public/${id}/revision`, { notes: revisionNote })
                toast.success("Revizyon talebi iletildi.")
                setShowRevisionInput(false)
                setRevisionNote("")
            }
            fetchData()
        } catch (err) {
            toast.error("İşlem sırasında bir hata oluştu.")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (error || !offer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
                <p className="text-slate-500 font-medium">{error || "Teklif bulunamadı."}</p>
            </div>
        )
    }

    const pdfSettings = settings?.pdfSettings || {}
    const personel = offer.personel
    let authorizedPersonName = "Belirtilmemiş"
    let authorizedPersonDept = ""
    let authorizedPersonEmail = "-"
    let authorizedPersonPhone = "-"

    if (personel && typeof personel === 'object') {
        authorizedPersonName = `${personel.name || ''} ${personel.surname || ''}`.trim()
        if (personel.department) {
            if (typeof personel.department === 'object' && personel.department.name) {
                authorizedPersonDept = `(${personel.department.name})`
            } else if (typeof personel.department === 'string') {
                const dept = departments.find((d: any) => d._id === personel.department)
                if (dept) authorizedPersonDept = `(${dept.name})`
            }
        }
        authorizedPersonEmail = personel.email || "-"
        authorizedPersonPhone = personel.phoneNumber || "-"
    }

    const customer = (offer.musteri && typeof offer.musteri === 'object') ? offer.musteri : { company: offer.musteri || "" }
    const formattedDate = offer.tarih ? new Date(offer.tarih).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"

    return (
        <div className={cn(
            "min-h-screen bg-slate-100 py-10 print:p-0 print:bg-white relative transition-all duration-500",
            isZoomed && "py-0 bg-slate-900"
        )}>
            {/* Background Image */}
            {pdfSettings.background && !isZoomed && (
                <div className="fixed inset-0 z-0">
                    <img
                        src={pdfSettings.background}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Vertical Action Bar - Fixed on Right */}
            <div className={cn(
                "fixed top-6 right-6 z-[100] flex flex-col items-end gap-3 print:hidden transition-all duration-500 ease-in-out",
                isMinimized ? "translate-x-[500px] opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
            )}>
                {/* Status and Primary Actions (Stacked Vertically) */}
                <div className="bg-white/95 backdrop-blur-xl border border-slate-200 p-3 rounded-[2.5rem] shadow-2xl flex flex-col gap-3 min-w-[180px]">
                    {/* Header of Action Bar with Minimize Button */}
                    <div className="flex items-center justify-between pl-4 pr-1">
                        <span className="text-[11px] font-normal text-slate-400">Seçenekler</span>
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    </div>

                    <div className="px-2">
                        <div className={cn(
                            "px-4 py-2.5 rounded-2xl text-[11px] font-normal border text-center shadow-sm",
                            offer.status?.includes('Onay') ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                offer.status?.includes('Red') ? "bg-rose-50 text-rose-600 border-rose-100" :
                                    "bg-slate-50 text-slate-500 border-slate-100"
                        )}>
                            {offer.status || "Beklemede"}
                        </div>
                    </div>

                    {offer.status === 'Müşteri Onayı Bekleniyor' && (
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setIsApproveDialogOpen(true)}
                                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-emerald-500 text-white rounded-[1.25rem] text-[12px] font-normal hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <CheckCircle2 className="size-4" />
                                <span>Teklifi Onayla</span>
                            </button>
                            <button
                                onClick={() => setShowRevisionInput(!showRevisionInput)}
                                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-orange-500 text-white rounded-[1.25rem] text-[12px] font-normal hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-orange-500/20"
                            >
                                <RotateCcw className="size-4" />
                                <span>Revizyon İste</span>
                            </button>
                            <button
                                onClick={() => setIsRejectDialogOpen(true)}
                                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-rose-500 text-white rounded-[1.25rem] text-[12px] font-normal hover:bg-rose-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-rose-500/20"
                            >
                                <XCircle className="size-4" />
                                <span>Teklifi Reddet</span>
                            </button>
                        </div>
                    )}

                    {/* Utils (Print & Zoom) */}
                    <div className="border-t border-slate-100 mt-1 pt-4 flex items-center justify-center gap-2">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 h-12 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 hover:text-slate-800 transition-all flex items-center justify-center"
                            title="Yazdır"
                        >
                            <Printer className="size-5" />
                        </button>
                        <button
                            onClick={() => setIsZoomed(!isZoomed)}
                            className={cn(
                                "flex-1 h-12 rounded-2xl transition-all flex items-center justify-center",
                                isZoomed ? "bg-orange-500 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            )}
                            title={isZoomed ? "Küçült" : "Büyüt"}
                        >
                            {isZoomed ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Prominent Restore Button when minimized */}
            <button
                onClick={() => setIsMinimized(false)}
                className={cn(
                    "fixed top-6 right-6 z-[110] size-14 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl flex items-center justify-center text-orange-500 hover:scale-110 active:scale-95 transition-all print:hidden",
                    !isMinimized && "opacity-0 invisible pointer-events-none scale-90"
                )}
            >
                <MoreVertical className="size-7" />
            </button>

            {/* Revision Input Modal/Popover (Fixed Overlay) */}
            {showRevisionInput && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl w-full max-w-[400px] animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-normal text-slate-800">Revizyon Notu</h3>
                            <button onClick={() => setShowRevisionInput(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="size-5" />
                            </button>
                        </div>
                        <textarea
                            value={revisionNote}
                            onChange={(e) => setRevisionNote(e.target.value)}
                            placeholder="Değişiklik talebinizi buraya detaylıca yazabilirsiniz..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/10 min-h-[160px] resize-none"
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowRevisionInput(false)}
                                className="flex-1 py-4 rounded-2xl text-[12px] font-normal text-slate-400 hover:bg-slate-50 transition-all"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={() => handleAction('revision')}
                                className="flex-[2] py-4 bg-orange-500 text-white rounded-2xl text-[12px] font-normal shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all font-normal"
                            >
                                Talebi Gönder
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={cn(
                "w-full max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[297mm] relative z-10 flex flex-col transition-all duration-500 origin-top overflow-hidden",
                isZoomed ? "max-w-none w-full scale-100 py-0" : "my-0 sm:my-10"
            )}>
                {/* Header Image */}
                <div className="w-full">
                    {pdfSettings.header ? (
                        <img
                            src={pdfSettings.header}
                            alt="Header"
                            className="w-full h-auto object-cover max-h-[150px] w-full"
                        />
                    ) : (
                        <div className="h-32 bg-slate-50 border-b border-slate-200 flex items-center justify-center text-slate-400 text-sm italic">Logo / Header Görseli</div>
                    )}
                </div>

                {/* Info Section (Bordered Box) */}
                <div className="px-4 sm:px-12 py-6 sm:py-8">
                    <div className="border border-slate-800 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
                        {/* Left Side: Customer Info */}
                        <div className="flex-1 p-5 sm:p-6 flex flex-col gap-4">
                            <div>
                                <h2 className="font-normal text-slate-900 text-xs sm:text-sm mb-1">{customer.company || "ALICI FİRMA"}</h2>
                                {(customer.contactName || customer.person) && (
                                    <div className="text-[11px] sm:text-xs font-normal text-slate-800">YETKİLİ: {customer.contactName || customer.person}</div>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5 text-[10px] sm:text-xs">
                                {(customer.address || customer.district || customer.city) && (
                                    <div className="flex justify-between sm:grid sm:grid-cols-[80px_1fr] gap-2">
                                        <span className="font-normal text-slate-800">Adres:</span>
                                        <span className="font-medium text-slate-600 text-right sm:text-left leading-relaxed">
                                            {[customer.address, customer.district, customer.city].filter(Boolean).join(" ")}
                                        </span>
                                    </div>
                                )}
                                {(customer.email || customer.contactEmail) && (
                                    <div className="flex justify-between sm:grid sm:grid-cols-[80px_1fr] gap-2">
                                        <span className="font-normal text-slate-800">E-Posta:</span>
                                        <span className="font-medium text-slate-600 text-right sm:text-left">{customer.email || customer.contactEmail}</span>
                                    </div>
                                )}
                                {(customer.phone || customer.contactPhone) && (
                                    <div className="flex justify-between sm:grid sm:grid-cols-[80px_1fr] gap-2">
                                        <span className="font-normal text-slate-800">Telefon:</span>
                                        <span className="font-medium text-slate-600 text-right sm:text-left">{customer.phone || customer.contactPhone}</span>
                                    </div>
                                )}
                                {(customer.taxNumber || customer.taxOffice) && (
                                    <div className="flex justify-between sm:grid sm:grid-cols-[80px_1fr] gap-2">
                                        <span className="font-normal text-slate-800">V.D / TCKN:</span>
                                        <span className="font-medium text-slate-600 text-right sm:text-left">
                                            {customer.taxOffice ? `${customer.taxOffice} - ` : ''}{customer.taxNumber || "-"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Quote Info */}
                        <div className="flex-1 p-5 sm:p-6 flex flex-col gap-1.5 text-[10px] sm:text-xs">
                            <h2 className="font-normal text-slate-900 text-xs sm:text-sm mb-1">FİRMA BİLGİLERİ</h2>
                            <div className="flex justify-between sm:grid sm:grid-cols-[100px_1fr] gap-2">
                                <span className="font-normal text-slate-800">Teklif No:</span>
                                <span className="font-medium text-slate-600 text-right sm:text-left">{offer.offerNumber || '-'}</span>
                            </div>
                            <div className="flex justify-between sm:grid sm:grid-cols-[100px_1fr] gap-2">
                                <span className="font-normal text-slate-800">Tarih:</span>
                                <span className="font-medium text-slate-600 text-right sm:text-left">{formattedDate}</span>
                            </div>
                            <div className="flex justify-between sm:grid sm:grid-cols-[100px_1fr] gap-2">
                                <span className="font-normal text-slate-800">Yetkili:</span>
                                <span className="font-medium text-slate-600 text-right sm:text-left">{authorizedPersonName}</span>
                            </div>
                            <div className="flex justify-between sm:grid sm:grid-cols-[100px_1fr] gap-2">
                                <span className="font-normal text-slate-800">E-Posta:</span>
                                <span className="font-medium text-slate-600 text-right sm:text-left truncate ml-4 sm:ml-0">{authorizedPersonEmail}</span>
                            </div>
                            <div className="flex justify-between sm:grid sm:grid-cols-[100px_1fr] gap-2">
                                <span className="font-normal text-slate-800">Telefon:</span>
                                <span className="font-medium text-slate-600 text-right sm:text-left">{authorizedPersonPhone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Title & Form Name */}
                <div className="text-center mb-6 sm:mb-8 px-4">
                    <h1 className="text-lg sm:text-xl font-normal text-[#1e3a8a]">NOVA STEEL</h1>
                    <h2 className="text-xs sm:text-sm font-normal text-slate-900 mt-1 opacity-80">TEKLİF FORMU</h2>
                </div>


                {/* Content */}
                <div className="px-6 sm:px-12 flex-1 flex flex-col gap-6 w-full max-w-full overflow-hidden">

                    {/* HTML Content (Notes/Evrak Icerigi) */}
                    <div className="prose prose-slate max-w-full prose-sm leading-snug break-words text-slate-700">
                        <div dangerouslySetInnerHTML={{ __html: offer.evrakIcerigi || "" }} />
                    </div>

                    {/* Products Table */}
                    {offer.urunler && offer.urunler.length > 0 && (
                        <div className="mt-4 w-full">
                            <div className="bg-[#e2e8f0] py-2 px-4 text-[11px] sm:text-xs font-normal text-slate-800 text-center border border-slate-300">
                                {offer.title || offer.konu || "ÜRÜN VE HİZMET LİSTESİ"}
                            </div>
                            <div className="overflow-x-auto w-full border-x border-b border-slate-300">
                                <table className="w-full text-left text-[10px] sm:text-xs border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-800 border-b border-slate-300">
                                            <th className="py-2.5 px-4 font-normal border-r border-slate-300 w-[40%]">MALZEME / HİZMET</th>
                                            <th className="py-2.5 px-4 font-normal border-r border-slate-300 text-center">MİKTAR</th>
                                            <th className="py-2.5 px-4 font-normal border-r border-slate-300 text-center">BİRİM</th>
                                            <th className="py-2.5 px-4 font-normal border-r border-slate-300 text-right">BİRİM FİYAT</th>
                                            <th className="py-2.5 px-4 font-normal text-right">TOPLAM</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-700">
                                        {offer.urunler.map((u: any, i: number) => (
                                            <tr key={i} className="border-b border-slate-200 last:border-0 hover:bg-slate-50/50 transition-colors">
                                                <td className="py-2.5 px-4 font-medium border-r border-slate-300">
                                                    <div className="font-normal text-slate-900">{u.urunAdi || u.name}</div>
                                                    {u.aciklama && <div className="text-[9px] text-slate-500 mt-0.5">{u.aciklama}</div>}
                                                </td>
                                                <td className="py-2.5 px-4 text-center border-r border-slate-300 font-normal">{u.miktar}</td>
                                                <td className="py-2.5 px-4 text-center border-r border-slate-300 font-normal">{u.birim}</td>
                                                <td className="py-2.5 px-4 text-right border-r border-slate-300 font-normal whitespace-nowrap">
                                                    {u.birimFiyat} {offer.paraBirimi === 'TRY' ? 'TL' : offer.paraBirimi}
                                                </td>
                                                <td className="py-2.5 px-4 text-right font-normal whitespace-nowrap">
                                                    {u.toplamTutar} {offer.paraBirimi === 'TRY' ? 'TL' : offer.paraBirimi}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-50">
                                            <td colSpan={4} className="py-3 px-4 text-right font-normal text-slate-800 border-r border-slate-300 text-[10px]">GENEL TOPLAM</td>
                                            <td className="py-3 px-4 text-right font-semibold text-xs sm:text-sm text-slate-900 whitespace-nowrap">
                                                {offer.urunler.reduce((acc: number, curr: any) => acc + (Number(curr.toplamTutar) || 0), 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {offer.paraBirimi === 'TRY' ? 'TL' : offer.paraBirimi}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Image */}
                <div className="w-full mt-auto pt-10">
                    {pdfSettings.footer ? (
                        <img
                            src={pdfSettings.footer}
                            alt="Footer"
                            className="w-full h-auto object-cover max-h-[150px] w-full"
                        />
                    ) : (
                        <div className="h-16 bg-slate-50 border-t border-slate-200 flex items-center justify-center text-slate-400 text-sm italic">İletişim Bilgileri / Footer Görseli</div>
                    )}
                </div>
            </div>

            {/* Approve Confirmation Dialog */}
            <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Teklifi Onayla</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu teklifi onaylamak istediğinizden emin misiniz? Bu işlem geri alınamaz ve teklif durumu güncelleştirilecektir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleAction('approve')}
                            className="bg-emerald-500 hover:bg-emerald-600"
                        >
                            Evet, Onayla
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Reason Dialog */}
            <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <AlertDialogContent className="sm:max-w-[420px]">
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
                        }}>Vazgeç</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleAction('reject')}
                            className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50"
                            disabled={!rejectionReason || (rejectionReason === "Diğer" && !otherReason)}
                        >
                            Teklifi Reddet
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
