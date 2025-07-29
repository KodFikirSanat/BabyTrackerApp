// src/screens/SplashScreen.tsx

/**
 * @file The splash screen of the application.
 * This screen is shown for a brief period when the app starts.
 *
 * @format
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

// Type definition for the Splash screen props, using the RootStackParamList.
type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen = ({navigation}: SplashScreenProps) => {
  // 🚀 Log when the component mounts.
  console.log('🚀 SplashScreen: Component mounted');

  // This effect runs once after the component mounts.
  useEffect(() => {
    // ⏳ Log that the navigation timer is being set.
    console.log('⏳ SplashScreen: Setting timeout for navigation to Home screen.');
    const timer = setTimeout(() => {
      // 🚀 Log the navigation action.
      console.log('🚀 SplashScreen: Navigating to Entry screen...');
      navigation.replace('Entry'); // Use replace to prevent going back to the splash screen.
    }, 3000); // 3-second delay.

    // Cleanup function to clear the timer if the component unmounts.
    return () => {
      console.log('🧹 SplashScreen: Clearing navigation timeout.');
      clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bebeğim</Text>
      <Text style={styles.subtitle}>Baby Tracker App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginTop: 8,
  },
});

export default SplashScreen;
