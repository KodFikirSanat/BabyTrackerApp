
// src/screens/GuideDetailScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';

type GuideDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'GuideDetail'
>;

type Props = {
  route: GuideDetailScreenRouteProp;
};

const GuideDetailScreen = ({route}: Props) => {
  const {guide} = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {guide.imageUrl && (
          <Image source={{uri: guide.imageUrl}} style={styles.image} />
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{guide.title}</Text>
          <Text style={styles.content}>{guide.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

export default GuideDetailScreen;
