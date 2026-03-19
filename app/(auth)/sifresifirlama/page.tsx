import { SifreSifirlamaForm } from "@/components/sifre-sifirlama-form"
import { Suspense } from "react"

export default function SifreSifirlamaPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 overflow-hidden font-sans">
      {/* Left Side: Gradient Background with Logo and Slogan */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-[#FA8B00] via-[#C61E63] to-[#7D1E63] p-12 text-white overflow-hidden">

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <img
            src="/logo.png"
            alt="sadeceteklif.com"
            className="h-24 w-auto object-contain brightness-0 invert"
          />
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex flex-col items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-[420px]">
          <Suspense fallback={<div className="flex items-center justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
            <SifreSifirlamaForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
