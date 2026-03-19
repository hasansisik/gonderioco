import { useEffect, useState } from "react";
import { initializeSocket, disconnectSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Get token from localStorage
        const token = localStorage.getItem("accessToken");

        if (!token) {
            return;
        }

        // Initialize socket connection
        const socketInstance = initializeSocket(token);
        setSocket(socketInstance);

        // Connection event handlers
        const handleConnect = () => {
            setIsConnected(true);
        };

        const handleDisconnect = () => {
            setIsConnected(false);
        };

        socketInstance.on("connect", handleConnect);
        socketInstance.on("disconnect", handleDisconnect);

        // Set initial connection state
        setIsConnected(socketInstance.connected);

        // Cleanup on unmount
        return () => {
            socketInstance.off("connect", handleConnect);
            socketInstance.off("disconnect", handleDisconnect);
            // Don't disconnect here - let the socket persist across page navigation
        };
    }, []); // Empty dependency array - only run once on mount

    return {
        socket,
        isConnected,
        disconnect: disconnectSocket,
    };
};
