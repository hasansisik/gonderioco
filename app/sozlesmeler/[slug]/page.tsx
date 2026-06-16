import { agreements } from "@/data/agreements"
import { notFound } from "next/navigation"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export async function generateStaticParams() {
  return agreements.map((agreement) => ({
    slug: agreement.slug,
  }))
}

export default async function AgreementPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const agreement = agreements.find(a => a.slug === slug)

  if (!agreement) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header theme="light" />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-12 pb-8 border-b border-slate-200">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              {agreement.title}
            </h1>
            <p className="text-slate-500 font-medium">
              Son Güncelleme: {agreement.lastUpdated}
            </p>
          </div>

          {/* Content */}
          <article 
            className="prose prose-lg max-w-none 
                       prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 prose-headings:mt-10 prose-headings:mb-6
                       prose-h2:text-2xl prose-h3:text-xl
                       prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                       prose-ul:text-slate-600 prose-li:mb-2
                       prose-a:text-[#FA8B00] prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-slate-800"
            dangerouslySetInnerHTML={{ __html: agreement.content }}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
