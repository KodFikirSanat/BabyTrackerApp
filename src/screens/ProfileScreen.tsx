// src/screens/ProfileScreen.tsx

/**
 * @file The user's profile screen.
 * Displays and allows editing of baby and user information.
 *
 * @format
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ProfileScreen = () => {
  // 🚀 Log when the component mounts.
  console.log('🚀 ProfileScreen: Component mounted');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profilim Sayfası</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
