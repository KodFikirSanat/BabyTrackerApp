// src/screens/AIScreen.tsx

/**
 * @file Defines the AIScreen, providing an interface for users
 * to interact with an AI assistant.
 *
 * @format
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../types/navigation';

/**
 * Type definition for the AI screen's navigation props.
 */
type AIScreenProps = BottomTabScreenProps<MainTabParamList, 'AI'>;

/**
 * A screen where users can ask questions and receive AI-powered advice.
 * This component is part of the main tab navigation.
 *
 * @param {AIScreenProps} props - The component's props, used for navigation event listening.
 * @returns {React.JSX.Element} The rendered AI screen.
 */
const AIScreen = ({navigation}: AIScreenProps): React.JSX.Element => {
  console.log('🤖🎨 AIScreen: Rendering...');

  useEffect(() => {
    console.log('🤖✅ AIScreen: Component did mount.');

    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log('🤖👁️ AIScreen: Screen is focused.');
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log('🤖💨 AIScreen: Screen is blurred.');
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      console.log('🤖🧹 AIScreen: Listeners cleared on unmount.');
    };
  }, [navigation]);

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
