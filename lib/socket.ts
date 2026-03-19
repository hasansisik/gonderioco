import { socketServer } from "@/config";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
    if (socket && socket.connected) {
        return socket;
    }

    const serverUrl = socketServer;

    socket = io(serverUrl, {
        auth: {
            token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
        console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
    });

    return socket;
};

export const getSocket = (): Socket | null => {
    return socket;
};

export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export default {
    initializeSocket,
    getSocket,
    disconnectSocket,
};
