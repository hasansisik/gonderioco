"use client"

import { cn } from "@/lib/utils"
import {
    Search,
    Plus,
    Hash,
    MoreVertical,
    X,
    ArrowLeft,
    FolderPlus,
} from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import {
    getConversations,
    getMessages,
    editMessage,
    deleteMessage,
    deleteConversation,
    getFolders,
    createConversation,
} from "@/redux/actions/messageActions"
import { loadUser } from "@/redux/actions/userActions"
import { setActiveConversation } from "@/redux/reducers/messageReducer"
import { useMessaging } from "@/hooks/useMessaging"
import { usePermissions } from "@/hooks/usePermissions"
import { ConversationList } from "@/components/messaging/ConversationList"
import { MessageList } from "@/components/messaging/MessageList"
import { MessageInput } from "@/components/messaging/MessageInput"
import { NewConversationModal } from "@/components/messaging/NewConversationModal"
import { FolderList } from "@/components/messaging/FolderList"
import { FolderModal } from "@/components/messaging/FolderModal"
import ConversationParticipantsPopover from "@/components/messaging/ConversationParticipantsPopover"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash2 } from "lucide-react"

function MessagesContent() {
    const dispatch = useAppDispatch();
    const {
        conversations,
        activeConversationId,
        messagesByConversation,
        typingUsers,
        onlineUsers,
        folders,
        loading,
    } = useAppSelector((state) => state.message);
    const { user } = useAppSelector((state) => state.user);
    const searchParams = useSearchParams();
    const { hasPermission } = usePermissions();

    const canDeleteConversation = hasPermission("Konuşmayı Sil");
    const canDeleteOwnMessage = hasPermission("Mesaj Sil");
    const canEditOwnMessage = hasPermission("Mesaj Düzenle");

    // Klasör özelliği artık tüm kullanıcılar için aktif
    const canUseFolders = true;

    const {
        isConnected,
        sendMessage,
        startTyping,
        stopTyping,
        markConversationAsRead,
    } = useMessaging(false);

    const [activeTab, setActiveTab] = useState("Mesajlar");
    const [searchQuery, setSearchQuery] = useState("");
    const [showNewConversationModal, setShowNewConversationModal] = useState(false);
    const [editingMessage, setEditingMessage] = useState<{ _id: string; content: string } | null>(null);
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
    const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
    const [isMessageSearching, setIsMessageSearching] = useState(false);
    const [messageSearchQuery, setMessageSearchQuery] = useState("");
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [folderModalOpen, setFolderModalOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState<any>(null);

    // Load user, conversations and folders on mount
    useEffect(() => {
        dispatch(loadUser());
        dispatch(getConversations());
        dispatch(getFolders("message"));
    }, [dispatch]);

    // Load messages when active conversation changes
    useEffect(() => {
        if (activeConversationId) {
            dispatch(getMessages({ conversationId: activeConversationId }));
            markConversationAsRead(activeConversationId);
        }
    }, [activeConversationId, dispatch, markConversationAsRead]);

    // Handle 'new' query param from Companies page
    useEffect(() => {
        const newUserId = searchParams.get("new");
        if (newUserId && !loading) {
            // Check if conversation already exists
            const existingConv = (conversations || []).find(c =>
                c.type === "direct" &&
                c.participants.some(p => p.participant?._id === newUserId)
            );

            if (existingConv) {
                dispatch(setActiveConversation(existingConv._id));
            } else {
                // Create new conversation
                dispatch(createConversation({
                    type: "direct",
                    participantIds: [newUserId]
                })).then((action: any) => {
                    if (action.payload?._id) {
                        dispatch(setActiveConversation(action.payload._id));
                    }
                });
            }
        }
    }, [searchParams, conversations, dispatch]);

    const handleSelectConversation = (conversationId: string) => {
        dispatch(setActiveConversation(conversationId));
    };

    const handleSendMessage = (content: string, fileUrl?: string, fileType?: string) => {
        if (!activeConversationId) return;

        sendMessage({
            conversationId: activeConversationId,
            content: fileUrl || content,
            messageType: fileType || "text",
            tempId: `temp-${Date.now()}`,
        });
    };

    const handleTypingStart = () => {
        if (activeConversationId) {
            startTyping(activeConversationId);
        }
    };

    const handleTypingStop = () => {
        if (activeConversationId) {
            stopTyping(activeConversationId);
        }
    };

    const activeConversation = conversations.find(
        (c) => c._id === activeConversationId
    );

    const activeMessages = (activeConversationId
        ? messagesByConversation[activeConversationId] || []
        : []).filter(msg =>
            !messageSearchQuery ||
            msg.content.toLowerCase().includes(messageSearchQuery.toLowerCase())
        );

    const activeTypingUsers = activeConversationId
        ? typingUsers[activeConversationId] || []
        : [];

    const handleEditMessage = (message: any) => {
        setEditingMessage({ _id: message._id, content: message.content });
    };

    const handleDeleteMessage = (messageId: string) => {
        setMessageToDelete(messageId);
    };

    const confirmDeleteMessage = async () => {
        if (!messageToDelete) return;

        try {
            await dispatch(deleteMessage({
                messageId: messageToDelete,
                conversationId: activeConversationId!
            })).unwrap();
            setMessageToDelete(null);
        } catch (error: any) {
            console.error("Delete failed:", error);
        }
    };

    const handleDeleteConversation = () => {
        if (activeConversationId) {
            setConversationToDelete(activeConversationId);
        }
    };

    const confirmDeleteConversation = async () => {
        if (!conversationToDelete) return;

        try {
            await dispatch(deleteConversation(conversationToDelete)).unwrap();
            dispatch(getFolders("message"));
            setConversationToDelete(null);
        } catch (error: any) {
            console.error("Delete conversation failed:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingMessage(null);
    };

    const handleSaveEdit = async (content: string) => {
        if (!editingMessage) return;

        try {
            await dispatch(editMessage({
                messageId: editingMessage._id,
                content
            })).unwrap();
            setEditingMessage(null);
        } catch (error: any) {
            console.error("Edit failed:", error);
        }
    };

    // Filter conversations based on tab, search and folder
    const filteredConversations = conversations.filter((conv) => {
        // Tab filter
        const matchesTab =
            activeTab === "Mesajlar"
                ? conv.type === "direct"
                : conv.type === "group";

        // Folder filter
        if (selectedFolderId) {
            const folder = folders.find(f => f._id === selectedFolderId);
            if (!folder || !folder.items.includes(conv._id)) {
                return false;
            }
        }

        if (!searchQuery) return matchesTab;

        const searchLower = searchQuery.toLowerCase();
        const title =
            conv.type === "group"
                ? conv.name || ""
                : conv.participants
                    .filter((p: any) => p?.participant?._id !== (user?._id || user?.userId))
                    .map((p: any) => `${p?.participant?.name || "Silinmiş"} ${p?.participant?.surname || "Kullanıcı"}`)
                    .join(" ");

        const lastMessageContent = conv.lastMessage?.content?.toLowerCase() || "";
        return matchesTab && (title.toLowerCase().includes(searchLower) || lastMessageContent.includes(searchLower));
    });

    const getConversationTitle = () => {
        if (!activeConversation) return "";

        if (activeConversation.type === "group") {
            return activeConversation.name || "Grup Sohbeti";
        }

        if (activeConversation.isMassMessage && activeConversation.name) {
            return activeConversation.name;
        }

        const otherParticipant = activeConversation.participants.find(
            (p) => p?.participant?._id !== (user?._id || user?.userId)
        );
        if (otherParticipant) {
            if (otherParticipant.participant) {
                return `${otherParticipant.participant.name || ""} ${otherParticipant.participant.surname || ""}`;
            }
            return "Silinmiş Kullanıcı";
        }

        return "Sohbet";
    };

    const getParticipantCount = () => {
        if (!activeConversation) return 0;
        return activeConversation.participants.length;
    };

    const isActiveConversationOnline = () => {
        if (!activeConversation || activeConversation.type === "group")
            return false;

        const otherParticipant = activeConversation.participants.find(
            (p) => p?.participant?._id !== (user?._id || user?.userId)
        );

        if (!otherParticipant || !otherParticipant.participant) return false;

        // Check if user has disabled online status visibility
        if (otherParticipant.participant.showOnlineStatus === false) {
            return false;
        }

        return onlineUsers.includes(otherParticipant.participant?._id);
    };

    return (
        <div className="flex h-full md:rounded-[2rem] md:border border-slate-100 bg-white overflow-hidden md:shadow-[0_8px_30px_rgb(0,0,0,0.02)] mx-auto w-full max-w-[1700px]">
            {/* Left Sidebar: Conversations List */}
            <div className={cn(
                "w-full lg:w-[320px] shrink-0 flex flex-col bg-slate-50/50 md:border-r border-slate-100",
                activeConversationId ? "hidden lg:flex" : "flex"
            )}>
                {/* Search & Header */}
                <div className="p-3 pb-2">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    "size-2 rounded-full",
                                    isConnected
                                        ? "bg-emerald-500 animate-pulse"
                                        : "bg-slate-300"
                                )}
                            />
                            <span className="text-[11px] text-slate-400 font-normal">
                                {isConnected ? "Bağlı" : "Bağlanıyor..."}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {canUseFolders && (
                                <button
                                    onClick={() => {
                                        setEditingFolder(null);
                                        setFolderModalOpen(true);
                                    }}
                                    className="size-8 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-orange-500 shadow-sm transition-all hover:scale-105 active:scale-95"
                                    title="Klasör Ekle"
                                >
                                    <FolderPlus className="size-4" strokeWidth={2.5} />
                                </button>
                            )}
                            <button
                                onClick={() => setShowNewConversationModal(true)}
                                className="size-8 flex items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
                            >
                                <Plus className="size-4" strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Sohbet veya mesaj ara.."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-slate-100 bg-white py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-4 focus:ring-orange-500/5 placeholder:text-slate-400 shadow-sm transition-all"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                            <Search className="size-4" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-4 mb-3">
                    <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <button
                            onClick={() => setActiveTab("Mesajlar")}
                            className={cn(
                                "flex-1 py-1.5 text-xs font-normal rounded-lg transition-all relative",
                                activeTab === "Mesajlar"
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Mesajlar
                            {(() => {
                                const directUnreadCount = conversations
                                    .filter(c => c.type === "direct")
                                    .reduce((sum, c) => sum + (c.unreadCount || 0), 0);

                                return directUnreadCount > 0 && activeTab !== "Mesajlar" ? (
                                    <span className="absolute -top-1 -right-1 size-4 flex items-center justify-center rounded-full bg-orange-500 text-white text-[9px] font-semibold">
                                        {directUnreadCount > 9 ? '9+' : directUnreadCount}
                                    </span>
                                ) : null;
                            })()}
                        </button>
                        <button
                            onClick={() => setActiveTab("Kanallar")}
                            className={cn(
                                "flex-1 py-1.5 text-xs font-normal rounded-lg transition-all relative",
                                activeTab === "Kanallar"
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Kanallar
                            {(() => {
                                const groupUnreadCount = conversations
                                    .filter(c => c.type === "group")
                                    .reduce((sum, c) => sum + (c.unreadCount || 0), 0);

                                return groupUnreadCount > 0 && activeTab !== "Kanallar" ? (
                                    <span className="absolute -top-1 -right-1 size-4 flex items-center justify-center rounded-full bg-orange-500 text-white text-[9px] font-semibold">
                                        {groupUnreadCount > 9 ? '9+' : groupUnreadCount}
                                    </span>
                                ) : null;
                            })()}
                        </button>
                    </div>
                </div>

                {/* Folders List */}
                {canUseFolders && (
                    <FolderList
                        folders={folders}
                        activeFolderId={selectedFolderId}
                        onSelectFolder={setSelectedFolderId}
                        onEditFolder={(folder) => {
                            setEditingFolder(folder);
                            setFolderModalOpen(true);
                        }}
                    />
                )}

                {/* Conversation List */}
                <ConversationList
                    conversations={filteredConversations}
                    activeConversationId={activeConversationId}
                    onSelectConversation={handleSelectConversation}
                    onlineUsers={onlineUsers}
                    currentUserId={user?._id || user?.userId}
                    loading={loading}
                />
            </div>

            {/* Right Content: Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-white",
                !activeConversationId ? "hidden lg:flex" : "flex"
            )}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-3 lg:p-4 bg-white border-b border-slate-100">
                            <div className="flex items-center gap-2 lg:gap-3 overflow-hidden">
                                <button
                                    onClick={() => dispatch(setActiveConversation(null))}
                                    className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all shrink-0"
                                >
                                    <ArrowLeft className="size-5" />
                                </button>
                                {activeConversation.type === "group" ? (
                                    <div className="size-9 lg:size-10 rounded-xl shadow-sm overflow-hidden shrink-0 bg-orange-50 text-orange-500 flex items-center justify-center">
                                        <Hash className="size-6" />
                                    </div>
                                ) : (() => {
                                    if (activeConversation.isMassMessage) {
                                        return (
                                            <UserAvatar
                                                name={activeConversation.name}
                                                picture={activeConversation.avatar}
                                                size="md"
                                                className="shadow-sm"
                                            />
                                        );
                                    }
                                    const otherParticipant = activeConversation.participants.find(
                                        (p) => p?.participant?._id !== (user?._id || user?.userId)
                                    );
                                    return (
                                        <UserAvatar
                                            name={otherParticipant?.participant?.name}
                                            surname={otherParticipant?.participant?.surname}
                                            picture={otherParticipant?.participant?.profile?.picture}
                                            size="md"
                                            className="shadow-sm"
                                        />
                                    );
                                })()}
                                {activeConversation.type === "group" ? (
                                    <ConversationParticipantsPopover conversation={activeConversation}>
                                        <div className="cursor-pointer hover:bg-slate-50 rounded-xl px-3 py-2 -mx-3 -my-2 transition-all">
                                            <h3 className="text-sm font-semibold text-slate-800  flex items-center gap-2">
                                                {getConversationTitle()}
                                                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
                                                    Grup
                                                </span>
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[11px] text-slate-400 font-normal">
                                                    {`${getParticipantCount()} Katılımcı`}
                                                </p>
                                            </div>
                                        </div>
                                    </ConversationParticipantsPopover>
                                ) : (() => {
                                    const otherParticipant = activeConversation.participants.find(
                                        (p) => p?.participant?._id !== (user?._id || user?.userId)
                                    );
                                    const shouldShowStatus = otherParticipant?.participant?.showOnlineStatus !== false;

                                    return (
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-800 ">
                                                {getConversationTitle()}
                                            </h3>
                                            {shouldShowStatus && (
                                                <div className="flex items-center gap-2">
                                                    {isActiveConversationOnline() && (
                                                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    )}
                                                    <p className="text-[11px] text-slate-400 font-normal">
                                                        {isActiveConversationOnline()
                                                            ? "Çevrimiçi"
                                                            : "Çevrimdışı"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="flex items-center gap-2">
                                {isMessageSearching ? (
                                    <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                                        <input
                                            type="text"
                                            placeholder="Mesajlarda ara..."
                                            value={messageSearchQuery}
                                            onChange={(e) => setMessageSearchQuery(e.target.value)}
                                            autoFocus
                                            className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all w-[150px] sm:w-[200px]"
                                        />
                                        <button
                                            onClick={() => {
                                                setIsMessageSearching(false);
                                                setMessageSearchQuery("");
                                            }}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsMessageSearching(true)}
                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                                    >
                                        <Search className="size-5" />
                                    </button>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all outline-none">
                                            <MoreVertical className="size-5" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px] z-[100]">
                                        {canDeleteConversation && (
                                            <DropdownMenuItem
                                                onClick={handleDeleteConversation}
                                                className="flex items-center gap-2 p-3 text-red-500 font-normal hover:bg-red-50 rounded-xl cursor-pointer transition-all"
                                            >
                                                <Trash2 className="size-4" />
                                                <span>Konuşmayı Sil</span>
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Messages */}
                        <MessageList
                            messages={activeMessages}
                            currentUserId={user?._id || user?.userId}
                            typingUsers={activeTypingUsers}
                            onlineUsers={onlineUsers}
                            onEdit={handleEditMessage}
                            onDelete={handleDeleteMessage}
                            loading={loading}
                            canEditOwnMessage={canEditOwnMessage}
                            canDeleteOwnMessage={canDeleteOwnMessage}
                            isMassMessage={activeConversation.isMassMessage}
                            massMessageName={activeConversation.name}
                            massMessageAvatar={activeConversation.avatar}
                        />

                        {/* Message Input */}
                        <MessageInput
                            onSendMessage={handleSendMessage}
                            onTypingStart={handleTypingStart}
                            onTypingStop={handleTypingStop}
                            disabled={!isConnected || (activeConversation.isReadOnly && (user?.userType === 'customer' || user?.role === 'customer'))}
                            editingMessage={editingMessage}
                            onCancelEdit={handleCancelEdit}
                            onSaveEdit={handleSaveEdit}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <Hash className="size-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">
                                Sohbet Seçin
                            </h3>
                            <p className="text-sm text-slate-400">
                                Mesajlaşmaya başlamak için bir sohbet seçin
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* New Conversation Modal */}
            <NewConversationModal
                isOpen={showNewConversationModal}
                onClose={() => setShowNewConversationModal(false)}
            />

            {/* Folder Modal */}
            {canUseFolders && (
                <FolderModal
                    isOpen={folderModalOpen}
                    onClose={() => {
                        setFolderModalOpen(false);
                        setEditingFolder(null);
                    }}
                    editingFolder={editingFolder}
                />
            )}
            {/* AlertDialog for confirmation */}
            <AlertDialog open={!!messageToDelete} onOpenChange={(open) => !open && setMessageToDelete(null)}>
                <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold text-slate-800">Mesajı Sil</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 font-medium">
                            Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel className="rounded-2xl border-none bg-slate-100 font-normal text-slate-700 hover:bg-slate-200 transition-all">İptal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteMessage}
                            className="rounded-2xl bg-red-500 font-normal text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                        >
                            Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* AlertDialog for conversation deletion */}
            <AlertDialog open={!!conversationToDelete} onOpenChange={(open) => !open && setConversationToDelete(null)}>
                <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold text-slate-800">Konuşmayı Sil</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 font-medium">
                            Bu konuşmayı silmek istediğinizden emin misiniz? Bu işlem sadece sizin mesaj listenizden kaldıracaktır, karşı taraf görmeye devam edecektir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel className="rounded-2xl border-none bg-slate-100 font-normal text-slate-700 hover:bg-slate-200 transition-all">İptal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteConversation}
                            className="rounded-2xl bg-red-500 font-normal text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                        >
                            Konuşmayı Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default function MessagesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-full items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        }>
            <MessagesContent />
        </Suspense>
    );
}
