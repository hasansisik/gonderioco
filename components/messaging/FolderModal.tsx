"use client";

import React, { useState, useEffect } from "react";
import { X, Folder, FolderPlus, Check, Search, Trash2, Pencil } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { createFolder, updateFolder, deleteFolder, Conversation } from "@/redux/actions/messageActions";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface FolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingFolder?: any;
}

export const FolderModal = ({ isOpen, onClose, editingFolder }: FolderModalProps) => {
    const dispatch = useAppDispatch();
    const { conversations } = useAppSelector((state) => state.message);
    const { user } = useAppSelector((state) => state.user);
    const [name, setName] = useState("");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [color, setColor] = useState("#f97316");

    useEffect(() => {
        if (editingFolder) {
            setName(editingFolder.name);
            setSelectedItems(editingFolder.items || []);
            setColor(editingFolder.color || "#f97316");
        } else {
            setName("");
            setSelectedItems([]);
            setColor("#f97316");
        }
    }, [editingFolder, isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Klasör adı gereklidir");
            return;
        }

        try {
            if (editingFolder) {
                await dispatch(updateFolder({
                    id: editingFolder._id,
                    name,
                    items: selectedItems,
                    color
                })).unwrap();
                toast.success("Klasör güncellendi");
            } else {
                await dispatch(createFolder({
                    name,
                    items: selectedItems,
                    color,
                    type: "message"
                })).unwrap();
                toast.success("Klasör oluşturuldu");
            }
            onClose();
        } catch (error: any) {
            toast.error(error || "Bir hata oluştu");
        }
    };

    const toggleItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(c => c !== id)
                : [...prev, id]
        );
    };

    const getConversationTitle = (conv: Conversation) => {
        if (conv.type === "group") return conv.name || "Grup Sohbeti";
        const otherParticipant = conv.participants.find(p => p.participant?._id !== (user?._id || user?.userId));
        return otherParticipant ? `${otherParticipant.participant?.name || ""} ${otherParticipant.participant?.surname || ""}` : "Sohbet";
    };

    const filteredConversations = conversations.filter(conv =>
        getConversationTitle(conv).toLowerCase().includes(search.toLowerCase())
    );

    const colors = ["#f97316", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#6366f1"];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <FolderPlus className="size-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                {editingFolder ? "Klasörü Düzenle" : "Yeni Klasör"}
                            </h2>
                            <p className="text-xs text-slate-400 font-medium">Sohbetlerinizi gruplandırın</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-slate-600"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="text-[12px] font-normal text-slate-500 block mb-2 px-1">
                            Klasör Adı
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Örn: Önemli Müşteriler"
                            className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 py-3.5 px-5 text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium"
                        />
                    </div>

                    <div>
                        <label className="text-[12px] font-normal text-slate-500 block mb-3 px-1">
                            Renk Seçimi
                        </label>
                        <div className="flex gap-3">
                            {colors.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={cn(
                                        "size-8 rounded-full border-4 transition-all hover:scale-110",
                                        color === c ? "border-slate-200 scale-110" : "border-transparent"
                                    )}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[12px] font-normal text-slate-500 block mb-3 px-1 flex justify-between items-center">
                            <span>Sohbetleri Seç</span>
                            <span className="text-orange-500">{selectedItems.length} seçili</span>
                        </label>
                        <div className="relative mb-3">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Sohbet ara..."
                                className="w-full rounded-xl border border-slate-100 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs focus:outline-none transition-all"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                            {filteredConversations.map(conv => (
                                <div
                                    key={conv._id}
                                    onClick={() => toggleItem(conv._id)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border",
                                        selectedItems.includes(conv._id)
                                            ? "bg-orange-50 border-orange-100 shadow-sm"
                                            : "hover:bg-slate-50 border-transparent"
                                    )}
                                >
                                    <div className={cn(
                                        "size-5 rounded-md flex items-center justify-center border transition-all",
                                        selectedItems.includes(conv._id)
                                            ? "bg-orange-500 border-orange-500 text-white"
                                            : "bg-white border-slate-200"
                                    )}>
                                        {selectedItems.includes(conv._id) && <Check className="size-3.5" strokeWidth={4} />}
                                    </div>
                                    <span className="text-xs font-normal text-slate-700 truncate">
                                        {getConversationTitle(conv)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-2xl text-sm font-normal text-slate-500 hover:bg-white hover:shadow-md transition-all active:scale-95"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white bg-orange-500 shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        {editingFolder ? "Güncelle" : "Klasör Oluştur"}
                    </button>
                </div>
            </div>
        </div>
    );
};
