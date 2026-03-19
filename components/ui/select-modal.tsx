"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { FormLabel } from "./premium-form-elements"

interface SelectModalProps {
    label: string
    options: { id: string; label: string }[] | string[]
    value: string | string[]
    onChange: (value: any) => void
    placeholder?: string
    required?: boolean
    disabled?: boolean
    multiple?: boolean
    isStatus?: boolean
    showSearch?: boolean
}

export function SelectModal({
    label,
    options,
    value,
    onChange,
    placeholder = "Seçiniz...",
    required = false,
    disabled = false,
    multiple = false,
    isStatus = false,
    showSearch = true,
    icon: Icon,
    className,
}: SelectModalProps & { icon?: any; className?: string }) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const containerRef = React.useRef<HTMLDivElement>(null)

    const normalizedOptions = React.useMemo(() => {
        return options.map((opt) =>
            typeof opt === "string" ? { id: opt, label: opt } : opt
        )
    }, [options])

    const filteredOptions = React.useMemo(() => {
        return normalizedOptions.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase())
        )
    }, [normalizedOptions, search])

    const isSelected = (id: string) => {
        if (multiple && Array.isArray(value)) {
            return (value as string[]).includes(id)
        }
        return value === id
    }

    const selectedLabel = React.useMemo(() => {
        const existentValues = Array.isArray(value)
            ? Array.from(new Set(value.filter(v => v)))
            : [value].filter(v => v);

        if (existentValues.length === 0) return ""

        if (multiple) {
            const labels = existentValues.map(v => normalizedOptions.find(opt => opt.id === v)?.label || v)
            if (labels.length === 1) return labels[0]
            return `${labels.length} Seçili (${labels.slice(0, 1).join(", ")}${labels.length > 1 ? "..." : ""})`
        }

        return normalizedOptions.find((opt) => opt.id === value)?.label || (typeof value === 'string' ? value : "")
    }, [normalizedOptions, value, multiple])

    const handleSelect = (id: string) => {
        if (disabled) return
        if (multiple) {
            const currentValues = Array.isArray(value) ? (value as string[]).filter(v => v && v.trim() !== "") : []
            const newValues = currentValues.includes(id)
                ? currentValues.filter(v => v !== id)
                : [...currentValues, id]
            onChange(Array.from(new Set(newValues)))
        } else {
            onChange(id)
            setOpen(false)
            setSearch("")
        }
    }

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const getStatusStyles = (status: any) => {
        if (!isStatus) return "bg-white border-slate-100 text-slate-800"

        switch (status) {
            case 'Faturalandı':
                return "bg-[#6B46C1] border-[#6B46C1] text-white"
            case 'Müşteri Onayı Bekleniyor':
            case 'Müşteri Onayı Bekleniyor':
                return "bg-white border-slate-200 text-[#4A5568]"
            case 'Yönetici Onayı Bekliyor':
                return "bg-amber-500 border-amber-500 text-white"
            case 'Yönetici Onayladı':
            case 'Müşteri Onayladı':
            case 'Onaylandı':
                return "bg-emerald-500 border-emerald-500 text-white"
            case 'Müşteri Reddetti':
            case 'Reddedildi':
                return "bg-rose-500 border-rose-500 text-white"
            case 'Proformatlandı':
                return "bg-blue-500 border-blue-500 text-white"
            case 'Kısmi Faturalandı':
                return "bg-amber-500 border-amber-500 text-white"
            case 'Onay Bekliyor':
                return "bg-orange-500 border-orange-500 text-white"
            case 'Revizyon Talep Edildi':
                return "bg-pink-500 border-pink-500 text-white"
            case 'Taslak':
                return "bg-slate-500 border-slate-500 text-white"
            default:
                return "bg-white border-slate-100 text-slate-500"
        }
    }

    const currentStatusStyles = getStatusStyles(value)
    const isDarkBg = currentStatusStyles.includes('text-white')

    return (
        <div className={cn("flex flex-col w-full group relative", className)} ref={containerRef}>
            {label && <FormLabel required={required}>{label}</FormLabel>}
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen(!open)}
                className={cn(
                    "flex w-full items-center justify-between rounded-2xl border transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 text-xs font-normal h-11 relative",
                    currentStatusStyles,
                    Icon ? "pl-12 pr-6" : "px-6",
                    isStatus && "h-11 rounded-xl text-[12px]",
                    disabled && "bg-slate-50 opacity-100 border-slate-100 text-slate-400 cursor-default shadow-none",
                    open && "border-blue-200 ring-4 ring-blue-500/5"
                )}
            >
                {Icon && (
                    <div className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none flex items-center justify-center",
                        isDarkBg ? "text-white/80" : (disabled ? "text-slate-300" : "text-slate-400")
                    )}>
                        <Icon className="size-4.5" />
                    </div>
                )}
                <span className="truncate flex-1 text-left leading-none">
                    {selectedLabel || placeholder}
                </span>
                {!disabled && (
                    <ChevronDown className={cn(
                        "ml-2 h-4 w-4 shrink-0 transition-transform",
                        open && "rotate-180",
                        isDarkBg ? "text-white/80" : "text-slate-400"
                    )} />
                )}
            </button>

            {open && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] z-50 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {showSearch && (
                        <div className="p-3 border-b border-slate-50 bg-slate-50/30">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Ara..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-white rounded-xl border border-slate-100 py-2 pl-9 pr-4 text-[12px] focus:outline-none focus:border-orange-200"
                                />
                            </div>
                        </div>
                    )}
                    <div className="max-h-[250px] overflow-auto p-2 custom-scrollbar">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-[12px] text-slate-400">Sonuç bulunamadı.</div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleSelect(opt.id)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-[12px] text-left transition-colors hover:bg-slate-50",
                                        isSelected(opt.id) ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-600 font-medium"
                                    )}
                                >
                                    <div className="flex items-center gap-2 text-left w-full">
                                        {multiple && (
                                            <div className={cn(
                                                "size-4 rounded border flex items-center justify-center transition-colors shrink-0",
                                                isSelected(opt.id) ? "bg-orange-500 border-orange-500" : "border-slate-300 bg-white"
                                            )}>
                                                {isSelected(opt.id) && <Check className="size-2.5 text-white" />}
                                            </div>
                                        )}
                                        <span className="text-left w-full block whitespace-normal">{opt.label}</span>
                                    </div>
                                    {!multiple && isSelected(opt.id) && <Check className="size-3.5 shrink-0 ml-2" />}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
