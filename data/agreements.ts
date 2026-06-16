export interface Agreement {
  slug: string;
  title: string;
  lastUpdated: string;
  content: string;
}

export const agreements: Agreement[] = [
  {
    slug: "kisisel-verilerin-korunmasi",
    title: "Kişisel Verilerin Korunması (KVKK)",
    lastUpdated: "16 Haziran 2026",
    content: `
      <h2>1. Veri Sorumlusu</h2>
      <p>Bu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla Gönderio Lojistik ve Teknoloji A.Ş. ("Gönderio") tarafından hazırlanmıştır. Şirketimiz, kişisel verilerinizin güvenliğine en üst düzeyde önem vermekte olup, hizmetlerimizi kullanırken bizimle paylaştığınız veriler özenle korunmaktadır.</p>
      
      <h2>2. İşlenen Kişisel Verileriniz ve İşlenme Amaçları</h2>
      <p>Şirketimiz tarafından sunulan e-ihracat, lojistik, kargo entegrasyonu ve gümrükleme hizmetlerinden faydalanabilmeniz amacıyla aşağıdaki kişisel verileriniz işlenmektedir:</p>
      <ul>
        <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. Kimlik numarası (veya Vergi Kimlik Numarası).</li>
        <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, fatura ve teslimat adresleri.</li>
        <li><strong>Finansal Bilgiler:</strong> Ödeme yöntemleri, fatura bilgileri (Kredi kartı verileri tarafımızca saklanmamakta olup BDDK lisanslı ödeme kuruluşları tarafından işlenmektedir).</li>
        <li><strong>Kullanıcı İşlem Bilgileri:</strong> Gönderi detayları, kargo takip numaraları, entegrasyon API logları, site içi gezinme bilgileri.</li>
      </ul>
      <p>Bu veriler; hizmetlerin ifası, sözleşme süreçlerinin yürütülmesi, lojistik ve gümrük operasyonlarının (ETGB vb.) yasalara uygun gerçekleştirilmesi, müşteri ilişkileri süreçlerinin yönetilmesi ve yasal yükümlülüklerimizin yerine getirilmesi amaçlarıyla işlenmektedir.</p>

      <h2>3. Kişisel Verilerin Aktarılması</h2>
      <p>Kişisel verileriniz, yasal düzenlemelerin izin verdiği sınırlar dahilinde ve yukarıda belirtilen amaçların gerçekleştirilmesi için yurt içindeki ve/veya yurt dışındaki iş ortaklarımıza (kargo şirketleri, gümrük müşavirlikleri), tedarikçilerimize, hissedarlarımıza, kanunen yetkili kamu kurumları ve özel kişilere aktarılabilmektedir.</p>

      <h2>4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
      <p>Kişisel verileriniz, web sitemiz, API entegrasyonları, müşteri hizmetleri kanalları ve mobil uygulama üzerinden elektronik ve fiziksel yollarla toplanmaktadır. İşlemeler, KVKK Madde 5'te belirtilen "sözleşmenin kurulması ve ifası", "veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi" ve "ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaat" hukuki sebeplerine dayanmaktadır.</p>

      <h2>5. KVKK Madde 11 Kapsamındaki Haklarınız</h2>
      <p>Kişisel veri sahibi olarak; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini talep etme haklarına sahipsiniz. Taleplerinizi Şirketimizin kayıtlı e-posta adresine güvenli elektronik imza ile veya fiziki adresimize yazılı olarak iletebilirsiniz.</p>
    `
  },
  {
    slug: "ticari-elektronik-ileti-onay-metni",
    title: "Ticari Elektronik İleti Onay Metni",
    lastUpdated: "16 Haziran 2026",
    content: `
      <h2>İleti Onay Formu</h2>
      <p>Bu onay metni, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve ilgili mevzuat uyarınca; Gönderio Lojistik ve Teknoloji A.Ş. tarafından sunulan e-ihracat, kargo kampanyaları, yeni entegrasyon duyuruları, indirimler ve hizmetlere ilişkin bilgilendirmelerin tarafıma iletilmesi amacıyla düzenlenmiştir.</p>
      
      <h2>Kapsam ve İçerik</h2>
      <p>Tarafıma sağladığım e-posta adresi, telefon numarası ve diğer iletişim kanalları vasıtasıyla; SMS, e-posta ve sesli arama yöntemleri kullanılarak Gönderio tarafından reklam, promosyon, kampanya ve bilgilendirme amaçlı ticari elektronik ileti gönderilmesine onay veriyorum.</p>

      <h2>İptal Hakkı</h2>
      <p>Tarafıma gönderilen ticari iletilerde yer alan "Abonelikten Ayrıl" veya "İptal" seçeneklerini kullanarak veya Şirket iletişim kanalları üzerinden talebimi ileterek ticari elektronik ileti gönderimine ilişkin onayımı dilediğim zaman ve hiçbir gerekçe göstermeksizin geri alabileceğimi biliyorum.</p>
    `
  },
  {
    slug: "kullanici-sozlesmesi",
    title: "Kullanıcı Sözleşmesi",
    lastUpdated: "16 Haziran 2026",
    content: `
      <h2>1. Taraflar</h2>
      <p>İşbu Kullanıcı Sözleşmesi ("Sözleşme"), Gönderio Lojistik ve Teknoloji A.Ş. ("Gönderio") ile www.gonderio.com internet sitesini ve platformunu ("Site") kullanan, kayıt olan ve/veya Gönderio hizmetlerinden faydalanan Kullanıcı ("Kullanıcı") arasında akdedilmiştir.</p>
      
      <h2>2. Sözleşmenin Konusu</h2>
      <p>Bu Sözleşme'nin konusu, Gönderio'nun Kullanıcı'ya sunduğu e-ihracat lojistik çözümleri, pazar yeri entegrasyonları, gönderi etiketi basımı, gümrükleme (ETGB vb.) hizmetleri ve uygulamanın kullanım şartlarının belirlenmesidir.</p>
      
      <h2>3. Kullanıcının Hak ve Yükümlülükleri</h2>
      <ul>
        <li>Kullanıcı, Site'ye üye olurken verdiği bilgilerin eksiksiz, doğru ve güncel olduğunu kabul eder. Eksik veya yanlış bilgi sebebiyle doğacak gümrük cezaları, kargo iade masrafları veya vergi yükümlülüklerinden tamamen Kullanıcı sorumludur.</li>
        <li>Kullanıcı, gönderiye konu olan paketlerin içeriklerinin yasal mevzuata, uluslararası havacılık ve taşıma (IATA vb.) kurallarına, varış ülkesi gümrük mevzuatına uygun olduğunu beyan eder. Yanıcı, patlayıcı, uyuşturucu, sahte veya yasaklı ürünlerin gönderimi kesinlikle yasaktır.</li>
        <li>Kullanıcı, oluşturduğu gönderilerin paketlemesinden bizzat sorumludur. Yetersiz veya hatalı paketleme nedeniyle taşıma esnasında oluşacak hasarlardan Gönderio sorumlu tutulamaz.</li>
        <li>Kullanıcı, fatura ve gümrük beyan değerlerini gerçek satış bedelleri üzerinden bildirmekle yükümlüdür.</li>
      </ul>

      <h2>4. Gönderio'nun Hak ve Yükümlülükleri</h2>
      <ul>
        <li>Gönderio, Kullanıcı'nın talebi üzerine paketleri taşıyıcı firmalara (UPS, DHL, FedEx vb.) teslim etmek, ETGB süreçlerini Kullanıcı adına yönetmek için aracı altyapı hizmeti sunar.</li>
        <li>Gönderio, mücbir sebepler, taşıyıcı firma gecikmeleri, gümrük muayeneleri veya alıcı ülkesindeki mevzuat değişikliklerinden doğan teslimat gecikmelerinden sorumlu tutulamaz.</li>
        <li>Gönderio, platformdaki altyapıyı güncel tutmayı taahhüt eder ancak sistem bakım çalışmaları veya planlı kesintiler nedeniyle oluşabilecek anlık aksaklıklarda sorumluluk kabul etmez.</li>
      </ul>

      <h2>5. Fiyatlandırma ve Ödeme</h2>
      <p>Kargo gönderim ücretleri; paketin desi (hacimsel ağırlık) değeri, varış ülkesi ve seçilen kargo servisine göre sistem üzerinden dinamik olarak hesaplanır. Gönderio, kargo firmalarının uygulayabileceği ek yakıt zamları, savaş riski ek ücretleri veya uzak bölge (remote area) teslimat bedelleri sebebiyle oluşabilecek fiyat farklarını Kullanıcı'ya sonradan fatura etme hakkını saklı tutar.</p>

      <h2>6. İptal ve İade Şartları</h2>
      <p>Sistem üzerinden barkodu oluşturulmuş ve Gönderio'ya/taşıyıcı firmaya teslim edilmiş kargolar için iptal işlemi yapılamaz. Ancak henüz teslim edilmemiş kargolar için etiket iptali sağlanabilir. Varış ülkesinde gümrükten geçemeyen, alıcıya ulaşılamayan veya alıcının kabul etmediği paketlerin Türkiye'ye iade edilmesi sürecinde doğacak tüm masraflar (iade navlunu, ardiye, iade gümrük vergileri) Kullanıcı'ya aittir.</p>

      <h2>7. Uyuşmazlıkların Çözümü</h2>
      <p>İşbu Sözleşme'den doğabilecek her türlü ihtilafta İstanbul Mahkemeleri ve İcra Daireleri yetkilidir. Sözleşme Türkiye Cumhuriyeti yasalarına tabidir.</p>
    `
  },
  {
    slug: "politikalarimiz",
    title: "Şirket Politikalarımız",
    lastUpdated: "16 Haziran 2026",
    content: `
      <h2>Kalite Politikamız</h2>
      <p>Gönderio olarak, lojistik süreçlerini teknoloji ile birleştirerek müşterilerimize en hızlı, güvenilir ve sürdürülebilir e-ihracat çözümlerini sunmayı amaçlıyoruz. Sürekli iyileştirme prensibi ile ISO 9001 Kalite Yönetim Sistemi standartlarını uygulamakta ve müşteri memnuniyetini en üst düzeyde tutmaktayız.</p>
      
      <h2>Bilgi Güvenliği Politikası (ISO 27001)</h2>
      <p>Müşterilerimizin, iş ortaklarımızın ve çalışanlarımızın bilgi varlıklarını korumak en önemli önceliğimizdir. Bilgi güvenliği risklerini en aza indirmek için güncel güvenlik teknolojilerini kullanıyor, veri gizliliğine, bütünlüğüne ve erişilebilirliğine yönelik tüm süreçleri düzenli olarak denetliyoruz.</p>
      
      <h2>İş Sağlığı ve Güvenliği Politikası (ISO 45001)</h2>
      <p>Çalışanlarımızın ve operasyon sahalarında bulunan tüm paydaşlarımızın sağlığını ve güvenliğini korumak adına tüm yasal gereklilikleri eksiksiz olarak yerine getiriyoruz. Sıfır iş kazası hedefiyle eğitim faaliyetleri düzenliyor, güvenli çalışma ortamları oluşturuyoruz.</p>

      <h2>Sürdürülebilirlik ve Çevre Politikası</h2>
      <p>Lojistik sektörünün çevresel etkilerini azaltmak adına yeşil lojistik çözümlerini destekliyor, karbon ayak izimizi minimize etmek için dijital süreçleri (kağıtsız ofis, dijital faturalandırma) teşvik ediyoruz.</p>
    `
  }
];
