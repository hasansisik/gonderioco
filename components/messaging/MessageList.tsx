import { cn } from "@/lib/utils";
import { Check, CheckCheck, Download, Eye, FileText, Image as ImageIcon, Video, X } from "lucide-react";
import { Message } from "@/redux/actions/messageActions";
import { format, isSameDay, isToday, isYesterday } from "date-fns";
import { tr } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { MessageActions } from "./MessageActions";
import { useDispatch } from "react-redux";
import { editMessage, deleteMessage } from "@/redux/actions/messageActions";
import { toast } from "sonner";
import { UserAvatar } from "@/components/ui/user-avatar";

interface MessageListProps {
    messages: Message[];
    currentUserId?: string;
    typingUsers: string[];
    onlineUsers: string[];
    onEdit?: (message: Message) => void;
    onDelete?: (messageId: string) => void;
    loading?: boolean;
    canEditOwnMessage?: boolean;
    canDeleteOwnMessage?: boolean;
    isMassMessage?: boolean;
    massMessageName?: string;
    massMessageAvatar?: string;
}

export const MessageList = ({
    messages,
    currentUserId,
    typingUsers,
    onEdit,
    onDelete,
    loading,
    canEditOwnMessage,
    canDeleteOwnMessage,
    isMassMessage,
    massMessageName,
    massMessageAvatar,
}: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "HH:mm", { locale: tr });
    };

    const formatDateSeparator = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return "Bugün";
        } else if (isYesterday(date)) {
            return "Dün";
        } else {
            return format(date, "EEEE, d MMMM", { locale: tr });
        }
    };

    const shouldShowDateSeparator = (currentMsg: Message, prevMsg?: Message) => {
        if (!prevMsg) return true;
        return !isSameDay(new Date(currentMsg.createdAt), new Date(prevMsg.createdAt));
    };

    const isMessageRead = (message: Message) => {
        // Check if any participant other than the sender has read the message
        const senderId = String(message.sender?._id);
        return message.readBy.some(id => String(id) !== senderId);
    };

    const isMessageDelivered = (message: Message) => {
        return message.deliveredTo.length > 0;
    };

    const isSentByCurrentUser = (message: Message) => {
        const senderId = String(message.sender?._id);
        const userId = String(currentUserId);
        return senderId === userId;
    };

    const getFileName = (url: string) => {
        try {
            const urlParts = url.split('/');
            const fileNameWithParams = urlParts[urlParts.length - 1];
            const fileName = fileNameWithParams.split('?')[0];
            return decodeURIComponent(fileName);
        } catch {
            return 'Dosya';
        }
    };

    const handleDownload = (url: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderMessageContent = (message: Message, isSent: boolean) => {
        const baseClasses = isSent
            ? "rounded-2xl rounded-tr-none bg-slate-800 shadow-xl"
            : "rounded-2xl rounded-tl-none bg-white shadow-sm border border-slate-100";

        // Image message
        if (message.messageType === 'image') {
            return (
                <div className={cn(baseClasses, "overflow-hidden p-2")}>
                    <img
                        src={message.content}
                        alt="Shared image"
                        className="max-w-[140px] max-h-[180px] rounded-lg object-cover cursor-pointer"
                        onClick={() => setImagePreview(message.content)}
                    />
                    <div className="flex items-center gap-2 mt-2 px-2">
                        <button
                            onClick={() => setImagePreview(message.content)}
                            className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all",
                                isSent
                                    ? "bg-slate-700 text-white hover:bg-slate-600"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            )}
                        >
                            <Eye className="size-3.5" />
                            Görüntüle
                        </button>
                        <button
                            onClick={() => handleDownload(message.content, getFileName(message.content))}
                            className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all",
                                isSent
                                    ? "bg-slate-700 text-white hover:bg-slate-600"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            )}
                        >
                            <Download className="size-3.5" />
                            İndir
                        </button>
                    </div>
                </div>
            );
        }

        // Video message
        if (message.messageType === 'video') {
            return (
                <div className={cn(baseClasses, "overflow-hidden p-2")}>
                    <video
                        src={message.content}
                        controls
                        className="max-w-[140px] max-h-[180px] rounded-lg"
                    />
                    <div className="flex items-center gap-2 mt-2 px-2">
                        <button
                            onClick={() => handleDownload(message.content, getFileName(message.content))}
                            className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all",
                                isSent
                                    ? "bg-slate-700 text-white hover:bg-slate-600"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            )}
                        >
                            <Download className="size-3.5" />
                            İndir
                        </button>
                    </div>
                </div>
            );
        }

        // File/Document message
        if (message.messageType === 'file') {
            const fileName = getFileName(message.content);
            return (
                <div className={cn(baseClasses, "p-4")}>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "size-12 rounded-xl flex items-center justify-center",
                            isSent ? "bg-slate-700" : "bg-orange-50"
                        )}>
                            <FileText className={cn(
                                "size-6",
                                isSent ? "text-white" : "text-orange-500"
                            )} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={cn(
                                "text-sm font-bold truncate",
                                isSent ? "text-white" : "text-slate-700"
                            )}>
                                {fileName}
                            </p>
                            <p className={cn(
                                "text-xs",
                                isSent ? "text-slate-400" : "text-slate-500"
                            )}>
                                Döküman
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <button
                            onClick={() => window.open(message.content, '_blank')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all",
                                isSent
                                    ? "bg-slate-700 text-white hover:bg-slate-600"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            )}
                        >
                            <Eye className="size-3.5" />
                            Görüntüle
                        </button>
                        <button
                            onClick={() => handleDownload(message.content, fileName)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all",
                                isSent
                                    ? "bg-slate-700 text-white hover:bg-slate-600"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            )}
                        >
                            <Download className="size-3.5" />
                            İndir
                        </button>
                    </div>
                </div>
            );
        }

        // Text message (default)
        return (
            <div className={cn(baseClasses, "py-2 px-3")}>
                <span className={cn(
                    "text-[12px] leading-relaxed",
                    isSent ? "text-white" : "text-slate-700"
                )}>
                    {message.content}
                </span>
                {message.isEdited && (
                    <span className="text-[9px] text-slate-400 ml-2">
                        (düzenlendi)
                    </span>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Image Preview Modal */}
            {imagePreview && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setImagePreview(null)}
                >
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setImagePreview(null)}
                        className="absolute top-4 right-4 size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50/20 scroll-smooth">
                <div className="min-h-full flex flex-col justify-end p-4 space-y-4">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="size-8 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
                                <p className="text-slate-400 text-sm font-medium animate-pulse">
                                    Mesajlar yükleniyor...
                                </p>
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-slate-400 text-sm font-medium">
                                Henüz mesaj yok. İlk mesajı gönderin!
                            </p>
                        </div>
                    ) : (
                        messages.map((message, index) => {
                            const showDateSeparator = shouldShowDateSeparator(
                                message,
                                messages[index - 1]
                            );
                            const isSent = isSentByCurrentUser(message);

                            return (
                                <div key={message._id}>
                                    {/* Date Separator */}
                                    {showDateSeparator && (
                                        <div className="flex items-center gap-4 justify-center mb-6 mt-2">
                                            <div className="h-px bg-slate-100 flex-1" />
                                            <span className="text-[11px] font-medium text-slate-500 px-4 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                                                {formatDateSeparator(message.createdAt)}
                                            </span>
                                            <div className="h-px bg-slate-100 flex-1" />
                                        </div>
                                    )}

                                    {/* Message */}
                                    {isSent ? (
                                        // Sent Message
                                        <div className="flex flex-col items-end gap-1.5 ml-auto max-w-[85%] sm:max-w-[70%] group animate-in slide-in-from-right-2 duration-300">
                                            <div className="flex items-start gap-2">
                                                <MessageActions
                                                    messageId={message._id}
                                                    isSent={true}
                                                    onEdit={() => onEdit?.(message)}
                                                    onDelete={() => onDelete?.(message._id)}
                                                    onReply={() => console.log('Reply:', message._id)}
                                                    onStar={() => console.log('Star:', message._id)}
                                                    onForward={() => console.log('Forward:', message._id)}
                                                    onCopy={() => navigator.clipboard.writeText(message.content)}
                                                    onInfo={() => console.log('Info:', message._id)}
                                                    canEditOwnMessage={canEditOwnMessage}
                                                    canDeleteOwnMessage={canDeleteOwnMessage}
                                                />
                                                {renderMessageContent(message, true)}
                                            </div>
                                            <div className="flex items-center gap-1.5 mr-1">
                                                <span className="text-[9px] text-slate-400 font-bold">
                                                    {formatMessageTime(message.createdAt)}
                                                </span>
                                                {isMessageRead(message) ? (
                                                    <CheckCheck className="size-4 text-emerald-500" />
                                                ) : (
                                                    <Check className="size-4 text-slate-400" />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        // Received Message
                                        <div className="flex items-start gap-2 max-w-[85%] sm:max-w-[80%] group animate-in slide-in-from-left-2 duration-300">
                                            <UserAvatar
                                                name={isMassMessage ? massMessageName : message.sender?.name}
                                                surname={isMassMessage ? "" : message.sender?.surname}
                                                picture={isMassMessage ? massMessageAvatar : message.sender?.profile?.picture}
                                                size="sm"
                                                className="shrink-0 mt-1 ring-2 ring-white shadow-sm"
                                            />
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[11px] font-bold text-slate-600 ml-1">
                                                    {isMassMessage ? massMessageName : `${message.sender?.name} ${message.sender?.surname}`}
                                                </span>
                                                {renderMessageContent(message, false)}
                                                <span className="text-[9px] text-slate-400 font-bold ml-1">
                                                    {formatMessageTime(message.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}

                    {/* Typing Indicator */}
                    {typingUsers.length > 0 && (
                        <div className="flex items-start gap-4 max-w-[70%] animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="size-8 rounded-lg bg-slate-200 shrink-0 shadow-sm" />
                            <div className="flex flex-col gap-1.5">
                                <div className="rounded-2xl rounded-tl-none bg-white py-3 px-4 shadow-sm border border-slate-100">
                                    <div className="flex gap-1">
                                        <div className="size-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="size-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="size-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} className="h-2" />
                </div>
            </div >
        </>
    );
};
