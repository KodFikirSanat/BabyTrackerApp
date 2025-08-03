// src/screens/ProfileScreen.tsx

/**
 * @file ProfileScreen.tsx
 * @description This screen displays the user's profile information and provides
 *              actions such as logging out.
 *
 * @format
 */

import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useAuth} from '../context/AuthContext';

/**
 * @name ProfileScreen
 * @description The main component for the user profile screen.
 */
const ProfileScreen = (): React.JSX.Element => {
  console.log('👤✅ ProfileScreen: Component has mounted.');

  // --- Hooks ---
  const {user} = useAuth();
  const [loading, setLoading] = useState(false); // State to manage logout loading
  
  /**
   * @function handleLogout
   * @description Handles the user logout process by calling Firebase Auth's signOut method.
   *              A loading state is used to prevent user interaction during the process.
   */
  const handleLogout = async () => {
    console.log(`👤🚪 ProfileScreen.handleLogout: Attempting to log out user: ${user?.email}`);
    setLoading(true); // Disable button
    try {
      await auth().signOut();
      console.log('👤✅ ProfileScreen.handleLogout: User signed out successfully.');
      // Navigation is handled automatically by the AuthContext listener.
    } catch (error) {
      console.error('🔥👤 ProfileScreen.handleLogout: Error signing out:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu.');
    } finally {
      // This part will not be reached if logout is successful, as the component will unmount.
      // However, it is good practice for safety in case of errors.
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      
      {user ? (
        <Text style={styles.emailText}>Giriş Yapılan E-posta: {user.email}</Text>
      ) : (
        <Text style={styles.emailText}>Kullanıcı bilgisi bulunamadı.</Text>
      )}

      {/* Logout Button and Loading Indicator */}
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#e74c3c" />
        ) : (
          <Button
            title="Çıkış Yap"
            onPress={handleLogout}
            disabled={loading}
            color="#e74c3c"
          />
        )}
      </View>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emailText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 40,
  },
  buttonContainer: {
      width: '80%',
  }
});

export default ProfileScreen;
