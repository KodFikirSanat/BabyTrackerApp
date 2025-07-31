// src/navigation/MainTabNavigator.tsx

/**
 * @file Defines the MainTabNavigator, which is the bottom tab bar
 * containing the five primary screens of the application.
 *
 * @format
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../types/navigation';

// Import all screens that will be used as tabs
import HomeScreen from '../screens/HomeScreen';
import TrackingScreen from '../screens/TrackingScreen';
import AddBabyScreen from '../screens/AddBabyScreen'; // Import the new screen
import AIScreen from '../screens/AIScreen';
import GuidesScreen from '../screens/GuidesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * A functional component that sets up and returns the 5-tab bottom navigator.
 * This navigator is nested within the `AppNavigator` and does not show its own header.
 *
 * @returns {React.JSX.Element} The rendered bottom tab navigator component.
 */
const MainTabNavigator = (): React.JSX.Element => {
  console.log('🗂️🎨 MainTabNavigator: Rendering...');

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, // The header is managed by the parent AppNavigator.
        tabBarActiveTintColor: '#6b9ac4',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarLabel: 'Ana Sayfa'}}
      />
      <Tab.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{tabBarLabel: 'Takip'}}
      />
      
      
      <Tab.Screen
        name="Guides"
        component={GuidesScreen}
        options={{tabBarLabel: 'Rehberler'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{tabBarLabel: 'Profil'}}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
