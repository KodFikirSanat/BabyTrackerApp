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
import {useBaby} from '../context/BabyContext';
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
  const {selectedBaby} = useBaby();

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

      {selectedBaby && (
        <View style={styles.babyInfoContainer}>
          <Text style={styles.babyName}>{selectedBaby.name}</Text>
          <Text>Doğum Tarihi: {selectedBaby.dateOfBirth.toDate().toLocaleDateString()}</Text>
          <Text>Cinsiyet: {selectedBaby.gender === 'female' ? 'Kız' : 'Erkek'}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Çıkış Yap" onPress={handleLogout} color="#ff3b30" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50, // Pushed content down from the top
        paddingHorizontal: 20,
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
  babyInfoContainer: {
    marginBottom: 30,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '100%',
  },
  babyName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto', // Pushes the button to the bottom
    marginBottom: 40,
  },
});

export default ProfileScreen;
