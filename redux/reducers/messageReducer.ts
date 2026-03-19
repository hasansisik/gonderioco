import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    getConversations,
    getConversationById,
    getMessages,
    sendMessage,
    markConversationAsRead,
    createConversation,
    getCompanyUsers,
    deleteConversation,
    editMessage,
    deleteMessage,
    addParticipants,
    removeParticipants,
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    Conversation,
    Message,
    CompanyUser,
    Folder,
} from "../actions/messageActions";

interface MessageState {
    conversations: Conversation[];
    activeConversationId: string | null;
    messagesByConversation: Record<string, Message[]>;
    typingUsers: Record<string, string[]>; // conversationId -> userIds
    onlineUsers: string[];
    companyUsers: CompanyUser[];
    folders: Folder[]; // Default for messages
    customerFolders: Folder[];
    loading: boolean;
    messagesLoading: boolean;
    error: string | null;
}

const initialState: MessageState = {
    conversations: [],
    activeConversationId: null,
    messagesByConversation: {},
    typingUsers: {},
    onlineUsers: [],
    companyUsers: [],
    folders: [],
    customerFolders: [],
    loading: false,
    messagesLoading: false,
    error: null,
};

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        // Set active conversation
        setActiveConversation: (state, action: PayloadAction<string | null>) => {
            state.activeConversationId = action.payload;
        },

        // Add a new message from WebSocket
        addMessage: (
            state,
            action: PayloadAction<{ conversationId: string; message: Message }>
        ) => {
            const { conversationId, message } = action.payload;
            if (!state.messagesByConversation[conversationId]) {
                state.messagesByConversation[conversationId] = [];
            }

            // Check if message already exists (avoid duplicates)
            const exists = state.messagesByConversation[conversationId].some(
                (m) => m._id === message._id
            );

            if (!exists) {
                state.messagesByConversation[conversationId].push(message);
            }

            // Update conversation's last message
            const conversation = state.conversations.find((c) => c._id === conversationId);
            if (conversation) {
                conversation.lastMessage = {
                    _id: message._id,
                    content: message.content,
                    sender: {
                        _id: message.sender._id,
                        name: message.sender.name,
                        surname: message.sender.surname,
                    },
                    createdAt: message.createdAt,
                };
                conversation.lastMessageAt = message.createdAt;
            }
        },

        // Add a new conversation from WebSocket
        addConversation: (state, action: PayloadAction<Conversation>) => {
            const conversation = action.payload;

            // Check if conversation already exists (avoid duplicates)
            const exists = state.conversations.some((c) => c._id === conversation._id);

            if (!exists) {
                state.conversations.unshift(conversation);
            }
        },

        // Update typing users
        setTypingUsers: (
            state,
            action: PayloadAction<{ conversationId: string; userIds: string[] }>
        ) => {
            const { conversationId, userIds } = action.payload;
            state.typingUsers[conversationId] = userIds;
        },

        // Add typing user
        addTypingUser: (
            state,
            action: PayloadAction<{ conversationId: string; userId: string }>
        ) => {
            const { conversationId, userId } = action.payload;
            if (!state.typingUsers[conversationId]) {
                state.typingUsers[conversationId] = [];
            }
            if (!state.typingUsers[conversationId].includes(userId)) {
                state.typingUsers[conversationId].push(userId);
            }
        },

        // Remove typing user
        removeTypingUser: (
            state,
            action: PayloadAction<{ conversationId: string; userId: string }>
        ) => {
            const { conversationId, userId } = action.payload;
            if (state.typingUsers[conversationId]) {
                state.typingUsers[conversationId] = state.typingUsers[
                    conversationId
                ].filter((id) => id !== userId);
            }
        },

        // Update online users
        setOnlineUsers: (state, action: PayloadAction<string[]>) => {
            state.onlineUsers = action.payload;
        },

        // Add online user
        addOnlineUser: (state, action: PayloadAction<string>) => {
            if (!state.onlineUsers.includes(action.payload)) {
                state.onlineUsers.push(action.payload);
            }
        },

        // Remove online user
        removeOnlineUser: (state, action: PayloadAction<string>) => {
            state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);
        },

        // Update message read status
        updateMessageReadStatus: (
            state,
            action: PayloadAction<{
                conversationId: string;
                messageId: string;
                userId: string;
                readAt: string;
            }>
        ) => {
            const { conversationId, messageId, userId, readAt } = action.payload;
            const messages = state.messagesByConversation[conversationId];
            if (messages) {
                const message = messages.find((m) => m._id === messageId);
                if (message) {
                    const alreadyRead = message.readBy.some((r) => r.user === userId);
                    if (!alreadyRead) {
                        message.readBy.push({ user: userId, readAt });
                    }
                }
            }
        },

        // Update message delivered status
        updateMessageDeliveredStatus: (
            state,
            action: PayloadAction<{
                conversationId: string;
                messageId: string;
                userId: string;
                deliveredAt: string;
            }>
        ) => {
            const { conversationId, messageId, userId, deliveredAt } = action.payload;
            const messages = state.messagesByConversation[conversationId];
            if (messages) {
                const message = messages.find((m) => m._id === messageId);
                if (message) {
                    const alreadyDelivered = message.deliveredTo.some((d) => d.user === userId);
                    if (!alreadyDelivered) {
                        message.deliveredTo.push({ user: userId, deliveredAt });
                    }
                }
            }
        },

        // Update conversation from WebSocket
        updateConversation: (state, action: PayloadAction<Conversation & { isRemoved?: boolean }>) => {
            if (action.payload.isRemoved) {
                state.conversations = state.conversations.filter(c => c._id !== action.payload._id);
                if (state.activeConversationId === action.payload._id) {
                    state.activeConversationId = null;
                }
                return;
            }

            const index = state.conversations.findIndex(
                (c) => c._id === action.payload._id
            );
            if (index !== -1) {
                state.conversations[index] = action.payload;
            } else {
                state.conversations.unshift(action.payload);
            }
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Get conversations
        builder.addCase(getConversations.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getConversations.fulfilled, (state, action) => {
            state.loading = false;
            state.conversations = action.payload;
        });
        builder.addCase(getConversations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Get conversation by ID
        builder.addCase(getConversationById.fulfilled, (state, action) => {
            const index = state.conversations.findIndex(
                (c) => c._id === action.payload._id
            );
            if (index !== -1) {
                state.conversations[index] = action.payload;
            } else {
                state.conversations.push(action.payload);
            }
        });

        // Get messages
        builder.addCase(getMessages.pending, (state) => {
            state.messagesLoading = true;
            state.error = null;
        });
        builder.addCase(getMessages.fulfilled, (state, action) => {
            state.messagesLoading = false;
            const { conversationId, messages } = action.payload;
            state.messagesByConversation[conversationId] = messages;
        });
        builder.addCase(getMessages.rejected, (state, action) => {
            state.messagesLoading = false;
            state.error = action.payload as string;
        });

        // Send message (HTTP fallback)
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const message = action.payload;
            const conversationId = message.conversation;

            if (!state.messagesByConversation[conversationId]) {
                state.messagesByConversation[conversationId] = [];
            }

            // Check if message already exists
            const exists = state.messagesByConversation[conversationId].some(
                (m) => m._id === message._id
            );

            if (!exists) {
                state.messagesByConversation[conversationId].push(message);
            }
        });

        // Mark conversation as read
        builder.addCase(markConversationAsRead.fulfilled, (state, action) => {
            const conversationId = action.payload;
            const conversation = state.conversations.find((c) => c._id === conversationId);
            if (conversation) {
                conversation.unreadCount = 0;
            }
        });

        // Create conversation
        builder.addCase(createConversation.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createConversation.fulfilled, (state, action) => {
            state.loading = false;
            const exists = state.conversations.find((c) => c._id === action.payload._id);
            if (!exists) {
                state.conversations.unshift(action.payload);
            }
            state.activeConversationId = action.payload._id;
        });
        builder.addCase(createConversation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Get company users
        builder.addCase(getCompanyUsers.fulfilled, (state, action) => {
            state.companyUsers = action.payload;
        });

        // Delete conversation
        builder.addCase(deleteConversation.fulfilled, (state, action) => {
            state.conversations = state.conversations.filter(
                (c) => c._id !== action.payload
            );
            if (state.activeConversationId === action.payload) {
                state.activeConversationId = null;
            }
            delete state.messagesByConversation[action.payload];
        });

        // Edit message
        builder.addCase(editMessage.fulfilled, (state, action) => {
            const { messageId, content } = action.payload;
            // Find and update message in all conversations
            Object.keys(state.messagesByConversation).forEach((conversationId) => {
                const messages = state.messagesByConversation[conversationId];
                const message = messages.find((m) => m._id === messageId);
                if (message) {
                    message.content = content;
                    message.isEdited = true;
                    message.editedAt = new Date().toISOString();
                }
            });
        });

        // Delete message
        builder.addCase(deleteMessage.fulfilled, (state, action) => {
            const { messageId, conversationId } = action.payload;
            if (state.messagesByConversation[conversationId]) {
                state.messagesByConversation[conversationId] = state.messagesByConversation[
                    conversationId
                ].filter((m) => m._id !== messageId);
            }
        });

        // Add participants
        builder.addCase(addParticipants.fulfilled, (state, action) => {
            const updatedConversation = action.payload;
            const index = state.conversations.findIndex((c) => c._id === updatedConversation._id);
            if (index !== -1) {
                state.conversations[index] = updatedConversation;
            }
        });

        // Remove participants
        builder.addCase(removeParticipants.fulfilled, (state, action) => {
            const updatedConversation = action.payload;
            const index = state.conversations.findIndex((c) => c._id === updatedConversation._id);
            if (index !== -1) {
                state.conversations[index] = updatedConversation;
            }
        });

        // Get folders
        builder.addCase(getFolders.fulfilled, (state, action) => {
            const { folders, type } = action.payload;
            if (type === "customer") {
                state.customerFolders = folders;
            } else {
                state.folders = folders;
            }
        });

        // Create folder
        builder.addCase(createFolder.fulfilled, (state, action) => {
            if (action.payload.type === 'customer') {
                state.customerFolders.unshift(action.payload);
            } else {
                state.folders.unshift(action.payload);
            }
        });

        // Update folder
        builder.addCase(updateFolder.fulfilled, (state, action) => {
            const folder = action.payload;
            if (folder.type === 'customer') {
                const index = state.customerFolders.findIndex((f) => f._id === folder._id);
                if (index !== -1) state.customerFolders[index] = folder;
            } else {
                const index = state.folders.findIndex((f) => f._id === folder._id);
                if (index !== -1) state.folders[index] = folder;
            }
        });

        // Delete folder
        builder.addCase(deleteFolder.fulfilled, (state, action) => {
            const folderId = action.payload;
            state.folders = state.folders.filter((f) => f._id !== folderId);
            state.customerFolders = state.customerFolders.filter((f) => f._id !== folderId);
        });
    },
});

export const {
    setActiveConversation,
    addMessage,
    addConversation,
    setTypingUsers,
    addTypingUser,
    removeTypingUser,
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    updateMessageReadStatus,
    updateMessageDeliveredStatus,
    updateConversation,
    clearError,
} = messageSlice.actions;

export default messageSlice.reducer;
