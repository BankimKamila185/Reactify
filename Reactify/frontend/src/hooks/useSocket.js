import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useSocket = () => {
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    return socketRef.current;
};

export default useSocket;
