import React from "react"
import { Star } from "lucide-react"

interface RatingCardProps {
    rating: number
    count: number
}

export function RatingCard({ rating, count }: RatingCardProps) {
    return (
        <div className="flex-1 w-full flex items-center justify-between p-6 bg-yellow-50/50 rounded-3xl border border-yellow-100 border-dashed">
            <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-white flex items-center justify-center text-yellow-500 shadow-sm border border-yellow-100">
                    <Star className="size-5" />
                </div>
                <div>
                    <h4 className="text-[13px] font-normal text-yellow-900">Müşteri Memnuniyeti</h4>
                    <p className="text-[10px] text-yellow-700/60 font-medium font-sans italic">
                        Müşterilerinizin size verdiği ortalama puan
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                    <span className="text-lg font-semibold text-slate-800 leading-none">{rating?.toFixed(1) || "0.0"}</span>
                    <span className="text-[11px] font-medium text-slate-500">{count || 0} Değerlendirme</span>
                </div>
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`size-4 ${star <= Math.round(rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-200"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
