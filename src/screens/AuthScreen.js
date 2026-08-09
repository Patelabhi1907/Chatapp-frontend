import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
            setError(err.response?.data?.error || 'Something went wrong');
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
                <Svg width={90} height={90} viewBox="0 0 512 512">
                    <Path d="M0 0 C2.15586403 -0.00300019 4.31172752 -0.00640466 6.46759033 -0.01017761 C12.27187411 -0.0189357 18.0761431 -0.02135228 23.88043284 -0.0219934 C27.52273823 -0.02270873 31.16503997 -0.02485213 34.80734444 -0.02749062 C47.55987915 -0.0367179 60.31240347 -0.04082891 73.06494141 -0.04003906 C84.87770117 -0.03943942 96.6904151 -0.04997581 108.50316328 -0.06578273 C118.7059891 -0.07893982 128.90880009 -0.08421954 139.11163431 -0.08358365 C145.17813234 -0.083331 151.24458959 -0.08605154 157.31107903 -0.0967617 C237.69895402 -0.22861407 237.69895402 -0.22861407 261.91430664 11.14526367 C262.82954102 11.57452148 263.74477539 12.0037793 264.68774414 12.44604492 C287.67428693 24.13690837 304.93506368 44.64551783 313.02368164 69.06420898 C320.1817321 92.31696132 320.06627391 117.21767735 320.05957031 141.31689453 C320.06256978 143.49393775 320.0659741 145.67098045 320.06974792 147.84802246 C320.07851346 153.71427977 320.08092291 159.58052246 320.08156371 165.44678569 C320.08227863 169.12676755 320.08442127 172.8067458 320.08706093 176.48672676 C320.09629077 189.36778114 320.10039891 202.24882523 320.09960938 215.12988281 C320.0990097 227.06704156 320.10954597 239.00415495 320.12535304 250.94130224 C320.13850487 261.24685148 320.14379007 271.55238604 320.14315397 281.85794359 C320.14290115 287.98758168 320.14563072 294.11717941 320.15633202 300.24680901 C320.28558688 379.93544123 320.28558688 379.93544123 308.91430664 404.14526367 C308.48504883 405.06049805 308.05579102 405.97573242 307.61352539 406.91870117 C295.83943662 430.06888135 275.18354302 447.28298454 250.60180664 455.39526367 C219.0874822 464.22682286 185.42724575 462.44985604 153.03563499 462.41391468 C146.94249682 462.40877889 140.84936406 462.41356683 134.75622559 462.41668701 C124.53237815 462.42030492 114.3085598 462.41558518 104.0847168 462.40600586 C92.33822501 462.39512557 80.5918027 462.3986527 68.8453126 462.40965867 C58.68051775 462.41879406 48.51574358 462.41998653 38.35094595 462.41478133 C32.31476805 462.41169572 26.27862259 462.41115664 20.2424469 462.41785431 C-80.42858873 462.5140553 -80.42858873 462.5140553 -111.15600586 432.16870117 C-146.86127703 395.72390335 -142.40605591 343.92210704 -142.35434437 296.62787318 C-142.34921041 290.44751618 -142.35399597 284.26716454 -142.3571167 278.08680725 C-142.36073485 267.71752845 -142.35601392 257.34827833 -142.34643555 246.97900391 C-142.33555233 235.06094532 -142.33908441 223.14295521 -142.35008836 211.22489828 C-142.35921958 200.91489742 -142.3604183 190.60491695 -142.35521102 180.29491335 C-142.35212353 174.17101807 -142.35159179 168.04715476 -142.358284 161.92326164 C-142.45207296 62.27382412 -142.45207296 62.27382412 -110.52709961 29.52026367 C-80.29640981 0.7374879 -39.29140883 -0.01106197 0 0 Z" fill="#33D84F" transform="translate(167.085693359375,24.854736328125)"/>
                    <Path d="M0 0 C2.48763123 0.01077639 4.97454786 0.0000053 7.4621582 -0.01269531 C16.29066681 -0.02043067 24.61350075 0.48285632 33.29223633 2.26074219 C34.7336521 2.49413063 36.17629949 2.72010951 37.62036133 2.93652344 C58.85726229 6.384347 78.33868399 14.2268052 97.29223633 24.26074219 C98.86811523 25.0921875 98.86811523 25.0921875 100.47583008 25.94042969 C131.16035308 42.97380368 156.72486321 72.82839128 166.64257812 106.65991211 C172.39973586 127.49255842 173.10715247 152.54813613 166.29223633 173.26074219 C166.0726123 173.94088379 165.85298828 174.62102539 165.62670898 175.32177734 C158.65948551 196.36151023 147.55910126 213.42759888 132.29223633 229.26074219 C131.5884082 230.02773438 130.88458008 230.79472656 130.15942383 231.58496094 C119.59958607 242.76714655 106.64552533 251.20770244 93.09838867 258.31298828 C91.46292723 259.17117446 89.83968141 260.0525415 88.21801758 260.93652344 C54.16941537 278.91307058 12.50448599 284.44137248 -25.33666992 278.72167969 C-42.82730364 276.3301446 -56.67376958 280.21651487 -71.76123047 288.53759766 C-82.96831266 294.69971687 -95.68045396 299.94639007 -108.70776367 299.26074219 C-107.92401367 298.35324219 -107.14026367 297.44574219 -106.33276367 296.51074219 C-105.79006836 295.87265625 -105.24737305 295.23457031 -104.68823242 294.57714844 C-103.22471808 292.86538511 -101.74576458 291.16679426 -100.25854492 289.47558594 C-92.01972367 279.93136102 -86.97775326 272.17115329 -86.70776367 259.26074219 C-87.39225586 259.009375 -88.07674805 258.75800781 -88.78198242 258.49902344 C-119.0921322 245.67082921 -144.79227422 217.04806903 -157.70776367 187.26074219 C-169.15799422 158.09164221 -170.71220577 125.57391476 -158.70776367 96.26074219 C-140.79097825 55.86742269 -107.84184731 28.72532201 -67.66870117 11.99511719 C-60.02337757 9.05603902 -52.21809317 7.01810049 -44.27026367 5.07324219 C-43.25867188 4.82316406 -42.24708008 4.57308594 -41.20483398 4.31542969 C-27.44136117 1.06040576 -14.0838792 -0.07246084 0 0 Z" fill="#FEFEFE" transform="translate(253.707763671875,109.7392578125)"/>
                </Svg>
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
