"use client";

import React, { useState } from "react";
import { Folder, ChevronDown, ChevronRight, MoreVertical, Pencil, Trash2, FolderEdit } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Folder as FolderType } from "@/redux/actions/messageActions";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteFolder } from "@/redux/actions/messageActions";
import toast from "react-hot-toast";

interface FolderListProps {
    folders: FolderType[];
    activeFolderId: string | null;
    onSelectFolder: (folderId: string | null) => void;
    onEditFolder: (folder: FolderType) => void;
}

export const FolderList = ({ folders, activeFolderId, onSelectFolder, onEditFolder }: FolderListProps) => {
    const dispatch = useAppDispatch();
    const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

    const toggleExpand = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setExpandedFolders(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Bu klasörü silmek istediğinize emin misiniz?")) {
            try {
                await dispatch(deleteFolder(id)).unwrap();
                toast.success("Klasör silindi");
            } catch (error: any) {
                toast.error(error || "Klasör silinirken bir hata oluştu");
            }
        }
    };

    return (
        <div className="px-2 space-y-1 mb-4">
            <div
                onClick={() => onSelectFolder(null)}
                className={cn(
                    "flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all border",
                    activeFolderId === null
                        ? "bg-white border-slate-100 shadow-sm text-slate-900"
                        : "border-transparent text-slate-500 hover:bg-white/50"
                )}
            >
                <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Folder className="size-4" />
                </div>
                <span className="text-xs font-normal">Tüm Mesajlar</span>
            </div>

            {folders.map(folder => (
                <div key={folder._id} className="group relative">
                    <div
                        onClick={() => onSelectFolder(folder._id)}
                        className={cn(
                            "flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border",
                            activeFolderId === folder._id
                                ? "bg-white border-slate-100 shadow-sm text-slate-900"
                                : "border-transparent text-slate-500 hover:bg-white/50"
                        )}
                    >
                        <div className="flex items-center gap-2 truncate">
                            <div
                                className="size-8 rounded-lg flex items-center justify-center shadow-sm"
                                style={{ backgroundColor: folder.color + '20', color: folder.color }}
                            >
                                <Folder className="size-4" />
                            </div>
                            <span className="text-xs font-normal truncate">{folder.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                                {folder.items.length}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditFolder(folder);
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                                >
                                    <Pencil className="size-3.5" />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, folder._id)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
