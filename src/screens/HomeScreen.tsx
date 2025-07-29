// src/screens/HomeScreen.tsx

/**
 * @file The main home screen of the application.
 * This is the first screen the user sees after the splash screen.
 *
 * @format
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

// Type definition for the Home screen props.
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: HomeScreenProps) => {
  // 🚀 Log when the component mounts.
  console.log('🚀 HomeScreen: Component mounted');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Bebeğim!</Text>
      <Text style={styles.subtitle}>This is the Home Screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginTop: 10,
  },
});

export default HomeScreen;
