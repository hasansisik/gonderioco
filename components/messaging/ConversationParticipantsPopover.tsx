"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
    addParticipants,
    removeParticipants,
    getCompanyUsers,
} from "@/redux/actions/messageActions";
import { Users, UserPlus, UserMinus, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { usePermissions } from "@/hooks/usePermissions";

interface Participant {
    _id: string;
    participant: {
        _id: string;
        name: string;
        surname: string;
        email: string;
        profile?: {
            picture?: string;
        };
    };
    onModel: string;
}

interface Conversation {
    _id: string;
    name?: string;
    type: "direct" | "group";
    participants: Participant[];
    admins?: Array<{
        admin: string;
        onModel: string;
    }>;
}

interface ConversationParticipantsPopoverProps {
    conversation: Conversation;
    children: React.ReactNode;
}

export default function ConversationParticipantsPopover({
    conversation,
    children,
}: ConversationParticipantsPopoverProps) {
    const dispatch = useAppDispatch();
    const { companyUsers, loading, conversations } = useAppSelector((state) => state.message);
    const { user } = useAppSelector((state) => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const [showAddUsers, setShowAddUsers] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const currentUserId = user?._id || user?.userId;

    // Get the latest conversation data from Redux store
    const latestConversation = conversations.find(c => c._id === conversation._id) || conversation;

    // Check if current user is admin or has permission
    const { hasPermission } = usePermissions();
    const canManageParticipants = hasPermission("Katılımcı Yönetimi") || latestConversation.admins?.some(
        (a) => a.admin === currentUserId
    );

    // Only show for group conversations
    if (latestConversation.type !== "group") {
        return <>{children}</>;
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            dispatch(getCompanyUsers(""));
            setShowAddUsers(false);
            setSelectedUsers([]);
            setSearch("");
        }
    };

    const handleRemoveParticipant = async (participantId: string) => {
        try {
            await dispatch(
                removeParticipants({
                    conversationId: latestConversation._id,
                    participantIds: [participantId],
                })
            ).unwrap();
            toast.success("Katılımcı başarıyla çıkarıldı");
        } catch (error: any) {
            console.error("Error removing participant:", error);
            toast.error(error || "Katılımcı çıkarılırken bir hata oluştu");
        }
    };

    const handleAddParticipants = async () => {
        if (selectedUsers.length === 0) return;

        try {
            await dispatch(
                addParticipants({
                    conversationId: latestConversation._id,
                    participantIds: selectedUsers,
                })
            ).unwrap();
            toast.success(`${selectedUsers.length} katılımcı başarıyla eklendi`);
            setShowAddUsers(false);
            setSelectedUsers([]);
            setSearch("");
        } catch (error: any) {
            console.error("Error adding participants:", error);
            toast.error(error || "Katılımcı eklenirken bir hata oluştu");
        }
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    // Filter out users who are already participants
    const participantIds = latestConversation.participants.map(
        (p) => p.participant?._id
    );
    const availableUsers = companyUsers.filter(
        (u) => !participantIds.includes(u._id)
    );

    // Filter by search
    const filteredUsers = availableUsers.filter((u) => {
        const searchLower = search.toLowerCase();
        return (
            u.name.toLowerCase().includes(searchLower) ||
            u.surname.toLowerCase().includes(searchLower) ||
            u.email.toLowerCase().includes(searchLower)
        );
    });

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                className="w-96 p-0 border-slate-200 shadow-2xl rounded-2xl"
                side="bottom"
                align="start"
            >
                <div className="flex flex-col max-h-[600px]">
                    {/* Header */}
                    <div className="p-5 border-b border-slate-100 bg-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                    <Users className="size-5 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base text-slate-800">
                                        Katılımcılar
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium">
                                        {latestConversation.participants.length} kişi
                                    </p>
                                </div>
                            </div>
                            {canManageParticipants && !showAddUsers && (
                                <button
                                    onClick={() => setShowAddUsers(true)}
                                    className="p-2.5 rounded-xl hover:bg-orange-50 text-orange-500 transition-all hover:scale-105 active:scale-95"
                                >
                                    <UserPlus className="size-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Add Users Mode */}
                    {showAddUsers ? (
                        <div className="flex flex-col flex-1 overflow-hidden">
                            {/* Search */}
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Kullanıcı ara..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all"
                                    />
                                </div>
                            </div>

                            {/* User List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-sm text-slate-400 font-medium">
                                            Eklenecek kullanıcı bulunamadı
                                        </p>
                                    </div>
                                ) : (
                                    filteredUsers.map((user) => {
                                        const isSelected = selectedUsers.includes(user._id);
                                        return (
                                            <div
                                                key={user._id}
                                                onClick={() => toggleUserSelection(user._id)}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
                                                    isSelected
                                                        ? "bg-orange-50 border-2 border-orange-200"
                                                        : "hover:bg-slate-50 border-2 border-transparent"
                                                )}
                                            >
                                                <UserAvatar
                                                    name={user.name}
                                                    surname={user.surname}
                                                    picture={user.profile?.picture}
                                                    size="md"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-normal text-slate-700 truncate">
                                                        {user.name} {user.surname}
                                                    </p>
                                                    <p className="text-xs text-slate-400 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                {isSelected && (
                                                    <div className="size-6 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                                                        <svg
                                                            className="size-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={3}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Actions */}
                            <div className="p-4 border-t border-slate-100 flex gap-3 bg-white">
                                <button
                                    onClick={() => {
                                        setShowAddUsers(false);
                                        setSelectedUsers([]);
                                        setSearch("");
                                    }}
                                    className="flex-1 px-4 py-2.5 text-sm font-normal text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleAddParticipants}
                                    disabled={selectedUsers.length === 0}
                                    className="flex-1 px-4 py-2.5 text-sm font-normal text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                                >
                                    Ekle ({selectedUsers.length})
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Participants List */
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {latestConversation.participants.map((participant) => {
                                const p = participant.participant;
                                if (!p) return null;

                                const isCurrentUser = p._id === currentUserId;
                                const isParticipantAdmin = latestConversation.admins?.some(
                                    (a) => a.admin === p._id
                                );

                                return (
                                    <div
                                        key={participant._id}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group"
                                    >
                                        <UserAvatar
                                            name={participant.participant.name}
                                            surname={participant.participant.surname}
                                            picture={participant.participant.profile?.picture}
                                            size="md"
                                            className="border border-slate-100"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-normal text-slate-700 truncate">
                                                    {participant.participant.name || ''} {participant.participant.surname || ''}
                                                </p>
                                                {isParticipantAdmin && (
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-orange-100 text-orange-600">
                                                        Admin
                                                    </span>
                                                )}
                                                {isCurrentUser && (
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-600">
                                                        Siz
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 truncate">
                                                {p.email}
                                            </p>
                                        </div>
                                        {canManageParticipants && !isCurrentUser && !isParticipantAdmin && (
                                            <button
                                                onClick={() => handleRemoveParticipant(p._id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all"
                                            >
                                                <UserMinus className="size-4" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover >
    );
}
