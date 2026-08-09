import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { getSocket, registerUser } from '../services/socketService';
import { fetchAllUsers, fetchOnlineUsers, fetchUnreadCounts } from '../api/chatApi';

export default function UserListScreen({ userId, onSelectUser, onProfile }) {
    const [allUsers, setAllUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});

    const loadData = () => {
        fetchAllUsers().then((users) => setAllUsers(users.filter(u => u !== userId))).catch(console.error);
        fetchOnlineUsers().then((users) => setOnlineUsers(users.filter(u => u !== userId))).catch(console.error);
        fetchUnreadCounts(userId).then(setUnreadCounts).catch(console.error);
    };

    useEffect(() => {
        const socket = getSocket();

        socket.on('online_users', (users) => setOnlineUsers(users.filter(u => u !== userId)));
        socket.on('receive_message', () => fetchUnreadCounts(userId).then(setUnreadCounts).catch(console.error));

        registerUser(userId, loadData);

        const interval = setInterval(loadData, 3000);

        return () => {
            socket.off('online_users');
            socket.off('receive_message');
            clearInterval(interval);
        };
    }, [userId]);

    const isOnline = (user) => onlineUsers.includes(user);

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

            {allUsers.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>💬</Text>
                    <Text style={styles.emptyText}>No users found</Text>
                </View>
            ) : (
                <FlatList
                    data={allUsers}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.userRow} onPress={() => onSelectUser(item)}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{item[0].toUpperCase()}</Text>
                            </View>
                            <View style={styles.userInfo}>
                                <Text style={styles.username}>{item}</Text>
                                <Text style={[styles.statusText, isOnline(item) ? styles.online : styles.offline]}>
                                    {isOnline(item) ? '● Online' : '● Offline'}
                                </Text>
                            </View>
                            {unreadCounts[item] > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{unreadCounts[item]}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ECE5DD' },
    header: { backgroundColor: '#075E54', paddingTop: 16, paddingBottom: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { color: '#DAF1DE', fontSize: 22, fontWeight: 'bold' },
    profileAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0D3B36', justifyContent: 'center', alignItems: 'center' },
    profileAvatarText: { fontSize: 16, fontWeight: 'bold', color: '#DAF1DE' },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyIcon: { fontSize: 64, marginBottom: 16 },
    emptyText: { fontSize: 18, fontWeight: '600', color: '#051F20' },
    userRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
    avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#0D3B36', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    avatarText: { fontSize: 22, fontWeight: 'bold', color: '#DAF1DE' },
    userInfo: { flex: 1 },
    username: { fontSize: 17, fontWeight: '600', color: '#051F20' },
    statusText: { fontSize: 13, marginTop: 2 },
    online: { color: '#0D3B36' },
    offline: { color: '#999' },
    separator: { height: 1, backgroundColor: '#fff', marginLeft: 82 },
    badge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: '#051F20', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 },
    badgeText: { color: '#DAF1DE', fontSize: 12, fontWeight: 'bold' },
});
