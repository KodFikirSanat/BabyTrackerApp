// App.tsx

/**
 * @file The absolute entry point of the Bebeğim application.
 * Its primary responsibility is to set up the top-level providers,
 * such as the NavigationContainer and SafeAreaProvider.
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * The root component of the entire application.
 * It establishes the context for safe areas and navigation.
 *
 * @returns {React.JSX.Element} The root of the application's component tree.
 */
function App(): React.JSX.Element {
  console.log('📱🎨 App: Root component rendering...');

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
