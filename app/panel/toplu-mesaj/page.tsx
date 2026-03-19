"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { sendMassMessage, getMassMessageHistory } from "@/redux/actions/massMessageActions"
import { getAllCustomers } from "@/redux/actions/customerActions"
import { useEffect, useState, useMemo } from "react"
import { PermissionGuard } from "@/components/permission-guard"
import {
    Send,
    Users,
    Info,
    Clock,
    CheckCircle2,
    Search,
    X,
    MoreHorizontal,
    Mail,
    UserCheck,
    MessageSquare,
    ChevronRight,
    ArrowRight,
    Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { SelectModal } from "@/components/ui/select-modal"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

export default function TopluMesajPage() {
    const dispatch = useAppDispatch()
    const { history, loading: massLoading } = useAppSelector((state) => state.massMessage)
    const { customers, loading: customersLoading } = useAppSelector((state) => state.customer)

    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
    const [messageContent, setMessageContent] = useState("")
    const [selectedMessage, setSelectedMessage] = useState<any>(null)

    useEffect(() => {
        dispatch(getMassMessageHistory())
        dispatch(getAllCustomers())
    }, [dispatch])

    const customersWithAccount = useMemo(() => {
        return customers.filter(c => c.hasAccount && c.userAccount);
    }, [customers]);

    const getMessagingId = (customer: any) => {
        if (!customer) return null;
        if (customer.userAccount) {
            return typeof customer.userAccount === 'object' ? customer.userAccount._id : customer.userAccount;
        }
        return customer._id;
    };

    const handleSelectAll = () => {
        if (selectedRecipients.length === customersWithAccount.length) {
            setSelectedRecipients([])
        } else {
            setSelectedRecipients(customersWithAccount.map(c => getMessagingId(c)))
        }
    }

    const toggleRecipient = (id: string) => {
        setSelectedRecipients(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        )
    }

    const handleSend = async () => {
        if (selectedRecipients.length === 0) {
            toast.error("Lütfen en az bir alıcı seçin.")
            return
        }
        if (!messageContent.trim()) {
            toast.error("Lütfen mesaj içeriği yazın.")
            return
        }

        const result = await dispatch(sendMassMessage({
            recipientIds: selectedRecipients,
            messageContent
        }))

        if (sendMassMessage.fulfilled.match(result)) {
            toast.success("Toplu mesaj başarıyla gönderildi.")
            setMessageContent("")
            setSelectedRecipients([])
        } else {
            toast.error(result.payload as string || "Mesaj gönderilirken bir hata oluştu.")
        }
    }

    return (
        <PermissionGuard permissions={["Toplu Mesaj Gönder"]}>
            <div className="flex flex-col gap-6">
                {/* Header section matching Prim Sistemi */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Müşterilerinize tek seferde kurumsal duyurularınızı ulaştırın.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Main Interaction Area (Left Side) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                            <div className="p-8 space-y-8">
                                {/* Recipient Selection */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[11px] font-medium text-slate-400 uppercase ">ALICI SEÇİMİ</h3>
                                        <button
                                            onClick={handleSelectAll}
                                            className="text-[11px] font-medium text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-1.5 group"
                                        >
                                            <UserCheck className="size-3.5" />
                                            {selectedRecipients.length === customersWithAccount.length ? "HEPSİNİ KALDIR" : "TÜMÜNÜ SEÇ"}
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <SelectModal
                                            label=""
                                            value={selectedRecipients}
                                            onChange={(val) => setSelectedRecipients(val)}
                                            options={customersWithAccount.map(c => ({
                                                id: getMessagingId(c),
                                                label: c.company || c.person
                                            }))}
                                            placeholder="Gönderilecek müşterileri arayın veya seçin..."
                                            multiple={true}
                                            icon={Users}
                                            className="!mt-0"
                                        />

                                        {selectedRecipients.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {selectedRecipients.map(id => {
                                                    const customer = customersWithAccount.find(c => getMessagingId(c) === id);
                                                    return customer ? (
                                                        <div key={id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 hover:border-orange-200 transition-all">
                                                            <span className="text-[11px] font-medium truncate max-w-[150px]">
                                                                {customer.company || customer.person}
                                                            </span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleRecipient(id);
                                                                }}
                                                                className="text-slate-300 hover:text-rose-500 transition-colors"
                                                            >
                                                                <X className="size-3" />
                                                            </button>
                                                        </div>
                                                    ) : null;
                                                })}
                                                <div className="flex items-center gap-1 px-3 py-1.5 text-slate-400 font-medium text-[11px]">
                                                    {selectedRecipients.length} Alıcı Seçili
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Message Textarea */}
                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-medium text-slate-400 uppercase ">MESAJ İÇERİĞİ</h3>
                                    <div className="relative group">
                                        <textarea
                                            rows={8}
                                            value={messageContent}
                                            onChange={(e) => setMessageContent(e.target.value)}
                                            placeholder="Mesajınızı buraya yazın..."
                                            className="w-full bg-slate-50/30 border border-slate-200/60 rounded-2xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 focus:bg-white focus:border-slate-300 transition-all resize-none placeholder:text-slate-300"
                                        />

                                        <div className="absolute bottom-6 right-6 flex items-center gap-2 text-[10px] font-medium text-slate-300 pointer-events-none group-focus-within:text-slate-400 transition-colors">
                                            <MessageSquare className="size-3" />
                                            {messageContent.length} Karakter
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={massLoading}
                                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-xl font-medium text-[13px] transition-all flex items-center justify-center gap-3 group"
                                >
                                    {massLoading ? (
                                        <div className="size-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    ) : (
                                        <>
                                            <span>MESAJI GÖNDER</span>
                                            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* History Column (Right Side) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-slate-800" />
                                    <h3 className="text-sm font-medium text-slate-800 ">Geçmiş</h3>
                                </div>
                                {history.length > 0 && (
                                    <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg uppercase ">{history.length}</span>
                                )}
                            </div>

                            <div className="p-4 space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
                                {history.length === 0 && !massLoading ? (
                                    <div className="py-20 text-center text-slate-300 font-medium italic text-xs">
                                        Henüz bir gönderim kaydı bulunmuyor.
                                    </div>
                                ) : (
                                    history.map((msg) => (
                                        <div
                                            key={msg._id}
                                            onClick={() => setSelectedMessage(msg)}
                                            className="group bg-white hover:bg-slate-50 p-5 rounded-2xl border border-slate-50 hover:border-slate-200 transition-all duration-200 cursor-pointer space-y-3 shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="size-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                        <Users className="size-3" />
                                                    </div>
                                                    <span className="text-[11px] font-medium text-slate-700">{msg.recipients?.length || 0} ALICI</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-semibold uppercase ">
                                                    {format(new Date(msg.createdAt), 'dd MMM', { locale: tr })}
                                                </span>
                                            </div>
                                            <p className="line-clamp-2 text-xs text-slate-500 leading-relaxed font-medium">
                                                {msg.message}
                                            </p>
                                            <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                                                <span className="text-[10px] font-medium text-slate-400 truncate max-w-[120px] uppercase">
                                                    {msg.companyName || (msg.sender && msg.sender.name) || 'Sistem'}
                                                </span>
                                                <div className="text-[10px] font-medium text-slate-300 group-hover:text-slate-600 transition-colors flex items-center gap-1">
                                                    DETAY <ArrowRight className="size-2.5" />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {massLoading && history.length === 0 && (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-32 bg-slate-50 rounded-2xl animate-pulse" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Detail Modal */}
                <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
                    <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white border-none rounded-[2rem] shadow-2xl">
                        {selectedMessage && (
                            <div className="flex flex-col max-h-[85vh]">
                                <div className="p-8 pb-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-slate-100 p-2 rounded-xl text-slate-500">
                                            <Mail className="size-5" />
                                        </div>
                                        <h3 className="text-xl font-medium text-slate-800 ">Gönderim Detayı</h3>
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium">
                                        {format(new Date(selectedMessage.createdAt), 'dd MMMM yyyy HH:mm', { locale: tr })} tarihinde gönderildi.
                                    </p>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-8 custom-scrollbar">
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-medium text-slate-400 uppercase ">Mesaj İçeriği</span>
                                        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap italic">
                                                "{selectedMessage.message}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-medium text-slate-400 uppercase ">Alıcı Listesi</span>
                                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                                                {selectedMessage.recipients?.length || 0} KİŞİ
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedMessage.recipients?.map((recipient: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-200 transition-all">
                                                    <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-medium text-slate-400 border border-slate-100 uppercase">
                                                        {(recipient.name || recipient.company || "?").charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[12px] font-medium text-slate-700 truncate">
                                                            {recipient.name} {recipient.surname}
                                                        </p>
                                                        {recipient.company && (
                                                            <p className="text-[10px] text-slate-400 font-medium truncate uppercase">
                                                                {recipient.company}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-1">
                                            <p className="text-[10px] font-medium text-slate-400 uppercase ">Gönderen Firma</p>
                                            <p className="text-xs font-medium text-slate-700 uppercase">{selectedMessage.companyName || (selectedMessage.sender && selectedMessage.sender.name) || 'Sistem'}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-1 text-right">
                                            <p className="text-[10px] font-medium text-slate-400 uppercase ">Durum</p>
                                            <div className="flex items-center justify-end gap-1.5 text-xs font-medium text-emerald-500">
                                                <CheckCircle2 className="size-3.5" />
                                                TAMAMLANDI
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 pt-4">
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl font-medium text-[12px] transition-all"
                                    >
                                        KAPAT
                                    </button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </PermissionGuard>
    )
}
