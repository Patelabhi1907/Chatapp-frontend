import React, { useState, useEffect } from 'react';
import { StatusBar, BackHandler } from 'react-native';
import AuthScreen from './src/screens/AuthScreen';
import UserListScreen from './src/screens/UserListScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
    const [userId, setUserId] = useState(null);
    const [targetId, setTargetId] = useState(null);
    const [showProfile, setShowProfile] = useState(false);

    const handleDeleteAccount = () => {
        setUserId(null);
        setTargetId(null);
        setShowProfile(false);
    };

    const handleLogout = () => {
        setUserId(null);
        setTargetId(null);
        setShowProfile(false);
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    }, []);

    return (
        <>
            <StatusBar backgroundColor="#075E54" barStyle="light-content" translucent={false} />
            {!userId && <AuthScreen onJoin={setUserId} />}
            {userId && showProfile && <ProfileScreen userId={userId} onBack={() => setShowProfile(false)} onDelete={handleDeleteAccount} onLogout={handleLogout} />}
            {userId && !showProfile && !targetId && <UserListScreen userId={userId} onSelectUser={setTargetId} onProfile={() => setShowProfile(true)} />}
            {userId && !showProfile && targetId && <ChatScreen userId={userId} targetId={targetId} onBack={() => setTargetId(null)} />}
        </>
    );
}
