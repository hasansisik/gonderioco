import { SifremiUnuttumForm } from "@/components/sifremi-unuttum-form"

export default function SifremiUnuttumPage() {
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

      {/* Right Side: Form */}
      <div className="flex flex-col items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-[420px]">
          <SifremiUnuttumForm />
        </div>
      </div>
    </div>
  )
}
