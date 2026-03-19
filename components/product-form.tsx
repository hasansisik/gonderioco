"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, Save, Trash2, Package, Layers, Info, Coins, Barcode, ArrowLeft, Clock, ShoppingCart, Percent, Box, Building2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { createProduct, updateProduct, deleteProduct, ProductPayload } from "@/redux/actions/productActions"
import { getAllWarehouses } from "@/redux/actions/warehouseActions"
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

const FormSection = ({ title, icon: Icon, description, children }: any) => (
    <div className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_20px_60px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-4 md:pb-6 mb-2">
            <div className="size-10 md:size-11 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-800 border border-slate-100 shrink-0">
                <Icon className="size-4 md:size-5" />
            </div>
            <div>
                <h2 className="text-sm md:text-[15px] font-semibold text-slate-800 ">{title}</h2>
                {description && <p className="text-[11px] text-slate-500 font-medium mt-0.5">{description}</p>}
            </div>
        </div>
        {children}
    </div>
)

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

const InputField = ({ label, name, placeholder, type = "text", value, onChange, required = false, disabled = false, step, icon: Icon }: any) => (
    <div className="flex flex-col gap-2">
        <label className="text-[11px] font-normal text-slate-500 px-1">{label}</label>
        <div className="relative group">
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                step={step}
                className={cn(
                    "w-full rounded-2xl border border-slate-100 bg-white h-11 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 transition-all shadow-sm placeholder:text-slate-300 disabled:bg-slate-50",
                    Icon ? "pl-11 pr-5" : "px-5"
                )}
            />
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                    <Icon className="size-4" />
                </div>
            )}
        </div>
    </div>
)

