"use client"

import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp } from "lucide-react"

interface StatCardProps {
    label: string
    value: string
    icon: LucideIcon
    color: string
    bgColor: string
    trend?: string
}

export function StatCard({ label, value, icon: Icon, color, bgColor, trend }: StatCardProps) {
    return (
        <div className="group relative rounded-3xl bg-white p-6 shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">
            {/* Background Accent */}
            <div className={cn("absolute -right-6 -top-6 size-32 blur-3xl rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500", bgColor)} />

            <div className="flex items-center justify-between mb-5 relative z-10">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm", bgColor)}>
                    <Icon className={cn("size-6 transition-colors duration-500", color)} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/50 backdrop-blur-md rounded-xl border border-slate-100 shadow-sm transition-all duration-300 group-hover:border-slate-200">
                        <TrendingUp className={cn("size-3", color)} />
                        <span className="text-[11px] font-normal text-slate-500">{trend}</span>
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <p className="text-slate-400 text-[11px] font-normal group-hover:text-slate-500 transition-colors">{label}</p>
                <div className="flex items-end gap-2 mt-1.5">
                    <h3 className="text-2xl font-semibold text-slate-800  group-hover:text-slate-900 transition-colors">{value}</h3>
                </div>
            </div>

            {/* Subtle Progress Bar Decoration */}
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
    )
}
