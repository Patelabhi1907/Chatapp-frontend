import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function InputBar({ onSend, onTyping }) {
    const [text, setText] = useState('');

    const handleChange = (val) => {
        setText(val);
        if (onTyping) onTyping(val.length > 0);
    };

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text.trim());
        setText('');
        if (onTyping) onTyping(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    placeholderTextColor="#999"
                    value={text}
                    onChangeText={handleChange}
                    onSubmitEditing={handleSend}
                    returnKeyType="send"
                    multiline
                />
            </View>
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <Path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="#DAF1DE" />
                </Svg>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'flex-end', padding: 8, backgroundColor: '#ECE5DD' },
    inputRow: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#DAF1DE', borderRadius: 24, paddingHorizontal: 14,
        marginRight: 8, minHeight: 44,
    },
    input: { flex: 1, fontSize: 15, color: '#051F20', paddingVertical: 10, maxHeight: 100 },
    sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#051F20', justifyContent: 'center', alignItems: 'center', elevation: 3 },
});
