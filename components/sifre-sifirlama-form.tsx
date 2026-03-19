"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { resetPassword } from "@/redux/actions/userActions"
import { getPublicSettings } from "@/redux/actions/settingsActions"
import { Eye, EyeOff } from "lucide-react"

export function SifreSifirlamaForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { loading, error, message } = useAppSelector((state) => state.user)

  const [email, setEmail] = useState("")
  const [passwordToken, setPasswordToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    dispatch(getPublicSettings())
  }, [dispatch])

  const { settings } = useAppSelector((state) => state.settings)
  const loginLogo = settings?.logos?.login || "/logo.png"

  useEffect(() => {
    const emailParam = searchParams.get("email")
    const tokenParam = searchParams.get("token")
    if (emailParam) setEmail(emailParam)
    if (tokenParam) setPasswordToken(tokenParam)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      return
    }

    if (!email || !passwordToken) {
      return
    }

    const result = await dispatch(resetPassword({
      email,
      passwordToken: passwordToken,
      newPassword
    }))

    if (resetPassword.fulfilled.match(result)) {
      setTimeout(() => {
        router.push("/giris")
      }, 2000)
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-10", className)} {...props}>
      {/* Logo */}
      <div className="flex flex-col items-center gap-2">
        <img
          src="/logo.png"
          alt="sadeceteklif.com"
          className="h-10 w-auto object-contain"
        />
      </div>

      <div className="text-center flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800">Yeni Şifre Belirle</h2>
        <p className="text-sm text-slate-500">
          Güçlü bir şifre seçerek hesabınızı güvene alın
        </p>
      </div>

      <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit}>
        {error && typeof error === 'string' && (
          <div className="rounded-xl bg-red-50 p-4 text-center text-xs font-medium text-red-500">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-xl bg-green-50 p-4 text-center text-xs font-medium text-green-600">
            {message}
          </div>
        )}

        {/* Email Hidden or Input */}
        {!searchParams.get("email") && (
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="px-1 text-xs font-bold text-slate-800">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all"
              placeholder="E-posta adresinizi girin"
            />
          </div>
        )}

        {/* Token Hidden or Input */}
        {!searchParams.get("token") && (
          <div className="flex flex-col gap-2">
            <label htmlFor="token" className="px-1 text-xs font-bold text-slate-800">Doğrulama Kodu</label>
            <input
              id="token"
              type="text"
              required
              value={passwordToken}
              onChange={(e) => setPasswordToken(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all"
              placeholder="E-postanıza gelen kod"
            />
          </div>
        )}

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="px-1 text-xs font-bold text-slate-800">Yeni Şifre</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all"
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

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="px-1 text-xs font-bold text-slate-800">Yeni Şifre Tekrar</label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all"
            placeholder="••••••••"
          />
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="px-1 text-xs font-medium text-red-500 mt-1">Şifreler eşleşmiyor</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || (newPassword !== confirmPassword && confirmPassword !== "")}
          className="mt-2 w-full rounded-full bg-[#FA8B00] py-4 text-[15px] font-bold text-white shadow-xl shadow-orange-500/20 hover:bg-[#E67E00] transition-all disabled:opacity-70"
        >
          {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>
      </form>

      <div className="text-sm font-medium text-slate-600">
        <Link href="/giris" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
          ← Giriş sayfasına dön
        </Link>
      </div>
    </div>
  )
}
