"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export const FormLabel = ({ children, className, required = false }: { children: React.ReactNode, className?: string, required?: boolean }) => (
    <label className={cn("text-[11px] font-normal text-slate-500 mb-3 px-1 block", className)}>
        {children}
        {required && <span className="text-rose-500 ml-1">*</span>}
    </label>
)

export const PremiumInput = ({ label, placeholder, type = "text", value, onChange, maxLength, className, required = false, disabled = false, icon: Icon }: any) => (
    <div className={cn("flex flex-col w-full group", className)}>
        {label && <FormLabel required={required}>{label}</FormLabel>}
        <div className="relative">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors pointer-events-none flex items-center justify-center">
                    <Icon className="size-4.5" />
                </div>
            )}
            <input
                type={type}
                value={value || ''}
                onChange={onChange}
                maxLength={maxLength}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={cn(
                    "w-full h-11 rounded-2xl border border-slate-200 bg-white text-[12px] text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white transition-all shadow-sm placeholder:text-slate-300 font-sans",
                    Icon ? "pl-11 pr-5" : "px-6",
                    disabled && "bg-slate-50 border-slate-100 opacity-100 text-slate-700 cursor-default"
                )}
            />
        </div>
    </div>
)

export const PremiumTextarea = ({ label, placeholder, value, onChange, className, required = false, rows = 4, disabled = false }: any) => (
    <div className={cn("flex flex-col w-full group", className)}>
        {label && <FormLabel required={required}>{label}</FormLabel>}
        <textarea
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            disabled={disabled}
            className={cn(
                "w-full rounded-[2rem] border border-slate-200 bg-white px-6 py-4 text-[12px] text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white shadow-inner resize-none leading-relaxed transition-all font-sans placeholder:text-slate-300",
                disabled && "bg-slate-50 border-slate-100 opacity-100 text-slate-700 cursor-default"
            )}
        />
    </div>
)

export const FormSection = ({ title, icon: Icon, children, className, description }: any) => (
    <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex items-center gap-4">
            {Icon && (
                <div className="size-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 shadow-sm shrink-0">
                    <Icon className="size-5.5" />
                </div>
            )}
            <div>
                <h3 className="text-[17px] font-semibold text-slate-800  leading-none">{title}</h3>
                {description && <p className="text-[11px] text-slate-500 font-medium mt-2">{description}</p>}
            </div>
        </div>
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 p-8 shadow-[0_12px_40px_rgb(0,0,0,0.02)]">
            {children}
        </div>
    </div>
)

export const PremiumSelect = ({ label, value, onChange, options, placeholder, className, required = false, icon: Icon, disabled = false }: any) => (
    <div className={cn("flex flex-col w-full group", className)}>
        {label && <FormLabel required={required}>{label}</FormLabel>}
        <div className="relative">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors pointer-events-none z-10 flex items-center justify-center">
                    <Icon className="size-4.5" />
                </div>
            )}
            <select
                value={value || ''}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={cn(
                    "w-full h-11 appearance-none rounded-2xl border border-slate-200 bg-white text-[12px] text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white transition-all cursor-pointer shadow-sm font-sans",
                    Icon ? "pl-11 pr-10" : "px-6 pr-10",
                    disabled && "bg-slate-50 border-slate-100 opacity-100 text-slate-700 cursor-default"
                )}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt: any) => (
                    <option key={opt.id || opt.value || opt} value={opt.id || opt.value || opt}>
                        {opt.label || opt.name || opt}
                    </option>
                ))}
            </select>
            {!disabled && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none group-focus-within:text-orange-500 transition-colors" />}
        </div>
    </div>
)
