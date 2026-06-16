import { Store, LayoutList, CreditCard } from "lucide-react"

export function Features() {
  const features = [
    {
      title: "Mağazanızı entegre edin",
      description: "Global pazar yerlerindeki mağazanızı panele entegre edin. Siparişiniz geldiği anda panel üzerinden kargo teklifi alın ve gönderileri süreçlerinizi otomatize edin.",
      icon: <Store strokeWidth={2.5} className="w-10 h-10" />,
    },
    {
      title: "Gönderi tekliflerini karşılaştırın",
      description: "Sunduğumuz eko, express ve diğer servis seçenekleri arasından taşımanıza ve bütçenize en uygun teklif opsiyonunu seçin.",
      icon: <LayoutList strokeWidth={2.5} className="w-10 h-10" />,
    },
    {
      title: "Online ödeyin ve gönderinizi takip edin",
      description: "Belgelerinizi sisteme yükleyerek gönderinizi tamamlayın ve ödemenizi online olarak kolayca yapın. Gönderinizin kapınızdan teslim alınması için sistem üzerinden toplama talebi oluşturun. Size sunulan takip numarası ile gönderinizin durumunu yönetin.",
      icon: <CreditCard strokeWidth={2.5} className="w-10 h-10" />,
    },
  ]

  return (
    <section id="nasil-calisir" className="bg-white py-24 sm:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-slate-900 mb-4 tracking-tight leading-tight">
            <span className="font-light">Yurt Dışına </span>
            <span className="font-extrabold italic">En Uygun </span>
            <span className="font-light">Kargo Gönderimi.</span>
          </h2>
          <p className="mt-6 text-sm sm:text-[15px] leading-relaxed text-slate-500">
            Gönderio'yu kullanarak zaman ve maliyetten tasarruf edin. Uçak bileti satın alır gibi yüzlerce lojistik firmasını
            karşılaştırın, size uygun olan taşıma yöntemini seçin. Seçtiğiniz firmadan taşıma hizmeti alın. Satışlarınızda
            hem tedarik zinciri hem de zaman ve sermaye yönetimini optimize ederek ilerleyin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:gap-8 lg:gap-16 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#FFE4EC] text-[#FF4D85]">
                {feature.icon}
              </div>
              <h3 className="mb-4 text-lg font-bold text-[#333333] max-w-[250px] leading-snug">
                {feature.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
