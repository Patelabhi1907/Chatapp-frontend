import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import ChatBubble from '../components/ChatBubble';
import InputBar from '../components/InputBar';
import { getSocket, registerUser } from '../services/socketService';
import { fetchMessages } from '../api/chatApi';

export default function ChatScreen({ userId, targetId, onBack }) {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [targetOnline, setTargetOnline] = useState(false);
    const flatListRef = useRef(null);
    const typingTimeout = useRef(null);

    useEffect(() => {
        const socket = getSocket();

        registerUser(userId);
        fetchMessages(userId, targetId).then(setMessages).catch(console.error);

        const markRead = () => socket.emit('messages_read', { readerId: userId, senderId: targetId });
        markRead();

        const onOnlineUsers = (list) => setTargetOnline(list.includes(targetId));

        const onReceive = (msg) => {
            if (msg.senderId === targetId || msg.receiverId === targetId) {
                setMessages(prev => [...prev, msg]);
                markRead();
            }
        };

        const onSaved = (msg) => {
            setMessages(prev => prev.map(m => m.tempId === msg.tempId ? msg : m));
        };

        const onMessagesRead = ({ readerId }) => {
            if (readerId === targetId) {
                setMessages(prev => prev.map(m => m.senderId === userId ? { ...m, status: 'read' } : m));
            }
        };

        const onTyping = ({ senderId, typing }) => {
            if (senderId === targetId) setIsTyping(typing);
        };

        socket.on('online_users', onOnlineUsers);
        socket.on('receive_message', onReceive);
        socket.on('message_saved', onSaved);
        socket.on('messages_read', onMessagesRead);
        socket.on('typing', onTyping);

        return () => {
            socket.off('online_users', onOnlineUsers);
            socket.off('receive_message', onReceive);
            socket.off('message_saved', onSaved);
            socket.off('messages_read', onMessagesRead);
            socket.off('typing', onTyping);
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, [userId, targetId]);

    const emitTyping = (typing) => {
        const socket = getSocket();
        socket.emit('typing', { senderId: userId, receiverId: targetId, typing });
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        if (typing) {
            typingTimeout.current = setTimeout(() => {
                socket.emit('typing', { senderId: userId, receiverId: targetId, typing: false });
            }, 3000);
        }
    };

    const handleSend = (text) => {
        const tempId = `temp_${Date.now()}`;
        const optimistic = { id: tempId, tempId, senderId: userId, receiverId: targetId, text, timestamp: new Date().toISOString(), status: 'sending' };
        setMessages(prev => [...prev, optimistic]);
        getSocket().emit('send_message', { senderId: userId, receiverId: targetId, text, tempId });
        emitTyping(false);
    };

    const statusText = isTyping ? 'typing...' : targetOnline ? 'online' : 'offline';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{targetId[0].toUpperCase()}</Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{targetId}</Text>
                    <Text style={[styles.headerSub, isTyping && styles.typingText]}>{statusText}</Text>
                </View>
            </View>

            <View style={styles.chatBg}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <ChatBubble message={item} currentUserId={userId} />}
                    contentContainerStyle={styles.list}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
            </View>

            <InputBar onSend={handleSend} onTyping={emitTyping} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { backgroundColor: '#075E54', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 10 },
    backBtn: { paddingRight: 8 },
    backText: { color: '#fff', fontSize: 22 },
    avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#DFD8C8', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    avatarText: { fontSize: 16, fontWeight: 'bold', color: '#075E54' },
    headerInfo: { flex: 1 },
    headerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
    typingText: { color: '#a8e6c1' },
    chatBg: { flex: 1, backgroundColor: '#ECE5DD' },
    list: { paddingVertical: 8, paddingHorizontal: 4 },
});
