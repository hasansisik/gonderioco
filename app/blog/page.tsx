import { blogs } from "@/data/blogs"
import { BlogCard } from "@/components/blog/blog-card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default async function BlogPage(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const activeCategory = searchParams.category || "Tümü";

  // Basit bir filtreleme mantığı (seçilen kategori etikette geçiyorsa veya Tümü ise)
  const filteredBlogs = activeCategory === "Tümü" 
    ? blogs 
    : blogs.filter(b => b.tags.some(t => t.toLowerCase().includes(activeCategory.toLowerCase())) || 
                        // Kargo İpuçları gibi tam eşleşmeyenler için ekstra kontrol
                        (activeCategory === "Kargo İpuçları" && b.tags.includes("Lojistik")) ||
                        (activeCategory === "Başarı Hikayeleri" && b.tags.includes("Dropshipping")));

  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[Math.floor(Math.random() * filteredBlogs.length)] : blogs[0];
  const otherBlogs = filteredBlogs.filter(b => b.id !== featuredBlog.id);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header theme="light" />

      <main className="flex-1 pt-20 pb-24">
        <div className="container mx-auto max-w-[1280px] px-4">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
             <div className="text-[#FA8B00] text-[13px] tracking-widest uppercase mb-4">
                GÖNDERİO BLOG
             </div>
             <h1 className="text-3xl md:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight mb-4">
                <span className="font-light">E-ihracatın yeni</span><br/>
                <span className="font-extrabold italic">yol haritası.</span>
             </h1>
             <p className="text-slate-500 text-base md:text-lg font-medium">
               Kargo süreçleri, gümrük detayları, pazar yeri entegrasyonları ve başarı hikayeleriyle global büyümenize yön verin.
             </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16 md:mb-24">
             <BlogCard blog={featuredBlog} featured />
          </div>

          {/* Category Filter Mock */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {["Tümü", "E-ihracat", "Gümrük", "Entegrasyon", "Başarı Hikayeleri", "Kargo İpuçları"].map((cat, i) => (
              <Link 
                href={cat === "Tümü" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
                key={i} 
                scroll={false}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                  activeCategory === cat 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {otherBlogs.map(blog => (
               <BlogCard key={blog.id} blog={blog} />
             ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
