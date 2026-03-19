import { cn } from "@/lib/utils";
import {
    Reply,
    Pencil,
    Trash2,
    Star,
    Forward,
    Copy,
    Info,
    MoreVertical
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MessageActionsProps {
    messageId: string;
    isSent: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onReply?: () => void;
    onStar?: () => void;
    onForward?: () => void;
    onCopy?: () => void;
    onInfo?: () => void;
    canEditOwnMessage?: boolean;
    canDeleteOwnMessage?: boolean;
}

export const MessageActions = ({
    messageId,
    isSent,
    onEdit,
    onDelete,
    onReply,
    onStar,
    onForward,
    onCopy,
    onInfo,
    canEditOwnMessage,
    canDeleteOwnMessage,
}: MessageActionsProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    const actions = [
        { icon: Pencil, label: "Düzenle", onClick: onEdit, show: isSent && canEditOwnMessage },
        { icon: Trash2, label: "Sil", onClick: onDelete, show: isSent && canDeleteOwnMessage, danger: true },
    ];

    const visibleActions = actions.filter(action => action.show);

    if (visibleActions.length === 0) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className={cn(
                    "p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100",
                    isSent
                        ? "hover:bg-slate-700 text-slate-400 hover:text-white"
                        : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                )}
            >
                <MoreVertical className="size-4" />
            </button>

            {showMenu && (
                <div className={cn(
                    "absolute top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 py-1.5 min-w-[140px] z-50",
                    isSent ? "right-0" : "left-0"
                )}>
                    {visibleActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                action.onClick?.();
                                setShowMenu(false);
                            }}
                            className={cn(
                                "w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all",
                                action.danger
                                    ? "text-red-600 hover:bg-red-50"
                                    : "text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            <action.icon className="size-4" />
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
