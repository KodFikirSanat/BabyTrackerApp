// App.tsx

/**
 * @file The absolute entry point of the Bebeğim application.
 * It sets up top-level providers and manages the navigation flow based
 * on authentication and user data (e.g., whether a baby profile exists).
 *
 * @format
 */

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//import {SafeAreaProvider} from 'react-native-safe-area-context';

import {AuthProvider, useAuth} from './src/context/AuthContext';
import {BabyProvider, useBaby} from './src/context/BabyContext';

import SplashScreen from './src/screens/SplashScreen';
import EntryScreen from './src/screens/EntryScreen';
import AddBabyScreen from './src/screens/AddBabyScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import {RootStackParamList} from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * The core navigation logic. It decides which screen to show based on
 * the authentication and baby data loading status.
 */
const RootNavigator = () => {
  const {user, loading: authLoading} = useAuth();
  const {babies, loading: babiesLoading} = useBaby();

  useEffect(() => {
    const setupNotifications = async () => {
      if (user) {
        try {
          // 1. Request Permission
          await messaging().requestPermission();

          // 2. Get Token
          const fcmToken = await messaging().getToken();

          if (fcmToken) {
            console.log('📱 FCM Token:', fcmToken);
            // 3. Save Token to Firestore
            await firestore().collection('users').doc(user.uid).set(
              {
                fcmToken: fcmToken,
              },
              {merge: true}, // Use merge to avoid overwriting other user data
            );
          }
        } catch (error) {
          console.error('Error setting up notifications:', error);
        }
      }
    };

    setupNotifications();
  }, [user]);

  console.log(
    `📱🎨 RootNavigator: AuthLoading: ${authLoading}, BabiesLoading: ${babiesLoading}, User: ${user?.email}, Babies: ${babies.length}`
  );

  // While either context is loading, show the splash screen.
  if (authLoading || babiesLoading) {
    return <Stack.Screen name="Splash" component={SplashScreen} />;
  }

  // If there is no user, show the entry/login screen.
  if (!user) {
    return <Stack.Screen name="Entry" component={EntryScreen} />;
  }

  // If the user is logged in but has no babies, force them to the AddBaby screen.
  // This screen is now part of the root stack, not the tab navigator.
  if (user && babies.length === 0) {
    return <Stack.Screen name="AddBaby" component={AddBabyScreen} />;
  }

  // If the user is logged in and has at least one baby, show the main app.
  return <Stack.Screen name="MainTabs" component={MainTabNavigator} />;
};

/**
 * The root component of the application.
 */
function App(): React.JSX.Element {
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
