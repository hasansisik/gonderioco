import { InputHTMLAttributes, forwardRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  rightElement?: ReactNode
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, label, rightElement, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={props.id} className="px-1 text-xs font-bold text-slate-800">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full rounded-2xl border border-slate-100 bg-white px-6 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
      </div>
    )
  }
)
AuthInput.displayName = "AuthInput"
