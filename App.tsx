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
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {AuthProvider, useAuth} from './src/context/AuthContext';
import {BabyProvider} from './src/context/BabyContext';

import SplashScreen from './src/screens/SplashScreen';
import EntryScreen from './src/screens/EntryScreen';
import AddBabyScreen from './src/screens/AddBabyScreen';
import ProfileScreen from './src/screens/ProfileScreen'; // ProfileScreen'i import et
import MainTabNavigator from './src/navigation/MainTabNavigator';
import {RootStackParamList} from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * @name AppNavigator
 * @description Manages the navigation flow based on the user's authentication state.
 *              It decides which screens are accessible.
 */
const AppNavigator = () => {
  const {user, loading} = useAuth();
  
  console.log('🗺️⏳ AppNavigator: Checking auth state...', { loading, user: !!user });

  if (loading) {
    // While checking auth, show a splash screen. Using a dedicated screen component
    // is better than returning the component directly to provide navigation context.
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        // User is authenticated, show main app screens.
        // Using Stack.Group prevents TypeScript errors with conditional rendering.
        <Stack.Group>
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="AddBaby" component={AddBabyScreen} options={{ title: 'Bebek Ekle' }}/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
        </Stack.Group>
      ) : (
        // User is not authenticated, show the entry screen.
        <Stack.Screen
          name="Entry"
          component={EntryScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

/**
 * @name App
 * @description The root component of the entire application, wrapping everything in providers.
 * @returns {React.JSX.Element} The root of the application's component tree.
 */
function App(): React.JSX.Element {
  console.log('📱✅ App: Root component mounted.');
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BabyProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </BabyProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
