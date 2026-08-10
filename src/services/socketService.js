import { io } from 'socket.io-client';
import { BASE_URL } from '../api/chatApi';

const SOCKET_URL = 'https://chat-app-backend-production-ce3f.up.railway.app';

let socket = null;

export function getSocket() {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            forceNew: false,
            reconnection: true,
            autoConnect: false
        });
    }
    return socket;
}

export function registerUser(userId, callback) {
    const socket = getSocket();
    if (socket.connected) {
        socket.emit('register', userId);
        if (callback) callback();
    } else {
        socket.once('connect', () => {
            socket.emit('register', userId);
            if (callback) callback();
        });
    }
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
