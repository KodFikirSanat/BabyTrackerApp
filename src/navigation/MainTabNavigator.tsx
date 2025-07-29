// src/navigation/MainTabNavigator.tsx

/**
 * @file This component defines the main bottom tab navigation of the application.
 * It includes tabs for Home, Tracking, AI, Guides, and Profile.
 *
 * @format
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../types/navigation';

// Import the screens for the tabs
import HomeScreen from '../screens/HomeScreen';
import TrackingScreen from '../screens/TrackingScreen';
import AIScreen from '../screens/AIScreen';
import GuidesScreen from '../screens/GuidesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  // 🚀 Log when the tab navigator loads.
  console.log('🚀 MainTabNavigator: Component loading...');

  return (
    <Tab.Navigator
      initialRouteName="HomeTab" // Set the initial tab to be the Home tab
      screenOptions={{
        headerShown: false, // The header is handled by the parent StackNavigator
        tabBarActiveTintColor: '#6b9ac4', // Active icon/label color
        tabBarInactiveTintColor: 'gray', // Inactive icon/label color
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          // We will add icons later
        }}
      />
      <Tab.Screen
        name="TrackingTab"
        component={TrackingScreen}
        options={{
          tabBarLabel: 'Takip',
        }}
      />
      <Tab.Screen
        name="AITab"
        component={AIScreen}
        options={{
          tabBarLabel: 'Yapay Zeka',
        }}
      />
      <Tab.Screen
        name="GuidesTab"
        component={GuidesScreen}
        options={{
          tabBarLabel: 'Rehberler',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
