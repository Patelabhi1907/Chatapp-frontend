import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Image, Alert
} from 'react-native';
import { registerUser, loginUser } from '../api/chatApi';

export default function AuthScreen({ onJoin }) {
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isValid = username.trim().length > 0 && password.length >= 4;

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            if (mode === 'register') {
                await registerUser(username.trim(), password);
                setMode('login');
                setPassword('');
                setError('Account created! Please log in.');
            } else {
                await loginUser(username.trim(), password);
                onJoin(username.trim());
            }
        } catch (err) {
            console.error('Auth Error:', err.message);

            // EXPLICIT ERROR HANDLING
            if (!err.response) {
                // 1. Network Error: The request never reached the backend
                setError('Network Error');
                Alert.alert(
                    'Connection Failed',
                    'Cannot reach the server. Please check your internet connection or ensure your backend URL is correct.'
                );
            } else {
                // 2. Server Error: The backend received the request but rejected it
                const status = err.response.status;
                const serverMessage = err.response.data?.error || err.response.data?.message;

                if (status === 401) {
                    setError('Invalid username or password.');
                } else if (status === 404) {
                    setError('Server route not found. Check your API endpoint.');
                } else if (status === 400 || status === 409) {
                    setError(serverMessage || 'Invalid request. Username might be taken.');
                } else {
                    setError(serverMessage || `Server Error (${status}). Please try again.`);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.logoContainer}>
                <Image source={require('../../public/apple.png')} style={styles.logo} />
                <Text style={styles.title}>Chatapp</Text>
            </View>

            <Text style={styles.subtitle}>
                {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={(v) => { setUsername(v); setError(''); }}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Password (min 4 characters)"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(v) => { setPassword(v); setError(''); }}
                secureTextEntry
            />

            {error ? (
                <Text style={[styles.error, error.includes('created') && styles.success]}>
                    {error}
                </Text>
            ) : null}

            <TouchableOpacity
                style={[styles.button, (!isValid || loading) && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={!isValid || loading}
            >
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.buttonText}>{mode === 'login' ? 'LOG IN' : 'REGISTER'}</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
                <Text style={styles.toggle}>
                    {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 32 },
    logoContainer: { alignItems: 'center', marginBottom: 32, gap: 12 },
    logo: { width: 90, height: 90, resizeMode: 'contain', borderRadius: 20 },

    title: { fontSize: 28, fontWeight: 'bold', color: '#075E54' },
    subtitle: { fontSize: 14, color: '#888', marginBottom: 28 },
    input: {
        width: '100%', borderBottomWidth: 2, borderBottomColor: '#25D366',
        paddingVertical: 10, paddingHorizontal: 4, fontSize: 16,
        marginBottom: 20, color: '#1a1a1a'
    },
    error: { color: '#FF3B30', fontSize: 13, marginBottom: 12, alignSelf: 'flex-start' },
    success: { color: '#25D366' },
    button: { width: '100%', backgroundColor: '#25D366', borderRadius: 30, padding: 15, alignItems: 'center', marginBottom: 20, marginTop: 8 },
    buttonDisabled: { backgroundColor: '#a8e6c1' },
    buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
    toggle: { color: '#075E54', fontSize: 14, fontWeight: '600' },
});