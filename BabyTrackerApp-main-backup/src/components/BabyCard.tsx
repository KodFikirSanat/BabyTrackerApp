// src/components/BabyCard.tsx

/**
 * @file An "intelligent" component that displays a summary for a single baby.
 * It fetches and displays the latest log entries for key metrics itself.
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Baby} from '../context/BabyContext'; // Correct import for Baby type
import {Category} from '../types/log';
import {RootStackParamList, MainTabParamList} from '../types/navigation';
import {Svg, Path} from 'react-native-svg';

// --- Default Icons & Types ---
const DefaultProfileIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 24 24">
    <Path
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      fill="#a9a9a9"
    />
  </Svg>
);

type BabyCardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface BabyCardProps {
  baby: Baby;
}

// --- Main Component ---
const BabyCard: React.FC<BabyCardProps> = ({baby}) => {
  const navigation = useNavigation<BabyCardNavigationProp>();

  // State to hold the latest values for each metric
  const [latestWeight, setLatestWeight] = useState<string | null>(null);
  const [latestHeight, setLatestHeight] = useState<string | null>(null);
  const [latestVaccine, setLatestVaccine] = useState<string | null>(null);
  const [latestDoctorVisit, setLatestDoctorVisit] = useState<string | null>(null);

  // Loading state for each metric
  const [loadingStates, setLoadingStates] = useState({
    weight: true,
    height: true,
    vaccine: true,
    doctor: true,
  });

  // This effect hook fetches the latest log for each metric.
  useEffect(() => {
    // Reset states when baby changes
    setLoadingStates({ weight: true, height: true, vaccine: true, doctor: true });
    setLatestWeight(null); setLatestHeight(null); setLatestVaccine(null); setLatestDoctorVisit(null);
    
    const fetchLatestLog = (
      collection: string,
      type: string,
      setter: (value: string | null) => void,
      loaderKey: keyof typeof loadingStates
    ) => {
      return firestore()
        .collection('babies').doc(baby.id).collection(collection)
        .where('type', '==', type)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .onSnapshot(snapshot => {
          if (!snapshot.empty) {
            const docData = snapshot.docs[0].data();
            if(type === 'weight') setter(`${docData.value} kg`);
            else if (type === 'height') setter(`${docData.value} cm`);
            else setter(docData.eventName);
          } else {
            setter('Kayıt Yok');
          }
          setLoadingStates(prev => ({ ...prev, [loaderKey]: false }));
        },_ => setLoadingStates(prev => ({ ...prev, [loaderKey]: false })));
    };

    const unsubscribers = [
      fetchLatestLog('developmentLogs', 'weight', setLatestWeight, 'weight'),
      fetchLatestLog('developmentLogs', 'height', setLatestHeight, 'height'),
      fetchLatestLog('healthLogs', 'vaccination', setLatestVaccine, 'vaccine'),
      fetchLatestLog('healthLogs', 'doctor_visit', setLatestDoctorVisit, 'doctor'),
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, [baby]);

  const calculateAge = (dateOfBirth: Date): string => {
    const today = new Date();
    let ageInMonths = (today.getFullYear() - dateOfBirth.getFullYear()) * 12 + (today.getMonth() - dateOfBirth.getMonth());
    if (today.getDate() < dateOfBirth.getDate()) ageInMonths--;
    if (ageInMonths < 1) return 'Yenidoğan';
    if (ageInMonths < 24) return `${ageInMonths} Aylık`;
    return `${Math.floor(ageInMonths / 12)} Yaşında`;
  };

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
      
      <View style={styles.metricsGrid}>
        <MetricDisplayButton
          label="Kilo"
          value={latestWeight}
          isLoading={loadingStates.weight}
          onPress={() => handleMetricPress('development')}
        />
        <MetricDisplayButton
          label="Boy"
          value={latestHeight}
          isLoading={loadingStates.height}
          onPress={() => handleMetricPress('development')}
        />
        <MetricDisplayButton
          label="Aşı"
          value={latestVaccine}
          isLoading={loadingStates.vaccine}
          onPress={() => handleMetricPress('health')}
        />
        <MetricDisplayButton
          label="Doktor"
          value={latestDoctorVisit}
          isLoading={loadingStates.doctor}
          onPress={() => handleMetricPress('health')}
        />
      </View>
    </View>
  );
};

// --- Sub-component for the new metric display buttons ---
interface MetricDisplayButtonProps {
  label: string;
  value: string | null;
  isLoading: boolean;
  onPress: () => void;
}
const MetricDisplayButton: React.FC<MetricDisplayButtonProps> = ({ label, value, isLoading, onPress }) => (
    <TouchableOpacity style={styles.metricButton} onPress={onPress}>
        <Text style={styles.metricValue} numberOfLines={1}>
            {isLoading ? <ActivityIndicator size="small" /> : value}
        </Text>
        <Text style={styles.metricLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 5,
    width: '90%',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  age: {
    fontSize: 18,
    color: '#666',
    marginBottom: 25,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  metricButton: {
    width: '45%',
    aspectRatio: 1.2,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '2.5%',
    padding: 10,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    height: 24, // Give a fixed height to prevent layout shifts
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 14,
    color: '#555',
  },
});

export default BabyCard;
