import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
    getCompanyUsers,
    createConversation,
    CompanyUser,
} from "@/redux/actions/messageActions";
import { X, Search, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/user-avatar";

interface NewConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NewConversationModal = ({
    isOpen,
    onClose,
}: NewConversationModalProps) => {
    const dispatch = useAppDispatch();
    const { companyUsers, loading } = useAppSelector((state) => state.message);
    const { user } = useAppSelector((state) => state.user);
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<CompanyUser[]>([]);
    const [groupName, setGroupName] = useState("");
    const [step, setStep] = useState<1 | 2>(1); // 1: User Selection, 2: Group Name (only for groups)

    // Fetch users when modal opens or search changes (with debounce)
    useEffect(() => {
        if (!isOpen) return;

        const timeoutId = setTimeout(() => {
            dispatch(getCompanyUsers(search));
        }, search ? 300 : 0); // Debounce search, but load immediately when opening

        return () => clearTimeout(timeoutId);
    }, [isOpen, search, dispatch]);

    const handleSelectUser = (user: CompanyUser) => {
        if (selectedUsers.find((u) => u._id === user._id)) {
            setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleCreate = async () => {
        if (selectedUsers.length === 0) return;

        const isGroup = selectedUsers.length > 1;

        if (isGroup && step === 1) {
            setStep(2);
            return;
        }

        if (isGroup && !groupName.trim()) {
            alert("Lütfen kanal adı girin");
            return;
        }

        try {
            const result = await dispatch(
                createConversation({
                    type: isGroup ? "group" : "direct",
                    participantIds: selectedUsers.map((u) => u._id),
                    name: isGroup ? groupName : undefined,
                })
            ).unwrap();

            // Reset and close
            setSelectedUsers([]);
            setGroupName("");
            setSearch("");
            setStep(1);
            onClose();
        } catch (error) {
            console.error("Failed to create conversation:", error);
        }
    };

    const handleClose = () => {
        setSelectedUsers([]);
        setGroupName("");
        setSearch("");
        setStep(1);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-semibold text-slate-800 ">
                        {step === 1 ? "Yeni Sohbet" : "Kanal Detayları"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {step === 1 ? (
                    <>
                        {/* Fixed Search Area */}
                        <div className="px-6 py-4 bg-white border-b border-slate-50 space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Kullanıcı ara..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white transition-all shadow-sm"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                                    <Search className="size-4" />
                                </div>
                            </div>

                            {/* Selected Users Chips */}
                            {selectedUsers.length > 0 && (
                                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto no-scrollbar">
                                    {selectedUsers.map((user) => (
                                        <div
                                            key={user._id}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-normal border border-orange-100 animate-in zoom-in-95 duration-200"
                                        >
                                            <span>
                                                {user.name} {user.surname}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id))
                                                }
                                                className="hover:bg-orange-100 rounded-full p-0.5"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* User List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                                </div>
                            ) : companyUsers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <UserPlus className="size-12 text-slate-200 mb-4" />
                                    <p className="text-sm text-slate-400 font-medium">
                                        Kullanıcı bulunamadı
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Group users by type */}
                                    {(() => {
                                        const providers = companyUsers.filter(u => u.userType === 'provider');
                                        const staff = companyUsers.filter(u => u.userType === 'staff');
                                        const customers = companyUsers.filter(u => u.userType === 'customer' || (u.userType !== 'provider' && u.userType !== 'staff'));

                                        const renderUserItem = (user: CompanyUser) => {
                                            const isSelected = selectedUsers.find((u) => u._id === user._id);
                                            return (
                                                <div
                                                    key={user._id}
                                                    onClick={() => handleSelectUser(user)}
                                                    className={cn(
                                                        "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border group",
                                                        isSelected
                                                            ? "bg-orange-50 border-orange-200"
                                                            : "bg-slate-50/50 border-transparent hover:bg-slate-100 hover:border-slate-200"
                                                    )}
                                                >
                                                    <UserAvatar
                                                        name={user.name}
                                                        surname={user.surname}
                                                        picture={user.profile?.picture}
                                                        size="md"
                                                        className="group-hover:scale-105 transition-transform"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-normal text-slate-700">
                                                                {user.name} {user.surname}
                                                            </h4>
                                                            <span className={cn(
                                                                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                                                                user.userType === 'provider' ? "bg-purple-100 text-purple-600" :
                                                                    user.userType === 'staff' ? "bg-blue-100 text-blue-600" :
                                                                        "bg-green-100 text-green-600"
                                                            )}>
                                                                {user.userType === 'provider' ? 'Firma' :
                                                                    user.userType === 'staff' ? 'Personel' : 'Müşteri'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-400">{user.email}</p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="size-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 animate-in zoom-in-50">
                                                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        };

                                        return (
                                            <div className="space-y-6">
                                                {/* Provider Section */}
                                                {providers.length > 0 && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 px-2">
                                                            <div className="h-px flex-1 bg-slate-200" />
                                                            <p className="text-[11px] font-normal text-slate-500">
                                                                Firmalar ({providers.length})
                                                            </p>
                                                            <div className="h-px flex-1 bg-slate-200" />
                                                        </div>
                                                        {providers.map(renderUserItem)}
                                                    </div>
                                                )}

                                                {/* Staff Section */}
                                                {staff.length > 0 && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 px-2">
                                                            <div className="h-px flex-1 bg-slate-200" />
                                                            <p className="text-[11px] font-normal text-slate-500">
                                                                Personeller ({staff.length})
                                                            </p>
                                                            <div className="h-px flex-1 bg-slate-200" />
                                                        </div>
                                                        {staff.map(renderUserItem)}
                                                    </div>
                                                )}

                                                {/* Customers Section */}
                                                {customers.length > 0 && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 px-2">
                                                            <div className="h-px flex-1 bg-slate-200" />
                                                            <p className="text-[11px] font-normal text-slate-500">
                                                                Müşteriler ({customers.length})
                                                            </p>
                                                            <div className="h-px flex-1 bg-slate-200" />
                                                        </div>
                                                        {customers.map(renderUserItem)}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    /* Step 2: Channel Name */
                    <div className="p-8 flex-1 animate-in slide-in-from-right-4 duration-300">
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="text-center space-y-2">
                                <div className="size-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                    <UserPlus className="size-8" />
                                </div>
                                <h3 className="text-lg font-normal text-slate-800">Grup Oluşturuluyor</h3>
                                <p className="text-sm text-slate-400">
                                    Bu kanal için bir isim belirleyerek sohbeti başlatın.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-normal text-slate-500 ml-1">Kanal Adı</label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Örn: Proje Detayları, Ekip Toplantısı..."
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 py-4 px-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-200 transition-all shadow-inner"
                                />
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4">
                                <p className="text-[11px] font-normal text-slate-500 mb-3">Katılımcılar</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedUsers.map(user => (
                                        <div key={user._id} className="text-xs font-normal text-slate-600 bg-white border border-slate-100 px-3 py-1.5 rounded-full shadow-sm">
                                            {user.name} {user.surname}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/30">
                    <button
                        onClick={step === 2 ? () => setStep(1) : handleClose}
                        className="px-6 py-3 text-sm font-normal text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        {step === 2 ? "Geri" : "İptal"}
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={
                            loading ||
                            selectedUsers.length === 0 ||
                            (step === 2 && !groupName.trim())
                        }
                        className={cn(
                            "px-8 py-3 text-sm font-normal text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center gap-2",
                            (loading || selectedUsers.length === 0 || (step === 2 && !groupName.trim())) &&
                            "opacity-50 cursor-not-allowed scale-100"
                        )}
                    >
                        {loading && <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {selectedUsers.length > 1 && step === 1 ? "İleri" : "Oluştur"}
                    </button>
                </div>
            </div>
        </div>
    );
};
