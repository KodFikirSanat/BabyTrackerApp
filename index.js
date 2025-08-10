// Silence modular deprecation warnings during migration per RNFirebase v22 guide
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

// Register background handler for FCM messages as early as possible
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Keep it lightweight: avoid UI/state changes here
  console.log('🔔 Message handled in the background!', remoteMessage?.messageId);
});
