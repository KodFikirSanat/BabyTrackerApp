// src/screens/ProfileScreen.tsx

/**
 * @file ProfileScreen.tsx
 * @description This screen displays the user's profile information and provides
 *              actions such as logging out.
 *
 * @format
 */

import React from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useAuth} from '../context/AuthContext';

/**
 * @name ProfileScreen
 * @description The main component for the user profile screen.
 */
const ProfileScreen = (): React.JSX.Element => {
  console.log('👤✅ ProfileScreen: Component has mounted.');

  // --- Hooks ---
  // Subscribing to the AuthContext to get the current user's data.
  const {user} = useAuth();
  
  /**
   * @function handleLogout
   * @description Handles the user logout process by calling Firebase Auth's signOut method.
   */
  const handleLogout = async () => {
    console.log(`👤🚪 ProfileScreen.handleLogout: Attempting to log out user: ${user?.email}`);
    try {
      await auth().signOut();
      console.log('👤✅ ProfileScreen.handleLogout: User signed out successfully.');
      // After sign out, the onAuthStateChanged listener in AuthContext will automatically
      // update the state, and the AppNavigator will redirect to the Entry screen.
    } catch (error) {
      console.error('🔥👤 ProfileScreen.handleLogout: Error signing out:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      
      {/* Display the user's email if they are logged in */}
      {user ? (
        <Text style={styles.emailText}>Giriş Yapılan E-posta: {user.email}</Text>
      ) : (
        <Text style={styles.emailText}>Kullanıcı bilgisi bulunamadı.</Text>
      )}

      {/* Logout Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Çıkış Yap"
          onPress={handleLogout}
          color="#e74c3c" // A distinct color for a destructive action.
        />
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
