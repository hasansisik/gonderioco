"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: any // Can be LucideIcon or custom component
  badge?: string
  items?: {
    title: string
    url: string
  }[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const [openTitle, setOpenTitle] = useState<string | null>(null)

  // Sync open state with pathname on initial load and path matches
  useEffect(() => {
    const activeItem = items.find(item =>
      item.items?.some(sub => pathname === sub.url)
    )
    if (activeItem) {
      setOpenTitle(activeItem.title)
    }
  }, [pathname, items])

  return (
    <SidebarMenu className="gap-2">
      {items.map((item) => {
        const isExactlyActive = pathname === item.url
        const hasActiveChild = item.items?.some(sub => pathname === sub.url)
        // Highlight parent ONLY if it's the exact page or a leaf node active
        const isSelected = isExactlyActive || (!item.items && item.url !== "/panel" && pathname.startsWith(item.url))

        if (item.items) {
          return (
            <Collapsible
              key={item.title}
              asChild
              open={openTitle === item.title}
              onOpenChange={(isOpen) => setOpenTitle(isOpen ? item.title : null)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "flex items-center gap-3 px-3 py-6 text-[14px] font-normal transition-all duration-300 rounded-[1.25rem] whitespace-nowrap",
                      isSelected
                        ? "bg-[#FB8200] text-white shadow-xl shadow-orange-500/20 hover:bg-[#FB8200] hover:text-white"
                        : hasActiveChild
                          ? "!bg-white text-[#2D3748] shadow-sm !hover:bg-white hover:text-[#FB8200]"
                          : "text-[#2D3748]/70 !bg-transparent !hover:bg-transparent hover:text-[#FB8200]"
                    )}
                  >
                    <item.icon className={cn("size-[20px] shrink-0", isSelected ? "text-white" : hasActiveChild ? "text-[#FB8200]" : "text-[#2D3748]/50 group-hover:text-[#FB8200] transition-colors")} />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronRight className={cn(
                      "ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90",
                      isSelected ? "text-white" : "text-[#2D3748]/30"
                    )} />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="ml-8 mr-2 mt-2 border-l-2 border-orange-100/50 gap-2 px-0 py-1">
                    {item.items.map((subItem) => {
                      const isSubActive = pathname === subItem.url
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              "text-[13px] font-semibold transition-all px-4 py-3 rounded-xl whitespace-nowrap h-auto justify-start",
                              isSubActive
                                ? "bg-orange-50 text-[#FB8200]"
                                : "text-[#2D3748]/60 hover:text-[#FB8200] hover:bg-orange-50/20"
                            )}
                          >
                            <a href={subItem.url} className="block w-full text-left">{subItem.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        }

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              className={cn(
                "flex items-center gap-3 px-3 py-6 text-[14px] font-normal transition-all duration-300 rounded-[1.25rem] whitespace-nowrap",
                isSelected
                  ? "bg-[#FB8200] text-white shadow-xl shadow-orange-500/20 hover:bg-[#FB8200] hover:text-white"
                  : "text-[#2D3748]/70 !bg-transparent !hover:bg-transparent hover:text-[#FB8200]"
              )}
            >
              <a href={item.url} className="flex items-center w-full min-w-0 justify-start">
                <item.icon className={cn("size-[20px] shrink-0", isSelected ? "text-white" : "text-[#2D3748]/50 group-hover:text-[#FB8200] transition-colors")} />
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <span className={cn(
                    "ml-auto flex items-center justify-center min-w-[26px] h-6 px-1.5 rounded-full text-[11px] font-semibold shrink-0",
                    isSelected ? "bg-white text-[#FB8200]" : "bg-[#2D3748] text-white"
                  )}>
                    {item.badge}
                  </span>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
