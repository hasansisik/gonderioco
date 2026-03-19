"use client"

import { cn } from "@/lib/utils"

interface UserAvatarProps {
    name?: string
    surname?: string
    picture?: string
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
}

export function UserAvatar({ name, surname, picture, size = "md", className }: UserAvatarProps) {
    const sizeClasses = {
        sm: "size-8 text-[10px]",
        md: "size-10 text-xs",
        lg: "size-12 text-sm",
        xl: "size-16 text-base"
    }

    const getInitials = () => {
        const firstInitial = name?.trim()?.charAt(0)?.toUpperCase() || ""
        const lastInitial = surname?.trim()?.charAt(0)?.toUpperCase() || ""
        const initials = `${firstInitial}${lastInitial}`.trim()
        if (!initials) return "?"
        return initials
    }

    const getColorFromName = () => {
        const fullName = `${name || ""}${surname || ""}`
        // 6 colors: mor, mavi, kırmızı, turuncu, yeşil, siyah
        const colors = [
            "bg-violet-600",   // mor
            "bg-blue-600",     // mavi
            "bg-rose-600",     // kırmızı
            "bg-orange-500",   // turuncu
            "bg-emerald-600",  // yeşil
            "bg-slate-800",    // siyah
        ]
        const index = fullName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return colors[index % colors.length]
    }

    const DEFAULT_LOGO_URL = "https://res.cloudinary.com/da2qwsrbv/image/upload/v1769994688/sdctklf_rytqco.png"
    const hasPicture = picture && picture !== DEFAULT_LOGO_URL

    return (
        <div className={cn(
            "relative flex items-center justify-center rounded-xl overflow-hidden font-bold text-white shrink-0",
            sizeClasses[size],
            !hasPicture && getColorFromName(),
            className
        )}>
            {hasPicture ? (
                <img
                    src={picture}
                    alt={`${name} ${surname}`}
                    className="h-full w-full object-cover"
                />
            ) : (
                <span>{getInitials()}</span>
            )}
        </div>
    )
}
