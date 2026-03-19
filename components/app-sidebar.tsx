"use client"

import * as React from "react"
import {
  BarChart2,
  Coins,
  LayoutGrid,
  MessageSquare,
  Settings,
  UserCircle2,
  Users,
  Store,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getConversations } from "@/redux/actions/messageActions"
import { getSettings } from "@/redux/actions/settingsActions"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"
import { usePermissions } from "@/hooks/usePermissions"

// Custom Icon for "Ürünler" as seen in the mockup (vertical bars)
const ProductsIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="6" width="2" height="12" rx="1" />
    <rect x="8" y="6" width="3" height="12" rx="1" />
    <rect x="13" y="6" width="2" height="12" rx="1" />
    <rect x="17" y="6" width="3" height="12" rx="1" />
  </svg>
)

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useAppDispatch()
  const { settings } = useAppSelector((state) => state.settings)
  const { conversations } = useAppSelector((state) => state.message)
  const [mounted, setMounted] = React.useState(false)

  // Calculate total unread count
  const totalUnreadCount = React.useMemo(() => {
    return conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0)
  }, [conversations])

  const { hasPermission, hasAnyPermission, isLoading, isCustomer, user } = usePermissions();

  const ICON_MAP: Record<string, any> = {
    LayoutGrid,
    UserCircle2,
    Coins,
    ProductsIcon,
    BarChart2,
    MessageSquare,
    Users,
    Settings,
    Store,
    Send,
  };

  const computeNavData = React.useCallback(() => {
    const items = [
      {
        title: "Kontrol Paneli",
        url: "/panel",
        iconKey: "LayoutGrid",
        visible: isCustomer || hasAnyPermission(["Full Dashboard", "Limited Dashboard", "Basic Dashboard"]),
      },
      {
        title: "Müşteriler",
        url: "/panel/musteriler",
        iconKey: "UserCircle2",
        visible: !isCustomer && hasPermission("Müşteri Görüntüle"),
      },
      {
        title: "Teklifler",
        url: "/panel/teklifler",
        iconKey: "Coins",
        visible: isCustomer || hasAnyPermission(["Teklif Görüntüle", "Şartlar ve Koşullar"]),
        items: isCustomer ? [
          { title: "Tekliflerim", url: "/panel/teklifler/tekliflerim", visible: true },
        ] : [
          { title: "Tekliflerim", url: "/panel/teklifler/tekliflerim", visible: hasPermission("Teklif Görüntüle") },
          { title: "Teklif Şablonu", url: "/panel/teklifler/teklif-sablonu", visible: hasPermission("Teklif Görüntüle") },
          { title: "Şartlar ve Koşullar", url: "/panel/teklifler/sartlar", visible: hasPermission("Şartlar ve Koşullar") },
        ].filter(item => item.visible),
      },
      {
        title: "Ürün Yönetimi",
        url: "/panel/urunler",
        iconKey: "ProductsIcon",
        visible: !isCustomer && hasAnyPermission(["Ürün Görüntüle", "Stok Yönetimi Görüntüle", "Depo Görüntüle"]),
        items: [
          { title: "Ürünler", url: "/panel/urunler", visible: hasPermission("Ürün Görüntüle") },
          { title: "Stok Yönetimi", url: "/panel/stok", visible: hasPermission("Stok Yönetimi Görüntüle") },
          { title: "Depolar", url: "/panel/depolar", visible: hasPermission("Depo Görüntüle") },
        ].filter(item => item.visible),
      },
      {
        title: "Mesajlar",
        url: "/panel/mesajlar",
        iconKey: "MessageSquare",
        visible: isCustomer || hasPermission("Mesajlar"),
        badge: totalUnreadCount > 0 ? totalUnreadCount.toString() : undefined,
      },
      {
        title: "Müşteri Toplu Mesaj",
        url: "/panel/toplu-mesaj",
        iconKey: "Send",
        visible: (!isCustomer && settings?.enabledModules?.massMessage && (user?.userType === 'provider' || hasPermission("Toplu Mesaj Gönder"))),
      },
      {
        title: "Prim Sistemi",
        url: "/panel/prim-sistemi",
        iconKey: "Coins",
        visible: (!isCustomer && settings?.enabledModules?.commissionSystem && (user?.userType === 'provider' || hasPermission("Prim Yönetimi"))),
      },
      {
        title: "Personel Yönetimi",
        url: "/panel/personel-yonetimi",
        iconKey: "Users",
        visible: !isCustomer && hasAnyPermission(["Personel Yönetimi", "Departman Yönetimi"]),
        items: [
          { title: "Personeller", url: "/panel/personel", visible: hasPermission("Personel Yönetimi") },
          { title: "Departmanlar", url: "/panel/departmanlar", visible: hasPermission("Departman Yönetimi") },
        ].filter(item => item.visible),
      },
      {
        title: "Raporlar",
        url: "/panel/raporlar",
        iconKey: "BarChart2",
        visible: !isCustomer && hasPermission("Rapor Görüntüle"),
        items: [
          { title: "Teklif Raporları", url: "/panel/raporlar/teklif", visible: true },
          { title: "Ürün Raporları", url: "/panel/raporlar/urun", visible: true },
          { title: "Müşteri Raporları", url: "/panel/raporlar/musteri", visible: true },
          { title: "Personel Raporları", url: "/panel/raporlar/personel", visible: true },
        ].filter(item => item.visible),
      },
      {
        title: "Mağaza",
        url: "/panel/magaza",
        iconKey: "Store",
        visible: (!isCustomer && (user?.userType === 'provider' || hasPermission("Mağaza Görüntüle"))),
      },
      {
        title: "Firmalar",
        url: "/panel/firmalar",
        iconKey: "UserCircle2",
        visible: isCustomer,
      },
      {
        title: "Genel Ayarlar",
        url: "/panel/ayarlar",
        iconKey: "Settings",
        visible: true,
      },
    ];

    return items.filter(item => item.visible);
  }, [isCustomer, hasPermission, hasAnyPermission, totalUnreadCount, settings]);

  const [navItems, setNavItems] = React.useState<any[]>([]);

  const attachIconsToItems = React.useCallback((items: any[]) => {
    return items.map(item => ({
      ...item,
      icon: ICON_MAP[item.iconKey] || ICON_MAP["LayoutGrid"]
    }));
  }, []);

  // 1. Initial Load from Persistent Cache
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedNav = localStorage.getItem('sidebar_nav_items');
      if (cachedNav) {
        try {
          const parsed = JSON.parse(cachedNav);
          setNavItems(attachIconsToItems(parsed));
        } catch (e) {
          console.error("Sidebar cache parse error", e);
        }
      }
    }

    // Immediate settings fetch
    dispatch(getSettings());
    dispatch(getConversations());

    setMounted(true);
  }, []); // Only once on mount

  // 2. Sync computed data when loading is complete
  React.useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      if (user || isCustomer) {
        const items = computeNavData();
        setNavItems(attachIconsToItems(items));
        localStorage.setItem('sidebar_nav_items', JSON.stringify(items));
      } else if (!isLoading && !user && mounted) {
        // Clear cache if no user found (logout case)
        setNavItems([]);
        localStorage.removeItem('sidebar_nav_items');
      }
    }
  }, [isLoading, computeNavData, attachIconsToItems, user, isCustomer, mounted]);

  // Keep conversations updated
  React.useEffect(() => {
    const timer = setInterval(() => {
      dispatch(getConversations());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [dispatch]);

  // Hydration-safe logo source state
  const [logoToRender, setLogoToRender] = React.useState("/logo.png");

  // Update logo source only after component is mounted on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar
      className="border-none transition-all duration-300"
      style={{ "--sidebar": "#FAF7F5" } as React.CSSProperties}
      {...props}
    >
      <SidebarHeader className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-3 min-h-[40px]">
          <img
            src={logoToRender}
            alt="sadeceteklif.com"
            loading="eager"
            fetchPriority="high"
            className={cn(
              "h-10 w-auto object-contain transition-all duration-500",
              !mounted ? "opacity-0 scale-95" : "opacity-100 scale-100"
            )}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2 overflow-y-auto no-scrollbar">
        {isLoading && navItems.length === 0 ? (
          <div className="space-y-2 px-2 py-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 w-full bg-slate-200/50 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <NavMain items={navItems} />
        )}
      </SidebarContent>

      <SidebarFooter className="p-6">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-slate-400 opacity-60">
            © 2026 SadeceTeklif.com
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
