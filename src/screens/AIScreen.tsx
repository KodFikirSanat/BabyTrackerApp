// src/screens/AIScreen.tsx

/**
 * @file AI chat screen for asking questions.
 * @format
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AIScreen = () => {
  console.log('🚀 AIScreen: Component mounted');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yapay Zeka Sayfası</Text>
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

export default AIScreen;
