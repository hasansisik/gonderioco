import { ButtonHTMLAttributes, ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  children: ReactNode
}

export function AuthButton({ 
  loading, 
  loadingText = "Yükleniyor...", 
  children, 
  className,
  disabled,
  ...props 
}: AuthButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={cn(
        "mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-[#FA8B00] py-4 text-[15px] font-bold text-white shadow-xl shadow-orange-500/20 hover:bg-[#E67E00] transition-all disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="size-5 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}
