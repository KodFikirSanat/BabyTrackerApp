// App.tsx

/**
 * @file The absolute entry point of the Bebeğim application.
 * Its primary responsibility is to set up the top-level providers,
 * such as the NavigationContainer, AuthProvider, and SafeAreaProvider.
 *
 * It also manages the navigation flow based on the user's authentication state.
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AuthProvider, useAuth} from './src/context/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import EntryScreen from './src/screens/EntryScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import {RootStackParamList} from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * The core navigation logic of the application.
 * It decides which screen to show based on the authentication status.
 * @returns {React.JSX.Element} The navigator component.
 */
const RootNavigator = () => {
  const {user, loading} = useAuth();
  console.log(
    `📱🎨 RootNavigator: Rendering... Loading: ${loading}, User: ${
      user ? user.email : 'null'
    }`,
  );

  if (loading) {
    return <Stack.Screen name="Splash" component={SplashScreen} />;
  }

  return (
    <>
      {user ? (
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Entry" component={EntryScreen} />
      )}
    </>
  );
};

/**
 * The root component of the entire application.
 * It establishes the context for safe areas, authentication, and navigation.
 *
 * @returns {React.JSX.Element} The root of the application's component tree.
 */
function App(): React.JSX.Element {
  console.log('📱🎨 App: Root component rendering...');

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <RootNavigator />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
