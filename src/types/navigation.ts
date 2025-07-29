// src/types/navigation.ts

/**
 * @file This file defines the type mappings for the React Navigation stack and tabs.
 * This ensures type safety for screen names and their parameters.
 *
 * @format
 */

/**
 * Defines the parameters for the main stack navigator.
 * This is the top-level navigator that handles screens before and after login,
 * including the main tab navigator.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RootStackParamList = {
  Splash: undefined; // The Splash screen, requires no parameters.
  Entry: undefined; // The Entry screen (previously Home), requires no parameters.
  MainTabs: undefined; // This route holds the entire Bottom Tab Navigator.
};

/**
 * Defines the parameters for the bottom tab navigator's screens.
 * Each key represents a tab screen name.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type MainTabParamList = {
  HomeTab: undefined;
  TrackingTab: undefined;
  AITab: undefined;
  GuidesTab: undefined;
  ProfileTab: undefined;
};
