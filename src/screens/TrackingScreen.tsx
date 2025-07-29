// src/screens/TrackingScreen.tsx

/**
 * @file Tracking screen for logging baby's activities.
 * @format
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const TrackingScreen = () => {
  console.log('🚀 TrackingScreen: Component mounted');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Takip Sayfası</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TrackingScreen;
