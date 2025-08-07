// src/screens/EntryScreen.tsx

/**
 * @file EntryScreen.tsx
 * @description This is the initial screen for unauthenticated users, providing options
 *              to either log in to an existing account or sign up for a new one.
 *
 * @format
 */

import React, {useState} from 'react';
import {
  View,

  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image, // Import Image component
} from 'react-native';
import auth from '@react-native-firebase/auth';

/**
 * @name EntryScreen
 * @description The main component for the entry screen.
 * @returns {React.JSX.Element} A React Element representing the entry screen.
 */
const EntryScreen = (): React.JSX.Element => {
  console.log('🚪✅ EntryScreen: Component has mounted.');

  // --- State Management ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggles between Login and Sign Up mode

  /**
   * @function handleAuthentication
   * @description Handles both user sign-up and login based on the `isLogin` state.
   */
  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        console.log('🚪➡️ EntryScreen.handleAuthentication: Attempting to sign in...');
        await auth().signInWithEmailAndPassword(email, password);
        console.log('🚪✅ EntryScreen.handleAuthentication: User signed in successfully!');
      } else {
        console.log('🚪➡️ EntryScreen.handleAuthentication: Attempting to create user...');
        await auth().createUserWithEmailAndPassword(email, password);
        console.log('🚪✅ EntryScreen.handleAuthentication: User account created & signed in!');
      }
    } catch (error: any) {
      console.error('🚪❌ EntryScreen.handleAuthentication: Authentication error:', error);
      Alert.alert('Giriş Hatası', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/babywise/app_icon.jpg')}
        style={styles.logo}
      />
      <Text style={styles.title}>Hoşgeldiniz</Text>
      
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="E-posta"
        placeholderTextColor="#888" // Darker placeholder text
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        placeholderTextColor="#888" // Darker placeholder text
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button
          title={isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          onPress={handleAuthentication}
          color="#6b9ac4"
        />
      </View>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggleText}>
          {isLogin ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 207,
    height: 207,
    borderRadius: 75,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000', // Black text color for input
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden', // Ensures the borderRadius is applied to the Button
  },
  toggleText: {
    marginTop: 20,
    color: '#6b9ac4',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EntryScreen;
