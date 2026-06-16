export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string for the article body
  coverImage: string;
  author: Author;
  readTime: string; // e.g., "5 dk okuma"
  views: number;
  tags: string[];
  publishedAt: string;
}

export const blogs: Blog[] = [
  {
    id: "1",
    slug: "e-ihracatta-gumruk-surecleri-ve-etgb-nedir",
    title: "E-İhracatta Gümrük Süreçleri ve ETGB Hakkında Bilmeniz Gereken Her Şey",
    excerpt: "Mikro ihracat yaparken gümrük süreçlerinde takılmamak ve masrafları minimize etmek için ETGB sisteminin nasıl çalıştığını, kimlerin faydalanabileceğini inceliyoruz.",
    content: `
      <p class="mb-4 text-lg text-slate-600 leading-relaxed">E-ihracatın en karmaşık görünen ama aslında bir kez anlaşıldığında oldukça basit olan adımı gümrük işlemleridir. Özelikle mikro ihracat yapan KOBİ'ler için geliştirilmiş ETGB sistemi sayesinde, gümrük müşaviri tutmadan yurt dışına satış yapmak mümkündür.</p>
      
      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">ETGB Nedir?</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">ETGB (Elektronik Ticaret Gümrük Beyannamesi), ağırlığı 300 kg'ı ve değeri 15.000 Euro'yu geçmeyen bedelli ihracat gönderileri için düzenlenen elektronik bir belgedir.</p>
      
      <blockquote class="border-l-4 border-[#FA8B00] pl-6 my-8 italic text-slate-700 bg-slate-50 p-6 rounded-r-xl">
        "ETGB sistemi sadece gümrük müşavirliği maliyetini sıfırlamakla kalmaz, aynı zamanda beyanname onay süreçlerini saatlere hatta dakikalara indirir."
      </blockquote>
      
      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Kimler ETGB ile Gönderim Yapabilir?</h3>
      <ul class="list-disc pl-5 mb-4 text-slate-600 space-y-2">
        <li>Vergi mükellefiyeti olan şirketler (Şahıs, Limited, Anonim)</li>
        <li>KDV iadesi almak isteyen e-ihracatçılar</li>
        <li>Yurt dışına numune veya ticari mal gönderen girişimciler</li>
      </ul>
      
      <p class="mb-4 text-slate-600 leading-relaxed">Gönderio paneli üzerinden entegrasyon sağladığınızda, sistem siparişinize ait e-faturayı otomatik olarak okur ve ETGB beyannamesinin arka planda yetkili taşıyıcı tarafından düzenlenmesini sağlar.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Ayşe Yılmaz",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      role: "Gümrük ve Operasyon Müdürü"
    },
    readTime: "4 dk okuma",
    views: 12450,
    tags: ["Gümrük", "Mikro İhracat", "ETGB"],
    publishedAt: "12 Haziran 2026"
  },
  {
    id: "2",
    slug: "amazon-etsy-shopify-entegrasyonlari-ile-zaman-kazanin",
    title: "Amazon, Etsy ve Shopify Entegrasyonları ile Sipariş Yönetimini Otomatize Edin",
    excerpt: "Birden fazla pazar yerinde satış yapıyorsanız, her platformun kargo etiketini ayrı ayrı kesmek yerine tek bir akıllı ekranda tüm siparişleri nasıl yöneteceğinizi keşfedin.",
    content: `
      <p class="mb-4 text-lg text-slate-600 leading-relaxed">Global e-ticaret satıcılarının en büyük zaman kaybı, farklı pazar yerlerindeki satıcı panelleri arasında geçiş yapmaktır. Sipariş bilgisini al, kargo şirketinin paneline gir, adresi kopyala, etiketi bas... Bu süreç hata yapmaya çok müsaittir.</p>
      
      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Tam Otomasyonun Gücü</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Gelişmiş bir lojistik yönetim paneli kullandığınızda mağazalarınızı API ile saniyeler içinde bağlayabilirsiniz. Shopify mağazanıza bir sipariş düştüğünde, sistem otomatik olarak müşteri adresini ve ürün ağırlığını çeker.</p>
      
      <div class="my-8 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop" alt="Dashboard Graph" class="w-full h-auto object-cover aspect-video" />
      </div>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Takip Numaralarının İletilmesi</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Gönderi etiketi oluşturulduğu anda çıkan takip numarası (tracking number), satıcının manuel işlem yapmasına gerek kalmadan otomatik olarak Etsy veya Amazon sistemine iletilir ve sipariş durumu "Kargolandı" olarak güncellenir.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Caner Demir",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop",
      role: "Ürün Geliştirme Lideri"
    },
    readTime: "6 dk okuma",
    views: 8920,
    tags: ["Entegrasyon", "Amazon", "Shopify", "Etsy"],
    publishedAt: "05 Haziran 2026"
  },
  {
    id: "3",
    slug: "yurt-disi-kargo-fiyatlari-nasil-hesaplanir-desi-ve-agirlik-farki",
    title: "Yurt Dışı Kargo Fiyatları Nasıl Hesaplanır? Gerçek Ağırlık vs. Hacimsel Ağırlık",
    excerpt: "Uçak kargo taşımacılığında en çok karıştırılan konulardan biri olan desi hesabını, gizli maliyetleri ve kargo bütçenizi nasıl optimize edebileceğinizi anlatıyoruz.",
    content: `
      <p class="mb-4 text-lg text-slate-600 leading-relaxed">Birçok yeni e-ihracatçı, ürünün sadece terazideki ağırlığına bakarak kargo maliyeti hesaplama hatasına düşer. Ancak uluslararası hava taşımacılığında "Hacimsel Ağırlık" (Volumetric Weight) kavramı hayati önem taşır.</p>
      
      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Desi Formülü Nedir?</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Uluslararası standartlarda desi (hacimsel ağırlık) hesaplama formülü genellikle şöyledir:<br/> <strong>En(cm) x Boy(cm) x Yükseklik(cm) / 5000</strong></p>
      
      <p class="mb-4 text-slate-600 leading-relaxed">Taşıyıcı firma (Örn: FedEx, UPS), terazideki gerçek ağırlık ile formülden çıkan desi değerini karşılaştırır ve hangisi daha yüksekse faturayı o değer üzerinden keser.</p>

      <blockquote class="border-l-4 border-blue-500 pl-6 my-8 italic text-slate-700 bg-blue-50 p-6 rounded-r-xl">
        Örnek: 2 kg ağırlığında ama 40x40x40 cm ebatlarında (12.8 desi) devasa bir kutu gönderiyorsanız, kargo şirketine 2 kg değil, 13 kg (yuvarlama ile) parası ödersiniz.
      </blockquote>
      
      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Paketleme Optimizasyonu</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Kâr marjınızı artırmanın en etkili yolu kutu ebatlarını optimize etmektir. Ürününüzü koruyacak en küçük kutuyu seçmek, içindeki boşlukları gereksiz büyük bırakmamak binlerce dolar tasarruf etmenizi sağlayabilir.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Elif Kaya",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
      role: "Lojistik Çözümleri Uzmanı"
    },
    readTime: "5 dk okuma",
    views: 15300,
    tags: ["Lojistik", "Optimizasyon", "Fiyatlandırma"],
    publishedAt: "28 Mayıs 2026"
  },
  {
    id: "4",
    slug: "basari-hikayesi-gonderio-ile-avrupa-pazarina-acilan-takici",
    title: "Başarı Hikayesi: Gönderio ile 3 Ayda Avrupa Pazarına Açılan Takı Markası",
    excerpt: "Instagram üzerinden satış yaparken sadece Türkiye ile sınırlı kalan bir markanın, doğru lojistik partneri ile Avrupa'da nasıl büyüdüğünün ilham verici hikayesi.",
    content: `
      <p class="mb-4 text-lg text-slate-600 leading-relaxed">El yapımı takılar üreten 'Luna Design', kaliteli ürünlerine rağmen kargo maliyetlerinin belirsizliği yüzünden uzun süre yurt dışından gelen sipariş taleplerini reddetmek zorunda kalmıştı.</p>
      
      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Büyümenin Önündeki Engel</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Marka kurucusu Zeynep Hanım, "Her müşteriye ayrı kargo fiyatı hesaplamak ve ptt sıralarında beklemek işimizin çok vaktini alıyordu." diyor.</p>
      
      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Gönderio Çözümü</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Gönderio altyapısına geçtikten sonra, WooCommerce altyapılı sitelerine entegrasyon sağladılar. Sistem sayesinde müşteriler sepette doğrudan lokasyonlarına göre kargo fiyatını görmeye ve express kargo ile 2 günde ürünlerine ulaşmaya başladı.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Mert Yılmaz",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      role: "Müşteri Başarı Yöneticisi"
    },
    readTime: "3 dk okuma",
    views: 6420,
    tags: ["Başarı Hikayesi", "KOBİ", "E-ihracat"],
    publishedAt: "15 Mayıs 2026"
  }
];
