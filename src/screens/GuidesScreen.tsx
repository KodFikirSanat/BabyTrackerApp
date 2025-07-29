// src/screens/GuidesScreen.tsx

/**
 * @file Screen to display a list of guides.
 * @format
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const GuidesScreen = () => {
  console.log('🚀 GuidesScreen: Component mounted');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rehberler Sayfası</Text>
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

export default GuidesScreen;
