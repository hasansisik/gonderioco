"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Plus, Trash2, Camera, Save, LogOut, ShieldAlert, Building2, CreditCard, Image as ImageIcon, Mail, FileText, User, Copy, Check, Loader2, X, Briefcase, LayoutGrid, MessageSquare, Coins, Eye, Bell } from "lucide-react"
import { SelectModal } from "@/components/ui/select-modal"
import sectorsData from "@/data/sectors.json"
import { RatingCard } from "@/components/settings/rating-card"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import {
    getSettings,
    updateCompanyInfo,
    updateBankAccounts,
    updateLogos,
    updateSmtp,
    updatePdfSettings,
    updateRejectionReasons,
    updateEnabledModules
} from "@/redux/actions/settingsActions"
import { getAllDepartments } from "@/redux/actions/departmentActions"
import { editProfile, deleteAccount, logout, loadUser, verifyEmailChange } from "@/redux/actions/userActions"
import { uploadImageToCloudinary } from "@/lib/cloudinary"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { usePermissions } from "@/hooks/usePermissions"
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

const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[11px] font-normal text-slate-400 mb-2 px-1 block">
        {children}
    </label>
)

const InputField = ({ label, placeholder, type = "text", isSelect = false, value, onChange, maxLength }: { label: string, placeholder: string, type?: string, isSelect?: boolean, value?: string, onChange?: (e: any) => void, maxLength?: number }) => (
    <div className="flex flex-col w-full group">
        <Label>{label}</Label>
        <div className="relative">
            {isSelect ? (
                <>
                    <select
                        value={value}
                        onChange={onChange}
                        className="w-full appearance-none rounded-xl border border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white transition-all cursor-pointer shadow-sm">
                        <option value="" disabled>{placeholder}</option>
                        <option>Seçenek 1</option>
                        <option>Seçenek 2</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none group-focus-within:text-orange-500 transition-colors" />
                </>
            ) : (
                <input
                    type={type}
                    value={value || ''}
                    onChange={onChange}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white transition-all shadow-sm placeholder:text-slate-300 font-sans"
                />
            )}
        </div>
    </div>
)

