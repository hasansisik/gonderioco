"use client"

export function TrustedBy() {
  const partners = [
    { name: "UPS", src: "/brand/ups.png", className: "h-12 md:h-20 scale-110 md:scale-125" },
    { name: "FedEx", src: "/brand/fedex.png", className: "h-14 md:h-20 scale-125 md:scale-[1.4]" },
    { name: "DHL", src: "/brand/dhl.png", className: "h-16 md:h-24 scale-150 md:scale-[1.7]" },
    { name: "Amazon", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", className: "h-8 md:h-10" },
    { name: "Shopify", src: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg", className: "h-8 md:h-10" },
    { name: "Etsy", src: "https://upload.wikimedia.org/wikipedia/commons/8/89/Etsy_logo.svg", className: "h-7 md:h-9" },
    { name: "TNT", src: "https://upload.wikimedia.org/wikipedia/commons/2/23/TNT_Logo.svg", className: "h-7 md:h-9" },
    { name: "eBay", src: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", className: "h-8 md:h-11" },
    { name: "PTS", src: "/brand/pts.png", className: "h-10 md:h-14 scale-110 md:scale-[1.2]" },
  ]

  // We duplicate the partners array to create a seamless infinite loop
  const duplicatedPartners = [...partners, ...partners]

  return (
    <section className="bg-white py-12 lg:py-16 overflow-hidden">
      <div className="container mx-auto max-w-[1280px] px-4">
        <p className="text-center text-[15px] font-medium text-slate-500 mb-10">Çalışma Ortaklarımız</p>
      </div>

      <style jsx>{`
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-right {
          animation: marquee-right 30s linear infinite;
        }
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Marquee Wrapper */}
      <div className="relative w-full flex">
        {/* Left/Right fading gradients for a premium feel */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent"></div>
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent"></div>

        <div className="flex w-max animate-marquee-right items-center gap-10 md:gap-16 lg:gap-20 px-5 md:px-8 lg:px-10">
          {duplicatedPartners.map((partner, index) => (
             <div key={index} className="flex flex-shrink-0 items-center justify-center transition-all duration-300 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 cursor-pointer">
               <img 
                 src={partner.src} 
                 alt={partner.name} 
                 className={`object-contain mix-blend-multiply ${partner.className} w-auto`}
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   const span = document.createElement('span');
                   span.className = 'font-black text-2xl md:text-3xl tracking-tighter text-slate-800';
                   span.innerText = partner.name;
                   e.currentTarget.parentElement?.appendChild(span);
                 }}
               />
             </div>
          ))}
        </div>
      </div>
    </section>
  )
}