const SelectField = ({ label, name, value, onChange, options, placeholder, required = false, disabled = false, icon: Icon }: any) => (
    <div className="flex flex-col gap-2">
        <label className="text-[11px] font-normal text-slate-500 px-1">{label}</label>
        <div className="relative group">
            <select
                name={name}
                value={value || ''}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={cn(
                    "w-full appearance-none rounded-2xl border border-slate-100 bg-white h-11 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 cursor-pointer shadow-sm disabled:bg-slate-50",
                    Icon ? "pl-11 pr-12" : "px-5 pr-12"
                )}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt: any) => {
                    const optLabel = typeof opt === 'string' ? opt : opt.label
                    const optValue = typeof opt === 'string' ? opt : opt.id || opt.value
                    return <option key={optValue} value={optValue}>{optLabel}</option>
                })}
            </select>
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                    <Icon className="size-4" />
                </div>
            )}
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none transition-transform group-focus-within:rotate-180" />
        </div>
    </div>
)

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { loading } = useAppSelector((state) => state.product)
    const { warehouses } = useAppSelector((state) => state.warehouse)

    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [formData, setFormData] = useState<ProductPayload>({
        name: '',
        description: '',
        warehouse: '',
        stockCode: '',
        priceVatExcl: '',
        purchasePrice: '',
        vatRate: '20',
        profit: '',
        unit: 'Adet',
        currency: 'TRY',
        brand: '',
        supplier: '',
        stockAmount: '',
        criticalStockAmount: '',
        barcode: '',
    })

    useEffect(() => {
        dispatch(getAllWarehouses())
    }, [dispatch])

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                priceVatExcl: initialData.priceVatExcl?.toString() || '',
                purchasePrice: initialData.purchasePrice?.toString() || '',
                vatRate: initialData.vatRate?.toString() || '',
                profit: initialData.profit?.toString() || '',
                stockAmount: initialData.stockAmount?.toString() || '',
                criticalStockAmount: initialData.criticalStockAmount?.toString() || '',
            })
        }
    }, [initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        let newFormData = { ...formData, [name]: value }

        // Special handling for warehouse to store name instead of ID
        if (name === 'warehouse') {
            const selectedWarehouse = warehouses.find(w => w._id === value || w.name === value)
            if (selectedWarehouse) {
                newFormData.warehouse = selectedWarehouse.name
            }
        }

        // Automatically calculate profit: Sales Price Excl. VAT - Purchase Price Excl. VAT
        if (name === 'priceVatExcl' || name === 'purchasePrice') {
            const price = name === 'priceVatExcl' ? Number(value) : Number(formData.priceVatExcl)
            const purchase = name === 'purchasePrice' ? Number(value) : Number(formData.purchasePrice)

            if (!isNaN(price) && !isNaN(purchase)) {
                newFormData.profit = (price - purchase).toFixed(2)
            }
        }

        setFormData(newFormData)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload = {
            ...formData,
            priceVatExcl: Number(formData.priceVatExcl) || 0,
            purchasePrice: Number(formData.purchasePrice) || 0,
            vatRate: Number(formData.vatRate) || 0,
            profit: Number(formData.profit) || 0,
            stockAmount: Number(formData.stockAmount) || 0,
            criticalStockAmount: Number(formData.criticalStockAmount) || 0,
        }

        const promise = async () => {
            let result: any
            if (isEdit && initialData?._id) {
                result = await dispatch(updateProduct({ id: initialData._id, productData: payload }))
            } else {
                result = await dispatch(createProduct(payload))
            }
            if (!result.type.endsWith('/fulfilled')) throw new Error();
            router.push('/panel/urunler')
            return result;
        }

        toast.promise(promise(), {
            loading: 'Ürün kaydediliyor...',
            success: 'Ürün başarıyla kaydedildi',
            error: 'Kaydetme sırasında bir hata oluştu',
        });
    }

    const handleDelete = async () => {
        if (initialData?._id) {
            const result = await dispatch(deleteProduct(initialData._id))
            if (deleteProduct.fulfilled.match(result)) {
                router.push('/panel/urunler')
            }
        }
        setShowDeleteDialog(false)
    }

    const OPTIONS = {
        unit: ['Adet', 'Paket', 'Kutu', 'Kg', 'Litre', 'Metre', 'Set', 'Koli', 'Saat', 'Gün'],
        vatRate: ['0', '1', '8', '10', '18', '20'],
        currency: [
            { id: 'TL', label: '₺ Türk Lirası (TL)' },
            { id: 'USD', label: '$ Amerikan Doları (USD)' },
            { id: 'EUR', label: '€ Euro (EUR)' },
            { id: 'GBP', label: '£ İngiliz Sterlini (GBP)' }
        ]
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Actions Area */}
            <div className="flex items-center justify-between sticky top-0 z-30 bg-white/80 backdrop-blur-md py-4 transition-all pr-4 border-b border-slate-100/50 mb-4 -mx-4 px-4 rounded-b-3xl">
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
                            {isEdit ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                        </h1>
                        <p className="hidden md:block text-[11px] text-slate-500 font-medium mt-0.5">Envanterinize yeni kalemler tanımlayın</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    {isEdit && (
                        <button
                            type="button"
                            onClick={() => setShowDeleteDialog(true)}
                            className="flex items-center gap-2 rounded-xl bg-white border border-rose-100 px-5 py-2.5 text-[12px] font-normal text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
                        >
                            <Trash2 className="size-3.5" />
                            <span>Ürünü Sil</span>
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 md:gap-3 bg-orange-500 text-white px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[11px] md:text-[13px] font-normal shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
                    >
                        {loading ? <Clock className="size-3.5 md:size-4 animate-spin" /> : <Save className="size-3.5 md:size-4" />}
                        <span className="hidden xs:inline-block">{isEdit ? "Güncelle" : "Ürünü Kaydet"}</span>
                        <span className="xs:hidden">{isEdit ? "Güncelle" : "Kaydet"}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <FormSection title="Ürün Tanımı" icon={Package} description="Temel stok ve kimlik bilgileri">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Ürün Adı" name="name" placeholder="Örn: Paslanmaz Çelik Vida" value={formData.name} onChange={handleChange} required icon={Package} />
                            <InputField label="Stok Kodu" name="stockCode" placeholder="SKU-123456" value={formData.stockCode} onChange={handleChange} icon={Barcode} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-normal text-slate-500 px-1">Detaylı Açıklama</label>
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                placeholder="Ürün özelliklerini buraya yazabilirsiniz..."
                                className="w-full h-32 rounded-[2rem] border border-slate-100 bg-white px-6 py-4 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 shadow-sm placeholder:text-slate-300 resize-none transition-all"
                            />
                        </div>
                    </FormSection>

                    <FormSection title="Stok ve Depolama" icon={Layers} description="Envanter yönetimi ve konumlandırma">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SelectField
                                label="Depo Konumu"
                                name="warehouse"
                                placeholder="Depo Seçin"
                                value={warehouses.find(w => w.name === formData.warehouse)?._id || formData.warehouse}
                                onChange={handleChange}
                                options={warehouses.map(w => ({ id: w._id, label: w.name }))}
                                icon={Building2}
                            />
                            <SelectField label="Ölçü Birimi" name="unit" placeholder="Birim Seçin" value={formData.unit} onChange={handleChange} options={OPTIONS.unit} icon={Box} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-orange-50/30 p-6 rounded-3xl border border-orange-100/50">
                                <InputField label="Mevcut Stok" name="stockAmount" type="number" placeholder="0" value={formData.stockAmount} onChange={handleChange} icon={Layers} />
                            </div>
                            <div className="bg-rose-50/30 p-6 rounded-3xl border border-rose-100/50">
                                <InputField label="Kritik Stok Seviyesi" name="criticalStockAmount" type="number" placeholder="0" value={formData.criticalStockAmount} onChange={handleChange} icon={Info} />
                            </div>
                        </div>
                    </FormSection>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <FormSection title="Finansal Bilgiler" icon={Coins} description="Fiyat ve vergi detayları">
                        <div className="flex flex-col gap-6">
                            <SelectField label="Para Birimi" name="currency" placeholder="Para Birimi" value={formData.currency} onChange={handleChange} options={OPTIONS.currency} icon={Coins} />
                            <InputField label="Satış Fiyatı (KDV Hariç)" name="priceVatExcl" type="number" step="0.01" placeholder="0.00" value={formData.priceVatExcl} onChange={handleChange} required icon={ShoppingCart} />
                            <InputField label="Alış Fiyatı (KDV Hariç)" name="purchasePrice" type="number" step="0.01" placeholder="0.00" value={formData.purchasePrice} onChange={handleChange} icon={ShoppingCart} />
                            <div className="grid grid-cols-2 gap-4">
                                <SelectField label="KDV %" name="vatRate" placeholder="KDV" value={formData.vatRate} onChange={handleChange} options={OPTIONS.vatRate} icon={Percent} />
                                <div className="flex flex-col gap-2">
                                    <label className="text-[11px] font-normal text-slate-500 px-1">Kar/Zarar</label>
                                    <div className={cn(
                                        "h-11 rounded-2xl border flex items-center px-6 text-sm font-semibold",
                                        Number(formData.profit) >= 0 ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
                                    )}>
                                        {formData.profit || "0.00"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Marka & Tedarik" icon={Building2}>
                        <div className="flex flex-col gap-6">
                            <InputField label="Marka" name="brand" placeholder="Örn: SteelMaster" value={formData.brand} onChange={handleChange} icon={Package} />
                            <InputField label="Tedarikçi" name="supplier" placeholder="Örn: Global Lojistik" value={formData.supplier} onChange={handleChange} icon={Building2} />
                            <InputField label="Barkod / EAN" name="barcode" placeholder="869..." value={formData.barcode} onChange={handleChange} icon={Barcode} />
                        </div>
                    </FormSection>
                </div>
            </div>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ürünü Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
        </form>
    )
}
