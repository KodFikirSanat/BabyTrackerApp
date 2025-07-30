// src/screens/EntryScreen.tsx

/**
 * @file Defines the EntryScreen, which serves as a gateway to the main application,
 * handling user authentication (Sign Up and Login).
 *
 * @format
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import auth from '@react-native-firebase/auth';

/**
 * Type definition for the Entry screen's navigation props.
 */
type EntryScreenProps = NativeStackScreenProps<RootStackParamList, 'Entry'>;

/**
 * The screen presented to the user after the splash screen.
 * It provides functionality for signing up and logging in.
 *
 * @param {EntryScreenProps} props - The component's props, used for navigation.
 * @returns {React.JSX.Element} The rendered entry screen component.
 */
const EntryScreen = ({navigation}: EntryScreenProps): React.JSX.Element => {
  console.log('🚪🎨 EntryScreen: Rendering...');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  /**
   * Handles user sign-up using email and password.
   */
  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifre girin.');
      return;
    }
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      console.log('🚪✅ EntryScreen: User account created & signed in!');
      navigation.replace('MainTabs', {screen: 'Home'});
    } catch (error: any) {
      console.error('🚪❌ EntryScreen: SignUp Error', error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Hata', 'Bu e-posta adresi zaten kullanılıyor!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Hata', 'Geçersiz e-posta adresi.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Hata', 'Şifre çok zayıf. Lütfen daha güçlü bir şifre seçin.');
      } else {
        Alert.alert('Bir Hata Oluştu', error.message);
      }
    }
  };

  /**
   * Handles user login using email and password.
   */
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifre girin.');
      return;
    }
    try {
      await auth().signInWithEmailAndPassword(email, password);
      console.log('🚪➡️ EntryScreen: User signed in!');
      navigation.replace('MainTabs', {screen: 'Home'});
    } catch (error: any) {
      console.error('🚪❌ EntryScreen: Login Error', error);
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        Alert.alert('Hata', 'Geçersiz e-posta veya şifre.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Hata', 'Geçersiz e-posta adresi.');
      } else {
        Alert.alert('Bir Hata Oluştu', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bebeğim'e Hoş Geldiniz!</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Kayıt Ol" onPress={handleSignUp} />
        <Button title="Giriş Yap" onPress={handleLogin} />
      </View>
    </View>
  );
};

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
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
});

export default EntryScreen;
