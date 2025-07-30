// src/screens/SplashScreen.tsx

/**
 * @file This file defines the SplashScreen component, which is the first visual
 * element shown to the user upon opening the application.
 *
 * @format
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

/**
 * Type definition for the Splash screen's navigation props.
 * This ensures type safety when using the navigation object.
 */
type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

/**
 * A temporary screen displayed while the app initializes.
 * Its primary purpose is to provide a smooth transition into the app
 * while any necessary assets or data are loaded in the background.
 *
 * @param {SplashScreenProps} props - The component's props, primarily for navigation.
 * @returns {React.JSX.Element} The rendered splash screen component.
 */
const SplashScreen = ({navigation}: SplashScreenProps): React.JSX.Element => {
  console.log('⏳🎨 SplashScreen: Rendering...');

  /**
   * This effect handles the automatic navigation away from the splash screen.
   * It runs only once after the component has mounted.
   */
  useEffect(() => {
    console.log('⏳✅ SplashScreen: Component mounted, setting up navigation timer.');
    const navigationTimer = setTimeout(() => {
      console.log('⏳➡️ SplashScreen: Timer finished, navigating to Entry screen.');
      // `replace` is used here to prevent the user from navigating back to the splash screen.
      // This is a common pattern for one-off screens like this.
      navigation.replace('Entry');
    }, 3000); // A 3-second delay provides a brief, non-jarring user experience.

    // The cleanup function is essential to prevent memory leaks or unexpected navigation
    // if the user closes the app or the component unmounts before the timer fires.
    return () => {
      console.log('⏳🧹 SplashScreen: Clearing navigation timer on unmount.');
      clearTimeout(navigationTimer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❤️ Bebeğim 😍</Text>
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
