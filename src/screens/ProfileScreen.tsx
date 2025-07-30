// src/screens/ProfileScreen.tsx

/**
 * @file Defines the ProfileScreen, where users can view and manage their
 * profile and baby's information.
 *
 * @format
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../types/navigation';

/**
 * Type definition for the Profile screen's navigation props.
 * It now correctly uses BottomTabScreenProps as it's part of the MainTabParamList.
 */
type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;

/**
 * A screen for managing user and baby-related settings and information.
 * This screen is accessed from the main header, not from the tab bar.
 *
 * @param {ProfileScreenProps} props - The component's props, used for navigation event listening.
 * @returns {React.JSX.Element} The rendered profile screen.
 */
const ProfileScreen = ({navigation}: ProfileScreenProps): React.JSX.Element => {
  console.log('👤🎨 ProfileScreen: Rendering...');

  useEffect(() => {
    console.log('👤✅ ProfileScreen: Component did mount.');

    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log('👤👁️ ProfileScreen: Screen is focused.');
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log('👤💨 ProfileScreen: Screen is blurred.');
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      console.log('👤🧹 ProfileScreen: Listeners cleared on unmount.');
    };
  }, [navigation]);

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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
