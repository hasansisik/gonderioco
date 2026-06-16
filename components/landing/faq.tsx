"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqData = [
  {
    question: "Gönderio Nedir?",
    answer: "Gönderio; e-ihracat yapan KOBİ ve girişimciler için yurt dışı kargo süreçlerini, pazar yeri entegrasyonlarını ve siparişleri tek bir ekrandan yönetebilecekleri akıllı bir lojistik panelidir."
  },
  {
    question: "Hangi ülkelere gönderim yapabilirim?",
    answer: "Gönderio aracılığıyla dünyanın 220'den fazla ülkesine express ve standart (eco) kargo seçenekleriyle güvenle gönderim yapabilirsiniz."
  },
  {
    question: "Desi hesabı nasıl yapılır?",
    answer: "Desi hesabı, gönderinizin En x Boy x Yükseklik / 5000 formülü ile hesaplanarak bulunur. Fiyatlandırma yapılırken gerçek ağırlık ile desi değerinden hangisi büyükse o dikkate alınır."
  },
  {
    question: "Express gönderi ile Eco gönderi arasındaki fark nedir?",
    answer: "Express gönderiler uçak kargo ile genellikle 1-3 iş günü içinde teslim edilirken, Eco (Standart) gönderiler kara veya karma yollarla 7-15 iş günü arasında daha ekonomik bir şekilde teslim edilir."
  },
  {
    question: "Pazaryeri mağazalarımı Gönderio'ya entegre etmemin avantajları nelerdir?",
    answer: "Siparişleriniz otomatik olarak panele düşer, manuel veri girişi yapmanıza gerek kalmaz ve oluşturulan kargo takip numaraları pazar yerlerindeki mağazalarınıza anında iletilir."
  },
  {
    question: "Kargolarım adresimden toplanabiliyor mu?",
    answer: "Evet, anlaşmalı taşıyıcılarımız ve kurye ağımız sayesinde kargolarınız doğrudan deponuzdan veya belirttiğiniz adresten teslim alınabilir."
  },
  {
    question: "Yurt dışı gönderileri karşıdan ödemeli yapılır mı?",
    answer: "Maalesef e-ihracat gönderilerinde uluslararası taşıma kuralları gereği taşıma ücreti peşin ödenmelidir, karşı ödemeli gönderim seçeneği bulunmamaktadır."
  },
  {
    question: "Mikro ihracat (ETGB) nedir?",
    answer: "Ağırlığı 300 kg ve değeri 15.000 Euro'yu geçmeyen, ticari amaçla yapılan yurt dışı satışlarının gümrük işlemlerinin yetkili kargo firmalarınca elektronik ortamda yapıldığı kolaylaştırılmış sistemdir."
  },
  {
    question: "Mikro ihracat gönderimi yapabilir miyim?",
    answer: "Evet, Gönderio üzerinden e-faturanızı ve gerekli evrakları sisteme yükleyerek ETGB kapsamında gümrük müşavirine ihtiyaç duymadan mikro ihracat gönderimi yapabilirsiniz."
  },
  {
    question: "Kargo takip numaramı nasıl öğrenebilirim?",
    answer: "Gönderi etiketiniz oluşturulduğu anda sistem size ve müşterinize uluslararası geçerliliği olan bir kargo takip numarası atar ve panel üzerinden anlık takip edebilirsiniz."
  },
  {
    question: "Hangi pazar yerleri ile entegrasyonunuz var?",
    answer: "Amazon, Etsy, Shopify, eBay, WooCommerce, Opencart, İkas ve AliExpress gibi dünyanın önde gelen tüm global ve yerel e-ticaret altyapıları ile tam entegrasyonumuz bulunmaktadır."
  },
  {
    question: "Gönderio'yu denemek için ücret ödemem gerekir mi?",
    answer: "Hayır, Gönderio paneline kayıt olmak, mağazalarınızı bağlamak ve fiyat hesaplamak tamamen ücretsizdir. Sadece kargo gönderimi yaptığınızda bakiye düşülür."
  },
  {
    question: "Gümrük vergilerini kim ödüyor?",
    answer: "Bu tamamen sizin gönderi seçiminize bağlıdır. DDP (Gümrük Vergisi Ödenmiş) gönderilerde vergiyi siz karşılarsınız, DDU (Gümrük Vergisi Ödenmemiş) gönderilerde ise vergiyi alıcı (müşteriniz) öder."
  },
  {
    question: "İade kargolarımı nasıl yönetebilirim?",
    answer: "Yurt dışından gelen iadeleriniz için panelimiz üzerinden çok kolay bir şekilde iade (return) etiketi oluşturabilir ve kargonuzun ülkeye geri dönüşünü takip edebilirsiniz."
  },
  {
    question: "Fiyatlara yakıt ve diğer ek ücretler dahil mi?",
    answer: "Evet, panelimizde hesaplama yaparken gördüğünüz fiyatlar o anki yakıt ek ücretlerini (fuel surcharge) kapsayan net tahminlerdir."
  },
  {
    question: "Kargo paketlememi nasıl yapmalıyım?",
    answer: "Ürünlerinizin uluslararası uzun yol taşımacılığına uygun, darbelere dayanıklı sert karton kutularda ve içi patpat gibi dolgu malzemesiyle desteklenerek sıkıca paketlenmesi gerekmektedir."
  },
  {
    question: "Hasarlı veya kayıp kargo durumunda ne yapmalıyım?",
    answer: "Uluslararası taşıyıcı firmaların standart sigorta politikaları geçerlidir. Hasar anında panel üzerinden destek talebi oluşturarak tazmin sürecini hemen başlatabilirsiniz."
  },
  {
    question: "Gümrükte takılan kargolar için destek veriyor musunuz?",
    answer: "Uzman gümrük ve operasyon ekibimiz, eksik evrak veya beyan nedeniyle gümrükte bekleyen kargolarınız için çözüm üretmek adına taşıyıcılarla doğrudan iletişime geçer."
  },
  {
    question: "Gönderi iptali yapabilir miyim?",
    answer: "Kargonuz henüz taşıyıcı firmaya teslim edilmeden ve yola çıkmadan önce panel üzerinden gönderinizi iptal edebilir ve ödediğiniz etiket ücretini cüzdanınıza iade alabilirsiniz."
  },
  {
    question: "Ödemelerimi nasıl yapabilirim?",
    answer: "Sisteme kredi kartı tanımlayarak 3D Secure güvencesiyle bakiye yükleyebilir ve tüm kargo gönderimlerinizi bu dijital cüzdanınız üzerinden hızlıca ödeyebilirsiniz."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container mx-auto max-w-[1280px] px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-slate-900 mb-4 tracking-tight leading-tight">
            <span className="font-light">E-ihracat ve Kargo Süreçleriyle İlgili </span><br className="hidden md:block" />
            <span className="font-extrabold italic">Sıkça Sorulan Sorular</span>
          </h2>
          <p className="text-slate-500 font-light text-sm md:text-[15px] max-w-2xl mx-auto leading-relaxed">
            Aklınıza takılan tüm soruların cevapları burada.
          </p>
        </div>

        {/* FAQ Grid (Split into independent columns to prevent row gaps) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-6xl mx-auto items-start">
          
          {/* Left Column (Evens) */}
          <div className="flex flex-col gap-4 lg:gap-6">
            {faqData.map((faq, index) => {
              if (index % 2 !== 0) return null
              const isOpen = openIndex === index

              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isOpen 
                      ? "border-[#FA8B00] shadow-md" 
                      : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="p-5 lg:p-6 flex items-center justify-between gap-4">
                    <h3 className={`font-semibold text-[15px] leading-snug transition-colors ${isOpen ? 'text-[#FA8B00]' : 'text-slate-800'}`}>
                      {faq.question}
                    </h3>
                    <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isOpen ? 'bg-[#FA8B00]/10 text-[#FA8B00]' : 'bg-slate-100 text-slate-500'}`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>
                  
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100 pb-5 lg:pb-6' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 lg:px-6 text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column (Odds) */}
          <div className="flex flex-col gap-4 lg:gap-6">
            {faqData.map((faq, index) => {
              if (index % 2 === 0) return null
              const isOpen = openIndex === index

              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isOpen 
                      ? "border-[#FA8B00] shadow-md" 
                      : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="p-5 lg:p-6 flex items-center justify-between gap-4">
                    <h3 className={`font-semibold text-[15px] leading-snug transition-colors ${isOpen ? 'text-[#FA8B00]' : 'text-slate-800'}`}>
                      {faq.question}
                    </h3>
                    <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isOpen ? 'bg-[#FA8B00]/10 text-[#FA8B00]' : 'bg-slate-100 text-slate-500'}`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>
                  
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100 pb-5 lg:pb-6' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 lg:px-6 text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
