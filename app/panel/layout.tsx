"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, User, Home } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
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
  const pathname = usePathname()
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

  const getPageTitle = () => {
    if (pathname.includes("/musteriler/yeni")) return "Yeni Müşteri"
    if (pathname.endsWith("/musteriler")) return "Müşteriler"
    if (pathname.includes("/musteriler/")) return "Müşteri Düzenle"
    if (pathname.includes("/teklifler/tekliflerim/yeni")) return "Teklif Oluştur"
    if (pathname.includes("/teklifler/tekliflerim") && pathname.split('/').length > 4) return "Teklif Detay"
    if (pathname.includes("/teklifler/tekliflerim")) return "Tekliflerim"
    if (pathname.includes("/teklifler/teklif-sablonu/yeni")) return "Yeni Şablon"
    if (pathname.includes("/teklifler/teklif-sablonu/") && pathname.split('/').length > 4) return "Şablon Düzenle"
    if (pathname.includes("/teklifler/teklif-sablonu")) return "Teklif Şablonu"
    if (pathname.includes("/teklifler/eposta-log")) return "E-posta Log"
    if (pathname.includes("/teklifler/sartlar")) return "Şartlar ve Koşullar"

    if (pathname.includes("/urunler/yeni")) return "Yeni Ürün"
    if (pathname.includes("/urunler/")) return "Ürün Düzenle"
    if (pathname.endsWith("/urunler")) return "Ürünler"
    if (pathname.includes("/stok")) return "Stok Yönetimi"
    if (pathname.includes("/depolar")) return "Depolar"
    if (pathname.includes("/raporlar")) return "Raporlar"
    if (pathname.includes("/ayarlar")) return "Genel Ayarlar"
    if (pathname.includes("/mesajlar")) return "Mesajlar"
    if (pathname.includes("/personel")) return "Personeller"
    if (pathname.includes("/departmanlar")) return "Departmanlar"
    if (pathname.includes("/toplu-mesaj")) return "Toplu Mesaj"
    if (pathname.includes("/magaza")) return "Mağaza"
    return "Kontrol Paneli"
  }

  const title = getPageTitle()

  const getBreadcrumb = () => {
    const crumbs: { label: string; href: string; icon?: any }[] = [
      { label: "Kontrol Paneli", href: "/panel", }
    ]
    const currentTitle = getPageTitle()

    if (pathname.includes("/urunler") || pathname.includes("/stok") || pathname.includes("/depolar")) {
      crumbs.push({ label: "Ürün Yönetimi", href: "/panel/urunler" })
      if (pathname.includes("/urunler")) {
        if (pathname.includes("/yeni") || pathname.split('/').length > 3) {
          crumbs.push({ label: "Ürünler", href: "/panel/urunler" })
        }
      } else if (pathname.includes("/stok")) {
        crumbs.push({ label: "Stok Yönetimi", href: "/panel/stok" })
      } else if (pathname.includes("/depolar")) {
        crumbs.push({ label: "Depolar", href: "/panel/depolar" })
      }
    } else if (pathname.includes("/personel") || pathname.includes("/departmanlar")) {
      crumbs.push({ label: "Personel Yönetimi", href: "/panel/personel" })
    } else if (pathname.includes("/musteriler")) {
      if (pathname.includes("/yeni") || pathname.split('/').length > 3) {
        crumbs.push({ label: "Müşteriler", href: "/panel/musteriler" })
      }
    } else if (pathname.includes("/teklifler")) {
      crumbs.push({ label: "Teklifler", href: "/panel/teklifler/tekliflerim" })
      if (pathname.includes("/tekliflerim") && (pathname.includes("/yeni") || pathname.split('/').length > 4)) {
        crumbs.push({ label: "Tekliflerim", href: "/panel/teklifler/tekliflerim" })
      } else if (pathname.includes("/teklif-sablonu") && (pathname.includes("/yeni") || pathname.split('/').length > 4)) {
        crumbs.push({ label: "Teklif Şablonu", href: "/panel/teklifler/teklif-sablonu" })
      }
    }

    const lastCrumb = crumbs[crumbs.length - 1];
    if (lastCrumb && lastCrumb.label !== currentTitle) {
      crumbs.push({ label: currentTitle, href: pathname })
    }

    return crumbs.map((crumb, index) => (
      <div key={index} className="flex items-center gap-2">
        <Link
          href={crumb.href}
          className={cn(
            "flex items-center gap-1.5 transition-all hover:text-orange-600 whitespace-nowrap",
            index === crumbs.length - 1 ? "text-slate-500 font-normal" : "text-slate-400/80"
          )}
        >
          {crumb.icon}
          <span>{crumb.label}</span>
        </Link>
        {index < crumbs.length - 1 && <span className="text-slate-300 font-light mx-0.5">/</span>}
      </div>
    ))
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#FAF7F5] h-screen overflow-hidden">
        <div className="flex h-full flex-col p-2 md:p-3 lg:p-4 max-w-[1700px] w-full mx-auto overflow-hidden">
          <div className="flex flex-1 flex-col rounded-[2rem] md:rounded-[2.5rem] bg-white shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100/50 relative overflow-hidden">
            {/* Header */}
            <div className={cn(
              "shrink-0 px-4 pt-6 md:px-10 md:pt-8 mb-6 flex items-start justify-between font-sans gap-4",
              pathname.includes("/panel/mesajlar") && "md:hidden"
            )}>
              <div className="flex items-start gap-3 md:gap-4 min-w-0 flex-1">
                <SidebarTrigger className="-ml-1 md:hidden mt-0.5 overflow-visible shrink-0 transition-transform active:scale-95" />
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center text-[10px] md:text-[10px] text-slate-400 font-normal overflow-hidden">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap pr-4">
                      {getBreadcrumb()}
                    </div>
                  </div>
                  <h1 className="text-xl md:text-3xl font-semibold text-[#1A202C] truncate leading-tight">
                    {title}
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
                    <Link href="/panel/ayarlar" className="group">
                      <UserAvatar
                        name={user?.name}
                        surname={user?.surname}
                        picture={user?.profile?.picture}
                        size="md"
                        className="md:!size-11 !rounded-xl md:!rounded-2xl group-hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-200"
                      />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className={cn(
              "flex-1 no-scrollbar scroll-smooth",
              pathname.includes("/panel/mesajlar") ? "overflow-hidden flex flex-col p-4 pt-4" : "overflow-y-auto px-6 pb-8 md:px-10 md:pb-12"
            )}>
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
