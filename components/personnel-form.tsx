import { cn } from "@/lib/utils"
import { ChevronDown, Save, Trash2, Eye, EyeOff, User, Phone, Mail, Building2, ShieldCheck, Lock, ArrowLeft, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { createStaff, updateStaff, deleteStaff, StaffPayload } from "@/redux/actions/staffActions"
import { getAllDepartments } from "@/redux/actions/departmentActions"
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
import { SelectModal } from "@/components/ui/select-modal"

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

interface PersonnelFormProps {
    initialData?: any;
    isEdit?: boolean;
}

const InputField = ({ label, name, placeholder, type = "text", value, onChange, required = false, disabled = false, icon: Icon }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="flex flex-col gap-2">
            <label className="text-[11px] font-normal text-slate-500 px-1">{label}</label>
            <div className="relative group">
                <input
                    type={isPassword && showPassword ? "text" : type}
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={cn(
                        "w-full rounded-2xl border border-slate-100 bg-white h-11 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 transition-all shadow-sm placeholder:text-slate-300 disabled:bg-slate-50",
                        Icon ? "pl-11 pr-12" : "px-5 pr-12"
                    )}
                />
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                        <Icon className="size-4" />
                    </div>
                )}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-orange-500 transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                )}
            </div>
        </div>
    );
};

const SelectField = ({ label, name, value, onChange, options, placeholder, required = false, disabled = false, icon: Icon, isStatus = false }: any) => (
    <div className="flex flex-col gap-2">
        <label className="text-[11px] font-normal text-slate-500 px-1">{label}</label>
        <SelectModal
            label=""
            value={value}
            onChange={(val) => onChange({ target: { name, value: val } })}
            options={options.map((opt: any) => ({
                id: opt.value || opt._id || opt,
                label: opt.label || opt.name || opt
            }))}
            placeholder={placeholder}
            disabled={disabled}
            icon={Icon}
            isStatus={isStatus}
        />
    </div>
)

export default function PersonnelForm({ initialData, isEdit = false }: PersonnelFormProps) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { loading } = useAppSelector((state) => state.staff)
    const { departments } = useAppSelector((state) => state.department)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [formData, setFormData] = useState<StaffPayload>({
        name: '',
        surname: '',
        email: '',
        phoneNumber: '', // Changed from username
        department: '', // Changed from role
        password: '',
        status: 'Aktif',
    })

    useEffect(() => {
        dispatch(getAllDepartments())
    }, [dispatch])

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                // Map old fields if necessary or assume new structure
                phoneNumber: formatPhoneNumber(initialData.profile?.phoneNumber || initialData.phoneNumber || ''),
                department: initialData.department?._id || initialData.department || '',
                status: (initialData.status === 'Aktif' || initialData.status === 'active') ? 'Aktif' : 'Pasif',
                password: '', // Don't populate password on edit
            })
        }
    }, [initialData])

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name === 'phoneNumber') {
            setFormData({ ...formData, [name]: formatPhoneNumber(value) })
            return
        }

        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const finalData = { ...formData }
        // If editing and password is empty, remove it so it doesn't try to update it with empty string
        if (isEdit && !finalData.password) {
            delete finalData.password;
        }

        const promise = async () => {
            let result: any
            if (isEdit && initialData?._id) {
                result = await dispatch(updateStaff({ id: initialData._id, staffData: finalData }))
            } else {
                result = await dispatch(createStaff(finalData))
            }
            if (!result.type.endsWith('/fulfilled')) throw new Error();
            router.push('/panel/personel')
            return result;
        }

        toast.promise(promise(), {
            loading: 'Personel kaydediliyor...',
            success: 'Personel başarıyla kaydedildi',
            error: 'Kaydetme sırasında bir hata oluştu',
        });
    }

    const handleDelete = async () => {
        if (initialData?._id) {
            const result = await dispatch(deleteStaff(initialData._id))
            if (deleteStaff.fulfilled.match(result)) {
                router.push('/panel/personel')
            }
        }
        setShowDeleteDialog(false)
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
                            {isEdit ? 'Personeli Düzenle' : 'Yeni Personel Ekle'}
                        </h1>
                        <p className="hidden md:block text-[11px] text-slate-500 font-medium mt-0.5">Ekibinizi yönetin ve yetkilendirin</p>
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
                            <span>Sil</span>
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 md:gap-3 bg-orange-500 text-white px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[11px] md:text-[13px] font-normal shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
                    >
                        {loading ? <Clock className="size-3.5 md:size-4 animate-spin" /> : <Save className="size-3.5 md:size-4" />}
                        <span className="hidden xs:inline-block">{isEdit ? "Güncelle" : "Personeli Kaydet"}</span>
                        <span className="xs:hidden">{isEdit ? "Güncelle" : "Kaydet"}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <FormSection title="Kişisel Bilgiler" icon={User} description="Personel kimlik ve iletişim detayları">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Ad" name="name" placeholder="Ad" value={formData.name} onChange={handleChange} required icon={User} />
                            <InputField label="Soyad" name="surname" placeholder="Soyad" value={formData.surname} onChange={handleChange} required icon={User} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="E-Posta Adresi" name="email" type="email" placeholder="ornek@sirket.com" value={formData.email} onChange={handleChange} required icon={Mail} />
                            <InputField
                                label="Telefon Numarası"
                                name="phoneNumber"
                                placeholder="0 (5XX) XXX XX XX"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                icon={Phone}
                            />
                        </div>
                    </FormSection>

                    <FormSection title="Yetkilendirme & Güvenlik" icon={Lock} description="Sistem erişim ve departman ayarları">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SelectField
                                label="Departman"
                                name="department"
                                placeholder="Departman Seçin"
                                value={formData.department}
                                onChange={handleChange}
                                options={departments || []}
                                required
                                icon={Building2}
                            />
                            <SelectField
                                label="Hesap Durumu"
                                name="status"
                                placeholder="Durum Seçin"
                                value={formData.status}
                                onChange={handleChange}
                                options={['Aktif', 'Pasif']}
                                icon={ShieldCheck}
                                isStatus={true}
                            />
                        </div>
                        <div className="mt-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                            <InputField
                                label={isEdit ? "Yeni Şifre (Opsiyonel)" : "Giriş Şifresi"}
                                name="password"
                                type="text" // Changed from password to text so it's visible by default
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Güvenli bir şifre belirleyin"
                                required={!isEdit}
                                icon={Lock}
                            />
                        </div>
                    </FormSection>
                </div>

                {/* Right Column - Sidebar style info or stats if needed */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-orange-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-500/20">
                        <div className="size-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                            <ShieldCheck className="size-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 ">Güvenli Yönetim</h3>
                        <p className="text-orange-100 text-xs font-medium leading-relaxed">
                            Personel şifreleri sistemde kriptolanmış olarak saklanır. Departman yetkilerini "Departmanlar" sayfasından yönetebilirsiniz.
                        </p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <h4 className="text-[13px] font-normal text-slate-500 mb-4">Hızlı Bilgi</h4>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                                    <Building2 className="size-4" />
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-500 font-medium mb-0.5">Kayıtlı Departman</p>
                                    <p className="text-xs font-semibold text-slate-700">{departments?.length || 0} Adet</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Personeli Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu personeli silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
