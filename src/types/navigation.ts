// src/types/navigation.ts

/**
 * @file Defines the TypeScript types for the application's navigation structure.
 * This ensures type safety for route names and parameters across all navigators.
 *
 * @format
 */

import type {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Category} from './log';

/**
 * Defines the screen parameters for the main bottom tab navigator.
 * This navigator contains the core screens accessible from the tab bar.
 * A value of `undefined` indicates that the route takes no parameters.
 */
export type MainTabParamList = {
  Home: undefined;
  Tracking: {babyId?: string; initialCategory: Category} | undefined;
  AI: undefined;
  Guides: undefined;
  Profile: undefined;
};

/**
 * Defines the screen parameters for the root stack navigator.
 * This is the highest-level navigator which can show modal-like screens
 * over the main tabs.
 */
export type RootStackParamList = {
  Splash: undefined;
  Entry: undefined;
  AddBaby: undefined;
  /**
   * This route represents the entire nested bottom tab navigator.
   * `NavigatorScreenParams` allows the root stack to receive and pass down
   * navigation parameters to the screens within `MainTabParamList`.
   */
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};

/**
 * @type ProfileScreenNavigationProps
 * @description This is a composite type for the Profile screen's navigation props.
 * It combines the screen's own props as a tab (`BottomTabScreenProps`) with the
 * props of the parent stack navigator (`NativeStackScreenProps`). This allows `ProfileScreen`
 * to navigate to screens that exist in the parent stack, like `AddBaby`.
 */
export type ProfileScreenNavigationProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;
