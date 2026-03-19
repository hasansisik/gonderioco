"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { createTemplate, updateTemplate, getTemplate } from "@/redux/actions/templateActions"
import { Save, ArrowLeft } from "lucide-react"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { predefinedTemplates } from "@/data/templates"

export default function TemplateFormPage() {
    const router = useRouter()
    const params = useParams()
    const dispatch = useAppDispatch()
    const { template, loading } = useAppSelector((state) => state.template)
    const isEdit = params?.id && params.id !== "new" && params.id !== "yeni"

    const [formData, setFormData] = useState({
        name: "",
        content: ""
    })

    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")

    useEffect(() => {
        if (isEdit && params?.id) {
            dispatch(getTemplate(params.id as string))
        }
    }, [isEdit, params?.id, dispatch])

    const handleSelectTemplate = (id: string) => {
        setSelectedTemplateId(id)
        if (!id) return;
        const selected = predefinedTemplates.find((t: any) => t.id === id)
        if (selected) {
            setFormData({
                name: `${selected.name} (Kopya)`,
                content: selected.content || ""
            })
        }
    }

    useEffect(() => {
        if (isEdit && template) {
            setFormData({
                name: template.name || "",
                content: template.content || ""
            })
        }
    }, [isEdit, template])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.content) {
            alert("Lütfen tüm alanları doldurun")
            return
        }

        let result: any
        if (isEdit && params?.id) {
            result = await dispatch(updateTemplate({
                id: params.id as string,
                templateData: formData
            }))
        } else {
            result = await dispatch(createTemplate(formData))
        }

        if (createTemplate.fulfilled.match(result) || updateTemplate.fulfilled.match(result)) {
            router.push("/panel/teklifler/teklif-sablonu")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        <span className="text-sm font-medium">Geri Dön</span>
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl bg-[#F67E06] px-8 py-3 text-sm font-normal text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-70"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <Save className="size-4" />
                        )}
                        <span>{isEdit ? "Güncelle" : "Kaydet"}</span>
                    </button>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-6">
                    {/* Select Existing Template Cards (Only when creating new) */}
                    {!isEdit && predefinedTemplates && typeof predefinedTemplates !== 'undefined' && predefinedTemplates.length > 0 && (
                        <div className="flex flex-col gap-4 mt-2 mb-4">
                            <div>
                                <h3 className="text-sm font-normal text-slate-800">Ön Ayarlı Şablonlar</h3>
                                <p className="text-xs text-slate-400 font-normal mt-1">Hızlıca başlamak için taslak olarak aşağıdaki örnek şablonlardan birini seçebilirsiniz.</p>
                            </div>
                            <div className="flex overflow-x-auto gap-6 pb-8 pt-4 px-4 snap-x no-scrollbar -mx-4">
                                {predefinedTemplates.map((t) => (
                                    <div key={t.id} className="flex flex-col gap-3 shrink-0 snap-start">
                                        <div
                                            onClick={() => handleSelectTemplate(t.id)}
                                            className={`cursor-pointer group aspect-[1/1.414] w-[14rem] flex flex-col rounded-md transition-all duration-300 relative overflow-hidden bg-white ${selectedTemplateId === t.id
                                                ? "border-2 border-orange-500 shadow-md scale-[1.02]"
                                                : "border border-slate-200 shadow-sm hover:border-orange-300 hover:shadow-lg hover:-translate-y-1"
                                                }`}
                                        >
                                            {/* Preview Content Area Using Real HTML Scale */}
                                            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-md">
                                                <div className="absolute top-0 left-0 origin-top-left pl-20 pr-16 py-16" style={{ width: '300%', height: '300%', transform: 'scale(0.3333)' }}>
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: t.content }}
                                                        className="prose prose-lg max-w-none text-slate-800 leading-relaxed"
                                                    />
                                                </div>
                                            </div>

                                            {/* Check Icon For Selection */}
                                            <div className={`absolute top-3 right-3 size-5 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm z-10 ${selectedTemplateId === t.id ? "bg-orange-500 text-white opacity-100 scale-100" : "bg-white border text-slate-300 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100"
                                                }`}>
                                                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Name Label Below Card */}
                                        <div className="flex flex-col items-center text-center px-1">
                                            <span className={`text-xs font-semibold  ${selectedTemplateId === t.id ? "text-orange-600" : "text-slate-700 group-hover:text-slate-900"}`}>
                                                {t.name}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Template Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-normal text-[#2D3748]">
                            Şablon Adı *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Örn: Standart Proje Teklifi"
                            required
                            className="w-full rounded-2xl border border-slate-100 bg-white px-5 py-3.5 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-normal text-[#2D3748]">
                            Evrak İçeriği *
                        </label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                            placeholder="Şablon içeriğinizi buraya yazın..."
                        />
                    </div>
                </div>
            </div>
        </form>
    )
}
