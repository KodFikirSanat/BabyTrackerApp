// src/navigation/AppNavigator.tsx

/**
 * @file Defines the main Stack Navigator for the application.
 * It orchestrates transitions between the initial screens (Splash, Entry)
 * and the main application area, which is the Tab Navigator.
 *
 * @format
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import screens and the nested tab navigator
import SplashScreen from '../screens/SplashScreen';
import EntryScreen from '../screens/EntryScreen';
import MainTabNavigator from './MainTabNavigator';

import {RootStackParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * The root navigator component that manages top-level screen transitions.
 * It displays a simple header for the main application section.
 *
 * @returns {React.JSX.Element} The rendered stack navigator.
 */
const AppNavigator = (): React.JSX.Element => {
  console.log('🗺️🎨 AppNavigator: Rendering...');

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#e5d4f1',
        },
        headerTintColor: '#000000',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Entry"
        component={EntryScreen}
        options={{headerShown: false}}
      />
      {/*
       * The MainTabs screen holds the entire 5-tab navigator.
       * It is given a simple title, and no custom header buttons are defined,
       * leading to a clean and straightforward header.
       */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{title: 'Bebeğim'}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
