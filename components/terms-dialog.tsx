"use client"

import React from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { termsContent } from "@/data/termsContent"

interface TermsDialogProps {
    isOpen: boolean
    onClose: () => void
    onAccept: () => void
}

export function TermsDialog({ isOpen, onClose, onAccept }: TermsDialogProps) {
    const handleAccept = () => {
        onAccept()
        onClose()
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="max-w-[500px] max-h-[80vh] flex flex-col gap-6 overflow-hidden bg-white p-8 rounded-[2rem] border-none shadow-2xl">
                <AlertDialogHeader className="p-0 space-y-4">
                    <AlertDialogTitle className="text-xl font-bold text-slate-800 text-center">
                        {termsContent.title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="hidden">
                        Terms and conditions content
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                        {termsContent.content}
                    </div>
                </div>

                <AlertDialogFooter className="p-0 sm:justify-center">
                    <AlertDialogAction
                        onClick={handleAccept}
                        className="w-full max-w-[200px] rounded-full bg-[#FA8B00] py-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-[#E67E00] transition-all"
                    >
                        {termsContent.buttonText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
