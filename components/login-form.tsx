"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { login, customerLogin } from "@/redux/actions/userActions"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { getPublicSettings } from "@/redux/actions/settingsActions"
import { useEffect } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.user)
  const { settings } = useAppSelector((state) => state.settings)

  useEffect(() => {
    dispatch(getPublicSettings())
  }, [dispatch])

  const loginLogo = settings?.logos?.login || "/logo.png"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Try normal login first
    let result = await dispatch(login({ email, password }))

    // If normal login fails, try customer login
    if (login.rejected.match(result)) {
      // Only try customer login if it's not a 'requiresVerification' error
      if (!result.payload || typeof result.payload !== 'object' || !('requiresVerification' in result.payload)) {
        result = await dispatch(customerLogin({ email, password }))
      }
    }

    if (login.fulfilled.match(result) || customerLogin.fulfilled.match(result)) {
      router.push("/panel")
    } else if (result.payload && typeof result.payload === 'object' && 'requiresVerification' in result.payload) {
      router.push(`/dogrulama?email=${encodeURIComponent(email)}`)
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-10", className)}>
      <div className="flex flex-col items-center gap-2">
        <img
          src="/logo.png"
          alt="sadeceteklif.com"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Auth Toggle */}
      <div className="flex w-full max-w-[320px] rounded-full bg-slate-100 p-1">
        <button
          type="button"
          className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm"
        >
          Giriş yap
        </button>
        <Link
          href="/kayitol"
          className="flex-1 rounded-full px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 text-center flex items-center justify-center"
        >
          Kayıt ol
        </Link>
      </div>

      {/* Form */}
      <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit}>
        {error && typeof error === 'string' && (
          <div className="rounded-xl bg-red-50 p-4 text-center text-xs font-medium text-red-500">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="px-1 text-xs font-bold text-slate-800">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all"
            placeholder="E-posta adresinizi girin"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="px-1 text-xs font-bold text-slate-800">
            Şifre
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all"
              placeholder="••••••••"
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between px-1">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            <input
              type="checkbox"
              className="size-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500/20"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Beni Hatırla
          </label>
          <Link
            href="/sifremiunuttum"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
          >
            Şifremi Unuttum
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-[#FA8B00] py-4 text-[15px] font-bold text-white shadow-xl shadow-orange-500/20 hover:bg-[#E67E00] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Giriş yapılıyor...
            </>
          ) : (
            "Giriş yap!"
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="text-sm font-medium text-slate-600">
        Henüz hesabın yok mu?{" "}
        <Link href="/kayitol" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
          Kayıt Ol!
        </Link>
      </div>
    </div>
  )
}
