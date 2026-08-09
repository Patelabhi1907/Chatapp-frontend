import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ChatBubble from './ChatBubble';

export default function MessageList({ messages, currentUserId }) {
    return (
        <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <ChatBubble message={item} currentUserId={currentUserId} />
            )}
            contentContainerStyle={styles.list}
            onContentSizeChange={(_, h) => h}
            inverted={false}
        />
    );
}

const styles = StyleSheet.create({
    list: { paddingVertical: 12 },
});
