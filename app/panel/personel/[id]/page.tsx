"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllStaff } from "@/redux/actions/staffActions"
import PersonnelForm from "@/components/personnel-form"

export default function EditPersonnelPage() {
    const params = useParams()
    const id = params.id as string
    const dispatch = useAppDispatch()
    const { staffList, loading } = useAppSelector((state) => state.staff)
    const [staff, setStaff] = useState<any>(null)

    useEffect(() => {
        if (!staffList || staffList.length === 0) {
            dispatch(getAllStaff())
        }
    }, [dispatch, staffList])

    useEffect(() => {
        if (staffList && staffList.length > 0) {
            const found = staffList.find((s: any) => s._id === id)
            if (found) {
                setStaff(found)
            }
        }
    }, [staffList, id])

    if (loading && !staff) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (!staff && !loading) {
        return (
            <div className="text-center py-20 text-slate-500">
                Personel bulunamadı.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <PersonnelForm initialData={staff} isEdit={true} />
        </div>
    )
}
