# File: 3_Project-Current-Sum.md
# Purpose: To provide a high-level summary of the project's current, stable state.
# Audience: All AI Assistants and Human Developers.
# Last Updated: 2025-08-01

## 1. Overall Architecture & Navigation Flow

The project is built on a stable, nested navigation architecture using `React Navigation`. The user flow is as follows:

1.  **`SplashScreen`**: A temporary welcome screen.
2.  **`EntryScreen`**: A gateway screen that directs the user to the main application.
3.  **`MainTabs`**: The core of the application, a `BottomTabNavigator` with 4 tabs.

This structure is managed by a clear separation of concerns between navigator components.

## 2. Component & Data Interaction

-   **`App.tsx`**: The application's root. It wraps the entire app in the essential `NavigationContainer` and renders the `AppNavigator`.

-   **`navigation/AppNavigator.tsx`**: The main `StackNavigator`. It manages the top-level transition between the `Splash`/`Entry` flow and the `MainTabs` section. It also provides a simple, consistent header for the main application area.

-   **`navigation/MainTabNavigator.tsx`**: A `BottomTabNavigator` that is nested within `AppNavigator`. It is responsible for rendering the four primary screens of the application:
    1.  `Home`
    2.  `Tracking`
    3.  `Guides`
    4.  `Profile`

-   **`types/navigation.ts`**: The "contract" defining the routes and parameters for both `StackNavigator` and `BottomTabNavigator`, ensuring type safety across the app.

-   **`screens/*.tsx`**: Feature screens of the application. Each screen now contains `navigation.addListener` for 'focus' and 'blur' events to provide detailed lifecycle logs.

## 3. Current State: Stable

The project is currently in a **stable, compilable, and runnable state.**

-   **AI Feature:** The previously existing AI feature, including `AIScreen.tsx` and its related navigation entries, has been completely removed.
-   **Navigation:** The navigation is based on a 4-tab system, and the architecture is consistent across all related files. There are no known navigation-related errors or warnings.
-   **Documentation & Logging:** All major components (`screens`, `navigators`, `App.tsx`) have been updated to meet the new JSDoc and console logging standards, improving readability and maintainability.

The project is now on a solid foundation, ready for the next phase of development.
