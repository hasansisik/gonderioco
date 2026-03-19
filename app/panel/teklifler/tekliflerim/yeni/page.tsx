"use client"

import OfferForm from "@/components/offer-form"
import { PermissionGuard } from "@/components/permission-guard"

export default function NewQuotePage() {
    return (
        <PermissionGuard permission="Teklif Oluştur">
            <OfferForm />
        </PermissionGuard>
    )
}
