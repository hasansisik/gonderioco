"use client"

import { useAppSelector } from "@/redux/hook"
import { UserAvatar } from "@/components/ui/user-avatar"

export default function Page() {
  const { user } = useAppSelector((state) => state.user)

  return (
    <div className="flex flex-col gap-6 py-2 font-sans overflow-visible pb-10">
      {/* Welcome Section */}
      <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="shadow-2xl shadow-orange-500/20 overflow-hidden rounded-2xl">
            <UserAvatar
              name={user?.name}
              surname={user?.surname}
              picture={user?.picture || user?.profile?.picture}
              size="xl"
              className="size-14 !rounded-2xl"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800  flex items-center gap-3">
              Merhaba, {user?.name || "Kullanıcı"} 👋
            </h1>
            <p className="text-[11px] text-slate-400 font-normal mt-0.5">İşletmenizin bugünkü özeti ve aktiviteleri</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-10 mt-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800">Panele Hoş Geldiniz</h2>
          <p className="text-sm text-slate-400 mt-1">Dashboard üzerinden işlemlerinizi takip edebilirsiniz.</p>
        </div>
      </div>
    </div>
  )
}
