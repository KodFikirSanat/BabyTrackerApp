// src/types/navigation.ts

/**
 * @file Defines the TypeScript types for the application's navigation structure.
 * This ensures type safety for route names and parameters across all navigators.
 *
 * @format
 */

import type {NavigatorScreenParams} from '@react-navigation/native';

/**
 * Defines the screen parameters for the main bottom tab navigator.
 * This navigator contains the core screens accessible from the tab bar.
 * A value of `undefined` indicates that the route takes no parameters.
 */
export type MainTabParamList = {
  Home: undefined; // Keeping Home for now, will adjust if needed
  Tracking: undefined;
  AI: undefined;
  Guides: undefined;
};

/**
 * Defines the screen parameters for the root stack navigator.
 * This is the highest-level navigator which can show modal-like screens
 * over the main tabs.
 */
export type RootStackParamList = {
  Splash: undefined;
  Entry: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  AddBaby: undefined;
  Profile: undefined; // Profile is now a root stack screen
};
