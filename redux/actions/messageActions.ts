import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface Conversation {
    _id: string;
    type: "direct" | "group";
    participants: Array<{
        _id: string;
        participant: {
            _id: string;
            name: string;
            surname: string;
            email: string;
            profile?: {
                picture: string;
            };
            showOnlineStatus?: boolean;
        };
        onModel: "User" | "Staff";
    }>;
    admins?: Array<{
        admin: string;
        onModel: "User" | "Staff";
    }>;
    name?: string;
    avatar?: string;
    description?: string;
    lastMessage?: {
        _id: string;
        content: string;
        sender: {
            _id: string;
            name: string;
            surname: string;
        };
        createdAt: string;
    };
    lastMessageAt?: string;
    unreadCount: number;
    isMassMessage?: boolean;
    isReadOnly?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Folder {
    _id: string;
    name: string;
    color: string;
    items: string[];
    type: "message" | "customer";
    order: number;
}

export interface Message {
    _id: string;
    conversation: string;
    sender: {
        _id: string;
        name: string;
        surname: string;
        email: string;
        profile?: {
            picture: string;
        };
    };
    senderModel: "User" | "Staff";
    messageType: "text" | "image" | "video" | "audio" | "file";
    content: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    thumbnail?: string;
    readBy: Array<{
        user: string;
        readAt: string;
    }>;
    deliveredTo: Array<{
        user: string;
        deliveredAt: string;
    }>;
    replyTo?: {
        _id: string;
        content: string;
        sender: string;
        messageType: string;
    };
    isEdited: boolean;
    editedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CompanyUser {
    _id: string;
    name: string;
    surname: string;
    email: string;
    userType?: string;
    profile?: {
        picture: string;
    };
    showOnlineStatus?: boolean;
    modelType: "User" | "Staff";
}

export interface SendMessagePayload {
    conversationId: string;
    content: string;
    messageType?: "text" | "image" | "video" | "audio" | "file";
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    thumbnail?: string;
    replyTo?: string;
}

export interface CreateConversationPayload {
    type: "direct" | "group";
    participantIds: string[];
    name?: string;
    avatar?: string;
    description?: string;
}

// Helper to get auth headers from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all conversations for the current user
export const getConversations = createAsyncThunk(
    "message/getConversations",
    async (_, thunkAPI) => {
        try {
            const { data } = await axios.get(`${server}/conversations`, {
                withCredentials: true,
                headers: getAuthHeaders(),
            });
            return data.conversations as Conversation[];
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch conversations"
            );
        }
    }
);

// Get a single conversation by ID
export const getConversationById = createAsyncThunk(
    "message/getConversationById",
    async (conversationId: string, thunkAPI) => {
        try {
            const { data } = await axios.get(
                `${server}/conversations/${conversationId}`,
                {
                    withCredentials: true,
                    headers: getAuthHeaders(),
                }
            );
            return data.conversation as Conversation;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch conversation"
            );
        }
    }
);

// Get messages for a specific conversation
export const getMessages = createAsyncThunk(
    "message/getMessages",
    async (
        { conversationId, page = 1 }: { conversationId: string; page?: number },
        thunkAPI
    ) => {
        try {
            const { data } = await axios.get(
                `${server}/messages/${conversationId}?page=${page}&limit=50`,
                {
                    withCredentials: true,
                    headers: getAuthHeaders(),
                }
            );
            return {
                conversationId,
                messages: data.messages as Message[],
                pagination: data.pagination,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch messages"
            );
        }
    }
);

// Send a message (HTTP fallback)
export const sendMessage = createAsyncThunk(
    "message/sendMessage",
    async (payload: SendMessagePayload, thunkAPI) => {
        try {
            const { data } = await axios.post(`${server}/messages`, payload, {
                withCredentials: true,
                headers: getAuthHeaders(),
            });
            return data.message as Message;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to send message"
            );
        }
    }
);

// Mark conversation as read
export const markConversationAsRead = createAsyncThunk(
    "message/markConversationAsRead",
    async (conversationId: string, thunkAPI) => {
        try {
            await axios.put(
                `${server}/messages/conversation/${conversationId}/read`,
                {},
                {
                    withCredentials: true,
                    headers: getAuthHeaders(),
                }
            );
            return conversationId;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to mark as read"
            );
        }
    }
);

