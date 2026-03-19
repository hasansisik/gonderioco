"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { forgotPassword } from "@/redux/actions/userActions"

import { getPublicSettings } from "@/redux/actions/settingsActions"
import { useEffect } from "react"

export function SifremiUnuttumForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, error, message } = useAppSelector((state) => state.user)
  const { settings } = useAppSelector((state) => state.settings)

  useEffect(() => {
    dispatch(getPublicSettings())
  }, [dispatch])

  const loginLogo = settings?.logos?.login || "/logo.png"

  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(forgotPassword(email))
    if (forgotPassword.fulfilled.match(result)) {
      setTimeout(() => {
        router.push(`/sifresifirlama?email=${encodeURIComponent(email)}`)
      }, 2000)
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-10", className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        <img
          src="/logo.png"
          alt="sadeceteklif.com"
          className="h-10 w-auto object-contain"
        />
      </div>

      <div className="text-center flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800">Şifremi Unuttum</h2>
        <p className="text-sm text-slate-500">
          E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz
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
            className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all"
            placeholder="E-posta adresinizi girin"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full bg-[#FA8B00] py-4 text-[15px] font-bold text-white shadow-xl shadow-orange-500/20 hover:bg-[#E67E00] transition-all disabled:opacity-70"
        >
          {loading ? "Gönderiliyor..." : "Bağlantı Gönder"}
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
