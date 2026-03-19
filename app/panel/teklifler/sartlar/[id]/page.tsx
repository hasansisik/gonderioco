"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { createTerm, updateTerm, getTerm } from "@/redux/actions/termActions"
import { Save, ArrowLeft } from "lucide-react"
import RichTextEditor from "@/components/ui/rich-text-editor"

export default function TermFormPage() {
    const router = useRouter()
    const params = useParams()
    const dispatch = useAppDispatch()
    const { term, loading } = useAppSelector((state) => state.term)
    const isEdit = params?.id && params.id !== "new" && params.id !== "yeni"

    const [formData, setFormData] = useState({
        name: "",
        content: ""
    })

    useEffect(() => {
        if (isEdit && params?.id) {
            dispatch(getTerm(params.id as string))
        }
    }, [isEdit, params?.id, dispatch])

    useEffect(() => {
        if (isEdit && term) {
            setFormData({
                name: term.name || "",
                content: term.content || ""
            })
        }
    }, [isEdit, term])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.content) {
            alert("Lütfen tüm alanları doldurun")
            return
        }

        let result: any
        if (isEdit && params?.id) {
            result = await dispatch(updateTerm({
                id: params.id as string,
                termData: formData
            }))
        } else {
            result = await dispatch(createTerm(formData))
        }

        if (createTerm.fulfilled.match(result) || updateTerm.fulfilled.match(result)) {
            router.push("/panel/teklifler/sartlar")
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
                    {/* Term Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-normal text-[#2D3748]">
                            Şart Başlığı *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Örn: Standart Satış Şartları"
                            required
                            className="w-full rounded-2xl border border-slate-100 bg-white px-5 py-3.5 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-normal text-[#2D3748]">
                            Şartlar ve Koşullar *
                        </label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                            placeholder="Şart ve koşulların içeriğini buraya yazın..."
                        />
                    </div>
                </div>
            </div>
        </form>
    )
}
