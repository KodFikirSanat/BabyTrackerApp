// src/screens/EntryScreen.tsx

/**
 * @file Defines the EntryScreen, which serves as a gateway to the main application.
 *
 * @format
 */

import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

/**
 * Type definition for the Entry screen's navigation props.
 */
type EntryScreenProps = NativeStackScreenProps<RootStackParamList, 'Entry'>;

/**
 * The screen presented to the user after the splash screen.
 * It provides a single action to proceed into the main application's tab navigator.
 *
 * @param {EntryScreenProps} props - The component's props, used for navigation.
 * @returns {React.JSX.Element} The rendered entry screen component.
 */
const EntryScreen = ({navigation}: EntryScreenProps): React.JSX.Element => {
  console.log('🚪🎨 EntryScreen: Rendering...');

  /**
   * Handles navigation to the main tab-based interface of the application.
   */
  const handleGoToMainApp = () => {
    console.log('🚪➡️ EntryScreen: Navigating to MainTabs...');
    // `replace` is used to prevent the user from being able to navigate back
    // to this introductory screen from the main application.
    // To satisfy TypeScript, we explicitly navigate to the initial screen of the tab navigator.
    navigation.replace('MainTabs', {screen: 'Home'});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Bebeğim!</Text>
      <Text style={styles.subtitle}>This is the Entry Screen.</Text>
      <Button title="Continue to App" onPress={handleGoToMainApp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 20,
  },
});

export default EntryScreen;
