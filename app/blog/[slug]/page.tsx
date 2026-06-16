import { blogs } from "@/data/blogs"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Clock, Eye, Calendar, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { BlogCard } from "@/components/blog/blog-card"

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find(b => b.slug === slug);

  if (!blog) {
    notFound();
  }

  // Get some related posts (just mocking by getting others)
  const relatedPosts = blogs.filter(b => b.id !== blog.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header theme="light" />

      <main className="flex-1 pt-24 pb-24">
        
        <article className="container mx-auto max-w-[1280px] px-4">
           {/* Back Button */}
           <div className="max-w-5xl mx-auto mb-8">
             <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-[15px]">
               <ArrowLeft className="w-4 h-4" /> Blog'a Dön
             </Link>
           </div>

           {/* Article Header */}
           <header className="max-w-3xl mx-auto mb-16">
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {blog.tags.map((tag, i) => (
                  <Link href={`/blog/kategori/${tag.toLowerCase().replace(/ /g, '-')}`} key={i} className="bg-[#FA8B00]/10 hover:bg-[#FA8B00]/20 transition-colors text-[#FA8B00] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    {tag}
                  </Link>
                ))}
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-[1.2] mb-8">
                {blog.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-slate-100">
                
                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                    <Image src={blog.author.avatar} alt={blog.author.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-base">{blog.author.name}</div>
                    <div className="text-slate-500 text-[13px] font-medium">{blog.author.role}</div>
                  </div>
                </div>

                {/* Meta Stats */}
                <div className="flex items-center gap-6 text-slate-500 text-[13px] font-medium">
                   <div className="flex items-center gap-2">
                     <Calendar className="w-4 h-4" /> {blog.publishedAt}
                   </div>
                   <div className="flex items-center gap-2">
                     <Clock className="w-4 h-4" /> {blog.readTime}
                   </div>
                   <div className="flex items-center gap-2">
                     <Eye className="w-4 h-4" /> {blog.views.toLocaleString()} Görüntülenme
                   </div>
                </div>

              </div>
           </header>

           {/* Large Cover Image */}
           <div className="max-w-5xl mx-auto mb-16">
              <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden bg-slate-100 shadow-xl">
                <Image 
                  src={blog.coverImage} 
                  alt={blog.title} 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
           </div>

           {/* Article Body */}
           <div className="max-w-3xl mx-auto">
             <div 
               className="prose prose-base prose-slate max-w-none 
                          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
                          prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-8
                          prose-a:text-[#FA8B00] prose-a:no-underline hover:prose-a:underline
                          prose-img:rounded-2xl prose-img:shadow-lg
                          prose-blockquote:border-l-4 prose-blockquote:border-[#FA8B00] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:pr-6 prose-blockquote:rounded-r-xl"
               dangerouslySetInnerHTML={{ __html: blog.content }}
             />

             {/* Share Section */}
             <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="font-bold text-slate-900 text-[15px]">Bu makaleyi paylaş:</div>
                <div className="flex items-center gap-3">
                   <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#FA8B00] hover:border-[#FA8B00] hover:bg-orange-50 transition-all">
                     <Twitter className="w-4 h-4" />
                   </button>
                   <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#FA8B00] hover:border-[#FA8B00] hover:bg-orange-50 transition-all">
                     <Linkedin className="w-4 h-4" />
                   </button>
                   <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#FA8B00] hover:border-[#FA8B00] hover:bg-orange-50 transition-all">
                     <Facebook className="w-4 h-4" />
                   </button>
                </div>
             </div>
           </div>

        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-16 border-t border-slate-100 bg-white">
            <div className="container mx-auto max-w-[1280px] px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">İlginizi Çekebilir</h2>
                <Link href="/blog" className="text-slate-900 font-normal text-[15px] hover:underline flex items-center gap-2">
                  Tüm Yazıları Gör <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {relatedPosts.map(p => (
                   <BlogCard key={p.id} blog={p} />
                 ))}
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
