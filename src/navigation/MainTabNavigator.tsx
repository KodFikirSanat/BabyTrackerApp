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
// AddBabyScreen is no longer a tab
import AIScreen from '../screens/AIScreen';
import GuidesStackNavigator from './GuidesStackNavigator';
import ProfileScreen from '../screens/ProfileScreen';

// JULES: Import SVG files to be used as icons.
// The user will need to create these files.
import HomeIcon from '../assets/icons/home.svg';
import TrackingIcon from '../assets/icons/tracking.svg';
import AIIcon from '../assets/icons/ai.svg';
import GuidesIcon from '../assets/icons/guides.svg';
import ProfileIcon from '../assets/icons/profile.svg';


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
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({color}) => <HomeIcon width={24} height={24} fill={color} />,
        }}
      />
      <Tab.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{
          tabBarLabel: 'Takip',
          tabBarIcon: ({color}) => <TrackingIcon width={24} height={24} fill={color} />,
        }}
      />
      <Tab.Screen
        name="AI"
        component={AIScreen}
        options={{
          tabBarLabel: 'Yapay Uzman',
          tabBarIcon: ({color}) => <AIIcon width={24} height={24} fill={color} />,
        }}
      />
      <Tab.Screen
        name="Guides"
        component={GuidesStackNavigator}
        options={{
          tabBarLabel: 'Rehberler',
          tabBarIcon: ({color}) => <GuidesIcon width={24} height={24} fill={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({color}) => <ProfileIcon width={24} height={24} fill={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
