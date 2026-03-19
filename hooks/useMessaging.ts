import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useSocket } from "./useSocket";
import {
    addMessage,
    addConversation,
    addTypingUser,
    removeTypingUser,
    addOnlineUser,
    removeOnlineUser,
    setOnlineUsers,
    updateMessageReadStatus,
    updateMessageDeliveredStatus,
    updateConversation,
} from "@/redux/reducers/messageReducer";
import { addNotification } from "@/redux/reducers/notificationReducer";
import { Message, Conversation } from "@/redux/actions/messageActions";

interface TypingEvent {
    conversationId: string;
    userId: string;
    user: {
        _id: string;
        name: string;
        surname: string;
    };
}

interface MessageEvent {
    message: Message;
    conversationId: string;
}

interface ConversationEvent {
    conversation: Conversation;
}

interface MessageReadEvent {
    messageId: string;
    userId: string;
    readAt: string;
}

interface MessageDeliveredEvent {
    messageId: string;
    deliveredTo: string[];
}

interface UserStatusEvent {
    userId: string;
    status: "online" | "offline";
    lastSeen?: string;
}

export const useMessaging = (listen: boolean = false) => {
    const dispatch = useAppDispatch();
    const { socket, isConnected } = useSocket();
    const { activeConversationId } = useAppSelector((state) => state.message);
    const { user } = useAppSelector((state) => state.user);

    // Listen for new messages
    useEffect(() => {
        if (!socket || !listen) return;

        const handleNewMessage = (data: MessageEvent) => {
            dispatch(
                addMessage({
                    conversationId: data.conversationId,
                    message: data.message,
                })
            );

            // Play notification sound if message is not from current user
            const currentUserId = user?._id || user?.userId;
            const senderId = data.message.sender?._id || data.message.sender;

            if (currentUserId && String(senderId) !== String(currentUserId)) {
                const audio = new Audio("/sounds/new-notification.mp3");
                audio.play().catch(e => console.log("Audio play error:", e));
            }

            // Auto-mark as read if conversation is active
            if (activeConversationId === data.conversationId) {
                socket.emit("mark_as_read", {
                    messageId: data.message._id,
                    conversationId: data.conversationId,
                });
            }
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [socket, dispatch, activeConversationId, user]);

    // Listen for new conversations
    useEffect(() => {
        if (!socket || !listen) return;

        const handleNewConversation = (data: ConversationEvent) => {
            dispatch(addConversation(data.conversation));
        };

        const handleConversationUpdated = (data: { conversation: Conversation & { isRemoved?: boolean } }) => {
            dispatch(updateConversation(data.conversation));
        };

        socket.on("new_conversation", handleNewConversation);
        socket.on("conversation_updated", handleConversationUpdated);

        return () => {
            socket.off("new_conversation", handleNewConversation);
            socket.off("conversation_updated", handleConversationUpdated);
        };
    }, [socket, dispatch, listen]);

    // Listen for typing indicators
    useEffect(() => {
        if (!socket || !listen) return;

        const handleUserTyping = (data: TypingEvent) => {
            dispatch(
                addTypingUser({
                    conversationId: data.conversationId,
                    userId: data.userId,
                })
            );
        };

        const handleUserStoppedTyping = (data: { conversationId: string; userId: string }) => {
            dispatch(
                removeTypingUser({
                    conversationId: data.conversationId,
                    userId: data.userId,
                })
            );
        };

        socket.on("user_typing", handleUserTyping);
        socket.on("user_stopped_typing", handleUserStoppedTyping);

        return () => {
            socket.off("user_typing", handleUserTyping);
            socket.off("user_stopped_typing", handleUserStoppedTyping);
        };
    }, [socket, dispatch]);

    // Listen for read receipts
    useEffect(() => {
        if (!socket || !listen) return;

        const handleMessageRead = (data: MessageReadEvent & { conversationId?: string }) => {
            if (activeConversationId && data.conversationId) {
                dispatch(
                    updateMessageReadStatus({
                        conversationId: data.conversationId || activeConversationId,
                        messageId: data.messageId,
                        userId: data.userId,
                        readAt: data.readAt,
                    })
                );
            }
        };

        const handleMessageDelivered = (data: MessageDeliveredEvent) => {
            // Update delivered status for all recipients
            data.deliveredTo.forEach((userId) => {
                if (activeConversationId) {
                    dispatch(
                        updateMessageDeliveredStatus({
                            conversationId: activeConversationId,
                            messageId: data.messageId,
                            userId,
                            deliveredAt: new Date().toISOString(),
                        })
                    );
                }
            });
        };

        socket.on("message_read", handleMessageRead);
        socket.on("message_delivered", handleMessageDelivered);

        return () => {
            socket.off("message_read", handleMessageRead);
            socket.off("message_delivered", handleMessageDelivered);
        };
    }, [socket, dispatch, activeConversationId]);

    // Listen for user status changes
    useEffect(() => {
        if (!socket || !listen) return;

        const handleUserStatusChanged = (data: UserStatusEvent) => {
            if (data.status === "online") {
                dispatch(addOnlineUser(data.userId));
            } else {
                dispatch(removeOnlineUser(data.userId));
            }
        };

        const handleOnlineUsersList = (userIds: string[]) => {
            dispatch(setOnlineUsers(userIds));
        };

        socket.on("user_status_changed", handleUserStatusChanged);
        socket.on("online_users_list", handleOnlineUsersList);

        // Listen for generic notifications
        socket.on("new_notification", (notification) => {
            dispatch(addNotification(notification));
            const audio = new Audio("/sounds/new-notification.mp3");
            audio.play().catch(e => console.log("Audio play error:", e));
        });

        // Request current online users
        socket.emit("get_online_users");

        return () => {
            socket.off("user_status_changed", handleUserStatusChanged);
            socket.off("online_users_list", handleOnlineUsersList);
        };
    }, [socket, dispatch, listen]);

    // Send message via WebSocket
    const sendMessage = useCallback(
        (data: {
            conversationId: string;
            content: string;
            messageType?: string;
            tempId?: string;
        }) => {
            if (!socket || !isConnected) {
                console.error("Socket not connected");
                return;
            }

            socket.emit("send_message", data);
        },
        [socket, isConnected]
    );

    // Emit typing indicator
    const startTyping = useCallback(
        (conversationId: string) => {
            if (!socket || !isConnected) return;
            socket.emit("typing_start", { conversationId });
        },
        [socket, isConnected]
    );

    const stopTyping = useCallback(
        (conversationId: string) => {
            if (!socket || !isConnected) return;
            socket.emit("typing_stop", { conversationId });
        },
        [socket, isConnected]
    );

    // Mark conversation as read
    const markConversationAsRead = useCallback(
        (conversationId: string) => {
            if (!socket || !isConnected) return;
            socket.emit("mark_conversation_read", { conversationId });
        },
        [socket, isConnected]
    );

    return {
        isConnected,
        sendMessage,
        startTyping,
        stopTyping,
        markConversationAsRead,
    };
};
