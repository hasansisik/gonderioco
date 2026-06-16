import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowUpRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header theme="light" />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          {/* 404 Badge */}
          <div className="inline-flex items-center justify-center text-[#FA8B00] mb-6">
            <span className="text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter drop-shadow-sm">404</span>
          </div>

          <h1 className="text-xl md:text-2xl lg:text-3xl text-slate-900 mb-6 tracking-tight leading-tight">
            <span className="font-light">Aradığınız sayfa </span>
            <span className="font-extrabold italic text-[#FA8B00]">bulunamadı.</span>
          </h1>
          
          <p className="text-slate-500 font-light text-xs md:text-sm max-w-lg mx-auto leading-relaxed mb-12">
            Hatalı bir bağlantıya tıklamış veya adresi yanlış yazmış olabilirsiniz. Gönderio'nun akıllı dünyasına geri dönerek işlemlerinize devam edebilirsiniz.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full bg-[#1A1A1A] py-2 pl-6 pr-2 text-sm md:text-[15px] font-medium text-white transition-all hover:scale-105"
          >
            Ana Sayfaya Dön
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FA8B00]">
              <ArrowUpRight className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
