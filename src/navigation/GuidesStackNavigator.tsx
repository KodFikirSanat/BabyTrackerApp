// src/navigation/GuidesStackNavigator.tsx

/**
 * @file GuidesStackNavigator.tsx
 * @description This file defines a nested stack navigator specifically for the "Guides" section.
 *              It allows navigation from a list of guides to a detailed view of a single guide.
 *              This entire navigator is rendered within one of the tabs of the MainTabNavigator.
 *
 * @format
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HeaderRightMenu from '../components/HeaderRightMenu';
import HeaderLeftBack from '../components/HeaderLeftBack';

// --- Screen Components ---
// The screens that are part of this specific navigation stack.
import GuidesScreen from '../screens/GuidesScreen';
import GuideDetailScreen from '../screens/GuideDetailScreen';

/**
 * @type GuidesStackParamList
 * @description Defines the route names and parameters for the screens within this stack.
 * @property {undefined} GuidesList - The main screen showing the list of all guides. No params needed.
 * @property {{ guide: ... }} GuideDetail - The screen showing a single guide's details. Requires a 'guide' object.
 */
export type GuidesStackParamList = {
  GuidesList: undefined;
  GuideDetail: {guide: {title: string; content: string; imageUrl?: string}};
};

// Create a stack navigator instance for the guides section.
const Stack = createNativeStackNavigator<GuidesStackParamList>();

/**
 * @name GuidesStackNavigator
 * @description The component that sets up the stack navigator for the guides flow.
 *              It registers all the screens that belong to this flow.
 * @returns {React.JSX.Element} The rendered stack navigator.
 */
const GuidesStackNavigator = (): React.JSX.Element => {
  console.log('🧭✅ GuidesStackNavigator: Component has mounted.');
  return (
    <Stack.Navigator
      // Default options for all screens in this stack.
      screenOptions={{
        title: 'BabyWise',
        headerTitleAlign: 'center',
        headerRight: () => <HeaderRightMenu />,
      }}
      // The first screen to be displayed in this stack.
      initialRouteName="GuidesList">
      <Stack.Screen
        name="GuidesList"
        component={GuidesScreen}
        // GuidesList is the top level, so it shouldn't have a back button.
        // We leave headerLeft to its default state.
      />
      <Stack.Screen
        name="GuideDetail"
        component={GuideDetailScreen}
        options={{
          // Only show the back button on the detail screen.
          headerLeft: () => <HeaderLeftBack />,
        }}
      />
    </Stack.Navigator>
  );
};

export default GuidesStackNavigator;
