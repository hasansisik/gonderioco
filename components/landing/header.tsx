import Link from "next/link"
import { ChevronDown, Globe, User } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#FA8B00] text-white">
      <div className="flex h-24 w-full items-center justify-between px-6 lg:px-12 xl:px-20">
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-10 xl:gap-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Gönderio"
              className="h-14 w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[13px] font-semibold">
            <Link href="#hizmetlerimiz" className="flex items-center gap-1 whitespace-nowrap hover:text-white/80 transition-colors">
              Hizmetlerimiz <ChevronDown className="h-3 w-3" />
            </Link>
            <Link href="#nasil-calisir" className="flex items-center gap-1 whitespace-nowrap hover:text-white/80 transition-colors">
              Nasıl Çalışır? <ChevronDown className="h-3 w-3" />
            </Link>
            <Link href="#uluslararasi" className="flex items-center gap-1 whitespace-nowrap hover:text-white/80 transition-colors">
              Uluslararası Taşımacılık <ChevronDown className="h-3 w-3" />
            </Link>
            <Link href="#is-birlikleri" className="whitespace-nowrap hover:text-white/80 transition-colors">
              İş Birlikleri
            </Link>
            <Link href="#sss" className="whitespace-nowrap hover:text-white/80 transition-colors">
              Sıkça Sorulan Sorular
            </Link>
            <Link href="#cozum-merkezi" className="whitespace-nowrap hover:text-white/80 transition-colors">
              Çözüm Merkezi
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-[13px] font-semibold">
          <Link href="#diger-urunler" className="flex items-center gap-1 whitespace-nowrap hover:text-white/80 transition-colors">
            Diğer Ürünlerimiz <ChevronDown className="h-3 w-3" />
          </Link>
          
          <Link
            href="/giris"
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#FA8B00] hover:bg-slate-50 transition-colors"
          >
            <User className="h-4 w-4" />
            Giriş Yap / Kayıt Ol
          </Link>
          
          <button className="flex items-center gap-1 hover:text-white/80 transition-colors">
            <Globe className="h-4 w-4" /> TR <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </header>
  )
}
