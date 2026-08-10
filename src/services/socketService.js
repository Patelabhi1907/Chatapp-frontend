import { io } from 'socket.io-client';

const SOCKET_URL = 'https://chat-app-backend-kz2x.onrender.com';

let socket = null;

export function getSocket() {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ['polling', 'websocket'],
            reconnection: true,
            autoConnect: true,
        });
    }
    return socket;
}

export function registerUser(userId) {
    const s = getSocket();
    if (s.connected) {
        s.emit('register', userId);
    } else {
        s.once('connect', () => s.emit('register', userId));
    }
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
