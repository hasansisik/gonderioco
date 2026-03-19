import { useAppDispatch } from "@/redux/hook";
import { respondToCustomerRequest } from "@/redux/actions/companyActions";
import { toast } from "sonner";
import { Check, X, User, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/user-avatar";

interface Request {
    _id: string;
    buyer: {
        _id: string;
        name: string;
        surname: string;
        email: string;
    };
    createdAt: string;
}

export function CustomerRequestsList({ requests, onUpdate }: { requests: Request[], onUpdate: () => void }) {
    const dispatch = useAppDispatch();
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleAction = async (requestId: string, response: 'accepted' | 'rejected') => {
        setProcessingId(requestId + response);
        const result = await dispatch(respondToCustomerRequest({ requestId, response }));
        setProcessingId(null);

        if (respondToCustomerRequest.fulfilled.match(result)) {
            toast.success(response === 'accepted' ? "Müşteri kabul edildi!" : "Başvuru reddedildi.");
            onUpdate();
        } else {
            toast.error(result.payload as string || "Bir hata oluştu.");
        }
    };

    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <User className="size-8 opacity-20 mb-2" />
                <p className="text-sm font-medium text-slate-500">Bekleyen Başvuru Yok</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {requests.map((request) => (
                <div key={request._id} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <UserAvatar
                            name={request.buyer.name}
                            surname={request.buyer.surname}
                            size="md"
                        />
                        <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-slate-800">
                                {request.buyer.name} {request.buyer.surname}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium font-sans">
                                <Mail className="size-3" />
                                {request.buyer.email}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleAction(request._id, 'rejected')}
                            disabled={!!processingId}
                            className="size-9 rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all flex items-center justify-center group/btn"
                            title="Reddet"
                        >
                            {processingId === request._id + 'rejected' ? (
                                <Loader2 className="size-4 animate-spin text-rose-500" />
                            ) : (
                                <X className="size-4" strokeWidth={3} />
                            )}
                        </button>
                        <button
                            onClick={() => handleAction(request._id, 'accepted')}
                            disabled={!!processingId}
                            className="size-9 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                            title="Kabul Et"
                        >
                            {processingId === request._id + 'accepted' ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Check className="size-4" strokeWidth={3} />
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
