# File: 3_Project-Current-Sum.md
# Purpose: To provide a high-level summary of the project's current state, including architecture, component interactions, and known issues.
# Audience: All AI Assistants and Human Developers.
# Last Updated: 2025-08-01

## 1. Overall Architecture & Navigation Flow

The project is structured around a nested navigation system using `React Navigation`. The user's journey is intended to be:

1.  **`SplashScreen`**: A temporary welcome screen.
2.  **`EntryScreen`**: A gateway screen with a "Continue" button.
3.  **`MainTabs`**: The core of the application, which should be a 5-tab bottom navigator.

This flow is orchestrated by two main navigator files:

-   `AppNavigator.tsx`: A `StackNavigator` intended to manage the top-level transitions between `Splash`, `Entry`, and the main application.
-   `MainTabNavigator.tsx`: A `BottomTabNavigator` intended to manage the five primary screens: `Home`, `Tracking`, `AI`, `Guides`, and `Profile`.

## 2. Component & Data Interaction

-   **`App.tsx`**: Serves as the application's root. Its sole responsibility is to render the `AppNavigator` within necessary providers (`SafeAreaProvider`, `NavigationContainer`).

-   **`navigation/AppNavigator.tsx`**: This file acts as the main router. It wraps the `MainTabNavigator` as one of its screens. It is also responsible for rendering a shared header across the main application screens.

-   **`navigation/MainTabNavigator.tsx`**: This file is intended to provide the 5-tab navigation bar. It renders the various `screens/*.tsx` components based on the active tab.

-   **`types/navigation.ts`**: This file is the "contract" that defines the valid routes and their parameters for both navigators. It is the single source of truth for navigation types.

-   **`screens/*.tsx`**: These are the feature screens. They receive navigation capabilities through props and use `navigation.addListener` to log events when they are focused or blurred.

## 3. Current State: Known Issues & Inconsistencies (CRITICAL)

**The project is currently in a non-compilable state due to conflicting architectural decisions that were recently pushed.**

The core of the problem is a disagreement between the navigators on how the `Profile` screen should be handled.

1.  **Architectural Conflict:**
    *   **`AppNavigator.tsx`'s View:** This file attempts to define a custom header with a "PROFİL" button that navigates to a `Profile` screen managed directly by the Stack Navigator.
    *   **`types/navigation.ts`'s View:** The type definitions state that `Profile` is a screen *inside* the `MainTabParamList`, meaning it should be one of the five bottom tabs, not a separate stack screen.

2.  **Resulting Code Errors:**
    *   **Type Error in `AppNavigator.tsx`**: The line `<Stack.Screen name="Profile" ... />` causes a fatal TypeScript error because `Profile` does not exist as a key in the `RootStackParamList` type. **This is the primary reason the application fails to build.**
    *   **Incomplete `MainTabNavigator.tsx`**: While the type contract (`MainTabParamList`) requires a `Profile` tab, the `MainTabNavigator.tsx` file does not currently import or render the `ProfileScreen` as one of its tabs. This is a logical inconsistency that would cause a runtime error if the build succeeded.

**Conclusion:** Before any new features can be added, the architectural conflict regarding the `Profile` screen must be resolved. A decision must be made: Is `Profile` a top-level screen accessed from the header, or is it a tab on the bottom bar? Once this decision is made, `AppNavigator.tsx`, `MainTabNavigator.tsx`, and `types/navigation.ts` must all be aligned to reflect that single source of truth.
