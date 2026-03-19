import { Dialog, DialogContent } from "@/components/ui/dialog"
import { History, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface OfferHistoryModalProps {
    isOpen: boolean
    onClose: () => void
    offer: any
    isCustomer?: boolean
}

export function OfferHistoryModal({ isOpen, onClose, offer, isCustomer }: OfferHistoryModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem] font-['Poppins'] [&>button]:hidden">
                <div className="bg-slate-900 p-8 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <History className="size-24 rotate-12" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 relative z-10 flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-white/10 flex items-center justify-center">
                            <History className="size-5 text-blue-400" />
                        </div>
                        Teklif Hareketleri
                    </h2>
                    <p className="text-slate-400 text-xs font-medium relative z-10">Teklifin oluşturulmasından bugüne tüm süreç akışı</p>

                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 size-8 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/30">
                    {offer?.statusHistory && offer.statusHistory.length > 0 ? (
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-blue-200 via-blue-100 to-transparent" />

                            <div className="space-y-4">
                                {[...offer.statusHistory]
                                    .filter((h: any) => {
                                        if (isCustomer) {
                                            const internal = ['Taslak', 'Yönetici Onayı Bekliyor', 'Yönetici Onayladı', 'Yönetici Reddetti'];
                                            return !internal.includes(h.status);
                                        }
                                        return true;
                                    })
                                    .reverse()
                                    .map((history: any, index: number) => {
                                        const isFirst = index === 0;
                                        const date = new Date(history.changedAt);
                                        const formattedDate = date.toLocaleDateString('tr-TR', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        });
                                        const formattedTime = date.toLocaleTimeString('tr-TR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });

                                        // Status color mapping
                                        const getStatusColor = (status: string) => {
                                            if (status.includes('Onay')) return 'emerald';
                                            if (status.includes('Red')) return 'rose';
                                            if (status.includes('Revizyon')) return 'orange';
                                            if (status.includes('Sevkiyat') || status.includes('Tamamlandı')) return 'blue';
                                            if (status.includes('İptal')) return 'slate';
                                            return 'slate';
                                        };

                                        const color = getStatusColor(history.status);

                                        return (
                                            <div key={index} className="relative flex gap-4 group">
                                                {/* Timeline Dot */}
                                                <div className={cn(
                                                    "relative z-10 size-10 rounded-full flex items-center justify-center shrink-0 transition-all",
                                                    isFirst ? "ring-4 shadow-lg bg-blue-500 ring-blue-100" : "border-2 bg-slate-100 border-slate-200"
                                                )}>
                                                    <div className={cn(
                                                        "size-2 rounded-full",
                                                        isFirst ? "bg-white" : "bg-slate-400"
                                                    )} />
                                                </div>

                                                {/* Content Card */}
                                                <div className={cn(
                                                    "flex-1 rounded-2xl p-4 transition-all shadow-sm border",
                                                    isFirst ? "bg-blue-50 border-blue-100" : "bg-white border-slate-100"
                                                )}>
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <div className="flex-1">
                                                            <div className={cn(
                                                                "text-xs font-normal mb-1",
                                                                isFirst ? "text-blue-700 font-medium" : "text-slate-700"
                                                            )}>
                                                                {history.status}
                                                            </div>
                                                            <div className="text-[11px] font-normal text-slate-400">
                                                                {history.changedBy}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[10px] font-normal text-slate-500">
                                                                {formattedDate}
                                                            </div>
                                                            <div className="text-[10px] font-normal text-slate-400">
                                                                {formattedTime}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {history.note && (
                                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                                            <p className="text-xs text-slate-600 leading-relaxed">
                                                                {history.note}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <History className="size-12 mx-auto mb-3 opacity-20" />
                            <p className="text-sm font-medium">Henüz hareket kaydı bulunmuyor</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-slate-100 flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-normal hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        Pencereyi Kapat
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
