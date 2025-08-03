// src/screens/SplashScreen.tsx

/**
 * @file SplashScreen.tsx
 * @description This screen is displayed while the application is performing
 *              initial loading tasks, such as determining the user's
 *              authentication status or fetching initial data.
 *
 * @format
 */

import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

/**
 * @name SplashScreen
 * @description A simple, stateless component that shows a loading indicator
 *              and a message to the user.
 * @returns {React.JSX.Element} A React Element representing the splash screen.
 */
const SplashScreen = (): React.JSX.Element => {
  console.log('⏳✅ SplashScreen: Component has mounted.');

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={styles.text}>Yükleniyor...</Text>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6b9ac4', // A calming color for a loading screen.
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default SplashScreen;
