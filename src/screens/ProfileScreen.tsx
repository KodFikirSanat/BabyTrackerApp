// src/screens/ProfileScreen.tsx

/**
 * @file Defines the ProfileScreen, where users can view and manage their
 * profile and baby's information.
 *
 * @format
 */

import React from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useAuth} from '../context/AuthContext';
import auth from '@react-native-firebase/auth';
import {MainTabParamList} from '../types/navigation';

/**
 * Type definition for the Profile screen's navigation props.
 * It now correctly uses BottomTabScreenProps as it's part of the MainTabParamList.
 */
type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;

/**
 * A screen for managing user and baby-related settings and information.
 * This screen is accessed from the main header, not from the tab bar.
 *
 * @param {ProfileScreenProps} props - The component's props, used for navigation event listening.
 * @returns {React.JSX.Element} The rendered profile screen.
 */
const ProfileScreen = ({}: ProfileScreenProps): React.JSX.Element => {
  console.log('👤🎨 ProfileScreen: Rendering...');
  const {user} = useAuth();

  const handleLogout = async () => {
    console.log('👤🚪 ProfileScreen: Logging out...');
    try {
      await auth().signOut();
      console.log('👤✅ ProfileScreen: User signed out!');
      // Navigation back to EntryScreen is handled automatically
      // by the onAuthStateChanged listener in AuthProvider.
    } catch (error) {
      console.error('👤❌ ProfileScreen: Logout Error', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profilim</Text>
      {user && <Text style={styles.emailText}>Hoş geldin, {user.email}</Text>}
      <View style={styles.buttonContainer}>
        <Button title="Çıkış Yap" onPress={handleLogout} color="#ff3b30" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default ProfileScreen;
