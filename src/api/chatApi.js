export const BASE_URL = 'https://chat-app-backend-production-ce3f.up.railway.app';

const request = (method, path, body) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${BASE_URL}${path}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.timeout = 30000;
    xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject({ response: { data, status: xhr.status } });
    };
    xhr.onerror = () => reject(new Error('Network request failed'));
    xhr.ontimeout = () => reject(new Error('Request timed out'));
    xhr.send(body ? JSON.stringify(body) : null);
});

export const registerUser = (username, password) =>
    request('POST', '/api/auth/register', { username, password });

export const loginUser = (username, password) =>
    request('POST', '/api/auth/login', { username, password });

export const fetchMessages = (userId, targetId) =>
    request('GET', `/api/messages/${userId}/${targetId}`);

export const fetchOnlineUsers = () =>
    request('GET', '/api/users/online');

export const fetchAllUsers = () =>
    request('GET', '/api/users/all');

export const fetchUnreadCounts = (userId) =>
    request('GET', `/api/messages/unread/${userId}`);

export const deleteUser = (username) =>
    request('DELETE', `/api/users/${username}`);

export const updateLocation = (username, latitude, longitude) =>
    request('PUT', `/api/users/${username}/location`, { latitude, longitude });

export default { BASE_URL };
