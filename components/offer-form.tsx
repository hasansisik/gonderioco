"use client"

import React, { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { server } from "@/config"
import { cn } from "@/lib/utils"
import {
    ChevronDown, Save, Trash2, Calendar, FileText, User,
    Settings, Clock, Plus, Building2, Package, Mail,
    CreditCard, Coins, ArrowLeft, MoreHorizontal,
    Box, Briefcase, Info, X, Shield, Percent
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { createOffer, updateOffer, deleteOffer, OfferPayload } from "@/redux/actions/offerActions"
import { getAllCustomers } from "@/redux/actions/customerActions"
import { getAllStaff } from "@/redux/actions/staffActions"
import { getAllProducts } from "@/redux/actions/productActions"
import { getAllTemplates } from "@/redux/actions/templateActions"
import { getAllTerms } from "@/redux/actions/termActions"
import { SelectModal } from "@/components/ui/select-modal"
import RichTextEditor from "@/components/ui/rich-text-editor"
import {
    FormSection,
    PremiumInput,
    PremiumSelect,
    PremiumTextarea
} from "@/components/ui/premium-form-elements"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface OfferFormProps {
    initialData?: any;
    isEdit?: boolean;
    readOnly?: boolean;
}

export default function OfferForm({ initialData, isEdit = false, readOnly = false }: OfferFormProps) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { loading } = useAppSelector((state) => state.offer)
    const { customers } = useAppSelector((state) => state.customer)
    const { staffList } = useAppSelector((state) => state.staff)
    const { products } = useAppSelector((state) => state.product)
    const { templates } = useAppSelector((state) => state.template)
    const { terms } = useAppSelector((state) => state.term)
    const { user } = useAppSelector((state) => state.user)

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showStatusResetDialog, setShowStatusResetDialog] = useState(false)
    const [pendingFinalData, setPendingFinalData] = useState<any>(null)
    const [formData, setFormData] = useState<OfferPayload>({
        title: '',
        konu: '',
        sablon: '',
        musteri: '',
        alici: '',
        tarih: '',
        paraBirimi: 'TRY',
        dolarKur: '',
        euroKur: '',
        personel: '',
        sartlar: '',
        yoneticiler: [],
        evrakIcerigi: '',
        status: 'Müşteri Onayı Bekleniyor',
        isCalled: false,
        urunler: [{
            adKod: '',
            aciklama: '',
            miktar: '1',
            birim: 'Adet',
            birimFiyat: '',
            kdv: '20',
            paraBirimi: 'TRY',
            toplamTutar: ''
        }]
    })

    const isUserApprover = useMemo(() => {
        if (!user) return false;
        if (user.userType === 'provider') return true;
        // Find current user in staff list
        const currentStaff = staffList.find((s: any) => s.userAccount === user._id || s._id === user._id);
        return currentStaff?.department?.isApprover === true;
    }, [user, staffList])

    const approverStaff = useMemo(() => {
        return staffList.filter((s: any) => s.department?.isApprover === true)
    }, [staffList])

    useEffect(() => {
        dispatch(getAllCustomers())
        dispatch(getAllStaff())
        dispatch(getAllProducts())
        dispatch(getAllTemplates())
        dispatch(getAllTerms())
    }, [dispatch])

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                tarih: (initialData.tarih && !isNaN(new Date(initialData.tarih).getTime()))
                    ? new Date(initialData.tarih).toISOString().slice(0, 16)
                    : '',
                musteri: initialData.musteri?._id || initialData.musteri || '',
                personel: initialData.personel?._id || initialData.personel || '',
                yoneticiler: Array.isArray(initialData.yoneticiler) ? initialData.yoneticiler : [],
                urunler: initialData.urunler?.length > 0 ? initialData.urunler.map((p: any) => ({
                    ...p,
                    paraBirimi: p.paraBirimi || initialData.paraBirimi || 'TRY'
                })) : formData.urunler
            })
        } else if (user?._id) {
            let defaultManagers: string[] = [];

            // If user is provider, add them to managers
            if (user.userType === 'provider') {
                defaultManagers.push(`${user.name} ${user.surname}`);
            }
            // If user is staff, add parentProvider to managers
            else if (user.userType === 'staff' && user.parentProvider) {
                const providerName = typeof user.parentProvider === 'object'
                    ? `${user.parentProvider.name} ${user.parentProvider.surname}`
                    : ''; // If not populated, we might not have the name yet

                if (providerName) {
                    defaultManagers.push(providerName);
                }
            }

            setFormData(prev => ({
                ...prev,
                personel: user._id,
                yoneticiler: defaultManagers
            }))
        }
    }, [initialData, user])

    useEffect(() => {
        const fetchRates = async () => {
            // Sadece yeni teklif oluştururken kurları otomatik çek
            if (!isEdit && (!formData.dolarKur || !formData.euroKur)) {
                try {
                    const token = localStorage.getItem("accessToken");
                    const { data } = await axios.get(`${server}/currency/rates`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (data.success) {
                        setFormData(prev => ({
                            ...prev,
                            // TCMB'den gelen virgüllü formatı noktaya çeviriyoruz
                            dolarKur: data.usd ? data.usd.replace(',', '.') : prev.dolarKur,
                            euroKur: data.eur ? data.eur.replace(',', '.') : prev.euroKur
                        }));
                    }
                } catch (err) {
                    console.error("Kurlar çekilemedi", err);
                }
            }
        };
        fetchRates();
    }, [isEdit]);

    const handleSelectChange = (name: string, value: any) => {
        if (name === 'paraBirimi') {
            setFormData(prev => ({
                ...prev,
                paraBirimi: value,
                urunler: (prev.urunler || []).map(p => ({ ...p, paraBirimi: value }))
            }));
            return;
        }

        if (name === 'sablon') {
            const selectedTemplate = templates.find(t => t._id === value)
            if (selectedTemplate) {
                setFormData(prev => ({
                    ...prev,
                    sablon: value,
                    evrakIcerigi: selectedTemplate.content || ''
                }))
                return
            }
        }

        if (name === 'sartlar') {
            const selectedTerm = terms.find(t => t._id === value)
            if (selectedTerm) {
                setFormData(prev => {
                    const existingContent = prev.evrakIcerigi || ''
                    const spacer = existingContent ? '<p></p>' : ''
                    return {
                        ...prev,
                        sartlar: value,
                        evrakIcerigi: existingContent + spacer + (selectedTerm.content || '')
                    }
                })
                return
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const calculateItemTotal = (miktar: string | number, birimFiyat: string | number) => {
        const m = Number(miktar) || 0
        const b = Number(birimFiyat) || 0
        return (m * b).toFixed(2)
    }

    const handleProductSelect = (index: number, productId: string) => {
        const selectedProduct = products.find(p => p._id === productId)
        if (selectedProduct) {
            const newProducts = [...(formData.urunler || [])]
            newProducts[index] = {
                ...newProducts[index],
                adKod: selectedProduct.name,
                aciklama: selectedProduct.description || '',
                birim: selectedProduct.unit || 'Adet',
                birimFiyat: selectedProduct.priceVatExcl?.toString() || '',
                kdv: selectedProduct.vatRate?.toString() || '20',
                paraBirimi: formData.paraBirimi
            }
            newProducts[index].toplamTutar = calculateItemTotal(newProducts[index].miktar, newProducts[index].birimFiyat)
            setFormData({ ...formData, urunler: newProducts })
        }
    }

    const handleProductChange = (index: number, name: string, value: any) => {
        const newProducts = [...(formData.urunler || [])]
        newProducts[index] = { ...newProducts[index], [name]: value }

        if (name === 'miktar' || name === 'birimFiyat') {
            newProducts[index].toplamTutar = calculateItemTotal(
                name === 'miktar' ? value : newProducts[index].miktar,
                name === 'birimFiyat' ? value : newProducts[index].birimFiyat
            )
        }
        setFormData({ ...formData, urunler: newProducts })
    }

    const addProduct = () => {
        setFormData(prev => ({
            ...prev,
            urunler: [...(prev.urunler || []), {
                adKod: '',
                aciklama: '',
                miktar: '1',
                birim: 'Adet',
                birimFiyat: '',
                kdv: '20',
                paraBirimi: prev.paraBirimi || 'TRY',
                toplamTutar: ''
            }]
        }))
        toast.success("Yeni satır eklendi")
    }

    const removeProduct = (index: number) => {
        if (formData.urunler && formData.urunler.length > 1) {
            const newProducts = formData.urunler.filter((_, i) => i !== index)
            setFormData({ ...formData, urunler: newProducts })
        }
    }

    const totals = useMemo(() => {
        const subtotal = (formData.urunler || []).reduce((acc, p) => acc + (Number(p.toplamTutar) || 0), 0)
        const taxTotal = (formData.urunler || []).reduce((acc, p) => {
            const itemTotal = Number(p.toplamTutar) || 0
            const taxRate = Number(p.kdv) || 0
            return acc + (itemTotal * taxRate / 100)
        }, 0)
        const grandTotal = subtotal + taxTotal
        return {
            subtotal: subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 }),
            taxTotal: taxTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 }),
            grandTotal: grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })
        }
    }, [formData.urunler])

    const validateForm = (isDraft: boolean = false) => {
        if (!formData.konu?.trim()) {
            toast.error("Teklif Konusu (Başlık) boş bırakılamaz.");
            return false;
        }

        if (isDraft) return true; // Draft only needs 'konu'

        if (!formData.musteri) {
            toast.error("Lütfen bir Müşteri/Firma seçin.");
            return false;
        }
        if (!formData.sablon) {
            toast.error("Lütfen bir Teklif Şablonu seçin.");
            return false;
        }
        if (!formData.tarih) {
            toast.error("Lütfen bir Geçerlilik Tarihi seçin.");
            return false;
        }
        if (!formData.sartlar) {
            toast.error("Lütfen Şartlar ve Koşullar seçin.");
            return false;
        }
        if (!formData.yoneticiler || formData.yoneticiler.length === 0) {
            toast.error("Lütfen en az bir Onaylayacak Yönetici seçin.");
            return false;
        }

        if (!formData.dolarKur || Number(formData.dolarKur) <= 0) {
            toast.error("Lütfen geçerli bir Dolar Kuru giriniz.");
            return false;
        }

        if (!formData.euroKur || Number(formData.euroKur) <= 0) {
            toast.error("Lütfen geçerli bir Euro Kuru giriniz.");
            return false;
        }

        if (!formData.urunler || formData.urunler.length === 0) {
            toast.error("Teklifte en az bir ürün bulunmalıdır.");
            return false;
        }

        for (let i = 0; i < formData.urunler.length; i++) {
            const product = formData.urunler[i];
            if (!product.adKod?.trim()) {
                toast.error(`${i + 1}. satırdaki Ürün Adı/Kodu boş bırakılamaz.`);
                return false;
            }
            if (!product.miktar || Number(product.miktar) <= 0) {
                toast.error(`${i + 1}. satırdaki Miktar 0'dan büyük olmalıdır.`);
                return false;
            }
            if (!product.birimFiyat || Number(product.birimFiyat) <= 0) {
                toast.error(`${i + 1}. satırdaki Birim Fiyat 0'dan büyük olmalıdır.`);
                return false;
            }
        }

        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm(false)) return;

        const nextStatus = isUserApprover ? 'Müşteri Onayı Bekleniyor' : 'Yönetici Onayı Bekleniyor';
        const finalData = {
            ...formData,
            status: formData.status === 'Taslak' ? nextStatus : formData.status,
            title: formData.konu || "Yeni Teklif",
            urunler: formData.urunler?.map(p => ({
                ...p,
                miktar: Number(p.miktar) || 0,
                birimFiyat: Number(p.birimFiyat) || 0,
                toplamTutar: Number(p.toplamTutar) || 0
            }))
        }

        // Check if status needs reset (if edited after being approved/rejected)
        const needsStatusReset = isEdit && (
            initialData?.status?.includes('Onay') ||
            initialData?.status?.includes('Red') ||
            initialData?.status === 'Faturalandı' ||
            initialData?.status === 'Revizyon Talep edildi'
        )

        if (needsStatusReset && formData.status === initialData.status) {
            console.log("Needs status reset, setting pending data:", finalData);
            setPendingFinalData(finalData)
            setShowStatusResetDialog(true)
            return
        }

        console.log("Submitting final data:", finalData);
        await executeSubmit(finalData)
    }

    const handleDraftSubmit = async () => {
        if (!validateForm(true)) return;

        const finalData = {
            ...formData,
            status: 'Taslak',
            title: formData.konu || "Yeni Taslak Teklif",
            urunler: formData.urunler?.map(p => ({
                ...p,
                miktar: Number(p.miktar) || 0,
                birimFiyat: Number(p.birimFiyat) || 0,
                toplamTutar: Number(p.toplamTutar) || 0
            }))
        }

        console.log("Saving as draft, final data:", finalData);
        await executeSubmit(finalData)
    }

    const executeSubmit = async (finalData: any) => {
        const promise = async () => {
            let result: any
            if (isEdit && initialData?._id) {
                result = await dispatch(updateOffer({ id: initialData._id, offerData: finalData }))
            } else {
                result = await dispatch(createOffer(finalData))
            }
            if (!result.type.endsWith('/fulfilled')) throw new Error();
            router.push('/panel/teklifler/tekliflerim')
            return result;
        }

        toast.promise(promise, {
            loading: 'Teklif kaydediliyor...',
            success: 'Teklif başarıyla kaydedildi',
            error: 'Kaydetme sırasında bir hata oluştu',
        });
    }

    const confirmStatusReset = async () => {
        console.log("Confirming status reset, pending data:", pendingFinalData);
        if (pendingFinalData) {
            const nextStatus = isUserApprover ? 'Müşteri Onayı Bekleniyor' : 'Yönetici Onayı Bekleniyor';
            const dataWithResetStatus = {
                ...pendingFinalData,
                status: nextStatus
            }
            setShowStatusResetDialog(false)
            await executeSubmit(dataWithResetStatus)
        }
    }

    const handleDelete = async () => {
        if (initialData?._id) {
            const result = await dispatch(deleteOffer(initialData._id))
            if (deleteOffer.fulfilled.match(result)) {
                toast.success("Teklif silindi");
                router.push('/panel/teklifler/tekliflerim')
            }
        }
        setShowDeleteDialog(false)
    }

    const OPTIONS = {
        paraBirimi: [
            { id: 'TRY', label: '₺ Türk Lirası (TRY)' },
            { id: 'USD', label: '$ Amerikan Doları (USD)' },
            { id: 'EUR', label: '€ Euro (EUR)' },
            { id: 'GBP', label: '£ İngiliz Sterlini (GBP)' }
        ],
        birim: ['Adet', 'Paket', 'Kutu', 'Kg', 'Litre', 'Metre', 'Set', 'Saat', 'Gün'],
        kdv: ['0', '1', '8', '10', '18', '20'],
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Actions Area */}
            <div className="flex items-center justify-between sticky top-0 z-30 bg-white/80 backdrop-blur-md py-4 transition-all pr-4 border-b border-slate-100/50 mb-4 -mx-4 px-4">
                <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="size-10 md:size-11 rounded-xl md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-100 transition-all shadow-sm shrink-0"
                    >
                        <ArrowLeft className="size-4 md:size-5" />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-base md:text-xl font-semibold text-slate-800  truncate">
                            {isEdit ? 'Teklifi Düzenle' : 'Yeni Teklif Oluştur'}
                        </h1>
                        <p className="hidden md:block text-[11px] text-slate-500 font-medium mt-0.5">Profesyonel teklif dökümanınızı buradan oluşturun</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    {isEdit && !readOnly && (
                        <button
                            type="button"
                            onClick={() => setShowDeleteDialog(true)}
                            className="size-10 md:size-11 rounded-xl md:rounded-2xl bg-white border border-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
                        >
                            <Trash2 className="size-4 md:size-5" />
                        </button>
                    )}
                    {!readOnly && (
                        <div className="flex items-center gap-2 md:gap-3">
                            <button
                                type="button"
                                onClick={handleDraftSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 md:gap-3 bg-white text-slate-600 border border-slate-200 px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[11px] md:text-[13px] font-normal shadow-sm hover:bg-slate-50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
                            >
                                {loading ? <Clock className="size-3.5 md:size-4 animate-spin" /> : <Save className="size-3.5 md:size-4" />}
                                <span className="hidden xs:inline-block">Taslak Olarak Kaydet</span>
                                <span className="xs:hidden">Taslak</span>
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 md:gap-3 bg-orange-500 text-white px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[11px] md:text-[13px] font-normal shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
                            >
                                {loading ? <Clock className="size-3.5 md:size-4 animate-spin" /> : <Save className="size-3.5 md:size-4" />}
                                <span className="hidden xs:inline-block">
                                    {formData.status === 'Taslak'
                                        ? "Yayımla"
                                        : formData.status === 'Revizyon Talep edildi'
                                            ? "Revizyon Edildi"
                                            : (isEdit ? "Güncelle" : "Teklifi Kaydet")}
                                </span>
                                <span className="xs:hidden">
                                    {formData.status === 'Taslak'
                                        ? "Yayımla"
                                        : formData.status === 'Revizyon Talep edildi'
                                            ? "Revizyon"
                                            : (isEdit ? "Güncelle" : "Kaydet")}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <FormSection title="Genel Detaylar" icon={FileText} description="Teklifin ana başlığı ve konusu">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PremiumInput
                                label="Teklif Konusu / Başlık"
                                placeholder="Örn: X Firması Yazılım Projesi"
                                value={formData.konu}
                                onChange={(e: any) => handleSelectChange('konu', e.target.value)}
                                required={true}
                                icon={Briefcase}
                                disabled={readOnly}
                            />
                            <SelectModal
                                label="TEKLİF ŞABLONU"
                                value={formData.sablon || ''}
                                onChange={(val) => handleSelectChange('sablon', val)}
                                options={templates.map(t => ({ id: t._id, label: t.name }))}
                                placeholder="Şablon Seçin"
                                isStatus={false}
                                icon={Settings}
                                disabled={readOnly}
                                required={true}
                            />
                        </div>
                    </FormSection>

                    <FormSection title="Ürün ve Hizmetler" icon={Package} description="Teklife dahil olan kalemler">
                        <div className="flex flex-col gap-6">
                            {formData.urunler?.map((product, index) => (
                                <div key={index} className="group relative bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-8 pt-10 flex flex-col gap-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-orange-100">
                                    {formData.urunler!.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeProduct(index)}
                                            className="absolute top-6 right-6 p-2 rounded-xl bg-white text-slate-300 hover:text-rose-500 hover:bg-rose-50 border border-slate-100 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <SelectModal
                                            label="ÜRÜN / HİZMET"
                                            value={products.find(p => p.name === product.adKod)?._id || product.adKod || ''}
                                            onChange={(val) => handleProductSelect(index, val)}
                                            options={products.map(p => ({ id: p._id, label: p.name }))}
                                            placeholder="Ürün Seçin"
                                            icon={Box}
                                            disabled={readOnly}
                                            required={true}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <PremiumSelect
                                                label="BİRİM"
                                                value={product.birim}
                                                onChange={(e: any) => handleProductChange(index, 'birim', e.target.value)}
                                                options={OPTIONS.birim}
                                                icon={Info}
                                                disabled={readOnly}
                                            />
                                            <PremiumSelect
                                                label="KDV %"
                                                value={product.kdv}
                                                onChange={(e: any) => handleProductChange(index, 'kdv', e.target.value)}
                                                options={OPTIONS.kdv}
                                                icon={Percent}
                                                disabled={readOnly}
                                            />
                                        </div>
                                    </div>

                                    <PremiumTextarea
                                        label="DETAYLI AÇIKLAMA"
                                        placeholder="Ürün veya hizmetin detaylarını buraya yazabilirsiniz..."
                                        value={product.aciklama}
                                        onChange={(e: any) => handleProductChange(index, 'aciklama', e.target.value)}
                                        rows={3}
                                        disabled={readOnly}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 border-dashed">
                                        <PremiumInput
                                            label="MİKTAR"
                                            type="number"
                                            value={product.miktar}
                                            onChange={(e: any) => handleProductChange(index, 'miktar', e.target.value)}
                                            placeholder="0"
                                            icon={Clock}
                                            disabled={readOnly}
                                            required={true}
                                        />
                                        <PremiumInput
                                            label="BİRİM FİYAT"
                                            type="number"
                                            value={product.birimFiyat}
                                            onChange={(e: any) => handleProductChange(index, 'birimFiyat', e.target.value)}
                                            placeholder="0.00"
                                            icon={Coins}
                                            disabled={readOnly}
                                            required={true}
                                        />
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-normal text-slate-500 mb-2 px-1 block">Toplam</label>
                                            <div className="bg-orange-50 border border-orange-100 rounded-2xl px-6 py-2.5 flex items-center justify-between h-11">
                                                <span className="text-[14px] font-semibold text-orange-600">{product.toplamTutar || "0,00"}</span>
                                                <span className="text-[10px] font-semibold text-orange-400">{product.paraBirimi}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {!readOnly && (
                                <button
                                    type="button"
                                    onClick={addProduct}
                                    className="w-full flex items-center justify-center gap-3 py-6 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-slate-400 hover:border-orange-200 hover:bg-orange-50/30 hover:text-orange-500 transition-all font-normal text-[13px] bg-white"
                                >
                                    <Plus className="size-5" />
                                    Yeni Kalem Ekle
                                </button>
                            )}
                        </div>
                    </FormSection>
                </div>

                {/* Right Column - Secondary Settings & Summary */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="sticky top-24 flex flex-col gap-8">
                        <FormSection title="Teklif Ayarları" icon={Settings}>
                            <div className="flex flex-col gap-6">
                                <SelectModal
                                    label="MÜŞTERİ / FİRMA"
                                    value={formData.musteri || ''}
                                    onChange={(val) => handleSelectChange('musteri', val)}
                                    options={[
                                        ...customers.map(c => ({
                                            id: c._id,
                                            label: c.company ? (c.person ? `${c.company} (${c.person})` : c.company) : c.person
                                        })),
                                        // If in read-only and customer is an object (populated), add it as a virtual option if not in list
                                        ...(readOnly && (initialData?.musteri?.company || initialData?.musteri?.person) && !customers.some(c => c._id === formData.musteri)
                                            ? [{
                                                id: formData.musteri,
                                                label: initialData.musteri.company
                                                    ? (initialData.musteri.person ? `${initialData.musteri.company} (${initialData.musteri.person})` : initialData.musteri.company)
                                                    : initialData.musteri.person
                                            }]
                                            : [])
                                    ]}
                                    placeholder="Firma Seçin"
                                    icon={Building2}
                                    disabled={readOnly}
                                    required={true}
                                />

                                <PremiumInput
                                    label="GEÇERLİLİK TARİHİ"
                                    type="datetime-local"
                                    value={formData.tarih}
                                    onChange={(e: any) => handleSelectChange('tarih', e.target.value)}
                                    icon={Calendar}
                                    disabled={readOnly}
                                    required={true}
                                />

                                <SelectModal
                                    label="ONAYLAYACAK YÖNETİCİLER"
                                    value={formData.yoneticiler || []}
                                    onChange={(val) => handleSelectChange('yoneticiler', val)}
                                    options={[
                                        // Always include the provider in the selection options
                                        ...(user?.userType === 'provider'
                                            ? [{ id: `${user.name} ${user.surname}`, label: `${user.name} ${user.surname}` }]
                                            : (user?.parentProvider && typeof user.parentProvider === 'object'
                                                ? [{ id: `${user.parentProvider.name} ${user.parentProvider.surname}`, label: `${user.parentProvider.name} ${user.parentProvider.surname}` }]
                                                : [])),
                                        ...approverStaff.map((s: any) => ({ id: `${s.name} ${s.surname}`, label: `${s.name} ${s.surname}` }))
                                    ]}
                                    placeholder="Yönetici Seçin"
                                    multiple={true}
                                    icon={Shield}
                                    disabled={readOnly}
                                    required={true}
                                />

                                <SelectModal
                                    label="ŞARTLAR VE KOŞULLAR"
                                    value={formData.sartlar || ''}
                                    onChange={(val) => handleSelectChange('sartlar', val)}
                                    options={terms.map(t => ({ id: t._id, label: t.name }))}
                                    placeholder="Şart Seçin"
                                    icon={FileText}
                                    disabled={readOnly}
                                    required={true}
                                />

                                <hr className="border-slate-50" />

                                <PremiumSelect
                                    label="ANA PARA BİRİMİ"
                                    value={formData.paraBirimi}
                                    onChange={(e: any) => handleSelectChange('paraBirimi', e.target.value)}
                                    options={OPTIONS.paraBirimi}
                                    icon={Coins}
                                    disabled={readOnly}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <PremiumInput
                                        label="DOLAR KURU"
                                        type="number"
                                        value={formData.dolarKur}
                                        onChange={(e: any) => handleSelectChange('dolarKur', e.target.value)}
                                        placeholder="0.0000"
                                        disabled={readOnly}
                                        required={true}
                                    />
                                    <PremiumInput
                                        label="EURO KURU"
                                        type="number"
                                        value={formData.euroKur}
                                        onChange={(e: any) => handleSelectChange('euroKur', e.target.value)}
                                        placeholder="0.0000"
                                        disabled={readOnly}
                                        required={true}
                                    />
                                </div>
                            </div>
                        </FormSection>

                        {/* Summary Card */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="size-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                                    <Info className="size-5" />
                                </div>
                                <h3 className="text-[15px] font-normal text-white">Özet Toplamlar</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center group">
                                    <span className="text-[12px] font-normal text-slate-400 transition-colors group-hover:text-slate-300">Ara Toplam</span>
                                    <span className="text-sm font-semibold text-slate-300">{totals.subtotal} {formData.paraBirimi}</span>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-[12px] font-normal text-slate-400 transition-colors group-hover:text-slate-300">Vergi Toplamı</span>
                                    <span className="text-sm font-semibold text-slate-300">{totals.taxTotal} {formData.paraBirimi}</span>
                                </div>
                                <div className="pt-6 mt-6 border-t border-slate-800 flex justify-between items-end">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-normal text-orange-500">Genel Toplam</span>
                                        <span className="text-3xl font-semibold text-white leading-none er">
                                            {totals.grandTotal}
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500 mb-1">{formData.paraBirimi}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Full-Width Section for PDF Content */}
            <div className="w-full">
                <FormSection title="Evrak İçeriği ve PDF Notları" icon={Mail} description="Teklif dökümanında görünecek ana metin ve detaylar">
                    <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner bg-white">
                        <RichTextEditor
                            content={formData.evrakIcerigi || ''}
                            onChange={(content) => setFormData({ ...formData, evrakIcerigi: content })}
                            readOnly={readOnly}
                        />
                    </div>
                </FormSection>
            </div>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Teklifi Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu teklifi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-rose-500 hover:bg-rose-600">
                            Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showStatusResetDialog} onOpenChange={setShowStatusResetDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Durum Güncelleme</AlertDialogTitle>
                        <AlertDialogDescription>
                            Teklifte değişiklik yaptığınız için durumu "Müşteri Onayı Bekleniyor" olarak güncellenecektir. Devam etmek istiyor musunuz?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            if (pendingFinalData) executeSubmit(pendingFinalData)
                        }}>Durumu Değiştirme</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmStatusReset} className="bg-orange-500 hover:bg-orange-600">
                            Evet, Güncelle
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    )
}