const FileField = ({ label, placeholder, onChange, value }: { label: string, placeholder: string, onChange?: (e: any) => void, value?: string }) => (
    <div className="flex flex-col w-full group">
        <Label>{label}</Label>
        <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
                <div className="w-full min-h-[120px] rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-slate-300 hover:border-orange-200 hover:bg-orange-50/30 transition-all overflow-hidden p-4 group/box">
                    {value ? (
                        <div className="relative w-full h-full flex flex-col items-center gap-3">
                            <img src={value} alt={label} className="max-h-24 object-contain" />
                            <span className="text-[11px] text-slate-400 font-normal truncate max-w-full px-4">
                                {value.split('/').pop()}
                            </span>
                            <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover/box:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <span className="bg-white px-4 py-2 rounded-xl text-[11px] font-normal text-slate-800 shadow-xl border border-slate-100">Görseli Değiştir</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="size-12 rounded-xl bg-white flex items-center justify-center shadow-sm mb-2 group-hover/box:text-orange-500 transition-colors">
                                <Camera className="size-6" />
                            </div>
                            <span className="text-[11px] font-normal text-slate-400">{placeholder}</span>
                        </>
                    )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={onChange} />
            </label>
        </div>
    </div>
)

export default function GeneralSettingsPage() {
    const dispatch = useAppDispatch()
    const { settings, loading: settingsLoading } = useAppSelector((state) => state.settings)
    const router = useRouter()
    const { user: currentUser, loading: userLoading } = useAppSelector((state) => state.user)
    const { departments } = useAppSelector((state: any) => state.department)
    const isAnyLoading = settingsLoading || userLoading;

    const [activeTab, setActiveTab] = useState("Firma Bilgileri")
    const [companyInfo, setCompanyInfo] = useState({
        name: "",
        taxNumber: "",
        taxOffice: "",
        mersisNo: "",
        website: "",
        phone: "",
        address: "",
        logo: "",
        sectors: [] as string[]
    })
    const [accounts, setAccounts] = useState<any[]>([])
    const [smtp, setSmtp] = useState({
        host: "",
        user: "",
        password: "",
        secure: "ssl",
        port: "",
        senderEmail: "",
        senderName: "",
        useUserEmail: false
    })

    const [profileSettings, setProfileSettings] = useState({
        name: "",
        surname: "",
        email: "",
        picture: "",
        currentPassword: "",
        newPassword: "",
        newPasswordRepeat: ""
    })
    const [enabledModules, setEnabledModules] = useState({
        massMessage: false,
        commissionSystem: false,
        showCommissionToStaff: false
    })
    const [showVerificationDialog, setShowVerificationDialog] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    // Offer Notification Settings
    const [offerNotificationSettings, setOfferNotificationSettings] = useState({
        department: "",
        duration: 0,
        enabled: false
    })

    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean,
        title: string,
        description: string,
        onConfirm: () => void,
        variant?: 'danger' | 'default'
    }>({
        open: false,
        title: '',
        description: '',
        onConfirm: () => { },
        variant: 'default'
    });
    const [isVerifying, setIsVerifying] = useState(false)

    useEffect(() => {
        dispatch(loadUser())
        dispatch(getSettings())
        dispatch(getAllDepartments())
    }, [dispatch])

    useEffect(() => {
        if (settings) {
            if (settings.companyInfo) setCompanyInfo(prev => ({
                ...prev,
                ...settings.companyInfo,
                sectors: settings.companyInfo.sectors || []
            }))
            if (settings.bankAccounts) setAccounts(settings.bankAccounts)
            if (settings.smtp) setSmtp(settings.smtp)
            if (settings.enabledModules) setEnabledModules(prev => ({ ...prev, ...settings.enabledModules }))
        }
    }, [settings])

    useEffect(() => {
        if (currentUser) {
            setProfileSettings(prev => ({
                ...prev,
                email: currentUser.email || "",
                name: currentUser.name || "",
                surname: currentUser.surname || "",
                picture: currentUser.profile?.picture || ""
            }))

            if (currentUser.offerStatusNotificationSettings) {
                setOfferNotificationSettings({
                    department: currentUser.offerStatusNotificationSettings.department,
                    duration: currentUser.offerStatusNotificationSettings.duration,
                    enabled: currentUser.offerStatusNotificationSettings.enabled
                })
            }
        }
    }, [currentUser])

    const { hasPermission } = usePermissions();

    const tabs = [
        { id: "Firma Bilgileri", title: "Firma Bilgileri", icon: Building2, visible: hasPermission("Ayarlar: Firma Bilgileri") },
        { id: "Profil", title: "Profilim", icon: User, visible: true },
        { id: "Banka Hesapları", title: "Banka Hesapları", icon: CreditCard, visible: hasPermission("Ayarlar: Banka Hesapları") },
        { id: "Proje Teklif Ayarları", title: "Teklif Ayarları", icon: FileText, visible: hasPermission("Ayarlar: Sistem Ayarları") },
        { id: "Modül Yönetimi", title: "Modül Yönetimi", icon: LayoutGrid, visible: hasPermission("Ayarlar: Sistem Ayarları") },
    ].filter(t => t.visible);

    useEffect(() => {
        // Ensure active tab is valid
        if (tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
            setActiveTab(tabs[0].id);
        }
    }, [tabs, activeTab]);

    const handleSave = async (action: any, successMsg: string, errorMsg: string) => {
        const res = await dispatch(action)
        if (res.type.endsWith('/fulfilled')) {
            toast.success(successMsg)
        } else {
            toast.error(errorMsg)
        }
    }

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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, section: 'logos' | 'pdfSettings') => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const promise = async () => {
                const url = await uploadImageToCloudinary(file)
                let res;
                if (section === 'logos') {
                    res = await dispatch(updateLogos({ ...settings?.logos, [field]: url }))
                } else {
                    res = await dispatch(updatePdfSettings({ ...settings?.pdfSettings, [field]: url }))
                }
                if (!res.type.endsWith('/fulfilled')) throw new Error();
                return url;
            }

            toast.promise(promise, {
                loading: 'Dosya yükleniyor...',
                success: 'Görsel başarıyla güncellendi',
                error: 'Yükleme sırasında bir hata oluştu',
            });
        } catch (error) {
            console.error(error);
        }
    }

    const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const promise = async () => {
                const url = await uploadImageToCloudinary(file)
                setProfileSettings(prev => ({ ...prev, picture: url }))

                const payload: any = {
                    email: profileSettings.email,
                    name: profileSettings.name,
                    surname: profileSettings.surname,
                    picture: url,
                    offerStatusNotificationSettings: offerNotificationSettings
                }
                const res = await dispatch(editProfile(payload))
                if (editProfile.fulfilled.match(res)) {
                    dispatch(loadUser())
                } else {
                    throw new Error()
                }

                return url;
            }

            toast.promise(promise, {
                loading: 'Profil fotoğrafı yükleniyor...',
                success: 'Profil fotoğrafı başarıyla güncellendi!',
                error: 'Yükleme sırasında bir hata oluştu',
            });
        } catch (error) {
            console.error(error);
        }
    }

    const handleRemoveProfilePicture = () => {
        setProfileSettings(prev => ({ ...prev, picture: "" }))
        toast.success('Profil fotoğrafı kaldırıldı. Kaydetmeyi unutmayın!')
    }

    const handleCompanyLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const promise = async () => {
                const url = await uploadImageToCloudinary(file)
                setCompanyInfo(prev => ({ ...prev, logo: url }))
                const res = await dispatch(updateCompanyInfo({ ...companyInfo, logo: url }))
                if (!res.type.endsWith('/fulfilled')) throw new Error()
                return url;
            }

            toast.promise(promise, {
                loading: 'Firma logosu yükleniyor...',
                success: 'Firma logosu başarıyla güncellendi!',
                error: 'Yükleme sırasında bir hata oluştu',
            });
        } catch (error) {
            console.error(error);
        }
    }

    const handleRemoveCompanyLogo = () => {
        setCompanyInfo(prev => ({ ...prev, logo: "" }))
        toast.success('Firma logosu kaldırıldı. Kaydetmeyi unutmayın!')
    }

    const updateAccount = (index: number, field: string, value: string) => {
        setAccounts(accounts.map((acc, i) => {
            if (i === index) {
                if (field === 'iban') {
                    const digitsOnly = value.replace(/[^0-9]/g, '');
                    const formattedValue = "TR" + digitsOnly.substring(0, 24);
                    return { ...acc, [field]: formattedValue };
                }
                return { ...acc, [field]: value };
            }
            return acc;
        }))
    }

    const handleUpdateProfile = async () => {
        if (profileSettings.newPassword && profileSettings.newPassword !== profileSettings.newPasswordRepeat) {
            toast.error("Yeni şifreler eşleşmiyor");
            return;
        }

        const payload: any = {
            email: profileSettings.email,
            name: profileSettings.name,
            surname: profileSettings.surname,
            picture: profileSettings.picture,
            offerStatusNotificationSettings: offerNotificationSettings
        };
        if (profileSettings.newPassword) payload.password = profileSettings.newPassword;

        const res = await dispatch(editProfile(payload));
        if (editProfile.fulfilled.match(res)) {
            if (res.payload.requiresEmailVerification) {
                setShowVerificationDialog(true);
                toast.info(res.payload.message);
            } else {
                toast.success("Profil başarıyla güncellendi");
                dispatch(loadUser());
            }
            setProfileSettings(prev => ({ ...prev, currentPassword: "", newPassword: "", newPasswordRepeat: "" }));
        } else {
            toast.error(res.payload as string || "Profil güncellenirken hata oluştu");
        }
    };

    const handleVerifyEmailChange = async () => {
        if (!verificationCode) {
            toast.error("Lütfen doğrulama kodunu girin");
            return;
        }

        setIsVerifying(true);
        const res = await dispatch(verifyEmailChange(verificationCode));
        setIsVerifying(false);

        if (verifyEmailChange.fulfilled.match(res)) {
            toast.success("E-posta adresiniz başarıyla güncellendi");
            setShowVerificationDialog(false);
            setVerificationCode("");
            dispatch(loadUser());
        } else {
            toast.error(res.payload as string || "Doğrulama başarısız");
        }
    };

    const handleDeleteAccount = async () => {
        setConfirmDialog({
            open: true,
            title: "Hesabı Sil",
            description: "Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinir.",
            variant: 'danger',
            onConfirm: async () => {
                const res = await dispatch(deleteAccount());
                if (deleteAccount.fulfilled.match(res)) {
                    toast.success("Hesabınız silindi");
                    router.push("/giris");
                }
            }
        });
    };

    const handleLogout = async () => {
        await dispatch(logout());
        router.push("/giris");
    };

    const handleActionClick = () => {
        switch (activeTab) {
            case "Firma Bilgileri":
                handleSave(updateCompanyInfo(companyInfo), "Firma bilgileri güncellendi", "Hata oluştu");
                break;
            case "Profil":
                handleUpdateProfile();
                break;
            case "Banka Hesapları":
                handleSave(updateBankAccounts(accounts), "Banka hesapları güncellendi", "Hata oluştu");
                break;
            case "E-Posta Sunucu Ayarları":
                handleSave(updateSmtp(smtp), "SMTP ayarları güncellendi", "Hata oluştu");
                break;
            case "Proje Teklif Ayarları":

                break;
            case "Modül Yönetimi":
                handleSave(updateEnabledModules(enabledModules), "Modül ayarları güncellendi", "Hata oluştu");
                break;
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] font-sans">
            <div className="flex flex-col lg:flex-row flex-1 gap-4 lg:gap-8 overflow-hidden">
                {/* Sidebar Nav */}
                <div className="w-full lg:w-[300px] flex flex-col gap-4 shrink-0 p-1">
                    <div className="bg-white rounded-2xl lg:rounded-[2.5rem] border border-slate-100 p-2 lg:p-3 shadow-sm flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible no-scrollbar min-w-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2.5 lg:gap-3.5 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-[1.5rem] text-[10px] lg:text-[11px] font-normal transition-all whitespace-nowrap min-w-max lg:min-w-0",
                                    activeTab === tab.id
                                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <tab.icon className={cn("size-3.5 lg:size-4", activeTab === tab.id ? "text-orange-500" : "text-slate-300")} />
                                {tab.title}
                            </button>
                        ))}
                    </div>

                    {/* Overall Save Button Container */}
                    {activeTab !== "Logolar" && (
                        <div className="mt-auto hidden lg:block pt-4">
                            <button
                                onClick={handleActionClick}
                                disabled={isAnyLoading}
                                className="w-full flex items-center justify-center gap-3 bg-orange-500 text-white py-5 rounded-[2rem] text-[12px] font-normal shadow-2xl shadow-orange-500/30 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isAnyLoading ? (
                                    <Loader2 className="size-4 animate-spin" strokeWidth={3} />
                                ) : (
                                    <Save className="size-4" strokeWidth={3} />
                                )}
                                {isAnyLoading ? "Kaydediliyor..." : "Ayarları Kaydet"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Content Panel */}
                <div className="flex-1 bg-white rounded-2xl lg:rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col overflow-hidden">
                    <div className="px-6 py-6 lg:px-10 lg:py-8 border-b border-slate-50 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 lg:gap-4 truncate">
                                <div className="size-10 lg:size-12 rounded-xl lg:rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 shadow-sm shrink-0">
                                    {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { className: "size-5 lg:size-6" })}
                                </div>
                                <div className="truncate">
                                    <h2 className="text-lg lg:text-xl font-semibold text-slate-800  truncate">{tabs.find(t => t.id === activeTab)?.title}</h2>
                                    <p className="hidden md:block text-[11px] text-slate-400 font-normal mt-0.5">Ayarlarınızı buradan yönetebilirsiniz</p>
                                </div>
                            </div>
                            {activeTab !== "Logolar" && (
                                <button
                                    onClick={handleActionClick}
                                    disabled={isAnyLoading}
                                    className="lg:hidden flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-[11px] font-normal shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70"
                                >
                                    {isAnyLoading ? (
                                        <Loader2 className="size-3.5 animate-spin" strokeWidth={3} />
                                    ) : (
                                        <Save className="size-3.5" strokeWidth={3} />
                                    )}
                                    {isAnyLoading ? "..." : "Kaydet"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar">
                        <div className="max-w-[800px] pb-10">
                            {activeTab === "Firma Bilgileri" && (
                                <div className="flex flex-col gap-8">
                                    {currentUser?.companyCode && (
                                        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                                            <div className="flex flex-col items-center gap-4 shrink-0">
                                                <Label>Firma Logosu</Label>
                                                <div className="relative group/logo">
                                                    <div className="size-32 rounded-3xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center overflow-hidden transition-all group-hover/logo:border-orange-500/50 group-hover/logo:shadow-xl group-hover/logo:shadow-orange-500/10">
                                                        {settingsLoading ? (
                                                            <div className="animate-pulse bg-slate-100 size-full rounded-3xl" />
                                                        ) : companyInfo.logo ? (
                                                            <img src={companyInfo.logo} alt="Firma Logosu" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2 text-slate-300">
                                                                <Building2 className="size-8" />
                                                                <span className="text-[8px] font-normal text-center px-4">Logo Yok</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <label className="absolute -bottom-2 -right-2 size-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 cursor-pointer hover:bg-orange-600 hover:scale-110 active:scale-95 transition-all">
                                                        <Camera className="size-5" />
                                                        <input type="file" accept="image/*" className="hidden" onChange={handleCompanyLogoUpload} />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex-1 w-full flex flex-col gap-4">


                                                <RatingCard rating={currentUser.rating || 0} count={currentUser.ratingCount || 0} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div className="flex flex-col gap-6">
                                            <InputField label="Firma Adı" placeholder="" value={companyInfo.name} onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField label="Vergi Dairesi" placeholder="" value={companyInfo.taxOffice} onChange={(e) => setCompanyInfo({ ...companyInfo, taxOffice: e.target.value })} />
                                                <InputField label="Vergi Numarası" placeholder="" value={companyInfo.taxNumber} onChange={(e) => setCompanyInfo({ ...companyInfo, taxNumber: e.target.value })} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField label="Mersis No" placeholder="" value={companyInfo.mersisNo} onChange={(e) => setCompanyInfo({ ...companyInfo, mersisNo: e.target.value })} />
                                                <InputField label="Telefon" placeholder="0 (5XX) XXX XX XX" value={companyInfo.phone} onChange={(e) => setCompanyInfo({ ...companyInfo, phone: formatPhoneNumber(e.target.value) })} />
                                            </div>
                                            <InputField label="İnternet Sitesi" placeholder="" value={companyInfo.website} onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-6">
                                            <div className="flex flex-col w-full group">
                                                <Label>Firma Adresi</Label>
                                                <textarea
                                                    placeholder=""
                                                    value={companyInfo.address}
                                                    onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                                                    className="w-full h-full min-h-[140px] rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-5 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white shadow-inner resize-none leading-relaxed transition-all font-sans"
                                                />
                                            </div>

                                            <SelectModal
                                                label="Hizmet Verilen Sektörler"
                                                value={companyInfo.sectors}
                                                onChange={(val) => setCompanyInfo({ ...companyInfo, sectors: val })}
                                                options={sectorsData.map(s => ({ id: s.id, label: s.name }))}
                                                placeholder="Sektörleri Seçiniz..."
                                                multiple={true}
                                                icon={Briefcase}
                                            />
                                            {companyInfo.sectors.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1 px-1">
                                                    {companyInfo.sectors.map(id => {
                                                        const sector = sectorsData.find(s => s.id === id);
                                                        return sector ? (
                                                            <span key={id} className="text-[10px] bg-orange-50 text-orange-600 font-normal px-2 py-1 rounded-lg border border-orange-100">
                                                                {sector.name}
                                                            </span>
                                                        ) : null;
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Profil" && (
                                <div className="flex flex-col gap-10">
                                    <div className="flex flex-col lg:flex-row gap-10 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
                                        <div className="flex flex-col items-center gap-4 shrink-0">
                                            <Label>Profil Fotoğrafı</Label>
                                            <div className="relative group/avatar">
                                                <div className="size-32 rounded-3xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center overflow-hidden transition-all group-hover/avatar:border-orange-500/50 group-hover/avatar:shadow-xl group-hover/avatar:shadow-orange-500/10">
                                                    {userLoading ? (
                                                        <div className="animate-pulse bg-slate-100 size-full rounded-3xl" />
                                                    ) : (
                                                        <UserAvatar
                                                            name={currentUser?.name || profileSettings.name}
                                                            surname={currentUser?.surname || profileSettings.surname}
                                                            picture={profileSettings.picture}
                                                            size="xl"
                                                            className="!size-full !rounded-3xl"
                                                        />
                                                    )}
                                                </div>
                                                <label className="absolute -bottom-2 -right-2 size-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 cursor-pointer hover:bg-orange-600 hover:scale-110 active:scale-95 transition-all">
                                                    <Camera className="size-5" />
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleProfilePictureUpload} />
                                                </label>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-normal text-center mt-2">Kare formatında<br />önerilir</p>
                                        </div>

                                        <div className="flex-1 flex flex-col gap-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField label="İsim" placeholder="" value={profileSettings.name} onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })} />
                                                <InputField label="Soyisim" placeholder="" value={profileSettings.surname} onChange={(e) => setProfileSettings({ ...profileSettings, surname: e.target.value })} />
                                            </div>
                                            <InputField label="E-Posta Adresi" placeholder="" value={profileSettings.email} onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })} />
                                            <div className="space-y-4 pt-4 border-t border-white">
                                                <InputField label="Yeni Şifre" placeholder="••••••••" type="password" value={profileSettings.newPassword} onChange={(e) => setProfileSettings({ ...profileSettings, newPassword: e.target.value })} />
                                                <InputField label="Yeni Şifre Tekrar" placeholder="••••••••" type="password" value={profileSettings.newPasswordRepeat} onChange={(e) => setProfileSettings({ ...profileSettings, newPasswordRepeat: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Online Status Toggle - Only for Staff and Provider */}
                                    {(currentUser?.userType === 'staff' || currentUser?.userType === 'provider') && (
                                        <div className="rounded-[2.5rem] border border-blue-100 bg-blue-50/50 p-8">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-sm border border-blue-100">
                                                        <User className="size-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[15px] font-normal text-blue-900">Çevrimiçi Durumu</h4>
                                                        <p className="text-[10px] text-blue-700/60 font-medium font-sans italic">
                                                            {currentUser?.showOnlineStatus !== false
                                                                ? "Mesajlar sayfasında çevrimiçi durumunuz görünüyor"
                                                                : "Mesajlar sayfasında çevrimiçi durumunuz gizli"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={currentUser?.showOnlineStatus !== false}
                                                        onChange={async (e) => {
                                                            const isChecked = e.target.checked;
                                                            const res = await dispatch(editProfile({ showOnlineStatus: isChecked }));
                                                            if (editProfile.fulfilled.match(res)) {
                                                                toast.success(isChecked ? "Çevrimiçi durumunuz artık görünüyor" : "Çevrimiçi durumunuz artık gizli");
                                                                dispatch(loadUser());
                                                            } else {
                                                                toast.error("Ayar güncellenirken hata oluştu");
                                                            }
                                                        }}
                                                    />
                                                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500 shadow-inner"></div>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Offer Status Notifications - For Staff and Provider */}
                                    {(currentUser?.userType === 'staff' || currentUser?.userType === 'provider') && (
                                        <div className="rounded-[2.5rem] border border-purple-100 bg-purple-50/50 p-8">
                                            <div className="flex flex-col gap-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-purple-500 shadow-sm border border-purple-100">
                                                            <Bell className="size-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[15px] font-normal text-purple-900">Teklif Durum Bildirimleri</h4>
                                                            <p className="text-[10px] text-purple-700/60 font-medium font-sans italic">
                                                                Belirlenen sürede işlem yapılmayan teklifler için bildirim gönderilir
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={offerNotificationSettings.enabled}
                                                            onChange={(e) => {
                                                                const isChecked = e.target.checked;
                                                                setOfferNotificationSettings(prev => ({ ...prev, enabled: isChecked }));
                                                            }}
                                                        />
                                                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-500 shadow-inner"></div>
                                                    </label>
                                                </div>

                                                {offerNotificationSettings.enabled && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-purple-100">
                                                        <div className="flex flex-col w-full group">
                                                            <Label>Departman Seçimi</Label>
                                                            <div className="relative">
                                                                <select
                                                                    value={offerNotificationSettings.department}
                                                                    onChange={(e) => setOfferNotificationSettings(prev => ({ ...prev, department: e.target.value }))}
                                                                    className="w-full appearance-none rounded-xl border border-slate-100 bg-white px-5 py-3 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-purple-500/5 transition-all cursor-pointer shadow-sm">
                                                                    <option value="" disabled>Departman Seçiniz...</option>
                                                                    {departments?.map((dept: any) => (
                                                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                                                    ))}
                                                                </select>
                                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none" />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col w-full group">
                                                            <Label>Bildirim Süresi (Saat)</Label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={offerNotificationSettings.duration}
                                                                onChange={(e) => setOfferNotificationSettings(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                                                                className="w-full rounded-xl border border-slate-100 bg-white px-5 py-3 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-purple-500/5 transition-all shadow-sm placeholder:text-slate-300 font-sans"
                                                                placeholder="Örn: 24"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="rounded-[2.5rem] border border-rose-100 bg-rose-50/50 p-8 flex flex-col gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                                                <ShieldAlert className="size-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-[15px] font-normal text-rose-900">Hesap Yönetimi</h4>
                                                <p className="text-[10px] text-rose-700/60 font-medium font-sans italic">Bu bölümdeki işlemler kalıcıdır ve geri alınamaz.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={handleLogout}
                                                className="flex-1 rounded-xl bg-white border border-rose-100 py-3.5 text-[12px] font-normal text-rose-600 hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                                            >
                                                <LogOut className="size-4" />
                                                Oturumu Kapat
                                            </button>
                                            <button
                                                onClick={handleDeleteAccount}
                                                className="flex-1 rounded-xl bg-rose-500 py-3.5 text-[12px] font-normal text-white shadow-lg shadow-rose-500/10 hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Trash2 className="size-4" />
                                                Hesabı Sil
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Banka Hesapları" && (
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-[12px] font-normal text-slate-400">Kayıtlı Banka Hesapları</h3>
                                        <button
                                            onClick={() => setAccounts([...accounts, { bank: "", iban: "TR" }])}
                                            className="flex items-center gap-2 text-emerald-500 text-[12px] font-normal hover:text-emerald-600 transition-colors"
                                        >
                                            <Plus className="size-4" />
                                            Yeni Ekle
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {accounts.map((acc, index) => (
                                            <div key={index} className="flex items-end gap-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 relative group/row">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                                    <InputField
                                                        label="Banka Adı"
                                                        placeholder="Örn: Garanti BBVA"
                                                        value={acc.bank}
                                                        onChange={(e) => updateAccount(index, 'bank', e.target.value)}
                                                    />
                                                    <InputField
                                                        label="IBAN"
                                                        placeholder="TR00 0000 0000 0000 0000 00"
                                                        value={acc.iban}
                                                        maxLength={26}
                                                        onChange={(e) => updateAccount(index, 'iban', e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => setAccounts(accounts.filter((_, i) => i !== index))}
                                                    className="size-11 rounded-xl bg-white border border-slate-100 text-slate-300 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
                                                >
                                                    <Trash2 className="size-5" />
                                                </button>
                                            </div>
                                        ))}
                                        {accounts.length === 0 && (
                                            <div className="py-20 flex flex-col items-center gap-4 text-slate-300">
                                                <CreditCard className="size-12 opacity-20" />
                                                <p className="text-xs font-normal">Kayıtlı banka hesabı bulunamadı</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}



                            {activeTab === "E-Posta Sunucu Ayarları" && (
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
                                        <div className="md:col-span-2">
                                            <InputField label="E-Posta Sunucusu (Host)" placeholder="mail.alanadi.com" value={smtp.host} onChange={(e) => setSmtp({ ...smtp, host: e.target.value })} />
                                        </div>
                                        <InputField label="Kullanıcı Adı" placeholder="info@alanadi.com" value={smtp.user} onChange={(e) => setSmtp({ ...smtp, user: e.target.value })} />
                                        <InputField label="Şifre" placeholder="••••••••" type="password" value={smtp.password} onChange={(e) => setSmtp({ ...smtp, password: e.target.value })} />

                                        <div className="flex flex-col w-full group">
                                            <Label>Guvenlik Protokolü</Label>
                                            <div className="relative">
                                                <select
                                                    value={smtp.secure}
                                                    onChange={(e) => setSmtp({ ...smtp, secure: e.target.value })}
                                                    className="w-full appearance-none rounded-xl border border-slate-100 bg-white px-5 py-3 text-xs text-slate-800 font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all cursor-pointer shadow-sm">
                                                    <option value="ssl">SSL Protocol</option>
                                                    <option value="tls">TLS Protocol</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none" />
                                            </div>
                                        </div>
                                        <InputField label="Port Numarası" placeholder="465" value={smtp.port} onChange={(e) => setSmtp({ ...smtp, port: e.target.value })} />

                                        <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
                                            <InputField label="Gönderen E-Posta" placeholder="info@alanadi.com" value={smtp.senderEmail} onChange={(e) => setSmtp({ ...smtp, senderEmail: e.target.value })} />
                                            <InputField label="Gönderici Adı" placeholder="Sadece Teklif" value={smtp.senderName} onChange={(e) => setSmtp({ ...smtp, senderName: e.target.value })} />

                                            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 border-dashed">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={smtp.useUserEmail}
                                                        onChange={(e) => setSmtp({ ...smtp, useUserEmail: e.target.checked })}
                                                    />
                                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                                                </label>
                                                <span className="text-[12px] font-normal text-slate-600">Kullanıcı E-Postası İle Gönder</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Proje Teklif Ayarları" && (
                                <div className="grid grid-cols-1 gap-12">
                                    <div className="space-y-8">
                                        <h3 className="text-[12px] font-normal text-slate-400 bg-slate-50 w-fit px-3 py-1 rounded-lg">PDF Görsel Şablonlar</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[
                                                { label: "Header Görseli", placeholder: "Header Dosyası", field: "header" },
                                                { label: "Footer Görseli", placeholder: "Footer Dosyası", field: "footer" },
                                                { label: "PDF Arka Plan", placeholder: "Arka Plan Dosyası", field: "background" }
                                            ].map((item) => (
                                                <div key={item.field} className="relative group/logo p-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-orange-100 transition-all">
                                                    <FileField
                                                        label={item.label}
                                                        placeholder={item.placeholder}
                                                        value={(settings?.pdfSettings as any)?.[item.field]}
                                                        onChange={(e) => handleFileUpload(e, item.field, 'pdfSettings')}
                                                    />
                                                    {(settings?.pdfSettings as any)?.[item.field] && (
                                                        <button
                                                            onClick={() => {
                                                                setConfirmDialog({
                                                                    open: true,
                                                                    title: "Görseli Kaldır",
                                                                    description: "Bu görseli kaldırmak istediğinizden emin misiniz?",
                                                                    onConfirm: () => {
                                                                        dispatch(updatePdfSettings({ ...settings?.pdfSettings, [item.field]: "" }));
                                                                        toast.success("Görsel kaldırıldı");
                                                                    }
                                                                });
                                                            }}
                                                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                </div>
                            )}

                            {activeTab === "Modül Yönetimi" && (
                                <div className="flex flex-col gap-6">
                                    <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-8 space-y-8">
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-sm border border-orange-100 group-hover:scale-110 transition-transform font-normal">
                                                    <MessageSquare className="size-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[15px] font-normal text-slate-800">Müşteri Toplu Mesaj</h4>
                                                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">Müşterilere toplu mesaj gönderme özelliğini açar.</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={enabledModules.massMessage}
                                                    onChange={(e) => setEnabledModules({ ...enabledModules, massMessage: e.target.checked })}
                                                />
                                                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500 shadow-inner"></div>
                                            </label>
                                        </div>

                                        <div className="w-full h-px bg-slate-100 border-none" />

                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-sm border border-orange-100 group-hover:scale-110 transition-transform font-normal">
                                                    <Coins className="size-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[15px] font-normal text-slate-800">Prim Sistemi</h4>
                                                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">Personel prim takip ve ödeme sistemini aktifleştirir.</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={enabledModules.commissionSystem}
                                                    onChange={(e) => setEnabledModules({ ...enabledModules, commissionSystem: e.target.checked })}
                                                />
                                                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500 shadow-inner"></div>
                                            </label>
                                        </div>

                                        {enabledModules.commissionSystem && (
                                            <>
                                                <div className="w-full h-px bg-slate-100 border-none" />
                                                <div className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-sm border border-orange-100 group-hover:scale-110 transition-transform font-normal">
                                                            <Eye className="size-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[15px] font-normal text-slate-800">Personele Prim Göster</h4>
                                                            <p className="text-[11px] text-slate-400 font-normal mt-0.5">Personelin kendi hakedişlerini dashboard üzerinden görebilmesini sağlar.</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={enabledModules.showCommissionToStaff}
                                                            onChange={(e) => setEnabledModules({ ...enabledModules, showCommissionToStaff: e.target.checked })}
                                                        />
                                                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500 shadow-inner"></div>
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Verification Dialog */}
            {showVerificationDialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-10 border border-slate-100 flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="size-16 rounded-[2rem] bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 shadow-sm">
                                <Mail className="size-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold text-slate-800 ">Yeni E-posta Doğrulaması</h3>
                                <p className="text-[12px] text-slate-400 font-normal">Yeni adresinize 4 haneli bir kod gönderdik</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <Label>Doğrulama Kodu</Label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    placeholder="••••"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="w-full text-center tracking-[1em] text-2xl font-semibold rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all shadow-inner"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleVerifyEmailChange}
                                    disabled={isVerifying}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[12px] font-normal shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {isVerifying ? "Doğrulanıyor..." : "Değişikliği Tamamla"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowVerificationDialog(false);
                                        setVerificationCode("");
                                    }}
                                    className="w-full py-4 text-[12px] font-normal text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    Vazgeç
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialog.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDialog.onConfirm}
                            className={cn(confirmDialog.variant === 'danger' ? "bg-rose-500 hover:bg-rose-600" : "bg-orange-500 hover:bg-orange-600")}
                        >
                            {confirmDialog.variant === 'danger' ? 'Sil' : 'Onayla'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
