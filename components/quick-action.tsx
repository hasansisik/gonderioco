"use client"

import Link from "next/link"
import { LucideIcon, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickActionProps {
    href: string
    icon: LucideIcon
    label: string
    bgColor: string
    textColor: string
    hoverBg: string
}

export function QuickAction({ href, icon: Icon, label, bgColor, textColor, hoverBg }: QuickActionProps) {
    return (
        <Link href={href} className="w-full group">
            <div className={cn(
                "relative w-full flex flex-col items-center justify-center p-5 rounded-3xl transition-all duration-500 gap-3 h-full border border-slate-100/50 bg-white hover:bg-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] group-hover:-translate-y-1 overflow-hidden"
            )}>
                <div className={cn(
                    "size-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm group-hover:scale-110 group-hover:rotate-3",
                    bgColor,
                    textColor
                )}>
                    <Icon className="size-7" />
                </div>

                <div className="flex flex-col items-center gap-1">
                    <span className="text-[13px] font-bold text-slate-800">{label}</span>
                    <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Tıkla ve Oluştur</span>
                </div>

                <div className="absolute top-4 right-4 text-slate-200 group-hover:text-orange-500 transition-colors duration-300">
                    <ArrowUpRight className="size-4" />
                </div>

                {/* Subtle background glow on hover */}
                <div className={cn(
                    "absolute -bottom-10 -right-10 size-24 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500",
                    bgColor
                )} />
            </div>
        </Link>
    )
}
