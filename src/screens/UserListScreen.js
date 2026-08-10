import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { getSocket, registerUser } from '../services/socketService';
import { fetchAllUsers, fetchUnreadCounts } from '../api/chatApi';

export default function UserListScreen({ userId, onSelectUser, onProfile }) {
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [lastMessages, setLastMessages] = useState({});

    useEffect(() => {
        const socket = getSocket();

        fetchAllUsers()
            .then(all => setUsers(all.filter(u => u !== userId)))
            .catch(console.error);
        fetchUnreadCounts(userId)
            .then(setUnreadCounts)
            .catch(console.error);

        registerUser(userId);

        const onOnlineUsers = (list) => setOnlineUsers(list.filter(u => u !== userId));

        const onUserRegistered = (newUser) => {
            if (newUser !== userId) {
                setUsers(prev => prev.includes(newUser) ? prev : [...prev, newUser]);
            }
        };

        const onReceiveMessage = (msg) => {
            if (msg.receiverId === userId) {
                setUnreadCounts(prev => ({ ...prev, [msg.senderId]: (prev[msg.senderId] || 0) + 1 }));
            }
            const otherUser = msg.senderId === userId ? msg.receiverId : msg.senderId;
            setLastMessages(prev => ({ ...prev, [otherUser]: msg }));
        };

        const onLastMessage = (preview) => {
            const otherUser = preview.senderId === userId ? preview.receiverId : preview.senderId;
            setLastMessages(prev => ({ ...prev, [otherUser]: preview }));
        };

        const onMessagesRead = ({ readerId }) => {
            if (readerId === userId) {
                fetchUnreadCounts(userId).then(setUnreadCounts).catch(console.error);
            }
        };

        socket.on('online_users', onOnlineUsers);
        socket.on('user_registered', onUserRegistered);
        socket.on('receive_message', onReceiveMessage);
        socket.on('last_message', onLastMessage);
        socket.on('messages_read', onMessagesRead);

        return () => {
            socket.off('online_users', onOnlineUsers);
            socket.off('user_registered', onUserRegistered);
            socket.off('receive_message', onReceiveMessage);
            socket.off('last_message', onLastMessage);
            socket.off('messages_read', onMessagesRead);
        };
    }, [userId]);

    const renderUser = ({ item }) => {
        const online = onlineUsers.includes(item);
        const unread = unreadCounts[item] || 0;
        const last = lastMessages[item];

        return (
            <TouchableOpacity style={styles.row} onPress={() => onSelectUser(item)}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item[0].toUpperCase()}</Text>
                    {online && <View style={styles.onlineDot} />}
                </View>
                <View style={styles.info}>
                    <View style={styles.infoTop}>
                        <Text style={styles.username}>{item}</Text>
                        {last && <Text style={styles.time}>{new Date(last.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}
                    </View>
                    <View style={styles.infoBottom}>
                        <Text style={styles.preview} numberOfLines={1}>
                            {last ? (last.senderId === userId ? `You: ${last.text}` : last.text) : (online ? 'Online' : 'Offline')}
                        </Text>
                        {unread > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{unread}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chatapp</Text>
                <TouchableOpacity onPress={onProfile}>
                    <View style={styles.profileAvatar}>
                        <Text style={styles.profileAvatarText}>{userId[0].toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {users.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>💬</Text>
                    <Text style={styles.emptyText}>No users found</Text>
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={item => item}
                    renderItem={renderUser}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { backgroundColor: '#075E54', paddingTop: 16, paddingBottom: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    profileAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0D3B36', justifyContent: 'center', alignItems: 'center' },
    profileAvatarText: { fontSize: 16, fontWeight: 'bold', color: '#DAF1DE' },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyIcon: { fontSize: 64, marginBottom: 12 },
    emptyText: { fontSize: 16, color: '#999' },
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
    avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#0D3B36', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    avatarText: { fontSize: 22, fontWeight: 'bold', color: '#DAF1DE' },
    onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#25D366', borderWidth: 2, borderColor: '#fff' },
    info: { flex: 1 },
    infoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    infoBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 },
    username: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
    time: { fontSize: 12, color: '#999' },
    preview: { fontSize: 13, color: '#999', flex: 1, marginRight: 8 },
    separator: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 82 },
    badge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: '#25D366', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
