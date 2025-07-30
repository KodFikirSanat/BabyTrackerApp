// src/screens/GuidesScreen.tsx

/**
 * @file Defines the GuidesScreen, which displays a list of informational
 * articles and guides for parents.
 *
 * @format
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../types/navigation';

/**
 * Type definition for the Guides screen's navigation props.
 */
type GuidesScreenProps = BottomTabScreenProps<MainTabParamList, 'Guides'>;

/**
 * A screen that presents a list of expert-written guides on child development.
 * This component is part of the main tab navigation.
 *
 * @param {GuidesScreenProps} props - The component's props, used for navigation event listening.
 * @returns {React.JSX.Element} The rendered guides screen.
 */
const GuidesScreen = ({navigation}: GuidesScreenProps): React.JSX.Element => {
  console.log('📚🎨 GuidesScreen: Rendering...');

  useEffect(() => {
    console.log('📚✅ GuidesScreen: Component did mount.');

    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log('📚👁️ GuidesScreen: Screen is focused.');
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log('📚💨 GuidesScreen: Screen is blurred.');
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      console.log('📚🧹 GuidesScreen: Listeners cleared on unmount.');
    };
  }, [navigation]);

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
