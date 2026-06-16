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
  content: string;
  coverImage: string;
  author: Author;
  readTime: string;
  views: number;
  tags: string[];
  publishedAt: string;
}

export const blogs: Blog[] = [
  {
    id: "1",
    slug: "amazon-fba-ve-fbm-arasindaki-kargo-farklari",
    title: "Amazon FBA ve FBM: Hangi Kargo Yöntemi Sizin İçin Daha Uygun?",
    excerpt: "Amazon'da satış yaparken Fulfillment by Amazon (FBA) ve Fulfillment by Merchant (FBM) arasındaki lojistik farklarını, maliyetleri ve stratejileri derinlemesine inceliyoruz.",
    content: `
      <p class="mb-4 text-slate-600 leading-relaxed">Amazon pazar yerinde satış yapan bir e-ihracatçı olarak vereceğiniz en büyük karar, ürünlerinizin müşteriye nasıl ulaştırılacağıdır. Dünyanın en büyük perakende platformu, satıcılara iki temel seçenek sunar: <strong>FBA (Fulfillment by Amazon)</strong> ve <strong>FBM (Fulfillment by Merchant)</strong>.</p>
      
      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Amazon FBA Nedir ve Nasıl Çalışır?</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">FBA modelinde, ürünlerinizi toplu olarak Amazon'un depolarına gönderirsiniz. Bir müşteri sipariş verdiğinde, ürünün paketlenmesi, kargolanması ve hatta iade süreçleri tamamen Amazon tarafından yönetilir.</p>
      <ul class="list-disc pl-5 mb-4 text-slate-600 space-y-2">
        <li><strong>Avantajları:</strong> Ürünleriniz "Prime" etiketine sahip olur. Bu, Amazon algoritmalarında sizi öne çıkarır ve dönüşüm oranlarınızı ciddi şekilde artırır. Müşteri hizmetleri ile uğraşmazsınız.</li>
        <li><strong>Dezavantajları:</strong> Depolama ücretleri, özellikle yavaş satan veya hacimli ürünler için kâr marjınızı ciddi şekilde eritebilir. Envanter yönetimi konusunda Amazon kurallarına katı bir şekilde uymanız gerekir.</li>
      </ul>

      <blockquote class="border-l-4 border-[#FA8B00] pl-6 my-8 italic text-slate-700 bg-slate-50 p-6 rounded-r-xl">
        "Eğer yüksek hacimli, hızlı satan ve küçük boyutlu ürünler satıyorsanız, FBA'in Prime avantajı ve operasyonel kolaylığı vazgeçilmezdir."
      </blockquote>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Amazon FBM: Kontrol Sizde</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">FBM modelinde satıcı, sipariş edilen ürünü kendi deposundan doğrudan son tüketiciye ulaştırmakla yükümlüdür. Gönderio gibi bir lojistik partneri ile çalışarak Türkiye'deki deponuzdan Amerika'daki müşterinize express kargo çıkarabilirsiniz.</p>
      
      <p class="mb-4 text-slate-600 leading-relaxed">Özellikle el yapımı, kişiselleştirilebilir (Custom) ürünler üretiyorsanız veya ürününüz çok hacimliyse (mobilya, büyük tablolar vb.) FBM tartışmasız en kârlı yöntemdir. Depolama maliyetlerini sıfıra indirir, Amazon'a ödeyeceğiniz yüksek FBA ücretlerinden kurtulursunuz.</p>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Sonuç: Hangisini Seçmeli?</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Birçok başarılı marka "Hibrit Model" kullanır. Standart, hızlı satan ürünler için FBA kullanılırken; özelleştirilebilir, yeni test edilen veya çok hacimli ürünler için FBM tercih edilir. Gönderio'nun Amazon entegrasyonu sayesinde, FBM siparişleriniz düştüğü anda kargo etiketleriniz otomatik basılır ve süreç FBA kadar pürüzsüz hale gelir.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=1200&auto=format&fit=crop",
    author: { name: "Gönderio", avatar: "/icon.png", role: "E-İhracat Blogu" },
    readTime: "7 dk okuma",
    views: 18450,
    tags: ["Amazon", "FBA", "FBM", "E-ihracat"],
    publishedAt: "10 Haziran 2026"
  },
  {
    id: "2",
    slug: "etsy-saticilari-icin-mikro-ihracat-rehberi",
    title: "Etsy Satıcıları İçin Mikro İhracat ve Kargo Optimizasyon Rehberi",
    excerpt: "El yapımı ve vintage ürünler satan Etsy girişimcileri için Amerika ve Avrupa'ya kargo gönderiminde maliyet düşüren paketleme taktikleri.",
    content: `
      <p class="mb-4 text-slate-600 leading-relaxed">Etsy, Türkiye'deki el emeği üreticilerinin dünyaya açıldığı en önemli kapılardan biridir. Ancak siparişler gelmeye başladığında satıcıların karşılaştığı en büyük engel, ürün maliyetinden daha yüksek çıkabilen kargo fiyatlarıdır.</p>
      
      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Desi (Hacimsel Ağırlık) Tuzağına Düşmeyin</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Etsy satıcılarının %80'i kargo ücretlerini sadece ürünün ağırlığına göre hesaplar. Oysa ki havayolu taşımacılığında kutunun hacmi (En x Boy x Yükseklik / 5000) baz alınır. Örneğin, 100 gramlık gümüş bir kolyeyi şık ama devasa bir hediye kutusuna koyarsanız, kargo firması sizden 1.5 - 2 KG (desi) ücreti talep edebilir.</p>

      <blockquote class="border-l-4 border-[#FA8B00] pl-6 my-8 italic text-slate-700 bg-slate-50 p-6 rounded-r-xl">
        "Paketleme standartlarınızı ürününüzün formuna en uygun ve en küçük kutuyu seçecek şekilde optimize edin. Bu basit adım kargo maliyetlerinizi %40'a kadar düşürebilir."
      </blockquote>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">ETGB İle KDV İadesi Almak</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Şirket sahibi bir Etsy satıcısıysanız, gönderilerinizi mutlaka ETGB (Elektronik Ticaret Gümrük Beyannamesi) kapsamında yapmalısınız. Bu sayede, ürünleri üretirken veya hammadde alırken ödediğiniz KDV'yi devletten iade alabilirsiniz. Gönderio altyapısı bu süreci tamamen dijital ve ücretsiz olarak sizin yerinize yönetir.</p>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Müşteri Deneyimi ve Kargo Hızı</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Etsy müşterileri, siparişlerinin bir hediye niteliğinde olduğunu düşünerek hızlı teslimat beklerler. "Express" gönderi seçeneklerini mağazanıza ekleyip, müşteriye "Ücretsiz Standart" veya "Ücretli Express" seçeneği sunmak, mağaza dönüşüm oranlarınızı ciddi oranda artıracaktır.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop",
    author: { name: "Gönderio", avatar: "/icon.png", role: "E-İhracat Blogu" },
    readTime: "5 dk okuma",
    views: 24100,
    tags: ["Etsy", "Mikro İhracat", "Paketleme"],
    publishedAt: "08 Haziran 2026"
  },
  {
    id: "3",
    slug: "shopify-kargo-entegrasyonu-ve-otomasyonu",
    title: "Shopify Mağazanız İçin Kusursuz Kargo Otomasyonu Nasıl Kurulur?",
    excerpt: "Kendi markanızı yarattığınız Shopify altyapılı e-ihracat mağazanızda sipariş düştüğü andan müşterinin kapısına gidene kadar süreci nasıl otomatikleştirirsiniz?",
    content: `
      <p class="mb-4 text-slate-600 leading-relaxed">Shopify, global e-ticaret markaları yaratmak için eşsiz bir altyapı sunar. Ancak günlük sipariş sayınız 10'un, 50'nin veya 100'ün üzerine çıktığında kargo süreçlerini manuel olarak (adresleri tek tek kopyalayıp taşıyıcı paneline girmek) yönetmek imkansızlaşır.</p>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">API Entegrasyonunun Gücü</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Gönderio'nun Shopify entegrasyonu ile mağazanızı dakikalar içinde sisteme bağlayabilirsiniz. Sistem, yeni siparişleri anlık olarak çeker. Siparişin içeriği, müşteri adresi, posta kodu ve ürün HS (Gümrük Tarife) kodları gibi veriler doğrudan taşıyıcı firmaların anlayacağı dile çevrilir.</p>

      <div class="my-8 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop" alt="Shopify Dashboard" class="w-full h-auto object-cover aspect-video" />
      </div>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Otomatik Barkod ve Takip Kodu Ataması</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Siz sadece Gönderio panelinde "Etiketi Yazdır" butonuna basarsınız. Sistem arka planda uluslararası geçerliliği olan bir kargo barkodu (waybill) oluşturur. Üstelik oluşan bu takip numarası otomatik olarak Shopify panelinize geri gönderilir ve müşterinize "Siparişiniz Kargolandı" e-postası tetiklenir.</p>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Canlı Kargo Fiyatlaması (Live Rates at Checkout)</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Sepet terk edilme oranlarını düşürmenin en iyi yolu, müşteriye sürpriz çıkarmamaktır. Gelişmiş entegrasyonlar sayesinde Shopify ödeme adımında (checkout), müşterinin konumuna ve ürünün ağırlığına göre canlı, gerçek kargo fiyatlarını anlık olarak müşterinize sunabilirsiniz.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
    author: { name: "Gönderio", avatar: "/icon.png", role: "E-İhracat Blogu" },
    readTime: "6 dk okuma",
    views: 15300,
    tags: ["Shopify", "Entegrasyon", "Otomasyon"],
    publishedAt: "05 Haziran 2026"
  },
  {
    id: "4",
    slug: "e-ihracatta-gumruk-surecleri-ve-etgb-nedir",
    title: "E-İhracatta Gümrük Süreçleri ve ETGB Hakkında Bilmeniz Gereken Her Şey",
    excerpt: "Mikro ihracat yaparken gümrük süreçlerinde takılmamak ve masrafları minimize etmek için ETGB sisteminin nasıl çalıştığını, kimlerin faydalanabileceğini inceliyoruz.",
    content: `
      <p class="mb-4 text-slate-600 leading-relaxed">E-ihracatın en karmaşık görünen ama aslında bir kez anlaşıldığında oldukça basit olan adımı gümrük işlemleridir. Özelikle mikro ihracat yapan KOBİ'ler için geliştirilmiş ETGB sistemi sayesinde, gümrük müşaviri tutmadan yurt dışına satış yapmak mümkündür.</p>
      
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
    author: { name: "Gönderio", avatar: "/icon.png", role: "E-İhracat Blogu" },
    readTime: "5 dk okuma",
    views: 12450,
    tags: ["Gümrük", "Mikro İhracat", "ETGB"],
    publishedAt: "01 Haziran 2026"
  },
  {
    id: "5",
    slug: "yurtdisi-iade-yonetimi-ve-maliyet-dusurme",
    title: "Yurt Dışı İadeleri Markanız İçin Bir Kabusa Dönüşmesin",
    excerpt: "E-ihracatta en büyük korkulardan biri iadelerdir. Amerika ve Avrupa'dan dönen kargoların maliyetini düşürme ve imha süreçlerini etkin yönetme rehberi.",
    content: `
      <p class="mb-4 text-slate-600 leading-relaxed">Müşteri memnuniyeti odaklı global pazar yerlerinde (Amazon, Etsy, Zalando vb.) iade hakkı son derece güçlüdür. Satıcılar içinse Türkiye'den 10 dolara gönderilen bir ürünün, Amerika'dan Türkiye'ye geri dönüşü 40-50 dolara mal olabilir.</p>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Tersine Lojistik (Reverse Logistics) Neden Pahalıdır?</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Giden kargolarınızda ihracat teşvikleri ve anlaşmalı kargo indirimleri devrededir. Ancak ürün geri döndüğünde, o ülkenin yerel kargo fiyatları ve Türkiye'ye ithalat gümrük vergileri ile karşılaşırsınız.</p>

      <blockquote class="border-l-4 border-red-500 pl-6 my-8 italic text-slate-700 bg-red-50 p-6 rounded-r-xl">
        "Ucuz maliyetli tekstil veya aksesuar ürünlerinde, iadeyi Türkiye'ye geri getirmektense ürünü yurt dışında bırakmak (veya imha ettirmek) genellikle finansal olarak daha kârlıdır."
      </blockquote>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Konsolidasyon ve Yurt Dışı Ara Depo Çözümleri</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Başarılı e-ihracatçıların sırrı ara depolardır (Fulfillment Centers). İade edilen ürünler Türkiye'ye geri gelmez; Amerika veya Avrupa'daki yerel bir ara depoya gönderilir. Burada kalite kontrolü yapılır ve ürün sağlamsa, o ülkedeki yeni bir siparişe o depodan gönderilir.</p>
      
      <p class="mb-4 text-slate-600 leading-relaxed">Gönderio olarak, global partner ağımız sayesinde müşterilerimize lokal iade adresleri sağlayarak iade maliyetlerini %70'e varan oranlarda düşürebiliyoruz.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=1200&auto=format&fit=crop",
    author: { name: "Gönderio", avatar: "/icon.png", role: "E-İhracat Blogu" },
    readTime: "6 dk okuma",
    views: 9500,
    tags: ["İade Yönetimi", "Lojistik", "Maliyet Hesaplama"],
    publishedAt: "28 Mayıs 2026"
  },
  {
    id: "6",
    slug: "ingiltere-e-ticaret-pazari-ve-kargo-ipuclari",
    title: "Brexit Sonrası İngiltere Pazarına Satış ve Kargo Süreçleri",
    excerpt: "İngiltere (UK) Avrupa'nın en büyük e-ticaret pazarı. Brexit sonrası değişen KDV (VAT) kuralları ve gümrük prosedürlerine uyum sağlayarak satışlarınızı nasıl artırırsınız?",
    content: `
      <p class="mb-4 text-slate-600 leading-relaxed">İngiltere, %82'lik e-ticaret penetrasyonu ile Avrupa'nın tartışmasız en cazip pazarı. Ancak Brexit (İngiltere'nin AB'den ayrılması) sonrasında Birleşik Krallık'a mal göndermek yeni regülasyonlara tabi oldu.</p>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">135 Sterlin Sınırı ve KDV (VAT) Kuralı</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Yeni yasalar gereği, İngiltere'ye gönderilen 135 £ (Sterlin) altındaki B2C (tüketiciye) gönderilerde KDV, ürün gümrükte içeri girerken değil, ürün satılırken (pazar yeri veya web siteniz tarafından) tahsil edilmelidir.</p>
      <ul class="list-disc pl-5 mb-4 text-slate-600 space-y-2">
        <li>Eğer satışı Amazon veya Etsy üzerinden yapıyorsanız, pazar yeri bu KDV'yi tahsil eder ve devlete öder.</li>
        <li>Kendi sitenizden satıyorsanız, İngiltere'de bir VAT numarası almanız ve KDV beyanında bulunmanız gerekebilir.</li>
      </ul>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Gümrük Kodları (HS Code) Kullanımı Zorunluluğu</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">İngiltere gümrüğü dijitalleşmeye devasa yatırımlar yaptı. Artık giden her paketin üzerinde veya dijital faturasında 6 veya 8 haneli uyumlaştırılmış sistem (HS Code) kodlarının bulunması zorunlu. Gönderio sistemi, tanımladığınız ürünlere bu kodları otomatik olarak atayarak kolilerinizin Londra gümrüğünde takılmasını önler.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop",
    author: { name: "Gönderio", avatar: "/icon.png", role: "E-İhracat Blogu" },
    readTime: "5 dk okuma",
    views: 11200,
    tags: ["İngiltere", "Gümrük", "Vergilendirme", "E-ihracat"],
    publishedAt: "25 Mayıs 2026"
  },
  {
    id: "7",
    slug: "amerika-kargo-gonderimi-de-minimis-vergi-muafiyeti",
    title: "Amerika'ya İhracatta Altın Kural: 800 Dolarlık De Minimis Muafiyeti",
    excerpt: "Amerika Birleşik Devletleri e-ticaret için neden dünyadaki en kârlı pazar? 800 USD gümrük muafiyeti kuralını kendi lehinize nasıl çevirirsiniz?",
    content: `
      <p class="mb-4 text-slate-600 leading-relaxed">Dünya üzerindeki hiçbir pazar ABD kadar e-ihracatçı dostu değildir. Bunun en temel sebebi, ABD Gümrük ve Muhafaza Dairesi'nin (CBP) uyguladığı <strong>"Section 321 - De Minimis"</strong> kuralıdır.</p>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">800 USD Altı Gönderilere Sıfır Vergi</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Mevcut yasaya göre, Amerika'daki bir son tüketiciye aynı gün içinde gönderilen 800 USD (yaklaşık) altındaki bedelli ürünler tamamen gümrük vergisinden (Duty) muaf tutulmaktadır. Üstelik bu ürünler çok hızlı bir şekilde, detaylı bir gümrük beyannamesine gerek kalmadan ülkeye giriş yapar.</p>

      <blockquote class="border-l-4 border-blue-500 pl-6 my-8 italic text-slate-700 bg-blue-50 p-6 rounded-r-xl">
        Bunun anlamı şudur: Amerika'daki bir müşterinize 700 dolarlık bir deri ceket veya özel tasarım bir halı sattığınızda, müşteri kapıda ekstra hiçbir sürpriz vergi ödemez. Teslimat hızı doğrudan artar.
      </blockquote>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">FDA ve Diğer Özel Kurumlara Dikkat!</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Muafiyet kuralı finansal bir kolaylık sağlasa da, insan cildine temas eden kremler, gıda takviyeleri veya FDA (Food and Drug Administration) kontrolüne tabi ahşap/tarım ürünleri satıyorsanız, ürün 800 doların altında bile olsa ilgili belgeler (Prior Notice vb.) sunulmak zorundadır.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    author: { name: "Gönderio", avatar: "/icon.png", role: "E-İhracat Blogu" },
    readTime: "4 dk okuma",
    views: 32000,
    tags: ["Amerika", "Vergilendirme", "De Minimis", "Gümrük"],
    publishedAt: "20 Mayıs 2026"
  },
  {
    id: "8",
    slug: "yurt-disi-kargo-fiyatlari-nasil-hesaplanir",
    title: "Yurt Dışı Kargo Fiyatları Nasıl Hesaplanır? Gerçek Ağırlık vs. Hacimsel Ağırlık",
    excerpt: "Uçak kargo taşımacılığında en çok karıştırılan konulardan biri olan desi hesabını, gizli maliyetleri ve kargo bütçenizi nasıl optimize edebileceğinizi anlatıyoruz.",
    content: `
      <p class="mb-4 text-slate-600 leading-relaxed">Birçok yeni e-ihracatçı, ürünün sadece terazideki ağırlığına bakarak kargo maliyeti hesaplama hatasına düşer. Ancak uluslararası hava taşımacılığında "Hacimsel Ağırlık" (Volumetric Weight) kavramı hayati önem taşır.</p>
      
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
    author: { name: "Gönderio", avatar: "/icon.png", role: "E-İhracat Blogu" },
    readTime: "5 dk okuma",
    views: 15300,
    tags: ["Lojistik", "Optimizasyon", "Fiyatlandırma"],
    publishedAt: "15 Mayıs 2026"
  },
  {
    id: "9",
    slug: "aliexpress-ve-dropshipping-gonderimleri-nasil-yapilir",
    title: "Türkiye'den Global Dropshipping ve AliExpress Süreçleri Yönetimi",
    excerpt: "Türkiye'deki tedarikçilerinizden dünya çapındaki müşterilerinize doğrudan kargo gönderimi yaparak nasıl global bir dropshipping markası kurabilirsiniz?",
    content: `
      <p class="mb-4 text-slate-600 leading-relaxed">Geleneksel dropshipping genellikle Çin'den dünyaya ürün tedarik etmeye odaklanırken, son yıllarda Türkiye'nin güçlü üretim altyapısı sayesinde "Türkiye'den Dünyaya Dropshipping" modeli patlama yaşadı.</p>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Üreticiden Doğrudan Tüketiciye (D2C)</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Özellikle tekstil, deri ürünleri ve ev dekorasyonu gibi kategorilerde İstanbul, Bursa veya Denizli'deki üreticinizle anlaşıp, kargoyu direkt fabrikadan Amerika'daki son kullanıcıya çıkarabilirsiniz. Burada Gönderio'nun panelini tedarikçinize açmanız yeterlidir. Tedarikçiniz etiketi basar ve kargo sizin markanızla yola çıkar.</p>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">AliExpress Satıcıları İçin Kargo Hızı</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">AliExpress'te Türk satıcılara (Cainiao harici) kargo opsiyonları sunulmaktadır. Express kargo firmaları ile entegrasyon kurduğunuzda, Çinli rakiplerinizin 30-40 günde teslim ettiği ürünleri 2-3 günde teslim etme sözü vererek satış fiyatınızı çok daha yüksek marjlara çekebilirsiniz.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=80&w=1200&auto=format&fit=crop",
    author: { name: "Gönderio", avatar: "/icon.png", role: "E-İhracat Blogu" },
    readTime: "4 dk okuma",
    views: 13500,
    tags: ["AliExpress", "Dropshipping", "B2C", "Tedarik Zinciri"],
    publishedAt: "10 Mayıs 2026"
  },
  {
    id: "10",
    slug: "woocommerce-ile-kargo-sistemi-kurulumu",
    title: "WooCommerce Sitenizde Çok Dilli ve Çok Kurlu Kargo Altyapısı",
    excerpt: "Açık kaynaklı WordPress altyapısı olan WooCommerce üzerinde global müşteriler için dinamik ve canlı kargo fiyatlandırma sistemini nasıl kurarsınız?",
    content: `
      <p class="mb-4 text-slate-600 leading-relaxed">Shopify kadar popüler olan bir diğer e-ticaret altyapısı da WordPress tabanlı WooCommerce'dir. Tamamen ücretsiz olması ve yüksek özelleştirilebilirlik sunması nedeniyle binlerce e-ihracatçı tarafından tercih edilmektedir.</p>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Checkout (Ödeme) Aşamasında Kargo Deneyimi</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Uluslararası müşteriler, ürün fiyatını Euro görürken kargo bedelini TL görmek istemezler. WooCommerce için geliştirilen multi-currency (çoklu para birimi) eklentileriyle, Gönderio altyapısından çektiğiniz kargo maliyetlerini anlık güncel kur ile çarparak müşteriye kendi dilinde ve para biriminde sunabilirsiniz.</p>

      <blockquote class="border-l-4 border-[#FA8B00] pl-6 my-8 italic text-slate-700 bg-slate-50 p-6 rounded-r-xl">
        "Ödeme adımında sürpriz maliyet çıkarmak, sepeti terk etme (cart abandonment) oranlarının %60'lık sebebini oluşturur. Kargo bedelini şeffafça veya ürün fiyatına yedirerek göstermek en iyi pratiktir."
      </blockquote>

      <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Plugin Entegrasyonu</h3>
      <p class="mb-4 text-slate-600 leading-relaxed">Gönderio API'si sayesinde WooCommerce panelinize kuracağınız tek bir eklenti ile; siparişleri sisteme çekebilir, toplu kargo etiketi oluşturabilir, gümrük için ticari proforma faturayı otomatik üretebilir ve kargo durumlarını sitenize geri yansıtabilirsiniz.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=1200&auto=format&fit=crop",
    author: { name: "Gönderio", avatar: "/icon.png", role: "E-İhracat Blogu" },
    readTime: "5 dk okuma",
    views: 10800,
    tags: ["WooCommerce", "WordPress", "Entegrasyon", "E-ihracat"],
    publishedAt: "05 Mayıs 2026"
  }
];
