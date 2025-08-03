// App.tsx

/**
 * @file The absolute entry point of the Bebeğim application.
 * It sets up top-level providers and manages the navigation flow based
 * on authentication and user data (e.g., whether a baby profile exists).
 *
 * @format
 */

import React, {useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

import {AuthProvider, useAuth} from './src/context/AuthContext';
import {BabyProvider, useBaby} from './src/context/BabyContext';
import {RootStackParamList} from './src/types/navigation';

import SplashScreen from './src/screens/SplashScreen';
import EntryScreen from './src/screens/EntryScreen';
import AddBabyScreen from './src/screens/AddBabyScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * A non-rendering component that orchestrates the main navigation flow.
 * It listens to authentication and data loading states and redirects the user
 * to the appropriate screen (Splash, Entry, AddBaby, or MainTabs).
 * It also handles the registration of the FCM token for push notifications.
 */
const NavigationLogic = () => {
  const {user, loading: authLoading} = useAuth();
  const {babies, loading: babiesLoading} = useBaby();
  const navigation = useNavigation();

  useEffect(() => {
    // This effect handles the navigation logic based on auth and data state.
    if (authLoading || babiesLoading) {
      console.log('📱⏳ App.tsx: Waiting for auth and baby data to load...');
      // Don't navigate until both are loaded. The Splash screen is shown by default.
      return;
    }

    let routeName: keyof RootStackParamList;
    if (!user) {
      routeName = 'Entry';
    } else if (babies.length === 0) {
      routeName = 'AddBaby';
    } else {
      routeName = 'MainTabs';
    }

    console.log(`📱➡️ App.tsx: Navigating to initial route: ${routeName}`);
    navigation.reset({
      index: 0,
      routes: [{name: routeName}],
    });
  }, [user, babies, authLoading, babiesLoading, navigation]);

  useEffect(() => {
    // This effect handles FCM token registration.
    const setupNotifications = async () => {
      if (user) {
        try {
          await messaging().requestPermission();
          const fcmToken = await messaging().getToken();
          if (fcmToken) {
            console.log('📱✅ FCM Token obtained successfully.');
            await firestore()
              .collection('users')
              .doc(user.uid)
              .set({fcmToken}, {merge: true});
          }
        } catch (error) {
          console.error('📱❌ Error setting up notifications:', error);
        }
      }
    };
    setupNotifications();
  }, [user]);

  return null; // This component does not render anything.
};

/**
 * Defines the application's root navigation stack.
 * It includes all top-level screens: Splash, Entry, AddBaby, Profile,
 * and the main tab navigator.
 * @returns A React Element containing the stack navigator.
 */
const AppNavigator = () => (
  <>
    <NavigationLogic />
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Entry" component={EntryScreen} />
      <Stack.Screen name="AddBaby" component={AddBabyScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  </>
);

/**
 * The root component of the entire application.
 * It wraps the whole app in necessary providers like SafeAreaProvider,
 * AuthProvider, BabyProvider, and the main NavigationContainer.
 * @returns The main application React Element.
 */
function App(): React.JSX.Element {
  useEffect(() => {
    console.log('📱✅ App: Component mounted and providers are set up.');
  }, []);

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
