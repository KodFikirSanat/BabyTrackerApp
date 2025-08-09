// App.tsx

/**
 * @file The absolute entry point of the Bebeğim application.
 * It sets up top-level providers and manages the navigation flow based
 * on authentication and user data.
 *
 * @format
 */

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
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
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Renders the correct screen within a single, stable navigator based on app state.
 */
const AppContent = () => {
  const {user, loading: authLoading} = useAuth();
  const {babies, loading: babiesLoading} = useBaby();

  useEffect(() => {
    const setupNotifications = async () => {
      if (user) {
        try {
          await messaging().requestPermission();
          const fcmToken = await messaging().getToken();
          if (fcmToken) {
            console.log('📱 FCM Token:', fcmToken);
            await firestore()
              .collection('users')
              .doc(user.uid)
              .set({fcmToken}, {merge: true});
          }
        } catch (error) {
          console.error('Error setting up notifications:', error);
        }
      }
    };
    setupNotifications();
  }, [user]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {authLoading || babiesLoading ? (
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
      ) : !user ? (
        <Stack.Screen
          name="Entry"
          component={EntryScreen}
          options={{headerShown: false}}
        />
      ) : babies.length === 0 ? (
        <Stack.Screen
          name="AddBaby"
          component={AddBabyScreen}
          options={{headerShown: false}}
        />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          {/* AddBaby screen should always be available for navigation */}
          <Stack.Screen
            name="AddBaby"
            component={AddBabyScreen}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

/**
 * The root component setting up providers and the navigation container.
 */
function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BabyProvider>
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
        </BabyProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
