import { cn } from "@/lib/utils"
import { ChevronDown, Save, Trash2, UserPlus, Building2, Hash, MapPin, Phone, Globe, Mail, Landmark, CreditCard, Truck, Users, ArrowLeft, Clock, Eye, Star, User, FileText } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { createCustomer, updateCustomer, deleteCustomer, createCustomerAccount, CustomerPayload } from "@/redux/actions/customerActions"
import { getAllOffers } from "@/redux/actions/offerActions"
import { CITIES, getTaxOfficesForCity } from "@/constants/taxOffices"
import { toast } from "sonner"
import { UserAvatar } from "@/components/ui/user-avatar"
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

const FormSection = ({ title, icon: Icon, description, children, badge }: any) => (
    <div className="flex flex-col gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_20px_60px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between border-b border-slate-50 pb-6 mb-2">
            <div className="flex items-center gap-4">
                <div className="size-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-800 border border-slate-100">
                    <Icon className="size-5" />
                </div>
                <div>
                    <h2 className="text-[15px] font-semibold text-slate-800 ">{title}</h2>
                    {description && <p className="text-[11px] text-slate-500 font-medium mt-0.5">{description}</p>}
                </div>
            </div>
            {badge && (
                <div className="px-3 py-1 rounded-lg bg-orange-50 text-orange-500 text-[11px] font-normal border border-orange-100">
                    {badge}
                </div>
            )}
        </div>
        {children}
    </div>
)

interface CustomerFormProps {
    initialData?: any;
    isEdit?: boolean;
}

const InputField = ({ label, name, placeholder, type = "text", value, onChange, required = false, disabled = false, icon: Icon, labelClassName, inputClassName }: any) => (
    <div className="flex flex-col gap-2">
        <label className={cn("text-[11px] font-normal text-slate-500 px-1", labelClassName)}>{label}</label>
        <div className="relative group">
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={cn(
                    "w-full rounded-2xl border border-slate-100 bg-white h-11 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 transition-all shadow-sm placeholder:text-slate-300 disabled:bg-slate-50",
                    Icon ? "pl-11 pr-5" : "px-5",
                    inputClassName
                )}
            />
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors pointer-events-none">
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
                {options.map((opt: string | { label: string, value: string }) => {
                    const optLabel = typeof opt === 'string' ? opt : opt.label
                    const optValue = typeof opt === 'string' ? opt : opt.value
                    return <option key={optValue} value={optValue}>{optLabel}</option>
                })}
            </select>
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                    <Icon className="size-4" />
                </div>
            )}
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none transition-transform group-focus-within:rotate-180" />
        </div>
    </div>
)

