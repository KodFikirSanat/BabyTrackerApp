// src/screens/EntryScreen.tsx

/**
 * @file The entry screen of the application, shown after the splash screen.
 * This screen might typically contain login/signup options.
 *
 * @format
 */

import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

// Type definition for the Entry screen props.
// Note: We will update 'Entry' in RootStackParamList in a later step.
type EntryScreenProps = NativeStackScreenProps<RootStackParamList, 'Entry'>;

const EntryScreen = ({navigation}: EntryScreenProps) => {
  // 🚀 Log when the component mounts.
  console.log('🚀 EntryScreen: Component mounted');

  const handleGoToMainApp = () => {
    console.log('🚀 EntryScreen: Navigating to MainTabs...');
    navigation.navigate('MainTabs'); // We will rename 'Main' to 'MainTabs' later.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Bebeğim!</Text>
      <Text style={styles.subtitle}>This is the Entry Screen.</Text>
      <Button title="Continue to App" onPress={handleGoToMainApp} />
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 20,
  },
});

export default EntryScreen;