// Create a new conversation
export const createConversation = createAsyncThunk(
    "message/createConversation",
    async (payload: CreateConversationPayload, thunkAPI) => {
        try {
            const { data } = await axios.post(`${server}/conversations`, payload, {
                withCredentials: true,
                headers: getAuthHeaders(),
            });
            return data.conversation as Conversation;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to create conversation"
            );
        }
    }
);

// Get company users for creating conversations
export const getCompanyUsers = createAsyncThunk(
    "message/getCompanyUsers",
    async (search: string = "", thunkAPI) => {
        try {
            const { data } = await axios.get(
                `${server}/conversations/users?search=${search}`,
                {
                    withCredentials: true,
                    headers: getAuthHeaders(),
                }
            );
            return data.users as CompanyUser[];
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch users"
            );
        }
    }
);

// Delete conversation
export const deleteConversation = createAsyncThunk(
    "message/deleteConversation",
    async (conversationId: string, thunkAPI) => {
        try {
            await axios.delete(`${server}/conversations/${conversationId}`, {
                withCredentials: true,
                headers: getAuthHeaders(),
            });
            return conversationId;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete conversation"
            );
        }
    }
);

// Edit a message
export const editMessage = createAsyncThunk(
    "message/editMessage",
    async ({ messageId, content }: { messageId: string; content: string }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.patch(
                `${server}/messages/${messageId}`,
                { content },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                    withCredentials: true,
                }
            );
            return { messageId, content, message: data.message };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Mesaj düzenlenirken bir hata oluştu"
            );
        }
    }
);

// Delete a message
export const deleteMessage = createAsyncThunk(
    "message/deleteMessage",
    async ({ messageId, conversationId }: { messageId: string; conversationId: string }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(
                `${server}/messages/${messageId}`,
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                    withCredentials: true,
                }
            );
            return { messageId, conversationId };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Mesaj silinirken bir hata oluştu"
            );
        }
    }
);

// Add participants to a conversation
export const addParticipants = createAsyncThunk(
    "message/addParticipants",
    async (
        { conversationId, participantIds }: { conversationId: string; participantIds: string[] },
        thunkAPI
    ) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(
                `${server}/conversations/${conversationId}/participants`,
                { participantIds },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                    withCredentials: true,
                }
            );
            return data.conversation as Conversation;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Katılımcı eklenirken bir hata oluştu"
            );
        }
    }
);

// Remove participants from a conversation
export const removeParticipants = createAsyncThunk(
    "message/removeParticipants",
    async (
        { conversationId, participantIds }: { conversationId: string; participantIds: string[] },
        thunkAPI
    ) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.delete(
                `${server}/conversations/${conversationId}/participants`,
                {
                    data: { participantIds },
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                    withCredentials: true,
                }
            );
            return data.conversation as Conversation;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Katılımcı çıkarılırken bir hata oluştu"
            );
        }
    }
);

export const getFolders = createAsyncThunk(
    "message/getFolders",
    async (type: "message" | "customer" | undefined, thunkAPI) => {
        try {
            const url = type ? `${server}/folders?type=${type}` : `${server}/folders`;
            const { data } = await axios.get(url, {
                withCredentials: true,
                headers: getAuthHeaders(),
            });
            return { folders: data.folders, type } as { folders: Folder[], type: "message" | "customer" | undefined };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Klasörler yüklenirken bir hata oluştu"
            );
        }
    }
);

export const createFolder = createAsyncThunk(
    "message/createFolder",
    async (payload: { name: string; items?: string[]; color?: string; type?: "message" | "customer" }, thunkAPI) => {
        try {
            const { data } = await axios.post(`${server}/folders`, payload, {
                withCredentials: true,
                headers: getAuthHeaders(),
            });
            return data.folder as Folder;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Klasör oluşturulurken bir hata oluştu"
            );
        }
    }
);

export const updateFolder = createAsyncThunk(
    "message/updateFolder",
    async ({ id, ...payload }: { id: string; name?: string; items?: string[]; color?: string; order?: number }, thunkAPI) => {
        try {
            const { data } = await axios.patch(`${server}/folders/${id}`, payload, {
                withCredentials: true,
                headers: getAuthHeaders(),
            });
            return data.folder as Folder;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Klasör güncellenirken bir hata oluştu"
            );
        }
    }
);

export const deleteFolder = createAsyncThunk(
    "message/deleteFolder",
    async (id: string, thunkAPI) => {
        try {
            await axios.delete(`${server}/folders/${id}`, {
                withCredentials: true,
                headers: getAuthHeaders(),
            });
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Klasör silinirken bir hata oluştu"
            );
        }
    }
);
