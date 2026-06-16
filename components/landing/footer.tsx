import Link from "next/link"
import { MapPin, Phone, MessageSquare, Twitter, Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  return (
    <>
      {/* Call to Action Banner */}
      <section className="bg-[#E67E00] py-16 text-center text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <p className="mb-6 text-sm font-medium">Ana Sayfa</p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            İlk gönderinizi beraber gerçekleştirelim.
          </h2>
          <p className="mb-10 text-lg font-medium text-white/90">
            7/24 destek, online ödeme, yük takip
          </p>
          <Link
            href="/kayitol"
            className="inline-block rounded-lg bg-[#0B0F19] px-10 py-4 text-[15px] font-bold text-white hover:bg-black transition-colors"
          >
            Hemen Teklif Al
          </Link>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-[#0B0F19] pt-16 pb-8 text-sm text-[#8F9BB3]">
        <div className="container mx-auto max-w-7xl px-4">
          
          {/* Top Section */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 border-b border-white/10 pb-12">
            {/* Logo */}
            <div>
              <img
                src="/logo.png"
                alt="Gönderio"
                className="mb-6 h-12 w-auto object-contain brightness-0 invert"
              />
            </div>

            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <Link href="#" className="hover:text-white transition-colors">Hakkımızda</Link>
              <Link href="#" className="hover:text-white transition-colors">Kampanyalar</Link>
              <Link href="#" className="hover:text-white transition-colors">Kariyer</Link>
              <Link href="#" className="hover:text-white transition-colors">Basında Biz</Link>
              <Link href="#" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</Link>
              <Link href="#" className="hover:text-white transition-colors">Blog</Link>
            </div>

            {/* Column 2: Sözleşmeler */}
            <div>
              <h3 className="mb-4 font-semibold text-white">Sözleşmeler</h3>
              <div className="flex flex-col gap-3 mb-8">
                <Link href="#" className="hover:text-white transition-colors">Kişisel Verilerin Korunması</Link>
                <Link href="#" className="hover:text-white transition-colors">Ticari Elektronik İleti Onay Metni</Link>
                <Link href="#" className="hover:text-white transition-colors">Kullanıcı Sözleşmesi</Link>
                <Link href="#" className="hover:text-white transition-colors">Taşıma Belgesi</Link>
                <Link href="#" className="hover:text-white transition-colors">IATA Sertifikası</Link>
                <Link href="#" className="hover:text-white transition-colors">ISO 27001</Link>
                <Link href="#" className="hover:text-white transition-colors">ISO 45001</Link>
                <Link href="#" className="hover:text-white transition-colors">ISO 9001</Link>
                <Link href="#" className="hover:text-white transition-colors">Politikalarımız</Link>
              </div>
              
              <h3 className="mb-2 font-semibold text-white">Kargo Anlaşma Numaraları</h3>
              <p>PTT Kargo: 404263491</p>
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
                className="inline-flex items-center gap-2 rounded border border-pink-500/50 bg-transparent px-4 py-2 text-pink-400 hover:bg-pink-500/10 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Çözüm Merkezimize Yazın
              </Link>
            </div>
          </div>

          {/* Middle Section: Partners & Social */}
          <div className="flex flex-col lg:flex-row items-center justify-between border-b border-white/10 py-8 gap-6">
            <div className="flex items-center gap-6">
              <span className="font-semibold text-white text-xs">Destekçiler</span>
              {/* Placeholders for logos */}
              <div className="flex items-center gap-4 text-xs font-bold text-white/40">
                <span>WCA</span>
                <span>IATA</span>
                <span>JCtrans</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-white">
              <Link href="#" className="hover:text-[#FA8B00] transition-colors"><Twitter className="h-4 w-4" /></Link>
              <Link href="#" className="hover:text-[#FA8B00] transition-colors"><Facebook className="h-4 w-4" /></Link>
              <Link href="#" className="hover:text-[#FA8B00] transition-colors"><Instagram className="h-4 w-4" /></Link>
              <Link href="#" className="hover:text-[#FA8B00] transition-colors"><Linkedin className="h-4 w-4" /></Link>
              <Link href="#" className="hover:text-[#FA8B00] transition-colors"><Youtube className="h-4 w-4" /></Link>
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
              <Link href="#" className="hover:text-white transition-colors">Yurt İçi Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">Uluslararası Ticari Yük Taşımacılığı</Link>
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
              <Link href="#" className="hover:text-white transition-colors">PTT Yurt Dışı Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">DHL Yurt Dışı Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">FedEx Yurt Dışı Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">TNT Yurt Dışı Kargo</Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-white mb-2">Uluslararası Taşımacılık</h4>
              <Link href="#" className="hover:text-white transition-colors">Uluslararası Karayolu Taşımacılığı</Link>
              <Link href="#" className="hover:text-white transition-colors">Uluslararası Havayolu Taşımacılığı</Link>
              <Link href="#" className="hover:text-white transition-colors">Uluslararası Denizyolu Taşımacılığı</Link>
              <Link href="#" className="hover:text-white transition-colors">Intermodal Taşımacılık</Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-white mb-2">Ülkelere Göre Kargo Servislerimiz</h4>
              <Link href="#" className="hover:text-white transition-colors">Amerika Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">Rusya Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">İngiltere Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">Almanya Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">Kanada Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">Çin Kargo</Link>
              <Link href="#" className="hover:text-white transition-colors">Dubai Kargo</Link>
            </div>
          </div>
          
        </div>
      </footer>
    </>
  )
}
