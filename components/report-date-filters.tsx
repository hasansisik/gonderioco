"use client"

import * as React from "react"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { DayPicker, DateRange as DayPickerRange } from "react-day-picker"
import "react-day-picker/dist/style.css"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { startOfDay, endOfDay, subDays, startOfWeek, startOfMonth, subMonths, startOfYear, format } from "date-fns"
import { tr } from "date-fns/locale"

export type DateRange = {
    from: Date | undefined
    to?: Date | undefined
}

interface ReportDateFiltersProps {
    onRangeChange: (range: DateRange) => void
    initialRange?: DateRange
    className?: string
}

const presets = [
    { label: "Bugün", getValue: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
    { label: "Dün", getValue: () => ({ from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)) }) },
    { label: "Bu Hafta", getValue: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: endOfDay(new Date()) }) },
    { label: "Bu Ay", getValue: () => ({ from: startOfMonth(new Date()), to: endOfDay(new Date()) }) },
    { label: "Son 3 Ay", getValue: () => ({ from: startOfMonth(subMonths(new Date(), 3)), to: endOfDay(new Date()) }) },
    { label: "Son 6 Ay", getValue: () => ({ from: startOfMonth(subMonths(new Date(), 6)), to: endOfDay(new Date()) }) },
    { label: "Bu Yıl", getValue: () => ({ from: startOfYear(new Date()), to: endOfDay(new Date()) }) },
]

export function ReportDateFilters({ onRangeChange, initialRange, className }: ReportDateFiltersProps) {
    const [selectedLabel, setSelectedLabel] = React.useState("Bu Ay")

    // Local state for the dropdown before applying
    const [localRange, setLocalRange] = React.useState<DayPickerRange | undefined>({
        from: initialRange?.from || startOfMonth(new Date()),
        to: initialRange?.to || endOfDay(new Date()),
    })

    // Permanent state that reflects what is currently applied
    const [appliedRange, setAppliedRange] = React.useState<DateRange>({
        from: initialRange?.from || startOfMonth(new Date()),
        to: initialRange?.to || endOfDay(new Date()),
    })

    const [isOpen, setIsOpen] = React.useState(false)

    const handlePresetSelect = (preset: typeof presets[0]) => {
        const val = preset.getValue()
        setSelectedLabel(preset.label)
        setLocalRange({ from: val.from, to: val.to })
        // Presets apply immediately usually, but let's keep consistency: only update local, wait for Apply?
        // Actually presets are quick actions, but user asked for "Apply button".
        // Let's make EVERYTHING wait for Apply for consistency.
    }

    const handleSelect = (newRange: DayPickerRange | undefined) => {
        setLocalRange(newRange)
        setSelectedLabel("Özel")
    }

    const handleApply = () => {
        if (localRange?.from && localRange?.to) {
            const finalRange = { from: startOfDay(localRange.from), to: endOfDay(localRange.to) }
            setAppliedRange(finalRange)
            onRangeChange(finalRange)
            setIsOpen(false)
        }
    }

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <DropdownMenu open={isOpen} onOpenChange={(open) => {
                setIsOpen(open)
                if (open) {
                    // Sync local with applied when opening
                    setLocalRange({ from: appliedRange.from, to: appliedRange.to })
                }
            }}>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-700 shadow-sm hover:border-orange-200 transition-all outline-none min-w-[180px]">
                        <CalendarIcon className="size-4 text-orange-500" />
                        <span className="flex-1 text-left">{selectedLabel}</span>
                        <ChevronDown className={cn("size-3 text-slate-400 transition-transform", isOpen && "rotate-180")} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-0 border-slate-100 shadow-2xl rounded-[1.5rem] overflow-hidden bg-white flex flex-col md:flex-row divide-x divide-slate-50">
                    {/* Presets Sidebar */}
                    <div className="w-full md:w-32 bg-slate-50/50 p-2 flex flex-col gap-1">
                        <p className="text-[11px] font-bold text-slate-500 px-2 mb-1">Hızlı Seçim</p>
                        {presets.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => handlePresetSelect(preset)}
                                className={cn(
                                    "w-full px-3 py-2 rounded-xl text-left text-[11px] font-bold transition-all",
                                    localRange?.from?.getTime() === preset.getValue().from.getTime() &&
                                        localRange?.to?.getTime() === preset.getValue().to.getTime()
                                        ? "bg-white text-orange-600 shadow-sm border border-orange-100"
                                        : "text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm"
                                )}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    {/* Calendar Area */}
                    <div className="p-4 bg-white calendar-custom-style">
                        <DayPicker
                            id="report-range"
                            mode="range"
                            selected={localRange}
                            onSelect={handleSelect}
                            locale={tr}
                            modifiersStyles={{
                                selected: { backgroundColor: '#FB8200', color: 'white' },
                                today: { color: '#FB8200', fontWeight: 'bold' }
                            }}
                            styles={{
                                caption: { fontSize: '14px', fontWeight: 'bold' },
                                head_cell: { fontSize: '12px', color: '#64748b' },
                                day: { fontSize: '12px', padding: '8px' }
                            }}
                        />
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
                            <div className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                                {localRange?.from ? format(localRange.from, "d MMM yyyy", { locale: tr }) : "..."} - {localRange?.to ? format(localRange.to, "d MMM yyyy", { locale: tr }) : "..."}
                            </div>
                            <button
                                onClick={handleApply}
                                disabled={!localRange?.from || !localRange?.to}
                                className="px-6 py-2 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-30 disabled:hover:bg-slate-900"
                            >
                                Uygula
                            </button>
                        </div>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            <style jsx global>{`
        .calendar-custom-style .rdp {
          --rdp-cell-size: 38px;
          --rdp-accent-color: #FB8200;
          --rdp-background-color: #FFF2E5;
          margin: 0;
        }
        .calendar-custom-style .rdp-day_selected {
          background-color: #FB8200 !important;
          color: white !important;
          border-radius: 12px;
        }
        .calendar-custom-style .rdp-day_range_middle {
          background-color: #FFF2E5 !important;
          color: #FB8200 !important;
          border-radius: 0;
        }
        .calendar-custom-style .rdp-day_range_start {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        .calendar-custom-style .rdp-day_range_end {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }
      `}</style>
        </div>
    )
}
