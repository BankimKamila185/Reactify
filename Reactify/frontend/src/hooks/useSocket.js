import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Singleton socket instance
let socketInstance = null;

export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Create singleton socket if it doesn't exist
        if (!socketInstance) {
            socketInstance = io(SOCKET_URL, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5
            });

            socketInstance.on('connect', () => {
                console.log('✅ Socket connected:', socketInstance.id);
            });

            socketInstance.on('disconnect', () => {
                console.log('❌ Socket disconnected');
            });

            socketInstance.on('error', (error) => {
                console.error('Socket error:', error);
            });
        }

        // Set the socket to trigger re-render
        setSocket(socketInstance);

        // No cleanup - keep socket alive for app lifetime
    }, []);

    return socket;
};

export default useSocket;

