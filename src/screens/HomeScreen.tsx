// src/screens/HomeScreen.tsx

/**
 * @file Defines the HomeScreen, the central landing page within the main tab navigator.
 *
 * @format
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../types/navigation';

/**
 * Type definition for the Home screen's navigation props,
 * ensuring type safety for navigation events.
 */
type HomeScreenProps = BottomTabScreenProps<MainTabParamList, 'Home'>;

/**
 * The primary landing screen after a user enters the main application.
 * It provides a welcome message and will later contain summaries or quick actions.
 *
 * @param {HomeScreenProps} props - The component's props, used for navigation event listening.
 * @returns {React.JSX.Element} The rendered home screen.
 */
const HomeScreen = ({navigation}: HomeScreenProps): React.JSX.Element => {
  console.log('🏠🎨 HomeScreen: Rendering...');

  useEffect(() => {
    console.log('🏠✅ HomeScreen: Component did mount.');

    // This listener fires every time the user navigates TO this screen.
    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log('🏠👁️ HomeScreen: Screen is focused.');
    });

    // This listener fires every time the user navigates AWAY from this screen.
    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log('🏠💨 HomeScreen: Screen is blurred.');
    });

    // The cleanup function is crucial to remove the listeners and prevent memory leaks
    // when the component is eventually unmounted.
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      console.log('🏠🧹 HomeScreen: Listeners cleared on unmount.');
    };
  }, [navigation]);

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
