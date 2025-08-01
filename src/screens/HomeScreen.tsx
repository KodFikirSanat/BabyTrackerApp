// src/screens/HomeScreen.tsx

/**
 * @file HomeScreen.tsx
 * @description This is the primary dashboard screen for the user after they are
 *              logged in and have a baby profile selected. It provides a summary
 *              and acts as a central hub. If no baby profile exists, it prompts
 *              the user to create one.
 *
 * @format
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Button, ActivityIndicator} from 'react-native';
import {useNavigation, CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainTabParamList, RootStackParamList} from '../types/navigation';
import {useBaby} from '../context/BabyContext';

/**
 * @type HomeScreenProps
 * @description Defines the navigation properties available to the HomeScreen.
 *              It's a composite type because this screen is part of a BottomTabNavigator
 *              which is nested inside a NativeStackNavigator. This gives it access to both
 *              `jumpTo` (from tabs) and `navigate` (from stack) functions.
 */
type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

/**
 * @name HomeScreen
 * @description The main component for the home screen.
 * @param {HomeScreenProps} props - The navigation props passed down from the navigator.
 */
const HomeScreen = ({navigation}: HomeScreenProps): React.JSX.Element => {
  console.log('🏠✅ HomeScreen: Component has mounted.');
  
  // --- Hooks ---
  // Subscribing to the BabyContext to get the list of babies, the selected baby, and loading status.
  const {babies, selectedBaby, loading} = useBaby();
  
  console.log(`🏠📊 HomeScreen: State update. Loading: ${loading}, Selected Baby: ${selectedBaby?.name || 'none'}, Total Babies: ${babies.length}`);

  // --- Conditional Rendering ---
  // While the baby data is being fetched, display a loading indicator.
  if (loading) {
    console.log('🏠⏳ HomeScreen: Baby data is loading...');
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e5d4f1" />
        <Text>Bebek bilgileri yükleniyor...</Text>
      </View>
    );
  }

  // If there is no selected baby (which also implies no babies exist for the user),
  // render a welcome message and a button to add a new baby.
  if (!selectedBaby) {
    console.log('🏠👶 HomeScreen: No selected baby. Prompting user to add one.');
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Hoş Geldiniz!</Text>
        <Text style={styles.subtitle}>
          Başlamak için lütfen bir bebek profili ekleyin.
        </Text>
        <Button
          title="Bebek Ekle"
          onPress={() => {
            console.log("🏠➡️ HomeScreen: 'Bebek Ekle' button pressed. Navigating to AddBaby screen.");
            // Navigate to the 'AddBaby' screen, which is part of the root stack.
            navigation.navigate('AddBaby');
          }}
        />
      </View>
    );
  }

  // If a baby is selected, render the main dashboard view.
  console.log(`🏠👍 HomeScreen: Displaying dashboard for baby: ${selectedBaby.name}.`);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ana Sayfa</Text>
      <Text style={styles.subtitle}>Aktif Bebek: {selectedBaby.name}</Text>
      {/* 
        This is the main content area for the dashboard.
        You can add components here to show summaries of sleep, feeding, etc.
      */}
    </View>
  );
};

// --- Styles ---
// Using StyleSheet.create for performance optimizations.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
});

export default HomeScreen;
