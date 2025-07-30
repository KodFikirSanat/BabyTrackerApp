// src/screens/TrackingScreen.tsx

/**
 * @file Defines the TrackingScreen, the primary interface for users
 * to log their baby's activities and development milestones.
 *
 * @format
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../types/navigation';

/**
 * Type definition for the Tracking screen's navigation props.
 */
type TrackingScreenProps = BottomTabScreenProps<MainTabParamList, 'Tracking'>;

/**
 * The main screen for tracking a baby's daily routines and growth.
 * This component will serve as the default screen within the MainTabNavigator.
 *
 * @param {TrackingScreenProps} props - The component's props, used for navigation event listening.
 * @returns {React.JSX.Element} The rendered tracking screen.
 */
const TrackingScreen = ({navigation}: TrackingScreenProps): React.JSX.Element => {
  console.log('📈🎨 TrackingScreen: Rendering...');

  useEffect(() => {
    console.log('📈✅ TrackingScreen: Component did mount.');

    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log('📈👁️ TrackingScreen: Screen is focused.');
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log('📈💨 TrackingScreen: Screen is blurred.');
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      console.log('📈🧹 TrackingScreen: Listeners cleared on unmount.');
    };
  }, [navigation]);

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
