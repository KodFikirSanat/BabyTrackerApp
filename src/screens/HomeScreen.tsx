// src/screens/HomeScreen.tsx

/**
 * @file Defines the HomeScreen, the primary dashboard for the user.
 * This screen provides a summary of the baby's status and quick access
 * to primary functions. If no baby is found, it prompts the user to add one.
 *
 * @format
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Button, ActivityIndicator} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainTabParamList, RootStackParamList} from '../types/navigation';
import {useBaby} from '../context/BabyContext';

/**
 * Type definition for the Home screen's navigation props, combining
 * BottomTab and NativeStack props for full navigation capabilities.
 */
type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const HomeScreen = ({navigation}: HomeScreenProps): React.JSX.Element => {
  const {babies, selectedBaby, loading} = useBaby();
  console.log('🏠🎨 HomeScreen: Rendering...');

  // Effect to navigate to AddBaby screen if no babies exist after loading.
  useEffect(() => {
    if (!loading && babies.length === 0) {
      console.log('🏠👶 HomeScreen: No babies found, navigating to AddBaby screen.');
      navigation.navigate('AddBaby');
    }
  }, [loading, babies, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e5d4f1" />
        <Text>Bebek bilgileri yükleniyor...</Text>
      </View>
    );
  }

  if (!selectedBaby) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Hoş Geldiniz!</Text>
        <Text style={styles.subtitle}>
          Başlamak için lütfen bir bebek profili ekleyin.
        </Text>
        <Button
          title="Bebek Ekle"
          onPress={() => navigation.navigate('AddBaby')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ana Sayfa</Text>
      <Text style={styles.subtitle}>Aktif Bebek: {selectedBaby.name}</Text>
      {/* Dashboard features can be added here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
});

export default HomeScreen;
