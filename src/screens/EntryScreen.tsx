// src/screens/EntryScreen.tsx

/**
 * @file EntryScreen.tsx
 * @description This screen serves as the main gateway for unauthenticated users.
 *              It provides functionality for both signing up for a new account and
 *              logging in with existing credentials using Firebase Authentication.
 *
 * @format
 */

import React, {useState} from 'react';
import {
  View, Text, StyleSheet, Button,
  TextInput, Alert, ActivityIndicator
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import auth from '@react-native-firebase/auth';

/**
 * @type EntryScreenProps
 * @description Defines the navigation properties available to the EntryScreen.
 */
type EntryScreenProps = NativeStackScreenProps<RootStackParamList, 'Entry'>;

/**
 * @name EntryScreen
 * @description The main component for the entry screen.
 * @param {EntryScreenProps} props - The navigation props.
 * @returns {React.JSX.Element} A React Element representing the entry screen.
 */
const EntryScreen = ({navigation}: EntryScreenProps): React.JSX.Element => {
  console.log('🚪✅ EntryScreen: Component has mounted.');

  // --- State ---
  // State to hold the user's input for email and password.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State to manage loading indicators for async operations.
  const [loading, setLoading] = useState(false);

  /**
   * @function handleSignUp
   * @description Handles the user sign-up process using Firebase Auth.
   */
  const handleSignUp = async () => {
    // Basic input validation.
    if (!email || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen e-posta ve şifre girin.');
      return;
    }
    
    console.log(`🚪➡️ EntryScreen.handleSignUp: Attempting to sign up with email: ${email}`);
    setLoading(true);

    try {
      // Use Firebase Auth to create a new user account.
      await auth().createUserWithEmailAndPassword(email, password);
      console.log('🚪✅ EntryScreen.handleSignUp: User account created & signed in successfully.');
      // After successful sign-up, the onAuthStateChanged listener in AuthContext
      // will handle navigation automatically. We don't need to navigate here.
    } catch (error: any) {
      console.error('🚪❌ EntryScreen.handleSignUp: Error during sign-up:', error);
      // Provide user-friendly error messages based on the Firebase error code.
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Kayıt Başarısız', 'Bu e-posta adresi zaten kullanılıyor.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Kayıt Başarısız', 'Geçersiz bir e-posta adresi girdiniz.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Kayıt Başarısız', 'Şifreniz çok zayıf. Lütfen en az 6 karakterli bir şifre seçin.');
      } else {
        Alert.alert('Bir Hata Oluştu', 'Kayıt işlemi sırasında bir sorun oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function handleLogin
   * @description Handles the user login process using Firebase Auth.
   */
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen e-posta ve şifre girin.');
      return;
    }

    console.log(`🚪➡️ EntryScreen.handleLogin: Attempting to log in with email: ${email}`);
    setLoading(true);

    try {
      // Use Firebase Auth to sign in the user.
      await auth().signInWithEmailAndPassword(email, password);
      console.log('🚪✅ EntryScreen.handleLogin: User signed in successfully.');
      // Similar to sign-up, onAuthStateChanged in AuthContext will handle navigation.
    } catch (error: any) {
      console.error('🚪❌ EntryScreen.handleLogin: Error during login:', error);
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        Alert.alert('Giriş Başarısız', 'Geçersiz e-posta veya şifre.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Giriş Başarısız', 'Geçersiz bir e-posta adresi girdiniz.');
      } else {
        Alert.alert('Bir Hata Oluştu', 'Giriş işlemi sırasında bir sorun oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bebeğim'e Hoş Geldiniz!</Text>
      
      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      
      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Hides the password characters.
      />

      {/* If an operation is in progress, show an indicator, otherwise show buttons. */}
      {loading ? (
        <ActivityIndicator size="large" color="#6b9ac4" style={styles.loader} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Kayıt Ol" onPress={handleSignUp} />
          <Button title="Giriş Yap" onPress={handleLogin} />
        </View>
      )}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 15,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  loader: {
      marginTop: 20,
  }
});

export default EntryScreen;
