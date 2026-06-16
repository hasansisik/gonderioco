import Link from "next/link"
import Image from "next/image"
import { Clock, Eye, ArrowRight } from "lucide-react"
import { Blog } from "@/data/blogs"

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export function BlogCard({ blog, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Link href={`/blog/${blog.slug}`} className="group relative grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-12 items-center bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-500">
        <div className="relative w-full aspect-video lg:aspect-square overflow-hidden bg-slate-100">
          <Image 
            src={blog.coverImage} 
            alt={blog.title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-8 lg:p-12 lg:pl-0 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#FA8B00]/10 text-[#FA8B00] text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {blog.tags[0]}
            </span>
            <div className="flex items-center gap-1.5 text-slate-400 text-[13px] font-medium">
              <Clock className="w-4 h-4" />
              {blog.readTime}
            </div>
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-[#FA8B00] transition-colors">
            {blog.title}
          </h2>
          <p className="text-slate-500 text-[15px] leading-relaxed mb-6 line-clamp-3">
            {blog.excerpt}
          </p>
          <div className="flex items-center justify-end mt-auto">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-400 group-hover:bg-[#FA8B00] group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${blog.slug}`} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
        <Image 
          src={blog.coverImage} 
          alt={blog.title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {blog.tags.slice(0, 1).map((tag, i) => (
             <span key={i} className="bg-white/90 backdrop-blur-sm text-slate-900 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
               {tag}
             </span>
          ))}
        </div>
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-4">
          <span>{blog.publishedAt}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {blog.readTime}</span>
            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {blog.views.toLocaleString()}</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-[#FA8B00] transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
          {blog.excerpt}
        </p>
      </div>
    </Link>
  )
}
