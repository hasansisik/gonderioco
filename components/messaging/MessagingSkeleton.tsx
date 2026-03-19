import { cn } from "@/lib/utils";

export const MessagingSkeleton = () => {
    return (
        <div className="flex-1 overflow-y-auto px-2 space-y-2 no-scrollbar">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    className="flex gap-3 p-3 rounded-2xl border border-transparent animate-pulse"
                >
                    <div className="relative">
                        <div className="size-10 rounded-xl bg-slate-100 shrink-0" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="h-3 w-24 bg-slate-100 rounded-full" />
                            <div className="h-2 w-8 bg-slate-50 rounded-full" />
                        </div>
                        <div className="h-2 w-32 bg-slate-50 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
};
