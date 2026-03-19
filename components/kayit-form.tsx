"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { register } from "@/redux/actions/userActions"
import { Eye, EyeOff, Globe, Phone } from "lucide-react"
import { getPublicSettings } from "@/redux/actions/settingsActions"

const countries = [
  { code: "+90", flag: "🇹🇷", name: "Türkiye" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
]

export function KayitForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.user)

  useEffect(() => {
    dispatch(getPublicSettings())
  }, [dispatch])

  // States
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+90")
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== passwordConfirm) {
      alert("Şifreler eşleşmiyor.");
      return;
    }

    if (!termsAccepted) {
      alert("Lütfen kullanım şartlarını onaylayın.");
      return;
    }

    const result = await dispatch(register({
      name,
      surname,
      email,
      password,
      company: company || undefined,
      userType: "customer",
      phone: `${countryCode}${phone}`
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
          alt="gonderio.co"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Auth Toggle */}
      <div className="flex w-full max-w-[320px] rounded-full bg-slate-100 p-1 mb-2">
        <Link
          href="/giris"
          className="flex-1 rounded-full px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 text-center flex items-center justify-center transition-all"
        >
          Giriş yap
        </Link>
        <button
          type="button"
          className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition-all"
        >
          Kayıt ol
        </button>
      </div>

      {/* Form */}
      <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
        {error && typeof error === "string" && (
          <div className="rounded-xl bg-red-50 p-4 text-center text-xs font-medium text-red-500 border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="px-1 text-xs font-bold text-slate-700">Ad</label>
            <input
              type="text"
              placeholder="Ad"
              className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-5 text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all shadow-sm"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="px-1 text-xs font-bold text-slate-700">Soyad</label>
            <input
              type="text"
              placeholder="Soyad"
              className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-5 text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all shadow-sm"
              required
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="px-1 text-xs font-bold text-slate-700">Email</label>
          <input
            type="email"
            placeholder="E-posta adresiniz"
            className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-5 text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all shadow-sm"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="px-1 text-xs font-bold text-slate-700">Şirket Adı <span className="text-slate-300 font-normal">(Opsiyonel)</span></label>
          <input
            type="text"
            placeholder="Şirketiniz (isteğe bağlı)"
            className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-5 text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all shadow-sm"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label className="px-1 text-xs font-bold text-slate-700 font-sans">Telefon No</label>
          <div className="flex gap-2">
            <div className="relative shrink-0">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-white pl-4 pr-8 text-[13px] text-slate-800 appearance-none focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all shadow-sm cursor-pointer"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Globe className="size-3" />
              </div>
            </div>
            <div className="relative flex-1">
              <input
                type="tel"
                placeholder="5XX XXX XX XX"
                className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-5 pl-10 text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all shadow-sm"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-slate-300" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="px-1 text-xs font-bold text-slate-700">Şifre</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-5 text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all shadow-sm"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
            >
              {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="px-1 text-xs font-bold text-slate-700">Şifre Tekrar</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-5 text-[13px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all shadow-sm"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          {password && passwordConfirm && password !== passwordConfirm && (
            <p className="px-1 text-[11px] font-bold text-red-500 mt-0.5">Şifreler eşleşmiyor</p>
          )}
        </div>

        <div className="flex items-center justify-between px-1 mt-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 transition-colors">
            <input
              type="checkbox"
              className="size-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500/20 cursor-pointer"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <span>Okudum, onaylıyorum</span>
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
          className="mt-4 w-full h-12 rounded-full bg-[#FA8B00] text-[15px] font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-[#E67E00] transition-all disabled:opacity-70 active:scale-[0.98]"
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
    </div>
  )
}
