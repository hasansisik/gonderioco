import { Dialog, DialogContent } from "@/components/ui/dialog"
import { HelpCircle, Send, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionChatModalProps {
    isOpen: boolean
    onClose: () => void
    offer: any
    questionText: string
    setQuestionText: (text: string) => void
    handleSendQuestion: () => void
    isCustomer?: boolean
}

export function QuestionChatModal({
    isOpen,
    onClose,
    offer,
    questionText,
    setQuestionText,
    handleSendQuestion,
    isCustomer
}: QuestionChatModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] gap-0 p-0 overflow-hidden border-none shadow-2xl rounded-3xl font-['Poppins'] [&>button]:hidden">
                <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <HelpCircle className="size-5 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-normal">Teklif Soru/Cevap</h3>
                            <p className="text-[11px] text-white/50 font-normal">#{offer?.offerNumber || 'TEKLİF'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="p-6 bg-slate-50 max-h-[360px] min-h-[200px] overflow-y-auto flex flex-col gap-5 custom-scrollbar">
                    {offer?.questions?.length > 0 ? (
                        offer.questions.map((msg: any, i: number) => {
                            const isMe = (isCustomer && msg.role === 'customer') || (!isCustomer && msg.role === 'provider');
                            return (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex flex-col max-w-[88%] gap-1.5",
                                        isMe ? "ml-auto items-end" : "items-start"
                                    )}
                                >
                                    <div className="flex items-center gap-2 px-1">
                                        {!isMe && <span className="text-[10px] font-normal text-orange-500">{msg.senderName}</span>}
                                        {isMe && <span className="text-[10px] font-normal text-slate-400">SİZ</span>}
                                        <span className="text-[9px] font-normal text-slate-300">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div
                                        className={cn(
                                            "px-4 py-3 rounded-2xl text-[12px] font-normal shadow-sm leading-relaxed",
                                            isMe
                                                ? "bg-slate-900 text-white rounded-tr-none"
                                                : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                                        )}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-12 text-center space-y-4">
                            <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto border border-slate-200 shadow-inner">
                                <HelpCircle className="size-7 text-slate-300" />
                            </div>
                            <p className="text-[11px] font-normal text-slate-400 leading-loose border-none">
                                Henüz soru sorulmamış.<br />Hızlıca iletişime geçin.
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="relative flex items-center gap-2">
                        <input
                            placeholder="Mesajınızı buraya yazınız..."
                            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-[11px] font-normal focus:ring-4 focus:ring-slate-900/5 transition-all outline-none"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
                        />
                        <button
                            onClick={handleSendQuestion}
                            disabled={!questionText.trim()}
                            className="size-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                        >
                            <Send className="size-5" />
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
