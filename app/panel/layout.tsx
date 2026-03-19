"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { NotificationsPopper } from "@/components/notifications-popper"
import { cn } from "@/lib/utils"
import { useMessaging } from "@/hooks/useMessaging"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { loadUser } from "@/redux/actions/userActions"
import { UserAvatar } from "@/components/ui/user-avatar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch()
  const { notifications } = useAppSelector((state) => state.notification)
  const { user, loading: userLoading } = useAppSelector((state) => state.user)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initialize global messaging listeners (socket, notifications, status updates)
  useMessaging(true)

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#FAF7F5] h-screen overflow-hidden">
        <div className="flex h-full flex-col p-2 md:p-3 lg:p-4 max-w-[1700px] w-full mx-auto overflow-hidden">
          <div className="flex flex-1 flex-col rounded-[2rem] md:rounded-[2.5rem] bg-white shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100/50 relative overflow-hidden">
            {/* Header */}
            <div className="shrink-0 px-4 pt-6 md:px-10 md:pt-8 mb-6 flex items-start justify-between font-sans gap-4">
              <div className="flex items-start gap-3 md:gap-4 min-w-0 flex-1">
                <SidebarTrigger className="-ml-1 md:hidden mt-0.5 overflow-visible shrink-0 transition-transform active:scale-95" />
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <h1 className="text-xl md:text-3xl font-semibold text-[#1A202C] truncate leading-tight">
                    Kontrol Paneli
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                {(!isMounted || userLoading || !user?.name) ? (
                  <>
                    <div className="h-10 w-10 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-slate-100 animate-pulse shrink-0" />
                    <div className="h-10 w-10 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-slate-100 animate-pulse shrink-0" />
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={cn(
                          "flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl md:rounded-2xl border transition-all relative group",
                          showNotifications
                            ? "border-orange-200 bg-orange-50 text-orange-500 shadow-inner"
                            : "border-slate-100 bg-white text-slate-400 hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-500 shadow-sm"
                        )}
                      >
                        <Bell className="size-4 md:size-5 transition-transform group-hover:rotate-12" />
                        {/* Only show badge if there are unread notifications */}
                        {notifications.some((n: any) => !n.isRead) && (
                          <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 flex h-2 w-2 md:h-2.5 md:w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-orange-500 border-2 border-white"></span>
                          </span>
                        )}
                      </button>

                      <NotificationsPopper
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                      />
                    </div>
                    <UserAvatar
                      name={user?.name}
                      surname={user?.surname}
                      picture={user?.profile?.picture}
                      size="md"
                      className="md:!size-11 !rounded-xl md:!rounded-2xl transition-all shadow-lg shadow-slate-200"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 no-scrollbar scroll-smooth overflow-y-auto px-6 pb-8 md:px-10 md:pb-12">
              <div className="h-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
