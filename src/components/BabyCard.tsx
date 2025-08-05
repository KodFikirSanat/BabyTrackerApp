// src/components/BabyCard.tsx

/**
 * @file A component that displays a summary card for a single baby.
 * It shows the baby's info and provides navigation to tracking categories.
 *
 * @format
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Baby} from '../context/BabyContext';
import {Category} from '../types/log';
import {RootStackParamList, MainTabParamList} from '../types/navigation';
import {Svg, Path} from 'react-native-svg';

// A placeholder for the baby's profile picture
const DefaultProfileIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 24 24">
    <Path
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      fill="#a9a9a9"
    />
  </Svg>
);

// Type for the combined navigation props to allow navigating from a Tab to a Stack screen
type BabyCardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface BabyCardProps {
  baby: Baby;
}

const BabyCard: React.FC<BabyCardProps> = ({baby}) => {
  const navigation = useNavigation<BabyCardNavigationProp>();

  // Function to calculate age in a user-friendly format
  const calculateAge = (dateOfBirth: Date): string => {
    const today = new Date();
    let ageInMonths = (today.getFullYear() - dateOfBirth.getFullYear()) * 12 + (today.getMonth() - dateOfBirth.getMonth());
    if (today.getDate() < dateOfBirth.getDate()) {
        ageInMonths--;
    }
    if (ageInMonths < 1) return 'Yenidoğan';
    if (ageInMonths < 24) return `${ageInMonths} Aylık`;
    return `${Math.floor(ageInMonths / 12)} Yaşında`;
  };

  // Handles navigation to the Tracking screen with the correct parameters
  const handleMetricPress = (initialCategory: Category) => {
    navigation.navigate('MainTabs', {
        screen: 'Tracking',
        params: { babyId: baby.id, initialCategory },
    });
  };

  const genderColor = baby.gender === 'male' ? '#ADD8E6' : '#FFC0CB';

  return (
    <View style={styles.card}>
      <View style={[styles.profilePicCircle, {borderColor: genderColor}]}>
        <DefaultProfileIcon />
      </View>
      <Text style={styles.name}>{baby.name}</Text>
      <Text style={styles.age}>{calculateAge(baby.dateOfBirth.toDate())}</Text>
      <View style={styles.metricsContainer}>
        <TouchableOpacity style={styles.metricButton} onPress={() => handleMetricPress('development')}>
          <Text style={styles.metricText}>Kilo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.metricButton} onPress={() => handleMetricPress('development')}>
          <Text style={styles.metricText}>Boy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.metricButton} onPress={() => handleMetricPress('health')}>
          <Text style={styles.metricText}>Aşı</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.metricButton} onPress={() => handleMetricPress('health')}>
          <Text style={styles.metricText}>Doktor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profilePicCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  age: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  metricButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  metricText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default BabyCard;
