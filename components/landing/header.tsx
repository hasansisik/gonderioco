"use client"

import Link from "next/link"
import { ChevronDown, Globe, ArrowUpRight } from "lucide-react"
import { useState, useEffect } from "react"

interface HeaderProps {
  theme?: "orange" | "light"
}

export function Header({ theme = "orange" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    // Check initial scroll position
    handleScroll()
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-lg shadow-sm text-slate-900" 
          : theme === "light" 
            ? "bg-transparent text-slate-900" 
            : "bg-[#FA8B00] text-white"
      }`}
    >
      <div className="relative flex h-24 w-full items-center justify-between px-6 lg:px-12 xl:px-20">
        {/* Left Side: Navigation */}
        <div className="flex flex-1 items-center justify-start">
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[13px] font-semibold">
            <Link href="#hizmetlerimiz" className={`flex items-center gap-1 whitespace-nowrap transition-colors ${isScrolled || theme === "light" ? "hover:text-black/70" : "hover:text-white/80"}`}>
              Hizmetlerimiz <ChevronDown className="h-3 w-3" />
            </Link>
            <Link href="#nasil-calisir" className={`flex items-center gap-1 whitespace-nowrap transition-colors ${isScrolled || theme === "light" ? "hover:text-black/70" : "hover:text-white/80"}`}>
              Nasıl Çalışır? <ChevronDown className="h-3 w-3" />
            </Link>
            <Link href="#sss" className={`whitespace-nowrap transition-colors ${isScrolled || theme === "light" ? "hover:text-black/70" : "hover:text-white/80"}`}>
              Sıkça Sorulan Sorular
            </Link>
          </nav>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Gönderio"
              className={`h-14 w-auto object-contain transition-all duration-300 ${isScrolled || theme === "light" ? "brightness-0" : "brightness-0 invert"}`}
            />
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex flex-1 items-center justify-end">
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-[13px] font-semibold">
          <Link href="#diger-urunler" className={`flex items-center gap-1 whitespace-nowrap transition-colors ${isScrolled || theme === "light" ? "hover:text-black/70" : "hover:text-white/80"}`}>
            Diğer Ürünlerimiz <ChevronDown className="h-3 w-3" />
          </Link>
          
          <Link
            href="/giris"
            className="flex items-center gap-3 rounded-full bg-[#1A1A1A] py-1.5 pl-5 pr-1.5 text-sm font-medium text-white transition-all hover:scale-105"
          >
            Giriş Yap / Kayıt Ol
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FA8B00]">
              <ArrowUpRight className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
          </Link>
          
            <button className={`flex items-center gap-1 transition-colors ${isScrolled || theme === "light" ? "hover:text-black/70" : "hover:text-white/80"}`}>
              <Globe className="h-4 w-4" /> TR <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
