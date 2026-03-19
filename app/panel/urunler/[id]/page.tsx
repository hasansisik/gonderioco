"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllProducts } from "@/redux/actions/productActions"
import ProductForm from "@/components/product-form"

export default function EditProductPage() {
    const params = useParams()
    const id = params.id as string
    const dispatch = useAppDispatch()
    const { products, loading } = useAppSelector((state) => state.product)
    const [product, setProduct] = useState<any>(null)

    useEffect(() => {
        if (products.length === 0) {
            dispatch(getAllProducts())
        }
    }, [dispatch, products.length])

    useEffect(() => {
        if (products.length > 0) {
            const found = products.find((p: any) => p._id === id)
            if (found) {
                setProduct(found)
            }
        }
    }, [products, id])

    if (loading && !product) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (!product && !loading) {
        return (
            <div className="text-center py-20 text-slate-500 font-medium">
                Ürün bulunamadı.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <ProductForm initialData={product} isEdit={true} />
        </div>
    )
}
