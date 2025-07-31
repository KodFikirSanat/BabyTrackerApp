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
  // AddBaby is removed from here to make it a root-level screen
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
  AddBaby: undefined; // Screen for adding the first baby, now at the root level
  GuideDetail: {guide: {title: string; content: string; imageUrl?: string}};
  /**
   * This route represents the entire nested bottom tab navigator.
   * `NavigatorScreenParams` allows the root stack to receive and pass down
   * navigation parameters to the screens within `MainTabParamList`.
   */
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  AddBaby: undefined;
  Profile: undefined; // Profile is now a root stack screen
};
