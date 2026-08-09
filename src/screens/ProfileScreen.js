import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { deleteUser } from '../api/chatApi';

export default function ProfileScreen({ userId, onBack, onDelete, onLogout }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <View style={styles.body}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{userId[0].toUpperCase()}</Text>
                </View>
                <Text style={styles.name}>{userId}</Text>
                <Text style={styles.status}>Hey there! I am using Chatapp</Text>

                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                    <Text style={styles.logoutBtnText}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteBtn} onPress={() =>
                    Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => deleteUser(userId).then(() => onDelete()).catch((e) => { console.error('Delete failed:', e); Alert.alert('Error', 'Failed to delete account'); }) },
                    ])
                }>
                    <Text style={styles.deleteBtnText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#DAF1DE' },
    header: { backgroundColor: '#051F20', flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
    backText: { color: '#DAF1DE', fontSize: 22 },
    headerTitle: { color: '#DAF1DE', fontSize: 18, fontWeight: 'bold' },
    body: { alignItems: 'center', marginTop: 60 },
    avatarCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#0D3B36', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    avatarText: { fontSize: 52, fontWeight: 'bold', color: '#DAF1DE' },
    name: { fontSize: 26, fontWeight: 'bold', color: '#051F20', marginBottom: 8 },
    status: { fontSize: 14, color: '#163832' },
    logoutBtn: { marginTop: 40, backgroundColor: '#075E54', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 24 },
    logoutBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    deleteBtn: { marginTop: 12, backgroundColor: '#B00020', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 24 },
    deleteBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
