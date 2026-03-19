import { cn } from "@/lib/utils";
import { Smile, SendHorizontal, Paperclip, Image, FileText, X, Loader2, Pencil } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface MessageInputProps {
    onSendMessage: (content: string, fileUrl?: string, fileType?: string) => void;
    onTypingStart: () => void;
    onTypingStop: () => void;
    disabled?: boolean;
    editingMessage?: { _id: string; content: string } | null;
    onCancelEdit?: () => void;
    onSaveEdit?: (content: string) => void;
}

export const MessageInput = ({
    onSendMessage,
    onTypingStart,
    onTypingStop,
    disabled = false,
    editingMessage,
    onCancelEdit,
    onSaveEdit,
}: MessageInputProps) => {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Populate message when editing starts
    useEffect(() => {
        if (editingMessage) {
            setMessage(editingMessage.content);
        } else {
            setMessage("");
        }
    }, [editingMessage]);
    const [showFileTypeDialog, setShowFileTypeDialog] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prev) => prev + emojiData.emoji);
        // We don't close it automatically usually in chat apps, but if desired:
        // setShowEmojiPicker(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMessage(value);

        // Typing indicator logic
        if (value && !isTyping) {
            setIsTyping(true);
            onTypingStart();
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing
        if (value) {
            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
                onTypingStop();
            }, 2000);
        } else {
            setIsTyping(false);
            onTypingStop();
        }
    };

    const handleSend = () => {
        if (!message.trim() || disabled) return;

        if (editingMessage && onSaveEdit) {
            onSaveEdit(message.trim());
        } else {
            onSendMessage(message.trim());
        }
        setMessage("");
        setShowEmojiPicker(false);

        // Stop typing indicator
        if (isTyping) {
            setIsTyping(false);
            onTypingStop();
        }

        // Clear timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => Math.min(prev + 10, 90));
            }, 200);

            const result = await uploadFileToCloudinary(file);

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Determine message type
            let messageType: string;
            if (result.type === 'image') {
                messageType = 'image';
            } else if (result.type === 'video') {
                messageType = 'video';
            } else {
                messageType = 'file';
            }

            // Send message with file
            onSendMessage(file.name, result.url, messageType);
            toast.success("Dosya başarıyla yüklendi!");
        } catch (error) {
            console.error("File upload error:", error);
            toast.error("Dosya yüklenirken bir hata oluştu.");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handlePaperclipClick = () => {
        setShowFileTypeDialog(true);
    };

    const handleFileTypeSelect = (type: 'document' | 'image') => {
        setShowFileTypeDialog(false);
        if (fileInputRef.current) {
            if (type === 'document') {
                fileInputRef.current.accept = ".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx";
            } else {
                fileInputRef.current.accept = "image/*";
            }
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
        // Reset input
        e.target.value = '';
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (isTyping) {
                onTypingStop();
            }
        };
    }, [isTyping, onTypingStop]);

    return (
        <div className="p-3 bg-white border-t border-slate-100 relative">
            {/* Focus overlay for editing */}
            {editingMessage && (
                <div
                    className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[40] transition-all duration-300"
                    onClick={onCancelEdit}
                />
            )}

            {/* File Type Selection Dialog */}
            {showFileTypeDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-4 max-w-sm w-full mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-slate-800">Dosya Türü Seçin</h3>
                            <button
                                onClick={() => setShowFileTypeDialog(false)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <X className="size-5 text-slate-400" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleFileTypeSelect('document')}
                                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all group"
                            >
                                <FileText className="size-8 text-slate-400 group-hover:text-orange-500 transition-colors" />
                                <span className="text-xs font-normal text-slate-600 group-hover:text-orange-500">Döküman</span>
                            </button>
                            <button
                                onClick={() => handleFileTypeSelect('image')}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all group"
                            >
                                <Image className="size-8 text-slate-400 group-hover:text-orange-500 transition-colors" />
                                <span className="text-xs font-normal text-slate-600 group-hover:text-orange-500">Görsel</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
                <div className="mb-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Loader2 className="size-5 text-orange-500 animate-spin" />
                        <span className="text-sm font-normal text-slate-700">Dosya yükleniyor...</span>
                        <span className="ml-auto text-sm font-normal text-orange-500">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}

            <div className={cn(
                "relative flex items-end gap-2 max-w-[1000px] mx-auto transition-all duration-300",
                editingMessage ? "z-[50]" : "z-[10]"
            )}>
                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div
                        ref={emojiPickerRef}
                        className="absolute bottom-16 right-14 z-50 shadow-2xl animate-in zoom-in-95 duration-200"
                    >
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            autoFocusSearch={false}
                            theme={"light" as any}
                            lazyLoadEmojis={true}
                            width={320}
                            height={400}
                        />
                    </div>
                )}

                <div className={cn(
                    "relative flex-1 flex flex-col transition-all duration-300 bg-white",
                    editingMessage ? "rounded-[1.25rem] border border-orange-200 shadow-lg shadow-orange-500/10" : "rounded-full border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-500/10"
                )}>
                    {editingMessage && (
                        <div className="flex items-center justify-between px-3 py-2 bg-orange-50/50 border-b border-orange-100 rounded-t-[1.25rem]">
                            <div className="flex items-center gap-2 overflow-hidden w-full">
                                <div className="w-[3px] h-9 bg-orange-500 rounded-full shrink-0" />
                                <div className="flex flex-col flex-1 overflow-hidden pr-2">
                                    <span className="text-[12px] font-normal text-orange-500 ">Mesajı Düzenle</span>
                                    <span className="text-[12px] text-slate-500 truncate leading-tight mt-0.5">{editingMessage.content}</span>
                                </div>
                            </div>
                            <button
                                onClick={onCancelEdit}
                                className="p-1.5 hover:bg-orange-200/50 rounded-full transition-all shrink-0 text-slate-400 hover:text-slate-600"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    )}

                    <div className="relative flex items-center w-full">
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                                onClick={handlePaperclipClick}
                                disabled={isUploading || disabled}
                                className="p-2 text-slate-400 hover:text-orange-500 hover:bg-slate-100 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Dosya ekle"
                            >
                                <Paperclip className="size-5" />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder={disabled && !isUploading ? "Bu konuşmaya cevap verilemez" : "Mesaj yazın"}
                            value={message}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            disabled={disabled || isUploading}
                            className={cn(
                                "w-full bg-transparent py-3 pl-12 pr-12 text-[14px] font-medium focus:outline-none transition-all",
                                (disabled || isUploading) && "opacity-50 cursor-not-allowed",
                                editingMessage ? "rounded-b-[1.25rem] py-3.5" : "rounded-full"
                            )}
                            autoFocus={!!editingMessage}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                disabled={isUploading || disabled}
                                className={cn(
                                    "p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                    showEmojiPicker ? "text-orange-500 bg-orange-50" : "text-slate-400 hover:text-orange-500 hover:bg-orange-50"
                                )}
                                title="Emoji"
                            >
                                <Smile className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleSend}
                    disabled={!message.trim() || disabled || isUploading}
                    className={cn(
                        "size-[46px] shrink-0 flex items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all mb-0.5",
                        (!message.trim() || disabled || isUploading) &&
                        "opacity-50 cursor-not-allowed hover:scale-100"
                    )}
                >
                    <SendHorizontal className="size-5" strokeWidth={2.5} />
                </button>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};
