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
import {Svg, Path} from 'react-native-svg';
import auth from '@react-native-firebase/auth';
import {useAuth} from '../context/AuthContext';
import {ProfileScreenNavigationProps} from '../types/navigation';

/**
 * @name ProfileScreen
 * @description The main component for the user profile screen.
 * @param {ProfileScreenNavigationProps} props - The navigation props, correctly typed for nested navigation.
 * @returns {React.JSX.Element} A React Element representing the profile screen.
 */
const ProfileScreen = ({navigation}: ProfileScreenNavigationProps): React.JSX.Element => {
  console.log('👤✅ ProfileScreen: Component has mounted.');

  // --- Hooks ---
  const {user} = useAuth();
  const [loading, setLoading] = useState(false); // State to manage logout loading

  /**
   * @function handleAddBaby
   * @description Navigates the user to the AddBaby screen.
   */
  const handleAddBaby = () => {
    console.log('👤➡️ ProfileScreen.handleAddBaby: Navigating to AddBaby screen.');
    navigation.navigate('AddBaby');
  };
  
  /**
   * @function handleLogout
   * @description Handles the user logout process by calling Firebase Auth's signOut method.
   *              A loading state is used to prevent user interaction during the process.
   */
  const handleLogout = async () => {
    console.log(`👤➡️ ProfileScreen.handleLogout: Attempting to log out user: ${user?.email}`);
    setLoading(true); // Disable button
    try {
      await auth().signOut();
      console.log('👤✅ ProfileScreen.handleLogout: User signed out successfully.');
      // Navigation is handled automatically by the AuthContext listener.
    } catch (error) {
      console.error('👤❌ ProfileScreen.handleLogout: Error signing out:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu.');
    } finally {
      // This part will not be reached if logout is successful, as the component will unmount.
      // However, it is good practice for safety in case of errors.
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePicCircle}>
        <Svg width="80" height="80" viewBox="0 0 24 24">
          <Path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill="#a9a9a9"
          />
        </Svg>
      </View>
      <Text style={styles.title}>Profil</Text>
      
      {user ? (
        <Text style={styles.emailText}>Giriş Yapılan E-posta: {user.email}</Text>
      ) : (
        <Text style={styles.emailText}>Kullanıcı bilgisi bulunamadı.</Text>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Bebek Ekle"
            onPress={handleAddBaby}
            disabled={loading}
          />
        </View>
        <View style={styles.buttonWrapper}>
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
  profilePicCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#6b9ac4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
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
  },
  buttonWrapper: {
    marginBottom: 15, // Add space between buttons
  }
});

export default ProfileScreen;
