"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { register } from "@/redux/actions/userActions"
import { Eye, EyeOff, Plus } from "lucide-react"
import { TermsDialog } from "./terms-dialog"

import { getPublicSettings } from "@/redux/actions/settingsActions"
import { useEffect } from "react"

import sectorsData from "@/data/sectors.json"
import { SelectModal } from "./ui/select-modal"
import { Briefcase } from "lucide-react"

export function KayitForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.user)
  const { settings } = useAppSelector((state) => state.settings)

  useEffect(() => {
    dispatch(getPublicSettings())
  }, [dispatch])

  const loginLogo = settings?.logos?.login || "/logo.png"

  const [mode, setMode] = useState<"buyer" | "provider">("buyer")

  // States
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [company, setCompany] = useState("")
  const [taxNumber, setTaxNumber] = useState("")
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== passwordConfirm) {
      return;
    }

    if (!termsAccepted) {
      setIsTermsDialogOpen(true);
      return;
    }

    // Validation for sectors
    if (selectedSectors.length === 0) {
      alert("Lütfen en az bir sektör seçiniz.");
      return;
    }

    const fullName = name.trim();
    const lastSpaceIndex = fullName.lastIndexOf(' ');
    const firstName = lastSpaceIndex === -1 ? fullName : fullName.substring(0, lastSpaceIndex);
    const lastName = lastSpaceIndex === -1 ? '' : fullName.substring(lastSpaceIndex + 1);

    const result = await dispatch(register({
      name: firstName,
      surname: lastName,
      email,
      password,
      company: mode === "provider" ? company : undefined,
      taxNumber: mode === "provider" ? taxNumber : undefined,
      userType: mode === "buyer" ? "customer" : "provider",
      sectors: selectedSectors
    }))

    if (register.fulfilled.match(result)) {
      router.push(`/dogrulama?email=${encodeURIComponent(email)}`)
    }
  }


  return (
    <div className={cn("flex flex-col items-center gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        <img
          src="/logo.png"
          alt="sadeceteklif.com"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Auth Toggle */}
      <div className="flex w-full max-w-[320px] rounded-full bg-slate-100 p-1">
        <Link
          href="/giris"
          className="flex-1 rounded-full px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 text-center flex items-center justify-center"
        >
          Giriş yap
        </Link>
        <button
          type="button"
          className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm"
        >
          Kayıt ol
        </button>
      </div>

      {/* Mode Toggle (Hizmet Alan / Hizmet Veren) */}
      <div className="flex w-full max-w-[320px] rounded-full bg-slate-100 p-1">
        <button
          onClick={() => setMode("buyer")}
          className={cn(
            "flex-1 rounded-full px-4 py-2 text-sm font-bold transition-all",
            mode === "buyer" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
          )}
        >
          Hizmet alan
        </button>
        <button
          onClick={() => setMode("provider")}
          className={cn(
            "flex-1 rounded-full px-4 py-2 text-sm font-bold transition-all",
            mode === "provider" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
          )}
        >
          Hizmet veren
        </button>
      </div>

      {/* Form */}
      <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
        {error && typeof error === "string" && (
          <div className="rounded-xl bg-red-50 p-4 text-center text-xs font-medium text-red-500">
            {error}
          </div>
        )}

        {/* Conditional Seller Fields */}
        {mode === "provider" && (
          <>
            <div className="flex flex-col gap-2">
              <label className="px-1 text-xs font-bold text-slate-800">Firma</label>
              <input
                type="text"
                placeholder="Firma Adı"
                className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="px-1 text-xs font-bold text-slate-800">Vergi Numarası</label>
              <input
                type="text"
                placeholder="Vergi Numarası"
                className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                required
              />
            </div>
          </>
        )}


        {/* Sectors Selection (Mandatory) */}
        <div className="flex flex-col gap-2">
          <SelectModal
            label={mode === "provider" ? "Hangi Sektörlerde Hizmet Veriyorsunuz? (Zorunlu)" : "Hangi Sektörlerle İlgileniyorsunuz? (Zorunlu)"}
            value={selectedSectors}
            onChange={(val) => setSelectedSectors(val)}
            options={sectorsData.map(s => ({ id: s.id, label: s.name }))}
            placeholder="Sektörleri Seçiniz..."
            multiple={true}
            icon={Briefcase}
            required={true}
          />
          {selectedSectors.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 px-1">
              {selectedSectors.map(id => {
                const sector = sectorsData.find(s => s.id === id);
                return sector ? (
                  <span key={id} className="text-[10px] bg-orange-50 text-orange-600 font-bold px-2 py-1 rounded-lg border border-orange-100">
                    {sector.name}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Global Fields */}
        <div className="flex flex-col gap-2">
          <label className="px-1 text-xs font-bold text-slate-800 text-left w-full">Ad Soyad</label>
          <input
            type="text"
            placeholder="Ad Soyad"
            className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="px-1 text-xs font-bold text-slate-800 text-left w-full">Email</label>
          <input
            type="email"
            placeholder="E-posta adresinizi girin"
            className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="px-1 text-xs font-bold text-slate-800 text-left w-full">Şifre</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="px-1 text-xs font-bold text-slate-800 text-left w-full">Şifre Tekrar</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          {password && passwordConfirm && password !== passwordConfirm && (
            <p className="px-1 text-[11px] font-bold text-red-500">Şifreler eşleşmiyor</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-1">
          <div
            onClick={() => !termsAccepted && setIsTermsDialogOpen(true)}
            className="flex cursor-pointer items-center gap-2 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <input
              type="checkbox"
              className="size-4 rounded border-slate-200 text-orange-600 focus:ring-orange-500/20 cursor-pointer pointer-events-none"
              checked={termsAccepted}
              readOnly
              required
            />
            <span className="hover:underline">Okudum, onaylıyorum</span>
          </div>
          <Link
            href="/sifremiunuttum"
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
          >
            Şifremi Unuttum
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full bg-[#FA8B00] py-4 text-[15px] font-bold text-white shadow-xl shadow-orange-500/20 hover:bg-[#E67E00] transition-all disabled:opacity-70"
        >
          {loading ? "Kayıt yapılıyor..." : "Kayıt ol!"}
        </button>
      </form>

      <div className="text-sm font-medium text-slate-600">
        Zaten hesabın var mı?{" "}
        <Link href="/giris" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
          Giriş Yap!
        </Link>
      </div>

      {/* Terms Dialog */}
      <TermsDialog
        isOpen={isTermsDialogOpen}
        onClose={() => setIsTermsDialogOpen(false)}
        onAccept={() => setTermsAccepted(true)}
      />
    </div>
  )
}
