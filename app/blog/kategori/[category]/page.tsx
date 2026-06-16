import { blogs } from "@/data/blogs"
import { notFound } from "next/navigation"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { BlogCard } from "@/components/blog/blog-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  
  // Tag formatlama (boşlukları tireye çevirip küçük harfe dönüştürdük)
  const categoryBlogs = blogs.filter(b => 
    b.tags.some(t => t.toLowerCase().replace(/ /g, '-') === decodedCategory)
  );

  if (categoryBlogs.length === 0) {
    notFound();
  }

  // Ekranda güzel göstermek için orjinal ismini diziden çekiyoruz
  const displayCategoryName = categoryBlogs[0].tags.find(
    t => t.toLowerCase().replace(/ /g, '-') === decodedCategory
  ) || decodedCategory;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header theme="light" />

      <main className="flex-1 pt-24 pb-24">
        <div className="container mx-auto max-w-[1280px] px-4">
          
          <div className="max-w-5xl mx-auto mb-16">
             <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-[15px] mb-8">
               <ArrowLeft className="w-4 h-4" /> Tüm Yazılara Dön
             </Link>
             <div className="text-[#FA8B00] text-sm font-bold tracking-widest uppercase mb-4">
                KATEGORİ
             </div>
             <h1 className="text-3xl md:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight mb-4 font-bold">
                {displayCategoryName}
             </h1>
             <p className="text-slate-500 text-base md:text-lg font-medium">
               "{displayCategoryName}" etiketi ile paylaşılan tüm yazılar aşağıda listelenmektedir.
             </p>
          </div>

          {/* Blog Grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {categoryBlogs.map(blog => (
               <BlogCard key={blog.id} blog={blog} />
             ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
