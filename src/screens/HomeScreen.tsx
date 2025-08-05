// src/screens/HomeScreen.tsx

/**
 * @file The main screen of the app, displaying a swipeable list of baby profiles.
 *
 * @format
 */

import React from 'react';
import {View, StyleSheet, FlatList, Dimensions, Text} from 'react-native';
import {useBaby, Baby} from '../context/BabyContext';
import BabyCard from '../components/BabyCard';

const {width: screenWidth} = Dimensions.get('window');

const HomeScreen = () => {
  const {babies, loading} = useBaby();

  const renderItem = ({item}: {item: Baby}) => (
    // The container for each card needs to have the width of the screen for paging to work correctly
    <View style={styles.cardContainer}>
      <BabyCard baby={item} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading babies...</Text>
      </View>
    );
  }

  if (babies.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No babies found. Please add a baby from the profile screen.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={babies}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        // The following properties improve the snapping behavior on both platforms
        decelerationRate="fast"
        snapToInterval={screenWidth}
        snapToAlignment="center"
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7', // A neutral background color for the screen
    justifyContent: 'center',
  },
  listContentContainer: {
    alignItems: 'center', // Center the cards vertically in the FlatList
  },
  cardContainer: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // Provides some horizontal space if card is not full-width
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
