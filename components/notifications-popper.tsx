import { cn } from "@/lib/utils"
import { Bell, Check, Clock, Circle } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getNotifications, markAsRead, markAllAsRead } from "@/redux/actions/notificationActions"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { useRouter, usePathname } from "next/navigation"
import { getAllOffers } from "@/redux/actions/offerActions"
import { getAllCustomers } from "@/redux/actions/customerActions"
import { getAllProducts } from "@/redux/actions/productActions"
import { getAllStaff } from "@/redux/actions/staffActions"

export function NotificationsPopper({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const popperRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()
    const { notifications, loading } = useAppSelector((state) => state.notification)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (isOpen) {
            dispatch(getNotifications())
        }
    }, [isOpen, dispatch])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popperRef.current && !popperRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen, onClose])

    if (!isOpen) return null

    const unreadCount = notifications.filter(n => !n.isRead).length

    const handleMarkAsRead = (id: string) => {
        dispatch(markAsRead(id))
    }

    const handleMarkAllAsRead = () => {
        dispatch(markAllAsRead())
    }

    const handleNotificationClick = (notification: any) => {
        // Mark as read if unread
        if (!notification.isRead) {
            handleMarkAsRead(notification._id)
        }

        // Navigate based on notification type and relatedModel
        let targetPath = '/panel'

        if (notification.type === 'teklif' || notification.type === 'proje') {
            if (notification.relatedId) {
                targetPath = `/panel/teklifler/tekliflerim/${notification.relatedId}`
            } else {
                targetPath = '/panel/teklifler/tekliflerim'
            }
        } else if (notification.type === 'musteri') {
            if (notification.relatedModel === 'CustomerRequest') {
                if (notification.title?.includes('Yeni Müşteri İsteği')) {
                    targetPath = '/panel/musteriler'
                } else {
                    targetPath = '/panel/firmalar'
                }
            } else {
                targetPath = '/panel/musteriler'
            }
        } else if (notification.type === 'personel') {
            targetPath = '/panel/personel'
        } else if (notification.type === 'stok') {
            targetPath = '/panel/stok'
        }

        // If we are already on the target path, we need to manually trigger a refresh
        // because Next.js router.push won't trigger any effect if path is the same.
        if (pathname === targetPath || (pathname.startsWith('/panel/teklifler/tekliflerim') && targetPath === '/panel/teklifler/tekliflerim')) {
            if (targetPath.includes('/panel/teklifler/tekliflerim')) {
                dispatch(getAllOffers())
            } else if (targetPath === '/panel/musteriler') {
                dispatch(getAllCustomers())
            } else if (targetPath === '/panel/stok') {
                dispatch(getAllProducts())
            } else if (targetPath === '/panel/personel') {
                dispatch(getAllStaff())
            }
            // For detail pages, the page itself might need to listen for something,
            // but getAllOffers() will refresh the global state which detail pages also use.
        }

        // Close the popper and navigate
        onClose()
        router.push(targetPath)

        // Also trigger a refresh for server components (Next.js 13+ feature)
        router.refresh()
    }

    return (
        <div
            ref={popperRef}
            className="absolute top-12 right-0 w-[400px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 z-50 overflow-hidden animate-in fade-in zoom-in duration-200"
        >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-extrabold text-[#2D3748]">Genel</h2>
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#F67E06]">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] font-bold text-[#F67E06] hover:underline transition-all"
                    >
                        Tümünü Okundu İşaretle
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {loading && notifications.length === 0 ? (
                    <div className="p-12 flex items-center justify-center min-h-[350px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="flex flex-col">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={cn(
                                    "p-4 flex gap-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative group",
                                    !notification.isRead && "bg-orange-50/30"
                                )}
                            >
                                <div className="size-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                    <Bell className={cn("size-5", !notification.isRead ? "text-[#F67E06]" : "text-slate-300")} />
                                </div>
                                <div className="flex flex-col gap-1 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[13px] font-bold text-slate-700">
                                            {notification.title || (notification.user ? `${notification.user.name} ${notification.user.surname}` : 'Sistem Bildirimi')}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                            <Clock className="size-3" />
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                                        {notification.message}
                                    </p>
                                </div>
                                {!notification.isRead && (
                                    <Circle className="size-2 fill-[#F67E06] text-[#F67E06] absolute right-4 top-1/2 -translate-y-1/2" />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 flex flex-col items-center justify-center gap-8 min-h-[350px]">
                        <h3 className="text-[14px] font-extrabold text-[#2D3748]">Henüz Bildirim Yok</h3>
                        <div className="relative flex items-center justify-center">
                            <div className="absolute size-[180px] rounded-full border border-slate-50/50" />
                            <div className="absolute size-[140px] rounded-full border border-slate-100/50" />
                            <div className="absolute size-[100px] rounded-full border border-slate-200/50" />
                            <div className="relative size-[60px] rounded-full bg-slate-50 flex items-center justify-center">
                                <Bell className="size-6 text-slate-300" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
