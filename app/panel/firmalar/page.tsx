"use client"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/redux/hook"
import { server } from "@/config"
import axios from "axios"
import { Star, MessageSquare, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import sectorsData from "@/data/sectors.json"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/redux/hook"
import { createCustomerRequest, removeCustomerAssociation } from "@/redux/actions/companyActions"
import { toast } from "sonner"
import { UserPlus, UserCheck, Clock, UserMinus, X } from "lucide-react"

interface Company {
    _id: string
    name: string
    surname: string
    company: string
    sectors: string[]
    rating: number
    ratingCount: number
    logo: string | null
    companyCode?: string
    requestStatus: "pending" | "accepted" | "rejected" | null
}

export default function FirmalarPage() {
    const { user } = useAppSelector((state) => state.user)
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSector, setSelectedSector] = useState<string>("")
    const [requestingId, setRequestingId] = useState<string | null>(null)
    const router = useRouter()
    const dispatch = useAppDispatch()

    const fetchCompanies = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("accessToken")
            const params = new URLSearchParams()
            if (searchTerm) params.append("search", searchTerm)

            // Strictly filter by user's sectors by default. 'Tüm Sektörler' is removed.
            const sectorsToFilter = selectedSector || (user?.sectors?.length > 0 ? user.sectors.join(",") : "none")

            // We always append sectors to ensure only relevant companies are shown
            params.append("sectors", sectorsToFilter)

            const { data } = await axios.get(`${server}/companies?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCompanies(data.companies)
        } catch (error) {
            console.error("Error fetching companies:", error)
        } finally {
            setLoading(false)
        }
    }

    const firstFetch = async () => {
        if (!user) return

        // If we are about to fetch with filters, clear current companies to show skeleton
        // This prevents the "old data" from showing while the new data is loading
        setLoading(true)
        setCompanies([])

        await fetchCompanies()
    }

    useEffect(() => {
        if (user) {
            firstFetch()
        }
    }, [user, searchTerm, selectedSector])

    const handleMessageClick = (companyId: string) => {
        // Redirect to messages with the company id
        router.push(`/panel/mesajlar?new=${companyId}`)
    }

    const handleRequestClick = async (company: Company) => {
        const isCustomer = user?.associatedCompanyCodes?.includes(company.companyCode || '') || company.requestStatus === 'accepted';

        setRequestingId(company._id);

        if (isCustomer) {
            // Remove association
            if (!company.companyCode) {
                toast.error("Şirket kodu bulunamadı.");
                setRequestingId(null);
                return;
            }
            const result = await dispatch(removeCustomerAssociation(company.companyCode));
            setRequestingId(null);
            if (removeCustomerAssociation.fulfilled.match(result)) {
                toast.success("Müşteri ilişkisi sonlandırıldı.");
                fetchCompanies();
            } else {
                toast.error(result.payload as string || "Bir hata oluştu.");
            }
        } else {
            // Create or Cancel pending request
            if (company.requestStatus === 'pending') {
                if (!company.companyCode) {
                    toast.error("Şirket kodu bulunamadı.");
                    setRequestingId(null);
                    return;
                }
                const result = await dispatch(removeCustomerAssociation(company.companyCode));
                setRequestingId(null);
                if (removeCustomerAssociation.fulfilled.match(result)) {
                    toast.success("Başvuru iptal edildi.");
                    fetchCompanies();
                } else {
                    toast.error(result.payload as string || "Bir hata oluştu.");
                }
                return;
            }
            const result = await dispatch(createCustomerRequest(company._id));
            setRequestingId(null);
            if (createCustomerRequest.fulfilled.match(result)) {
                toast.success("Müşteri olma talebiniz firmaya iletildi.");
                fetchCompanies();
            } else {
                toast.error(result.payload as string || "Bir hata oluştu.");
            }
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-normal text-slate-800">Firmalar</h1>
                <p className="text-sm text-slate-500">İlgi alanınıza giren ve sektörünüzdeki firmaları keşfedin.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Firma veya isim ara..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-100 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 min-w-[150px]">
                    <Filter className="size-4 text-slate-400" />
                    <select
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 font-normal text-slate-700"
                        value={selectedSector}
                        onChange={(e) => setSelectedSector(e.target.value)}
                    >
                        {/* 'Tüm Sektörler' option removed intentionally */}
                        <option value="">Sektörlerim</option>
                        {sectorsData.map(sector => (
                            <option key={sector.id} value={sector.id}>{sector.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Company List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-[250px] rounded-3xl bg-slate-100 animate-pulse" />
                    ))}
                </div>
            ) : companies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">Aradığınız kriterlere uygun firma bulunamadı.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div key={company._id} className="group relative flex flex-col gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
                            {/* Profile Header */}
                            <div className="flex items-start justify-between">
                                <div className="size-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                                    {company.logo ? (
                                        <img src={company.logo} alt={company.company} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-normal text-slate-300">
                                            {company.company?.charAt(0) || company.name?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                                    <Star className="size-3.5 fill-orange-500 text-orange-500" />
                                    <span className="text-xs font-normal text-orange-700">{(company.rating || 0).toFixed(1)}</span>
                                    <span className="text-[10px] text-orange-400 font-medium ml-0.5">({company.ratingCount || 0})</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-1">
                                <h3 className="font-normal text-slate-800 group-hover:text-orange-600 transition-colors">
                                    {company.company || `${company.name} ${company.surname}`}
                                </h3>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {company.sectors?.map(sId => {
                                        const sector = sectorsData.find(s => s.id === sId)
                                        return sector ? (
                                            <span key={sId} className="text-[11px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-normal">
                                                {sector.name}
                                            </span>
                                        ) : null
                                    })}
                                </div>
                            </div>

                            {/* Action */}
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleMessageClick(company._id)}
                                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 font-normal text-xs transition-all duration-300"
                                >
                                    <MessageSquare className="size-4" />
                                    Mesaj
                                </button>

                                <button
                                    onClick={() => handleRequestClick(company)}
                                    disabled={company.requestStatus === 'rejected' || requestingId === company._id}
                                    className={cn(
                                        "flex items-center justify-center gap-2 py-3 rounded-2xl font-normal text-xs transition-all duration-300 px-3",
                                        (!company.requestStatus || company.requestStatus === 'rejected') && !user?.associatedCompanyCodes?.includes(company.companyCode || '')
                                            ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                                            : (company.requestStatus === 'pending')
                                                ? "bg-amber-50 text-amber-600 border border-amber-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100"
                                                : (company.requestStatus === 'accepted' || user?.associatedCompanyCodes?.includes(company.companyCode || ''))
                                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100"
                                                    : "bg-slate-50 text-slate-400 cursor-default"
                                    )}
                                >
                                    {requestingId === company._id ? (
                                        <div className="size-4 rounded-full border-2 border-slate-400 border-t-slate-800 animate-spin" />
                                    ) : company.requestStatus === 'pending' ? (
                                        <>
                                            <X className="group-hover:block hidden size-4" />
                                            <Clock className="group-hover:hidden block size-4" />
                                            <span className="group-hover:hidden block font-semibold">Bekliyor</span>
                                            <span className="group-hover:block hidden whitespace-nowrap">İptal Et</span>
                                        </>
                                    ) : (company.requestStatus === 'accepted' || user?.associatedCompanyCodes?.includes(company.companyCode || '')) ? (
                                        <>
                                            <UserMinus className="group-hover:block hidden size-4" />
                                            <UserCheck className="group-hover:hidden block size-4" />
                                            <span className="group-hover:hidden block">Müşterisiyim</span>
                                            <span className="group-hover:block hidden whitespace-nowrap">Vazgeç</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="size-4" />
                                            Müşterisi Ol
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
