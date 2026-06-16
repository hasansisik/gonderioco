import Link from "next/link"

export interface AuthToggleProps {
  activeTab: "login" | "register"
}

export function AuthToggle({ activeTab }: AuthToggleProps) {
  return (
    <div className="flex w-full max-w-[320px] rounded-full bg-slate-100 p-1">
      {activeTab === "login" ? (
        <>
          <button
            type="button"
            className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm cursor-default"
          >
            Giriş yap
          </button>
          <Link
            href="/kayitol"
            className="flex-1 rounded-full px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 text-center flex items-center justify-center"
          >
            Kayıt ol
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/"
            className="flex-1 rounded-full px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 text-center flex items-center justify-center"
          >
            Giriş yap
          </Link>
          <button
            type="button"
            className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm cursor-default"
          >
            Kayıt ol
          </button>
        </>
      )}
    </div>
  )
}
