// src/screens/HomeScreen.tsx

/**
 * @file The main Home screen, part of the bottom tab navigator.
 * This screen displays a welcome message and quick access buttons.
 *
 * @format
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const HomeScreen = () => {
  // 🚀 Log when the component mounts.
  console.log('🚀 HomeScreen: Component mounted');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ana Sayfa</Text>
      <Text style={styles.subtitle}>Hoş geldin! İşte son aktivitelerin.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'gray',
  },
});

export default HomeScreen;
