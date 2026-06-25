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
            {/* Content Area */}
            <div className="flex-1 no-scrollbar scroll-smooth overflow-y-auto px-6 pb-8 md:px-10 md:pb-12 pt-6 md:pt-10">
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
