import { cn } from "@/lib/utils";
import { Search, Hash, MessageSquare, Image as ImageIcon, Video, FileText, Mic } from "lucide-react";
import { Conversation } from "@/redux/actions/messageActions";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessagingSkeleton } from "./MessagingSkeleton";
import { UserAvatar } from "@/components/ui/user-avatar";

interface ConversationListProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (conversationId: string) => void;
    onlineUsers: string[];
    currentUserId?: string;
    loading?: boolean;
}

export const ConversationList = ({
    conversations,
    activeConversationId,
    onSelectConversation,
    onlineUsers,
    currentUserId,
    loading,
}: ConversationListProps) => {
    const getConversationTitle = (conv: Conversation) => {
        if (conv.type === "group") {
            return conv.name || "Grup Sohbeti";
        }

        if (conv.isMassMessage && conv.name) {
            return conv.name;
        }

        const otherParticipant = conv.participants.find(
            (p) => p?.participant?._id !== currentUserId
        );
        if (otherParticipant) {
            if (otherParticipant.participant) {
                return `${otherParticipant.participant.name || ""} ${otherParticipant.participant.surname || ""}`;
            }
            return "Silinmiş Kullanıcı";
        }

        return "Sohbet";
    };

    const getConversationAvatar = (conv: Conversation) => {
        if (conv.type === "group" || conv.isMassMessage) {
            return conv.avatar;
        }

        const otherParticipant = conv.participants.find(
            (p) => p?.participant?._id !== currentUserId
        );
        return otherParticipant?.participant?.profile?.picture;
    };

    const isUserOnline = (conv: Conversation) => {
        if (conv.type === "group") return false;

        const otherParticipant = conv.participants.find(
            (p) => p?.participant?._id !== currentUserId
        );

        if (!otherParticipant || !otherParticipant.participant) return false;

        // Check if user has disabled online status visibility
        if (otherParticipant.participant.showOnlineStatus === false) {
            return false;
        }

        return onlineUsers.includes(otherParticipant.participant?._id);
    };

    const getLastMessagePreview = (conv: Conversation) => {
        if (!conv.lastMessage) return "Henüz mesaj yok";

        const message = conv.lastMessage as any;

        // Check if message has messageType field
        if (message.messageType) {
            switch (message.messageType) {
                case 'image':
                    return (
                        <div className="flex items-center gap-1">
                            <ImageIcon className="size-3" />
                            <span>Görsel</span>
                        </div>
                    );
                case 'video':
                    return (
                        <div className="flex items-center gap-1">
                            <Video className="size-3" />
                            <span>Video</span>
                        </div>
                    );
                case 'file':
                    return (
                        <div className="flex items-center gap-1 text-slate-400">
                            <FileText className="size-3" />
                            <span>Döküman</span>
                        </div>
                    );
                case 'audio':
                    return (
                        <div className="flex items-center gap-1">
                            <Mic className="size-3" />
                            <span>Ses kaydı</span>
                        </div>
                    );
                default:
                    return <span>{message.content || "Mesaj"}</span>;
            }
        }

        return <span>{message.content || "Mesaj"}</span>;
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return "";
        try {
            return formatDistanceToNow(new Date(dateString), {
                addSuffix: false,
                locale: tr,
            });
        } catch {
            return "";
        }
    };

    return (
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 no-scrollbar">
            {loading ? (
                <MessagingSkeleton />
            ) : (
                <>
                    {conversations.map((conv) => {
                        const conversationItem = (
                            <div
                                key={conv._id}
                                onClick={() => onSelectConversation(conv._id)}
                                className={cn(
                                    "group relative flex gap-3 p-3 rounded-2xl transition-all cursor-pointer border border-transparent",
                                    activeConversationId === conv._id
                                        ? "bg-white border-slate-100 shadow-md translate-x-1"
                                        : "hover:bg-white/60 hover:border-slate-100/50"
                                )}
                            >
                                <div className="relative">
                                    {conv.type === "group" ? (
                                        <div className={cn(
                                            "size-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all overflow-hidden bg-orange-50",
                                            activeConversationId === conv._id ? "scale-105 shadow-md" : ""
                                        )}>
                                            <Hash className="size-5 text-orange-600" />
                                        </div>
                                    ) : (() => {
                                        if (conv.isMassMessage) {
                                            return (
                                                <UserAvatar
                                                    name={conv.name}
                                                    picture={conv.avatar}
                                                    size="md"
                                                    className={cn(
                                                        "transition-all",
                                                        activeConversationId === conv._id ? "scale-105 shadow-md" : ""
                                                    )}
                                                />
                                            );
                                        }
                                        const otherParticipant = conv.participants.find(
                                            (p) => p?.participant?._id !== currentUserId
                                        );
                                        return (
                                            <UserAvatar
                                                name={otherParticipant?.participant?.name}
                                                surname={otherParticipant?.participant?.surname}
                                                picture={otherParticipant?.participant?.profile?.picture}
                                                size="md"
                                                className={cn(
                                                    "transition-all",
                                                    activeConversationId === conv._id ? "scale-105 shadow-md" : ""
                                                )}
                                            />
                                        );
                                    })()}
                                    {isUserOnline(conv) && (
                                        <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-slate-50 shadow-sm" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h3 className={cn(
                                            "text-xs font-normal truncate transition-colors",
                                            activeConversationId === conv._id ? "text-slate-900" : "text-slate-700"
                                        )}>
                                            {getConversationTitle(conv)}
                                        </h3>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium line-clamp-1 leading-relaxed">
                                        {getLastMessagePreview(conv)}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-center gap-1.5 shrink-0 ml-2">
                                    <span className="text-[9px] text-slate-400 font-normal whitespace-nowrap">
                                        {formatTime(conv.lastMessageAt)}
                                    </span>
                                    {conv.unreadCount > 0 && (
                                        <div className="size-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-semibold shadow-lg shadow-orange-500/30 animate-in zoom-in-50">
                                            {conv.unreadCount}
                                        </div>
                                    )}
                                </div>

                                {activeConversationId === conv._id && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
                                )}
                            </div>
                        );

                        return conversationItem;
                    })}

                    {conversations.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <MessageSquare className="size-12 text-slate-200 mb-4" />
                            <p className="text-sm text-slate-400 font-medium">
                                Henüz sohbet yok
                            </p>
                            <p className="text-xs text-slate-300 mt-1">
                                Yeni bir sohbet başlatmak için + butonuna tıklayın
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};


