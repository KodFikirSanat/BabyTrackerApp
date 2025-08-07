// src/components/AddBabyCard.tsx

/**
 * @file A card component that provides a button to add a new baby.
 * It's designed to be displayed at the end of the baby list in HomeScreen.
 *
 * @format
 */

import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, MainTabParamList} from '../types/navigation';
import {Svg, Path} from 'react-native-svg';

// A large plus icon
const PlusIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 24 24">
    <Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#a9a9a9" />
  </Svg>
);

// Type for the combined navigation props
type AddBabyCardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const AddBabyCard: React.FC = () => {
  const navigation = useNavigation<AddBabyCardNavigationProp>();

  const handlePress = () => {
    navigation.navigate('AddBaby');
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <PlusIcon />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center', // Center the plus icon
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 5,
    width: '90%',
    // Ensure it has a similar height to BabyCard by setting a minHeight or a fixed height
    // This uses aspect ratio to maintain a similar shape to BabyCard
    aspectRatio: 1 / 1.6, // Approximate aspect ratio from BabyCard
    maxHeight: 500, // A reasonable max height
  },
});

export default AddBabyCard;
