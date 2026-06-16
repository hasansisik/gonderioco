"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { login, customerLogin } from "@/redux/actions/userActions"
import { getPublicSettings } from "@/redux/actions/settingsActions"
import { Eye, EyeOff } from "lucide-react"

import { AuthInput } from "./auth/auth-input"
import { AuthButton } from "./auth/auth-button"
import { AuthToggle } from "./auth/auth-toggle"

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
          src={loginLogo}
          alt="gonderio.co"
          className="h-10 w-auto object-contain"
        />
      </div>

      <AuthToggle activeTab="login" />

      <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit} {...props}>
        {error && typeof error === 'string' && (
          <div className="rounded-xl bg-red-50 p-4 text-center text-xs font-medium text-red-500">
            {error}
          </div>
        )}

        <AuthInput
          id="email"
          type="email"
          required
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          placeholder="E-posta adresinizi girin"
        />

        <AuthInput
          id="password"
          type={showPassword ? "text" : "password"}
          required
          label="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder="••••••••"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          }
        />

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

        <AuthButton loading={loading} loadingText="Giriş yapılıyor..." type="submit">
          Giriş yap!
        </AuthButton>
      </form>

      <div className="text-sm font-medium text-slate-600">
        Henüz hesabın yok mu?{" "}
        <Link href="/kayitol" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
          Kayıt Ol!
        </Link>
      </div>
    </div>
  )
}
