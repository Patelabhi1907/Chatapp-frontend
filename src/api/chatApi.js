import axios from 'axios';

const BASE_URL = 'https://chat-app-backend-production-d779.up.railway.app';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
});

export const registerUser = (username, password) =>
    api.post('/api/auth/register', { username, password }).then((r) => r.data);

export const loginUser = (username, password) =>
    api.post('/api/auth/login', { username, password }).then((r) => r.data);

export const fetchMessages = (userId, targetId) =>
    api.get(`/api/messages/${userId}/${targetId}`).then((r) => r.data);

export const fetchOnlineUsers = () =>
    api.get('/api/users/online').then((r) => r.data);

export const fetchAllUsers = () =>
    api.get('/api/users/all').then((r) => r.data);

export const fetchUnreadCounts = (userId) =>
    api.get(`/api/messages/unread/${userId}`).then((r) => r.data);

export const deleteUser = (username) =>
    api.delete(`/api/users/${username}`).then((r) => r.data);

export const updateLocation = (username, latitude, longitude) =>
    api.put(`/api/users/${username}/location`, { latitude, longitude }).then((r) => r.data);

export default api;
