"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MailCheck, Plus } from "lucide-react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { verifyEmail, againEmail } from "@/redux/actions/userActions"
import { cn } from "@/lib/utils"

import { getPublicSettings } from "@/redux/actions/settingsActions"

function DogrulamaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { loading, error, message } = useAppSelector((state) => state.user)
  const { settings } = useAppSelector((state) => state.settings)

  useEffect(() => {
    dispatch(getPublicSettings())
  }, [dispatch])

  const loginLogo = settings?.logos?.login || "/logo.png"

  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [showCodeInput, setShowCodeInput] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
      setShowCodeInput(true)
    }
  }, [searchParams])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !verificationCode) {
      return
    }

    const result = await dispatch(verifyEmail({
      email,
      verificationCode: verificationCode
    }))

    if (verifyEmail.fulfilled.match(result)) {
      router.push("/panel")
    }
  }

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!email) return
    await dispatch(againEmail({ email }))
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2 overflow-hidden font-sans">
      {/* Left Side: Background Image */}
      <div className="relative hidden lg:flex flex-col overflow-hidden">
        <img
          src="/auth.png"
          alt="gonderio.co"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Right Side: Form Content */}
      <div className="flex flex-col items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-[420px] flex flex-col items-center gap-10">

          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <img
              src="/logo.png"
              alt="gonderio.co"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="flex flex-col items-center gap-6 text-center">
            <div className="bg-orange-50 text-orange-600 flex size-20 items-center justify-center rounded-full shadow-inner border border-orange-100">
              <MailCheck className="size-10" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-normal text-slate-800">E-postanızı Doğrulayın</h1>
              <p className="text-sm text-slate-500">
                E-posta adresinize gönderdiğimiz doğrulama kodunu girin
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-6">
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

            {showCodeInput ? (
              <form onSubmit={handleVerify} className="flex flex-col gap-6 w-full">
                {!searchParams.get("email") && (
                  <div className="flex flex-col gap-2">
                    <label className="px-1 text-xs font-normal text-slate-800">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      placeholder="E-posta adresinizi girin"
                      className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="px-1 text-xs font-normal text-slate-800">Doğrulama Kodu</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    disabled={loading}
                    placeholder=""
                    className="w-full rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-center text-2xl font-semibold tracking-[1em] pl-[1em] text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/10 shadow-sm transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !verificationCode || verificationCode.length !== 4}
                  className="mt-2 w-full rounded-full bg-[#FA8B00] py-4 text-[15px] font-normal text-white shadow-xl shadow-orange-500/20 hover:bg-[#E67E00] transition-all disabled:opacity-70"
                >
                  {loading ? "Doğrulanıyor..." : "Doğrula"}
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-6 w-full">
                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  E-postanızı kontrol edin ve doğrulama kodunu girin. <br />
                  Eğer e-postayı görmediyseniz spam klasörünü kontrol edin.
                </p>
                <button
                  onClick={handleResend}
                  disabled={loading || !email}
                  className="w-full rounded-full border-2 border-slate-100 bg-white py-4 text-[13px] font-normal text-slate-600 hover:bg-slate-50 transition-all"
                >
                  {loading ? "Gönderiliyor..." : "Bağlantıyı Tekrar Gönder"}
                </button>
              </div>
            )}
          </div>

          <div className="text-sm font-medium text-slate-600">
            <Link href="/giris" className="font-normal text-blue-600 hover:text-blue-700 transition-colors">
              ← Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DogrulamaPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <DogrulamaContent />
    </Suspense>
  )
}