export default function CustomerForm({ initialData, isEdit = false }: CustomerFormProps) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { loading } = useAppSelector((state) => state.customer)

    const [sameAddress, setSameAddress] = useState(false)
    const [createAccount, setCreateAccount] = useState(true)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [activeTab, setActiveTab] = useState('bilgi') // bilgi, adres, teklifler
    const { offers } = useAppSelector((state) => state.offer)

    useEffect(() => {
        if (activeTab === 'teklifler' && (!offers || offers.length === 0)) {
            dispatch(getAllOffers())
        }
    }, [activeTab, dispatch, offers])

    const customerOffers = useMemo(() => {
        if (!initialData || !offers) return []
        return offers.filter((o: any) => {
            const mId = typeof o.musteri === 'object' ? o.musteri?._id : o.musteri
            return mId === initialData._id || mId === initialData.userAccount
        })
    }, [offers, initialData])

    const [formData, setFormData] = useState<CustomerPayload>({
        company: '',
        person: '',
        address: '',
        taxNumber: '',
        city: '',
        taxOffice: '',
        district: '',
        phone: '',
        website: '',
        zip: '',
        email: '',
        country: 'Türkiye',
        billingAddress: '',
        billingCity: '',
        billingDistrict: '',
        billingZip: '',
        billingCountry: 'Türkiye',
        shippingAddress: '',
        shippingCity: '',
        shippingDistrict: '',
        shippingZip: '',
        shippingCountry: 'Türkiye',
        status: 'Aktif',
    })

    // Account data state
    const [accountData, setAccountData] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                country: initialData.country || 'Türkiye',
                billingCountry: initialData.billingCountry || 'Türkiye',
                shippingCountry: initialData.shippingCountry || 'Türkiye',
            })
        }
    }, [initialData])

    const availableTaxOffices = useMemo(() => {
        if (!formData.city) return []
        return getTaxOfficesForCity(formData.city)
    }, [formData.city])

    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        const truncated = numbers.substring(0, 11);

        if (truncated.length === 0) return '';
        if (truncated.length <= 1) return truncated;
        if (truncated.length <= 4) return `${truncated[0]} (${truncated.slice(1)}`;
        if (truncated.length <= 7) return `${truncated[0]} (${truncated.slice(1, 4)}) ${truncated.slice(4)}`;
        if (truncated.length <= 9) return `${truncated[0]} (${truncated.slice(1, 4)}) ${truncated.slice(4, 7)} ${truncated.slice(7)}`;
        return `${truncated[0]} (${truncated.slice(1, 4)}) ${truncated.slice(4, 7)} ${truncated.slice(7, 9)} ${truncated.slice(9, 11)}`;
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, city: e.target.value, taxOffice: '' })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name === 'phone') {
            setFormData({ ...formData, [name]: formatPhoneNumber(value) })
            return
        }

        setFormData({ ...formData, [name]: value })
    }

    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setAccountData({ ...accountData, [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const finalData = { ...formData }
        if (sameAddress) {
            finalData.shippingAddress = finalData.billingAddress
            finalData.shippingCity = finalData.billingCity
            finalData.shippingDistrict = finalData.billingDistrict
            finalData.shippingZip = finalData.billingZip
            finalData.shippingCountry = finalData.billingCountry
        }

        const promise = async () => {
            let result: any
            if (isEdit && initialData?._id) {
                result = await dispatch(updateCustomer({ id: initialData._id, customerData: finalData }))
            } else {
                result = await dispatch(createCustomer(finalData))
                if (createCustomer.fulfilled.match(result) && createAccount) {
                    const customerId = (result.payload as any)._id
                    await dispatch(createCustomerAccount({
                        id: customerId,
                        email: accountData.email,
                        password: accountData.password
                    }))
                }
            }
            if (!result.type.endsWith('/fulfilled')) throw new Error();
            router.push('/panel/musteriler')
            return result;
        }

        toast.promise(promise(), {
            loading: 'Müşteri kaydediliyor...',
            success: 'Müşteri başarıyla kaydedildi',
            error: 'Kaydetme sırasında bir hata oluştu',
        });
    }

    const handleDelete = async () => {
        if (initialData?._id) {
            const result = await dispatch(deleteCustomer(initialData._id))
            if (deleteCustomer.fulfilled.match(result)) {
                router.push('/panel/musteriler')
            }
        }
        setShowDeleteDialog(false)
    }

    const COUNTRIES = [
        "Türkiye", "Amerika Birleşik Devletleri", "Almanya", "Fransa", "İngiltere", "İspanya", "İtalya", "Hollanda", "Belçika", "İsviçre", "Avusturya", "Rusya", "Çin", "Japonya", "Güney Kore", "Hindistan", "Brezilya", "Kanada", "Avustralya", "Azerbaycan", "Kazakistan", "Özbekistan", "Türkmenistan", "Kırgızistan", "Kuzey Kıbrıs Türk Cumhuriyeti", "Birleşik Arap Emirlikleri", "Suudi Arabistan", "Katar", "Kuveyt", "Irak", "İran", "Arnavutluk", "Andorra", "Angola", "Antigua ve Barbuda", "Arjantin", "Ermenistan", "Bahamalar", "Bahreyn", "Bangladeş", "Barbados", "Beyaz Rusya", "Belize", "Benin", "Butan", "Bolivya", "Bosna Hersek", "Botsvana", "Brunei", "Bulgaristan", "Burkina Faso", "Burundi", "Yeşil Burun Adaları", "Kamboçya", "Kamerun", "Orta Afrika Cumhuriyeti", "Çad", "Şili", "Kolombiya", "Komorlar", "Kongo", "Kosta Rika", "Hırvatistan", "Küba", "Kıbrıs", "Çek Cumhuriyeti", "Danimarka", "Cibuti", "Dominika", "Dominik Cumhuriyeti", "Doğu Timor", "Ekvador", "Mısır", "El Salvador", "Ekvator Ginesi", "Eritre", "Estonya", "Etiyopya", "Fiji", "Finlandiye", "Gabon", "Gambiya", "Gürcistan", "Gana", "Yunanistan", "Grenada", "Guatemala", "Gine", "Gine-Bissau", "Guyana", "Haiti", "Honduras", "Macaristan", "İzlanda", "Endonezya", "İrlanda", "İsrail", "Jamaika", "Ürdün", "Kenya", "Kiribati", "Laos", "Letonya", "Lübnan", "Lesoto", "Liberya", "Libya", "Liechtenstein", "Litvanya", "Lüksemburg", "Makedonya", "Madagaskar", "Malavi", "Malezya", "Maldivler", "Mali", "Malta", "Marshall Adaları", "Moritanya", "Mauritius", "Meksika", "Mikronezya", "Moldova", "Monako", "Moğolistan", "Karadağ", "Fas", "Mozambik", "Myanmar", "Namibya", "Nauru", "Nepal", "Yeni Zelanda", "Nikaragua", "Nijer", "Nijerya", "Kuzey Kore", "Norveç", "Umman", "Pakistan", "Palau", "Panama", "Papua Yeni Gine", "Paraguay", "Peru", "Filipinler", "Polonya", "Portekiz", "Romanya", "Ruanda", "Saint Kitts ve Nevis", "Saint Lucia", "Saint Vincent ve Grenadinler", "Samoa", "San Marino", "Sao Tome ve Principe", "Senegal", "Sırbistan", "Seyşeller", "Sierra Leone", "Singapur", "Slovakya", "Slovenya", "Solomon Adaları", "Somali", "Güney Afrika", "Güney Sudan", "Sri Lanka", "Sudan", "Surinam", "Svaziland", "İsveç", "Suriye", "Tayvan", "Tacikistan", "Tanzanya", "Tayland", "Togo", "Tonga", "Trinidad ve Tobago", "Tunus", "Tuvalu", "Uganda", "Ukrayna", "Uruguay", "Vanuatu", "Vatikan", "Venezuela", "Vietnam", "Yemen", "Zambiya", "Zimbabve"
    ]

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Actions Area */}
            <div className="flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur-md py-4 transition-all pr-4 border-b border-slate-100/50 mb-2 -mx-4 px-4 rounded-b-3xl">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="size-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-100 transition-all shadow-sm"
                    >
                        <ArrowLeft className="size-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-800 ">
                            {isEdit ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
                        </h1>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Müşteri portföyünüzü genişletin</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isEdit && (
                        <button
                            type="button"
                            onClick={() => setShowDeleteDialog(true)}
                            className="flex items-center gap-2 rounded-xl bg-white border border-rose-100 px-5 py-2.5 text-[12px] font-normal text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
                        >
                            <Trash2 className="size-3.5" />
                            <span>Müşteriyi Sil</span>
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-3 bg-orange-500 text-white px-8 py-3.5 rounded-2xl text-[13px] font-normal shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
                    >
                        {loading ? <Clock className="size-4 animate-spin" /> : <Save className="size-4" />}
                        {isEdit ? "Güncelle" : "Müşteriyi Kaydet"}
                    </button>
                </div>
            </div>

            {/* Sticky Tabs */}
            <div className="sticky top-20 z-30 bg-white/50 backdrop-blur-sm -mx-4 px-4 py-2 mb-4 border-b border-slate-50">
                <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'bilgi', label: 'Genel Bilgiler', icon: Users },
                        { id: 'adres', label: 'Adres & Lojistik', icon: Truck },
                        { id: 'teklifler', label: 'İşlem Geçmişi', icon: Save, disabled: !isEdit }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            disabled={tab.disabled}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 pb-4 text-[13px] font-normal transition-all relative whitespace-nowrap",
                                tab.disabled ? "opacity-30 grayscale cursor-not-allowed" :
                                    activeTab === tab.id
                                        ? "text-orange-500"
                                        : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <tab.icon className="size-3.5" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-full animate-in fade-in slide-in-from-bottom-1" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {/* Müşteri Bilgileri Section */}
                {activeTab === 'bilgi' && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 flex flex-col gap-8">
                                <FormSection title="Firma Kimliği" icon={Building2} description="Resmi ve ticari tanımlamalar">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <InputField label="Firma Unvanı" name="company" placeholder="Tam resmi unvanı giriniz..." value={formData.company} onChange={handleChange} required icon={Building2} />
                                        </div>
                                        <InputField label="Vergi Numarası / T.C." name="taxNumber" placeholder="1234567890" value={formData.taxNumber} onChange={handleChange} icon={Hash} />
                                        <InputField label="Vergi Dairesi" name="taxOffice" placeholder="Daire Adı" value={formData.taxOffice} onChange={handleChange} icon={Landmark} />
                                    </div>
                                </FormSection>

                                <FormSection title="Genel Adres" icon={MapPin} description="Ana merkez lokasyon bilgileri">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-normal text-slate-500 px-1">Açık Adres</label>
                                            <textarea
                                                name="address"
                                                value={formData.address || ''}
                                                onChange={handleChange}
                                                placeholder="Sokak, no, mahalle..."
                                                className="w-full h-24 rounded-[2rem] border border-slate-100 bg-white px-6 py-4 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 shadow-sm placeholder:text-slate-300 resize-none transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <InputField label="Şehir" name="city" placeholder="Seçiniz" value={formData.city} onChange={handleChange} icon={MapPin} />
                                            <InputField label="İlçe" name="district" placeholder="Seçiniz" value={formData.district} onChange={handleChange} icon={MapPin} />
                                            <InputField label="Posta Kodu" name="zip" placeholder="34000" value={formData.zip} onChange={handleChange} icon={Hash} />
                                        </div>
                                        <SelectField label="Ülke" name="country" placeholder="Ülke Seçin" value={formData.country} onChange={handleChange} options={COUNTRIES} icon={Globe} />
                                    </div>
                                </FormSection>
                            </div>

                            <div className="lg:col-span-4 flex flex-col gap-8">
                                <FormSection title="İletişim Kanalları" icon={Phone}>
                                    <div className="flex flex-col gap-6">
                                        <InputField label="Telefon" name="phone" placeholder="+90 (---) --- -- --" value={formData.phone} onChange={handleChange} icon={Phone} />
                                        <InputField label="Destek E-Posta" name="email" type="email" placeholder="iletisim@firma.com" value={formData.email} onChange={handleChange} icon={Mail} />
                                        <InputField label="Web Adresi" name="website" placeholder="www.firma.com" value={formData.website} onChange={handleChange} icon={Globe} />
                                        <SelectField label="Müşteri Durumu" name="status" placeholder="Durum Seçin" value={formData.status} onChange={handleChange} options={['Aktif', 'Pasif']} icon={Users} />
                                    </div>
                                </FormSection>

                                {!isEdit && (
                                    <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                                <UserPlus className="size-6" />
                                            </div>
                                            <div className="px-3 py-1 rounded-lg bg-white/10 text-white text-[10px] font-medium border border-white/10">
                                                Zorunlu Alan
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 ">Müşteri Paneli</h3>
                                        <p className="text-blue-100 text-[11px] font-medium leading-relaxed mb-6">Müşteriniz için otomatik bir giriş hesabı oluşturun.</p>
                                        {createAccount && (
                                            <div className="flex flex-col gap-4 animate-in zoom-in-95 duration-200">
                                                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                                                    <InputField
                                                        label="Panel E-Posta"
                                                        name="email"
                                                        type="email"
                                                        placeholder="login@email.com"
                                                        value={accountData.email}
                                                        onChange={handleAccountChange}
                                                        required
                                                        labelClassName="text-blue-100"
                                                        inputClassName="border-white/20 bg-white/10 text-white placeholder:text-blue-300 focus:ring-white/10 focus:border-white/30"
                                                    />
                                                </div>
                                                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                                                    <InputField
                                                        label="Geçici Şifre"
                                                        name="password"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={accountData.password}
                                                        onChange={handleAccountChange}
                                                        required
                                                        labelClassName="text-blue-100"
                                                        inputClassName="border-white/20 bg-white/10 text-white placeholder:text-blue-300 focus:ring-white/10 focus:border-white/30"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Adres Bilgileri Section */}
                {activeTab === 'adres' && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <FormSection title="Faturalandırma Lokasyonu" icon={Landmark} description="Mali süreçler için yasal adres">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-normal text-slate-500 px-1">Fatura Adresi</label>
                                        <textarea
                                            name="billingAddress"
                                            value={formData.billingAddress || ''}
                                            onChange={handleChange}
                                            placeholder="Aynı ise boş bırakabilirsiniz..."
                                            className="w-full h-32 rounded-[2rem] border border-slate-100 bg-white px-6 py-4 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 shadow-sm placeholder:text-slate-300 resize-none transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <InputField label="Şehir" name="billingCity" placeholder="Seçiniz" value={formData.billingCity} onChange={handleChange} icon={MapPin} />
                                        <InputField label="İlçe" name="billingDistrict" placeholder="Seçiniz" value={formData.billingDistrict} onChange={handleChange} icon={MapPin} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <InputField label="Posta Kodu" name="billingZip" placeholder="34000" value={formData.billingZip} onChange={handleChange} icon={Hash} />
                                        <SelectField label="Ülke" name="billingCountry" placeholder="Ülke Seçin" value={formData.billingCountry} onChange={handleChange} options={COUNTRIES} icon={Globe} />
                                    </div>
                                </div>
                            </FormSection>

                            <div className="flex flex-col gap-8">
                                <FormSection title="Sevkiyat Lokasyonu" icon={Truck} description="Lojistik ve teslimat noktası"
                                    badge={
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={sameAddress} onChange={(e) => setSameAddress(e.target.checked)} />
                                            <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:bg-orange-500 transition-all relative after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:after:translate-x-4"></div>
                                            <span className="text-[11px] font-normal">Fatura İle Aynı</span>
                                        </label>
                                    }
                                >
                                    <div className={cn("flex flex-col gap-6 transition-all duration-300", sameAddress && "opacity-30 grayscale pointer-events-none")}>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-normal text-slate-500 px-1">Teslimat Adresi</label>
                                            <textarea
                                                name="shippingAddress"
                                                value={sameAddress ? formData.billingAddress : formData.shippingAddress}
                                                onChange={handleChange}
                                                placeholder="..."
                                                className="w-full h-32 rounded-[2rem] border border-slate-100 bg-white px-6 py-4 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 shadow-sm placeholder:text-slate-300 resize-none transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <InputField label="Şehir" name="shippingCity" placeholder="Seçiniz" value={sameAddress ? formData.billingCity : formData.shippingCity} onChange={handleChange} icon={MapPin} />
                                            <InputField label="İlçe" name="shippingDistrict" placeholder="Seçiniz" value={sameAddress ? formData.billingDistrict : formData.shippingDistrict} onChange={handleChange} icon={MapPin} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <InputField label="Posta Kodu" name="shippingZip" placeholder="34000" value={sameAddress ? formData.billingZip : formData.shippingZip} onChange={handleChange} icon={Hash} />
                                            <SelectField label="Ülke" name="shippingCountry" placeholder="Ülke Seçin" value={sameAddress ? formData.billingCountry : formData.shippingCountry} onChange={handleChange} options={COUNTRIES} icon={Globe} />
                                        </div>
                                    </div>
                                </FormSection>
                            </div>
                        </div>
                    </div>
                )}

                {/* Teklifler Tab Content */}
                {activeTab === 'teklifler' && (
                    <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                        {customerOffers.length > 0 ? (
                            <div className="overflow-x-auto min-h-[400px]">
                                <table className="w-full text-left border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="text-[11px] font-normal text-slate-300">
                                            <th className="px-6 pb-2 whitespace-nowrap">Teklif No</th>
                                            <th className="px-4 pb-2 whitespace-nowrap">Hazırlayan</th>
                                            <th className="px-4 pb-2 whitespace-nowrap">Konu</th>
                                            <th className="px-4 pb-2 whitespace-nowrap">Toplam</th>
                                            <th className="px-4 pb-2 whitespace-nowrap">Oluşturma Tarihi</th>
                                            <th className="px-4 pb-2 whitespace-nowrap">Durum</th>
                                            <th className="px-4 pb-2 text-right pr-8 whitespace-nowrap">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[12px]">
                                        {customerOffers.map((o: any) => {
                                            const total = (o.urunler || []).reduce((sum: number, item: any) => sum + (Number(item.toplamTutar) || 0), 0);
                                            const createdDate = o.createdAt ? new Date(o.createdAt).toLocaleDateString('tr-TR') : '-';

                                            return (
                                                <tr key={o._id} className="group bg-white hover:bg-slate-50 transition-all duration-200">
                                                    <td className="px-6 py-4 font-normal text-slate-800 rounded-l-2xl border-y border-l border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:border-orange-100 whitespace-nowrap">
                                                        <span className="text-orange-600 font-semibold">{o.offerNumber || '-'}</span>
                                                    </td>
                                                    <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <UserAvatar
                                                                name={o.personel?.name}
                                                                surname={o.personel?.surname}
                                                                picture={o.personel?.picture || o.personel?.profile?.picture}
                                                                size="md"
                                                            />
                                                            <span className="text-[12px] font-medium text-slate-700">{o.personel?.name} {o.personel?.surname}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-slate-600 font-normal border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">{o.konu || o.title || "-"}</td>
                                                    <td className="px-4 py-4 text-slate-600 font-normal border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">
                                                        {total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {o.paraBirimi || 'TL'}
                                                    </td>
                                                    <td className="px-4 py-4 text-slate-600 font-normal border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">{createdDate}</td>
                                                    <td className="px-4 py-4 border-y border-slate-100 group-hover:border-orange-100 whitespace-nowrap">
                                                        <div className={cn(
                                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-normal border shadow-sm",
                                                            (o.status?.toLowerCase().includes('onay') && !o.status?.toLowerCase().includes('bekliy')) || ['Faturalandı', 'Sevkiyat Halinde', 'Tamamlandı'].includes(o.status) ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                o.status?.toLowerCase().includes('red') || o.status?.toLowerCase().includes('iptal') ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                                    o.status === 'Taslak' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                                        o.status?.toLowerCase().includes('bekliy') ? "bg-slate-50 text-slate-500 border-slate-200" :
                                                                            "bg-slate-100 text-slate-500 border-slate-200"
                                                        )}>
                                                            {o.status?.toLowerCase() === 'müşteri onay bekliyor' ? 'Müşteri Onayı Bekleniyor' : (o.status || "Taslak")}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-right rounded-r-2xl border-y border-r border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] pr-8 group-hover:border-orange-100">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Link href={`/panel/teklifler/tekliflerim/${o._id}`}>
                                                                <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Görüntüle">
                                                                    <Eye className="size-3.5" />
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                <div className="size-20 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6">
                                    <Landmark className="size-10 text-slate-200" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800  mb-2">Henüz İşlem Bulunmuyor</h3>
                                <p className="text-slate-400 text-xs font-medium max-w-[280px] text-center">Bu müşteriye ait aktif veya geçmiş bir teklif kaydı sistemde henüz tanımlanmamış.</p>
                                <button
                                    type="button"
                                    onClick={() => router.push('/panel/teklifler/tekliflerim/yeni')}
                                    className="mt-8 flex items-center gap-2 bg-white border border-slate-100 px-6 py-3 rounded-2xl text-[12px] font-normal text-slate-600 hover:text-orange-500 hover:border-orange-100 transition-all shadow-sm"
                                >
                                    <Users className="size-4" />
                                    İlk Teklifi Oluştur
                                    <ArrowLeft className="size-4 rotate-180" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Müşteriyi Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
