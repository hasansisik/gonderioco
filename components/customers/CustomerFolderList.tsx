"use client";

import React from "react";
import { Folder, Pencil, Trash2, LayoutGrid } from "lucide-react";
import { useAppDispatch } from "@/redux/hook";
import { Folder as FolderType, deleteFolder } from "@/redux/actions/messageActions";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface CustomerFolderListProps {
    folders: FolderType[];
    activeFolderId: string | null;
    onSelectFolder: (folderId: string | null) => void;
    onEditFolder: (folder: FolderType) => void;
}

export const CustomerFolderList = ({ folders, activeFolderId, onSelectFolder, onEditFolder }: CustomerFolderListProps) => {
    const dispatch = useAppDispatch();

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
        <div className="flex flex-wrap gap-2 mb-4">
            <button
                onClick={() => onSelectFolder(null)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all shadow-sm text-xs font-bold",
                    activeFolderId === null
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                )}
            >
                <LayoutGrid className="size-3.5" />
                <span>Tümü</span>
            </button>

            {folders.map(folder => (
                <div key={folder._id} className="group relative">
                    <button
                        onClick={() => onSelectFolder(folder._id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all shadow-sm text-xs font-bold pr-12",
                            activeFolderId === folder._id
                                ? "bg-white border-slate-100 text-slate-900 shadow-md ring-2 ring-slate-100"
                                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                        )}
                    >
                        <div
                            className="size-2 rounded-full"
                            style={{ backgroundColor: folder.color }}
                        />
                        <span>{folder.name}</span>
                        <span className="ml-1 text-[10px] text-slate-400 font-medium">({folder.items.length})</span>
                    </button>

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditFolder(folder);
                            }}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-blue-500 transition-all"
                        >
                            <Pencil className="size-3" />
                        </button>
                        <button
                            onClick={(e) => handleDelete(e, folder._id)}
                            className="p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                        >
                            <Trash2 className="size-3" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
