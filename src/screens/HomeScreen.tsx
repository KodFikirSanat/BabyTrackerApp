// src/screens/HomeScreen.tsx

/**
 * @file The main screen of the app, displaying a swipeable carousel of baby profiles
 * and an option to add a new baby at the end.
 *
 * @format
 */

import React, {useState} from 'react';
import {View, StyleSheet, FlatList, Dimensions, Text} from 'react-native';
import {useBaby, Baby} from '../context/BabyContext';
import BabyCard from '../components/BabyCard';
import AddBabyCard from '../components/AddBabyCard'; // Import the new card

const {width: screenWidth} = Dimensions.get('window');

// A special object to identify the "Add Baby" card in our list
const ADD_BABY_ITEM = {id: 'add_baby_card', name: 'Add Baby'};

const HomeScreen = () => {
  const {babies, loading} = useBaby();
  const [currentIndex, setCurrentIndex] = useState(0);

  // We create a new data source that includes the real babies plus our special item.
  // The type is broadened to include our special object's shape.
  const listData: (Baby | typeof ADD_BABY_ITEM)[] = [...babies, ADD_BABY_ITEM];

  const renderItem = ({item, index}: {item: Baby | typeof ADD_BABY_ITEM; index: number}) => {
    const pagination = { activeIndex: currentIndex, count: listData.length };
    return (
      <View style={styles.cardContainer}>
        {item.id === 'add_baby_card' ? (
          <AddBabyCard pagination={pagination} />
        ) : (
          <BabyCard baby={item as Baby} pagination={pagination} />
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading babies...</Text>
      </View>
    );
  }

  // No need for the "no babies found" message anymore, as the "Add" card will always be there.

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={screenWidth}
        snapToAlignment="center"
        contentContainerStyle={styles.listContentContainer}
        onMomentumScrollEnd={e => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / screenWidth,
          );
          setCurrentIndex(index);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    justifyContent: 'center',
  },
  listContentContainer: {
    alignItems: 'center',
  },
  cardContainer: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
