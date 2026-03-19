"use client"

import { useEffect } from "react"
import { useSocket } from "@/hooks/useSocket"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/redux/hook"
import { logout } from "@/redux/actions/userActions"
import { toast } from "sonner"

export function SocketListener() {
    const { socket } = useSocket()
    const router = useRouter()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!socket) return

        const handleForceLogout = (data: { message: string }) => {
            toast.error(data.message || "Oturumunuz sonlandırıldı.", {
                duration: 5000,
            })

            // Clear local states and redirect
            dispatch(logout())

            // After logout action clears redux and localStorage
            setTimeout(() => {
                router.push("/giris")
            }, 1000)
        }

        socket.on("force_logout", handleForceLogout)

        return () => {
            socket.off("force_logout", handleForceLogout)
        }
    }, [socket, dispatch, router])

    return null
}
