"use client"
// GONDERIO_SIDEBAR_V3_FORCE_REBUILD
console.log("Rendering AppSidebar V3");

import * as React from "react"
import {
  BarChart2,
  Coins,
  LayoutGrid,
  MessageSquare,
  Settings,
  PlusCircle,
  Package,
  UserCheck,
  Calculator,
  Blocks,
  FileText,
  Wallet,
  Home,
  MapPin,
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
import { NavUser } from "@/components/nav-user"
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
    Calculator,
    PlusCircle,
    Package,
    UserCheck,
    MessageSquare,
    Blocks,
    FileText,
    Wallet,
    Home,
    MapPin,
    Settings,
  };

  const computeNavData = React.useCallback(() => {
    return [
      {
        title: "Kontrol Paneli",
        url: "/panel",
        iconKey: "LayoutGrid",
      },
      {
        title: "Hızlı Fiyat Hesapla",
        url: "/panel/hizli-fiyat",
        iconKey: "Calculator",
      },
      {
        title: "Gönderi Oluştur",
        url: "/panel/gonderi-olustur",
        iconKey: "PlusCircle",
      },
      {
        title: "Sevkiyatlarım",
        url: "/panel/sevkiyatlarim",
        iconKey: "Package",
      },
      {
        title: "Kurye Taleplerim",
        url: "/panel/kurye-taleplerim",
        iconKey: "UserCheck",
      },
      {
        title: "Taleplerim",
        url: "/panel/taleplerim",
        iconKey: "MessageSquare",
      },
      {
        title: "Entegrasyonlarım",
        url: "#",
        iconKey: "Blocks",
        items: [
          { title: "Siparişlerim", url: "/panel/entegrasyon/siparislerim" },
          { title: "Pazaryeri", url: "/panel/entegrasyon/pazaryeri" },
          { title: "Fatura Entegrasyonları", url: "/panel/entegrasyon/fatura" },
        ],
      },
      {
        title: "Navlungo Belgelerim",
        url: "#",
        iconKey: "FileText",
        items: [
          { title: "Etgb'lerim", url: "/panel/belgeler/etgb" },
          { title: "Faturalarım", url: "/panel/belgeler/faturalar" },
        ],
      },
      {
        title: "Ödemelerim",
        url: "#",
        iconKey: "Wallet",
        items: [
          { title: "Navlungo Cüzdan", url: "/panel/odemeler/cüzdan" },
          { title: "Ödeme Geçmişim", url: "/panel/odemeler/gecmis" },
          { title: "Kayıtlı Kartlarım", url: "/panel/odemeler/kartlar" },
        ],
      },
      {
        title: "Adreslerim",
        url: "/panel/adreslerim",
        iconKey: "Home",
      },
    ];
  }, []);

  const [navItems, setNavItems] = React.useState<any[]>([]);

  const attachIconsToItems = React.useCallback((items: any[]) => {
    return items.map(item => ({
      ...item,
      icon: ICON_MAP[item.iconKey] || ICON_MAP["LayoutGrid"]
    }));
  }, []);

  // 1. Initial Load from Persistent Cache - REMOVED TO ENSURE LATEST ITEMS SHOW
  React.useEffect(() => {
    // Clear old cache to be 100% sure
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sidebar_nav_items');
    }

    // Immediate settings fetch
    dispatch(getSettings());
    dispatch(getConversations());

    const items = computeNavData();
    setNavItems(attachIconsToItems(items));
    setMounted(true);
  }, [computeNavData, attachIconsToItems, dispatch]);

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
      <SidebarHeader className="px-6 pt-10 pb-4">
        <div className="flex items-center gap-3 min-h-[80px]">
          <img
            src={logoToRender}
            alt="gonderio.co"
            loading="eager"
            fetchPriority="high"
            className={cn(
              "h-20 w-auto object-contain transition-all duration-500",
              !mounted ? "opacity-0 scale-95" : "opacity-100 scale-100"
            )}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2 overflow-y-auto no-scrollbar">
        <NavMain items={attachIconsToItems(computeNavData())} />
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user && (
          <NavUser user={{
            name: user.name || user.username || "User",
            email: user.email || "",
            avatar: user.avatar || "/avatar.png"
          }} />
        )}
        <div className="flex flex-col gap-1 mt-4 px-2">
          <span className="text-[11px] font-medium text-slate-400 opacity-60">
            © 2026 gonderio.co
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
