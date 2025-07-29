// App.tsx

/**
 * @file The entry point of the Bebeğim application.
 * This file renders the main AppNavigator component.
 *
 * @format
 */

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';

/**
 * The root component of the application.
 * It wraps the entire app in a SafeAreaProvider for handling safe areas on devices
 * and renders the main navigator.
 */
function App(): React.JSX.Element {
  // 🚀 Log that the root App component is rendering.
  console.log('🚀 App.tsx: Root component rendered');
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
