// src/navigation/AppNavigator.tsx

/**
 * @file This component sets up the main navigation stack for the application.
 * It uses React Navigation's native stack navigator.
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import screen components
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';

// Import the RootStackParamList type for type safety
import {RootStackParamList} from '../types/navigation';

// Create the native stack navigator, providing the RootStackParamList for type checking.
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // 🚀 Log when the navigator component loads.
  console.log('🚀 AppNavigator: Component loading...');

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#e5d4f1', // Main color from your design document
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}} // Hide header for the splash screen
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Bebeğim'}} // Title for the Home screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
