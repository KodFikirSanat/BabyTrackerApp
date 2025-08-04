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
import {SvgProps} from 'react-native-svg';

// Import all screens that will be used as tabs
import HomeScreen from '../screens/HomeScreen';
import TrackingScreen from '../screens/TrackingScreen';
import AIScreen from '../screens/AIScreen';
import GuidesStackNavigator from './GuidesStackNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import HeaderRightMenu from '../components/HeaderRightMenu';

// Import all icons
import HomeIcon from '../assets/icons/homeIcon.svg';
import TrackingIcon from '../assets/icons/tracking.svg';
import AIIcon from '../assets/icons/AIIcon.svg';
import GuideIcon from '../assets/icons/guideIcon.svg';
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

  const getTabBarIcon =
    (Icon: React.FC<SvgProps>) =>
    ({color, size}: {color: string; size: number}) =>
      <Icon width={size} height={size} fill={color} />;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        title: 'BabyWise',
        headerTitleAlign: 'center',
        headerRight: () => <HeaderRightMenu />,
        tabBarActiveTintColor: '#6b9ac4',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: getTabBarIcon(HomeIcon),
        }}
      />
      <Tab.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{
          tabBarLabel: 'Takip',
          tabBarIcon: getTabBarIcon(TrackingIcon),
        }}
      />
      <Tab.Screen
        name="AI"
        component={AIScreen}
        options={{
          tabBarLabel: 'Yapay Uzman',
          tabBarIcon: getTabBarIcon(AIIcon),
        }}
      />
      <Tab.Screen
        name="Guides"
        component={GuidesStackNavigator}
        options={{
          headerShown: false, // This navigator will manage its own header
          tabBarLabel: 'Rehberler',
          tabBarIcon: getTabBarIcon(GuideIcon),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: getTabBarIcon(ProfileIcon),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
