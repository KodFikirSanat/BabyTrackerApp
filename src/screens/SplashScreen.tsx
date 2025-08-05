// src/screens/SplashScreen.tsx

/**
 * @file SplashScreen.tsx
 * @description The very first screen the user sees, indicating that the app is loading.
 *              It displays while initial authentication and data checks are performed.
 *
 * @format
 */

import React from 'react';
import {View, StyleSheet, Image, ActivityIndicator} from 'react-native';

const SplashScreen = (): React.JSX.Element => {
  console.log('💧✅ SplashScreen: Component has mounted.');
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/babywise/app_icon.jpg')}
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#6b9ac4" style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // A clean white background
  },
  logo: {
    width: 200, // Set a fixed width for the logo
    height: 200, // Set a fixed height for the logo
    borderRadius: 100, // Make it circular
    marginBottom: 30, // Space between logo and spinner
  },
  spinner: {
    position: 'absolute',
    bottom: 80, // Position the spinner towards the bottom
  },
});

export default SplashScreen;
