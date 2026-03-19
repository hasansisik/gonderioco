"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { updateEnabledModules, getSettings } from "@/redux/actions/settingsActions"
import { useEffect } from "react"
import { PermissionGuard } from "@/components/permission-guard"
import { Send, ShoppingBag, Coins, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function MagazaPage() {
    const dispatch = useAppDispatch()
    const { settings, loading } = useAppSelector((state) => state.settings)

    useEffect(() => {
        dispatch(getSettings())
    }, [dispatch])

    const handleToggleModule = async (moduleName: string, enabled: boolean) => {
        const result = await dispatch(updateEnabledModules({ [moduleName]: enabled }))
        if (updateEnabledModules.fulfilled.match(result)) {
            const moduleLabels: Record<string, string> = {
                massMessage: "Müşteri Toplu Mesaj",
                commissionSystem: "Personel Prim Sistemi"
            }
            toast.success(`${moduleLabels[moduleName] || "Modül"} ${enabled ? "etkinleştirildi" : "devre dışı bırakıldı"}.`)
        } else {
            toast.error("İşlem sırasında bir hata oluştu.")
        }
    }

    const modules = [
        {
            id: 'massMessage',
            title: "Müşteri Toplu Mesaj",
            description: "Tüm müşterilerinize veya seçtiğiniz gruplara tek seferde duyuru, kampanya veya bilgilendirme mesajları gönderin.",
            icon: Send,
            color: "orange",
            enabled: settings?.enabledModules?.massMessage || false,
            features: [
                "Aynı anda tüm müşterilere erişim",
                "Cevap verilemez duyuru formatı",
                "Gönderim geçmişi takibi"
            ]
        },
        {
            id: 'commissionSystem',
            title: "Personel Prim Sistemi",
            description: "Personellerinizin satış performansına göre prim oranlarını belirleyin ve ödemeleri kolayca takip edin.",
            icon: Coins,
            color: "blue",
            enabled: settings?.enabledModules?.commissionSystem || false,
            features: [
                "Personel bazlı prim oranları",
                "KDV dahil/hariç hesaplama",
                "Otomatik borç takibi"
            ]
        }
    ]

    return (
        <PermissionGuard permissions={["Mağaza Görüntüle"]}>
            <div className="flex flex-col gap-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">İşletme kapasitenizi artıracak ek modülleri buradan yönetin.</p>
                    </div>
                </div>

                {/* Modules List */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            className={cn(
                                "group bg-white rounded-[2rem] border transition-all duration-500 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]",
                                module.enabled
                                    ? "border-emerald-100/50"
                                    : "border-slate-100 hover:border-slate-200"
                            )}
                        >
                            <div className="p-8 space-y-8">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex items-start gap-5 text-left">
                                        <div className={cn(
                                            "size-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
                                            module.enabled
                                                ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                                                : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                                        )}>
                                            <module.icon className="size-7" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-medium text-slate-800 ">{module.title}</h3>
                                                {module.enabled && (
                                                    <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100 uppercase ">
                                                        AKTİF
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                                {module.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-3">
                                        <span className="text-[10px] font-medium text-slate-400 hidden sm:block">DURUM</span>
                                        <label className="relative inline-flex items-center cursor-pointer group/toggle">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={module.enabled}
                                                disabled={loading}
                                                onChange={(e) => handleToggleModule(module.id, e.target.checked)}
                                            />
                                            <div className={cn(
                                                "w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer transition-all duration-300",
                                                "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm",
                                                "peer-checked:after:translate-x-6 peer-checked:bg-slate-900"
                                            )} />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {module.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2.5 p-3 bg-slate-50/50 rounded-xl border border-slate-50 group-hover:bg-slate-50 transition-colors">
                                            <div className="size-1.5 bg-slate-200 rounded-full" />
                                            <span className="text-[11px] font-medium text-slate-500 uppercase ">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer / Coming Soon */}
                <div className="mt-12 flex flex-col items-center justify-center p-12 bg-slate-50/30 rounded-[3rem] border border-dashed border-slate-200 gap-4">
                    <div className="size-14 rounded-2xl bg-white flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                        <ShoppingBag className="size-7" />
                    </div>
                    <div className="text-center space-y-1">
                        <h4 className="font-medium text-slate-800 text-base">Yakında Yeni Modüller</h4>
                        <p className="text-xs text-slate-400 font-medium max-w-[320px]">
                            İşletmenizi daha verimli yönetmeniz için yeni özellikler ve entegrasyonlar üzerinde çalışmaya devam ediyoruz.
                        </p>
                    </div>
                </div>
            </div>
        </PermissionGuard>
    )
}
