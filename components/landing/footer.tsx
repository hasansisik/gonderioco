import Link from "next/link"
import { MapPin, Phone, MessageSquare, Twitter, Facebook, Instagram, Linkedin, Youtube, ArrowUpRight } from "lucide-react"

export function Footer() {
  return (
    <>
      {/* Call to Action Banner */}
      <section className="relative flex min-h-[500px] flex-col justify-center overflow-hidden bg-[#FA8B00] py-32 lg:py-48 text-center text-white">
        {/* Smooth Transition from Previous Section */}
        <div className="absolute top-0 left-0 h-[60%] w-full bg-gradient-to-b from-white to-transparent pointer-events-none"></div>

        <div className="container relative z-10 mx-auto max-w-4xl px-4">
          <p className="mb-6 text-sm font-medium">Ana Sayfa</p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            İlk gönderinizi beraber gerçekleştirelim.
          </h2>
          <p className="mb-10 text-lg font-medium text-white/90">
            7/24 destek, online ödeme, yük takip
          </p>
          <Link
            href="/kayitol"
            className="inline-flex items-center gap-4 rounded-full bg-[#1A1A1A] py-2 pl-6 pr-2 text-[15px] font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Hemen Teklif Al
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FA8B00] text-white">
              <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
            </div>
          </Link>
        </div>

        {/* Smooth Transition to Footer */}
        <div className="absolute bottom-0 left-0 h-[60%] w-full bg-gradient-to-t from-[#0B0F19] to-transparent pointer-events-none"></div>
      </section>

      {/* Main Footer */}
      <footer className="bg-[#0B0F19] pt-16 pb-8 text-sm text-[#8F9BB3]">
        <div className="container mx-auto max-w-7xl px-4">
          
          {/* Top Section */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 border-b border-white/10 pb-12">
            {/* Logo and Description */}
            <div className="flex flex-col pr-8">
              <img
                src="/logo.png"
                alt="Gönderio"
                className="mb-6 h-12 w-auto object-contain brightness-0 invert"
              />
              <p className="text-sm text-[#8F9BB3] mb-8 leading-relaxed">
                Gönderio, e-ihracat süreçlerinizi dijitalleştiren ve uluslararası kargo gönderimlerinizi tek panelden yönetmenizi sağlayan yeni nesil lojistik platformudur.
              </p>
              <div className="flex items-center gap-4 text-white">
                <Link href="#" className="hover:text-[#FA8B00] transition-colors"><Twitter className="h-4 w-4" /></Link>
                <Link href="#" className="hover:text-[#FA8B00] transition-colors"><Facebook className="h-4 w-4" /></Link>
                <Link href="#" className="hover:text-[#FA8B00] transition-colors"><Instagram className="h-4 w-4" /></Link>
                <Link href="#" className="hover:text-[#FA8B00] transition-colors"><Linkedin className="h-4 w-4" /></Link>
                <Link href="#" className="hover:text-[#FA8B00] transition-colors"><Youtube className="h-4 w-4" /></Link>
              </div>
            </div>

            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <Link href="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link>
              <Link href="/nasil-calisir" className="hover:text-white transition-colors">Nasıl Çalışır?</Link>
              <Link href="/sss" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            </div>

            {/* Column 2: Sözleşmeler */}
            <div>
              <h3 className="mb-4 font-semibold text-white">Sözleşmeler</h3>
              <div className="flex flex-col gap-3 mb-8">
                <Link href="/sozlesmeler/kisisel-verilerin-korunmasi" className="hover:text-white transition-colors">Kişisel Verilerin Korunması</Link>
                <Link href="/sozlesmeler/ticari-elektronik-ileti-onay-metni" className="hover:text-white transition-colors">Ticari Elektronik İleti Onay Metni</Link>
                <Link href="/sozlesmeler/kullanici-sozlesmesi" className="hover:text-white transition-colors">Kullanıcı Sözleşmesi</Link>
                <Link href="/sozlesmeler/politikalarimiz" className="hover:text-white transition-colors">Politikalarımız</Link>
              </div>
            </div>

            {/* Column 3: İletişim */}
            <div>
              <h3 className="mb-4 font-semibold text-white">İletişim</h3>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-white/50" />
                <p>15 Temmuz Mahallesi Gülbahar Caddesi, 1500 Sokak No:16 Güneşli-Bağcılar/İstanbul</p>
              </div>
              <div className="flex items-center gap-3 mb-8">
                <Phone className="h-5 w-5 shrink-0 text-white/50" />
                <p>0850 532 79 49</p>
              </div>

              <h3 className="mb-3 text-white">Yardıma ihtiyacınız mı var?</h3>
              <Link
                href="#cozum-merkezi"
                className="inline-flex items-center gap-2 rounded border border-[#FA8B00]/50 bg-transparent px-4 py-2 text-[#FA8B00] hover:bg-[#FA8B00]/10 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Çözüm Merkezimize Yazın
              </Link>
            </div>
          </div>



          <div className="py-6 text-center text-xs">
            © {new Date().getFullYear()} Gönderio Lojistik ve Teknoloji Anonim Şirketi. Tüm Hakları Saklıdır.
          </div>

          {/* Bottom Link Columns */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 pt-8 text-xs border-t border-white/10">
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-white mb-2">Hizmetlerimiz</h4>
              <Link href="#" className="hover:text-white transition-colors">Yurt Dışı Kargo</Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-white mb-2">Pazaryeri Kargo Servislerimiz</h4>
              <Link href="#" className="hover:text-white transition-colors">Etsy Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">Amazon Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">eBay Kargo</Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-white mb-2">Anlaşmalı Kargo Servislerimiz</h4>
              <Link href="#" className="hover:text-white transition-colors">UPS Yurt Dışı Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">DHL Yurt Dışı Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">FedEx Yurt Dışı Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">TNT Yurt Dışı Kargo</Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-white mb-2">Uluslararası Taşımacılık</h4>
              <Link href="#" className="hover:text-white transition-colors">Uluslararası Karayolu Taşımacılığı</Link>
              <Link href="#" className="hover:text-white transition-colors">Uluslararası Havayolu Taşımacılığı</Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-white mb-2">Ülkelere Göre Kargo Servislerimiz</h4>
              <Link href="#" className="hover:text-white transition-colors">Amerika Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">İngiltere Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">Almanya Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">Kanada Kargo</Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-white mb-2">Diğer Ürünlerimiz</h4>
              <div className="flex items-center gap-2">
                <Link href="#" className="hover:text-white transition-colors">Türkiye'den Getir</Link>
                <span className="bg-[#FA8B00]/20 text-[#FA8B00] text-[10px] font-bold px-2 py-0.5 rounded-full">Yakında</span>
              </div>
            </div>
          </div>
          
        </div>
      </footer>
    </>
  )
}
