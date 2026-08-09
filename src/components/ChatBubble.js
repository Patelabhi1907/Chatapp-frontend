import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function StatusTick({ status }) {
    if (status === 'read')    return <Text style={styles.tickRead}>✓✓</Text>;
    if (status === 'delivered') return <Text style={styles.tickDelivered}>✓✓</Text>;
    return <Text style={styles.tickSent}>✓</Text>;
}

export default function ChatBubble({ message, currentUserId }) {
    const isOwn = message.senderId === currentUserId;
    const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <View style={[styles.row, isOwn ? styles.rowRight : styles.rowLeft]}>
            <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
                {!isOwn && <Text style={styles.sender}>{message.senderId}</Text>}
                <Text style={styles.text}>{message.text}</Text>
                <View style={styles.footer}>
                    <Text style={styles.time}>{time}</Text>
                    {isOwn && <StatusTick status={message.status} />}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { marginVertical: 2, marginHorizontal: 10, maxWidth: '80%' },
    rowRight: { alignSelf: 'flex-end' },
    rowLeft: { alignSelf: 'flex-start' },
    bubble: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, paddingBottom: 4 },
    bubbleOwn: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
    bubbleOther: { backgroundColor: '#fff', borderTopLeftRadius: 0, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1 },
    sender: { fontSize: 12, fontWeight: 'bold', color: '#075E54', marginBottom: 2 },
    text: { fontSize: 15, color: '#1a1a1a', lineHeight: 20 },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 2, gap: 4 },
    time: { fontSize: 11, color: '#999' },
    tickSent: { fontSize: 11, color: '#999' },
    tickDelivered: { fontSize: 11, color: '#999' },
    tickRead: { fontSize: 11, color: '#34B7F1' },
});
