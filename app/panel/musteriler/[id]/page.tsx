"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllCustomers } from "@/redux/actions/customerActions"
import CustomerForm from "@/components/customer-form"

export default function EditCustomerPage() {
    const params = useParams()
    const id = params.id as string
    const dispatch = useAppDispatch()
    const { customers, loading } = useAppSelector((state) => state.customer)
    const [customer, setCustomer] = useState<any>(null)

    useEffect(() => {
        if (customers.length === 0) {
            dispatch(getAllCustomers())
        }
    }, [dispatch, customers.length])

    useEffect(() => {
        if (customers.length > 0) {
            const found = customers.find((c: any) => c._id === id)
            if (found) {
                setCustomer(found)
            }
        }
    }, [customers, id])

    if (loading && !customer) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (!customer && !loading) {
        return (
            <div className="text-center py-20 text-slate-500">
                Müşteri bulunamadı.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <CustomerForm initialData={customer} isEdit={true} />
        </div>
    )
}
