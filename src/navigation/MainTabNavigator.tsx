// src/navigation/MainTabNavigator.tsx

/**
 * @file This component defines the main bottom tab navigation of the application.
 * It includes tabs for Tracking, AI, and Guides.
 *
 * @format
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Import the screens for the tabs
import TrackingScreen from '../screens/TrackingScreen';
import AIScreen from '../screens/AIScreen';
import GuidesScreen from '../screens/GuidesScreen';

// This type will be used to ensure type safety for the tab navigator's screens.
// We will add this to our main navigation types file in the next step.
export type MainTabParamList = {
  Tracking: undefined;
  AI: undefined;
  Guides: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  // 🚀 Log when the tab navigator loads.
  console.log('🚀 MainTabNavigator: Component loading...');

  return (
    <Tab.Navigator
      screenOptions={{
        // Use the header from the parent Stack navigator
        headerShown: false,
        // Active tab color - using the blue from your doc
        tabBarActiveTintColor: '#6b9ac4',
        // Inactive tab color
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff', // White background for the tab bar
        },
      }}>
      <Tab.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{
          tabBarLabel: 'Takip',
          // Icons will be added in a future step
        }}
      />
      <Tab.Screen
        name="AI"
        component={AIScreen}
        options={{
          tabBarLabel: 'Yapay Zeka',
        }}
      />
      <Tab.Screen
        name="Guides"
        component={GuidesScreen}
        options={{
          tabBarLabel: 'Rehberler',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
