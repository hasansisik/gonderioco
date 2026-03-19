// Temporary helper file for message edit/delete handlers
import { editMessage, deleteMessage } from "@/redux/actions/messageActions";
import { toast } from "sonner";

export const createMessageHandlers = (dispatch: any, conversationId: string) => ({
    handleEdit: async (messageId: string, currentContent: string) => {
        const newContent = window.prompt("Mesajı düzenle:", currentContent);
        if (newContent && newContent.trim() && newContent !== currentContent) {
            try {
                await dispatch(editMessage({ messageId, content: newContent.trim() })).unwrap();
                toast.success("Mesaj düzenlendi");
            } catch (error: any) {
                toast.error(error || "Mesaj düzenlenemedi");
            }
        }
    },

    handleDelete: async (messageId: string) => {
        if (window.confirm("Bu mesajı silmek istediğinizden emin misiniz?")) {
            try {
                await dispatch(deleteMessage({ messageId, conversationId })).unwrap();
                toast.success("Mesaj silindi");
            } catch (error: any) {
                toast.error(error || "Mesaj silinemedi");
            }
        }
    }
});
